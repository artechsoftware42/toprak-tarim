import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  if (!(await hasAdminSession())) redirect("/admin/login");
  return children;
}
