import "server-only";

import { randomUUID } from "node:crypto";
import { isAdminRequest } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";
import { createDefaultManagedProduct } from "@/features/products/model";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  try {
    const input = await request.json().catch(() => ({})) as { categoryId?: unknown };
    if (typeof input.categoryId !== "string" || !input.categoryId) return Response.json({ message: "Önce bir kategori seçin." }, { status: 400 });
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "toprak-tarim");
    if (!["barley", "wheat", "corn", "sunflower"].includes(input.categoryId) && !(await db.collection("product_categories").findOne({ id: input.categoryId }, { projection: { _id: 1 } }))) {
      return Response.json({ message: "Seçilen kategori bulunamadı." }, { status: 400 });
    }
    const collection = db.collection("products");
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ "slug.tr": 1 }, { unique: true });
    await collection.createIndex({ "slug.en": 1 }, { unique: true });
    const order = await collection.countDocuments();
    const product = createDefaultManagedProduct(randomUUID(), order, input.categoryId);
    await collection.insertOne(product);
    return Response.json({ product, message: "Yeni ürün hazırlandı. Metinleri düzenleyip kaydedebilirsiniz." }, { status: 201 });
  } catch {
    console.error("[admin-products] Product creation failed.");
    return Response.json({ message: "Yeni ürün oluşturulamadı." }, { status: 503 });
  }
}
