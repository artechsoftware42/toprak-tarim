// Reads credentials locally; never prints URI, passwords, or raw driver errors.
const { loadEnvConfig } = require('@next/env');
const { MongoClient } = require('mongodb');
const seed = require('../data/site-chrome.seed.json');
loadEnvConfig(process.cwd());
const write = process.argv.includes('--apply');
const syncCorporateLinks = process.argv.includes('--sync-corporate-links');
const syncNavigationLinks = process.argv.includes('--sync-navigation-links');
const uri = process.env.MONGODB_URI;
const database = process.env.MONGODB_DB;
if (!uri || database !== 'toprak-tarim') {
  console.error('Missing URI or database is not the authorized target: toprak-tarim');
  process.exit(1);
}
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, maxPoolSize: 2 });
(async () => {
  try {
    await client.connect();
    const collection = client.db(database).collection('site_content');
    const existing = await collection.countDocuments({siteKey:'headerFooter'});
    console.log(JSON.stringify({connected:true,database,collection:'site_content',siteKey:'headerFooter',existing}));
    if (!write) return;
    if (existing > 1) throw Object.assign(new Error(), {code:'DUPLICATE_SITE_KEYS'});
    await collection.createIndex({siteKey:1}, {name:'unique_site_content_key',unique:true,partialFilterExpression:{siteKey:{$eq:'headerFooter'}}});
    const corporate = seed.navigation.find(item=>item.key==='corporate');
    const activities = seed.navigation.find(item=>item.key==='activities');
    const home = seed.navigation.find(item=>item.key==='home');
    const contact = seed.navigation.find(item=>item.key==='contact');
    const result = syncNavigationLinks
      ? await collection.updateOne(
          {siteKey:'headerFooter'},
          {$set:{
            'navigation.0.href':home.href,
            'navigation.1.href':corporate.href,
            'navigation.1.children.0.href':corporate.children[0].href,
            'navigation.1.children.1.href':corporate.children[1].href,
            'navigation.1.children.2.href':corporate.children[2].href,
            'navigation.2.href':activities.href,
            'navigation.2.children.0.href':activities.children[0].href,
            'navigation.2.children.1.href':activities.children[1].href,
            'navigation.3.href':contact.href,
            'footer.legalLinks.0.href':seed.footer.legalLinks[0].href,
            'footer.legalLinks.1.href':seed.footer.legalLinks[1].href,
            'footer.legalLinks.2.href':seed.footer.legalLinks[2].href,
          }},
          {upsert:false},
        )
      : syncCorporateLinks
      ? await collection.updateOne(
          {siteKey:'headerFooter'},
          {$set:{
            'navigation.1.href':corporate.href,
            'navigation.1.children.0.href':corporate.children[0].href,
            'navigation.1.children.1.href':corporate.children[1].href,
            'navigation.1.children.2.href':corporate.children[2].href,
          }},
          {upsert:false},
        )
      : await collection.updateOne({siteKey:'headerFooter'}, {$setOnInsert:seed}, {upsert:true});
    const saved = await collection.findOne({siteKey:'headerFooter'});
    const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
    const filename=path.resolve('src/features/site-chrome/model.ts');
    const compiled=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,resolveJsonModule:true}}).outputText;
    const model=new Module(filename,module);model.filename=filename;model.paths=module.paths;model._compile(compiled,filename);
    const valid=!!model.exports.validateSiteChrome(saved);
    console.log(JSON.stringify({inserted:result.upsertedCount,matched:result.matchedCount,modified:result.modifiedCount,navigationLinksSynced:syncNavigationLinks,corporateLinksSynced:syncCorporateLinks,valid}));
    if (!valid) process.exitCode=1;
  } catch (error) {
    console.error(JSON.stringify({connected:false,errorType:error.name,code:error.code||error.cause?.code||null,authenticationFailed:error.code===18,networkOrSelectionFailure:/Network|Selection/.test(error.name)}));
    process.exitCode=1;
  } finally { await client.close(); }
})();
