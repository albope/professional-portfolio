import React from "react";
import {interpolateColors} from "remotion";
import {FileSpreadsheet} from "lucide-react";
import {color, monoStyle, radius, textStyle} from "../../brand/tokens";
import {DigitRoll} from "../../components";
import {ease, progress} from "../../lib/anim";

/**
 * Ventana de hoja de cálculo genérica en tono noche (sin logo ni verde de
 * Excel): barra de título #282420 con el archivo en mono, barra de fórmulas,
 * letras de columna, números de fila y rejilla de 2 px #37322A sobre #1E1B17.
 * Los errores (#¡VALOR!, #¡REF!) entran con digit-roll en #E08A7A y la celda
 * activa lleva el contorno de selección.
 */

export interface SheetCol {
  label: string;
  w: number;
  align?: "left" | "right" | "center";
  /** Cifras y errores en JetBrains Mono tabular. */
  mono?: boolean;
}

export interface SheetCell {
  text?: string;
  /** Barra esqueleto (ancho en px) en lugar de texto. */
  skel?: number;
  /** Se rompe: el valor rueda hasta `err` en `errAt`. */
  err?: string;
  errAt?: number;
  /** El valor no cambia pero se marca en rojo (p. ej. posición duplicada). */
  redAt?: number;
}

export interface FormulaKey {
  at: number;
  ref: string;
  text: string;
}

export interface SheetSpec {
  title: string;
  cols: SheetCol[];
  rows: SheetCell[][];
  rowH: number;
  headH: number;
  font: number;
  formula: FormulaKey[];
  /** Selección de un rango de una columna (p. ej. D2:D5) cuando se rompe entera. */
  range?: {col: number; from: number; to: number; at: number};
}

export const TITLE_H = 48;
export const FX_H = 44;
export const LET_H = 32;
export const GUT_W = 48;
const LINE = 2;
const GRID = color.darkBorder;
const RED = color.painRed;
const LETTERS = "ABCDEFGH";

export const sheetSize = (s: SheetSpec) => ({
  w: GUT_W + s.cols.reduce((a, c) => a + c.w, 0),
  h: TITLE_H + FX_H + LET_H + s.headH + s.rows.length * s.rowH,
});

/** Frame en que la celda se vuelve roja (rotura o marca), o undefined. */
const redFrame = (c: SheetCell) => c.errAt ?? c.redAt;

const justify = (a: SheetCol["align"]) => (a === "right" ? "flex-end" : a === "center" ? "center" : "flex-start");

const Cell: React.FC<{frame: number; cell: SheetCell; col: SheetCol; font: number; h: number; last: boolean; active: boolean}> = ({
  frame,
  cell,
  col,
  font,
  h,
  last,
  active,
}) => {
  const at = redFrame(cell);
  const redP = at === undefined ? 0 : progress(frame, at, 4, ease.out);
  const base = "rgba(241, 237, 228, 0.88)";
  const fg = interpolateColors(redP, [0, 1], [base, RED]);
  const typo = col.mono ? {...monoStyle(redP > 0.5 ? 600 : 500), letterSpacing: "-0.01em"} : textStyle(500);
  return (
    <div
      style={{
        position: "relative",
        width: col.w,
        height: h,
        boxSizing: "border-box",
        borderRight: last ? "none" : `${LINE}px solid ${GRID}`,
        borderBottom: `${LINE}px solid ${GRID}`,
        background: redP > 0 ? `rgba(224, 138, 122, ${(0.13 * redP).toFixed(3)})` : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: justify(col.align),
        padding: "0 16px",
        ...typo,
        fontSize: font,
        lineHeight: 1,
        color: fg,
        whiteSpace: "pre",
      }}
    >
      {cell.skel ? (
        <div style={{width: cell.skel, height: 12, borderRadius: 6, background: GRID}} />
      ) : cell.err !== undefined && cell.errAt !== undefined ? (
        <DigitRoll frame={frame} keys={[{at: cell.errAt, value: cell.err}]} initial={cell.text ?? ""} duration={5} stagger={0.5} />
      ) : (
        cell.text
      )}
      {active ? (
        // Contorno de la celda activa: tapa también las líneas de la rejilla vecina
        // (en la última columna se queda dentro del borde de la ventana).
        <div style={{position: "absolute", left: -LINE, top: -LINE, right: last ? LINE : 0, bottom: 0, border: `${LINE}px solid ${RED}`}} />
      ) : null}
    </div>
  );
};

export const SheetWindow: React.FC<{frame: number; spec: SheetSpec; style?: React.CSSProperties}> = ({frame, spec, style}) => {
  const {w, h} = sheetSize(spec);
  // Celda activa: la última que se ha puesto roja (con la misma hora, la de más abajo).
  let activeR = -1;
  let activeC = -1;
  let activeAt = -Infinity;
  spec.rows.forEach((row, r) =>
    row.forEach((c, k) => {
      const at = redFrame(c);
      if (at !== undefined && at <= frame && at >= activeAt) {
        activeAt = at;
        activeR = r;
        activeC = k;
      }
    }),
  );
  const range = spec.range && frame >= spec.range.at ? spec.range : null;
  let fx = spec.formula[0];
  for (const f of spec.formula) if (frame >= f.at) fx = f;
  const muted = color.ink400;
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: radius.module + 2,
        background: color.darkSurface,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Barra de título */}
      <div
        style={{
          height: TITLE_H,
          boxSizing: "border-box",
          background: color.darkRaised,
          borderBottom: `${LINE}px solid ${GRID}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 18px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: color.ink700}} />
        ))}
        <div style={{display: "flex", alignItems: "center", gap: 10, marginLeft: 16, minWidth: 0}}>
          <FileSpreadsheet size={20} color={muted} strokeWidth={2} />
          <span style={{...monoStyle(500), fontSize: 18, color: muted, whiteSpace: "nowrap"}}>{spec.title}</span>
        </div>
      </div>
      {/* Barra de fórmulas */}
      <div
        style={{
          height: FX_H,
          boxSizing: "border-box",
          borderBottom: `${LINE}px solid ${GRID}`,
          display: "flex",
          alignItems: "center",
          ...monoStyle(500),
          fontSize: 16,
          whiteSpace: "pre",
        }}
      >
        <div
          style={{
            width: GUT_W + 32,
            height: "100%",
            boxSizing: "border-box",
            borderRight: `${LINE}px solid ${GRID}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color.sand400,
          }}
        >
          {fx.ref}
        </div>
        <span style={{margin: "0 14px 0 16px", color: color.ink500, fontStyle: "italic"}}>fx</span>
        <FormulaText text={fx.text} />
      </div>
      {/* Letras de columna */}
      <div style={{display: "flex", height: LET_H, background: color.darkRaised}}>
        <div style={{width: GUT_W, boxSizing: "border-box", borderRight: `${LINE}px solid ${GRID}`, borderBottom: `${LINE}px solid ${GRID}`}} />
        {spec.cols.map((c, i) => {
          const sel = range?.col === i;
          return (
            <div
              key={c.label}
              style={{
                width: c.w,
                boxSizing: "border-box",
                borderRight: i === spec.cols.length - 1 ? "none" : `${LINE}px solid ${GRID}`,
                borderBottom: `${LINE}px solid ${sel ? RED : GRID}`,
                background: sel ? "rgba(224, 138, 122, 0.16)" : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...monoStyle(sel ? 600 : 500),
                fontSize: 16,
                color: sel ? RED : muted,
              }}
            >
              {LETTERS[i]}
            </div>
          );
        })}
      </div>
      {/* Fila 1 (cabeceras) y datos */}
      {[null, ...spec.rows].map((row, r) => {
        const rh = r === 0 ? spec.headH : spec.rowH;
        return (
          <div key={r} style={{display: "flex", height: rh}}>
            <div
              style={{
                width: GUT_W,
                boxSizing: "border-box",
                background: color.darkRaised,
                borderRight: `${LINE}px solid ${GRID}`,
                borderBottom: `${LINE}px solid ${GRID}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...monoStyle(500),
                fontSize: 16,
                color: muted,
              }}
            >
              {r + 1}
            </div>
            {row === null
              ? spec.cols.map((c, i) => (
                  <div
                    key={c.label}
                    style={{
                      width: c.w,
                      boxSizing: "border-box",
                      borderRight: i === spec.cols.length - 1 ? "none" : `${LINE}px solid ${GRID}`,
                      borderBottom: `${LINE}px solid ${GRID}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: justify(c.align),
                      padding: "0 16px",
                      ...textStyle(700),
                      fontSize: spec.font - 2,
                      color: color.sand400,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.label}
                  </div>
                ))
              : row.map((cell, i) => (
                  <Cell
                    key={i}
                    frame={frame}
                    cell={cell}
                    col={spec.cols[i]}
                    font={spec.font}
                    h={rh}
                    last={i === spec.cols.length - 1}
                    active={!range && r - 1 === activeR && i === activeC}
                  />
                ))}
          </div>
        );
      })}
      {/* Borde exterior de 2 px por encima de todo */}
      <div style={{position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: `inset 0 0 0 ${LINE}px ${GRID}`, pointerEvents: "none"}} />
      {range ? (
        // Contorno del rango roto (la columna entera), por encima del borde de la ventana.
        <div
          style={{
            position: "absolute",
            left: GUT_W + spec.cols.slice(0, range.col).reduce((a, c) => a + c.w, 0) - LINE,
            top: TITLE_H + FX_H + LET_H + spec.headH + (range.from - 2) * spec.rowH - LINE,
            width: spec.cols[range.col].w + LINE,
            height: (range.to - range.from + 1) * spec.rowH + LINE,
            boxSizing: "border-box",
            border: `${LINE}px solid ${RED}`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
};

/** Fórmula con los errores resaltados en rojo. */
const FormulaText: React.FC<{text: string}> = ({text}) => {
  const parts = text.split(/(#¡[A-Z]+!)/);
  return (
    <span style={{color: color.ink400}}>
      {parts.map((p, i) =>
        /^#¡[A-Z]+!$/.test(p) ? (
          <span key={i} style={{color: RED, fontWeight: 600}}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  );
};
