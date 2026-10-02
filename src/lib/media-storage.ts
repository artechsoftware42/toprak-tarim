import "server-only";

import { GridFSBucket, ObjectId } from "mongodb";
import { getMongoClient } from "@/lib/mongodb";

export const MEDIA_BUCKET = "site_media";
export const internalMediaUrl = (id: ObjectId | string) => `/api/media/${id.toString()}`;

export async function getMediaBucket() {
  const client = await getMongoClient();
  return new GridFSBucket(client.db(process.env.MONGODB_DB || "toprak-tarim"), { bucketName: MEDIA_BUCKET });
}

export function mediaObjectId(value: string) {
  return /^[0-9a-f]{24}$/.test(value) ? new ObjectId(value) : null;
}
