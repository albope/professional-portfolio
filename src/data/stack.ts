import { copyEs } from "@/data/copy";

/**
 * Fila de herramientas del pie de la banda tinta.
 *
 * Cada marca se pinta en monocromo papel sobre la tinta. El logotipo se
 * aplica como máscara CSS sobre el SVG oficial, así que el archivo se sirve
 * tal cual se descargó: no se recolorea por dentro ni se redibuja.
 *
 * `logo` apunta a `public/logos/<archivo>.svg`. Mientras una marca no tenga
 * su archivo, el nombre se compone en Fragment Mono, que es la alternativa
 * prevista en el sistema.
 *
 * Python, OpenAI y AWS piden autorización para recolorear su marca o
 * reservan su wordmark. Alberto Bort decidió publicarlas igualmente en
 * septiembre de 2026 y asume esa responsabilidad; queda anotado aquí para
 * que la decisión no se dé por revisada con las marcas.
 *
 * Cada marca ocupa exactamente su caja: el ancho sale del `ratio` del
 * viewBox del archivo, no de la rejilla. Así el espacio entre marcas es
 * uniforme y ninguna se encoge para caber en una columna ajena.
 */
export interface Herramienta {
  nombre: string;
  logo?: string;
  /** Alto óptico en píxeles: iguala la presencia visual, no la caja del SVG. */
  alto?: number;
  /** Ancho resultante en píxeles, derivado del alto óptico y del viewBox. */
  ancho?: number;
}

/** `ratio` es el ancho partido por el alto del viewBox de cada archivo. */
const logos: Record<string, { logo: string; alto: number; ratio: number }> = {
  "Next.js": { logo: "/logos/nextjs.svg", alto: 20, ratio: 394 / 80 },
  React: { logo: "/logos/react.svg", alto: 22, ratio: 21 / 18.9 },
  Supabase: { logo: "/logos/supabase.svg", alto: 18, ratio: 581 / 113 },
  Python: { logo: "/logos/python.svg", alto: 22, ratio: 1 },
  Anthropic: { logo: "/logos/anthropic.svg", alto: 22, ratio: 35 / 24 },
  OpenAI: { logo: "/logos/openai.svg", alto: 22, ratio: 1 },
  AWS: { logo: "/logos/aws.svg", alto: 25, ratio: 24 / 14.36 },
};

export const herramientas: Herramienta[] = copyEs.como_trabajamos.stack.items.map((nombre) => {
  const marca = logos[nombre];
  if (!marca) return { nombre };
  const { ratio, ...resto } = marca;
  return { nombre, ...resto, ancho: Math.round(resto.alto * ratio * 10) / 10 };
});

export const hayLogotipos = herramientas.some((item) => item.logo);
