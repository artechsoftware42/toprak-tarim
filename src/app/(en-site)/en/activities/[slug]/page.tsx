import type { Metadata } from "next";

import { ProductRoutePage } from "@/features/site-pages/RoutePages";
import { readProductSeoData } from "@/features/products/seo";
import { absoluteUrl, createPageMetadata, SITE_NAME } from "@/lib/seo";
import { localizedProductSlugs } from "@/lib/site-routing";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return localizedProductSlugs("en").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await readProductSeoData(slug, "en");
  if (!product) return { title: "Product Not Found", robots: { index: false, follow: false } };

  return createPageMetadata({
    locale: "en",
    title: `${product.name} Products`,
    description: product.description,
    canonical: product.enPath,
    trPath: product.trPath,
    enPath: product.enPath,
    image: product.image,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await readProductSeoData(slug, "en");
  const productJsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [absoluteUrl(product.image)],
    url: absoluteUrl(product.enPath),
    brand: { "@type": "Brand", name: SITE_NAME },
  } : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <ProductRoutePage slug={slug} />
    </>
  );
}
