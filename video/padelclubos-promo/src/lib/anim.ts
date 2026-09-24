import type {CSSProperties} from "react";
import {Easing, interpolate, spring} from "remotion";

export const FPS = 30;
export const BPM = 120;
/** 1 tiempo = 0,5 s = 15 frames. */
export const BEAT = (FPS * 60) / BPM;
/** 1 compás (4/4) = 2 s = 60 frames. */
export const BAR = BEAT * 4;

export const beats = (n: number) => Math.round(n * BEAT);
export const bars = (n: number) => Math.round(n * BAR);

export const ease = {
  /** Salida larga y suave: entradas de titulares y tarjetas. */
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  /** Salida estándar. */
  out: Easing.bezier(0.33, 1, 0.68, 1),
  /** Token «overlay» del producto: 220 ms cubic-bezier(0.32,0.72,0,1). */
  overlay: Easing.bezier(0.32, 0.72, 0, 1),
  /** Movimientos de cámara y transiciones. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Salidas de escena. */
  in: Easing.bezier(0.55, 0, 1, 0.45),
  linear: Easing.linear,
} as const;

/** interpolate con clamp en ambos extremos y easing opcional. */
export const tween = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: (t: number) => number = ease.outExpo,
) =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Progreso 0→1 entre start y start+duration. */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = ease.outExpo,
) => tween(frame, [start, start + Math.max(1, duration)], [0, 1], easing);

/** Entrada estándar: fundido + subida. */
export const fadeUp = (
  frame: number,
  start: number,
  opts: {duration?: number; distance?: number; easing?: (t: number) => number} = {},
): CSSProperties => {
  const {duration = 18, distance = 28, easing = ease.outExpo} = opts;
  const p = progress(frame, start, duration, easing);
  return {opacity: p, transform: `translateY(${(1 - p) * distance}px)`};
};

/** Salida estándar: fundido + subida ligera. */
export const fadeOut = (frame: number, start: number, duration = 10, distance = -16): CSSProperties => {
  const p = progress(frame, start, duration, ease.in);
  return {opacity: 1 - p, transform: `translateY(${p * distance}px)`};
};

/** Muelles críticamente amortiguados: la marca no usa rebotes ni overshoot. */
export const springs = {
  snappy: {damping: 200, stiffness: 220, mass: 0.7},
  soft: {damping: 200, stiffness: 90, mass: 1},
} as const;

/** Tokens de movimiento del producto, en frames a 30 fps. */
export const motion = {
  /** press 120 ms ease-out (toques). */
  press: 4,
  /** overlay 220 ms cubic-bezier(0.32,0.72,0,1) (hojas y desplazamientos). */
  overlay: 7,
  /** vista 180 ms fade + 4 px (entradas). */
  view: 6,
  /** celebrate 400 ms (solo confirmación de reserva o pago). */
  celebrate: 12,
  /** salida de titulares (vista inversa). */
  exit: 8,
} as const;

/** Entrada «vista» del sistema: fundido + 4 px en 6 frames. */
export const view = (frame: number, start: number, distance = 4): CSSProperties => {
  const p = progress(frame, start, 6, ease.out);
  return {opacity: p, transform: `translateY(${(1 - p) * distance}px)`};
};

/** Salida «vista inversa» (8 frames). */
export const viewOut = (frame: number, start: number, distance = 4): CSSProperties => {
  const p = progress(frame, start, 8, ease.in);
  return {opacity: 1 - p, transform: `translateY(${-p * distance}px)`};
};

/** Pulsación (press 120 ms): escala 1 → 0,96 → 1 sin rebote. */
export const pressScale = (frame: number, at: number) => {
  const d = frame - at;
  if (d < 0 || d > 8) return 1;
  return d < 4 ? 1 - 0.04 * (d / 4) : 0.96 + 0.04 * ((d - 4) / 4);
};

export const springAt = (
  frame: number,
  start: number,
  preset: keyof typeof springs = "snappy",
  durationInFrames?: number,
) =>
  spring({
    frame: frame - start,
    fps: FPS,
    config: springs[preset],
    durationInFrames,
  });

/** Retardo escalonado para listas. */
export const stagger = (index: number, step = 3, start = 0) => start + index * step;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const eur = new Intl.NumberFormat("es-ES", {style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0});
const eur2 = new Intl.NumberFormat("es-ES", {style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2});
const int = new Intl.NumberFormat("es-ES", {maximumFractionDigits: 0, useGrouping: true});

export const fmt = {
  eur: (v: number) => eur.format(v),
  eur2: (v: number) => eur2.format(v),
  int: (v: number) => int.format(Math.round(v)),
  pct: (v: number) => `${Math.round(v)}\u00A0%`,
};
