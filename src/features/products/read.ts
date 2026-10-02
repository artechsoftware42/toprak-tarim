import "server-only";
import { cache } from "react";
import { getMongoClient } from "@/lib/mongodb";
import { plainText, type HomeSection } from "@/features/home/content/model";
import { validateManagedProduct, validateProductCategory, type ManagedProduct, type ProductCategory } from "./model";

export const readManagedProducts = cache(async (): Promise<ManagedProduct[]> => {
  if (!process.env.MONGODB_URI) return [];
  try {
    const client = await getMongoClient();
    const records = await client.db(process.env.MONGODB_DB || "toprak-tarim").collection("products").find({}).sort({ order: 1 }).maxTimeMS(3000).toArray();
    return records.flatMap(record => {
      const valid = validateManagedProduct({ ...record, _id: undefined });
      return valid ? [valid] : [];
    });
  } catch {
    console.warn("[products] Database unavailable; additional products could not be loaded.");
    return [];
  }
});

export const readProductCategories = cache(async (sections: HomeSection[]): Promise<ProductCategory[]> => {
  const activity = sections.find(section => section.pageKey === "activityPage")!;
  const ids = ["barley", "wheat", "corn", "sunflower"];
  const fallback = ids.map((id, index): ProductCategory => ({
    id, builtIn: true,
    name: { tr: plainText(activity.content.tr[`product_${index + 1}_name`]), en: plainText(activity.content.en[`product_${index + 1}_name`]) },
    order: index,
  }));
  if (!process.env.MONGODB_URI) return fallback;
  try {
    const client = await getMongoClient();
    const records = await client.db(process.env.MONGODB_DB || "toprak-tarim").collection("product_categories").find({}).sort({ order: 1 }).maxTimeMS(3000).toArray();
    const saved = records.flatMap(record => { const valid = validateProductCategory(record); return valid ? [valid] : []; });
    const savedIds = new Set(saved.map(item => item.id));
    return [...saved, ...fallback.filter(item => !savedIds.has(item.id))].sort((a, b) => a.order - b.order);
  } catch {
    console.warn("[product-categories] Database unavailable; default categories used.");
    return fallback;
  }
});

export const readFeaturedProductIds = cache(async (): Promise<string[]> => {
  const fallback = ["barley", "wheat", "corn", "sunflower"];
  if (!process.env.MONGODB_URI) return fallback;
  try {
    const client = await getMongoClient();
    const record = await client.db(process.env.MONGODB_DB || "toprak-tarim").collection("product_settings").findOne({ key: "home-selection" }, { projection: { productIds: 1 } });
    if (!Array.isArray(record?.productIds)) return fallback;
    const ids = record.productIds.filter((value): value is string => typeof value === "string" && value.length <= 80).slice(0, 4);
    return ids.length ? ids : fallback;
  } catch {
    return fallback;
  }
});
