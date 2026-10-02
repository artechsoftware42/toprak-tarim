import "server-only";

import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  surname: string;
  email: string;
  subject: string;
  message: string;
  kvkk: boolean;
  website?: string;
};

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
const globalRateLimits = globalThis as typeof globalThis & {
  contactRateLimits?: Map<string, number[]>;
};
const rateLimits = globalRateLimits.contactRateLimits ??= new Map<string, number[]>();

function json(message: string, status: number, headers?: HeadersInit) {
  return Response.json({ message }, { status, headers });
}

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (rateLimits.get(ip) ?? []).filter(time => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) {
    rateLimits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimits.set(ip, recent);
  if (rateLimits.size > 5000) {
    for (const [key, times] of rateLimits) {
      if (!times.some(time => now - time < WINDOW_MS)) rateLimits.delete(key);
    }
  }
  return false;
}

function parsePayload(value: unknown): ContactPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some(key => !["name", "surname", "email", "subject", "message", "kvkk", "website"].includes(key))) return null;
  const fields = ["name", "surname", "email", "subject", "message"] as const;
  if (fields.some(field => typeof record[field] !== "string")) return null;
  const payload = {
    name: (record.name as string).trim(),
    surname: (record.surname as string).trim(),
    email: (record.email as string).trim().toLowerCase(),
    subject: (record.subject as string).trim(),
    message: (record.message as string).trim(),
    kvkk: record.kvkk === true,
    website: typeof record.website === "string" ? record.website.trim() : "",
  };
  if (payload.name.length < 2 || payload.name.length > 80) return null;
  if (payload.surname.length < 2 || payload.surname.length > 80) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) || payload.email.length > 254) return null;
  if (payload.subject.length < 2 || payload.subject.length > 150) return null;
  if (payload.message.length < 10 || payload.message.length > 5000 || !payload.kvkk) return null;
  return payload;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 15_000) return json("Mesaj çok uzun.", 413);

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json("Form bilgileri okunamadı.", 400);
  }
  const payload = parsePayload(input);
  if (!payload) return json("Lütfen form alanlarını kontrol edin.", 400);
  if (payload.website) return json("Mesajınız alındı.", 200);
  if (isRateLimited(clientIp(request))) {
    return json("Çok fazla gönderim yaptınız. Lütfen daha sonra tekrar deneyin.", 429, { "Retry-After": "3600" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !from || !to) {
    console.error("[contact] Resend environment configuration is incomplete.");
    return json("Mesaj servisi şu anda kullanılamıyor.", 503);
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: to.split(",").map(address => address.trim()).filter(Boolean),
      replyTo: payload.email,
      subject: `Web iletişim formu: ${payload.subject}`,
      text: [
        `Ad Soyad: ${payload.name} ${payload.surname}`,
        `E-posta: ${payload.email}`,
        `Konu: ${payload.subject}`,
        "",
        payload.message,
        "",
        "KVKK onayı: Evet",
      ].join("\n"),
    });
    if (!error) return json("Mesajınız başarıyla gönderildi.", 200);
    console.error("[contact] Resend rejected the message.");
  } catch {
    console.error("[contact] Resend request failed.");
  }
  return json("Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.", 502);
}
