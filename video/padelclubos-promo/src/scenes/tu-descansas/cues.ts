import type {SceneCues} from "../../sfx";
import {BEAT} from "../../lib/anim";

/**
 * Tiempos de «tu-descansas» (frames locales). La escena se anima con estos
 * mismos números, así imagen y sonido no se desfasan.
 */
export interface Timing {
  /** 16:9: el chip del reloj rueda 22:00 → 23:47 y crece hasta el reloj gigante (en 9:16 no hay chip). */
  clockGrow: number;
  clockGrowDur: number;
  /** c1.t2: la tarjeta del panel aparece (vista), sin sonido. */
  card: number;
  /** La celda Pista 4 · 19:00 se rellena sola, de izquierda a derecha. */
  fill: number;
  fillDur: number;
  /** Check dibujado y «Confirmada automáticamente». */
  confirm: number;
  confirmDur: number;
  /** Línea secundaria de la reserva. */
  detail: number;
  /** c1.t3: titular palabra a palabra. */
  headline: number;
  headlineStep: number;
}

const shared = {
  clockGrowDur: 12,
  card: BEAT,
  fill: 22,
  fillDur: 12,
  confirm: 26,
  confirmDur: 8,
  detail: 29,
  headline: BEAT * 2,
  // Más lento que en el problema (3 f).
  headlineStep: 4,
} as const;

export const TIMING: {landscape: Timing; portrait: Timing} = {
  landscape: {...shared, clockGrow: 0},
  // En vertical no hay reloj de esquina: el 23:47 gigante ya está en f0 y no se usa.
  portrait: {...shared, clockGrow: 0},
};

/**
 * Silencio a propósito (storyboard §4 L12 y §2: «silencio total a las 23:47
 * finales»). El tic de reloj por tiempo a −30 dB, el pad, el piano y el swell
 * invertido del último tiempo ya los pone la música (sec_breakdown en
 * audio/generate.py): repetirlos aquí los duplicaría. Ni vibración, ni ping,
 * ni celebrate: nadie toca la reserva.
 */
export const cues: SceneCues = {landscape: [], portrait: []};
