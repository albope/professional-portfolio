import React from "react";
import {interpolateColors} from "remotion";
import {ChevronLeft, ChevronRight, FileSpreadsheet, Plus} from "lucide-react";
import {color, monoStyle, radius} from "../../brand/tokens";
import {clamp01, ease, progress} from "../../lib/anim";

/**
 * «liga_otoño_BUENO (2).xlsx» a toda la anchura del vertical: la misma
 * ventana de hoja genérica en tono noche de «gestion-fragmentada» (sin logo
 * ni verde de Excel), maquetada de nuevo para el móvil. Todo es esqueleto
 * salvo la columna PTS, que se rompe celda a celda en «#¡REF!» (#E08A7A).
 * Los esqueletos respetan la longitud de la clasificación real (§8).
 */

const LINE = 2;
const SEL = 3;
const GRID = color.darkBorder;
const RED = color.painRed;
const SKEL = color.ink700;
const SKEL_HEAD = color.ink500;
const MUTED = color.ink400;
const ERROR = "#¡REF!";

export const TITLE_H = 64;
export const FX_H = 56;
export const LET_H = 40;
export const HEAD_H = 64;
export const ROW_H = 72;
export const FOOT_H = 56;
export const GUT_W = 64;

/** Columnas de la liga de «gestion-fragmentada» (Pos. · Pareja · PJ · PTS); la E sigue más allá del borde. */
const COLS = [
  {letter: "A", w: 104},
  {letter: "B", w: 376},
  {letter: "C", w: 112},
  {letter: "D", w: 184},
  {letter: "E", w: 96},
] as const;
const PTS = 3;

export const SHEET_W = 936;
export const SHEET_H = TITLE_H + FX_H + LET_H + HEAD_H + 5 * ROW_H + FOOT_H;

/** Parejas de la Liga de Otoño (clasificación «antes»): apellidos → anchos de esqueleto; PJ y PTS en cifras. */
const ROWS = [
  {a: 7, b: 4, pj: 1, pts: 2},
  {a: 4, b: 8, pj: 1, pts: 1},
  {a: 5, b: 6, pj: 1, pts: 1},
  {a: 6, b: 8, pj: 1, pts: 1},
  {a: 4, b: 6, pj: 1, pts: 1},
] as const;
const CH = 17;
const DIGIT = 22;

/** Borde izquierdo de la columna i dentro de la ventana. */
const colX = (i: number) => GUT_W + COLS.slice(0, i).reduce((a, c) => a + c.w, 0);
const GRID_Y = TITLE_H + FX_H + LET_H + HEAD_H;

const Skel: React.FC<{w: number; tone?: string; h?: number}> = ({w, tone = SKEL, h = 14}) => (
  <div style={{width: w, height: h, borderRadius: h / 2, background: tone, flexShrink: 0}} />
);

/** Celda PTS: el esqueleto rueda hacia arriba y deja paso a «#¡REF!» (digit-roll carácter a carácter). */
const PtsCell: React.FC<{frame: number; at: number; skel: number}> = ({frame, at, skel}) => {
  const out = progress(frame, at, 5, ease.overlay);
  return (
    <div style={{position: "relative", height: 44, display: "flex", alignItems: "center", justifyContent: "flex-end", overflow: "hidden"}}>
      {out < 1 ? (
        <div style={{position: "absolute", right: 0, top: 15, transform: `translateY(${-out * 44}px)`, opacity: 1 - out}}>
          <Skel w={skel} />
        </div>
      ) : null}
      <div style={{display: "flex", ...monoStyle(600), fontSize: 34, lineHeight: "44px", color: RED, letterSpacing: "-0.01em"}}>
        {[...ERROR].map((ch, i) => {
          const p = progress(frame, at + 1 + i * 0.5, 5, ease.overlay);
          return (
            <span key={i} style={{display: "inline-block", transform: `translateY(${(1 - p) * 110}%)`}}>
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Frames que tarda la selección en bajar a la celda siguiente (llega justo cuando esta se rompe). */
const STEP = 3;

export const LigaSheet: React.FC<{frame: number; errors: readonly number[]; rangeAt: number; rangeDur: number}> = ({
  frame,
  errors,
  rangeAt,
  rangeDur,
}) => {
  // Celda activa: D2 desde el principio; baja por la columna y cada celda se rompe al llegar.
  let row = 0;
  errors.forEach((at, r) => {
    if (r > 0) row += progress(frame, at - STEP, STEP, ease.overlay);
  });
  const hot = progress(frame, errors[0], 4, ease.out);
  // Al final se selecciona la columna rota entera: la selección crece hacia arriba hasta D2.
  const grow = progress(frame, rangeAt, rangeDur, ease.overlay);
  const selTop = GRID_Y + row * ROW_H * (1 - grow);
  const selBottom = GRID_Y + (row + 1) * ROW_H;
  const fxErr = frame >= errors[0];
  const letterRed = grow;
  /** Resalte del encabezado de la fila r: sigue a la selección y, al final, cubre la columna rota. */
  const rowHl = (r: number) =>
    frame < rangeAt ? Math.max(0, 1 - Math.abs(row - r)) : clamp01((GRID_Y + (r + 1) * ROW_H - selTop) / ROW_H);
  return (
    <div
      style={{
        position: "relative",
        width: SHEET_W,
        height: SHEET_H,
        borderRadius: radius.surface,
        background: color.darkSurface,
        overflow: "hidden",
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
          gap: 10,
          padding: "0 24px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: color.ink700}} />
        ))}
        <div style={{display: "flex", alignItems: "center", gap: 12, marginLeft: 22}}>
          <FileSpreadsheet size={28} color={MUTED} strokeWidth={2} />
          <span style={{...monoStyle(500), fontSize: 28, color: color.sand400, whiteSpace: "nowrap", letterSpacing: "-0.01em"}}>
            liga_otoño_BUENO (2).xlsx
          </span>
        </div>
      </div>
      {/* Barra de fórmulas: referencia de la celda activa y fórmula en esqueleto con el error dentro */}
      <div style={{height: FX_H, boxSizing: "border-box", borderBottom: `${LINE}px solid ${GRID}`, display: "flex", alignItems: "center"}}>
        <div
          style={{
            width: GUT_W + 64,
            height: "100%",
            boxSizing: "border-box",
            borderRight: `${LINE}px solid ${GRID}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...monoStyle(500),
            fontSize: 22,
            color: color.sand400,
          }}
        >
          {/* El cuadro de nombres sigue a la selección */}
          {`D${Math.round(row) + 2}`}
        </div>
        <span style={{...monoStyle(500), fontSize: 22, margin: "0 20px 0 24px", color: color.ink500, fontStyle: "italic"}}>fx</span>
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <Skel w={112} />
          <div style={{width: 96, height: 14, borderRadius: 7, background: fxErr ? RED : SKEL, opacity: fxErr ? 0.75 : 1}} />
          <Skel w={20} />
        </div>
      </div>
      {/* Letras de columna */}
      <div style={{display: "flex", height: LET_H, background: color.darkRaised}}>
        <div style={{width: GUT_W, flexShrink: 0, boxSizing: "border-box", borderRight: `${LINE}px solid ${GRID}`, borderBottom: `${LINE}px solid ${GRID}`}} />
        {COLS.map((c, i) => {
          const sel = i === PTS ? letterRed : 0;
          const on = i === PTS ? 1 : 0;
          return (
            <div
              key={c.letter}
              style={{
                width: c.w,
                flexShrink: 0,
                boxSizing: "border-box",
                borderRight: `${LINE}px solid ${GRID}`,
                borderBottom: `${LINE}px solid ${sel > 0.5 ? RED : GRID}`,
                background: sel > 0 ? `rgba(224, 138, 122, ${(0.16 * sel).toFixed(3)})` : on ? GRID : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...monoStyle(sel > 0.5 ? 600 : 500),
                fontSize: 20,
                color: interpolateColors(sel, [0, 1], [on ? color.sand400 : MUTED, RED]),
              }}
            >
              {c.letter}
            </div>
          );
        })}
      </div>
      {/* Fila 1: cabeceras (esqueleto más claro) */}
      <Row index={1} h={HEAD_H}>
        <Cell w={COLS[0].w} center>
          <Skel w={48} tone={SKEL_HEAD} />
        </Cell>
        <Cell w={COLS[1].w}>
          <Skel w={104} tone={SKEL_HEAD} />
        </Cell>
        <Cell w={COLS[2].w} right>
          <Skel w={40} tone={SKEL_HEAD} />
        </Cell>
        <Cell w={COLS[3].w} right>
          <Skel w={56} tone={SKEL_HEAD} />
        </Cell>
        <Cell w={COLS[4].w} />
      </Row>
      {/* Filas 2–6: la clasificación */}
      {ROWS.map((row, r) => {
        const at = errors[r];
        // La celda se enciende al romperse (3 f) y se queda en el tinte de error.
        const red = 0.24 * progress(frame, at, 3, ease.out) - 0.11 * progress(frame, at + 3, 8, ease.out);
        return (
          <Row key={r} index={r + 2} h={ROW_H} hl={rowHl(r)}>
            <Cell w={COLS[0].w} center>
              <Skel w={DIGIT} />
            </Cell>
            <Cell w={COLS[1].w}>
              <div style={{display: "flex", alignItems: "center", gap: 12}}>
                <Skel w={row.a * CH} />
                <span style={{...monoStyle(500), fontSize: 22, color: color.ink500}}>/</span>
                <Skel w={row.b * CH} />
              </div>
            </Cell>
            <Cell w={COLS[2].w} right>
              <Skel w={row.pj * DIGIT} />
            </Cell>
            <Cell w={COLS[3].w} right tint={red}>
              <PtsCell frame={frame} at={at} skel={row.pts * DIGIT + (row.pts - 1) * 4} />
            </Cell>
            <Cell w={COLS[4].w} />
          </Row>
        );
      })}
      {/* Pestañas de hojas */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: FOOT_H,
          boxSizing: "border-box",
          background: color.darkRaised,
          borderTop: `${LINE}px solid ${GRID}`,
          display: "flex",
          alignItems: "stretch",
          padding: "0 16px",
          gap: 4,
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: 4, marginRight: 12}}>
          <ChevronLeft size={24} color={color.ink500} strokeWidth={2.2} />
          <ChevronRight size={24} color={color.ink500} strokeWidth={2.2} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            background: color.darkSurface,
            borderLeft: `${LINE}px solid ${GRID}`,
            borderRight: `${LINE}px solid ${GRID}`,
            marginTop: -LINE,
          }}
        >
          <Skel w={88} tone={SKEL_HEAD} h={12} />
        </div>
        <div style={{display: "flex", alignItems: "center", padding: "0 20px"}}>
          <Skel w={72} h={12} />
        </div>
        <div style={{display: "flex", alignItems: "center", padding: "0 8px"}}>
          <Plus size={24} color={color.ink500} strokeWidth={2.2} />
        </div>
      </div>
      {/* Borde exterior de 2 px por encima de todo */}
      <div style={{position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: `inset 0 0 0 ${LINE}px ${GRID}`, pointerEvents: "none"}} />
      {/* Selección: neutra en D2, roja desde que se rompe; baja por la columna y acaba cubriéndola entera */}
      <Selection x={colX(PTS)} y={selTop} w={COLS[PTS].w} h={selBottom - selTop} tone={interpolateColors(hot, [0, 1], [color.sand400, RED])} />
    </div>
  );
};

const Selection: React.FC<{x: number; y: number; w: number; h: number; tone: string}> = ({x, y, w, h, tone}) => (
  <div
    style={{
      position: "absolute",
      left: x - LINE,
      top: y - LINE,
      width: w + LINE + 1,
      height: h + LINE + 1,
      boxSizing: "border-box",
      border: `${SEL}px solid ${tone}`,
      pointerEvents: "none",
    }}
  >
    {/* Tirador de relleno de la selección */}
    <div style={{position: "absolute", right: -7, bottom: -7, width: 11, height: 11, background: tone, boxShadow: `0 0 0 2px ${color.darkSurface}`}} />
  </div>
);

const Row: React.FC<{index: number; h: number; hl?: number; children: React.ReactNode}> = ({index, h, hl = 0, children}) => (
  <div style={{display: "flex", height: h}}>
    <div
      style={{
        width: GUT_W,
        flexShrink: 0,
        boxSizing: "border-box",
        background: interpolateColors(hl, [0, 1], [color.darkRaised, GRID]),
        borderRight: `${LINE}px solid ${GRID}`,
        borderBottom: `${LINE}px solid ${GRID}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...monoStyle(500),
        fontSize: 20,
        color: interpolateColors(hl, [0, 1], [MUTED, color.sand400]),
      }}
    >
      {index}
    </div>
    {children}
  </div>
);

const Cell: React.FC<{w: number; right?: boolean; center?: boolean; /** Opacidad del tinte de error. */ tint?: number; children?: React.ReactNode}> = ({
  w,
  right,
  center,
  tint = 0,
  children,
}) => (
  <div
    style={{
      width: w,
      flexShrink: 0,
      boxSizing: "border-box",
      borderRight: `${LINE}px solid ${GRID}`,
      borderBottom: `${LINE}px solid ${GRID}`,
      background: tint > 0 ? `rgba(224, 138, 122, ${tint.toFixed(3)})` : undefined,
      display: "flex",
      alignItems: "center",
      justifyContent: right ? "flex-end" : center ? "center" : "flex-start",
      padding: "0 24px",
    }}
  >
    {children}
  </div>
);
