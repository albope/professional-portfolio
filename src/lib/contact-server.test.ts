import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CONTACT_LIMITS, CONTACT_TIMEOUTS } from "./contact";
import { createContactHandler, createContactRateLimiter, type ContactAcceptance } from "./contact-server";

const requestId = "0a1b2c3d-0000-4000-8000-123456789abc";
const providerId = "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794";
const valid = { nombre: "Ana Prueba", email: "ana@example.com", mensaje: "Consulta sintética, no enviar.", necesidad: "operativa", proyecto: "wms-almacen" };
const config = () => ({ apiKey: "test_key_not_real", contactEmail: "recipient@example.com", from: "BPM Test <test@example.com>" });

function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestId, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function harness(provider?: typeof fetch, extra: Parameters<typeof createContactHandler>[0] = {}) {
  const calls: { input: string; init?: RequestInit }[] = [];
  const accepted: ContactAcceptance[] = [];
  const handler = createContactHandler({
    getConfig: config,
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return provider ? provider(input, init) : Response.json({ id: providerId });
    },
    onAccepted: (event) => accepted.push(event),
    ...extra,
  });
  return { handler, calls, accepted };
}

describe("endpoint de contacto, proveedor siempre simulado", () => {
  it("acepta únicamente UUID del proveedor y envía contexto normalizado sin publicar destino", async () => {
    const { handler, calls, accepted } = harness();
    const response = await handler(request({ ...valid, nombre: " Ana ", email: " ANA@EXAMPLE.COM " }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await response.json(), { ok: true, status: "accepted", requestId });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].input, "https://api.resend.com/emails");
    const sent = JSON.parse(String(calls[0].init?.body));
    assert.equal(sent.reply_to, "ana@example.com");
    assert.match(sent.text, /Nombre: Ana\n/);
    assert.match(sent.text, /Necesidad: Organizar/);
    assert.match(sent.text, /Proyecto de referencia: Sistema de gestión de almacén/);
    assert.equal(new Headers(calls[0].init?.headers).get("Idempotency-Key"), `contact/${requestId}`);
    assert.deepEqual(accepted, [{ providerId, need: "operativa", project: "wms-almacen" }]);
  });

  it("reutiliza clave y cuerpo al reintentar; los logs se deduplican por providerId", async () => {
    const { handler, calls, accepted } = harness();
    await handler(request());
    await handler(request());
    assert.deepEqual(calls[0].init?.body, calls[1].init?.body);
    assert.equal(new Headers(calls[0].init?.headers).get("Idempotency-Key"), new Headers(calls[1].init?.headers).get("Idempotency-Key"));
    assert.equal(new Set(accepted.map((event) => event.providerId)).size, 1);
  });

  it("una avería de métricas no convierte aceptación en fallo", async () => {
    const { handler } = harness(undefined, { onAccepted: () => { throw new Error("log unavailable"); } });
    assert.equal((await handler(request())).status, 200);
  });

  for (const [name, body, headers, status] of [
    ["JSON roto", "{", {}, 400],
    ["array", [], {}, 400],
    ["campos blancos", { nombre: "  ", email: " ", mensaje: " " }, {}, 400],
    ["media type", valid, { "Content-Type": "application/json-surprise" }, 415],
    ["formulario HTML", "nombre=Ana", { "Content-Type": "application/x-www-form-urlencoded" }, 415],
    ["longitud declarada", valid, { "Content-Length": String(CONTACT_LIMITS.requestBytes + 1) }, 413],
    ["UUID ausente", valid, { "Idempotency-Key": "" }, 400],
    ["UUID con PII", valid, { "Idempotency-Key": "ana@example.com" }, 400],
    ["honeypot", { ...valid, web: "https://spam.example" }, {}, 400],
  ] as [string, unknown, Record<string, string>, number][]) {
    it(`rechaza ${name} sin llamar ni registrar al proveedor`, async () => {
      const { handler, calls, accepted } = harness();
      const response = await handler(request(body, headers));
      assert.equal(response.status, status);
      assert.equal((await response.json()).ok, false);
      assert.equal(calls.length, 0);
      assert.equal(accepted.length, 0);
      assert.equal(response.headers.get("Cache-Control"), "no-store");
    });
  }

  it("devuelve errores por campo y no filtra la configuración", async () => {
    const { handler } = harness();
    const response = await handler(request({ nombre: "", email: "no-email", mensaje: " " }));
    assert.deepEqual(Object.keys((await response.json()).fields).sort(), ["email", "mensaje", "nombre"]);
  });

  it("rechaza bytes reales sin Content-Length, incluso si la cabecera miente", async () => {
    for (const headers of [{}, { "Content-Length": "1" }] as Record<string, string>[]) {
      const { handler, calls } = harness();
      const response = await handler(request({ ...valid, mensaje: "漢".repeat(15_000) }, headers));
      assert.equal(response.status, 413);
      assert.equal(calls.length, 0);
    }
  });

  it("cancela un stream al exceder el presupuesto de bytes", async () => {
    let cancelled = false;
    const bytes = new TextEncoder().encode(" ".repeat(8_192));
    const stream = new ReadableStream({ pull(controller) { controller.enqueue(bytes); }, cancel() { cancelled = true; } });
    const input = new Request("http://localhost/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestId },
      body: stream, duplex: "half",
    } as RequestInit & { duplex: string });
    const { handler, calls } = harness();
    assert.equal((await handler(input)).status, 413);
    assert.equal(cancelled, true);
    assert.equal(calls.length, 0);
  });

  it("admite Unicode y el peor escape JSON al máximo declarado", async () => {
    const { handler, calls } = harness();
    const payload = { ...valid, nombre: "漢".repeat(200), empresa: "\u0001".repeat(200), telefono: "9".repeat(40), mensaje: "\u0001".repeat(5_000) };
    assert.equal((await handler(request(payload))).status, 200);
    assert.equal(calls.length, 1);
  });

  it("cancela un cuerpo detenido y retorna 408 sin llamar al proveedor", async () => {
    let cancelled = false;
    const stream = new ReadableStream({ cancel() { cancelled = true; } });
    const input = new Request("http://localhost/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: stream, duplex: "half",
    } as RequestInit & { duplex: string });
    const { handler, calls } = harness(undefined, { bodyTimeoutMs: 5 });
    const response = await handler(input);
    assert.equal(response.status, 408);
    assert.equal((await response.json()).code, "timeout");
    assert.equal(cancelled, true);
    assert.equal(calls.length, 0);
  });

  it("deja de leer cuando se aborta la solicitud", async () => {
    let cancelled = false;
    const controller = new AbortController();
    const stream = new ReadableStream({ cancel() { cancelled = true; } });
    const input = new Request("http://localhost/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: stream, duplex: "half", signal: controller.signal,
    } as RequestInit & { duplex: string });
    const { handler, calls } = harness();
    const pending = handler(input);
    controller.abort();
    assert.equal((await pending).status, 408);
    assert.equal(cancelled, true);
    assert.equal(calls.length, 0);
  });

  it("rechaza UTF-8 inválido", async () => {
    const { handler, calls } = harness();
    const input = new Request("http://localhost/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: new Uint8Array([255]) });
    assert.equal((await handler(input)).status, 400);
    assert.equal(calls.length, 0);
  });

  it("no envía sin configuración y retorna 503 recuperable", async () => {
    const { handler, calls } = harness(undefined, { getConfig: () => ({}) });
    const response = await handler(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "unavailable");
    assert.equal(calls.length, 0);
  });

  for (const [name, provider] of [
    ["HTML 200", async () => new Response("<html>OK</html>")],
    ["JSON 200 sin id", async () => Response.json({ ok: true })],
    ["identificador inválido", async () => Response.json({ id: "ana@example.com" })],
    ["204 vacío", async () => new Response(null, { status: 204 })],
    ["fallo HTTP proveedor", async () => Response.json({ message: "private provider detail" }, { status: 500 })],
    ["rechazo de red", async () => { throw new Error("sensitive credentials in stack"); }],
  ] as [string, typeof fetch][]) {
    it(`no confirma ante ${name}, ni expone detalles del proveedor`, async () => {
      const { handler, accepted } = harness(provider);
      const response = await handler(request());
      assert.equal(response.status, 502);
      const body = await response.text();
      assert.doesNotMatch(body, /private|sensitive|credentials|test_key/);
      assert.equal(accepted.length, 0);
    });
  }

  it("aborta el proveedor y retorna 504 al vencer el plazo", async () => {
    let aborted = false;
    const { handler, accepted } = harness(async (_input, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => { aborted = true; reject(new DOMException("aborted", "AbortError")); }, { once: true });
    }), { timeoutMs: 5 });
    const response = await handler(request());
    assert.equal(response.status, 504);
    assert.equal((await response.json()).code, "timeout");
    assert.equal(aborted, true);
    assert.equal(accepted.length, 0);
    assert.ok(CONTACT_TIMEOUTS.body + CONTACT_TIMEOUTS.provider < CONTACT_TIMEOUTS.client);
  });

  it("añade Retry-After sin prolongar el bloqueo por cada reintento", async () => {
    let now = 0;
    const rateLimiter = createContactRateLimiter({ now: () => now, limit: 1, windowMs: 60_000 });
    const { handler, calls } = harness(undefined, { rateLimiter });
    assert.equal((await handler(request())).status, 200);
    now = 5_000;
    const limited = await handler(request());
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get("Retry-After"), "55");
    now = 60_000;
    assert.equal((await handler(request())).status, 200);
    assert.equal(calls.length, 2);
  });
});

describe("limitador local acotado", () => {
  it("limpia caducados, limita memoria y conserva límites activos al llegar al máximo", () => {
    let now = 0;
    const limiter = createContactRateLimiter({ now: () => now, limit: 2, maxEntries: 2, windowMs: 1_000 });
    assert.equal(limiter.check("ip-1").allowed, true);
    assert.equal(limiter.check("ip-2").allowed, true);
    assert.equal(limiter.check("ip-3").allowed, false);
    assert.equal(limiter.size, 2);
    assert.equal(limiter.check("ip-1").allowed, true);
    assert.equal(limiter.check("ip-1").allowed, false);
    now = 1_000;
    assert.equal(limiter.check("ip-3").allowed, true);
    assert.equal(limiter.size, 1);
  });
});
