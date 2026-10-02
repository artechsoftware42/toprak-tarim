import "server-only";
import { cache } from "react";
import { getMongoClient } from "@/lib/mongodb";
import { defaults, pageKeys, validateSection } from "./model";

export const readHomeSections = cache(async () => {
  if (!process.env.MONGODB_URI) return defaults;
  try {
    const client = await getMongoClient();
    const records = await client.db(process.env.MONGODB_DB || "toprak-tarim")
      .collection("home_sections").find({ pageKey: { $in: [...pageKeys] } }).limit(8).maxTimeMS(3000).toArray();
    return defaults.map(fallback => {
      const matches = records.filter(record => record.pageKey === fallback.pageKey);
      const valid = matches.length === 1 ? validateSection(matches[0], fallback.pageKey) : null;
      if (!valid) console.warn(`[home-content] ${fallback.pageKey}: missing, duplicate or invalid document; local default used.`);
      return valid || fallback;
    });
  } catch {
    // Never log driver errors: these can include connection strings or credentials.
    console.warn("[home-content] Database unavailable; local defaults used.");
    return defaults;
  }
});
