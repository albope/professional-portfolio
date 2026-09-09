import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CONTACT_LIMITS, getContactContext, isAcceptedContactResponse, isContactRequestId, safeSubjectFragment, validateContactPayload } from "./contact";

describe("validateContactPayload", () => {
  it("normaliza un contacto válido", () => {
    const result = validateContactPayload({
      nombre: "  Ana  ",
      empresa: " Taller Norte ",
      email: " ANA@EXAMPLE.COM ",
      mensaje: " Necesitamos automatizar pedidos. ",
    });

    assert.deepEqual(result, {
      ok: true,
      value: {
        nombre: "Ana",
        empresa: "Taller Norte",
        email: "ana@example.com",
        telefono: "",
        mensaje: "Necesitamos automatizar pedidos.",
        necesidad: "",
        proyecto: "",
      },
    });
  });

  it("rechaza cuerpos y emails inválidos", () => {
    assert.equal(validateContactPayload(null).ok, false);
    assert.equal(
      validateContactPayload({ nombre: "Ana", email: "no", mensaje: "Hola" }).ok,
      false
    );
  });

  it("rechaza campos que exceden el límite", () => {
    assert.equal(
      validateContactPayload({
        nombre: "Ana",
        email: "ana@example.com",
        mensaje: "x".repeat(5_001),
      }).ok,
      false
    );
  });

  it("devuelve errores de todos los campos vacíos o de tipo incorrecto", () => {
    const result = validateContactPayload({ nombre: "  ", email: "\n", mensaje: " \t ", empresa: 7, telefono: {} });
    assert.equal(result.ok, false);
    if (!result.ok) assert.deepEqual(Object.keys(result.fields).sort(), ["email", "empresa", "mensaje", "nombre", "telefono"]);
  });

  it("acepta los máximos con caracteres Unicode y escapes JSON dentro del presupuesto", () => {
    const payload = {
      nombre: "漢".repeat(CONTACT_LIMITS.nombre),
      empresa: "\u0001".repeat(CONTACT_LIMITS.empresa),
      email: `${"a".repeat(242)}@example.com`,
      telefono: "9".repeat(CONTACT_LIMITS.telefono),
      mensaje: "\u0001".repeat(CONTACT_LIMITS.mensaje),
      necesidad: "automatizacion", proyecto: "wms-almacen", web: "",
    };
    assert.equal(payload.email.length, CONTACT_LIMITS.email);
    assert.equal(validateContactPayload(payload).ok, true);
    assert.ok(Buffer.byteLength(JSON.stringify(payload)) < CONTACT_LIMITS.requestBytes);
    assert.equal(validateContactPayload({ ...payload, mensaje: payload.mensaje + "x" }).ok, false);
  });

  it("normaliza únicamente contextos conocidos y rechaza claves heredadas", () => {
    assert.deepEqual(getContactContext("operativa", "wms-almacen"), { necesidad: "operativa", proyecto: "wms-almacen" });
    assert.deepEqual(getContactContext("constructor", "__proto__"), { necesidad: "", proyecto: "" });
    assert.deepEqual(getContactContext("https://example.com", "asistente-interno"), { necesidad: "", proyecto: "" });
  });
});

describe("contrato de aceptación", () => {
  const id = "0a1b2c3d-0000-4000-8000-123456789abc";
  it("exige estado, UUID e identidad del intento, no solo un HTTP 200", () => {
    assert.equal(isContactRequestId(id), true);
    assert.equal(isContactRequestId("Ana@example.com"), false);
    assert.equal(isAcceptedContactResponse({ ok: true }, id), false);
    assert.equal(isAcceptedContactResponse("<html>OK</html>", id), false);
    assert.equal(isAcceptedContactResponse({ ok: true, status: "accepted", requestId: id }, id), true);
    assert.equal(isAcceptedContactResponse({ ok: true, status: "accepted", requestId: id }, "another-id"), false);
  });
});

describe("safeSubjectFragment", () => {
  it("elimina saltos de línea del asunto", () => {
    assert.equal(
      safeSubjectFragment("Empresa\r\nBcc: intruso@example.com"),
      "Empresa Bcc: intruso@example.com"
    );
  });
});
