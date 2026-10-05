import { randomUUID } from "node:crypto";
import { isAdminRequest } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";
import { createDefaultProductCategory } from "@/features/products/model";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  try {
    const input = await request.json().catch(() => ({})) as { name?: { tr?: unknown; en?: unknown } };
    const tr = typeof input.name?.tr === "string" ? input.name.tr.trim() : "";
    const en = typeof input.name?.en === "string" ? input.name.en.trim() : "";
    if (!tr || !en || tr.length > 160 || en.length > 160) return Response.json({ message: "Türkçe ve İngilizce kategori adlarını eksiksiz yazın." }, { status: 400 });
    const client = await getMongoClient();
    const collection = client.db(process.env.MONGODB_DB || "toprak-tarim").collection("product_categories");
    await collection.createIndex({ id: 1 }, { unique: true });
    const category = createDefaultProductCategory(randomUUID(), await collection.countDocuments() + 4);
    category.name = { tr, en };
    await collection.insertOne(category);
    return Response.json({ category, message: "Yeni kategori hazırlandı." }, { status: 201 });
  } catch {
    return Response.json({ message: "Kategori oluşturulamadı." }, { status: 503 });
  }
}
