export type ProductLocale = "tr" | "en";

export type ManagedProductCopy = {
  name: string;
  description: string;
  category: string;
  kicker: string;
  eyebrow: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionText: string;
  whiteTitle: string;
  whiteText: string;
  usageValue: string;
  usageDescription: string;
  sowingValue: string;
  sowingDescription: string;
  harvestValue: string;
  harvestDescription: string;
  characterValue: string;
  characterDescription: string;
  highlights: string[];
};

export type ManagedProduct = {
  id: string;
  slug: { tr: string; en: string };
  copy: Record<ProductLocale, ManagedProductCopy>;
  media: { cardUrl: string | null; detailUrl: string | null };
  order: number;
  createdAt: string;
  updatedAt: string;
};

const copyKeys = [
  "name", "description", "category", "kicker", "eyebrow", "sectionLabel", "sectionTitle", "sectionText",
  "whiteTitle", "whiteText", "usageValue", "usageDescription", "sowingValue", "sowingDescription",
  "harvestValue", "harvestDescription", "characterValue", "characterDescription", "highlights",
] as const;

const safeText = (value: unknown, max: number) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
const safeSlug = (value: unknown) => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80;
const safeMedia = (value: unknown) => value === null || (typeof value === "string" && (/^\/api\/media\/[0-9a-f]{24}$/.test(value) || /^https:\/\//.test(value)) && value.length <= 1000);

function validCopy(value: unknown): value is ManagedProductCopy {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).length !== copyKeys.length || copyKeys.some(key => !(key in record))) return false;
  if (!Array.isArray(record.highlights) || record.highlights.length !== 4 || record.highlights.some(item => !safeText(item, 180))) return false;
  return copyKeys.filter(key => key !== "highlights").every(key => safeText(record[key], key.includes("Text") || key.includes("Description") || key === "description" ? 1200 : 240));
}

export function validateManagedProduct(value: unknown): ManagedProduct | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const slug = record.slug as Record<string, unknown> | undefined;
  const copy = record.copy as Record<string, unknown> | undefined;
  const media = record.media as Record<string, unknown> | undefined;
  if (!safeText(record.id, 80) || !slug || !safeSlug(slug.tr) || !safeSlug(slug.en)) return null;
  if (!copy || !validCopy(copy.tr) || !validCopy(copy.en)) return null;
  if (!media || !safeMedia(media.cardUrl) || !safeMedia(media.detailUrl)) return null;
  if (!Number.isInteger(record.order) || Number(record.order) < 0 || Number(record.order) > 10_000) return null;
  if (typeof record.createdAt !== "string" || typeof record.updatedAt !== "string") return null;
  return {
    id: record.id as string,
    slug: { tr: slug.tr as string, en: slug.en as string },
    copy: { tr: copy.tr, en: copy.en } as Record<ProductLocale, ManagedProductCopy>,
    media: { cardUrl: media.cardUrl as string | null, detailUrl: media.detailUrl as string | null },
    order: record.order as number,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function createDefaultManagedProduct(id: string, order: number): ManagedProduct {
  const now = new Date().toISOString();
  const suffix = id.slice(-6).toLowerCase();
  const tr: ManagedProductCopy = {
    name: "Yeni Ürün", description: "Ürünün kısa tanıtım metnini buraya yazın.", category: "Tarım Ürünü",
    kicker: "Toprak Tarım ürünü", eyebrow: "Kaliteli üretim", sectionLabel: "Ürün hakkında",
    sectionTitle: "Yeni ürünümüzü yakından tanıyın.", sectionText: "Ürünün yetiştirilme süreci, kalitesi ve kullanım alanları hakkında açıklamayı buraya yazın.",
    whiteTitle: "Topraktan gelen kaliteyi güvenilir üretimle buluşturuyoruz.", whiteText: "Ürünün üretim yaklaşımını ve sağladığı faydaları anlatan metni buraya yazın.",
    usageValue: "Çeşitli kullanım alanları", usageDescription: "Ürünün kullanım alanlarını açıklayın.",
    sowingValue: "Uygun ekim dönemi", sowingDescription: "Ekim dönemini ve koşullarını açıklayın.",
    harvestValue: "Uygun hasat dönemi", harvestDescription: "Hasat sürecini açıklayın.",
    characterValue: "Özenle seçilmiş", characterDescription: "Ürünün öne çıkan niteliğini açıklayın.",
    highlights: ["Kaliteli ürün", "Güvenilir tedarik", "Kontrollü süreç", "Sürdürülebilir yaklaşım"],
  };
  const en: ManagedProductCopy = {
    name: "New Product", description: "Write a short introduction for the product here.", category: "Agricultural Product",
    kicker: "Toprak Tarım product", eyebrow: "Quality production", sectionLabel: "About the product",
    sectionTitle: "Discover our new product.", sectionText: "Describe the growing process, quality and uses of the product here.",
    whiteTitle: "We combine quality from the soil with reliable production.", whiteText: "Describe the production approach and benefits of the product here.",
    usageValue: "Multiple uses", usageDescription: "Describe the product's uses.",
    sowingValue: "Suitable sowing period", sowingDescription: "Describe the sowing period and conditions.",
    harvestValue: "Suitable harvest period", harvestDescription: "Describe the harvest process.",
    characterValue: "Carefully selected", characterDescription: "Describe the product's main characteristic.",
    highlights: ["Quality product", "Reliable supply", "Controlled process", "Sustainable approach"],
  };
  return { id, slug: { tr: `yeni-urun-${suffix}`, en: `new-product-${suffix}` }, copy: { tr, en }, media: { cardUrl: null, detailUrl: null }, order, createdAt: now, updatedAt: now };
}
