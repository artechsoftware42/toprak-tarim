export type ProductLocale = "tr" | "en";

export type ProductStoryItem = {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  note: string;
};

export type ManagedProductCopy = {
  name: string;
  description: string;
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
  storyItems?: ProductStoryItem[];
};

export type ManagedProduct = {
  id: string;
  categoryId: string;
  slug: { tr: string; en: string };
  copy: Record<ProductLocale, ManagedProductCopy>;
  media: { cardUrl: string | null; detailUrl: string | null };
  order: number;
  createdAt: string;
  updatedAt: string;
};

const copyKeys = [
  "name", "description", "kicker", "eyebrow", "sectionLabel", "sectionTitle", "sectionText",
  "whiteTitle", "whiteText", "usageValue", "usageDescription", "sowingValue", "sowingDescription",
  "harvestValue", "harvestDescription", "characterValue", "characterDescription", "highlights",
] as const;

const safeText = (value: unknown, max: number) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
const safeSlug = (value: unknown) => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80;
const safeMedia = (value: unknown) => value === null || (typeof value === "string" && (/^\/api\/media\/[0-9a-f]{24}$/.test(value) || /^\/[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp|gif|avif)$/.test(value) || /^https:\/\//.test(value)) && value.length <= 1000);

function validCopy(value: unknown): value is ManagedProductCopy {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some(key => ![...copyKeys, "storyItems"].includes(key as typeof copyKeys[number])) || copyKeys.some(key => !(key in record))) return false;
  if (!Array.isArray(record.highlights) || record.highlights.length !== 4 || record.highlights.some(item => !safeText(item, 180))) return false;
  if (record.storyItems !== undefined) {
    if (!Array.isArray(record.storyItems) || record.storyItems.length !== 4) return false;
    for (const item of record.storyItems) {
      if (!item || typeof item !== "object" || Array.isArray(item)) return false;
      const story = item as Record<string, unknown>;
      if (Object.keys(story).sort().join("|") !== "accent|body|eyebrow|note|title") return false;
      if (!safeText(story.eyebrow, 120) || !safeText(story.title, 240) || !safeText(story.accent, 240) || !safeText(story.body, 1200) || !safeText(story.note, 500)) return false;
    }
  }
  return copyKeys.filter(key => key !== "highlights").every(key => safeText(record[key], key.includes("Text") || key.includes("Description") || key === "description" ? 1200 : 240));
}

function defaultStoryItems(locale: ProductLocale): ProductStoryItem[] {
  return locale === "tr" ? [
    { eyebrow: "Sahayı okumak", title: "Her sezon aynı başlamaz.", accent: "Önce koşulları anlamak gerekir.", body: "Üretime başlamadan önce sahanın mevcut durumunu ve sezonun karakterini birlikte değerlendiriyoruz.", note: "İyi bir üretim planı, sahayı olduğu haliyle okuyarak başlar." },
    { eyebrow: "Doğru planlama", title: "Her kararın bir zamanı vardır.", accent: "Planlama üretimin temelidir.", body: "Ürünün ihtiyaçlarına uygun adımları doğru zamanda ve doğru yöntemle planlıyoruz.", note: "Doğru plan, sürecin tamamına yön verir." },
    { eyebrow: "Kontrollü süreç", title: "Üretimi yakından izliyoruz.", accent: "Her aşamayı birlikte yönetiyoruz.", body: "Sahadaki gelişimi düzenli olarak takip ediyor, gerekli kararları güncel koşullara göre alıyoruz.", note: "Süreklilik, dikkatli takip ve zamanında müdahaleyle sağlanır." },
    { eyebrow: "Güvenilir ürün", title: "Emeği değerli ürüne dönüştürüyoruz.", accent: "Kaliteyi son aşamaya kadar koruyoruz.", body: "Hasattan tedariğe kadar ürünün niteliğini koruyan güvenilir bir süreç yürütüyoruz.", note: "Topraktan başlayan yolculuk, güvenilir ürünle tamamlanır." },
  ] : [
    { eyebrow: "Reading the field", title: "Every season begins differently.", accent: "Conditions come first.", body: "Before production begins, we evaluate the field and the character of the season together.", note: "A sound production plan begins by reading the field as it is." },
    { eyebrow: "Right planning", title: "Every decision has its time.", accent: "Planning is the foundation.", body: "We plan each step at the right time and with the right method for the product's needs.", note: "The right plan guides the entire process." },
    { eyebrow: "Controlled process", title: "We follow production closely.", accent: "Every stage is managed together.", body: "We monitor progress in the field and make decisions according to current conditions.", note: "Continuity comes from careful monitoring and timely action." },
    { eyebrow: "Reliable product", title: "We turn effort into value.", accent: "Quality is protected to the end.", body: "From harvest to supply, we run a reliable process that preserves product quality.", note: "The journey that starts in the soil ends with a reliable product." },
  ];
}

export function validateManagedProduct(value: unknown): ManagedProduct | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const slug = record.slug as Record<string, unknown> | undefined;
  const copy = record.copy as Record<string, unknown> | undefined;
  const media = record.media as Record<string, unknown> | undefined;
  if (!safeText(record.id, 80) || !safeText(record.categoryId, 80) || !slug || !safeSlug(slug.tr) || !safeSlug(slug.en)) return null;
  if (!copy || !validCopy(copy.tr) || !validCopy(copy.en)) return null;
  if (!media || !safeMedia(media.cardUrl) || !safeMedia(media.detailUrl)) return null;
  if (!Number.isInteger(record.order) || Number(record.order) < 0 || Number(record.order) > 10_000) return null;
  if (typeof record.createdAt !== "string" || typeof record.updatedAt !== "string") return null;
  return {
    id: record.id as string,
    categoryId: record.categoryId as string,
    slug: { tr: slug.tr as string, en: slug.en as string },
    copy: { tr: copy.tr, en: copy.en } as Record<ProductLocale, ManagedProductCopy>,
    media: { cardUrl: media.cardUrl as string | null, detailUrl: media.detailUrl as string | null },
    order: record.order as number,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function createDefaultManagedProduct(id: string, order: number, categoryId: string): ManagedProduct {
  const now = new Date().toISOString();
  const suffix = id.slice(-6).toLowerCase();
  const tr: ManagedProductCopy = {
    name: "Yeni Ürün", description: "Ürünün kısa tanıtım metnini buraya yazın.",
    kicker: "Toprak Tarım ürünü", eyebrow: "Kaliteli üretim", sectionLabel: "Ürün hakkında",
    sectionTitle: "Yeni ürünümüzü yakından tanıyın.", sectionText: "Ürünün yetiştirilme süreci, kalitesi ve kullanım alanları hakkında açıklamayı buraya yazın.",
    whiteTitle: "Topraktan gelen kaliteyi güvenilir üretimle buluşturuyoruz.", whiteText: "Ürünün üretim yaklaşımını ve sağladığı faydaları anlatan metni buraya yazın.",
    usageValue: "Çeşitli kullanım alanları", usageDescription: "Ürünün kullanım alanlarını açıklayın.",
    sowingValue: "Uygun ekim dönemi", sowingDescription: "Ekim dönemini ve koşullarını açıklayın.",
    harvestValue: "Uygun hasat dönemi", harvestDescription: "Hasat sürecini açıklayın.",
    characterValue: "Özenle seçilmiş", characterDescription: "Ürünün öne çıkan niteliğini açıklayın.",
    highlights: ["Kaliteli ürün", "Güvenilir tedarik", "Kontrollü süreç", "Sürdürülebilir yaklaşım"], storyItems: defaultStoryItems("tr"),
  };
  const en: ManagedProductCopy = {
    name: "New Product", description: "Write a short introduction for the product here.",
    kicker: "Toprak Tarım product", eyebrow: "Quality production", sectionLabel: "About the product",
    sectionTitle: "Discover our new product.", sectionText: "Describe the growing process, quality and uses of the product here.",
    whiteTitle: "We combine quality from the soil with reliable production.", whiteText: "Describe the production approach and benefits of the product here.",
    usageValue: "Multiple uses", usageDescription: "Describe the product's uses.",
    sowingValue: "Suitable sowing period", sowingDescription: "Describe the sowing period and conditions.",
    harvestValue: "Suitable harvest period", harvestDescription: "Describe the harvest process.",
    characterValue: "Carefully selected", characterDescription: "Describe the product's main characteristic.",
    highlights: ["Quality product", "Reliable supply", "Controlled process", "Sustainable approach"], storyItems: defaultStoryItems("en"),
  };
  return { id, categoryId, slug: { tr: `yeni-urun-${suffix}`, en: `new-product-${suffix}` }, copy: { tr, en }, media: { cardUrl: null, detailUrl: null }, order, createdAt: now, updatedAt: now };
}

export type ProductCategory = {
  id: string;
  builtIn: boolean;
  name: Record<ProductLocale, string>;
  order: number;
};

export function validateProductCategory(value: unknown): ProductCategory | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const name = record.name as Record<string, unknown> | undefined;
  if (!safeText(record.id, 80) || typeof record.builtIn !== "boolean" || !name || !safeText(name.tr, 160) || !safeText(name.en, 160)) return null;
  if (!Number.isInteger(record.order) || Number(record.order) < 0 || Number(record.order) > 10_000) return null;
  return { id: record.id as string, builtIn: record.builtIn, name: name as Record<ProductLocale, string>, order: record.order as number };
}

export function createDefaultProductCategory(id: string, order: number): ProductCategory {
  return { id, builtIn: false, name: { tr: "Yeni Kategori", en: "New Category" }, order };
}
