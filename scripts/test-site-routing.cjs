const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const sourcePath = path.join(process.cwd(), "src", "lib", "site-routing.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: sourcePath,
}).outputText;

const moduleRecord = { exports: {} };
vm.runInNewContext(compiled, {
  module: moduleRecord,
  exports: moduleRecord.exports,
  require,
}, { filename: sourcePath });

const {
  canonicalProductSlug,
  isActivitiesLandingPath,
  isProductDetailPath,
  localeFromPathname,
  localizedHref,
  localizedProductHref,
} = moduleRecord.exports;

assert.equal(localizedHref("/about#about-us", "tr"), "/hakkimizda#biz-kimiz");
assert.equal(localizedHref("/hakkimizda#vizyon", "en"), "/en/about#vision");
assert.equal(localizedHref("/about#mision", "en"), "/en/about#mission");
assert.equal(localizedHref("/activity#production", "tr"), "/faaliyetler#uretim");
assert.equal(localizedHref("/faaliyetler#urunler", "en"), "/en/activities#products");
assert.equal(localizedHref("/activity/misir", "en"), "/en/activities/corn");
assert.equal(localizedHref("/en/activities/wheat", "tr"), "/faaliyetler/bugday");
assert.equal(localizedProductHref("aycicegi", "en"), "/en/activities/sunflower");
assert.equal(localizedHref("/contact?from=footer", "tr"), "/iletisim?from=footer");
assert.equal(localizedHref("/cookie-policy", "en"), "/cookies");
assert.equal(localizedHref("mailto:info@example.com", "en"), "mailto:info@example.com");

assert.equal(localeFromPathname("/en/about"), "en");
assert.equal(localeFromPathname("/hakkimizda"), "tr");
assert.equal(canonicalProductSlug("corn"), "misir");
assert.equal(isActivitiesLandingPath("/en/activities"), true);
assert.equal(isProductDetailPath("/faaliyetler/arpa"), true);
assert.equal(isProductDetailPath("/faaliyetler"), false);

console.log("PASS: localized pages, sections, product slugs and legacy route mappings");
