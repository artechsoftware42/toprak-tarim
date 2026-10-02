import type { Metadata } from "next";

import AdminEditor from "@/features/admin/AdminEditor";
import { readHomeSections } from "@/features/home/content/read";
import { readFeaturedProductIds, readManagedProducts, readProductCategories } from "@/features/products/read";

export const metadata: Metadata = { title: "İçerik Yönetimi | Toprak Tarım", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const sections = await readHomeSections();
  const [managedProducts, categories, featuredProductIds] = await Promise.all([readManagedProducts(), readProductCategories(sections), readFeaturedProductIds()]);
  return <AdminEditor initialSections={sections} initialManagedProducts={managedProducts} initialCategories={categories} initialFeaturedProductIds={featuredProductIds} />;
}
