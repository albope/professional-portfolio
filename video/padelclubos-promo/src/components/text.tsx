import React from "react";
import {displayStyle} from "../brand/tokens";
import {ease, progress} from "../lib/anim";

/**
 * Titular que entra palabra a palabra desde una máscara (cada palabra sube
 * desde debajo de su línea base). `exitAt` lo recoge hacia arriba.
 */
export const WordsReveal: React.FC<{
  text: string;
  frame: number;
  start?: number;
  /** Frames entre palabras. */
  step?: number;
  duration?: number;
  exitAt?: number;
  exitDuration?: number;
  style?: React.CSSProperties;
  /** Palabras (por índice) que se pintan con otro color. */
  highlight?: {indices: number[]; color: string};
  align?: "left" | "center" | "right";
  /** «vista» (fundido + 4 px, gramática de la marca) o «mask» (sube desde su línea). */
  mode?: "vista" | "mask";
}> = ({text, frame, start = 0, step = 3, duration, exitAt, exitDuration = 8, style, highlight, align = "left", mode = "vista"}) => {
  const words = text.split(" ");
  const exitP = exitAt === undefined ? 0 : progress(frame, exitAt, exitDuration, ease.in);
  if (mode === "vista") {
    const d = duration ?? 6;
    return (
      <div
        style={{
          ...displayStyle(800),
          display: "flex",
          flexWrap: "wrap",
          justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
          columnGap: "0.26em",
          ...style,
          opacity: 1 - exitP,
          transform: `translateY(${-exitP * 4}px)`,
        }}
      >
        {words.map((w, i) => {
          const p = progress(frame, start + i * step, d, ease.out);
          const hl = highlight?.indices.includes(i);
          return (
            <span
              key={i}
              style={{display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 4}px)`, color: hl ? highlight?.color : undefined}}
            >
              {w}
            </span>
          );
        })}
      </div>
    );
  }
  return (
    <div
      style={{
        ...displayStyle(800),
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        columnGap: "0.26em",
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = progress(frame, start + i * step, duration ?? 20, ease.outExpo);
        const hl = highlight?.indices.includes(i);
        return (
          <span key={i} style={{display: "inline-block", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em"}}>
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 105 - exitP * 105}%)`,
                color: hl ? highlight?.color : undefined,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Cifra que cuenta de `from` a `to` (tabular, sin saltos de ancho). */
export const Counter: React.FC<{
  frame: number;
  start: number;
  duration?: number;
  from?: number;
  to: number;
  format?: (v: number) => string;
  style?: React.CSSProperties;
}> = ({frame, start, duration = 30, from = 0, to, format = (v) => String(Math.round(v)), style}) => {
  const p = progress(frame, start, duration, ease.outExpo);
  const v = from + (to - from) * p;
  return <span style={{fontVariantNumeric: "tabular-nums", ...style}}>{format(v)}</span>;
};

/** Barra de acento que se dibuja (eyebrow de la landing: línea + texto). */
export const AccentRule: React.FC<{frame: number; start?: number; width?: number; color: string; thickness?: number}> = ({
  frame,
  start = 0,
  width = 56,
  color,
  thickness = 3,
}) => {
  const p = progress(frame, start, 14);
  return <div style={{width: width * p, height: thickness, background: color, borderRadius: 2}} />;
};
