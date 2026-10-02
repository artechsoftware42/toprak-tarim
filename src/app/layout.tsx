import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { SITE_INDEXING_ENABLED, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Toprak Tarım | Kurumsal Tarım ve Üretim",
    template: "%s | Toprak Tarım",
  },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "agriculture",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  robots: SITE_INDEXING_ENABLED
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: [
      { url: "/icon.ico" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.ico",
    apple: "/icon.png",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = (await headers()).get("x-site-locale") === "en" ? "en" : "tr";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
  };

  return (
    <html lang={locale}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
