import type {CSSProperties} from "react";
import {Easing, interpolate} from "remotion";

export const FPS = 30;

/** Segundos a fotogramas. */
export const sec = (s: number) => Math.round(s * FPS);

/**
 * Curvas de la web (`globals.css`): `--ease` para entradas y `--ease-io` para
 * desplazamientos. Sin rebotes ni overshoot.
 */
export const ease = {
  out: Easing.bezier(0.2, 0.75, 0.2, 1),
  inOut: Easing.bezier(0.65, 0, 0.25, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  linear: Easing.linear,
} as const;

/** interpolate con clamp en ambos extremos y curva opcional. */
export const tween = (
  frame: number,
  input: readonly [number, number],
  output: readonly [number, number],
  easing: (t: number) => number = ease.out,
) =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Progreso 0→1 entre start y start+duration. */
export const progress = (frame: number, start: number, duration: number, easing: (t: number) => number = ease.out) =>
  tween(frame, [start, start + Math.max(1, duration)], [0, 1], easing);

/** Entrada: fundido + subida corta. */
export const fadeUp = (
  frame: number,
  start: number,
  opts: {duration?: number; distance?: number; easing?: (t: number) => number} = {},
): CSSProperties => {
  const {duration = 12, distance = 12, easing = ease.out} = opts;
  const p = progress(frame, start, duration, easing);
  return {opacity: p, transform: `translateY(${(1 - p) * distance}px)`};
};

/** Salida: fundido + subida ligera. */
export const fadeOut = (frame: number, start: number, duration = 8, distance = -8): CSSProperties => {
  const p = progress(frame, start, duration, ease.in);
  return {opacity: 1 - p, transform: `translateY(${p * distance}px)`};
};

/** Pulsación de un botón: escala 1 → 0,96 → 1 en 8 fotogramas, sin rebote. */
export const pressScale = (frame: number, at: number) => {
  const d = frame - at;
  if (d < 0 || d > 8) return 1;
  return d < 4 ? 1 - 0.04 * (d / 4) : 0.96 + 0.04 * ((d - 4) / 4);
};

/** Retardo escalonado para listas. */
export const stagger = (index: number, step = 3, start = 0) => start + index * step;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Mezcla de dos colores #RRGGBB. */
export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const k = clamp01(t);
  return `#${pa.map((v, i) => Math.round(lerp(v, pb[i], k)).toString(16).padStart(2, "0")).join("")}`;
};
