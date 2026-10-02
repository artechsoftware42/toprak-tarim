import type { MetadataRoute } from "next";

import { SITE_INDEXING_ENABLED, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXING_ENABLED) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      host: SITE_URL,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
