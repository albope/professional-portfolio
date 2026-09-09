import { createHash, randomUUID } from "node:crypto";
import {
  CONTACT_LIMITS, CONTACT_NEEDS, CONTACT_PROJECTS, CONTACT_TIMEOUTS,
  isContactRequestId, safeSubjectFragment, validateContactPayload,
  type ContactNeed, type ContactProject,
} from "./contact";

const RATE_WINDOW_MS = 15 * 60 * 1_000;
const RATE_LIMIT = 5;
const RATE_MAX_ENTRIES = 2_000;

/** Per-process protection only. No persistent IPs and no shared infrastructure. */
export function createContactRateLimiter(options: {
  now?: () => number; windowMs?: number; limit?: number; maxEntries?: number;
} = {}) {
  const { now = Date.now, windowMs = RATE_WINDOW_MS, limit = RATE_LIMIT, maxEntries = RATE_MAX_ENTRIES } = options;
  const entries = new Map<string, { count: number; expires: number }>();
  const salt = randomUUID();
  return {
    get size() { return entries.size; },
    check(ip: string) {
      const time = now();
      for (const [key, entry] of entries) {
        if (entry.expires <= time) entries.delete(key);
      }
      const key = createHash("sha256").update(salt).update(ip.slice(0, 256)).digest("hex");
      const current = entries.get(key);
      if (current) {
        if (current.count >= limit) {
          return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.expires - time) / 1_000)) };
        }
        current.count += 1;
      } else {
        // Fail closed at capacity until expiry, rather than evicting active limits.
        if (entries.size >= maxEntries) {
          const expires = Math.min(...Array.from(entries.values(), (entry) => entry.expires));
          return { allowed: false, retryAfter: Math.max(1, Math.ceil((expires - time) / 1_000)) };
        }
        entries.set(key, { count: 1, expires: time + windowMs });
      }
      return { allowed: true, retryAfter: 0 };
    },
  };
}

class BodyTooLarge extends Error {}
class BodyInterrupted extends Error {}
async function readJsonBody(request: Request, timeoutMs: number): Promise<unknown> {
  if (!request.body) throw new SyntaxError("Empty body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  let interrupted = false;
  const interrupt = () => {
    interrupted = true;
    void reader.cancel().catch(() => undefined);
  };
  const timer = setTimeout(interrupt, timeoutMs);
  request.signal.addEventListener("abort", interrupt, { once: true });
  if (request.signal.aborted) interrupt();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value.byteLength === 0) continue;
      bytes += value.byteLength;
      if (bytes > CONTACT_LIMITS.requestBytes) {
        void reader.cancel().catch(() => undefined);
        throw new BodyTooLarge();
      }
      chunks.push(value);
    }
    if (interrupted) throw new BodyInterrupted();
  } finally {
    clearTimeout(timer);
    request.signal.removeEventListener("abort", interrupt);
    reader.releaseLock();
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
}

export interface ContactAcceptance {
  providerId: string;
  need: ContactNeed | "";
  project: ContactProject | "";
}
interface ContactHandlerOptions {
  fetch?: typeof fetch;
  getConfig?: () => { apiKey?: string; contactEmail?: string; from?: string };
  rateLimiter?: ReturnType<typeof createContactRateLimiter>;
  timeoutMs?: number;
  bodyTimeoutMs?: number;
  onAccepted?: (acceptance: ContactAcceptance) => void;
}

/** Dependencies are injectable so all provider paths can be tested without email. */
export function createContactHandler(options: ContactHandlerOptions = {}) {
  const rateLimiter = options.rateLimiter ?? createContactRateLimiter();
  const providerFetch = options.fetch ?? fetch;
  const getConfig = options.getConfig ?? (() => ({
    apiKey: process.env.RESEND_API_KEY,
    contactEmail: process.env.CONTACT_EMAIL,
    from: process.env.CONTACT_FROM,
  }));
  const timeoutMs = options.timeoutMs ?? CONTACT_TIMEOUTS.provider;
  const bodyTimeoutMs = options.bodyTimeoutMs ?? CONTACT_TIMEOUTS.body;
  const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
  const fail = (status: number, code: string, error: string, headers?: Record<string, string>) =>
    json({ ok: false, code, error }, status, headers);

  return async function POST(request: Request) {
    const mediaType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (mediaType !== "application/json") {
      return fail(415, "invalid_request", "El formato de la solicitud no es válido.");
    }
    if (Number(request.headers.get("content-length") || "0") > CONTACT_LIMITS.requestBytes) {
      return fail(413, "too_large", "La solicitud es demasiado grande.");
    }
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rate = rateLimiter.check(ip);
    if (!rate.allowed) {
      return fail(429, "rate_limited", "Has enviado varias solicitudes. Espera unos minutos antes de volver a intentarlo.", { "Retry-After": String(rate.retryAfter) });
    }
    let data: unknown;
    try { data = await readJsonBody(request, bodyTimeoutMs); }
    catch (error) {
      if (error instanceof BodyInterrupted) {
        return fail(408, "timeout", "La recepción se ha interrumpido. Puedes volver a enviar el mensaje.");
      }
      return error instanceof BodyTooLarge
        ? fail(413, "too_large", "La solicitud es demasiado grande.")
        : fail(400, "invalid_request", "Solicitud no válida.");
    }
    // A trapped bot is never counted or shown as a provider acceptance.
    if (data && typeof data === "object" && "web" in data && Boolean(data.web)) {
      return fail(400, "invalid_request", "No se ha podido validar la solicitud.");
    }
    const validation = validateContactPayload(data);
    if (!validation.ok) {
      return json({ ok: false, code: "invalid_request", error: validation.error, fields: validation.fields }, 400);
    }
    const requestId = request.headers.get("idempotency-key");
    if (!isContactRequestId(requestId)) {
      return fail(400, "invalid_request", "No se ha podido identificar el intento de envío. Vuelve a intentarlo.");
    }
    const { apiKey, contactEmail, from } = getConfig();
    if (!apiKey || !contactEmail) {
      return fail(503, "unavailable", "El envío no está disponible en este momento. Conserva el mensaje e inténtalo más tarde.");
    }
    const { nombre, empresa, email, telefono, mensaje, necesidad, proyecto } = validation.value;
    const body = [
      `Nombre: ${nombre}`, `Empresa: ${empresa || "—"}`, `Email: ${email}`,
      `Teléfono: ${telefono || "—"}`,
      `Necesidad: ${necesidad ? CONTACT_NEEDS[necesidad] : "Por concretar"}`,
      `Proyecto de referencia: ${proyecto ? CONTACT_PROJECTS[proyecto] : "—"}`,
      "", mensaje,
    ].join("\n");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await providerFetch("https://api.resend.com/emails", {
        method: "POST", signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json",
          "Idempotency-Key": `contact/${requestId}`,
        },
        body: JSON.stringify({
          from: from || "BPM Tech <onboarding@resend.dev>", to: [contactEmail],
          reply_to: email, subject: `Nueva consulta — ${safeSubjectFragment(empresa || nombre)}`,
          text: body,
        }),
      });
      if (!response.ok) {
        return fail(502, "provider", "No se ha podido confirmar el envío. Puedes reintentar el mismo mensaje.");
      }
      const accepted: unknown = await response.json();
      if (!accepted || typeof accepted !== "object" || !("id" in accepted) || !isContactRequestId(accepted.id)) {
        return fail(502, "unexpected", "No se ha podido confirmar el envío. Puedes reintentar el mismo mensaje.");
      }
      // Telemetry cannot turn a provider acceptance into an apparent failure.
      try { options.onAccepted?.({ providerId: accepted.id, need: necesidad, project: proyecto }); }
      catch { /* The confirmed response remains recoverable if logging fails. */ }
      return json({ ok: true, status: "accepted", requestId });
    } catch {
      return controller.signal.aborted
        ? fail(504, "timeout", "La confirmación está tardando demasiado. Puedes reintentar el mismo mensaje.")
        : fail(502, "provider", "No se ha podido confirmar el envío. Puedes reintentar el mismo mensaje.");
    } finally { clearTimeout(timer); }
  };
}
