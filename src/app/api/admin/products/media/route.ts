import { isAdminRequest } from "@/lib/admin-auth";
import { storeMedia } from "@/lib/media-storage";

export const runtime = "nodejs";
const IMAGE_LIMIT = 20 * 1024 * 1024;

function sniffImage(bytes: Uint8Array) {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const starts = (...values: number[]) => values.every((value, index) => bytes[index] === value);
  if (starts(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return "image/gif";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "image/avif";
  return null;
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > IMAGE_LIMIT + 1024 * 1024) return Response.json({ message: "Görsel en fazla 20 MB olabilir." }, { status: 413 });
  let form: FormData;
  try { form = await request.formData(); } catch { return Response.json({ message: "Yükleme verisi okunamadı." }, { status: 400 }); }
  const file = form.get("file");
  const productId = form.get("productId");
  const slot = form.get("slot");
  if (!(file instanceof File) || typeof productId !== "string" || typeof slot !== "string" || !["cardUrl", "detailUrl"].includes(slot) || !file.size || file.size > IMAGE_LIMIT) {
    return Response.json({ message: "Geçersiz ürün görseli." }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniffImage(buffer.subarray(0, 32));
  if (!mime) return Response.json({ message: "JPG, PNG, WebP, GIF veya AVIF görsel yükleyin." }, { status: 415 });
  try {
    const stored = await storeMedia(buffer, mime, { productId, slot, kind: "image", originalName: file.name.slice(0, 120) });
    return Response.json({ url: stored.url, message: stored.reused ? "Mevcut görsel kullanıldı." : "Görsel yüklendi. Ürünü kaydetmeyi unutmayın." }, { status: stored.reused ? 200 : 201 });
  } catch (error) {
    console.error("[admin-products] Product media upload failed.", error);
    return Response.json({ message: process.env.MEDIA_STORAGE_DRIVER === "hostinger-filesystem" ? "Hostinger medya klasörüne yazılamadı. Klasör yolunu ve izinlerini kontrol edin." : "Görsel yüklenemedi." }, { status: 503 });
  }
}
