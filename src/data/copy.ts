import copy from "./copy.json";

/**
 * Copy definitivo de la web pública. El texto vive en `copy.json` y las
 * secciones lo leen desde aquí: ningún componente escribe copy propio.
 *
 * Reglas de estilo del sistema: sin punto y coma ni rayas en ningún texto,
 * punto o coma según convenga, y las flechas al final. `copy.test.ts` las
 * vigila sobre el JSON entero.
 */
export const copyEs = copy;

export type Copy = typeof copy;
export type ProyectoItem = Copy["proyectos"]["items"][number];
export type ServicioItem = Copy["servicios"]["items"][number];
export type Fase = Copy["metodo"]["fases"][number];

/**
 * Los cinco proyectos en el orden de su numeración (01 a 05), emparejados
 * con el caso del que cuelgan. El 01 abre la portada anotado en el hero.
 */
export const proyectoSlugs = [
  "plataforma-clubes-padel",
  "wms-almacen",
  "web-radio",
  "web-boda",
  "asistente-ia-gestion-proyectos",
] as const;

/** Número público de cada proyecto: «01» a «05». */
export const proyectoNum = (slug: (typeof proyectoSlugs)[number]) =>
  String(proyectoSlugs.indexOf(slug) + 1).padStart(2, "0");

/**
 * Los tres servicios llevan su necesidad al formulario de contacto.
 */
export const servicioNeeds = ["operativa", "automatizacion", "web"] as const;

export type Flecha = "→" | "↗" | "↓";

/**
 * El copy trae la flecha pegada al texto. La separamos para que el componente
 * la pinte aparte: allí va en `aria-hidden` y se separa al pasar el ratón,
 * cosa que no puede hacer si viaja dentro de la cadena.
 */
export function partirFlecha(label: string): { texto: string; flecha?: Flecha } {
  const match = label.match(/ ([→↗↓])$/);
  if (!match) return { texto: label };
  return { texto: label.slice(0, -2), flecha: match[1] as Flecha };
}

/**
 * La última palabra de un titular clave termina en cuadrado cobalto. Se
 * separa aquí para que el componente la envuelva junto al cuadrado en
 * `nowrap` sin reescribir el texto.
 */
export function partirUltimaPalabra(frase: string): { antes: string; ultima: string } {
  const at = frase.lastIndexOf(" ");
  if (at === -1) return { antes: "", ultima: frase };
  return { antes: frase.slice(0, at + 1), ultima: frase.slice(at + 1) };
}
