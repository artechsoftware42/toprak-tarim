import { NextResponse } from "next/server";

import { ADMIN_COOKIE, adminSessionMaxAge, createSessionToken, credentialsConfigured, verifyCredentials } from "@/lib/admin-auth";

const globalLoginAttempts = globalThis as typeof globalThis & { adminLoginAttempts?: Map<string, number[]> };
const attempts = globalLoginAttempts.adminLoginAttempts ??= new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;

function ip(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function blocked(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter(time => now - time < WINDOW_MS);
  attempts.set(key, recent);
  return recent.length >= 5;
}

export async function POST(request: Request) {
  if (!credentialsConfigured()) return NextResponse.json({ message: "Admin hesabı henüz yapılandırılmadı." }, { status: 503 });
  const key = ip(request);
  if (blocked(key)) return NextResponse.json({ message: "Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin." }, { status: 429 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ message: "Giriş bilgileri okunamadı." }, { status: 400 }); }
  const record = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const username = typeof record.username === "string" ? record.username.trim() : "";
  const password = typeof record.password === "string" ? record.password : "";
  if (!username || username.length > 100 || !password || password.length > 256 || !verifyCredentials(username, password)) {
    attempts.set(key, [...(attempts.get(key) ?? []), Date.now()]);
    return NextResponse.json({ message: "Kullanıcı adı veya parola hatalı." }, { status: 401 });
  }
  attempts.delete(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminSessionMaxAge,
  });
  return response;
}
