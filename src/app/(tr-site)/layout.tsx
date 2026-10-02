import type { ReactNode } from "react";

import SiteShell from "@/components/layout/SiteShell";

export const dynamic = "force-dynamic";

export default function TurkishSiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="tr">{children}</SiteShell>;
}
