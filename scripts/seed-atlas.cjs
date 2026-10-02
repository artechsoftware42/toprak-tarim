// Reads credentials locally; never prints URI, passwords, or raw driver errors.
const { loadEnvConfig } = require('@next/env');
const { MongoClient } = require('mongodb');
const seed = [...require('../data/home-sections.seed.json'), require('../data/about-page.seed.json'), require('../data/activity-page.seed.json')];
loadEnvConfig(process.cwd());
const write = process.argv.includes('--apply');
const direct = process.argv.includes('--direct');
const uri = process.env[direct ? 'MONGODB_URI_TEST' : 'MONGODB_URI'];
const database = process.env.MONGODB_DB;
if (!uri || database !== 'toprak-tarim') {
  console.error('Missing URI or database is not the authorized target: toprak-tarim');
  process.exit(1);
}
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, maxPoolSize: 2 });
(async () => {
  try {
    await client.connect();
    const db = client.db(database);
    await db.command({ ping: 1 });
    const collection = db.collection('home_sections');
    const keys = seed.map(doc => doc.pageKey);
    const existing = await collection.find({pageKey: {$in: keys}}).toArray();
    console.log(JSON.stringify({connected:true,database,collection:'home_sections',connectionType:direct?'standard':'srv',existing:keys.map(pageKey=>({pageKey,count:existing.filter(doc=>doc.pageKey===pageKey).length}))}));
    if (!write) return;
    if (keys.some(key => existing.filter(doc => doc.pageKey === key).length > 1)) throw Object.assign(new Error(), {code:'DUPLICATE_PAGE_KEYS'});
    // Partial index leaves unrelated documents in the same collection alone.
    await collection.createIndex({pageKey:1}, {name:'unique_content_page_key_v5',unique:true,partialFilterExpression:{pageKey:{$in:keys}}});
    const result = await collection.bulkWrite(seed.map(doc=>({updateOne:{filter:{pageKey:doc.pageKey},update:{$setOnInsert:doc},upsert:true}})), {ordered:true});
    const saved = await collection.find({pageKey:{$in:keys}}).toArray();
    const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
    const filename=path.resolve('src/features/home/content/model.ts');
    const compiled=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
    const model=new Module(filename,module);model.filename=filename;model.paths=module.paths;model._compile(compiled,filename);
    const verification=keys.map(pageKey=>{const matches=saved.filter(doc=>doc.pageKey===pageKey);return {pageKey,valid:matches.length===1&&!!model.exports.validateSection(matches[0],pageKey)};});
    console.log(JSON.stringify({inserted:result.upsertedCount,existingPreserved:result.matchedCount,modified:result.modifiedCount,verification}));
    if(verification.some(item=>!item.valid)) process.exitCode=1;
  } catch (error) {
    console.error(JSON.stringify({connected:false,errorType:error.name,code:error.code||error.cause?.code||null,authenticationFailed:error.code===18,networkOrSelectionFailure:/Network|Selection/.test(error.name)}));
    process.exitCode=1;
  } finally { await client.close(); }
})();
