import type { Metadata } from "next";

import { ContactRoutePage } from "@/features/site-pages/RoutePages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "tr",
  title: "İletişim",
  description:
    "Birlikte çalışmak için konuşmaya başlayalım. Projeleriniz, iş birlikleriniz ve sorularınız için Toprak Tarım ekibiyle iletişime geçin.",
  canonical: "/iletisim",
  trPath: "/iletisim",
  enPath: "/en/contact",
});

export default ContactRoutePage;
