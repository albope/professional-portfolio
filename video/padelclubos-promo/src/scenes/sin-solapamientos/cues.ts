import type {Cue, SceneCues} from "../../sfx";

/**
 * Tiempos de «sin-solapamientos» (frames locales). Imagen y sonido leen de
 * aquí: cada cue y la animación que lo acompaña comparten el mismo número.
 */
export const T16 = {
  /** El reloj rueda 08:15 → 11:20 mientras entra el push. */
  clock: 2,
  /** A ya está asentado: PISTA, FECHA y HORA ruedan. */
  roll: [2, 4, 6] as const,
  title: 6,
  /** B entra desde x+900 hacia el mismo hueco. */
  enter: 8,
  /** Se detiene en seco a 16 px de A: borde warning y aviso. */
  stop: 15,
  /** El cursor aparece y viaja hasta la celda PISTA de B. */
  cursorIn: 28,
  /** Clic en PISTA: se despliega el selector. */
  open: 45,
  /** Clic en «Pista 3 · Libre». */
  pick: 52,
  /** El aviso se cierra (15 → 57 = 42 f, el mínimo para sus 4 palabras). */
  noticeOut: 57,
  /** PISTA rueda 1 → 3, B se coloca junto a A, check y subtítulo. */
  resolve: 60,
  /** Tres tics de trinquete durante el digit-roll 1 → 3 (6 f). */
  rollSteps: [60, 62, 64] as const,
  /** Chip «Con Padel Club OS» (press) con el ping consonante, en la corchea siguiente. */
  chip: 67,
  /** Push de salida y titulares fuera (últimos 8 f). */
  exit: 112,
} as const;

export const T9 = {
  /** Titular A: la primera palabra ya asoma en f0. */
  title: -3,
  titleOut: 52,
  /** B sube desde abajo hacia el hueco ocupado. */
  enter: 8,
  stop: 15,
  /** Chip «Ocupada». */
  warn: 20,
  /** Toque en la celda PISTA. */
  tap: 45,
  /** PISTA rueda 1 → 3, B se asienta, «Confirmada» y titular B. */
  resolve: 60,
  rollSteps: [60, 62, 64] as const,
  exit: 112,
} as const;

// Tics del digit-roll afinados en Do mayor (Do–Mi–Sol) antes de la quinta del celebrate.
const rollTicks = (steps: readonly number[], gain: number): Cue[] =>
  steps.map((frame, i) => ({frame, sfx: "tick", note: ["C6", "E6", "G6"][i], gain}));

export const cues: SceneCues = {
  landscape: [
    {frame: T16.clock, sfx: "tick", note: "G5", gain: 0.3, pan: -0.6},
    {frame: T16.enter, sfx: "swipe", gain: 0.6, pan: 0.5},
    {frame: T16.stop, sfx: "tock", pitch: 0.6, gain: 0.85, pan: 0.1},
    {frame: T16.stop, sfx: "buzz", gain: 0.3, pan: 0.2},
    {frame: T16.open, sfx: "click", note: "C6", gain: 0.6, pan: 0.15},
    {frame: T16.pick, sfx: "click", note: "E6", gain: 0.6, pan: 0.2},
    ...rollTicks(T16.rollSteps, 0.4),
    // −6 dB respecto al celebrate de «reserva-movil» (0,8).
    {frame: T16.resolve, sfx: "success", gain: 0.4, pan: 0.2},
    {frame: T16.chip, sfx: "ping", tone: "consonant", gain: 0.6, pan: -0.4},
    {frame: T16.exit, sfx: "whoosh", gain: 0.55, dur: 8},
  ],
  portrait: [
    {frame: T9.enter, sfx: "swipe", gain: 0.5},
    {frame: T9.stop, sfx: "tock", pitch: 0.6, gain: 0.85},
    {frame: T9.warn, sfx: "buzz", gain: 0.3},
    {frame: T9.tap, sfx: "click", note: "C6", gain: 0.6},
    ...rollTicks(T9.rollSteps, 0.4),
    {frame: T9.resolve, sfx: "success", gain: 0.4},
    {frame: T9.exit, sfx: "whoosh", gain: 0.55, dur: 8},
  ],
};
