import "server-only";

import { isAdminRequest } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";
import { validateManagedProduct } from "@/features/products/model";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  const { id } = await context.params;
  let input: unknown;
  try { input = await request.json(); } catch { return Response.json({ message: "Ürün verisi okunamadı." }, { status: 400 }); }
  const product = validateManagedProduct(input);
  if (!product || product.id !== id) return Response.json({ message: "Ürün bilgileri doğrulanamadı." }, { status: 400 });
  product.updatedAt = new Date().toISOString();
  try {
    const client = await getMongoClient();
    const collection = client.db(process.env.MONGODB_DB || "toprak-tarim").collection("products");
    const slugOwner = await collection.findOne({ id: { $ne: id }, $or: [{ "slug.tr": product.slug.tr }, { "slug.en": product.slug.en }] }, { projection: { _id: 1 } });
    if (slugOwner) return Response.json({ message: "Bu ürün bağlantısı başka bir üründe kullanılıyor." }, { status: 409 });
    const result = await collection.replaceOne({ id }, product);
    if (!result.matchedCount) return Response.json({ message: "Ürün bulunamadı." }, { status: 404 });
    return Response.json({ product, message: "Ürün kaydedildi." });
  } catch {
    console.error("[admin-products] Product update failed.");
    return Response.json({ message: "Ürün kaydedilemedi." }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  const { id } = await context.params;
  try {
    const client = await getMongoClient();
    const result = await client.db(process.env.MONGODB_DB || "toprak-tarim").collection("products").deleteOne({ id });
    if (!result.deletedCount) return Response.json({ message: "Ürün bulunamadı." }, { status: 404 });
    return Response.json({ message: "Ürün kaldırıldı." });
  } catch {
    console.error("[admin-products] Product deletion failed.");
    return Response.json({ message: "Ürün kaldırılamadı." }, { status: 503 });
  }
}
