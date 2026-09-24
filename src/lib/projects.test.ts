import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { test } from "node:test";
import { projects, homeShots, type Shot } from "../data/projects";
import { allPlates, type Rect } from "../data/plates";
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

const within = (rect: Rect, shot: Shot) =>
  rect.x >= 0 && rect.y >= 0 && rect.w > 0 && rect.h > 0 && rect.x + rect.w <= shot.width && rect.y + rect.h <= shot.height;
const contains = (rect: Rect, [x, y]: [number, number]) =>
  x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;

/** Un recorte fuera de la imagen deja la hoja con un hueco vacío. */
test("plate crops stay inside their screenshots", () => {
  for (const plate of allPlates) {
    for (const view of plate.views) {
      assert.ok(within(view.desktop, view.shot), `${plate.num} ${view.shot.src} escritorio`);
      if (view.mobile) assert.ok(within(view.mobile, view.shot), `${plate.num} ${view.shot.src} móvil`);
      if (view.tablet) assert.ok(within(view.tablet, view.shot), `${plate.num} ${view.shot.src} tablet`);
    }
  }
});

/**
 * Cada nota numerada tiene su llamada visible en las dos composiciones: una
 * nota sin marcador rompe la lectura del plano. En la hoja apilada (por debajo
 * de 1024 px) la nota puede pasar a otra vista y cambiar de anclaje, y solo
 * se queda sin marcador si lo declara con `mobileMarker: false`. Las notas se
 * numeran desde 1 sin saltos.
 *
 * Segunda pasada del rediseño: el modelo pasó de un solo anclaje por nota a
 * uno por composición, con vistas propias de cada una (`only`). La prueba
 * sigue exigiendo lo mismo, un marcador dentro del recorte que se ve.
 */
test("every plate note has a visible callout in both compositions", () => {
  for (const plate of allPlates) {
    assert.deepEqual(plate.notes.map((note) => note.n), plate.notes.map((_, index) => index + 1), plate.num);
    for (const note of plate.notes) {
      const desktop = plate.views[note.view];
      assert.ok(desktop && desktop.only !== "mobile", `${plate.num}.${note.n} sin vista de escritorio`);
      assert.ok(contains(desktop.desktop, note.at), `${plate.num}.${note.n} fuera del recorte de escritorio`);
      if (note.mobileMarker === false) continue;
      const mobile = plate.views[note.mobileView ?? note.view];
      assert.ok(mobile && mobile.only !== "desktop", `${plate.num}.${note.n} sin vista apilada`);
      const at = note.mobileAt ?? note.at;
      assert.ok(contains(mobile.mobile ?? mobile.desktop, at), `${plate.num}.${note.n} fuera del recorte apilado`);
      if (mobile.tablet) assert.ok(contains(mobile.tablet, at), `${plate.num}.${note.n} fuera del recorte de tablet`);
    }
    // Cada composición enseña al menos una captura.
    assert.ok(plate.views.some((view) => view.only !== "mobile"), `${plate.num} sin captura de escritorio`);
    assert.ok(plate.views.some((view) => view.only !== "desktop"), `${plate.num} sin captura apilada`);
  }
});

/**
 * Una captura tomada a 1x no se amplía: el ancho máximo declarado no supera
 * el del recorte.
 */
test("plate width caps never enlarge a crop", () => {
  for (const plate of allPlates) {
    for (const view of plate.views) {
      if (view.max) assert.ok(view.max <= view.desktop.w, `${plate.num} ${view.shot.src} max`);
      if (view.mobileMax) assert.ok(view.mobileMax <= (view.mobile ?? view.desktop).w, `${plate.num} ${view.shot.src} mobileMax`);
      if (view.tabletMax) assert.ok(view.tabletMax <= (view.tablet ?? view.mobile ?? view.desktop).w, `${plate.num} ${view.shot.src} tabletMax`);
    }
  }
});

/** Las láminas cuelgan de casos reales y solo Padel Club OS enlaza fuera. */
test("plates belong to real cases and only the authorised one links out", () => {
  for (const plate of allPlates) assert.ok(projects.some((project) => project.slug === plate.slug), plate.slug);
  const outbound = [...new Set(allPlates.flatMap((plate) => plate.block.filter((entry) => entry.href).map((entry) => `${plate.slug} ${entry.href}`)))];
  assert.deepEqual(outbound, ["plataforma-clubes-padel https://www.padelclubos.com"]);
});

/**
 * Las notas describen decisiones: sin rótulos de relación ni cifras de
 * negocio. «Datos de demo» solo donde la captura los usa.
 */
test("plate text never states the relationship, invented figures or demo data it lacks", () => {
  const text = JSON.stringify(allPlates.map((plate) => [plate.notes, plate.block, plate.caption, plate.views.map((view) => view.alt)]));
  const hit = text.match(/producto propio|proyecto personal|piloto|encargo|cliente|\d+\s?(%|€)/i);
  assert.equal(hit, null, `Texto no permitido en una lámina: ${hit?.[0]}`);
  const demo = allPlates.filter((plate) => /datos de demo/i.test(plate.caption)).map((plate) => plate.slug);
  assert.deepEqual([...new Set(demo)].sort(), ["plataforma-clubes-padel", "wms-almacen"]);
});
