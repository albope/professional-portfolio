import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sinCortes } from "./sin-cortes";

const NBSP = " ";

describe("sinCortes", () => {
  it("une la cifra, la unidad y la palabra siguiente", () => {
    assert.equal(
      sinCortes("Te respondemos en 24 h laborables."),
      `Te respondemos en 24${NBSP}h${NBSP}laborables.`,
    );
  });

  it("no une la unidad con una coma o un punto", () => {
    assert.equal(
      sinCortes("Reserva una videollamada de 30 min, gratuita."),
      `Reserva una videollamada de 30${NBSP}min, gratuita.`,
    );
  });

  it("deja igual las palabras que solo empiezan como una unidad", () => {
    assert.equal(sinCortes("Hablamos 30 minutos para entender tu caso."), "Hablamos 30 minutos para entender tu caso.");
    assert.equal(sinCortes("Sin cifras aquí."), "Sin cifras aquí.");
  });
});
