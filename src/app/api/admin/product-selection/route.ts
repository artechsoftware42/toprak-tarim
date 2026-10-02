import { isAdminRequest } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return Response.json({ message: "Oturumunuz sona erdi." }, { status: 401 });
  const input = await request.json().catch(() => null) as { productIds?: unknown } | null;
  if (!input || !Array.isArray(input.productIds) || input.productIds.length < 1 || input.productIds.length > 4 || input.productIds.some(id => typeof id !== "string" || id.length > 80)) {
    return Response.json({ message: "Ana sayfa için bir ile dört ürün seçin." }, { status: 400 });
  }
  const productIds = [...new Set(input.productIds as string[])];
  if (productIds.length !== input.productIds.length) return Response.json({ message: "Aynı ürün birden fazla seçilemez." }, { status: 400 });
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "toprak-tarim");
    const builtIn = new Set(["barley", "wheat", "corn", "sunflower"]);
    const customIds = productIds.filter(id => !builtIn.has(id));
    if (customIds.length && await db.collection("products").countDocuments({ id: { $in: customIds } }) !== customIds.length) return Response.json({ message: "Seçilen ürünlerden biri bulunamadı." }, { status: 400 });
    await db.collection("product_settings").updateOne({ key: "home-selection" }, { $set: { productIds, updatedAt: new Date() } }, { upsert: true });
    return Response.json({ productIds, message: "Ana sayfada gösterilecek ürünler kaydedildi." });
  } catch {
    return Response.json({ message: "Ürün seçimi kaydedilemedi." }, { status: 503 });
  }
}
