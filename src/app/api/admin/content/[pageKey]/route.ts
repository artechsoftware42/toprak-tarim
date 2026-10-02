import "server-only";

import { isAdminRequest } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";
import { getMediaBucket, mediaObjectId } from "@/lib/media-storage";
import { pageKeys, type PageKey, validateSection } from "@/features/home/content/model";

export async function PUT(request: Request, context: { params: Promise<{ pageKey: string }> }) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 250_000) return Response.json({ message: "İçerik boyutu çok büyük." }, { status: 413 });
  const { pageKey: rawKey } = await context.params;
  if (!pageKeys.includes(rawKey as PageKey)) return Response.json({ message: "Geçersiz bölüm." }, { status: 404 });
  let input: unknown;
  try { input = await request.json(); } catch { return Response.json({ message: "İçerik okunamadı." }, { status: 400 }); }
  const section = validateSection(input, rawKey as PageKey);
  if (!section) return Response.json({ message: "İçerik doğrulanamadı. Sabit alanlar veya teknik yapı değiştirilmiş olabilir." }, { status: 400 });
  try {
    const client = await getMongoClient();
    const collection = client.db(process.env.MONGODB_DB || "toprak-tarim").collection("home_sections");
    const previous = await collection.findOne({ pageKey: section.pageKey });
    const result = await collection.replaceOne({ pageKey: section.pageKey }, section);
    if (result.matchedCount !== 1) return Response.json({ message: "Bölüm veritabanında bulunamadı." }, { status: 404 });
    const previousUrls = Object.values(previous?.media || {}).flatMap(value => typeof value === "object" && value && "externalUrl" in value && typeof value.externalUrl === "string" ? [value.externalUrl] : []);
    const currentUrls = new Set(Object.values(section.media || {}).flatMap(value => value.externalUrl ? [value.externalUrl] : []));
    const removed = previousUrls.filter(url => /^\/api\/media\/[0-9a-f]{24}$/.test(url) && !currentUrls.has(url));
    if (removed.length) {
      try {
        const documents = await collection.find({}, { projection: { media: 1 } }).toArray();
        const bucket = await getMediaBucket();
        for (const url of removed) {
          if (documents.some(document => JSON.stringify(document.media || {}).includes(url))) continue;
          const id = mediaObjectId(url.slice("/api/media/".length));
          if (id) await bucket.delete(id).catch(() => undefined);
        }
      } catch { console.warn("[admin-content] Unused media cleanup could not be completed."); }
    }
    return Response.json({ section, message: "Değişiklikler kaydedildi." });
  } catch {
    console.error("[admin-content] Database update failed.");
    return Response.json({ message: "Veritabanına kaydedilemedi." }, { status: 503 });
  }
}
