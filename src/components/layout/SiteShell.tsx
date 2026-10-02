import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import InitialLoading from "@/components/loading/InitialLoading";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";
import LocaleProvider from "@/features/home/content/LocaleProvider";
import { readSiteChrome } from "@/features/site-chrome/read";
import type { SiteRouteLocale } from "@/lib/site-routing";

export default async function SiteShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: SiteRouteLocale;
}) {
  const chrome = await readSiteChrome();

  return (
    <LocaleProvider initialLocale={locale}>
      <InitialLoading>
        <SmoothScroll>
          <Header content={chrome} />
          {children}
          <Footer content={chrome} />
          <ScrollToTop />
        </SmoothScroll>
      </InitialLoading>
    </LocaleProvider>
  );
}
