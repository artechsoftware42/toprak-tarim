import type { ReactNode } from "react";

import SiteShell from "@/components/layout/SiteShell";

export const dynamic = "force-dynamic";

export default function EnglishSiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}