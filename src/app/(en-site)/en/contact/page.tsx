import type { Metadata } from "next";

import { ContactRoutePage } from "@/features/site-pages/RoutePages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  title: "Contact Us",
  description:
    "Let's talk about working together. Get in touch with Toprak Tarım for your projects, partnerships, and inquiries.",
  canonical: "/en/contact",
  trPath: "/iletisim",
  enPath: "/en/contact",
});

export default ContactRoutePage;
