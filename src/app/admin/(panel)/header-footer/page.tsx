import type { Metadata } from "next";

import SiteChromeEditor from "@/features/admin/SiteChromeEditor";
import { readSiteChrome } from "@/features/site-chrome/read";

export const metadata: Metadata = { title: "Header & Footer | Toprak Tarım", robots: { index: false, follow: false } };

export default async function HeaderFooterAdminPage() {
  return <SiteChromeEditor initialContent={await readSiteChrome()} />;
}
