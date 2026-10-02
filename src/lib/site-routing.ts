export type SiteRouteLocale = "tr" | "en";

type RouteKey = "home" | "about" | "activities" | "contact";

const routePaths: Record<RouteKey, Record<SiteRouteLocale, string>> = {
  home: { tr: "/", en: "/en" },
  about: { tr: "/hakkimizda", en: "/en/about" },
  activities: { tr: "/faaliyetler", en: "/en/activities" },
  contact: { tr: "/iletisim", en: "/en/contact" },
};

const routeAliases: Record<string, RouteKey> = {
  "/": "home",
  "/en": "home",
  "/about": "about",
  "/hakkimizda": "about",
  "/en/about": "about",
  "/activity": "activities",
  "/faaliyetler": "activities",
  "/en/activities": "activities",
  "/contact": "contact",
  "/iletisim": "contact",
  "/en/contact": "contact",
};

const productSlugs = {
  arpa: { tr: "arpa", en: "barley" },
  bugday: { tr: "bugday", en: "wheat" },
  misir: { tr: "misir", en: "corn" },
  aycicegi: { tr: "aycicegi", en: "sunflower" },
} as const;

type TurkishProductSlug = keyof typeof productSlugs;

function productKeyFromSlug(slug: string): TurkishProductSlug | null {
  const normalized = slug.toLocaleLowerCase("en-US");
  for (const [key, localized] of Object.entries(productSlugs)) {
    if (localized.tr === normalized || localized.en === normalized) {
      return key as TurkishProductSlug;
    }
  }
  return null;
}

function splitHref(href: string) {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf("?");
  return {
    pathname: queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash,
    search: queryIndex >= 0 ? withoutHash.slice(queryIndex) : "",
    hash,
  };
}

function localizeHash(route: RouteKey | "product" | null, hash: string, locale: SiteRouteLocale) {
  if (!hash) return "";
  const key = hash.slice(1).toLocaleLowerCase("en-US");

  if (route === "about") {
    if (["about-us", "biz-kimiz", "who-we-are"].includes(key)) {
      return locale === "tr" ? "#biz-kimiz" : "#who-we-are";
    }
    if (["vision", "vizyon"].includes(key)) {
      return locale === "tr" ? "#vizyon" : "#vision";
    }
    if (["mision", "mission", "misyon"].includes(key)) {
      return locale === "tr" ? "#misyon" : "#mission";
    }
  }

  if (route === "activities") {
    if (["production", "uretim"].includes(key)) {
      return locale === "tr" ? "#uretim" : "#production";
    }
    if (["products", "urunler"].includes(key)) {
      return locale === "tr" ? "#urunler" : "#products";
    }
  }

  return hash;
}

export function localeFromPathname(pathname: string): SiteRouteLocale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "tr";
}

export function localizedHref(href: string, locale: SiteRouteLocale) {
  if (!href || /^(?:https?:|mailto:|tel:)/i.test(href)) return href;

  const { pathname, search, hash } = splitHref(href);
  const route = routeAliases[pathname];
  if (route) {
    return `${routePaths[route][locale]}${search}${localizeHash(route, hash, locale)}`;
  }

  const productMatch = pathname.match(/^\/(?:activity|faaliyetler)\/([^/]+)$/)
    ?? pathname.match(/^\/en\/activities\/([^/]+)$/);
  if (productMatch) {
    const productKey = productKeyFromSlug(productMatch[1]);
    if (productKey) {
      const base = routePaths.activities[locale];
      return `${base}/${productSlugs[productKey][locale]}${search}${localizeHash("product", hash, locale)}`;
    }
  }

  if (["/cookie", "/cookie-policy", "/cookies"].includes(pathname)) {
    return `/cookies${search}${hash}`;
  }
  if (["/information-society-services", "/iss"].includes(pathname)) {
    return `/iss${search}${hash}`;
  }

  return href;
}

export function localizedProductHref(slug: string, locale: SiteRouteLocale) {
  const productKey = productKeyFromSlug(slug);
  if (!productKey) return `${routePaths.activities[locale]}/${slug}`;
  return `${routePaths.activities[locale]}/${productSlugs[productKey][locale]}`;
}

export function localizedProductSlugs(locale: SiteRouteLocale) {
  return Object.values(productSlugs).map((slugs) => slugs[locale]);
}

export function canonicalProductSlug(slug: string) {
  return productKeyFromSlug(slug);
}

export function localizedSectionId(
  section: "about" | "vision" | "mission" | "production" | "products",
  locale: SiteRouteLocale,
) {
  const ids = {
    about: { tr: "biz-kimiz", en: "who-we-are" },
    vision: { tr: "vizyon", en: "vision" },
    mission: { tr: "misyon", en: "mission" },
    production: { tr: "uretim", en: "production" },
    products: { tr: "urunler", en: "products" },
  } as const;
  return ids[section][locale];
}

export function isActivitiesLandingPath(pathname: string) {
  return pathname === "/faaliyetler" || pathname === "/en/activities";
}

export function isProductDetailPath(pathname: string) {
  return /^\/faaliyetler\/[^/]+$/.test(pathname) || /^\/en\/activities\/[^/]+$/.test(pathname);
}
