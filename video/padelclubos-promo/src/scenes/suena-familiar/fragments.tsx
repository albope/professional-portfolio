import React from "react";
import {ChevronLeft, FileSpreadsheet, Users} from "lucide-react";
import {color, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";

// El montón tal como lo deja «gestion-fragmentada» en su último frame: las
// tres hojas (con sus errores ya propagados), el móvil pequeño con el badge
// «38» y los dos módulos rojos de la doble reserva. Misma geometría y mismo
// aspecto para que el corte no se vea; aquí son fijos, solo se mueve el montón.

const RED = color.painRed;
const GRID = color.darkBorder;
const LINE = 2;

// ---------------------------------------------------------------- hojas

export const TITLE_H = 48;
export const FX_H = 44;
export const LET_H = 32;
export const GUT_W = 48;
const LETTERS = "ABCDEFGH";

export interface SheetCol {
  label: string;
  w: number;
  align?: "left" | "right" | "center";
  mono?: boolean;
}

export interface SheetCell {
  text?: string;
  /** Barra esqueleto (ancho en px). */
  skel?: number;
  /** Celda en rojo: error de fórmula o dato marcado (posición duplicada). */
  red?: boolean;
  /** Celda activa (contorno de selección). */
  active?: boolean;
}

export interface SheetSpec {
  title: string;
  cols: SheetCol[];
  rows: SheetCell[][];
  rowH: number;
  headH: number;
  font: number;
  formula: {ref: string; text: string};
  /** Rango seleccionado de una columna (filas `from`–`to`, numeración de la hoja). */
  range?: {col: number; from: number; to: number};
}

export const sheetSize = (s: SheetSpec) => ({
  w: GUT_W + s.cols.reduce((a, c) => a + c.w, 0),
  h: TITLE_H + FX_H + LET_H + s.headH + s.rows.length * s.rowH,
});

const justify = (a: SheetCol["align"]) => (a === "right" ? "flex-end" : a === "center" ? "center" : "flex-start");

const Cell: React.FC<{cell: SheetCell; col: SheetCol; font: number; h: number; last: boolean}> = ({cell, col, font, h, last}) => {
  const typo = col.mono ? {...monoStyle(cell.red ? 600 : 500), letterSpacing: "-0.01em"} : textStyle(500);
  return (
    <div
      style={{
        position: "relative",
        width: col.w,
        height: h,
        boxSizing: "border-box",
        borderRight: last ? "none" : `${LINE}px solid ${GRID}`,
        borderBottom: `${LINE}px solid ${GRID}`,
        background: cell.red ? "rgba(224, 138, 122, 0.13)" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: justify(col.align),
        padding: "0 16px",
        ...typo,
        fontSize: font,
        lineHeight: 1,
        color: cell.red ? RED : "rgba(241, 237, 228, 0.88)",
        whiteSpace: "pre",
      }}
    >
      {cell.skel ? <div style={{width: cell.skel, height: 12, borderRadius: 6, background: GRID}} /> : cell.text}
      {cell.active ? <div style={{position: "absolute", left: -LINE, top: -LINE, right: 0, bottom: 0, border: `${LINE}px solid ${RED}`}} /> : null}
    </div>
  );
};

/** Fórmula con los errores resaltados en rojo. */
const FormulaText: React.FC<{text: string}> = ({text}) => (
  <span style={{color: color.ink400}}>
    {text.split(/(#¡[A-Z]+!)/).map((p, i) =>
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

/** Ventana de hoja de cálculo genérica en tono noche (sin logo ni verde de Excel). */
export const NightSheet: React.FC<{spec: SheetSpec}> = ({spec}) => {
  const {w, h} = sheetSize(spec);
  const muted = color.ink400;
  const range = spec.range;
  const gutter: React.CSSProperties = {
    width: GUT_W,
    boxSizing: "border-box",
    borderRight: `${LINE}px solid ${GRID}`,
    borderBottom: `${LINE}px solid ${GRID}`,
  };
  return (
    <div style={{position: "relative", width: w, height: h, borderRadius: radius.module + 2, background: color.darkSurface, overflow: "hidden"}}>
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
          {spec.formula.ref}
        </div>
        <span style={{margin: "0 14px 0 16px", color: color.ink500, fontStyle: "italic"}}>fx</span>
        <FormulaText text={spec.formula.text} />
      </div>
      {/* Letras de columna */}
      <div style={{display: "flex", height: LET_H, background: color.darkRaised}}>
        <div style={gutter} />
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
                ...gutter,
                background: color.darkRaised,
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
                  <Cell key={i} cell={cell} col={spec.cols[i]} font={spec.font} h={rh} last={i === spec.cols.length - 1} />
                ))}
          </div>
        );
      })}
      {/* Borde exterior de 2 px por encima de todo */}
      <div style={{position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: `inset 0 0 0 ${LINE}px ${GRID}`}} />
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
          }}
        />
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------- móvil

/** El móvil del chat a 0,6× (216×468): pantalla en esqueleto; lo que se lee es el badge «38». */
export const PHONE_S = {w: 216, h: 468, bezel: 8, r: 40} as const;
const SCR = {w: PHONE_S.w - PHONE_S.bezel * 2, h: PHONE_S.h - PHONE_S.bezel * 2, r: PHONE_S.r - PHONE_S.bezel} as const;

const Bar: React.FC<{w: number; h?: number; o?: number}> = ({w, h = 8, o = 1}) => (
  <div style={{width: w, height: h, borderRadius: h / 2, background: GRID, opacity: o}} />
);

const BUBBLES: {w: number; bars: number[]}[] = [
  {w: 118, bars: [92, 60]},
  {w: 92, bars: [66]},
  {w: 132, bars: [104, 72]},
  {w: 84, bars: [58]},
  {w: 124, bars: [96, 54]},
  {w: 104, bars: [78]},
  {w: 128, bars: [100, 66]},
];

/** Badge de no leídos: píldora #E08A7A con la cifra en tinta. */
const UnreadBadge: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: "absolute",
      height: 64,
      minWidth: 64,
      boxSizing: "border-box",
      padding: "0 14px",
      borderRadius: radius.pill,
      background: RED,
      boxShadow: `0 0 0 5px ${color.darkBg}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...displayStyle(800),
      fontSize: 32,
      lineHeight: 1,
      color: color.darkBg,
      ...style,
    }}
  >
    {children}
  </div>
);

export const SmallPhone: React.FC = () => (
  <div style={{position: "relative", width: PHONE_S.w, height: PHONE_S.h}}>
    {/* Botones laterales */}
    {[
      {side: "left", top: 90, h: 22},
      {side: "left", top: 124, h: 38},
      {side: "right", top: 142, h: 58},
    ].map((b, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: b.top,
          [b.side]: -3,
          width: 5,
          height: b.h,
          borderRadius: 3,
          background: color.darkRaised,
          boxShadow: `inset 0 0 0 2px ${GRID}`,
        }}
      />
    ))}
    <div style={{position: "absolute", inset: 0, borderRadius: PHONE_S.r, background: color.darkRaised, boxShadow: `inset 0 0 0 2px ${GRID}`}} />
    <div
      style={{
        position: "absolute",
        left: PHONE_S.bezel,
        top: PHONE_S.bezel,
        width: SCR.w,
        height: SCR.h,
        borderRadius: SCR.r,
        overflow: "hidden",
        background: color.darkSurface,
      }}
    >
      {/* Cabecera del grupo */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 0,
          right: 0,
          height: 42,
          boxSizing: "border-box",
          background: color.darkRaised,
          borderBottom: `2px solid ${GRID}`,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 8px 0 2px",
        }}
      >
        <ChevronLeft size={18} color={color.sand400} strokeWidth={2.4} />
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            background: GRID,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Users size={14} color={color.sand400} strokeWidth={2.4} />
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 5, marginLeft: 2}}>
          <Bar w={92} h={8} />
          <Bar w={58} h={6} o={0.7} />
        </div>
      </div>
      {/* Mensajes esqueleto */}
      <div style={{position: "absolute", top: 78, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 8}}>
        {BUBBLES.map((b, i) => (
          <div key={i} style={{display: "flex", gap: 6, paddingLeft: 7, alignItems: "flex-start"}}>
            <div style={{width: 20, height: 20, borderRadius: 10, background: GRID, flexShrink: 0}} />
            <div
              style={{
                width: b.w,
                boxSizing: "border-box",
                padding: "9px 10px",
                borderRadius: "4px 12px 12px 12px",
                background: color.darkRaised,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {b.bars.map((w, k) => (
                <Bar key={k} w={w} h={7} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Barra de escritura */}
      <div
        style={{
          position: "absolute",
          left: 8,
          right: 38,
          bottom: 16,
          height: 26,
          borderRadius: 13,
          background: color.darkRaised,
          boxShadow: `inset 0 0 0 2px ${GRID}`,
        }}
      />
      <div style={{position: "absolute", right: 8, bottom: 16, width: 26, height: 26, borderRadius: 13, background: color.darkRaised}} />
      {/* Isla e indicador de inicio */}
      <div style={{position: "absolute", top: 7, left: "50%", width: 58, height: 17, marginLeft: -29, borderRadius: 9, background: "#0B0A09"}} />
      <div
        style={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          width: 72,
          height: 4,
          marginLeft: -36,
          borderRadius: 2,
          background: color.darkText,
          opacity: 0.6,
        }}
      />
    </div>
    <UnreadBadge style={{right: -14, top: -16}}>38</UnreadBadge>
  </div>
);

// ---------------------------------------------------------------- módulos

// Los módulos de «dobles-reservas» a 0,56×, con líneas de 2 px y etiquetas de 16 px.
const MK = 0.56;
const COLS = [212, 388, 440].map((c) => Math.round(c * MK));
const CELL_H = Math.round(216 * MK);
const ROW_H = Math.round(80 * MK);
export const MODULE_S = {w: COLS[0] + COLS[1] + COLS[2] + 4, h: CELL_H + ROW_H + 6} as const;
const CELLS = [
  {label: "PISTA", value: "1"},
  {label: "FECHA", value: "MAR"},
  {label: "HORA", value: "19:00"},
];

/** Trama diagonal de conflicto: líneas de 2 px #E08A7A al 35 %, paso 12 px. */
const Hatch: React.FC<{width: number; height: number}> = ({width, height}) => {
  const dx = 12 * Math.SQRT2;
  const xs: number[] = [];
  for (let x = -height; x < width + dx; x += dx) xs.push(x);
  return (
    <svg width={width} height={height} style={{position: "absolute", left: 0, top: 0}}>
      {xs.map((x) => (
        <line key={x} x1={x} y1={height} x2={x + height} y2={0} stroke={RED} strokeOpacity={0.35} strokeWidth={2} />
      ))}
    </svg>
  );
};

export const FallenModule: React.FC<{who: string}> = ({who}) => {
  const inner = COLS[0] + COLS[1] + COLS[2];
  return (
    <div
      style={{
        position: "relative",
        width: MODULE_S.w,
        boxSizing: "border-box",
        border: `2px solid ${RED}`,
        borderRadius: radius.module,
        background: color.darkSurface,
        overflow: "hidden",
      }}
    >
      <div style={{position: "relative", display: "flex", height: CELL_H}}>
        <Hatch width={inner} height={CELL_H} />
        {CELLS.map((c, i) => (
          <div
            key={c.label}
            style={{
              position: "relative",
              width: COLS[i],
              boxSizing: "border-box",
              borderLeft: i === 0 ? "none" : `2px solid ${RED}`,
              padding: "16px 18px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                ...monoStyle(600),
                alignSelf: "flex-start",
                fontSize: 16,
                lineHeight: 1,
                letterSpacing: "0.14em",
                color: color.ink400,
                background: color.darkSurface,
                padding: "4px 6px",
                margin: "-4px -6px",
              }}
            >
              {c.label}
            </span>
            <span style={{...displayStyle(800), fontSize: 64, lineHeight: 0.74, color: color.darkText, whiteSpace: "nowrap"}}>{c.value}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          height: ROW_H,
          boxSizing: "border-box",
          borderTop: `2px solid ${RED}`,
          background: color.darkRaised,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          ...textStyle(600),
          fontSize: 20,
          color: color.darkText,
          whiteSpace: "nowrap",
        }}
      >
        {who}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- sombra y velo

/** Sombra de objeto posado y velo de lo que queda debajo (un foco cada vez). */
export const Shadowed: React.FC<{w: number; h: number; r: number; dim: number; children: React.ReactNode}> = ({w, h, r, dim, children}) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: r,
      boxShadow: "0 28px 64px -24px rgba(0, 0, 0, 0.78)",
    }}
  >
    {children}
    {dim > 0 ? <div style={{position: "absolute", inset: 0, borderRadius: "inherit", background: `rgba(20, 18, 15, ${dim})`}} /> : null}
  </div>
);
