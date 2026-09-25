import type {Cue, SceneCues} from "../../sfx";
import {bars, beats} from "../../lib/anim";

/**
 * Tiempos de «todo-en-uno» (frames locales, solo 16:9: la escena no está en
 * el corte vertical). Imagen y sonido leen de aquí: cada cue y la animación
 * que lo acompaña comparten el mismo número.
 */
export const T16 = {
  /**
   * f0–f12: la Recepción se encoge hasta ser la casilla 04. Continúa el
   * pre-encogido de «control-de-cobros» a su misma velocidad, acelera y se
   * posa (sin rebote) antes de que la casilla 03 se vea.
   */
  zoom: 0,
  zoomDur: 12,
  /** El contenido de la Recepción se funde antes del tramo rápido del zoom (f0–f4). */
  recFade: 4,
  /** El reloj rueda 20:25 → 22:00. */
  clockRoll: 0,
  /** Titular por palabras (stagger 3 f). */
  headline: 4,
  headlineStep: 3,
  /** Casillas 01–08 en semicorcheas (cada 4 f); la 04 llega con la Recepción. */
  tiles: {"01": 0, "02": 4, "03": 8, "05": 12, "06": 16, "07": 20, "08": 24} as Record<string, number>,
  /** Contenido de la casilla 04 dentro de la tarjeta que se encoge (releva al de la Recepción). */
  tile04: 3,
  /** c1.t3: fila de extras y línea mono. */
  extras: beats(2),
  extrasStep: 3,
  /** El cursor entra desde abajo. */
  cursorIn: 34,
  /** c1.t4: se enciende Academia. */
  academia: beats(3),
  /** Corchea siguiente: Bar y tienda. */
  bar: beats(3) + 7,
  /** c2.t1: entra el chip «Incluido» de VeriFactu. */
  verifactu: bars(1),
  /** c2.t2: el cursor se posa sobre Multisede y no lo activa. */
  multisede: bars(1) + beats(1),
  hoverEnd: 84,
  /** El cursor se retira. */
  cursorOut: 84,
  /** c2.t3: se hace de noche (capa #14120F de 0 a 60 % en 30 f). */
  night: bars(1) + beats(2),
  nightDur: 30,
  /** c2.t4: el reloj pasa a su versión de noche (6 f), el chip con el que arranca «tu-descansas». */
  clockNight: bars(1) + beats(3),
  /** Salida de la HUD (vista inversa; a f119 ya no queda nada). */
  hudOut: 112,
} as const;

// Ticks suaves de entrada del tablero: arranque de la segunda fila (05) y última casilla (08).
// Con el whoosh de f0 son tres sonidos en el primer segundo (máx. ~3 SFX/s).
const entryTicks: Cue[] = [
  {frame: T16.tiles["05"], sfx: "tick", note: "C6", gain: 0.35},
  {frame: T16.tiles["08"], sfx: "tick", note: "E6", gain: 0.35},
];

/**
 * f0 whoosh del zoom-out; ticks suaves de entrada; Do–Mi–Sol en los dos
 * interruptores y el chip de VeriFactu (las tres primeras notas del motivo
 * de marimba). f75: silencio a propósito donde tocaría la cuarta nota
 * (Multisede no se activa). El barrido de filtro de f90–f119 es de la música.
 */
export const cues: SceneCues = {
  landscape: [
    {frame: T16.zoom, sfx: "whooshDown", dur: T16.zoomDur, gain: 0.8},
    ...entryTicks,
    {frame: T16.academia, sfx: "click", note: "C6"},
    {frame: T16.bar, sfx: "click", note: "E6"},
    {frame: T16.verifactu, sfx: "click", note: "G6"},
  ],
  portrait: [],
};
