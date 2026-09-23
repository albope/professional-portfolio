import assert from "node:assert/strict";
import { test } from "node:test";
import { copyEs, partirFlecha, partirUltimaPalabra, proyectoSlugs, servicioNeeds } from "../data/copy";
import { CONTACT_NEEDS, CONTACT_PROJECTS } from "./contact";
import { site } from "../data/site";
import { booking } from "../data/booking";
import { projects, homeShots } from "../data/projects";

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

/** Tampoco rayas ni semirrayas: coma o punto según convenga. */
test("no copy string uses a dash", () => {
  for (const [path, value] of todo) {
    assert.equal(/[—–]/.test(value), false, `Raya en ${path}: «${value}»`);
  }
});

/**
 * La misma regla alcanza al copy de las fichas de proyecto y a los textos
 * alternativos, que viven fuera del JSON pero se leen igual en pantalla.
 */
test("no project copy or alt text uses a semicolon", () => {
  for (const [path, value] of strings(projects)) {
    assert.equal(value.includes(";"), false, `Punto y coma en projects.${path}: «${value}»`);
  }
  for (const [path, shot] of Object.entries(homeShots)) {
    assert.equal(shot.alt.includes(";"), false, `Punto y coma en homeShots.${path}`);
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

/**
 * Evento, radio y asistente se muestran sin nombre de cliente y sin enlace.
 * El copy solo nombra el email público; el enlace autorizado de Padel Club OS
 * vive en el cajetín de su lámina (`plates.ts`) y lo vigila `projects.test.ts`.
 */
test("only the authorised project carries a name and an outbound link", () => {
  const linked = todo.filter(([, value]) => /https?:\/\/|\.com|\.es\b/i.test(value));
  const allowed = ["contacto.email_directo", "pie.contacto[1]"];
  assert.deepEqual(linked.map(([path]) => path).sort(), [...allowed].sort());
});

/** Sin precios, plazos ni métricas inventadas en el copy ni en el diagnóstico. */
test("copy carries no invented figures", () => {
  const figures = /\d+\s?(€|%|clientes|proyectos entregados)|\d+\s?(días|semanas|meses) de (entrega|plazo)/i;
  for (const [path, value] of todo) {
    assert.equal(figures.test(value), false, `Cifra inventada en ${path}: «${value}»`);
  }
});

test("projects and services keep their contact references", () => {
  assert.equal(copyEs.proyectos.items.length, proyectoSlugs.length);
  for (const slug of proyectoSlugs) assert.ok(Object.hasOwn(CONTACT_PROJECTS, slug), slug);

  assert.equal(copyEs.servicios.items.length, servicioNeeds.length);
  for (const need of servicioNeeds) assert.ok(Object.hasOwn(CONTACT_NEEDS, need), need);
});

/**
 * Contacto pinta tres cadenas del copy partidas en dos: el aviso de datos
 * enlaza sobre «política de privacidad», la frase del email enlaza sobre la
 * dirección y el botón de reserva lo compone BookingLink. Si alguna de esas
 * piezas se mueve, el enlace desaparece sin que se note en pantalla.
 */
test("contact copy keeps the fragments its links are painted over", () => {
  const sinTildes = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  assert.ok(sinTildes(copyEs.contacto.formulario.aviso_datos).includes("politica de privacidad"));
  assert.ok(copyEs.contacto.email_directo.includes(site.email));
  assert.equal(copyEs.contacto.llamada.cta, `${booking.ctaLabel} ↗`);
});

/** El selector del formulario es el copy, no una lista paralela. */
test("the form selector matches the shared contact needs", () => {
  const [placeholder, ...needs] = copyEs.contacto.formulario.selector.opciones;
  assert.ok(placeholder);
  assert.deepEqual(needs, Object.values(CONTACT_NEEDS));
});

/**
 * Rediseño «Planos anotados» (septiembre de 2026): el bloque «destacado» y la
 * rejilla de cuatro tarjetas se sustituyen por un índice numerado de los cinco
 * proyectos. Cada fila del índice necesita su descriptor, y cada servicio
 * enlaza solo a proyectos que existen en ese índice.
 */
test("the project index and the service proofs point at real projects", () => {
  assert.equal(copyEs.proyectos.items.length, proyectoSlugs.length);
  for (const item of copyEs.proyectos.items) assert.ok(item.descriptor.length > 10, item.descriptor);
  for (const servicio of copyEs.servicios.items) {
    assert.ok(servicio.pruebas.length > 0, servicio.titulo);
    for (const num of servicio.pruebas) {
      assert.match(num, /^0[1-5]$/, `${servicio.titulo}: ${num}`);
      assert.ok(proyectoSlugs[Number(num) - 1], num);
    }
  }
  assert.equal(partirFlecha(copyEs.proyectos.ver).flecha, "→");
});

/** El diagnóstico rota tres placeholders y ofrece cuatro ejemplos con texto propio. */
test("the live diagnosis copy is complete", () => {
  const { diagnostico } = copyEs;
  assert.equal(diagnostico.placeholders.length, 3);
  assert.equal(diagnostico.ejemplos.length, 4);
  for (const ejemplo of diagnostico.ejemplos) assert.ok(ejemplo.rotulo && ejemplo.texto.length >= 12);
  assert.equal(diagnostico.resultado.columnas.length, 3);
  assert.equal(partirFlecha(diagnostico.resultado.cta_llamada).flecha, "↗");
  assert.equal(partirFlecha(diagnostico.resultado.cta_escrito).flecha, "↓");
});

/** La flecha viaja aparte para que el componente pueda animarla. */
test("a trailing arrow is split off the label, and nothing else is", () => {
  assert.deepEqual(partirFlecha("Prueba el diagnóstico ↓"), { texto: "Prueba el diagnóstico", flecha: "↓" });
  assert.deepEqual(partirFlecha("Hablemos ↗"), { texto: "Hablemos", flecha: "↗" });
  assert.deepEqual(partirFlecha("Enviar consulta"), { texto: "Enviar consulta" });
  // Una flecha en mitad de la frase no es un sufijo y se queda donde está.
  assert.deepEqual(partirFlecha("Desliza → para ver"), { texto: "Desliza → para ver" });
});

/** El cuadrado de cierre va pegado a la última palabra del titular de Contacto. */
test("the closing square keeps the last word of the contact headline", () => {
  const { antes, ultima } = partirUltimaPalabra(copyEs.contacto.h2);
  assert.equal(antes + ultima, copyEs.contacto.h2);
  assert.equal(ultima.includes(" "), false);
  assert.deepEqual(partirUltimaPalabra("Hola"), { antes: "", ultima: "Hola" });
});
