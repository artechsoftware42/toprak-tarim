import type { Metadata } from "next";

import ISS from "@/features/iss/ISS";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "tr",
  title: "Bilgi Toplumu Hizmetleri",
  description: "Toprak Tarım bilgi toplumu hizmetleri ve şirket bilgileri.",
  canonical: "/iss",
});

export default function Page() {
  return <ISS />;
}
