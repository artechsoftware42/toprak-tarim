import seed from "../../../../data/home-sections.seed.json";
import aboutPageSeed from "../../../../data/about-page.seed.json";
import activityPageSeed from "../../../../data/activity-page.seed.json";
import policy from "./field-policy.json";

export const pageKeys = ["hero", "about", "production", "contactCTA", "contact", "aboutPage", "activityPage"] as const;
export type PageKey = typeof pageKeys[number];
export type Locale = "tr" | "en";
export type TextRun = { text: string; bold?: boolean; italic?: boolean; color?: string };
export type RichText = TextRun[];
export type MediaReference = { localDefault: string; externalUrl: string | null };
export type HomeSection = {
  pageKey: PageKey;
  displayName: Record<Locale, string>;
  schemaVersion: 1;
  content: Record<Locale, Record<string, RichText>>;
  media?: Record<string, MediaReference>;
};
export const defaults = [...seed, aboutPageSeed, activityPageSeed] as unknown as HomeSection[];
export const plainText = (runs: RichText) => runs.map(run => run.text).join("");
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const sameKeys = (a: Record<string, unknown>, b: Record<string, unknown>) => Object.keys(a).sort().join("|") === Object.keys(b).sort().join("|");
const safeColor = /^(?:#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba\(\s*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(?:0(?:\.\d+)?|1(?:\.0+)?)\s*\))$/;

/** Reject unknown keys, unsafe styling, invalid media and edits to secondary headings.
 * Future admin writes must call this same validator; permissions are code-owned.
 */
export function validateSection(value: unknown, key: PageKey): HomeSection | null {
  if (!object(value) || value.pageKey !== key || value.schemaVersion !== 1) return null;
  if (Object.keys(value).some(k => !["_id", "pageKey", "displayName", "schemaVersion", "content", "media"].includes(k))) return null;
  const baseline = defaults.find(d => d.pageKey === key)!;
  if (!object(value.displayName) || !sameKeys(value.displayName, baseline.displayName) || !object(value.content) || !sameKeys(value.content, baseline.content)) return null;
  for (const locale of ["tr", "en"] as const) {
    const name = value.displayName[locale];
    if (typeof name !== "string" || !name.trim() || name.length > 120) return null;
    const fields = value.content[locale];
    if (!object(fields) || !sameKeys(fields, baseline.content[locale])) return null;
    for (const [field, runs] of Object.entries(fields)) {
      if (!Array.isArray(runs) || runs.length < 1 || runs.length > 100) return null;
      for (const run of runs) {
        if (!object(run) || Object.keys(run).some(k => !["text", "bold", "italic", "color"].includes(k))) return null;
        if (typeof run.text !== "string" || run.text.length > 5000) return null;
        if (run.bold !== undefined && typeof run.bold !== "boolean") return null;
        if (run.italic !== undefined && typeof run.italic !== "boolean") return null;
        if (run.color !== undefined && (typeof run.color !== "string" || !safeColor.test(run.color))) return null;
      }
      const rule = (policy[key] as Record<string, {textEditable: boolean}>)[field];
      if (!rule.textEditable && plainText(runs) !== plainText(baseline.content[locale][field])) return null;
      if (key === "contactCTA" && field === "email" && !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(plainText(runs))) return null;
      if (key === "contactCTA" && field === "phone" && !/^\+?[0-9 ()-]{5,40}$/.test(plainText(runs))) return null;
      if (key === "contact" && field.endsWith("_email") && !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(plainText(runs))) return null;
      if (key === "contact" && field.endsWith("_phone") && !/^\+?[0-9 ()-]{5,40}$/.test(plainText(runs))) return null;
    }
  }
  if (baseline.media) {
    if (!object(value.media) || !sameKeys(value.media, baseline.media)) return null;
    for (const [slot, media] of Object.entries(value.media)) {
      if (!object(media) || !sameKeys(media, baseline.media[slot]) || media.localDefault !== baseline.media[slot].localDefault) return null;
      if (media.externalUrl !== null) {
        if (typeof media.externalUrl !== "string" || media.externalUrl.length > 2048) return null;
        const internalMedia = /^\/api\/media\/[0-9a-f]{24}$/.test(media.externalUrl);
        if (!internalMedia) {
          try { const url = new URL(media.externalUrl); if (url.protocol !== "https:" || url.username || url.password) return null; } catch { return null; }
        }
      }
    }
  } else if (value.media !== undefined) return null;
  // Exclude MongoDB's BSON _id and any server-only metadata from client props.
  return { pageKey: key, schemaVersion: 1, displayName: value.displayName as HomeSection["displayName"], content: value.content as HomeSection["content"], ...(baseline.media ? {media: value.media as HomeSection["media"]} : {}) };
}
