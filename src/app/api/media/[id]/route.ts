import { Readable } from "node:stream";

import { filesystemMediaInfo, getMediaBucket, mediaFilename, mediaObjectId, openFilesystemMedia } from "@/lib/media-storage";

export const runtime = "nodejs";

type ByteRange = { start: number; end: number; status: 200 | 206 };

function byteRange(length: number, header: string | null): ByteRange | null {
  let start = 0;
  let end = length - 1;
  if (!header) return { start, end, status: 200 };
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match) return null;
  if (!match[1] && match[2]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null;
    start = Math.max(0, length - suffix);
  } else {
    start = Number(match[1] || 0);
    end = match[2] ? Number(match[2]) : end;
  }
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= length) return null;
  return { start, end: Math.min(end, length - 1), status: 206 };
}

function mediaHeaders(id: string, mime: string, length: number, range: ByteRange, modifiedAt?: Date) {
  const headers = new Headers({
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Length": String(range.end - range.start + 1),
    "Content-Type": mime,
    "ETag": `"${id}-${length}"`,
    "X-Content-Type-Options": "nosniff",
  });
  if (modifiedAt) headers.set("Last-Modified", modifiedAt.toUTCString());
  if (range.status === 206) headers.set("Content-Range", `bytes ${range.start}-${range.end}/${length}`);
  return headers;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const filename = mediaFilename(rawId);

  try {
    if (filename) {
      const info = await filesystemMediaInfo(filename);
      if (!info) return new Response("Not found", { status: 404 });
      const range = byteRange(info.size, request.headers.get("range"));
      if (!range) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${info.size}` } });
      const opened = openFilesystemMedia(filename, range.start, range.end);
      if (!opened) return new Response("Not found", { status: 404 });
      return new Response(opened.body, { status: range.status, headers: mediaHeaders(filename, info.mime, info.size, range, info.modifiedAt) });
    }

    const id = mediaObjectId(rawId);
    if (!id) return new Response("Not found", { status: 404 });
    const bucket = await getMediaBucket();
    const file = await bucket.find({ _id: id }).limit(1).next();
    if (!file) return new Response("Not found", { status: 404 });
    const range = byteRange(file.length, request.headers.get("range"));
    if (!range) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${file.length}` } });
    const nodeStream = bucket.openDownloadStream(id, { start: range.start, end: range.end + 1 });
    const body = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
    const mime = typeof file.metadata?.mime === "string" ? file.metadata.mime : "application/octet-stream";
    return new Response(body, { status: range.status, headers: mediaHeaders(file._id.toString(), mime, file.length, range, file.uploadDate) });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Response("Not found", { status: 404 });
    console.error("[media] Media download failed.", error);
    return new Response("Media unavailable", { status: 503 });
  }
}
