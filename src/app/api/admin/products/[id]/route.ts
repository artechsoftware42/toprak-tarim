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
    const db = client.db(process.env.MONGODB_DB || "toprak-tarim");
    const collection = db.collection("products");
    if (!["barley", "wheat", "corn", "sunflower"].includes(product.categoryId) && !(await db.collection("product_categories").findOne({ id: product.categoryId }, { projection: { _id: 1 } }))) {
      return Response.json({ message: "Seçilen kategori bulunamadı." }, { status: 400 });
    }
    const reservedSlugs = new Set(["arpa", "bugday", "misir", "aycicegi", "barley", "wheat", "corn", "sunflower"]);
    if (reservedSlugs.has(product.slug.tr) || reservedSlugs.has(product.slug.en)) return Response.json({ message: "Bu ürün adı varsayılan bir ürün bağlantısıyla çakışıyor." }, { status: 409 });
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
    const db = client.db(process.env.MONGODB_DB || "toprak-tarim");
    const result = await db.collection("products").deleteOne({ id });
    if (!result.deletedCount) return Response.json({ message: "Ürün bulunamadı." }, { status: 404 });
    const settings = await db.collection("product_settings").findOne({ key: "home-selection" }, { projection: { productIds: 1 } });
    if (Array.isArray(settings?.productIds)) await db.collection("product_settings").updateOne({ key: "home-selection" }, { $set: { productIds: settings.productIds.filter(value => value !== id), updatedAt: new Date() } });
    return Response.json({ message: "Ürün kaldırıldı." });
  } catch {
    console.error("[admin-products] Product deletion failed.");
    return Response.json({ message: "Ürün kaldırılamadı." }, { status: 503 });
  }
}
