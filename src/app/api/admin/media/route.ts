import { isAdminRequest } from "@/lib/admin-auth";
import { storeMedia } from "@/lib/media-storage";
import { defaults, pageKeys, type PageKey } from "@/features/home/content/model";

export const runtime = "nodejs";

const IMAGE_LIMIT = 20 * 1024 * 1024;
const VIDEO_LIMIT = 150 * 1024 * 1024;

type MediaKind = "image" | "video";

function slotKind(pageKey: PageKey, slot: string): MediaKind | null {
  const media = defaults.find(section => section.pageKey === pageKey)?.media?.[slot];
  if (!media) return null;
  return /\.(?:mp4|webm|mov)$/i.test(media.localDefault) ? "video" : "image";
}

function sniffMime(bytes: Uint8Array) {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const starts = (...values: number[]) => values.every((value, index) => bytes[index] === value);
  if (starts(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return "image/gif";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "image/avif";
  if (starts(0x1a, 0x45, 0xdf, 0xa3)) return "video/webm";
  if (ascii(4, 8) === "ftyp") return ascii(8, 12) === "qt  " ? "video/quicktime" : "video/mp4";
  return null;
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > VIDEO_LIMIT + 1024 * 1024) return Response.json({ message: "Dosya boyutu izin verilen sınırı aşıyor." }, { status: 413 });

  let form: FormData;
  try { form = await request.formData(); } catch { return Response.json({ message: "Yükleme verisi okunamadı." }, { status: 400 }); }
  const rawKey = form.get("pageKey");
  const rawSlot = form.get("slot");
  const file = form.get("file");
  if (typeof rawKey !== "string" || !pageKeys.includes(rawKey as PageKey) || typeof rawSlot !== "string" || !(file instanceof File)) {
    return Response.json({ message: "Geçersiz medya yükleme isteği." }, { status: 400 });
  }

  const kind = slotKind(rawKey as PageKey, rawSlot);
  if (!kind) return Response.json({ message: "Bu medya alanı değiştirilemez." }, { status: 400 });
  const limit = kind === "video" ? VIDEO_LIMIT : IMAGE_LIMIT;
  if (!file.size || file.size > limit) {
    const mb = Math.round(limit / 1024 / 1024);
    return Response.json({ message: `${kind === "video" ? "Video" : "Görsel"} en fazla ${mb} MB olabilir.` }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniffMime(buffer.subarray(0, 32));
  if (!mime || (kind === "image" && !mime.startsWith("image/")) || (kind === "video" && !mime.startsWith("video/"))) {
    return Response.json({ message: `Bu alan yalnızca ${kind === "video" ? "MP4, WebM veya MOV video" : "JPG, PNG, WebP, GIF veya AVIF görsel"} kabul eder.` }, { status: 415 });
  }

  try {
    const stored = await storeMedia(buffer, mime, { pageKey: rawKey, slot: rawSlot, kind, originalName: file.name.slice(0, 240) });
    return Response.json({ url: stored.url, mime: stored.mime, size: stored.size, message: stored.reused ? "Medya daha önce yüklenmiş; mevcut dosya kullanıldı." : "Medya yüklendi. Değişikliği yayınlamak için Kaydet'e basın." }, { status: stored.reused ? 200 : 201 });
  } catch (error) {
    console.error("[admin-media] Media upload failed.", error);
    return Response.json({ message: process.env.MEDIA_STORAGE_DRIVER === "hostinger-filesystem" ? "Hostinger medya klasörüne yazılamadı. Klasör yolunu ve izinlerini kontrol edin." : "Medya veritabanına yüklenemedi." }, { status: 503 });
  }
}
