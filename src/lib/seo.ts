import type { Metadata } from "next";

export type SeoLocale = "tr" | "en";

export const SITE_NAME = "Toprak Tarım";
export const DEFAULT_SITE_URL = "https://topraktarim.com.tr";
export const SEO_PHONE = "+90 332 355 80 80";

function normalizeSiteUrl(value: string | undefined) {
  if (!value) return DEFAULT_SITE_URL;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return DEFAULT_SITE_URL;
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL);
export const SITE_INDEXING_ENABLED = process.env.SITE_INDEXING_ENABLED !== "false";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

type PageMetadataOptions = {
  locale: SeoLocale;
  title: string;
  description: string;
  canonical: string;
  trPath?: string;
  enPath?: string;
  absoluteTitle?: boolean;
  image?: string;
};

export function createPageMetadata({
  locale,
  title,
  description,
  canonical,
  trPath,
  enPath,
  absoluteTitle = false,
  image = "/opengraph-image",
}: PageMetadataOptions): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const languages = trPath && enPath
    ? { "tr-TR": trPath, en: enPath, "x-default": trPath }
    : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    robots: SITE_INDEXING_ENABLED
      ? { index: true, follow: true }
      : { index: false, follow: false, noarchive: true },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      alternateLocale: locale === "tr" ? ["en_US"] : ["tr_TR"],
      url: canonical,
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
