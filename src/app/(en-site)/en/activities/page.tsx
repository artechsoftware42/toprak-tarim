import type { Metadata } from "next";

import { ActivitiesRoutePage } from "@/features/site-pages/RoutePages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  title: "Agricultural Activities",
  description:
    "From land analysis to harvest management, we combine field expertise, precise timing, and operational discipline into a unified production chain.",
  canonical: "/en/activities",
  trPath: "/faaliyetler",
  enPath: "/en/activities",
});

export default ActivitiesRoutePage;
