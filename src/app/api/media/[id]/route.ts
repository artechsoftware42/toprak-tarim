import { Readable } from "node:stream";

import { getMediaBucket, mediaObjectId } from "@/lib/media-storage";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params;
  const id = mediaObjectId(rawId);
  if (!id) return new Response("Not found", { status: 404 });

  try {
    const bucket = await getMediaBucket();
    const file = await bucket.find({ _id: id }).limit(1).next();
    if (!file) return new Response("Not found", { status: 404 });

    let start = 0;
    let end = file.length - 1;
    let status = 200;
    const range = request.headers.get("range");
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${file.length}` } });
      if (!match[1] && match[2]) {
        const suffix = Number(match[2]);
        start = Math.max(0, file.length - suffix);
      } else {
        start = Number(match[1] || 0);
        end = match[2] ? Number(match[2]) : end;
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= file.length) {
        return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${file.length}` } });
      }
      end = Math.min(end, file.length - 1);
      status = 206;
    }

    const nodeStream = bucket.openDownloadStream(id, { start, end: end + 1 });
    const body = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
    const headers = new Headers({
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(end - start + 1),
      "Content-Type": typeof file.metadata?.mime === "string" ? file.metadata.mime : "application/octet-stream",
      "ETag": `"${file._id.toString()}-${file.length}"`,
      "X-Content-Type-Options": "nosniff",
    });
    if (status === 206) headers.set("Content-Range", `bytes ${start}-${end}/${file.length}`);
    return new Response(body, { status, headers });
  } catch {
    console.error("[media] Media download failed.");
    return new Response("Media unavailable", { status: 503 });
  }
}
