import type { Metadata } from "next";

import { ProductRoutePage } from "@/features/site-pages/RoutePages";
import { readProductSeoData } from "@/features/products/seo";
import { absoluteUrl, createPageMetadata, SITE_NAME } from "@/lib/seo";
import { localizedProductSlugs } from "@/lib/site-routing";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return localizedProductSlugs("tr").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await readProductSeoData(slug, "tr");
  if (!product) return { title: "Ürün Bulunamadı", robots: { index: false, follow: false } };

  return createPageMetadata({
    locale: "tr",
    title: `${product.name} Ürünleri`,
    description: product.description,
    canonical: product.trPath,
    trPath: product.trPath,
    enPath: product.enPath,
    image: product.image,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await readProductSeoData(slug, "tr");
  const productJsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [absoluteUrl(product.image)],
    url: absoluteUrl(product.trPath),
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
