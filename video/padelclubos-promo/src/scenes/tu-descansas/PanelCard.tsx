import React from "react";
import {Check, CirclePlus} from "lucide-react";
import {Isotipo} from "../../brand/Logo";
import {color, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";
import {ease, progress, view} from "../../lib/anim";
import type {Timing} from "./cues";

const CELL_R = radius.control + 2;

/** Medidas de cada maqueta. 16:9: la tarjeta mide 180 px y acaba en y930, como el móvil. */
const LAYOUT = {
  landscape: {cellW: 56, cellH: 82, gap: 8, bar: 3, icon: 22, check: 44, main: 40, sub: 26, lineGap: 6, confirmGap: 16},
  portrait: {cellW: 204, cellH: 96, gap: 12, bar: 4, icon: 34, check: 52, main: 48, sub: 36, lineGap: 10, confirmGap: 20},
} as const;
type Layout = (typeof LAYOUT)[keyof typeof LAYOUT];

/** Cuatro jugadores por reserva, como puntos de avatar sin nombre (solo 9:16). */
const Players: React.FC<{bg: string; ring: string; left: number}> = ({bg, ring, left}) => (
  <div style={{position: "absolute", left, top: "50%", marginTop: -15, display: "flex"}}>
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{width: 30, height: 30, borderRadius: 15, background: bg, boxShadow: `0 0 0 3px ${ring}`, marginLeft: i === 0 ? 0 : -8}} />
    ))}
  </div>
);

/**
 * Franja Vie 19:00 de una pista, con el vocabulario de la rejilla de Reservas:
 * reservada = tarjeta con barra verde y check; libre = discontinua con «+».
 * La Pista 4 está libre y se rellena sola de #2FA075, de izquierda a derecha.
 */
const Cell: React.FC<{
  L: Layout;
  portrait: boolean;
  label?: string;
  /** null: ya reservada. 0→1: la celda libre se rellena. */
  fill: number | null;
}> = ({L, portrait, label, fill}) => {
  const box: React.CSSProperties = {position: "absolute", inset: 0, borderRadius: CELL_R, boxSizing: "border-box", overflow: "hidden"};
  // 16:9: etiqueta arriba e icono abajo. 9:16: jugadores a la izquierda e icono a la derecha.
  const iconPos: React.CSSProperties = portrait
    ? {position: "absolute", right: 28, top: "50%", marginTop: -L.icon / 2}
    : {position: "absolute", left: 14, bottom: 12};
  const lab = (fg: string) =>
    label ? (
      <span style={{position: "absolute", left: 14, top: 12, ...monoStyle(600), fontSize: 16, lineHeight: 1, letterSpacing: "0.04em", color: fg}}>
        {label}
      </span>
    ) : null;
  const booked = (bg: string, fg: string, dots: string, icon: string) => (
    <>
      {lab(fg)}
      {portrait ? <Players bg={dots} ring={bg} left={28} /> : null}
      <Check size={L.icon} strokeWidth={3} color={icon} style={iconPos} />
    </>
  );
  const shell: React.CSSProperties = {position: "relative", width: L.cellW, height: L.cellH, flexShrink: 0};

  if (fill === null) {
    return (
      <div style={shell}>
        <div style={{...box, background: color.darkRaised, border: `2px solid ${color.darkBorder}`}}>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: L.bar, background: color.green600}} />
        </div>
        {booked(color.darkRaised, color.ink300, color.ink500, color.green300)}
      </div>
    );
  }
  return (
    <div style={shell}>
      {/* Libre: borde discontinuo y «+», como en la rejilla del producto */}
      <div style={{...box, border: `2px dashed ${color.ink500}`, opacity: fill > 0.98 ? 0 : 1}}>
        {lab(color.ink400)}
        <CirclePlus size={L.icon} strokeWidth={2} color={color.ink400} style={{...iconPos, opacity: 1 - Math.min(1, fill * 2.5)}} />
      </div>
      {/* Relleno: el barrido descubre la reserva nueva (etiqueta, jugadores y check) */}
      <div style={{...box, background: color.green400, clipPath: `inset(0 ${(1 - fill) * 100}% 0 0 round ${CELL_R}px)`}}>
        {booked(color.green400, color.green900, color.green700, color.green900)}
      </div>
    </div>
  );
};

/** Check #6FBF9C: el círculo aparece y el trazo se dibuja (8 f). */
const CheckMark: React.FC<{size: number; p: number}> = ({size, p}) => {
  const len = 30;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{flexShrink: 0, overflow: "visible", display: "block"}}>
      <circle cx={24} cy={24} r={21.5} fill="none" stroke={color.gainGreen} strokeWidth={3} opacity={Math.min(1, p * 2.5)} />
      <path
        d="M14.5 24.5 L21 31 L33.5 17.5"
        fill="none"
        stroke={color.gainGreen}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
    </svg>
  );
};

/**
 * Tarjeta del panel en modo oscuro (#1E1B17, borde 2 px #37322A, radio 14).
 * Nadie la toca: no hay cursor ni celebrate.
 */
export const PanelCard: React.FC<{frame: number; t: Timing; portrait: boolean; style?: React.CSSProperties}> = ({
  frame,
  t,
  portrait,
  style,
}) => {
  const fill = progress(frame, t.fill, t.fillDur, ease.inOut);
  const checkP = progress(frame, t.confirm, t.confirmDur, ease.out);
  const L = portrait ? LAYOUT.portrait : LAYOUT.landscape;

  const cells = (
    <div style={{display: "flex", gap: L.gap}}>
      {[0, 1, 2, 3].map((i) => (
        <Cell key={i} L={L} portrait={portrait} label={portrait ? undefined : `P${i + 1}`} fill={i === 3 ? fill : null} />
      ))}
    </div>
  );

  const confirm = (
    <div style={{display: "flex", alignItems: "flex-start", gap: L.confirmGap}}>
      <div style={{marginTop: (L.main * 1.1 - L.check) / 2}}>
        <CheckMark size={L.check} p={checkP} />
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: L.lineGap}}>
        <div
          style={{
            ...displayStyle(700),
            fontSize: L.main,
            lineHeight: 1.1,
            color: color.darkText,
            whiteSpace: "nowrap",
            ...view(frame, t.confirm),
          }}
        >
          Confirmada automáticamente
        </div>
        <div style={{...textStyle(500), fontSize: L.sub, lineHeight: 1.2, color: color.sand400, whiteSpace: "nowrap", ...view(frame, t.detail)}}>
          {portrait ? "Pista 4 · Vie 19:00" : "Nuria Castillo · Pista 4 · Vie 19:00"}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        background: color.darkSurface,
        border: `2px solid ${color.darkBorder}`,
        borderRadius: radius.surface,
        boxSizing: "border-box",
        boxShadow: "0 40px 80px -40px rgba(0,0,0,0.6)",
        ...view(frame, t.card),
        ...style,
      }}
    >
      {portrait ? (
        <div style={{padding: "40px 40px 44px", display: "flex", flexDirection: "column", gap: 40}}>
          {cells}
          {confirm}
        </div>
      ) : (
        <>
          {/* Cabecera: isotipo oficial (variante oscura) + eyebrow mono, alineados con la primera celda */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              height: 54,
              padding: "0 28px",
              borderBottom: `2px solid ${color.darkBorder}`,
              boxSizing: "border-box",
            }}
          >
            <Isotipo size={36} tone="dark" />
            <span style={{...monoStyle(500), fontSize: 18, lineHeight: 1, letterSpacing: "0.12em", color: color.ink300, whiteSpace: "nowrap"}}>
              PANEL DEL CLUB · RESERVAS · VIERNES
            </span>
          </div>
          <div style={{height: 122, padding: "0 30px", display: "flex", alignItems: "center", gap: 36}}>
            {cells}
            {confirm}
          </div>
        </>
      )}
    </div>
  );
};
