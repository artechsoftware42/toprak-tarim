import seed from "../../../data/site-chrome.seed.json";

export type SiteLocale = "tr" | "en";
export type LocalizedText = Record<SiteLocale, string>;
export type SiteNavChild = { key: string; href: string; label: LocalizedText };
export type SiteNavItem = SiteNavChild & { description?: LocalizedText; children: SiteNavChild[] };
export type SiteChrome = {
  siteKey: "headerFooter";
  schemaVersion: 1;
  brand: { logoAlt: LocalizedText; homeAria: LocalizedText; tagline: LocalizedText; marquee: Record<SiteLocale, string[]> };
  navigation: SiteNavItem[];
  contact: {
    email: { label: LocalizedText; display: string; href: string };
    phone: { label: LocalizedText; display: string; href: string };
    address: { label: LocalizedText; display: LocalizedText; href: string };
  };
  socials: { key: string; label: string; href: string }[];
  footer: {
    legalLabel: LocalizedText;
    legalLinks: { key: string; href: string; label: LocalizedText }[];
    copyright: LocalizedText;
    developedBy: LocalizedText;
  };
};

export const defaultSiteChrome = seed as SiteChrome;

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const exactKeys = (value: Record<string, unknown>, baseline: object) => Object.keys(value).sort().join("|") === Object.keys(baseline).sort().join("|");
const safeText = (value: unknown, max = 1000): value is string => typeof value === "string" && Boolean(value.trim()) && value.length <= max;
const localized = (value: unknown, max = 1000): value is LocalizedText => object(value) && exactKeys(value, { tr: "", en: "" }) && safeText(value.tr, max) && safeText(value.en, max);

function fixedLinkList(value: unknown, baseline: Array<{ key: string; href: string }>) {
  if (!Array.isArray(value) || value.length !== baseline.length) return false;
  return value.every((item, index) => object(item) && item.key === baseline[index].key && item.href === baseline[index].href);
}

export function validateSiteChrome(value: unknown): SiteChrome | null {
  if (!object(value) || value.siteKey !== "headerFooter" || value.schemaVersion !== 1) return null;
  if (Object.keys(value).some(key => !["_id", "siteKey", "schemaVersion", "brand", "navigation", "contact", "socials", "footer"].includes(key))) return null;
  const baseline = defaultSiteChrome;
  if (!object(value.brand) || !exactKeys(value.brand, baseline.brand)) return null;
  if (!localized(value.brand.logoAlt, 160) || !localized(value.brand.homeAria, 160) || !localized(value.brand.tagline, 1200)) return null;
  if (!object(value.brand.marquee) || !exactKeys(value.brand.marquee, baseline.brand.marquee)) return null;
  for (const locale of ["tr", "en"] as const) {
    const items = value.brand.marquee[locale];
    if (!Array.isArray(items) || items.length !== baseline.brand.marquee[locale].length || !items.every(item => safeText(item, 80))) return null;
  }
  if (!fixedLinkList(value.navigation, baseline.navigation)) return null;
  for (let index = 0; index < baseline.navigation.length; index++) {
    const item = (value.navigation as Record<string, unknown>[])[index];
    const expected = baseline.navigation[index];
    if (!exactKeys(item, expected) || !localized(item.label, 120)) return null;
    if (expected.description && !localized(item.description, 500)) return null;
    if (!fixedLinkList(item.children, expected.children)) return null;
    for (let childIndex = 0; childIndex < expected.children.length; childIndex++) {
      const child = (item.children as Record<string, unknown>[])[childIndex];
      if (!exactKeys(child, expected.children[childIndex]) || !localized(child.label, 120)) return null;
    }
  }
  if (!object(value.contact) || !exactKeys(value.contact, baseline.contact)) return null;
  for (const key of ["email", "phone"] as const) {
    const entry = value.contact[key];
    const expected = baseline.contact[key];
    if (!object(entry) || !exactKeys(entry, expected) || !localized(entry.label, 80) || !safeText(entry.display, 240) || entry.href !== expected.href) return null;
  }
  const address = value.contact.address;
  if (!object(address) || !exactKeys(address, baseline.contact.address) || !localized(address.label, 80) || !localized(address.display, 500) || address.href !== baseline.contact.address.href) return null;
  if (!fixedLinkList(value.socials, baseline.socials)) return null;
  for (let index = 0; index < baseline.socials.length; index++) {
    const social = (value.socials as Record<string, unknown>[])[index];
    if (!exactKeys(social, baseline.socials[index]) || !safeText(social.label, 80)) return null;
  }
  if (!object(value.footer) || !exactKeys(value.footer, baseline.footer) || !localized(value.footer.legalLabel, 80) || !localized(value.footer.copyright, 300) || !localized(value.footer.developedBy, 80)) return null;
  if (!fixedLinkList(value.footer.legalLinks, baseline.footer.legalLinks)) return null;
  for (let index = 0; index < baseline.footer.legalLinks.length; index++) {
    const link = (value.footer.legalLinks as Record<string, unknown>[])[index];
    if (!exactKeys(link, baseline.footer.legalLinks[index]) || !localized(link.label, 180)) return null;
  }
  return structuredClone(value) as SiteChrome;
}
