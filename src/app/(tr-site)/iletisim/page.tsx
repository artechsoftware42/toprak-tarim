import type { Metadata } from "next";

import { ContactRoutePage } from "@/features/site-pages/RoutePages";

export const metadata: Metadata = {
  title: "İletişim | Toprak Tarım",
  description:
    "Birlikte çalışmak için konuşmaya başlayalım. Projeleriniz, iş birlikleriniz ve sorularınız için Toprak Tarım ekibiyle iletişime geçin.",
  alternates: {
    canonical: "/iletisim",
    languages: { "tr-TR": "/iletisim", en: "/en/contact", "x-default": "/iletisim" },
  },
};

export default ContactRoutePage;