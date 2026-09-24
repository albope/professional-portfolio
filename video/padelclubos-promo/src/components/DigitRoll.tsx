import React from "react";
import {ease, progress} from "../lib/anim";

export interface RollKey {
  /** Frame (relativo a la escena) en que empieza a rodar hacia `value`. */
  at: number;
  value: string;
}

/**
 * «Digit-roll» de marcador: cada carácter que cambia sube y deja paso al
 * nuevo (180 ms ≈ 6 frames, escalonado de 2 frames por carácter). Es la
 * única forma en que cambian las cifras en el vídeo.
 *
 * `keys` ordenadas por `at`. Antes de la primera clave se muestra
 * `initial` (o nada).
 */
export const DigitRoll: React.FC<{
  frame: number;
  keys: RollKey[];
  initial?: string;
  duration?: number;
  stagger?: number;
  style?: React.CSSProperties;
  /** Alinea los cambios por la derecha (útil para cifras de distinta longitud). */
  alignRight?: boolean;
}> = ({frame, keys, initial = "", duration = 6, stagger = 2, style, alignRight = true}) => {
  let curIdx = -1;
  for (let i = 0; i < keys.length; i++) if (frame >= keys[i].at) curIdx = i;
  const cur = curIdx >= 0 ? keys[curIdx].value : initial;
  const prev = curIdx > 0 ? keys[curIdx - 1].value : initial;
  const start = curIdx >= 0 ? keys[curIdx].at : 0;
  const len = Math.max(cur.length, prev.length);
  const pad = (s: string) => (alignRight ? s.padStart(len, " ") : s.padEnd(len, " "));
  const a = pad(prev);
  const b = pad(cur);
  // Los caracteres que cambian ruedan en orden de izquierda a derecha.
  let changed = 0;
  const cells = Array.from({length: len}, (_, i) => {
    const from = a[i];
    const to = b[i];
    if (from === to || curIdx < 0) {
      return (
        <span key={i} style={{display: "inline-block", whiteSpace: "pre"}}>
          {to}
        </span>
      );
    }
    const p = progress(frame, start + changed * stagger, duration, ease.overlay);
    changed++;
    return (
      <span
        key={i}
        style={{
          display: "inline-block",
          position: "relative",
          overflow: "hidden",
          verticalAlign: "bottom",
          whiteSpace: "pre",
          lineHeight: "inherit",
        }}
      >
        {/* El nuevo carácter marca el ancho de la celda. */}
        <span style={{display: "inline-block", transform: `translateY(${(1 - p) * 100}%)`, opacity: p < 0.02 ? 0 : 1}}>{to}</span>
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            display: "inline-block",
            transform: `translateY(${-p * 100}%)`,
            opacity: p > 0.98 ? 0 : 1,
          }}
        >
          {from}
        </span>
      </span>
    );
  });
  return <span style={{display: "inline-block", fontVariantNumeric: "tabular-nums", whiteSpace: "pre", ...style}}>{cells}</span>;
};

/**
 * Cifra que va de `from` a `to` con digit-roll en cada paso intermedio
 * (p. ej. 3 → 38 «sin leer»). `steps` limita cuántos valores intermedios se
 * muestran para que el ojo pueda seguirlos.
 */
export const RollingNumber: React.FC<{
  frame: number;
  start: number;
  duration: number;
  from: number;
  to: number;
  steps?: number;
  format?: (v: number) => string;
  style?: React.CSSProperties;
}> = ({frame, start, duration, from, to, steps = 8, format = (v) => String(Math.round(v)), style}) => {
  const n = Math.max(1, Math.min(steps, Math.abs(to - from)));
  const keys: RollKey[] = Array.from({length: n}, (_, k) => {
    const t = (k + 1) / n;
    // Pasos más seguidos al principio y más espaciados al final (ease-out).
    const at = start + Math.round(duration * (1 - Math.pow(1 - t, 1.6)) * 0.85);
    return {at, value: format(from + (to - from) * t)};
  });
  return <DigitRoll frame={frame} keys={keys} initial={format(from)} style={style} />;
};
