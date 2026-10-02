import type { Metadata } from "next";

import { ContactRoutePage } from "@/features/site-pages/RoutePages";

export const metadata: Metadata = {
  title: "Contact Us | Toprak Tarım",
  description:
    "Let's talk about working together. Get in touch with Toprak Tarım for your projects, partnerships, and inquiries.",
  alternates: {
    canonical: "/en/contact",
    languages: { "tr-TR": "/iletisim", en: "/en/contact", "x-default": "/iletisim" },
  },
};

export default ContactRoutePage;