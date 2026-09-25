import React from "react";
import {color, monoStyle, radius} from "../../brand/tokens";
import {DigitRoll} from "../../components";
import {clamp01, ease, progress} from "../../lib/anim";

/**
 * Reloj del día en su versión clara (píldora #E7E2D8, texto tinta), la misma
 * de «reserva-movil» → «control-de-cobros»: el DayClock del kit solo pinta la
 * variante tinta sobre claro.
 */
export const LightClock: React.FC<{frame: number; rollAt: number}> = ({frame, rollAt}) => (
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
    <DigitRoll frame={frame} keys={[{at: rollAt, value: "18:40"}]} initial="13:05" style={{color: color.ink900, fontWeight: 600}} />
  </div>
);

/**
 * Desenfoque de movimiento direccional para el push: gaussiano en el eje del
 * movimiento, proporcional a la velocidad (obturador de 180°). Nítido en
 * reposo y sin el tinte rosado que deja CameraMotionBlur sobre la arena.
 */
export const DirBlur: React.FC<{id: string; vx: number; style?: React.CSSProperties; children: React.ReactNode}> = ({id, vx, style, children}) => {
  const sx = Math.abs(vx) * 0.15;
  const on = sx > 0.3;
  return (
    <>
      {on ? (
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${sx.toFixed(2)} 0`} />
          </filter>
        </svg>
      ) : null}
      <div style={{...style, filter: on ? `url(#${id})` : undefined}}>{children}</div>
    </>
  );
};

/** Velocidad (px/frame) de una posición que depende del frame: diferencia central. */
export const velocity = (f: (frame: number) => number, frame: number) => (f(frame + 1) - f(frame - 1)) / 2;

/** Check que se dibuja (stroke-dashoffset). */
export const CheckStroke: React.FC<{p: number; size: number; stroke: string; width?: number}> = ({p, size, stroke, width = 2.4}) => {
  const len = 20;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display: "block"}}>
      <path
        d="M5.6 12.6 L10 16.8 L18.4 8"
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - clamp01(p))}
      />
    </svg>
  );
};

/**
 * Punto verde «en directo» (#2FA075): late en cada tiempo con un anillo que
 * crece y se desvanece (sin rebote).
 */
/** Latido en curso: r (0→1, anillo que crece) y glow (1→0, brillo del punto). */
export const pulseAt = (frame: number, pulses: readonly number[]) => {
  let beat = -1;
  for (const at of pulses) if (frame >= at && frame < at + 15) beat = frame - at;
  return {
    beat,
    r: beat < 0 ? 0 : progress(beat, 0, 14, ease.out),
    glow: beat < 0 ? 0 : 1 - progress(beat, 0, 12, ease.out),
  };
};

export const LiveDot: React.FC<{frame: number; pulses: readonly number[]; size: number; ring?: number; spread?: number}> = ({
  frame,
  pulses,
  size,
  ring = 2,
  spread = 2.2,
}) => {
  const {beat, r, glow} = pulseAt(frame, pulses);
  return (
    <span style={{position: "relative", display: "inline-block", width: size, height: size, flexShrink: 0}}>
      {beat >= 0 ? (
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `${ring}px solid ${color.green400}`,
            opacity: 0.8 * (1 - r),
            transform: `scale(${1 + r * spread})`,
          }}
        />
      ) : null}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color.green400,
          boxShadow: `0 0 0 ${Math.round(size * 0.28)}px rgba(47,160,117,${(0.16 + 0.14 * glow).toFixed(3)})`,
        }}
      />
    </span>
  );
};

/** Avatar de jugador sin nombre: círculo con silueta (sin texto). */
export const PersonAvatar: React.FC<{size: number; bg: string; fg?: string; ring?: string; ringW?: number; style?: React.CSSProperties}> = ({
  size,
  bg,
  fg = color.sand50,
  ring,
  ringW = 3,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      boxShadow: ring ? `0 0 0 ${ringW}px ${ring}` : undefined,
      overflow: "hidden",
      position: "relative",
      flexShrink: 0,
      ...style,
    }}
  >
    <svg width={size} height={size} viewBox="0 0 40 40" style={{position: "absolute", inset: 0}}>
      <circle cx={20} cy={16} r={7} fill={fg} opacity={0.92} />
      <path d="M6.5 38 C8 28.5 13.5 25 20 25 C26.5 25 32 28.5 33.5 38 Z" fill={fg} opacity={0.92} />
    </svg>
  </div>
);

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Foco de la tarjeta de resultado: un único anillo verde que salta de celda en
 * celda como el foco real de un formulario (sale en 2 f y entra en la
 * siguiente en 2 f, 0,94 → 1 sin rebote) y llega justo cuando se escribe su
 * juego. Un foco a la vez: nunca hay dos anillos ni cruza las líneas del módulo.
 */
export const FocusRing: React.FC<{frame: number; cells: Rect[]; at: readonly number[]; inAt: number; outAt: number; line: number; r: number}> = ({
  frame,
  cells,
  at,
  inAt,
  outAt,
  line,
  r,
}) => {
  // Celda activa: cambia 2 f antes de cada juego.
  let i = 0;
  for (let k = 1; k < cells.length; k++) if (frame >= at[k] - 2) i = k;
  const landAt = i === 0 ? inAt : at[i] - 2;
  const land = progress(frame, landAt, 2, ease.out);
  const leave = i < cells.length - 1 ? progress(frame, at[i + 1] - 4, 2, ease.out) : progress(frame, outAt, 3, ease.out);
  const o = land * (1 - leave);
  if (o <= 0) return null;
  const {x, y, w, h} = cells[i];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: r,
        boxShadow: `inset 0 0 0 ${line}px ${color.green400}`,
        background: "rgba(47,160,117,0.08)",
        opacity: o,
        transform: `scale(${0.94 + 0.06 * land})`,
        pointerEvents: "none",
      }}
    />
  );
};

/** ▲ de «sube» en vector: el glifo no existe en JetBrains Mono y caería en una fuente del sistema. */
export const UpMark: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 14 12" style={{display: "block", flexShrink: 0, ...style}}>
    <path d="M7 0.8 L13.2 11.2 L0.8 11.2 Z" fill={color.green600} stroke={color.green600} strokeWidth={1.2} strokeLinejoin="round" />
  </svg>
);

/** Posición interpolada de una fila de la clasificación (FLIP con curva overlay). */
export const flip = (frame: number, at: number, from: number, to: number) => from + (to - from) * progress(frame, at, 7, ease.overlay);

/** Tinte de la fila que sube: se queda mientras se mueve y se apaga en 400 ms. */
export const riseTint = (frame: number, at: number) => progress(frame, at, 3, ease.out) * (1 - progress(frame, at + 7, 12, ease.out));

/** Toque en pantalla táctil (press 120 ms): huella que se hunde y anillo que se abre. */
export const TapRing: React.FC<{frame: number; at: number; x: number; y: number; size: number}> = ({frame, at, x, y, size}) => {
  const d = frame - at;
  if (d < -4 || d > 18) return null;
  const pre = progress(d, -4, 4, ease.out);
  const r = progress(d, 0, 18, ease.out);
  return (
    <div style={{position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, pointerEvents: "none", zIndex: 20}}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color.ink900,
          opacity: d < 0 ? 0.16 * pre : 0.2 * (1 - r),
          transform: `scale(${d < 0 ? 0.9 : 0.9 - 0.06 * Math.min(1, d / 4)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `3px solid ${color.ink900}`,
          opacity: d < 0 ? 0 : 0.35 * (1 - r),
          transform: `scale(${1 + r * 0.6})`,
        }}
      />
    </div>
  );
};

/**
 * Elevación de la tarjeta de resultado (k: 0 en reposo, 1 editando): flota
 * mientras se edita y, una vez guardada, se asienta para ceder el foco.
 */
export const liftShadow = (k: number) => {
  const a = (0.35 * k + 0.12 * (1 - k)).toFixed(3);
  const y = Math.round(24 * k + 8 * (1 - k));
  const b = Math.round(60 * k + 24 * (1 - k));
  return `0 ${y}px ${b}px -${Math.round(24 * k + 12 * (1 - k))}px rgba(28,26,23,${a}), 0 2px 6px rgba(28,26,23,${(0.08 * k + 0.05 * (1 - k)).toFixed(3)})`;
};

/** Se asienta tras guardar (overlay 7 f). */
export const settle = (frame: number, savedAt: number) => 1 - progress(frame, savedAt, 7, ease.overlay);
