import { isAdminRequest } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";
import { validateProductCategory } from "@/features/products/model";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  const { id } = await context.params;
  const category = validateProductCategory(await request.json().catch(() => null));
  if (!category || category.id !== id) return Response.json({ message: "Kategori bilgileri doğrulanamadı." }, { status: 400 });
  try {
    const client = await getMongoClient();
    const collection = client.db(process.env.MONGODB_DB || "toprak-tarim").collection("product_categories");
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.replaceOne({ id }, category, { upsert: true });
    return Response.json({ category, message: "Kategori kaydedildi." });
  } catch {
    return Response.json({ message: "Kategori kaydedilemedi." }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  const { id } = await context.params;
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "toprak-tarim");
    const category = await db.collection("product_categories").findOne({ id });
    if (category?.builtIn || ["barley", "wheat", "corn", "sunflower"].includes(id)) return Response.json({ message: "Varsayılan kategoriler kaldırılamaz." }, { status: 400 });
    if (await db.collection("products").countDocuments({ categoryId: id })) return Response.json({ message: "Bu kategoriye bağlı ürünler varken kategori kaldırılamaz." }, { status: 409 });
    await db.collection("product_categories").deleteOne({ id });
    return Response.json({ message: "Kategori kaldırıldı." });
  } catch {
    return Response.json({ message: "Kategori kaldırılamadı." }, { status: 503 });
  }
}
