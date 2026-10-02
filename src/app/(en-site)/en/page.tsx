import type { Metadata } from "next";

import { HomeRoutePage } from "@/features/site-pages/RoutePages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  title: "Toprak Tarım | Sustainable Agriculture and Supply",
  description:
    "Toprak Tarım provides sustainable agricultural production, reliable supply chain management, and corporate agricultural solutions.",
  canonical: "/en",
  trPath: "/",
  enPath: "/en",
  absoluteTitle: true,
});

export default HomeRoutePage;
