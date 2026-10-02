import "server-only";
import { MongoClient } from "mongodb";

const CONNECTION_DEADLINE_MS = 3500;

const globalMongo = globalThis as typeof globalThis & {
  homeMongo?: Promise<MongoClient>;
  homeMongoRetryAfter?: number;
};

async function connectWithDeadline(client: MongoClient) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("MongoDB connection deadline exceeded")), CONNECTION_DEADLINE_MS);
  });

  try {
    return await Promise.race([client.connect(), timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MongoDB is not configured");
  if (globalMongo.homeMongoRetryAfter && globalMongo.homeMongoRetryAfter > Date.now()) {
    throw new Error("MongoDB connection is temporarily unavailable");
  }
  if (!globalMongo.homeMongo) {
    const client = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 3000, connectTimeoutMS: 3000, socketTimeoutMS: 5000 });
    globalMongo.homeMongo = connectWithDeadline(client)
      .then(connectedClient => {
        globalMongo.homeMongoRetryAfter = undefined;
        return connectedClient;
      })
      .catch(() => {
        globalMongo.homeMongo = undefined;
        globalMongo.homeMongoRetryAfter = Date.now() + 30_000;
        void client.close().catch(() => {});
        throw new Error("MongoDB connection unavailable");
      });
  }
  return globalMongo.homeMongo;
}
