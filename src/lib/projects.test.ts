import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { test } from "node:test";
import { projects, capturas, type Rect, type Shot } from "../data/projects";
import { proyectoDestacado } from "../data/copy";
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

/** Cada captura que pinta una ficha: la principal, la del móvil y las de los detalles. */
const figureShots: Shot[] = projects.flatMap((project) => [
  project.figure.shot,
  ...("phone" in project.figure ? [project.figure.phone] : []),
  ...project.details.map((detail) => detail.shot),
]);

const allShots: Shot[] = [...Object.values(capturas), ...figureShots];

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
  const declared = new Set(Object.values(capturas).map((shot) => shot.src));
  for (const file of served) assert.ok(declared.has(file), `Archivo público sin declarar: ${file}`);
  // Y al revés: las fichas solo pintan capturas del catálogo.
  for (const shot of figureShots) assert.ok(declared.has(shot.src), `Captura fuera del catálogo: ${shot.src}`);
});

test("every screenshot describes the screen it shows", () => {
  for (const shot of allShots) {
    assert.ok(shot.alt.length > 20, shot.src);
  }
});

const within = (rect: Rect, shot: Shot) =>
  rect.x >= 0 && rect.y >= 0 && rect.w > 0 && rect.h > 0 && rect.x + rect.w <= shot.width && rect.y + rect.h <= shot.height;

/**
 * Un recorte fuera de la imagen deja el marco con un hueco vacío. Vale para
 * los detalles de interfaz, para la franja del evento y para su detalle
 * ampliado.
 */
test("detail crops, the event strip and its zoom stay inside their screenshots", () => {
  for (const project of projects) {
    for (const detail of project.details) {
      if (detail.variant === "recorte") assert.ok(within(detail.crop, detail.shot), `${project.slug} ${detail.label}`);
    }
    const { figure } = project;
    if (figure.layout === "franja") {
      assert.ok(within({ x: 0, y: 0, w: figure.shot.width, h: figure.strip }, figure.shot), `${project.slug} franja`);
      assert.ok(within(figure.zoom, figure.shot), `${project.slug} detalle ampliado`);
    }
  }
});

/** Todo el texto de las fichas, con la ruta donde vive. */
function strings(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, at) => strings(item, `${path}[${at}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => strings(item, path ? `${path}.${key}` : key));
  }
  return [];
}

/**
 * Lo que se lee en pantalla: todo menos rutas de archivo y URL. Incluye el
 * catálogo de capturas entero, también las que hoy no pinta ninguna página.
 */
const visible = [...strings(projects), ...strings(capturas, "capturas")].filter(
  ([path]) => !/(\.src|externalUrl|\.slug|^\[\d+\]\.slug)$/.test(path),
);

/**
 * La web pública nunca indica el tipo de relación con el proyecto: es criterio
 * interno. Tampoco «encargo», que en una ficha se lee como clasificación.
 */
test("project copy never states the kind of relationship with a project", () => {
  const banned = /producto propio|proyecto personal|piloto interno|equipo interno|encargo|experiencia profesional|herramienta interna/i;
  for (const [path, value] of visible) {
    const hit = value.match(banned);
    assert.equal(hit, null, `Atribución en projects${path}: ${hit?.[0]}`);
  }
});

/** Sin punto y coma ni rayas, como el resto del copy. */
test("project copy uses no semicolons or dashes", () => {
  for (const [path, value] of visible) {
    assert.equal(/[;—–]/.test(value), false, `Signo no permitido en projects${path}: «${value}»`);
  }
});

/**
 * Voz «nosotros»: BPM Tech es una sociedad y habla en plural también en las
 * fichas («Cuéntanos», «empezamos», «revisamos»). Se vetan las formas con las
 * que la empresa hablaría en singular, incluidos los condicionales que usaba
 * la versión anterior («empezaría», «revisaría»).
 */
test("project copy never speaks in the first person singular", () => {
  const singular =
    /(?<!\p{L})(cuéntame|cuentame|escríbeme|llámame|dime|contarme|escribirme|conmigo|te ayudo|puedo|me|mí|yo|mi|mis|empezaría|revisaría|haría|propondría|recomendaría|he desarrollado|he trabajado|he construido|he hecho)(?!\p{L})/iu;
  for (const [path, value] of visible) {
    const hit = value.match(singular);
    assert.equal(hit, null, `Primera persona del singular en projects${path}: «${hit?.[0]}»`);
  }
});

/**
 * Solo Padel Club OS lleva nombre propio y enlace externo, y es el mismo que
 * enlaza la portada. Evento, radio, almacén y asistente van sin nombre de
 * cliente ni enlace, y ningún texto nombra otro dominio.
 */
test("only the authorised project links out to its own site", () => {
  const linked = projects.filter((project) => project.externalUrl);
  assert.deepEqual(linked.map((project) => project.slug), ["plataforma-clubes-padel"]);
  assert.equal(linked[0].externalUrl, proyectoDestacado.web);
  assert.equal(`https://${linked[0].externalLabel}`, proyectoDestacado.web);
  const domain = /https?:\/\/|\b[\w.@-]+\.(com|es|net|org|io|app|dev)\b/i;
  for (const [path, value] of visible) {
    if (path.endsWith("externalLabel")) continue;
    assert.equal(domain.test(value), false, `Dominio en projects${path}: «${value}»`);
  }
});

/** Titulares y rótulos sin punto final, como en la portada. */
test("project names and kickers never end with a full stop", () => {
  for (const project of projects) {
    for (const value of [project.name, project.kicker, project.title]) {
      assert.equal(value.endsWith("."), false, `${project.slug}: «${value}»`);
    }
  }
});

/**
 * Sin precios, porcentajes, clientes ni plazos inventados, tampoco en las
 * fichas. Las únicas cifras de compromiso son «24 h laborables» y la llamada
 * de 30 minutos. Nunca se insinúa una plantilla ni se justifica el
 * difuminado de las capturas.
 */
test("project copy carries no invented figures, team size or blurring excuses", () => {
  const figures = /\d+\s?(€|%|euros?|clientes|empresas|proyectos|años|horas?|h|min|minutos|días|semanas|meses)(?!\p{L})/iu;
  const banned = /nuestro equipo|nuestros (expertos|desarrolladores|profesionales|ingenieros)|equipo de \d+|confidencialidad|para proteger a cada cliente/i;
  for (const [path, value] of visible) {
    assert.equal(figures.test(value), false, `Cifra en projects${path}: «${value}»`);
    assert.equal(banned.test(value), false, `Texto prohibido en projects${path}: «${value}»`);
  }
});

/**
 * «Proyecto de referencia: …» en el formulario y en el email de aviso usa el
 * mismo nombre que el titular de la ficha desde la que se llega.
 */
test("the contact reference names each project as its case page does", () => {
  for (const project of projects) {
    assert.equal(CONTACT_PROJECTS[project.slug], project.name, project.slug);
  }
  assert.deepEqual(Object.keys(CONTACT_PROJECTS).sort(), projects.map((project) => project.slug).sort());
});
