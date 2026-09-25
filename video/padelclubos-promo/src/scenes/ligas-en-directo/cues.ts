import type {Cue, SceneCues} from "../../sfx";

/**
 * Tiempos de «ligas-en-directo» (frames locales). Imagen y sonido leen de
 * aquí: cada cue y la animación que lo acompaña comparten el mismo número.
 */
export const T16 = {
  /** El reloj rueda 13:05 → 18:40 mientras entra el push. */
  clock: 2,
  /** Filas de la clasificación con vista (stagger 3 f). */
  rows: [0, 3, 6, 9, 12] as const,
  /** Titular por palabras (stagger 3 f), hasta f112. */
  title: 6,
  /** c1.t2: el módulo de resultado pasa a edición y se eleva (overlay 7 f). */
  result: 15,
  /** Juegos en corcheas: Gómez / Ferrer 6, Moreno / Martínez 4, 6, 3. «Guardar» se habilita 3 f después del último. */
  games: [15, 22, 30, 37] as const,
  /** El cursor aparece y viaja hasta «Guardar resultado». */
  cursorIn: 36,
  /** c1.t4: toque en «Guardar resultado» (press 120 ms). */
  save: 45,
  /** c2.t1: la tabla se reordena (FLIP, overlay 7 f); PJ (f60) y PG (f62) ruedan. */
  reorder: 60,
  /** PTS de Gómez / Ferrer rueda 7 → 9 de un paso, tras PJ y PG (stagger 2 f), con su tic y el ▲. */
  points: 64,
  /** El móvil repite la reordenación 3 f después. */
  phoneLag: 3,
  /** c2.t2 → t4: el punto «EN DIRECTO» late en cada tiempo. */
  pulses: [75, 90, 105] as const,
  /** Push de salida y titular fuera (últimos 8 f). */
  exit: 112,
} as const;

export const T9 = {
  /** Titular: la primera palabra ya asoma en f0 y se queda hasta el corte. */
  title: -2,
  rows: [2, 5, 8] as const,
  /** Entra el módulo de resultado (overlay 7 f). */
  result: 15,
  games: [15, 22, 30, 37] as const,
  /** Toque en guardar (press). */
  save: 45,
  reorder: 60,
  points: 64,
  pulses: [75, 90, 105] as const,
} as const;

// Rally de cuatro «tocs», uno por juego, con paneo alternado ±20.
const rally = (games: readonly number[], pan: number): Cue[] =>
  games.map((frame, i) => ({frame, sfx: "tock", gain: 0.7, pitch: i % 2 === 0 ? 1 : 0.94, pan: i % 2 === 0 ? pan : -pan}));

// Un tic afinado (Sol6) cuando los puntos ruedan 7 → 9: con el whoosh y el ping, tres sonidos en la reordenación.
const pointTick = (frame: number, pan = 0): Cue => ({frame, sfx: "tick", note: "G6", gain: 0.35, pan});

export const cues: SceneCues = {
  landscape: [
    {frame: T16.clock, sfx: "tick", note: "G5", gain: 0.3, pan: -0.6},
    ...rally(T16.games, 0.2),
    {frame: T16.save, sfx: "click", note: "C6", gain: 0.6, pan: 0.2},
    {frame: T16.reorder, sfx: "swipe", gain: 0.45, pan: -0.2},
    {frame: T16.reorder, sfx: "ping", tone: "consonant", gain: 0.55, pan: 0.5},
    pointTick(T16.points, -0.1),
    {frame: T16.exit, sfx: "whoosh", gain: 0.55, dur: 8},
  ],
  portrait: [
    ...rally(T9.games, 0.2),
    {frame: T9.save, sfx: "click", note: "C6", gain: 0.6},
    {frame: T9.reorder, sfx: "swipe", gain: 0.45},
    {frame: T9.reorder, sfx: "ping", tone: "consonant", gain: 0.55},
    pointTick(T9.points),
  ],
};
