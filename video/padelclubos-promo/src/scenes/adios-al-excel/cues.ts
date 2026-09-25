import type {Cue, SceneCues} from "../../sfx";

/**
 * Tiempos de «adios-al-excel» (frames locales, solo 16:9). Imagen y sonido
 * leen de aquí: cada cue y la animación que lo acompaña comparten el número.
 */
export const T16 = {
  /** El reloj rueda 11:20 → 13:05 mientras entra el push. */
  clock: 2,
  title: 6,
  /** La hoja cae dentro de la zona (overlay 7 f), todavía girada −3°. */
  drop: 6,
  /** Contacto de la hoja con la zona: golpe sordo. */
  land: 8,
  /** Se endereza (−3° → 0°, 6 f) y los errores se deshacen. */
  straighten: 15,
  /** Cada error vuelve a su valor con digit-roll (una celda por frame). */
  fixStep: 1,
  /** Cabecera de la hoja → cabecera de la lista. */
  chrome: 30,
  /** Las 8 filas se convierten en filas de socio (vista, stagger 4 f): f30–f58. */
  rows: [30, 34, 38, 42, 46, 50, 54, 58] as const,
  /** Contador 0 → 342 (entra en f30 y se posa en f72). */
  counter: 30,
  counterEnd: 72,
  /** Check verde junto al contador (se dibuja en 8 f). */
  done: 75,
  /** Push de salida y titulares fuera (últimos 8 f). */
  exit: 112,
} as const;

// Un tic por fila, subiendo por la escala de Do.
const SCALE = ["C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6"];

export const cues: SceneCues = {
  landscape: [
    {frame: T16.clock, sfx: "tick", note: "G5", gain: 0.3, pan: -0.6},
    {frame: T16.land, sfx: "impact", gain: 0.35, pan: 0.2},
    {frame: T16.straighten, sfx: "swipe", gain: 0.3, pan: 0.2},
    ...T16.rows.map((frame, i): Cue => ({frame, sfx: "tick", note: SCALE[i], gain: 0.34, pan: 0.25})),
    {frame: T16.done, sfx: "click", note: "C6", gain: 0.55, pan: 0.6},
    {frame: T16.done, sfx: "ping", tone: "consonant", gain: 0.6, pan: 0.6},
    {frame: T16.exit, sfx: "whoosh", gain: 0.55, dur: 8},
  ],
  // No forma parte del corte vertical.
  portrait: [],
};
