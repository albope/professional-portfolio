import { copyEs } from "@/data/copy";

/**
 * Fila de herramientas del pie de la banda tinta.
 *
 * Cada marca se pinta en monocromo papel sobre la tinta. El logotipo se
 * aplica como máscara CSS sobre el SVG oficial, así que el archivo se sirve
 * tal cual se descargó: no se recolorea por dentro ni se redibuja.
 *
 * `logo` apunta a `public/logos/<archivo>.svg`, descargado de la web o del
 * kit de prensa de cada marca. Mientras una marca no tenga su archivo —o si
 * sus normas no permiten recolorear— el nombre se compone en Fragment Mono,
 * que es la alternativa prevista en el sistema. Para incorporar un logotipo
 * basta con rellenar aquí su `logo` y su `alto`.
 */
export interface Herramienta {
  nombre: string;
  logo?: string;
  /** Alto óptico en píxeles: iguala la presencia visual, no la caja del SVG. */
  alto?: number;
}

const logos: Record<string, { logo: string; alto: number }> = {
  // Pendiente: descargar los SVG oficiales de cada marca.
};

export const herramientas: Herramienta[] = copyEs.como_trabajamos.stack.items.map((nombre) => ({
  nombre,
  ...logos[nombre],
}));

export const hayLogotipos = herramientas.some((item) => item.logo);
