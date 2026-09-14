import copy from "./copy.json";

/**
 * Copy definitivo de la web pública. El texto vive en `copy.json` y las
 * secciones lo leen desde aquí: ningún componente escribe copy propio.
 *
 * Regla de estilo del sistema: sin punto y coma en ningún texto, punto o coma
 * según convenga. `copy.test.ts` la vigila sobre el JSON entero.
 */
export const copyEs = copy;

export type Copy = typeof copy;
export type ProyectoItem = Copy["proyectos"]["items"][number];
export type ServicioItem = Copy["servicios"]["items"][number];
export type Fase = Copy["metodo"]["fases"][number];
export type Pilar = Copy["como_trabajamos"]["pilares"][number];

/**
 * Los cuatro proyectos de la rejilla en el orden del copy, emparejados con el
 * caso del que cuelgan. El destacado (Padel Club OS) va aparte, en el hero.
 */
export const proyectoSlugs = [
  "wms-almacen",
  "web-boda",
  "web-radio",
  "asistente-ia-gestion-proyectos",
] as const;

/** Las tres filas de «¿Qué te está frenando?» apuntan a su necesidad del formulario. */
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
 * El titular del hero se compone en tres líneas fijas más la línea animada.
 * El corte se declara en palabras por línea y no como cadenas sueltas, para
 * que `copy.test.ts` pueda comprobar que reconstruyen `hero.h1_fijo` entero.
 */
const CORTE_H1 = [2, 2, 2];

export function lineasDelTitular(frase = copy.hero.h1_fijo): string[] {
  const palabras = frase.split(" ");
  let desde = 0;
  return CORTE_H1.map((cuantas) => palabras.slice(desde, (desde += cuantas)).join(" "));
}
