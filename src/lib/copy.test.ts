import assert from "node:assert/strict";
import { test } from "node:test";
import { copyEs, lineasDelTitular, partirFlecha, proyectoSlugs, servicioNeeds } from "../data/copy";
import { CONTACT_NEEDS, CONTACT_PROJECTS } from "./contact";

/** Recorre el JSON y devuelve cada cadena con la ruta donde vive. */
function strings(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, at) => strings(item, `${path}[${at}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => strings(item, path ? `${path}.${key}` : key));
  }
  return [];
}

const todo = strings(copyEs);

/**
 * Regla de estilo del sistema: sin punto y coma en ningún texto. El copy que
 * llegó traía uno en el cierre de Servicios y se resolvió con punto.
 */
test("no copy string uses a semicolon", () => {
  for (const [path, value] of todo) {
    assert.equal(value.includes(";"), false, `Punto y coma en ${path}: «${value}»`);
  }
});

/** La web pública nunca indica el tipo de relación con el proyecto. */
test("copy never states the kind of relationship with a project", () => {
  const banned = /producto propio|proyecto personal|piloto interno|equipo interno|encargo/i;
  for (const [path, value] of todo) {
    const hit = value.match(banned);
    assert.equal(hit, null, `Atribución en ${path}: ${hit?.[0]}`);
  }
});

/** Evento, radio y asistente se muestran sin nombre de cliente y sin enlace. */
test("only the authorised project carries a name and an outbound link", () => {
  const linked = todo.filter(([, value]) => /https?:\/\/|\.com|\.es\b/i.test(value));
  const allowed = ["destacado.enlace_externo", "contacto.email_directo", "pie.contacto[1]"];
  assert.deepEqual(linked.map(([path]) => path).sort(), [...allowed].sort());
});

test("the four grid projects and three service rows keep their references", () => {
  assert.equal(copyEs.proyectos.items.length, proyectoSlugs.length);
  for (const slug of proyectoSlugs) assert.ok(Object.hasOwn(CONTACT_PROJECTS, slug), slug);

  assert.equal(copyEs.servicios.items.length, servicioNeeds.length);
  for (const need of servicioNeeds) assert.ok(Object.hasOwn(CONTACT_NEEDS, need), need);
});

/** El selector del formulario es el copy, no una lista paralela. */
test("the form selector matches the shared contact needs", () => {
  const [placeholder, ...needs] = copyEs.contacto.formulario.selector.opciones;
  assert.ok(placeholder);
  assert.deepEqual(needs, Object.values(CONTACT_NEEDS));
});

/**
 * El proyecto de almacén es el único que amplía con ficha de tres filas, y su
 * rótulo de enlace es el mismo del destacado: la portada pinta uno solo.
 */
test("the warehouse project keeps its three-row card and the shared link label", () => {
  const [almacen, evento, radio, asistente] = copyEs.proyectos.items;
  assert.deepEqual(Object.keys(almacen.ficha ?? {}), [
    "Qué se desarrolló",
    "Una decisión",
    "Cómo se hizo",
  ]);
  assert.equal(almacen.cta, copyEs.destacado.cta);
  // Solo evento y radio subrayan una decisión de diseño.
  assert.deepEqual(
    [evento, radio, asistente].map((item) => Boolean(item.decision)),
    [true, true, false]
  );
});

/** Las cinco frases del hero alimentan la única animación de la web. */
test("the hero animation carries exactly five phrases", () => {
  assert.equal(copyEs.hero.h1_palabras.length, 5);
});

/** El corte en tres líneas no puede perder ni duplicar una palabra. */
test("the hero headline breaks into three lines without losing a word", () => {
  const lineas = lineasDelTitular();
  assert.equal(lineas.length, 3);
  assert.equal(lineas.join(" "), copyEs.hero.h1_fijo);
});

/** La flecha viaja aparte para que el componente pueda animarla. */
test("a trailing arrow is split off the label, and nothing else is", () => {
  assert.deepEqual(partirFlecha("Ver proyectos reales ↓"), { texto: "Ver proyectos reales", flecha: "↓" });
  assert.deepEqual(partirFlecha("Hablemos ↗"), { texto: "Hablemos", flecha: "↗" });
  assert.deepEqual(partirFlecha("Enviar consulta"), { texto: "Enviar consulta" });
  // Una flecha en mitad de la frase no es un sufijo y se queda donde está.
  assert.deepEqual(partirFlecha("Desliza → para ver"), { texto: "Desliza → para ver" });
});
