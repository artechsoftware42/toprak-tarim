import type { Metadata } from "next";

import AdminEditor from "@/features/admin/AdminEditor";
import { readHomeSections } from "@/features/home/content/read";
import { readManagedProducts } from "@/features/products/read";

export const metadata: Metadata = { title: "İçerik Yönetimi | Toprak Tarım", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const [sections, managedProducts] = await Promise.all([readHomeSections(), readManagedProducts()]);
  return <AdminEditor initialSections={sections} initialManagedProducts={managedProducts} />;
}
