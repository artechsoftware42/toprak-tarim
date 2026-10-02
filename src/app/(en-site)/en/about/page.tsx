import type { Metadata } from "next";

import { AboutRoutePage } from "@/features/site-pages/RoutePages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  title: "About Us",
  description:
    "Founded on trust in the soil in 2001, Toprak Tarım delivers sustainable, high-quality, and corporate agricultural production.",
  canonical: "/en/about",
  trPath: "/hakkimizda",
  enPath: "/en/about",
});

export default AboutRoutePage;
