import "server-only";

import { randomUUID } from "node:crypto";
import { isAdminRequest } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";
import { createDefaultManagedProduct, validateManagedProduct } from "@/features/products/model";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  try {
    const client = await getMongoClient();
    const collection = client.db(process.env.MONGODB_DB || "toprak-tarim").collection("products");
    const order = await collection.countDocuments();
    const product = createDefaultManagedProduct(randomUUID(), order);
    await collection.insertOne(product);
    return Response.json({ product, message: "Yeni ürün hazırlandı. Metinleri düzenleyip kaydedebilirsiniz." }, { status: 201 });
  } catch {
    console.error("[admin-products] Product creation failed.");
    return Response.json({ message: "Yeni ürün oluşturulamadı." }, { status: 503 });
  }
}
