import type { Metadata } from "next";

import { AboutRoutePage } from "@/features/site-pages/RoutePages";

export const metadata: Metadata = {
  title: "About Us | Toprak Tarım",
  description:
    "Founded on trust in the soil in 2001, Toprak Tarım delivers sustainable, high-quality, and corporate agricultural production.",
  alternates: {
    canonical: "/en/about",
    languages: { "tr-TR": "/hakkimizda", en: "/en/about", "x-default": "/hakkimizda" },
  },
};

export default AboutRoutePage;