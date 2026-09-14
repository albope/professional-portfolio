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
