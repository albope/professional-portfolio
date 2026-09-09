import { parseAnalyticsEvent } from "@/lib/analytics";

const noStore = { "Cache-Control": "no-store" };
const windowMs = 60_000;
const buckets = new Map<string, { count: number; expires: number }>();

/** Operational event counts in the existing hosting logs, not user/session analytics. */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  // Next can use an internal localhost URL behind a proxy. The incoming Host
  // identifies the authority serving this request, including local/preview ports.
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ?? requestUrl.protocol.slice(0, -1);
  const publicOrigin = host && (protocol === "https" || protocol === "http") ? `${protocol}://${host}` : requestUrl.origin;
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== publicOrigin)) {
    return new Response(null, { status: 403, headers: noStore });
  }
  if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") {
    return new Response(null, { status: 204, headers: noStore });
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return new Response(null, { status: 415, headers: noStore });
  }
  const now = Date.now();
  for (const [key, entry] of buckets) if (entry.expires <= now) buckets.delete(key);
  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown").slice(0, 64);
  const bucket = buckets.get(ip) ?? { count: 0, expires: now + windowMs };
  if (bucket.count >= 60 || (!buckets.has(ip) && buckets.size >= 2_048)) {
    return new Response(null, { status: 429, headers: { ...noStore, "Retry-After": "60" } });
  }
  bucket.count += 1;
  buckets.set(ip, bucket);

  // Bound the actual stream before decoding; Content-Length is not a trusted limit.
  const reader = request.body?.getReader();
  if (!reader) return new Response(null, { status: 400, headers: noStore });
  const chunks: Uint8Array[] = [];
  let length = 0;
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => undefined); }, 5_000);
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 1_024) {
        void reader.cancel().catch(() => undefined);
        return new Response(null, { status: 413, headers: noStore });
      }
      chunks.push(value);
    }
    if (timedOut) return new Response(null, { status: 408, headers: noStore });
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const event = parseAnalyticsEvent(JSON.parse(new TextDecoder().decode(bytes)));
    if (!event) return new Response(null, { status: 400, headers: noStore });
    console.info(JSON.stringify({ stream: "bpm-events", ...event }));
    return new Response(null, { status: 204, headers: noStore });
  } catch {
    return new Response(null, { status: 400, headers: noStore });
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}
