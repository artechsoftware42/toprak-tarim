const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const filename = path.resolve('src/features/site-chrome/model.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,resolveJsonModule:true}}).outputText;
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = module.paths;
loaded._compile(compiled, filename);
const {defaultSiteChrome, validateSiteChrome} = loaded.exports;
const copy = value => JSON.parse(JSON.stringify(value));
assert.ok(validateSiteChrome(defaultSiteChrome));
assert.equal(defaultSiteChrome.navigation.length, 4);
assert.deepEqual(defaultSiteChrome.navigation.find(item=>item.key==='activities').children.map(child=>child.href), ['/faaliyetler#uretim','/faaliyetler#urunler']);
for (const item of defaultSiteChrome.navigation) {
  assert.ok(item.label.tr && item.label.en);
  for (const child of item.children) assert.ok(child.label.tr && child.label.en);
}
let changed = copy(defaultSiteChrome);
changed.navigation[1].label.tr = 'Şirket';
changed.navigation[1].label.en = 'Company';
assert.ok(validateSiteChrome(changed));
changed = copy(defaultSiteChrome); changed.navigation[1].href = '/about'; assert.equal(validateSiteChrome(changed), null);
changed = copy(defaultSiteChrome); changed.footer.legalLinks[0].href = 'javascript:alert(1)'; assert.equal(validateSiteChrome(changed), null);
changed = copy(defaultSiteChrome); changed.navigation.push(changed.navigation[0]); assert.equal(validateSiteChrome(changed), null);
console.log('PASS: shared Header/Footer TR/EN content, fixed routes, exact navigation and safe fallback shape');
