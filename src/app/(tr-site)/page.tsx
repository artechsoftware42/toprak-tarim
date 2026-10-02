import type { Metadata } from "next";

import { HomeRoutePage } from "@/features/site-pages/RoutePages";

export const metadata: Metadata = {
  title: "Toprak Tarım | Topraktan Geleceğe Güvenli Üretim ve Kurumsal Tarım",
  description:
    "Toprak Tarım; sürdürülebilir tarımsal üretim, saha takibi, güvenilir tedarik ve modern kurumsal tarım çözümleri sunar.",
  alternates: {
    canonical: "/",
    languages: { "tr-TR": "/", en: "/en", "x-default": "/" },
  },
};

export default HomeRoutePage;