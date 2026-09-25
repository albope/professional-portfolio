import type {SceneCues} from "../../sfx";

/**
 * Tiempos de la escena en frames locales. La animación lee estos mismos
 * números que los cues: imagen y sonido no pueden desfasarse.
 */
export const T16 = {
  /** Las cuatro pistas de «interruptor» se aplanan en columnas (f0–f12). */
  morph: 0,
  /** El reloj rueda 01:12 → 08:15 (dos dígitos, escalonado de 2 f). */
  clockRoll: 6,
  /** El resto del panel aparece (vista) alrededor de las columnas. */
  panel: 4,
  /** El móvil sube desde y+140 (overlay 7 f). */
  phone: 5,
  title: 6,
  labels: 6,
  /** Toque en Pista 2 · 20:30 del portal. */
  tap: 30,
  /** Sube la hoja con el módulo marcador. */
  sheet: 45,
  /** Subtítulo en tres grupos. */
  sub: [45, 52, 60] as const,
  /** Toque en «Confirmar reserva» + celebrate de 12 f. */
  confirm: 60,
  /** El módulo se despega y vuela hasta el panel (12 f). */
  fly: 75,
  /** Aterriza: la celda se rellena de izquierda a derecha. */
  land: 87,
  /** Push de salida y titulares fuera (últimos 8 f). */
  exit: 112,
} as const;

export const T9 = {
  /** El portal entra (vista) y el titular A por palabras. */
  enter: 0,
  titleOut: 53,
  tap: 30,
  /** Sube la hoja con el velo; titular B. */
  sheet: 60,
  confirm: 75,
  /** La reserva queda hecha: tira verde y check en el módulo. */
  done: 87,
  exit: 112,
} as const;

export const cues: SceneCues = {
  landscape: [
    {frame: T16.morph, sfx: "whoosh", gain: 0.45, dur: 10},
    {frame: T16.clockRoll, sfx: "tick", note: "E6", gain: 0.55},
    {frame: T16.clockRoll + 2, sfx: "tick", note: "A6", gain: 0.55},
    {frame: T16.tap, sfx: "click", note: "C6", gain: 0.7, pan: 0.45},
    {frame: T16.sheet, sfx: "swipe", gain: 0.45, pan: 0.45},
    {frame: T16.confirm, sfx: "click", note: "C6", gain: 0.7, pan: 0.45},
    {frame: T16.confirm, sfx: "success", gain: 0.8, pan: 0.3},
    {frame: T16.fly, sfx: "swipe", gain: 0.55, pan: 0},
    {frame: T16.land, sfx: "ping", tone: "consonant", gain: 0.75, pan: -0.4},
    {frame: T16.exit, sfx: "whoosh", gain: 0.55, dur: 8},
  ],
  portrait: [
    {frame: T9.tap, sfx: "click", note: "C6", gain: 0.7},
    {frame: T9.sheet, sfx: "swipe", gain: 0.4},
    {frame: T9.confirm, sfx: "click", note: "C6", gain: 0.7},
    {frame: T9.confirm, sfx: "success", gain: 0.8},
    {frame: T9.done, sfx: "ping", tone: "consonant", gain: 0.7},
    {frame: T9.exit, sfx: "whoosh", gain: 0.55, dur: 8},
  ],
};
