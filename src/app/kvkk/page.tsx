import type { Metadata } from "next";

import KVKK from "@/features/kvkk/KVKK";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "tr",
  title: "KVKK Aydınlatma Metni",
  description: "Toprak Tarım kişisel verilerin korunması ve işlenmesine ilişkin aydınlatma metni.",
  canonical: "/kvkk",
});

export default function Page() {
  return <KVKK />;
}
