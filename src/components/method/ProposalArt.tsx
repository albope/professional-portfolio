import type { CSSProperties } from "react";
import type { Copy } from "@/data/copy";
import s from "./ProposalArt.module.css";

/** Una fila cada 58 unidades desde la primera, en y 132. */
const PRIMERA_FILA = 132;
const PASO = 58;

/**
 * Las dos barras de texto simulado bajo cada punto de la propuesta, en el
 * orden de `copy.metodo.propuesta.lineas`. Anchos del prototipo: que no
 * midan lo mismo es lo que las hace leerse como texto.
 */
const BARRAS: ReadonlyArray<readonly [number, number]> = [
  [150, 112],
  [132, 96],
  [140, 84],
  [124, 70],
];

type ProposalArtProps = Copy["metodo"]["propuesta"];

/**
 * Propuesta por escrito (especificación 4.7): una hoja `dark-2` con otra
 * desplazada detrás, la cabecera «Propuesta» con el glifo del logo en su
 * versión oscura y cuatro puntos (alcance, precio cerrado, plazo y soporte).
 * Cada punto lleva a la derecha la casilla hueca del glifo y, encima, el
 * cuadrado macizo `cobalt-bright`: «hueco = pendiente, macizo = hecho».
 *
 * El marcado es la hoja con las cuatro casillas macizas, que es lo que ve
 * quien no tiene JS o pide menos movimiento. Con movimiento, `PlayOnView` la
 * arma y la dispara: cada línea entra desde 8 px a la izquierda y su casilla
 * se rellena con un pequeño rebote, una tras otra (unos 2 s).
 *
 * Todo el texto dibujado viene del copy. El `title` describe la hoja entera,
 * así que el SVG es una sola imagen para los lectores de pantalla.
 */
export function ProposalArt({ titulo, cabecera, subtitulo, lineas }: ProposalArtProps) {
  return (
    <svg className="block h-auto w-full" viewBox="0 0 380 372" role="img" aria-labelledby="propuesta-titulo">
      <title id="propuesta-titulo">{titulo}</title>
      {/* Segunda hoja, detrás: solo el borde. */}
      <rect x="54.5" y="26.5" width="300" height="340" rx="8" className="fill-none stroke-on-dark/[.12]" />
      <rect x="36.5" y="10.5" width="300" height="340" rx="8" className="fill-dark-2 stroke-on-dark/[.28]" />

      <text className="fill-on-dark text-[21px] font-semibold tracking-[-0.01em]" x="64" y="54">
        {cabecera}
      </text>
      <text className="fill-on-dark-2 text-[13px]" x="64" y="76">
        {subtitulo}
      </text>
      {/* Glifo del logo sobre oscuro: barra, cuadrado hueco y cuadrado macizo. */}
      <rect x="258" y="45" width="11" height="3" className="fill-on-dark" />
      <rect x="276" y="42" width="9" height="9" strokeWidth="2" className="fill-none stroke-on-dark" />
      <rect x="292" y="41" width="11" height="11" className="fill-cobalt-bright" />
      <path d="M64 98.5H308" className="stroke-on-dark/20" />

      {lineas.map((linea, i) => {
        const y = PRIMERA_FILA + i * PASO;
        const orden = { "--i": i } as CSSProperties;
        const [larga, corta] = BARRAS[i] ?? BARRAS[0];
        return (
          <g key={linea}>
            <g className={s.line} style={orden}>
              <text className="fill-on-dark text-[15.5px] font-medium" x="64" y={y}>
                {linea}
              </text>
              <rect x="64" y={y + 12} width={larga} height="4" rx="2" className="fill-on-dark/[.16]" />
              <rect x="64" y={y + 22} width={corta} height="4" rx="2" className="fill-on-dark/[.16]" />
            </g>
            <rect x="287" y={y - 13} width="16" height="16" strokeWidth="2" className="fill-none stroke-on-dark/50" />
            <rect x="286" y={y - 14} width="18" height="18" className={`${s.tick} fill-cobalt-bright`} style={orden} />
          </g>
        );
      })}
    </svg>
  );
}
