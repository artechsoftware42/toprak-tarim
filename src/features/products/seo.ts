import "server-only";

import { cache } from "react";

import { products } from "@/data/products";
import { plainText } from "@/features/home/content/model";
import { readHomeSections } from "@/features/home/content/read";
import { canonicalProductSlug, localizedProductHref } from "@/lib/site-routing";

import type { ProductLocale } from "./model";
import { readManagedProducts } from "./read";

export type ProductSeoData = {
  name: string;
  description: string;
  image: string;
  trPath: string;
  enPath: string;
};

export const readProductSeoData = cache(async (
  slug: string,
  locale: ProductLocale,
): Promise<ProductSeoData | null> => {
  const [sections, managedProducts] = await Promise.all([readHomeSections(), readManagedProducts()]);
  const managed = managedProducts.find(item => item.slug.tr === slug || item.slug.en === slug);

  if (managed) {
    const copy = managed.copy[locale];
    return {
      name: copy.name,
      description: copy.description,
      image: managed.media.detailUrl || managed.media.cardUrl || "/opengraph-image",
      trPath: `/faaliyetler/${managed.slug.tr}`,
      enPath: `/en/activities/${managed.slug.en}`,
    };
  }

  const canonicalSlug = canonicalProductSlug(slug);
  const product = canonicalSlug ? products.find(item => item.slug === canonicalSlug) : undefined;
  if (!product) return null;

  const activity = sections.find(section => section.pageKey === "activityPage");
  const index = products.findIndex(item => item.id === product.id) + 1;
  const content = activity?.content[locale];
  const name = content?.[`product_${index}_name`];
  const description = content?.[`product_${index}_description`];

  return {
    name: name ? plainText(name) : product.name,
    description: description ? plainText(description) : product.cardDescription,
    image: product.detailImage,
    trPath: localizedProductHref(product.slug, "tr"),
    enPath: localizedProductHref(product.slug, "en"),
  };
});
