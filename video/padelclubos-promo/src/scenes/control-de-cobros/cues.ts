import type {SceneCues} from "../../sfx";

/**
 * Tiempos de la escena en frames locales (16:9, 120 f). La animación lee
 * estos mismos números que los cues: imagen y sonido no pueden desfasarse.
 * La escena no aparece en el corte vertical.
 */
export const T16 = {
  /** Push de entrada de la capa de contenido (7 f, desde +960 px). */
  push: 0,
  /** Tarjetas KPI en cascada (vista, escalonado de 4 f). */
  kpi: [2, 6, 10, 14] as const,
  /** Titular por palabras (queda hasta f112). */
  title: 6,
  /** El reloj rueda 18:40 → 20:25 mientras aterriza el push (como en «ligas-en-directo»), antes del titular. */
  clockRoll: 2,
  /** El cursor aparece y viaja hasta el primer «Cobrar». */
  cursorIn: 16,
  /** Cuatro clics en «Cobrar», uno por corchea (c1.t3 → c1.t4). */
  pay: [30, 37, 45, 52] as const,
  /** Pendiente rueda 2 f después que Cobrado hoy (stagger entre KPI). */
  kpiLag: 2,
  /** c2.t1: la reserva queda pagada (celebrate 12 f). */
  paid: 60,
  /** c2.t2: sube el chip «INTEGRADOS CON VERIFACTU». */
  verifactu: 75,
  /** c2.t3: la vista empieza a reducirse (1 → 0,9, ease-in). */
  shrink: 90,
  /** Whoosh del zoom-out hacia el tablero de «todo-en-uno». */
  whoosh: 105,
  /** Titular y chip salen con vista inversa (últimos 8 f). */
  exit: 112,
} as const;

/** Clics afinados Do–Re–Mi–Sol, uno por cobro. */
const NOTES = ["C6", "D6", "E6", "G6"] as const;

export const cues: SceneCues = {
  landscape: [
    {frame: T16.clockRoll, sfx: "tick", note: "E6", gain: 0.4, pan: -0.7},
    ...T16.pay.flatMap((f, i) => [
      {frame: f, sfx: "click" as const, note: NOTES[i], gain: 0.7, pan: 0.45},
      {frame: f, sfx: "tick" as const, note: NOTES[i], gain: 0.3, pan: 0.3},
    ]),
    {frame: T16.paid, sfx: "success", gain: 0.8, pan: -0.3},
    {frame: T16.paid, sfx: "ping", tone: "consonant", gain: 0.6, pan: -0.3},
    {frame: T16.verifactu, sfx: "tick", note: "G6", gain: 0.3, pan: -0.6},
    {frame: T16.whoosh, sfx: "whooshDown", gain: 0.5, dur: 15},
  ],
  portrait: [],
};
