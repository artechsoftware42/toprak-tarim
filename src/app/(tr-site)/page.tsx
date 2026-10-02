import type { Metadata } from "next";

import { HomeRoutePage } from "@/features/site-pages/RoutePages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "tr",
  title: "Toprak Tarım | Tarımsal Üretim ve Güvenilir Tedarik",
  description:
    "Toprak Tarım; sürdürülebilir tarımsal üretim, saha takibi, güvenilir tedarik ve modern kurumsal tarım çözümleri sunar.",
  canonical: "/",
  trPath: "/",
  enPath: "/en",
  absoluteTitle: true,
});

export default HomeRoutePage;
