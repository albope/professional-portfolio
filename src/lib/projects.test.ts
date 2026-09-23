import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { test } from "node:test";
import { projects, homeShots, type Shot } from "../data/projects";
import { padelPlate, almacenPlate, radioPlate, strips, type Rect } from "../data/plates";
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

/**
 * Un archivo de `public/` se descarga aunque ninguna página lo muestre. Cada
 * captura publicada debe estar declarada en los datos, así que un original
 * sin anonimizar no puede quedarse servido por olvido.
 */
test("every file served under public/proyectos is a declared screenshot", () => {
  const root = join(process.cwd(), "public", "proyectos");
  const served = readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `/proyectos/${relative(root, join(entry.parentPath, entry.name)).split(sep).join("/")}`);
  const declared = new Set(allShots.map((shot) => shot.src));
  for (const file of served) assert.ok(declared.has(file), `Archivo público sin declarar: ${file}`);
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

const plates = [padelPlate, almacenPlate, radioPlate];
const within = (rect: Rect, shot: Shot) =>
  rect.x >= 0 && rect.y >= 0 && rect.w > 0 && rect.h > 0 && rect.x + rect.w <= shot.width && rect.y + rect.h <= shot.height;
const contains = (rect: Rect, [x, y]: [number, number]) =>
  x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;

/** Un recorte fuera de la imagen deja el escenario con un hueco vacío. */
test("plate and strip crops stay inside their screenshots", () => {
  for (const plate of plates) {
    for (const view of plate.views) {
      assert.ok(within(view.desktop, view.shot), `${plate.num} ${view.shot.src} escritorio`);
      if (view.mobile) assert.ok(within(view.mobile, view.shot), `${plate.num} ${view.shot.src} móvil`);
    }
  }
  for (const strip of strips) assert.ok(within(strip.crop, strip.shot), strip.slug);
});

/**
 * Cada nota numerada tiene su marcador visible en escritorio y en móvil: una
 * nota sin marcador en la captura rompe la lectura del plano.
 */
test("every plate note has a visible marker at both crops", () => {
  for (const plate of plates) {
    assert.deepEqual(plate.notes.map((note) => note.n), [1, 2, 3], plate.num);
    for (const note of plate.notes) {
      const view = plate.views[note.view];
      assert.ok(view, `${plate.num}.${note.n} sin vista`);
      assert.ok(contains(view.desktop, note.at), `${plate.num}.${note.n} fuera del recorte de escritorio`);
      assert.ok(contains(view.mobile ?? view.desktop, note.at), `${plate.num}.${note.n} fuera del recorte móvil`);
    }
  }
});

/** Las láminas cuelgan de casos reales y solo Padel Club OS enlaza fuera. */
test("plates belong to real cases and only the authorised one links out", () => {
  for (const plate of plates) assert.ok(projects.some((project) => project.slug === plate.slug), plate.slug);
  for (const strip of strips) assert.ok(projects.some((project) => project.slug === strip.slug), strip.slug);
  const outbound = plates.flatMap((plate) => plate.block.filter((entry) => entry.href).map((entry) => `${plate.slug} ${entry.href}`));
  assert.deepEqual(outbound, ["plataforma-clubes-padel https://www.padelclubos.com"]);
});

/** Las notas describen decisiones: sin rótulos de relación ni cifras de negocio. */
test("plate notes never state the relationship or invented figures", () => {
  const text = JSON.stringify([plates.map((plate) => [plate.notes, plate.block]), strips.map((strip) => strip.note)]);
  const hit = text.match(/producto propio|proyecto personal|piloto|encargo|cliente|\d+\s?(%|€)/i);
  assert.equal(hit, null, `Texto no permitido en una lámina: ${hit?.[0]}`);
});
