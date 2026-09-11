import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { projects, homeShots, type Shot } from "../data/projects";
import { CONTACT_PROJECTS, getContactContext } from "./contact";
import { parseAnalyticsEvent } from "./analytics";

test("every gallery case preserves its reference through contact and measurement", () => {
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  for (const { slug } of projects) {
    assert.ok(Object.hasOwn(CONTACT_PROJECTS, slug));
    assert.equal(getContactContext("", slug).proyecto, slug);
    assert.equal(parseAnalyticsEvent({ name: "case_view", properties: { project: slug } })?.properties.project, slug);
    assert.equal(parseAnalyticsEvent({ name: "form_start", properties: { project: slug, location: "contact" } })?.properties.project, slug);
  }
});

/** Lee el tamaño real de la cabecera PNG o del marcador SOF de un JPEG. */
function readSize(file: string) {
  const bytes = readFileSync(join(process.cwd(), "public", file));
  if (bytes[0] === 0x89) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  for (let at = 2; at < bytes.length - 9; ) {
    if (bytes[at] !== 0xff) {
      at += 1;
      continue;
    }
    const marker = bytes[at + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { width: bytes.readUInt16BE(at + 7), height: bytes.readUInt16BE(at + 5) };
    }
    at += 2 + bytes.readUInt16BE(at + 2);
  }
  throw new Error(`Sin cabecera legible: ${file}`);
}

const allShots: Shot[] = [
  ...Object.values(homeShots),
  ...projects.flatMap((project) => project.figures.map((figure) => figure.shot)),
];

test("declared screenshot sizes match the files, so the scene reserves its space", () => {
  for (const shot of allShots) {
    const real = readSize(shot.src);
    assert.deepEqual({ width: shot.width, height: shot.height }, real, shot.src);
  }
});

test("every screenshot describes the screen it shows", () => {
  for (const shot of allShots) {
    assert.ok(shot.alt.length > 20, shot.src);
  }
});

/**
 * La web pública nunca indica el tipo de relación con el proyecto: es criterio
 * interno y aparece solo en el tablero de la propuesta.
 */
test("public copy never states the kind of relationship with a project", () => {
  // Las leyendas llevan solo el nombre del trabajo.
  const labels = projects.flatMap((project) => [
    project.sceneLabel,
    project.metaShort,
    ...project.meta,
    ...project.figures.flatMap((figure) => [figure.legend, figure.legendRight ?? "", figure.captionLabel]),
  ]);
  const inLabels = /producto propio|encargo|proyecto (personal|interno)|piloto|herramienta interna/i;
  for (const label of labels) {
    assert.equal(inLabels.test(label), false, `Rótulo de atribución en una leyenda: «${label}»`);
  }

  // En el cuerpo de texto solo se vetan las clasificaciones explícitas: hablar
  // de «un nuevo encargo» con el lector es legítimo.
  const inBody = /producto propio|proyecto personal|piloto interno|equipo interno|experiencia profesional/i;
  const hit = (JSON.stringify(projects) + JSON.stringify(homeShots)).match(inBody);
  assert.equal(hit, null, `Atribución en el copy público: ${hit?.[0]}`);
});

/** Evento y radio se muestran sin nombre de cliente y sin enlace externo. */
test("only the authorised project links out to its own site", () => {
  const linked = projects.filter((project) => project.externalUrl);
  assert.deepEqual(linked.map((project) => project.slug), ["plataforma-clubes-padel"]);
  for (const project of linked) {
    assert.ok(project.externalLabel, project.slug);
  }
});
