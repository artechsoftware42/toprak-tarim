const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const filename = path.resolve('src/features/home/content/model.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = module.paths;
loaded._compile(compiled, filename);
const {defaults, validateSection, plainText} = loaded.exports;
const copy = value => JSON.parse(JSON.stringify(value));
assert.deepEqual(defaults.map(d=>d.pageKey).sort(), ['about','aboutPage','activityPage','contact','contactCTA','hero','production']);
for(const doc of defaults) assert.ok(validateSection(doc, doc.pageKey), doc.pageKey);
const about=defaults.find(d=>d.pageKey==='about');
let changed=copy(about);
changed.content.tr.topragin=[{text:'Yeni ',bold:true},{text:'başlık',italic:true,color:'#24734D'}];
assert.ok(validateSection(changed,'about'));
changed=copy(about);changed.content.tr.topragin=[{text:'Şeffaf',color:'rgba(36, 115, 77, 0.65)'}];assert.ok(validateSection(changed,'about'));
changed=copy(about);changed.content.tr.topragin=[{text:'Kısa hex',color:'#abc'}];assert.ok(validateSection(changed,'about'));
changed=copy(about);changed.content.tr.topragin=[{text:'Alpha hex',color:'#24734DCC'}];assert.ok(validateSection(changed,'about'));
changed=copy(about);changed.content.tr.topragin=[{text:'Geçersiz',color:'rgba(300, 0, 0, 1)'}];assert.equal(validateSection(changed,'about'),null);
changed.content.tr.deneyimi=[{text:'Başka alt başlık'}];
assert.equal(validateSection(changed,'about'),null);
changed=copy(about);
changed.content.tr.deneyimi=[{text:plainText(about.content.tr.deneyimi),bold:true}];
assert.ok(validateSection(changed,'about'));
for(const mutate of [
 d=>d.content.tr.topragin[0].color='url(javascript:alert(1))',
 d=>d.content.tr.topragin[0].html='<img onerror=alert(1)>',
 d=>d.content.en.extra=[{text:'Unexpected'}],
 d=>delete d.content.tr.topragin,
 d=>d.media.primary.externalUrl='javascript:alert(1)',
 d=>d.media.primary.localDefault='/changed.png',
 d=>d.path='/changed-route',
 d=>d.pageKey='activities',
]){changed=copy(about);mutate(changed);assert.equal(validateSection(changed,'about'),null);}
changed=copy(about);changed.media.primary.externalUrl='https://media.example.com/photo.png';assert.ok(validateSection(changed,'about'));
changed=copy(about);changed.media.primary.externalUrl='/api/media/0123456789abcdef01234567';assert.ok(validateSection(changed,'about'));
changed=copy(about);changed._id={secret:'not serialized'};assert.equal(validateSection(changed,'about')._id,undefined);
const production=defaults.find(d=>d.pageKey==='production');
assert.equal(production.media,undefined);
changed=copy(production);changed.content.tr.background_label=[{text:'DEĞİŞTİRİLDİ'}];assert.equal(validateSection(changed,'production'),null);
changed=copy(production);changed.content.tr.background_label=[{text:'ÜRETİM',bold:true,color:'#24734D'}];assert.ok(validateSection(changed,'production'));
changed=copy(production);changed.media={field:{localDefault:'/changed.png',externalUrl:null}};assert.equal(validateSection(changed,'production'),null);
const contact=defaults.find(d=>d.pageKey==='contact');
assert.equal(contact.media,undefined);
assert.ok(Object.keys(contact.content.tr).every(field=>contact.content.en[field]),'contact locale parity');
changed=copy(contact);changed.content.tr.office_email=[{text:'invalid-email'}];assert.equal(validateSection(changed,'contact'),null);
changed=copy(contact);changed.content.tr.factory_phone=[{text:'javascript:alert(1)'}];assert.equal(validateSection(changed,'contact'),null);
changed=copy(contact);changed.content.en.hero_title=[{text:'Contact us',color:'#1D6847'}];assert.ok(validateSection(changed,'contact'));
const aboutPage=defaults.find(d=>d.pageKey==='aboutPage');
assert.equal(aboutPage.media.hero.localDefault,'/hero3.png');
assert.ok(Object.keys(aboutPage.content.tr).every(field=>aboutPage.content.en[field]),'about page locale parity');
changed=copy(aboutPage);changed.content.en.vision_description=[{text:'A renewed vision',italic:true,color:'#1D6847'}];assert.ok(validateSection(changed,'aboutPage'));
const activityPage=defaults.find(d=>d.pageKey==='activityPage');
assert.ok(Object.keys(activityPage.content.tr).every(field=>activityPage.content.en[field]),'activity page locale parity');
changed=copy(activityPage);changed.content.en.intro_title_1=[{text:'We understand production',bold:true}];assert.ok(validateSection(changed,'activityPage'));
// Every static renderer reference must resolve in both languages.
for(const file of ['about/AboutSection','contact/ContactCTA','production/Production','activities/Activities','products/Products']){
 const source=fs.readFileSync('src/features/home/'+file+'.tsx','utf8');
 for(const match of source.matchAll(/<ContentText section="([^"]+)" field="([^"]+)"/g)){
  const doc=defaults.find(d=>d.pageKey===match[1]);
  for(const locale of ['tr','en'])assert.ok(doc.content[locale][match[2]],match[2]);
 }
}
console.log('PASS: seed, locale coverage, renderer fields, fixed headings/keys/routes, formatting, media safety and BSON exclusion');
