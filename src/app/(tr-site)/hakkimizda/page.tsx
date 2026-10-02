import type { Metadata } from "next";

import { AboutRoutePage } from "@/features/site-pages/RoutePages";

export const metadata: Metadata = {
  title: "Hakkımızda | Toprak Tarım",
  description:
    "2001'de toprağa güvenerek yola çıktık. Çeyrek asra yaklaşan tecrübemizle tarımda güven, sürdürülebilirlik ve kalite odaklı üretim yapıyoruz.",
  alternates: {
    canonical: "/hakkimizda",
    languages: { "tr-TR": "/hakkimizda", en: "/en/about", "x-default": "/hakkimizda" },
  },
};

export default AboutRoutePage;