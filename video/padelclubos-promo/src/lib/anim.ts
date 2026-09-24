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

/** Muelle con presets de la casa. */
export const springs = {
  snappy: {damping: 200, stiffness: 220, mass: 0.7},
  soft: {damping: 30, stiffness: 120, mass: 1},
  pop: {damping: 14, stiffness: 180, mass: 0.8},
} as const;

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
  pct: (v: number) => `${Math.round(v)}%`,
};
