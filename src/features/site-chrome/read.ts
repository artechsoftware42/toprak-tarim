import "server-only";

import { cache } from "react";

import { getMongoClient } from "@/lib/mongodb";
import { defaultSiteChrome, validateSiteChrome } from "./model";

export const readSiteChrome = cache(async () => {
  if (!process.env.MONGODB_URI) return defaultSiteChrome;
  try {
    const client = await getMongoClient();
    const record = await client.db(process.env.MONGODB_DB || "toprak-tarim")
      .collection("site_content").findOne({ siteKey: "headerFooter" }, { maxTimeMS: 3000 });
    const valid = validateSiteChrome(record);
    if (!valid) console.warn("[site-chrome] Missing or invalid headerFooter document; local default used.");
    return valid || defaultSiteChrome;
  } catch {
    console.warn("[site-chrome] Database unavailable; local default used.");
    return defaultSiteChrome;
  }
});
