import type { Metadata } from "next";

import { AboutRoutePage } from "@/features/site-pages/RoutePages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "tr",
  title: "Hakkımızda",
  description:
    "2001'de toprağa güvenerek yola çıktık. Çeyrek asra yaklaşan tecrübemizle tarımda güven, sürdürülebilirlik ve kalite odaklı üretim yapıyoruz.",
  canonical: "/hakkimizda",
  trPath: "/hakkimizda",
  enPath: "/en/about",
});

export default AboutRoutePage;
