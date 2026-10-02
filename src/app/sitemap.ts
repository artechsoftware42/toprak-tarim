import type { MetadataRoute } from "next";

import { products } from "@/data/products";
import { readManagedProducts } from "@/features/products/read";
import { absoluteUrl } from "@/lib/seo";
import { localizedProductHref } from "@/lib/site-routing";

export const dynamic = "force-dynamic";

type SitemapEntry = MetadataRoute.Sitemap[number];

function localizedPair(
  trPath: string,
  enPath: string,
  changeFrequency: SitemapEntry["changeFrequency"],
  trPriority: number,
  enPriority: number,
  lastModified?: Date,
): MetadataRoute.Sitemap {
  const languages = {
    "tr-TR": absoluteUrl(trPath),
    en: absoluteUrl(enPath),
    "x-default": absoluteUrl(trPath),
  };

  return [
    {
      url: absoluteUrl(trPath),
      changeFrequency,
      priority: trPriority,
      alternates: { languages },
      ...(lastModified ? { lastModified } : {}),
    },
    {
      url: absoluteUrl(enPath),
      changeFrequency,
      priority: enPriority,
      alternates: { languages },
      ...(lastModified ? { lastModified } : {}),
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const managedProducts = await readManagedProducts();
  const staticProductPages = products.flatMap(product => localizedPair(
    localizedProductHref(product.slug, "tr"),
    localizedProductHref(product.slug, "en"),
    "weekly",
    0.7,
    0.6,
  ));
  const managedProductPages = managedProducts.flatMap(product => {
    const updatedAt = new Date(product.updatedAt);
    return localizedPair(
      `/faaliyetler/${product.slug.tr}`,
      `/en/activities/${product.slug.en}`,
      "weekly",
      0.7,
      0.6,
      Number.isNaN(updatedAt.valueOf()) ? undefined : updatedAt,
    );
  });

  return [
    ...localizedPair("/", "/en", "weekly", 1, 0.9),
    ...localizedPair("/hakkimizda", "/en/about", "monthly", 0.8, 0.7),
    ...localizedPair("/faaliyetler", "/en/activities", "weekly", 0.8, 0.7),
    ...localizedPair("/iletisim", "/en/contact", "monthly", 0.6, 0.5),
    ...staticProductPages,
    ...managedProductPages,
    { url: absoluteUrl("/cookies"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/kvkk"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/iss"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
