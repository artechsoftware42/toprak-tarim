import "server-only";

import { validateSiteChrome } from "@/features/site-chrome/model";
import { isAdminRequest } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 250_000) return Response.json({ message: "İçerik boyutu çok büyük." }, { status: 413 });
  let input: unknown;
  try { input = await request.json(); } catch { return Response.json({ message: "İçerik okunamadı." }, { status: 400 }); }
  const content = validateSiteChrome(input);
  if (!content) return Response.json({ message: "Header ve Footer içeriği doğrulanamadı. Sabit bağlantılar değiştirilmiş olabilir." }, { status: 400 });
  try {
    const client = await getMongoClient();
    await client.db(process.env.MONGODB_DB || "toprak-tarim").collection("site_content")
      .replaceOne({ siteKey: "headerFooter" }, content, { upsert: true });
    return Response.json({ content, message: "Header ve Footer birlikte güncellendi." });
  } catch {
    console.error("[admin-site-chrome] Database update failed.");
    return Response.json({ message: "Veritabanına kaydedilemedi." }, { status: 503 });
  }
}
