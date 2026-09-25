import React from "react";
import {interpolateColors} from "remotion";
import {FileSpreadsheet, MoreHorizontal} from "lucide-react";
import {color, monoStyle, radius, textStyle} from "../../brand/tokens";
import {DigitRoll} from "../../components";
import {ease, motion, progress} from "../../lib/anim";
import {T16 as T} from "./cues";
import {CARD, CHROME, COLS, GUT, HEAD, ROW, TITLE_H, colX} from "./geo";
import {ERROR_ROWS, FEE, FILE, MEMBERS, type Member} from "./data";

/**
 * La hoja rota de «gestion-fragmentada» (ventana genérica en tono noche, sin
 * logo ni verde de Excel) cae en la zona de importación y se convierte, fila a
 * fila, en la lista de socios del panel. Mismo marco antes y después: los
 * nombres no se mueven, solo cambian de ropa.
 */

const LINE = 2;
const GRID = color.darkBorder;
const RED = color.painRed;
const SHEET_TEXT = "rgba(241, 237, 228, 0.88)";
const LETTERS = "ABCD";

/** Frame en que el error de la fila `r` vuelve a su valor. */
export const fixAt = (r: number) => T.straighten + ERROR_ROWS.indexOf(r) * T.fixStep;

// ─── Hoja (tono noche) ─────────────────────────────────────────────────────

const cellBase = (w: number, last: boolean): React.CSSProperties => ({
  position: "relative",
  width: w,
  height: "100%",
  boxSizing: "border-box",
  borderRight: last ? "none" : `${LINE}px solid ${GRID}`,
  borderBottom: `${LINE}px solid ${GRID}`,
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  whiteSpace: "pre",
});

const Gutter: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      ...cellBase(GUT, false),
      justifyContent: "center",
      padding: 0,
      background: color.darkRaised,
      ...monoStyle(500),
      fontSize: 16,
      color: color.ink400,
    }}
  >
    {children}
  </div>
);

const SheetChrome: React.FC = () => (
  <div style={{position: "absolute", inset: 0, background: color.darkSurface}}>
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
      <FileSpreadsheet size={20} color={color.ink400} strokeWidth={2} style={{marginLeft: 16}} />
      <span style={{...monoStyle(500), fontSize: 18, color: color.ink400, marginLeft: 2}}>{FILE}</span>
    </div>
    {/* Letras de columna */}
    <div style={{display: "flex", height: CHROME - TITLE_H, background: color.darkRaised}}>
      <Gutter>{""}</Gutter>
      {COLS.map((w, i) => (
        <div key={i} style={{...cellBase(w, i === COLS.length - 1), justifyContent: "center", ...monoStyle(500), fontSize: 16, color: color.ink400}}>
          {LETTERS[i]}
        </div>
      ))}
    </div>
    {/* Fila 1: cabeceras */}
    <div style={{display: "flex", height: HEAD}}>
      <Gutter>1</Gutter>
      {["Nombre", "Teléfono", "Cuota", "Pagado"].map((label, i) => (
        <div
          key={label}
          style={{
            ...cellBase(COLS[i], i === COLS.length - 1),
            justifyContent: i === 2 ? "flex-end" : i === 3 ? "center" : "flex-start",
            ...textStyle(700),
            fontSize: 18,
            color: color.sand400,
          }}
        >
          {label}
        </div>
      ))}
    </div>
  </div>
);

/** Celda Cuota: el error rueda de vuelta a su valor y el tinte rojo se apaga. */
const FeeCell: React.FC<{frame: number; m: Member; r: number; active: boolean}> = ({frame, m, r, active}) => {
  if (!m.err) {
    return (
      <div style={{...cellBase(COLS[2], false), justifyContent: "flex-end", ...monoStyle(500), fontSize: 20, color: SHEET_TEXT}}>{FEE}</div>
    );
  }
  const at = fixAt(r);
  const fixP = progress(frame, at, motion.exit, ease.in);
  const fg = interpolateColors(fixP, [0, 1], [RED, SHEET_TEXT]);
  return (
    <div
      style={{
        ...cellBase(COLS[2], false),
        justifyContent: "flex-end",
        background: `rgba(224, 138, 122, ${(0.14 * (1 - fixP)).toFixed(3)})`,
        ...monoStyle(fixP < 0.5 ? 600 : 500),
        fontSize: 20,
        color: fg,
      }}
    >
      <DigitRoll frame={frame} keys={[{at, value: FEE}]} initial={m.err} duration={5} stagger={0.5} />
      {active ? (
        // Celda activa de la hoja rota: se apaga con el arreglo.
        <div style={{position: "absolute", left: -LINE, top: -LINE, right: 0, bottom: 0, border: `${LINE}px solid ${RED}`, opacity: 1 - fixP}} />
      ) : null}
    </div>
  );
};

const SheetRow: React.FC<{frame: number; m: Member; r: number}> = ({frame, m, r}) => (
  <div style={{display: "flex", height: ROW, background: color.darkSurface}}>
    <Gutter>{r + 2}</Gutter>
    <div style={{...cellBase(COLS[0], false), ...textStyle(500), fontSize: 22, color: SHEET_TEXT}}>{m.name}</div>
    <div style={cellBase(COLS[1], false)}>
      {/* Teléfono: barra esqueleto, nunca un número con formato real */}
      <div style={{width: 112 + ((r * 37) % 5) * 12, height: 12, borderRadius: 6, background: GRID}} />
    </div>
    <FeeCell frame={frame} m={m} r={r} active={r === ERROR_ROWS[ERROR_ROWS.length - 1]} />
    <div style={{...cellBase(COLS[3], true), justifyContent: "center", ...monoStyle(500), fontSize: 20, color: SHEET_TEXT}}>
      {m.paid ? "Sí" : "No"}
    </div>
  </div>
);

// ─── Lista de socios (panel) ───────────────────────────────────────────────

const Chip: React.FC<{tone: "neutral" | "success" | "warning"; children: React.ReactNode}> = ({tone, children}) => {
  const map = {
    neutral: {bg: color.sand100, fg: color.ink500, border: color.sand300},
    success: {bg: color.successBg, fg: color.success, border: color.successBorder},
    warning: {bg: color.warningBg, fg: color.warning, border: color.warningBorder},
  }[tone];
  return (
    <span
      style={{
        height: 32,
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "0 12px",
        borderRadius: radius.control,
        background: map.bg,
        border: `${LINE}px solid ${map.border}`,
        color: map.fg,
        ...textStyle(600),
        fontSize: 18,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {tone !== "neutral" ? <span style={{width: 8, height: 8, borderRadius: 4, background: map.fg}} /> : null}
      {children}
    </span>
  );
};

const ListChrome: React.FC = () => (
  <div style={{position: "absolute", inset: 0, background: color.surface}}>
    <div
      style={{
        height: CHROME,
        boxSizing: "border-box",
        borderBottom: `${LINE}px solid ${color.sand200}`,
        display: "flex",
        alignItems: "center",
        padding: "0 18px 0 24px",
      }}
    >
      <FileSpreadsheet size={22} color={color.green600} strokeWidth={2} />
      <span style={{...monoStyle(500), fontSize: 18, color: color.ink700, marginLeft: 12}}>{FILE}</span>
    </div>
    <div
      style={{
        position: "relative",
        height: HEAD,
        boxSizing: "border-box",
        background: color.sand100,
        borderBottom: `${LINE}px solid ${color.sand200}`,
        ...monoStyle(500),
        fontSize: 16,
        letterSpacing: "0.1em",
        color: color.ink400,
      }}
    >
      {[
        {label: "NOMBRE", x: 24},
        {label: "TIPO", x: colX(1) + 16},
        {label: "CUOTA", x: colX(2) + 16},
      ].map((c) => (
        <span key={c.label} style={{position: "absolute", left: c.x, top: 0, height: HEAD - LINE, display: "flex", alignItems: "center"}}>
          {c.label}
        </span>
      ))}
    </div>
  </div>
);

const MemberRow: React.FC<{m: Member; last: boolean}> = ({m, last}) => (
  <div
    style={{
      position: "relative",
      height: ROW,
      boxSizing: "border-box",
      background: color.surface,
      borderBottom: last ? "none" : `${LINE}px solid ${color.sand200}`,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 24,
        top: (ROW - 36) / 2 - 1,
        width: 36,
        height: 36,
        borderRadius: 18,
        background: color.greenTint,
        color: color.green700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...textStyle(700),
        fontSize: 16,
      }}
    >
      {m.initials}
    </div>
    <span
      style={{
        position: "absolute",
        left: GUT + 16,
        top: 0,
        height: ROW - 2,
        display: "flex",
        alignItems: "center",
        ...textStyle(600),
        fontSize: 26,
        color: color.ink900,
        whiteSpace: "nowrap",
      }}
    >
      {m.name}
    </span>
    <span style={{position: "absolute", left: colX(1) + 16, top: (ROW - 32) / 2 - 1}}>
      <Chip tone="neutral">Socio</Chip>
    </span>
    <span style={{position: "absolute", left: colX(2) + 16, top: (ROW - 32) / 2 - 1}}>
      {m.paid ? <Chip tone="success">Al día</Chip> : <Chip tone="warning">Pendiente</Chip>}
    </span>
    <MoreHorizontal size={24} color={color.ink300} strokeWidth={2} style={{position: "absolute", right: 24, top: (ROW - 24) / 2 - 1}} />
  </div>
);

// ─── Tarjeta completa ──────────────────────────────────────────────────────

/**
 * La fila de la hoja se retira con un barrido de izquierda a derecha (sin
 * mezclar las dos capas) y la fila de socio entra con vista (fundido + 4 px).
 */
const Morph: React.FC<{frame: number; at: number; top: number; h: number; sheet: React.ReactNode; list: React.ReactNode}> = ({
  frame,
  at,
  top,
  h,
  sheet,
  list,
}) => {
  const wipe = progress(frame, at, 5, ease.inOut);
  const inP = progress(frame, at + 1, motion.view, ease.out);
  return (
    <div style={{position: "absolute", left: 0, top, width: CARD.w, height: h, overflow: "hidden"}}>
      <div style={{position: "absolute", inset: 0, background: color.surface}} />
      {inP > 0 ? <div style={{position: "absolute", inset: 0, opacity: inP, transform: `translateY(${(1 - inP) * 4}px)`}}>{list}</div> : null}
      {wipe < 1 ? <div style={{position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${(wipe * 100).toFixed(2)}%)`}}>{sheet}</div> : null}
    </div>
  );
};

export const ImportCard: React.FC<{frame: number}> = ({frame}) => {
  // El marco pasa de noche a arena con la última fila.
  const light = progress(frame, T.chrome, T.rows[T.rows.length - 1] + 6 - T.chrome, ease.inOut);
  const edge = interpolateColors(light, [0, 1], [GRID, color.sand300]);
  return (
    <div style={{position: "relative", width: CARD.w, height: CARD.h, borderRadius: 12, overflow: "hidden", background: color.darkSurface}}>
      <Morph frame={frame} at={T.chrome} top={0} h={CHROME + HEAD} sheet={<SheetChrome />} list={<ListChrome />} />
      {MEMBERS.map((m, r) => (
        <Morph
          key={m.name}
          frame={frame}
          at={T.rows[r]}
          top={CHROME + HEAD + r * ROW}
          h={ROW}
          sheet={<SheetRow frame={frame} m={m} r={r} />}
          list={<MemberRow m={m} last={r === MEMBERS.length - 1} />}
        />
      ))}
      <div style={{position: "absolute", inset: 0, borderRadius: 12, boxShadow: `inset 0 0 0 ${LINE}px ${edge}`, pointerEvents: "none"}} />
    </div>
  );
};
