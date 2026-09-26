import assert from "node:assert/strict";
import { test } from "node:test";
import {
  copyEs, partirEnlace, partirFlecha, proyectoDestacado, proyectoTambien, proyectoTarjetas,
  rellenar, servicioCasos, servicioNeeds,
} from "../data/copy";
import { CONTACT_NEEDS, CONTACT_NEEDS_LISTED, CONTACT_PROJECTS, validateContactPayload } from "./contact";
import { nav, site } from "../data/site";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { projects, capturas, getProject } from "../data/projects";

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
 * Mensajes de validación del formulario. Viven en `contact.ts` porque los
 * comparten cliente y servidor, pero se leen en pantalla igual que el copy.
 */
const validacion: Array<[string, string]> = (() => {
  const vacio = validateContactPayload({ nombre: " ", email: " ", mensaje: " " });
  const tipos = validateContactPayload({ nombre: 1, email: "a@b.co", mensaje: "Hola", empresa: 2, telefono: 3 });
  const incompleto = validateContactPayload({ nombre: "Ana", email: "ana@", mensaje: "Hola" });
  return [vacio, tipos, incompleto].flatMap((result, at) =>
    result.ok ? [] : [[`validacion[${at}].error`, result.error], ...strings(result.fields, `validacion[${at}]`)] as Array<[string, string]>,
  );
})();

const visible = [...todo, ...validacion];

/**
 * Errores del envío que llegan del servidor o de la red. Todos ofrecen el
 * email público como salida, para que la consulta no se pierda si el envío
 * falla (el formulario lo pinta como enlace `mailto:`).
 */
const ERRORES_CON_EMAIL = ["preparar", "limite", "no_disponible", "tiempo", "confirmacion", "conexion"] as const;

/**
 * Regla de estilo del sistema: sin punto y coma en ningún texto. Alcanza a
 * los `alt`, `aria-label`, `<title>` de los SVG y metadatos, que también
 * viven en el JSON.
 */
test("no copy string uses a semicolon", () => {
  for (const [path, value] of visible) {
    assert.equal(value.includes(";"), false, `Punto y coma en ${path}: «${value}»`);
  }
});

/** Tampoco rayas ni semirrayas: coma o punto según convenga. */
test("no copy string uses a dash", () => {
  for (const [path, value] of visible) {
    assert.equal(/[—–]/.test(value), false, `Raya en ${path}: «${value}»`);
  }
});

/**
 * Y al email de aviso que genera el formulario (asunto y relleno de los
 * campos vacíos): lo lee Alberto, no el visitante, pero es texto de la web.
 */
test("the notification email uses no dashes", () => {
  for (const file of ["src/lib/contact-server.ts", "src/lib/contact.ts"]) {
    const source = readFileSync(join(process.cwd(), file), "utf8");
    assert.equal(/[—–]/.test(source), false, `Raya en ${file}`);
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
  for (const [path, shot] of Object.entries(capturas)) {
    assert.equal(shot.alt.includes(";"), false, `Punto y coma en capturas.${path}`);
  }
});

/** La web pública nunca indica el tipo de relación con el proyecto. */
test("copy never states the kind of relationship with a project", () => {
  const banned = /producto propio|proyecto personal|piloto interno|equipo interno|encargo/i;
  for (const [path, value] of visible) {
    const hit = value.match(banned);
    assert.equal(hit, null, `Atribución en ${path}: ${hit?.[0]}`);
  }
});

/**
 * Voz «nosotros»: BPM Tech es una sociedad y habla en plural. Se buscan las
 * formas con las que la empresa hablaría en singular («cuéntame», «te
 * ayudo», «me ocupo»...), en todo el copy salvo las piezas dibujadas del
 * hero, que imitan el día a día del visitante.
 */
test("the company never speaks in the first person singular", () => {
  const singular =
    /(?<!\p{L})(cuéntame|cuentame|escríbeme|escribeme|llámame|llamame|pregúntame|háblame|dime|contarme|contármelo|escribirme|llamarme|hablarme|conmigo|te ayudo|puedo ayudarte|te respondo|te preparo|te envío|te escribo|te llamo|te propongo|me ocupo|me encargo|me dedico|trabajo solo|sobre mí|mi equipo|mi estudio|mis proyectos|mis clientes|he desarrollado|he trabajado|he construido|he hecho)(?!\p{L})/iu;
  const dibujado = /^hero\.ilustracion\.[a-z]+\.piezas\./;
  for (const [path, value] of visible) {
    if (dibujado.test(path)) continue;
    const hit = value.match(singular);
    assert.equal(hit, null, `Primera persona del singular en ${path}: «${hit?.[0]}»`);
  }
});

/**
 * Los pronombres sueltos («me», «mí», «yo»...) se buscan solo donde habla la
 * empresa. Las preguntas frecuentes y las píldoras del formulario hablan con
 * la voz del visitante («¿Tengo que cambiar...?», «Todavía no lo tengo
 * claro»), y ahí la primera persona es correcta.
 */
test("company voice carries no first person singular pronouns", () => {
  const pronombre = /(?<!\p{L})(me|mí|yo|mío|mía|míos|mías)(?!\p{L})/iu;
  const vozDelVisitante =
    /^(preguntas\.items\[\d+\]\.pregunta|contacto\.formulario\.tema\.opciones\[\d+\]|hero\.ilustracion\.[a-z]+\.piezas\.)/;
  for (const [path, value] of visible) {
    if (vozDelVisitante.test(path)) continue;
    const hit = value.match(pronombre);
    assert.equal(hit, null, `Pronombre en primera persona en ${path}: «${hit?.[0]}»`);
  }
});

/** Nunca se insinúa una plantilla que no existe ni se justifica el difuminado. */
test("copy never implies a team size or explains the blurring", () => {
  const banned = /nuestro equipo|nuestros (expertos|desarrolladores|profesionales|ingenieros)|equipo de \d+|confidencialidad|para proteger a cada cliente/i;
  for (const [path, value] of visible) {
    const hit = value.match(banned);
    assert.equal(hit, null, `Texto prohibido en ${path}: «${hit?.[0]}»`);
  }
});

/**
 * Solo Padel Club OS lleva nombre y enlace externo, el email público es el
 * único dominio de contacto y Cal.com solo se nombra dentro del diálogo de
 * reserva. Radio, evento, almacén y asistente van sin nombre ni enlace.
 */
test("only the authorised project, email and booking service name a domain", () => {
  const domain = /https?:\/\/|\b[\w.@-]+\.(com|es|net|org|io|app|dev)\b/gi;
  const allowedPaths = [
    "proyectos.destacado.web",
    "contacto.formulario.sin_js",
    ...ERRORES_CON_EMAIL.map((clave) => `contacto.formulario.estados.errores.${clave}`),
    "contacto.lateral.email",
    "reserva.dialogo.lento",
    "reserva.dialogo.fallo",
    "reserva.dialogo.gestion",
    "reserva.dialogo.abrir",
  ];
  const linked = todo.filter(([, value]) => value.match(domain));
  assert.deepEqual(linked.map(([path]) => path).sort(), [...allowedPaths].sort());
  const domains = new Set(linked.flatMap(([, value]) => value.match(domain) ?? []).map((hit) => hit.toLowerCase()));
  assert.deepEqual([...domains].sort(), ["bpmtechstudio@gmail.com", "cal.com", "padelclubos.com"]);
  assert.equal(`https://${copyEs.proyectos.destacado.web}`, proyectoDestacado.web);
});

/**
 * Sin precios, porcentajes, clientes ni plazos inventados. Las únicas cifras
 * de compromiso son «24 h laborables» y la llamada de «30 min» o «30 minutos».
 */
test("copy carries no invented figures", () => {
  const figures = /\d+\s?(€|%|euros?|clientes|empresas|proyectos|años)|\d+\s?(días|semanas|meses) de (entrega|plazo)/i;
  const commitment = /(\d+)\s?(h|horas?|min|minutos?)(?!\p{L})/giu;
  for (const [path, value] of visible) {
    assert.equal(figures.test(value), false, `Cifra inventada en ${path}: «${value}»`);
    for (const match of value.matchAll(commitment)) {
      const ok = (match[1] === "24" && /^24 h laborables/.test(value.slice(match.index))) ||
        (match[1] === "30" && /^(min|minutos)$/.test(match[2]));
      assert.ok(ok, `Cifra de compromiso no autorizada en ${path}: «${match[0]}»`);
    }
  }
});

/**
 * Lista cerrada de cifras: fuera de las piezas dibujadas del hero (la hora de
 * una reserva, las filas numeradas de una hoja) y de la fecha de revisión,
 * ningún texto lleva un número que no sea «24 h laborables», la llamada de
 * «30 min» o los límites de caracteres del formulario.
 */
test("the only figures in the copy are the authorised ones", () => {
  const exentas = /^(hero\.ilustracion\.|meta\.fecha$)/;
  const autorizadas = /24 h laborables|30 (min|minutos)(?!\p{L})|hasta \d+ caracteres/gu;
  for (const [path, value] of visible) {
    if (exentas.test(path)) continue;
    const resto = value.replace(autorizadas, "");
    assert.equal(/\d/.test(resto), false, `Cifra no autorizada en ${path}: «${value}»`);
  }
});

/** Titulares (H1, H2, H3, nombres de paso) y botones no llevan punto final. */
test("headlines and buttons never end with a full stop", () => {
  const headline = /(^|\.)(h1|h2|titulo|nombre|cabecera|leyenda)$/;
  const action = /(^|\.)(cta|cta_corto|boton|consulta|caso|reserva|enlace|menu_reserva|abrir|pausar|reanudar|repetir)$/;
  for (const [path, value] of todo) {
    if (path.startsWith("diagnostico.") || path.startsWith("meta.")) continue;
    if (headline.test(path) || action.test(path) || /^cabecera\.enlaces\[/.test(path)) {
      assert.equal(value.endsWith("."), false, `Punto final en ${path}: «${value}»`);
    }
  }
});

/** Una sola acción principal con un solo nombre (especificación 5.1). */
test("the main action keeps one name across the page", () => {
  const accion = "Hacer una consulta";
  assert.equal(copyEs.cabecera.cta, accion);
  assert.equal(copyEs.servicios.cierre.boton, accion);
  assert.equal(copyEs.metodo.cierre.boton, accion);
  assert.equal(copyEs.pie.cta, accion);
  assert.equal(copyEs.hero.cta, `${accion} gratuita`);
  assert.equal(copyEs.contacto.formulario.boton, "Enviar consulta");
});

/**
 * Las píldoras del formulario son el copy, no una lista paralela: coinciden
 * con `CONTACT_NEEDS_LISTED` en orden y con los rótulos de `CONTACT_NEEDS`,
 * que son también los que llegan en el email de aviso.
 */
test("the form pills match the contact needs", () => {
  const { opciones } = copyEs.contacto.formulario.tema;
  assert.deepEqual(opciones, CONTACT_NEEDS_LISTED.map((need) => CONTACT_NEEDS[need]));
  assert.deepEqual([...CONTACT_NEEDS_LISTED].sort(), Object.keys(CONTACT_NEEDS).sort());
  assert.equal(CONTACT_NEEDS.diagnostico, "Todavía no lo tengo claro");
});

/** Cada servicio preselecciona un tema del formulario y enlaza a un caso de la página. */
test("services point at real contact needs and project anchors", () => {
  assert.equal(copyEs.servicios.items.length, servicioNeeds.length);
  assert.equal(copyEs.servicios.items.length, servicioCasos.length);
  for (const need of servicioNeeds) assert.ok(Object.hasOwn(CONTACT_NEEDS, need), need);
  const anclas = [proyectoDestacado.ancla, ...proyectoTarjetas.map((tarjeta) => tarjeta.ancla)].map((ancla) => `#${ancla}`);
  for (const caso of servicioCasos) assert.ok(anclas.includes(caso), caso);
});

/** Destacado, tarjetas y mención menor enlazan a fichas que existen. */
test("projects point at real case pages and contact references", () => {
  assert.equal(copyEs.proyectos.tarjetas.length, proyectoTarjetas.length);
  const slugs = [proyectoDestacado.slug, ...proyectoTarjetas.map((tarjeta) => tarjeta.slug), proyectoTambien.slug];
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) {
    assert.ok(getProject(slug), `Sin ficha: ${slug}`);
    assert.ok(Object.hasOwn(CONTACT_PROJECTS, slug), `Sin referencia de contacto: ${slug}`);
  }
  for (const tarjeta of copyEs.proyectos.tarjetas) {
    assert.ok(tarjeta.alt_principal.length > 20, tarjeta.titulo);
  }
});

/** Las listas tienen la longitud que pide la especificación. */
test("the page copy is complete", () => {
  assert.equal(copyEs.cabecera.enlaces.length, 5);
  assert.deepEqual(nav.map((item) => item.id), [
    "que-hacemos", "proyectos", "como-trabajamos", "quienes-somos", "preguntas",
  ]);
  assert.equal(copyEs.hero.compromisos.items.length, 4);
  assert.equal(copyEs.hero.ilustracion.escritorio.filas.length, 4);
  assert.equal(copyEs.hero.ilustracion.movil.filas.length, 3);
  assert.equal(copyEs.hero.ilustracion.escritorio.menu.length, 5);
  assert.equal(copyEs.metodo.pasos.length, 4);
  assert.equal(copyEs.metodo.propuesta.lineas.length, 4);
  assert.equal(copyEs.preguntas.items.length, 7);
  assert.equal(copyEs.contacto.lateral.pasos.length, 3);
  assert.equal(copyEs.sobre.ficha.length, 4);
  assert.equal(copyEs.proyectos.destacado.ficha.length, 3);
});

/**
 * Hay frases que se pintan partidas en dos porque un trozo es enlace: el
 * aviso legal enlaza «política de privacidad», la nota de Preguntas enlaza
 * «Escríbenos», el aviso sin JS y la línea lateral enlazan el email. Si el
 * trozo desaparece de la frase, el enlace se pierde sin que se note.
 */
test("copy keeps the fragments its links are painted over", () => {
  const { formulario, lateral } = copyEs.contacto;
  const casos: Array<[string, string]> = [
    [formulario.aviso, formulario.aviso_enlace],
    [formulario.sin_js, site.email],
    [formulario.sin_js, formulario.sin_js_reserva],
    [lateral.email, site.email],
    [copyEs.preguntas.nota, copyEs.preguntas.nota_enlace],
    ...ERRORES_CON_EMAIL.map((clave): [string, string] => [formulario.estados.errores[clave], site.email]),
  ];
  for (const [frase, fragmento] of casos) {
    const partes = partirEnlace(frase, fragmento);
    assert.equal(partes.enlace, fragmento, `«${fragmento}» ya no está en «${frase}»`);
    assert.equal(partes.antes + partes.enlace + partes.despues, frase);
  }
});

/** Las plantillas conservan sus huecos. */
test("copy templates keep their placeholders", () => {
  assert.match(copyEs.pie.copyright, /\{anio\}/);
  assert.equal(rellenar(copyEs.pie.copyright, { anio: 2027 }).includes("2027"), true);
  const { errores } = copyEs.contacto.formulario.estados;
  assert.match(errores.limite, /\{espera\}/);
  assert.match(errores.espera_minutos, /\{minutos\}/);
  assert.equal(rellenar(errores.espera_minutos, { minutos: 3 }), "Espera 3 min antes de enviar otra.");
  assert.equal(rellenar("Hola {nadie}", {}), "Hola {nadie}");
  assert.match(copyEs.meta.titulo_plantilla, /%s/);
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

/** El enlace se encuentra sin mirar mayúsculas ni tildes y conserva el texto original. */
test("a link fragment is found regardless of case and accents", () => {
  assert.deepEqual(partirEnlace("Lee la Política de privacidad.", "politica de privacidad"), {
    antes: "Lee la ", enlace: "Política de privacidad", despues: ".",
  });
  assert.deepEqual(partirEnlace("Sin enlace", "otra cosa"), { antes: "Sin enlace", enlace: "", despues: "" });
  assert.deepEqual(partirEnlace("Texto", ""), { antes: "Texto", enlace: "", despues: "" });
});

/**
 * Las páginas legales escriben su texto en la propia página (nombran Cal.com
 * y enlazan a sus políticas, que la regla de dominios del JSON rechazaría).
 * Aun así se leen en pantalla: mismas reglas de puntuación, de voz y de
 * relación con los proyectos que el resto del copy.
 */
test("the legal pages follow the same copy rules", () => {
  for (const page of ["aviso-legal", "privacidad"]) {
    const source = readFileSync(join(process.cwd(), "src/app", page, "page.tsx"), "utf8");
    const texto = [...source.matchAll(/>([^<>{}]*\p{L}[^<>{}]*)</gu)].map((match) => match[1].replace(/\s+/g, " ").trim());
    assert.ok(texto.length > 10, `Sin texto legible en ${page}`);
    for (const frase of texto) {
      assert.equal(/[;—–]/.test(frase), false, `Signo no permitido en ${page}: «${frase}»`);
      assert.equal(/producto propio|proyecto personal|piloto interno|equipo interno|encargo|nuestro equipo/i.test(frase), false, `${page}: «${frase}»`);
      assert.equal(/(?<!\p{L})(cuéntame|escríbeme|contarme|escribirme|te ayudo|puedo ayudarte|mis proyectos)(?!\p{L})/iu.test(frase), false, `Primera persona del singular en ${page}: «${frase}»`);
    }
  }
});
