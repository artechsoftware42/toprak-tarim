import type { Metadata } from "next";

import { HomeRoutePage } from "@/features/site-pages/RoutePages";

export const metadata: Metadata = {
  title: "Toprak Tarım | Sustainable Agriculture and Production Solutions",
  description:
    "Toprak Tarım provides sustainable agricultural production, reliable supply chain management, and corporate agricultural solutions.",
  alternates: {
    canonical: "/en",
    languages: { "tr-TR": "/", en: "/en", "x-default": "/" },
  },
};

export default HomeRoutePage;