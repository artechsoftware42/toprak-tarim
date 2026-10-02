import { ProductRoutePage } from "@/features/site-pages/RoutePages";
import { localizedProductSlugs } from "@/lib/site-routing";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return localizedProductSlugs("tr").map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductRoutePage slug={slug} />;
}
