import React from "react";
import {OS_CHIP, OS_GLYPHS, OS_GLYPHS_OFFSET, WORDMARK_GLYPHS} from "./logoPaths";
import {color} from "./tokens";

type Tone = "light" | "dark";

const palette = (tone: Tone) =>
  tone === "light"
    ? {stroke: color.ink900, block: color.green600, glyph: color.ink900, chip: color.green600, chipText: color.sand50}
    : {stroke: color.darkText, block: color.green400, glyph: color.darkText, chip: color.green400, chipText: color.green900};

export interface IsotipoProps {
  size?: number;
  tone?: Tone;
  /** 0→1: dibuja el contorno del rectángulo. */
  outline?: number;
  /** 0→1: el bloque verde entra desde la izquierda y crece. */
  block?: number;
  /** Desplaza el bloque verde a lo ancho del marco (0 = izquierda, 1 = derecha). */
  blockSlide?: number;
  style?: React.CSSProperties;
}

/**
 * Isotipo oficial: rectángulo redondeado 40×28 (rx 7, trazo 3) con un bloque
 * verde 13×16 (rx 3). viewBox 48×48.
 */
export const Isotipo: React.FC<IsotipoProps> = ({size = 48, tone = "light", outline = 1, block = 1, blockSlide = 0, style}) => {
  const p = palette(tone);
  // Perímetro aproximado del rectángulo redondeado.
  const perimeter = 2 * (40 + 28) - (8 - 2 * Math.PI) * 7;
  const blockX = 10 + blockSlide * (38 - 13 - 10);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{overflow: "visible", ...style}}>
      <rect
        x={4}
        y={10}
        width={40}
        height={28}
        rx={7}
        fill="none"
        stroke={p.stroke}
        strokeWidth={3}
        strokeDasharray={perimeter}
        strokeDashoffset={perimeter * (1 - outline)}
        strokeLinecap="round"
      />
      <rect
        x={blockX}
        y={16 + 16 * (1 - block) * 0.5}
        width={13}
        height={16 * block}
        rx={3}
        fill={p.block}
        opacity={block > 0 ? 1 : 0}
      />
    </svg>
  );
};

export interface LogoProps {
  /** Altura del lockup horizontal en px. */
  height?: number;
  tone?: Tone;
  /** 0→1: progreso de revelado de las letras (escalonado de izquierda a derecha). */
  reveal?: number;
  /** 0→1: el chip «OS» aparece con un pequeño rebote. */
  chip?: number;
  /** Controles del isotipo. */
  isoOutline?: number;
  isoBlock?: number;
  /** Mostrar solo el wordmark, sin isotipo. */
  wordmarkOnly?: boolean;
  style?: React.CSSProperties;
}

/**
 * Lockup horizontal oficial, trazado a trazado (sin dependencia de fuente).
 * viewBox 837×110. Cada letra se puede animar con `reveal`.
 */
export const Logo: React.FC<LogoProps> = ({
  height = 110,
  tone = "light",
  reveal = 1,
  chip = 1,
  isoOutline = 1,
  isoBlock = 1,
  wordmarkOnly = false,
  style,
}) => {
  const p = palette(tone);
  const perimeter = 2 * (40 + 28) - (8 - 2 * Math.PI) * 7;
  const vbX = wordmarkOnly ? 114 : 0;
  const vbW = wordmarkOnly ? 837 - 114 : 837;
  const width = (height * vbW) / 110;
  const n = WORDMARK_GLYPHS.length;
  return (
    <svg width={width} height={height} viewBox={`${vbX} 0 ${vbW} 110`} style={{overflow: "visible", ...style}}>
      {!wordmarkOnly && (
        <g transform="translate(0,13) scale(1.75)">
          <rect
            x={4}
            y={10}
            width={40}
            height={28}
            rx={7}
            fill="none"
            stroke={p.stroke}
            strokeWidth={3}
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter * (1 - isoOutline)}
          />
          <rect x={10} y={16 + 8 * (1 - isoBlock)} width={13} height={16 * isoBlock} rx={3} fill={p.block} />
        </g>
      )}
      <g transform="translate(114,88)">
        {WORDMARK_GLYPHS.map((d, i) => {
          // Cada letra ocupa una ventana del progreso global.
          const start = (i / n) * 0.6;
          const t = Math.min(1, Math.max(0, (reveal - start) / 0.4));
          const e = 1 - Math.pow(1 - t, 3);
          return (
            <path key={i} d={d} fill={p.glyph} opacity={e} transform={`translate(0 ${(1 - e) * 36})`} />
          );
        })}
        {(() => {
          const c = Math.min(1, Math.max(0, chip));
          const overshoot = c < 1 ? 1 + Math.sin(c * Math.PI) * 0.08 : 1;
          const s = c * overshoot;
          const cx = OS_CHIP.x + OS_CHIP.width / 2;
          const cy = OS_CHIP.y + OS_CHIP.height / 2;
          return (
            <g opacity={c > 0 ? 1 : 0} transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>
              <rect {...OS_CHIP} fill={p.chip} />
              <g transform={`translate(${OS_GLYPHS_OFFSET.x},${OS_GLYPHS_OFFSET.y})`}>
                {OS_GLYPHS.map((d, i) => (
                  <path key={i} d={d} fill={p.chipText} />
                ))}
              </g>
            </g>
          );
        })()}
      </g>
    </svg>
  );
};
