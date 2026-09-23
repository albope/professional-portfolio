import { DIAGNOSTICO_LIMITS, DIAGNOSTICO_TIMEOUTS, SYS, clean, parseDiagnostico } from "./diagnostico";
import { BodyInterrupted, BodyTooLarge, createContactRateLimiter, readJsonBody } from "./contact-server";

/** Modelo por defecto; `ANTHROPIC_MODEL` lo cambia sin tocar código. */
export const DIAGNOSTICO_MODEL = "claude-opus-5";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1_000;

export interface DiagnosticoLog {
  event: "result" | "error";
  code?: string;
  model: string;
}

interface DiagnosticoHandlerOptions {
  fetch?: typeof fetch;
  getConfig?: () => { apiKey?: string; model?: string };
  rateLimiter?: ReturnType<typeof createContactRateLimiter>;
  timeoutMs?: number;
  bodyTimeoutMs?: number;
  /** Registro operativo: resultado o código de error y modelo, nunca el texto del visitante. */
  onEvent?: (entry: DiagnosticoLog) => void;
}

/** Junta los bloques de texto de un mensaje de la API. */
function textOf(message: unknown): { text: string; stop: string } {
  if (!message || typeof message !== "object") return { text: "", stop: "" };
  const data = message as { content?: unknown; stop_reason?: unknown };
  const blocks = Array.isArray(data.content) ? data.content : [];
  const text = blocks
    .map((block) => (block && typeof block === "object" && (block as { type?: unknown }).type === "text" ? String((block as { text?: unknown }).text ?? "") : ""))
    .join("\n");
  return { text, stop: typeof data.stop_reason === "string" ? data.stop_reason : "" };
}

/**
 * Llama a la API de Anthropic desde el servidor con la clave en el entorno.
 * Solo hace de IA: cuando falla devuelve un error y es el cliente quien usa
 * la plantilla, así que ninguna respuesta de este endpoint se hace pasar por
 * una del modelo. Dependencias inyectables para probarlo sin red.
 */
export function createDiagnosticoHandler(options: DiagnosticoHandlerOptions = {}) {
  const rateLimiter = options.rateLimiter ?? createContactRateLimiter({ limit: RATE_LIMIT, windowMs: RATE_WINDOW_MS });
  const providerFetch = options.fetch ?? fetch;
  const getConfig = options.getConfig ?? (() => ({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL,
  }));
  const timeoutMs = options.timeoutMs ?? DIAGNOSTICO_TIMEOUTS.provider;
  const bodyTimeoutMs = options.bodyTimeoutMs ?? DIAGNOSTICO_TIMEOUTS.body;
  const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
  const fail = (status: number, code: string, error: string, headers?: Record<string, string>) =>
    json({ ok: false, code, error }, status, headers);

  return async function POST(request: Request) {
    const mediaType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (mediaType !== "application/json") {
      return fail(415, "invalid_request", "El formato de la solicitud no es válido.");
    }
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rate = rateLimiter.check(ip);
    if (!rate.allowed) {
      return fail(429, "rate_limited", "Has pedido varios diagnósticos seguidos. Espera unos minutos antes de volver a intentarlo.", { "Retry-After": String(rate.retryAfter) });
    }
    let data: unknown;
    try { data = await readJsonBody(request, bodyTimeoutMs, DIAGNOSTICO_LIMITS.requestBytes); }
    catch (error) {
      if (error instanceof BodyInterrupted) return fail(408, "timeout", "La recepción se ha interrumpido. Puedes volver a intentarlo.");
      return error instanceof BodyTooLarge
        ? fail(413, "too_large", "El texto es demasiado largo.")
        : fail(400, "invalid_request", "Solicitud no válida.");
    }
    const texto = data && typeof data === "object" && !Array.isArray(data) && typeof (data as { texto?: unknown }).texto === "string"
      ? (data as { texto: string }).texto.trim()
      : "";
    if (texto.length < DIAGNOSTICO_LIMITS.minChars) {
      return fail(400, "invalid_request", "Cuéntanos un poco más para poder ayudarte: al menos una frase.");
    }
    if (texto.length > DIAGNOSTICO_LIMITS.maxChars) {
      return fail(413, "too_large", "El texto es demasiado largo. Resúmelo un poco y vuelve a intentarlo.");
    }
    const { apiKey, model: configuredModel } = getConfig();
    const model = configuredModel || DIAGNOSTICO_MODEL;
    if (!apiKey) {
      return fail(503, "unavailable", "El diagnóstico con IA no está disponible en este momento.");
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const log = (entry: Omit<DiagnosticoLog, "model">) => {
      try { options.onEvent?.({ ...entry, model }); } catch { /* el registro nunca rompe la respuesta */ }
    };
    try {
      const response = await providerFetch(ANTHROPIC_URL, {
        method: "POST", signal: controller.signal,
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 2048,
          system: SYS,
          messages: [{ role: "user", content: texto }],
          // Tarea corta y estructurada: el esfuerzo bajo prima la latencia del visitante.
          output_config: { effort: "low" },
        }),
      });
      if (!response.ok) {
        log({ event: "error", code: "provider" });
        return fail(502, "provider", "La IA no ha respondido. Puedes volver a intentarlo.");
      }
      const { text, stop } = textOf(await response.json());
      const result = stop === "refusal" ? null : parseDiagnostico(text);
      if (!result) {
        log({ event: "error", code: "unexpected" });
        return fail(502, "unexpected", "La IA ha devuelto una respuesta que no podemos usar. Puedes volver a intentarlo.");
      }
      log({ event: "result" });
      return json({ ok: true, source: "ia", result: clean(result) });
    } catch {
      const code = controller.signal.aborted ? "timeout" : "provider";
      log({ event: "error", code });
      return controller.signal.aborted
        ? fail(504, "timeout", "La IA está tardando demasiado. Puedes volver a intentarlo.")
        : fail(502, "provider", "La IA no ha respondido. Puedes volver a intentarlo.");
    } finally { clearTimeout(timer); }
  };
}
