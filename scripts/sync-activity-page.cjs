// Extends selected content documents to the current schema while preserving saved text and media URLs.
const { loadEnvConfig } = require('@next/env');
const { MongoClient } = require('mongodb');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const homeSeeds = require('../data/home-sections.seed.json');
const seeds = [
  require('../data/activity-page.seed.json'),
  require('../data/about-page.seed.json'),
  homeSeeds.find(section => section.pageKey === 'hero'),
  homeSeeds.find(section => section.pageKey === 'contact'),
];

loadEnvConfig(process.cwd());
const uri = process.env.MONGODB_URI;
const database = process.env.MONGODB_DB;
if (!uri || database !== 'toprak-tarim') {
  console.error('Missing URI or database is not the authorized target: toprak-tarim');
  process.exit(1);
}

const filename = path.resolve('src/features/home/content/model.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,resolveJsonModule:true}}).outputText;
const model = new Module(filename, module);
model.filename = filename;
model.paths = module.paths;
model._compile(compiled, filename);
for (const seed of seeds) if (!model.exports.validateSection(seed, seed.pageKey)) {
  console.error(JSON.stringify({updated:false,reason:'LOCAL_SEED_INVALID',pageKey:seed.pageKey}));
  process.exit(1);
}

const client = new MongoClient(uri, {serverSelectionTimeoutMS:10000,connectTimeoutMS:10000,maxPoolSize:2});
(async () => {
  try {
    await client.connect();
    const collection = client.db(database).collection('home_sections');
    const results = [];
    for (const seed of seeds) {
      const existing = await collection.findOne({pageKey:seed.pageKey});
      if (!existing) { results.push({pageKey:seed.pageKey,matched:0,modified:0,valid:false}); process.exitCode = 1; continue; }
      const merged = structuredClone(seed);
      if (existing.displayName && typeof existing.displayName.tr === 'string' && typeof existing.displayName.en === 'string') merged.displayName = existing.displayName;
      for (const locale of ['tr','en']) for (const field of Object.keys(merged.content[locale])) {
        if (Array.isArray(existing.content?.[locale]?.[field])) merged.content[locale][field] = existing.content[locale][field];
      }
      for (const slot of Object.keys(merged.media || {})) {
        const url = existing.media?.[slot]?.externalUrl;
        if (typeof url === 'string' || url === null) merged.media[slot].externalUrl = url;
      }
      if (!model.exports.validateSection(merged, seed.pageKey)) { results.push({pageKey:seed.pageKey,matched:1,modified:0,valid:false}); process.exitCode = 1; continue; }
      const result = await collection.replaceOne({pageKey:seed.pageKey}, merged);
      const saved = await collection.findOne({pageKey:seed.pageKey});
      const valid = result.matchedCount === 1 && !!model.exports.validateSection(saved, seed.pageKey);
      results.push({pageKey:seed.pageKey,matched:result.matchedCount,modified:result.modifiedCount,valid});
      if (!valid) process.exitCode = 1;
    }
    console.log(JSON.stringify({database,collection:'home_sections',results}));
  } catch (error) {
    console.error(JSON.stringify({updated:false,errorType:error.name,code:error.code||error.cause?.code||null}));
    process.exitCode = 1;
  } finally {
    await client.close();
  }
})();
