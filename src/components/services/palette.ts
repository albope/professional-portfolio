import type { CSSProperties } from "react";
import { color as token, dibujo } from "@/lib/palette";

/**
 * Colores de las ilustraciones de «Qué hacemos»: la paleta común
 * (`@/lib/palette`, porque van en atributos de presentación del SVG, que no
 * leen variables CSS) más los dos tonos de papel con el nombre que usan los
 * dibujos: `trazo`, la arena oscura de las barras de texto simulado y de la
 * conexión punteada, y `direccion`, la píldora vacía de la barra del
 * navegador.
 */
export const color = {
  ...token,
  trazo: dibujo.trazo,
  direccion: dibujo.pastilla,
} as const;

/** `--i` de cada pieza, para escalonar sus retrasos en el CSS Module. */
export function orden(i: number) {
  return { "--i": i } as CSSProperties;
}
