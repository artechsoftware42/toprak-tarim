import type { Metadata } from "next";

import { ActivitiesRoutePage } from "@/features/site-pages/RoutePages";

export const metadata: Metadata = {
  title: "Activities & Operations | Toprak Tarım",
  description:
    "From land analysis to harvest management, we combine field expertise, precise timing, and operational discipline into a unified production chain.",
  alternates: {
    canonical: "/en/activities",
    languages: { "tr-TR": "/faaliyetler", en: "/en/activities", "x-default": "/faaliyetler" },
  },
};

export default ActivitiesRoutePage;