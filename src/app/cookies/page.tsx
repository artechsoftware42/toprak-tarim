import type { Metadata } from "next";

import Cookie from "@/features/cookies/Cookie";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "tr",
  title: "Çerez Politikası",
  description: "Toprak Tarım internet sitesi çerez politikası ve çerez kullanımına ilişkin bilgilendirme metni.",
  canonical: "/cookies",
});

export default function Page() {
  return <Cookie />;
}
