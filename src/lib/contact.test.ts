import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeSubjectFragment, validateContactPayload } from "./contact";

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
});

describe("safeSubjectFragment", () => {
  it("elimina saltos de línea del asunto", () => {
    assert.equal(
      safeSubjectFragment("Empresa\r\nBcc: intruso@example.com"),
      "Empresa Bcc: intruso@example.com"
    );
  });
});
