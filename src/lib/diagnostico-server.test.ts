import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DIAGNOSTICO_LIMITS, SYS } from "./diagnostico";
import { DIAGNOSTICO_MODEL, createDiagnosticoHandler, type DiagnosticoLog } from "./diagnostico-server";
import { createContactRateLimiter } from "./contact-server";

const texto = "Llevamos el stock en tres hojas de cálculo y nunca cuadra.";
const result = {
  titular: "Un stock que siempre cuadra",
  lectura: "Entendemos el problema; empezaríamos por el inventario.",
  construir: ["Inventario en una sola herramienta"],
  conectar: ["La tienda online"],
  noHaceFalta: ["Un ERP completo"],
  fases: ["Entendemos", "Diseñamos", "Construimos", "Lanzamos", "Evolucionamos"].map((titulo, index) => ({
    num: `${index + 1}.0`, titulo, texto: `Fase ${titulo}.`, entregable: "Algo revisable",
  })),
  pregunta: "¿Quién sufre hoy el descuadre?",
};
const message = (text: string, stop = "end_turn") =>
  Response.json({ content: [{ type: "text", text }], stop_reason: stop });

function request(body: unknown = { texto }, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/diagnostico", {
    method: "POST", headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function harness(provider?: typeof fetch, extra: Parameters<typeof createDiagnosticoHandler>[0] = {}) {
  const calls: { input: string; init?: RequestInit }[] = [];
  const logs: DiagnosticoLog[] = [];
  const handler = createDiagnosticoHandler({
    getConfig: () => ({ apiKey: "test_key_not_real" }),
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return provider ? provider(input, init) : message(JSON.stringify(result));
    },
    onEvent: (entry) => logs.push(entry),
    ...extra,
  });
  return { handler, calls, logs };
}

describe("endpoint de diagnóstico, proveedor siempre simulado", () => {
  it("envía el prompt del prototipo con la clave en cabecera y devuelve el resultado limpio", async () => {
    const { handler, calls, logs } = harness();
    const response = await handler(request());
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const payload = await response.json();
    assert.equal(payload.ok, true);
    assert.equal(payload.source, "ia");
    // clean() convierte el punto y coma que coló el modelo.
    assert.equal(payload.result.lectura, "Entendemos el problema. empezaríamos por el inventario.");
    assert.equal(payload.result.fases.length, 5);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].input, "https://api.anthropic.com/v1/messages");
    const headers = new Headers(calls[0].init?.headers);
    assert.equal(headers.get("x-api-key"), "test_key_not_real");
    assert.equal(headers.get("anthropic-version"), "2023-06-01");
    const sent = JSON.parse(String(calls[0].init?.body));
    assert.equal(sent.model, DIAGNOSTICO_MODEL);
    assert.equal(sent.system, SYS);
    assert.deepEqual(sent.messages, [{ role: "user", content: texto }]);
    assert.deepEqual(logs, [{ event: "result", model: DIAGNOSTICO_MODEL }]);
  });

  it("respeta el modelo configurado y no registra el texto del visitante", async () => {
    const { handler, calls, logs } = harness(undefined, { getConfig: () => ({ apiKey: "k", model: "claude-sonnet-5" }) });
    await handler(request());
    assert.equal(JSON.parse(String(calls[0].init?.body)).model, "claude-sonnet-5");
    assert.equal(JSON.stringify(logs).includes("stock"), false);
  });

  for (const [name, provider, code] of [
    ["respuesta sin JSON", async () => message("No puedo ayudarte con eso."), "unexpected"],
    ["JSON con forma incorrecta", async () => message(JSON.stringify({ titular: "x" })), "unexpected"],
    ["rechazo del modelo", async () => message(JSON.stringify(result), "refusal"), "unexpected"],
    ["error HTTP del proveedor", async () => new Response("overloaded", { status: 529 }), "provider"],
    ["fallo de red", async () => { throw new Error("ECONNRESET"); }, "provider"],
  ] as [string, typeof fetch, string][]) {
    it(`devuelve 502 ${code} ante ${name} para que el cliente use la plantilla`, async () => {
      const { handler, logs } = harness(provider);
      const response = await handler(request());
      assert.equal(response.status, 502);
      assert.deepEqual(await response.json().then((p) => [p.ok, p.code]), [false, code]);
      assert.deepEqual(logs, [{ event: "error", code, model: DIAGNOSTICO_MODEL }]);
    });
  }

  it("corta la espera del proveedor y responde 504", async () => {
    const { handler } = harness(
      (_input, init) => new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
      }),
      { timeoutMs: 20 },
    );
    const response = await handler(request());
    assert.equal(response.status, 504);
    assert.equal((await response.json()).code, "timeout");
  });

  it("sin clave responde 503 sin llamar al proveedor", async () => {
    const { handler, calls } = harness(undefined, { getConfig: () => ({}) });
    const response = await handler(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "unavailable");
    assert.equal(calls.length, 0);
  });

  for (const [name, body, headers, status] of [
    ["JSON roto", "{", {}, 400],
    ["array", [], {}, 400],
    ["texto ausente", {}, {}, 400],
    ["texto corto", { texto: "hola" }, {}, 400],
    ["texto largo", { texto: "x".repeat(DIAGNOSTICO_LIMITS.maxChars + 1) }, {}, 413],
    ["cuerpo enorme", { texto: "x".repeat(DIAGNOSTICO_LIMITS.requestBytes) }, {}, 413],
    ["media type", { texto }, { "Content-Type": "text/plain" }, 415],
  ] as [string, unknown, Record<string, string>, number][]) {
    it(`rechaza ${name} sin llamar al proveedor`, async () => {
      const { handler, calls } = harness();
      const response = await handler(request(body, headers));
      assert.equal(response.status, status);
      assert.equal((await response.json()).ok, false);
      assert.equal(calls.length, 0);
    });
  }

  it("limita las peticiones por IP con Retry-After", async () => {
    const { handler, calls } = harness(undefined, { rateLimiter: createContactRateLimiter({ limit: 1, windowMs: 60_000 }) });
    assert.equal((await handler(request())).status, 200);
    const limited = await handler(request());
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers.get("Retry-After")) > 0);
    assert.equal(calls.length, 1);
  });
});
