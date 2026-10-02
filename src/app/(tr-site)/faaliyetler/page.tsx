import type { Metadata } from "next";

import { ActivitiesRoutePage } from "@/features/site-pages/RoutePages";

export const metadata: Metadata = {
  title: "Faaliyetlerimiz | Toprak Tarım",
  description:
    "Üretimi yalnızca sonuçla değerlendirmiyoruz. Doğru üretimin toprağı okumakla başladığına inanıyoruz. Planlama, saha takibi, zamanlama ve hasat tek bir üretim zinciri oluşturuyor.",
  alternates: {
    canonical: "/faaliyetler",
    languages: { "tr-TR": "/faaliyetler", en: "/en/activities", "x-default": "/faaliyetler" },
  },
};

export default ActivitiesRoutePage;