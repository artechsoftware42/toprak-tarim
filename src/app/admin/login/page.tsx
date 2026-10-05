import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/features/admin/LoginForm";
import { credentialsConfigured, hasAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin Girişi", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");
  return <LoginForm configured={credentialsConfigured()} />;
}
