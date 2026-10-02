import "server-only";
import { cache } from "react";
import { getMongoClient } from "@/lib/mongodb";
import { validateManagedProduct, type ManagedProduct } from "./model";

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
