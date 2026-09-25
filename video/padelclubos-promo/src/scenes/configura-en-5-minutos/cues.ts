import type {Cue, SceneCues} from "../../sfx";
import {BEAT} from "../../lib/anim";

/**
 * Tabla de tiempos del build (frames locales, solo 16:9: la escena no está en
 * el corte vertical). La animación y los cues leen los mismos números.
 */
export const T = {
  /**
   * Titular A palabra a palabra (stagger 3 f). Su vista inversa empieza en f64
   * (no en f68) para que termine justo cuando entra B: ventana 64 f ≥ 63.
   */
  headA: 0,
  headAExit: 64,
  /** Titular B (stagger 3 f): se queda hasta el corte. */
  headB: 72,
  headStep: 3,
  /** El borde del módulo se dibuja desde la fila de total (12 f). */
  border: 0,
  borderDur: 12,
  /** Cabeceras 01 / 02 / 03 (vista, escalonadas). */
  labels: 4,
  /** Cronómetro lineal 00:00 → 04:52. */
  timerStart: 0,
  timerStop: 105,
  timerSeconds: 4 * 60 + 52,
  /** c1.t2, c1.t4, c2.t2: celdas 01, 02 y 03 (valor con vista + check en 8 f). */
  cells: [BEAT, BEAT * 3, BEAT * 5] as const,
  checkDur: 8,
  /** c2.t3: la burbuja con el enlace sale de la celda 03 (overlay 7 f). */
  bubble: BEAT * 6,
  /** c2.t4: el cronómetro se detiene y la fila de total recibe su check. */
  totalCheck: BEAT * 7,
  /** c3: reposo, el texto del módulo baja al 60 %. */
  rest: BEAT * 8,
  restDur: 12,
  /** Última corchea: imagen congelada y en silencio. */
  freeze: 172,
} as const;

/** Notas de los clics de celda: La–Do–Mi sobre Lam (el motivo, ahora resuelto). */
const CELL_NOTES = ["A5", "C6", "E6"] as const;

/** Tic del cronómetro en corcheas entre f0 y f105; cede su hueco a los clics y al envío. */
const busy = new Set<number>([...T.cells, T.bubble, T.totalCheck]);
const ticks: Cue[] = Array.from({length: 14}, (_, k) => Math.round(k * (BEAT / 2)))
  .filter((f) => f < T.timerStop && !busy.has(f))
  .map((frame) => ({frame, sfx: "tick", gain: 0.15, pan: 0.35}));

const landscape: Cue[] = [
  ...ticks,
  ...T.cells.map((frame, i): Cue => ({frame, sfx: "click", note: CELL_NOTES[i], gain: 0.7, pan: -0.35 + i * 0.35})),
  {frame: T.bubble, sfx: "swipe", gain: 0.6, pan: 0.4},
  // «Clack» corto del cronómetro: clic grave.
  {frame: T.totalCheck, sfx: "click", pitch: 0.8, gain: 0.85, pan: 0.3},
];

/**
 * La música (sec_build_long) ya pone el bombo, la caja en corcheas y
 * semicorcheas, el riser y el silencio de la última corchea: aquí solo va lo
 * que se ve. Nada entre f172 y f179.
 */
export const cues: SceneCues = {landscape, portrait: []};
