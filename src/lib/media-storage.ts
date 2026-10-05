import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { Readable } from "node:stream";

import { GridFSBucket, ObjectId } from "mongodb";
import { getMongoClient } from "@/lib/mongodb";

export const MEDIA_BUCKET = "site_media";

const FILESYSTEM_DRIVER = "hostinger-filesystem";
const FILE_MEDIA_PATTERN = /^([0-9a-f]{64})\.(jpg|jpeg|png|webp|gif|avif|mp4|webm|mov)$/;
const INTERNAL_MEDIA_PATTERN = /^\/api\/media\/(?:[0-9a-f]{24}|[0-9a-f]{64}\.(?:jpg|jpeg|png|webp|gif|avif|mp4|webm|mov))$/;

const MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

const EXTENSION_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export type StoredMedia = {
  url: string;
  mime: string;
  size: number;
  reused: boolean;
};

export const internalMediaUrl = (id: ObjectId | string) => `/api/media/${id.toString()}`;
export const isInternalMediaUrl = (value: string) => INTERNAL_MEDIA_PATTERN.test(value);
export const mediaObjectId = (value: string) => /^[0-9a-f]{24}$/.test(value) ? new ObjectId(value) : null;
export const mediaFilename = (value: string) => FILE_MEDIA_PATTERN.test(value) ? value : null;

function filesystemRoot() {
  if (process.env.MEDIA_STORAGE_DRIVER !== FILESYSTEM_DRIVER) return null;
  const configured = process.env.MEDIA_STORAGE_ROOT?.trim();
  if (!configured || !isAbsolute(configured)) throw new Error("MEDIA_STORAGE_ROOT must be an absolute path.");
  return resolve(configured);
}

function filesystemPath(filename: string) {
  const root = filesystemRoot();
  if (!root) return null;
  const target = resolve(join(root, filename));
  if (target !== join(root, filename)) throw new Error("Invalid media filename.");
  return { root, target };
}

export async function getMediaBucket() {
  const client = await getMongoClient();
  return new GridFSBucket(client.db(process.env.MONGODB_DB || "toprak-tarim"), { bucketName: MEDIA_BUCKET });
}

export async function storeMedia(buffer: Buffer, mime: string, metadata: Record<string, unknown>): Promise<StoredMedia> {
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const root = filesystemRoot();

  if (root) {
    const extension = MIME_EXTENSION[mime];
    if (!extension) throw new Error(`Unsupported media type: ${mime}`);
    const filename = `${sha256}.${extension}`;
    const paths = filesystemPath(filename);
    if (!paths) throw new Error("Filesystem media storage is unavailable.");
    await mkdir(paths.root, { recursive: true, mode: 0o750 });
    try {
      const existing = await stat(paths.target);
      if (existing.isFile() && existing.size === buffer.length) {
        return { url: internalMediaUrl(filename), mime, size: existing.size, reused: true };
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }

    const temporary = join(paths.root, `.${filename}.${process.pid}.${randomUUID()}.tmp`);
    try {
      await writeFile(temporary, buffer, { flag: "wx", mode: 0o640 });
      await rename(temporary, paths.target);
    } catch (error) {
      await unlink(temporary).catch(() => undefined);
      throw error;
    }
    return { url: internalMediaUrl(filename), mime, size: buffer.length, reused: false };
  }

  const bucket = await getMediaBucket();
  const existing = await bucket.find({ "metadata.sha256": sha256, "metadata.kind": metadata.kind }).limit(1).next();
  if (existing) return { url: internalMediaUrl(existing._id), mime, size: existing.length, reused: true };

  const upload = bucket.openUploadStream(typeof metadata.originalName === "string" ? metadata.originalName : "media", {
    metadata: { ...metadata, mime, sha256, uploadedAt: new Date() },
  });
  upload.end(buffer);
  await new Promise<void>((resolvePromise, reject) => {
    upload.once("finish", resolvePromise);
    upload.once("error", reject);
  });
  return { url: internalMediaUrl(upload.id), mime, size: buffer.length, reused: false };
}

export async function filesystemMediaInfo(filename: string) {
  const validated = mediaFilename(filename);
  if (!validated) return null;
  const paths = filesystemPath(validated);
  if (!paths) return null;
  try {
    const file = await stat(paths.target);
    if (!file.isFile()) return null;
    const extension = validated.slice(validated.lastIndexOf(".") + 1);
    return { size: file.size, mime: EXTENSION_MIME[extension] || "application/octet-stream", modifiedAt: file.mtime };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export function openFilesystemMedia(filename: string, start: number, end: number) {
  const validated = mediaFilename(filename);
  if (!validated) return null;
  const paths = filesystemPath(validated);
  if (!paths) return null;
  const extension = validated.slice(validated.lastIndexOf(".") + 1);
  const stream = createReadStream(paths.target, { start, end });
  return {
    body: Readable.toWeb(stream) as ReadableStream<Uint8Array>,
    mime: EXTENSION_MIME[extension] || "application/octet-stream",
  };
}

export async function deleteMediaByUrl(url: string) {
  if (!isInternalMediaUrl(url)) return;
  const value = url.slice("/api/media/".length);
  const id = mediaObjectId(value);
  if (id) {
    const bucket = await getMediaBucket();
    await bucket.delete(id).catch(() => undefined);
    return;
  }
  const filename = mediaFilename(value);
  if (!filename) return;
  const paths = filesystemPath(filename);
  if (paths) await unlink(paths.target).catch(error => {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  });
}
