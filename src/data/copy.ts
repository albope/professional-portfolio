import copy from "./copy.json";

/**
 * Copy definitivo de la web pública. El texto vive en `copy.json` y los
 * componentes lo leen desde aquí: ningún componente escribe copy propio, ni
 * siquiera `alt`, `aria-label`, el `<title>` de un SVG o el texto dibujado
 * dentro de una ilustración.
 *
 * `copy.json` va en el orden de la página: `meta`, `comun`, `cabecera`,
 * `hero`, `servicios`, `proyectos`, `metodo`, `sobre`, `preguntas`,
 * `contacto`, `reserva` (diálogo de Cal.com) y `pie`. Después, los rótulos
 * comunes de las fichas de proyecto (`ficha`, el caso de cada una vive en
 * `projects.ts`) y la página no encontrada (`no_encontrada`). El bloque
 * `diagnostico` es del asistente, que ya no se monta pero sigue compilando.
 *
 * Reglas de estilo que vigila `copy.test.ts` sobre el JSON entero: sin punto y
 * coma ni rayas, voz «nosotros» sin primera persona del singular, sin cifras
 * inventadas y sin decir qué relación hay con cada proyecto. Los titulares y
 * los botones no llevan punto final.
 */
export const copyEs = copy;

export type Copy = typeof copy;
export type ServicioItem = Copy["servicios"]["items"][number];
export type ProyectoTarjeta = Copy["proyectos"]["tarjetas"][number];
export type PasoMetodo = Copy["metodo"]["pasos"][number];

/**
 * Cada servicio lleva al formulario con su tema preseleccionado
 * (`/?necesidad=<clave>#contacto`) y enlaza al caso que lo demuestra. Van en
 * el orden de `copy.servicios.items`.
 */
export const servicioNeeds = ["operativa", "automatizacion", "web"] as const;
export const servicioCasos = ["#padel", "#evento", "#radio"] as const;

/** Padel Club OS: el único proyecto con nombre y enlace externo. */
export const proyectoDestacado = {
  ancla: "padel",
  slug: "plataforma-clubes-padel",
  web: "https://padelclubos.com",
} as const;

/** Las tres tarjetas, en el orden de `copy.proyectos.tarjetas`. */
export const proyectoTarjetas = [
  { ancla: "almacen", slug: "wms-almacen" },
  { ancla: "radio", slug: "web-radio" },
  { ancla: "evento", slug: "web-boda" },
] as const;

/** La mención menor «También:». */
export const proyectoTambien = { slug: "asistente-ia-gestion-proyectos" } as const;

/*
 * Utilidades puras del copy. Viven en `@/lib/copy-helpers`, que no importa el
 * JSON: los componentes cliente deben importarlas de allí para no meter
 * `copy.json` entero en el JS del navegador.
 */
export { partirEnlace, partirFlecha, rellenar, type Flecha } from "@/lib/copy-helpers";
