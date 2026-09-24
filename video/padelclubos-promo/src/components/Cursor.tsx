import React from "react";
import {color} from "../brand/tokens";
import {ease, progress, tween} from "../lib/anim";

export interface CursorKey {
  /** Frame relativo a la escena. */
  at: number;
  x: number;
  y: number;
  /** Clic en este punto (tras llegar). */
  click?: boolean;
}

/** Posición interpolada del cursor entre puntos clave, con easing de cámara. */
export const cursorPosition = (frame: number, keys: CursorKey[]) => {
  if (keys.length === 0) return {x: 0, y: 0};
  if (frame <= keys[0].at) return {x: keys[0].x, y: keys[0].y};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.at) {
      const t = tween(frame, [a.at, b.at], [0, 1], ease.inOut);
      // Ligera curva para que no parezca robótico.
      const arc = Math.sin(t * Math.PI) * Math.min(60, Math.hypot(b.x - a.x, b.y - a.y) * 0.12);
      return {x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t - arc};
    }
  }
  const last = keys[keys.length - 1];
  return {x: last.x, y: last.y};
};

/** Cursor de ratón con pulsación. Coordenadas en el sistema del contenedor. */
export const Cursor: React.FC<{frame: number; keys: CursorKey[]; size?: number; appearAt?: number}> = ({
  frame,
  keys,
  size = 34,
  appearAt,
}) => {
  const {x, y} = cursorPosition(frame, keys);
  const clicks = keys.filter((k) => k.click);
  let press = 0;
  let ripple = -1;
  for (const k of clicks) {
    const d = frame - k.at;
    if (d >= 0 && d < 8) press = Math.max(press, d < 3 ? d / 3 : 1 - (d - 3) / 5);
    if (d >= 0 && d < 18) ripple = d / 18;
  }
  const opacity = appearAt === undefined ? 1 : progress(frame, appearAt, 8);
  return (
    <div style={{position: "absolute", left: x, top: y, zIndex: 100, pointerEvents: "none", opacity}}>
      {ripple >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: -28 * (0.4 + ripple),
            top: -28 * (0.4 + ripple),
            width: 56 * (0.4 + ripple),
            height: 56 * (0.4 + ripple),
            borderRadius: "50%",
            border: `3px solid ${color.green400}`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{transform: `scale(${1 - press * 0.15})`, transformOrigin: "4px 3px", filter: "drop-shadow(0 4px 6px rgba(20,18,15,0.35))"}}
      >
        <path
          d="M4.5 2.8 L4.5 19.6 L8.9 15.6 L11.7 21.6 L14.6 20.3 L11.9 14.4 L17.9 14.4 Z"
          fill={color.ink900}
          stroke={color.sand50}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/** Toque de dedo en pantalla táctil (círculo que se expande y desaparece). */
export const TapRipple: React.FC<{frame: number; at: number; x: number; y: number; tone?: string}> = ({
  frame,
  at,
  x,
  y,
  tone = color.ink900,
}) => {
  const d = frame - at;
  if (d < -6 || d > 20) return null;
  const pre = d < 0 ? (d + 6) / 6 : 1;
  const r = d < 0 ? 0 : d / 20;
  return (
    <div style={{position: "absolute", left: x, top: y, zIndex: 100, pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          left: -22,
          top: -22,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: tone,
          opacity: d < 0 ? 0.18 * pre : 0.22 * (1 - r),
          transform: `scale(${d < 0 ? 0.8 : 0.8 + r * 0.3})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -22,
          top: -22,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: `2px solid ${tone}`,
          opacity: d < 0 ? 0 : 0.5 * (1 - r),
          transform: `scale(${1 + r * 1.2})`,
        }}
      />
    </div>
  );
};
