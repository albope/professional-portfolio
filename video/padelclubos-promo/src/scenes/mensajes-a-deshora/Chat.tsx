import React from "react";
import {interpolateColors} from "remotion";
import {color, monoStyle, textStyle} from "../../brand/tokens";

/** Tramo de texto de una burbuja; `hl` se enciende en rojo en el conflicto. */
export interface Seg {
  t: string;
  hl?: boolean;
}

/** Líneas fijas: la altura de cada burbuja no depende del ajuste de línea. */
export const JAVI_16: Seg[][] = [
  [{t: "¿Nos guardas "}, {t: "la 1", hl: true}],
  [{t: "mañana a las "}, {t: "19:00", hl: true}, {t: "?"}],
];
export const PEDRO_16: Seg[][] = [
  [{t: "Somos 4. ¿"}, {t: "La 1", hl: true}],
  [{t: "mañana a las "}, {t: "19:00", hl: true}, {t: "?"}],
];
export const JAVI_9: Seg[][] = [[{t: "¿"}, {t: "Pista 1", hl: true}, {t: " mañana, "}, {t: "19:00", hl: true}, {t: "?"}]];

const RED = color.painRed;

/** Avatar de iniciales neutro (nada de verde antes del drop). */
export const Initials: React.FC<{size: number; text?: string; fontSize?: number; style?: React.CSSProperties}> = ({
  size,
  text,
  fontSize,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: color.darkBorder,
      color: color.sand400,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...textStyle(700),
      fontSize: fontSize ?? Math.round(size * 0.38),
      letterSpacing: "0.02em",
      flexShrink: 0,
      ...style,
    }}
  >
    {text}
  </div>
);

/** Forma de burbuja entrante: esquina de la cola más cerrada. */
export const bubbleRadius = (r: number, tail: number) => `${tail}px ${r}px ${r}px ${r}px`;

/** Burbuja esqueleto: barras #37322A, sin texto. */
export const SkelBubble: React.FC<{
  w: number;
  h: number;
  bars: number[];
  barH: number;
  pad: number;
  gap: number;
  r: number;
  tail: number;
  style?: React.CSSProperties;
}> = ({w, h, bars, barH, pad, gap, r, tail, style}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: bubbleRadius(r, tail),
      background: color.darkRaised,
      padding: `${pad}px ${pad + 2}px`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {bars.map((b, i) => (
      <div key={i} style={{width: b, height: barH, borderRadius: barH / 2, background: color.darkBorder}} />
    ))}
  </div>
);

/** Texto de burbuja con los tramos del conflicto tintados según `hl` (0→1). */
export const BubbleLines: React.FC<{lines: Seg[][]; size: number; lineHeight: number; hl: number}> = ({lines, size, lineHeight, hl}) => {
  const hc = interpolateColors(hl, [0, 1], [color.darkText, RED]);
  return (
    <div style={{...textStyle(500), fontSize: size, lineHeight: `${lineHeight}px`, color: color.darkText, whiteSpace: "nowrap"}}>
      {lines.map((segs, i) => (
        <div key={i}>
          {segs.map((s, j) => (
            <span key={j} style={s.hl ? {color: hc, fontWeight: hl > 0.5 ? 600 : 500} : undefined}>
              {s.t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

/** Cabecera de burbuja de grupo: nombre en #C9C2B4 y hora en mono #8A8377. */
export const BubbleHead: React.FC<{name: string; time: string; nameSize: number; timeSize: number}> = ({name, time, nameSize, timeSize}) => (
  <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12}}>
    <span style={{...textStyle(600), fontSize: nameSize, color: color.sand400, whiteSpace: "nowrap"}}>{name}</span>
    <span style={{...monoStyle(500), fontSize: timeSize, color: color.ink400, whiteSpace: "nowrap"}}>{time}</span>
  </div>
);

/** Contorno de 2 px sin alterar la caja (misma pista, misma hora). */
export const outline = (p: number, w = 2) => (p > 0 ? `inset 0 0 0 ${w}px rgba(224,138,122,${p.toFixed(3)})` : undefined);
