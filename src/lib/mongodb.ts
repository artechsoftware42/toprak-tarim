import "server-only";
import { MongoClient } from "mongodb";

const globalMongo = globalThis as typeof globalThis & { homeMongo?: Promise<MongoClient> };
export function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MongoDB is not configured");
  if (!globalMongo.homeMongo) {
    const client = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 3000, connectTimeoutMS: 3000, socketTimeoutMS: 5000 });
    globalMongo.homeMongo = client.connect().catch(async () => {
      globalMongo.homeMongo = undefined;
      await client.close().catch(() => {});
      throw new Error("MongoDB connection unavailable");
    });
  }
  return globalMongo.homeMongo;
}
