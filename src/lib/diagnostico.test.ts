import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DIAGNOSTICO_LIMITS, SYS, clean, fallback, isDiagnosticoResponse, parseDiagnostico, validateDiagnostico,
  type Diagnostico,
} from "./diagnostico";

const sample: Diagnostico = {
  titular: "Un stock que siempre cuadra",
  lectura: "Entendemos el problema. Empezaríamos por el inventario.",
  construir: ["Una herramienta de inventario", "Un libro de movimientos"],
  conectar: ["La tienda online"],
  noHaceFalta: ["Un ERP completo"],
  fases: ["Entendemos", "Diseñamos", "Construimos", "Lanzamos", "Evolucionamos"].map((titulo, index) => ({
    num: `${index + 1}.0`, titulo, texto: `Fase ${titulo}.`, entregable: "Algo revisable",
  })),
  pregunta: "¿Quién sufre hoy el descuadre?",
};

/** Las reglas del copy también valen para lo que devuelve la IA o la plantilla. */
function assertCopyRules(value: unknown, path = "") {
  if (typeof value === "string") {
    assert.equal(value.includes(";"), false, `Punto y coma en ${path}: «${value}»`);
    assert.equal(/[—–]/.test(value), false, `Raya en ${path}: «${value}»`);
    return;
  }
  if (Array.isArray(value)) value.forEach((item, at) => assertCopyRules(item, `${path}[${at}]`));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) assertCopyRules(item, `${path}.${key}`);
  }
}

test("parse extracts the JSON object even when the model wraps it in text", () => {
  const out = `Claro, aquí tienes:\n${JSON.stringify(sample)}\nEspero que ayude.`;
  assert.deepEqual(parseDiagnostico(out), sample);
  assert.equal(parseDiagnostico("sin json"), null);
  assert.equal(parseDiagnostico("{ roto"), null);
  assert.equal(parseDiagnostico(42), null);
});

test("validation rejects a missing or short list of phases and empty fields", () => {
  assert.equal(validateDiagnostico({ ...sample, fases: sample.fases.slice(0, 4) }), null);
  assert.equal(validateDiagnostico({ ...sample, titular: "  " }), null);
  assert.equal(validateDiagnostico({ ...sample, construir: [] }), null);
  assert.equal(validateDiagnostico({ ...sample, fases: [...sample.fases.slice(0, 4), { num: "5.0" }] }), null);
  assert.equal(validateDiagnostico([]), null);
  assert.equal(validateDiagnostico(null), null);
});

test("validation caps lengths and counts so the model cannot overflow the page", () => {
  const long = validateDiagnostico({
    ...sample,
    titular: "x".repeat(500),
    construir: ["a", "b", "c", "d", "e"],
    fases: [...sample.fases, { num: "6.0", titulo: "Extra", texto: "x", entregable: "y" }],
  });
  assert.ok(long);
  assert.equal(long.titular.length, DIAGNOSTICO_LIMITS.titular);
  assert.equal(long.construir.length, 3);
  assert.equal(long.fases.length, 5);
  // Una fase sin número recibe el suyo por posición.
  const numbered = validateDiagnostico({ ...sample, fases: sample.fases.map(({ num: _num, ...fase }) => fase) });
  assert.deepEqual(numbered?.fases.map((fase) => fase.num), ["1.0", "2.0", "3.0", "4.0", "5.0"]);
});

test("clean replaces semicolons and dashes everywhere in the result", () => {
  assert.equal(clean("a; b — c – d"), "a. b, c, d");
  const cleaned = clean({ ...sample, titular: "Stock; hoy — mañana", construir: ["a; b"] });
  assert.equal(cleaned.titular, "Stock. hoy, mañana");
  assert.deepEqual(cleaned.construir, ["a. b"]);
  assert.deepEqual(cleaned.fases, sample.fases);
  assert.equal(clean(7), 7);
});

test("the template routes by keyword and always returns five phases", () => {
  assert.equal(fallback("El stock nunca cuadra").titular, "Un stock que siempre cuadra");
  assert.equal(fallback("Reservas de clases por WhatsApp").titular, "Reservas, cobros y agenda en un mismo sitio");
  assert.equal(fallback("Copiamos pedidos a mano").titular, "Que los datos pasen solos de un sitio a otro");
  assert.equal(fallback("Necesitamos una web nueva").titular, "Una web que explique mejor tu negocio");
  assert.equal(fallback("Queremos lanzar un MVP").titular, "Una primera versión delante de usuarios reales");
  assert.equal(fallback("Tenemos mucho conocimiento en PDF").titular, "Un asistente con el contexto de tu empresa");
  const generic = fallback("No sé por dónde empezar");
  assert.equal(generic.titular, "Una herramienta hecha alrededor de cómo trabajas");
  for (const text of ["stock", "reserva", "a mano", "web", "mvp", "pdf", "otra cosa"]) {
    const result = fallback(text);
    assert.equal(result.fases.length, 5);
    assert.ok(validateDiagnostico(result));
    assertCopyRules(result, text);
  }
});

test("the system prompt follows the same style rules it demands", () => {
  assert.equal(SYS.includes(";"), false);
  assert.equal(/[—–]/.test(SYS), false);
  assert.match(SYS, /Prohibido el punto y coma y las rayas/);
});

test("only an AI result with a valid shape counts as a success response", () => {
  assert.equal(isDiagnosticoResponse({ ok: true, source: "ia", result: sample }), true);
  assert.equal(isDiagnosticoResponse({ ok: true, source: "plantilla", result: sample }), false);
  assert.equal(isDiagnosticoResponse({ ok: true, source: "ia", result: { titular: "x" } }), false);
  assert.equal(isDiagnosticoResponse({ ok: false, code: "provider" }), false);
  assert.equal(isDiagnosticoResponse(null), false);
});
