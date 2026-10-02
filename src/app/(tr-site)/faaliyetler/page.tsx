import type { Metadata } from "next";

import { ActivitiesRoutePage } from "@/features/site-pages/RoutePages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "tr",
  title: "Faaliyetlerimiz",
  description:
    "Üretimi yalnızca sonuçla değerlendirmiyoruz. Doğru üretimin toprağı okumakla başladığına inanıyoruz. Planlama, saha takibi, zamanlama ve hasat tek bir üretim zinciri oluşturuyor.",
  canonical: "/faaliyetler",
  trPath: "/faaliyetler",
  enPath: "/en/activities",
});

export default ActivitiesRoutePage;
