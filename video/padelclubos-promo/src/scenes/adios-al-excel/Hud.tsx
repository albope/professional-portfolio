import React from "react";
import {Easing} from "remotion";
import {color, monoStyle, radius, textStyle} from "../../brand/tokens";
import {DigitRoll, WordsReveal, type RollKey} from "../../components";
import {clamp01, ease, motion, progress, view, viewOut} from "../../lib/anim";
import {T16 as T} from "./cues";
import {TOTAL} from "./data";

/**
 * Reloj del día en versión clara (píldora #E7E2D8, texto tinta), igual que en
 * «reserva-movil» y «sin-solapamientos»: el DayClock del kit la pinta en tinta
 * sobre fondo claro.
 */
export const LightClock: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: "absolute",
      left: 96,
      top: 56,
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 22px",
      borderRadius: radius.pill,
      background: color.sand200,
      border: `2px solid ${color.sand300}`,
      ...monoStyle(500),
      fontSize: 28,
      lineHeight: 1.15,
      letterSpacing: "0.04em",
      color: color.ink500,
      zIndex: 50,
    }}
  >
    <span>MAR</span>
    <span style={{opacity: 0.6}}>·</span>
    <DigitRoll frame={frame} keys={[{at: T.clock, value: "13:05"}]} initial="11:20" style={{color: color.ink900, fontWeight: 600}} />
  </div>
);

export const Headline: React.FC<{frame: number; exitAt: number}> = ({frame, exitAt}) => (
  <WordsReveal
    text="Adiós al Excel."
    frame={frame}
    start={T.title}
    step={3}
    exitAt={exitAt}
    style={{position: "absolute", left: 96, top: 128, fontSize: 80, fontWeight: 760, lineHeight: 1, color: color.ink900, whiteSpace: "nowrap"}}
  />
);

// Pasos del contador: uno cada 3 f, frenando al final (ease-out).
const COUNT_STEPS = 14;
const COUNT_KEYS: RollKey[] = Array.from({length: COUNT_STEPS}, (_, k) => {
  const t = (k + 1) / COUNT_STEPS;
  return {
    at: T.counter + Math.round(((T.counterEnd - T.counter) * (k + 1)) / COUNT_STEPS),
    value: String(Math.round(TOTAL * Easing.bezier(0.25, 1, 0.5, 1)(t))),
  };
});

/** Check en círculo verde: el círculo entra con press y el trazo se dibuja en 8 f. */
const DoneCheck: React.FC<{frame: number; size: number}> = ({frame, size}) => {
  const circle = progress(frame, T.done, motion.press, ease.out);
  const draw = progress(frame, T.done + 1, 8, ease.out);
  const len = 20;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display: "block", opacity: circle, transform: `scale(${0.96 + 0.04 * circle})`}}>
      <circle cx={12} cy={12} r={12} fill={color.green600} />
      <path
        d="M6.6 12.4 L10.4 16 L17.6 8.6"
        fill="none"
        stroke={color.sand50}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - clamp01(draw))}
      />
    </svg>
  );
};

/** Contador «342 socios importados», arriba a la derecha, en la línea base del titular. */
export const ImportCounter: React.FC<{frame: number; exitAt: number}> = ({frame, exitAt}) => {
  const inS = view(frame, T.counter);
  const outS = viewOut(frame, exitAt);
  const inP = progress(frame, T.counter, motion.view, ease.out);
  const outP = progress(frame, exitAt, motion.exit, ease.in);
  if (inP <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 96,
        top: 112,
        height: 112,
        display: "flex",
        alignItems: "baseline",
        gap: 20,
        opacity: Number(inS.opacity) * Number(outS.opacity),
        transform: `translateY(${(1 - inP) * 4 - outP * 4}px)`,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{alignSelf: "center", width: 48, height: 48}}>
        <DoneCheck frame={frame} size={48} />
      </div>
      {/* Ancho fijo de 3 cifras: el contador no empuja el check al crecer */}
      <span style={{...monoStyle(500), fontSize: 96, lineHeight: 1, letterSpacing: "-0.02em", color: color.ink900, minWidth: "3ch", textAlign: "right"}}>
        <DigitRoll frame={frame} keys={COUNT_KEYS} initial="0" duration={3} stagger={0} />
      </span>
      <span style={{...textStyle(500), fontSize: 32, color: color.ink500}}>socios importados</span>
    </div>
  );
};
