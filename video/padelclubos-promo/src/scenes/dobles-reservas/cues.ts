import type {Cue, SceneCues} from "../../sfx";
import {bars, beats} from "../../lib/anim";

/**
 * Tiempos de «dobles-reservas» (frames locales). Imagen y sonido leen de
 * aquí: el cue y la animación que lo acompaña comparten el mismo número.
 */
export interface Timing {
  /** El módulo A aterriza (fin del match cut, overlay 7 f). */
  land: number;
  /** PISTA, FECHA y HORA ruedan (digit-roll): un tic por celda. */
  roll: [number, number, number];
  /** Vista del nombre en la fila de total de A. */
  rowText: number;
  /** Titular por palabras. */
  title: number;
  /** Segundo grupo: módulo B (16:9) o fila «Pedro + 3» (9:16). */
  second: number;
  /** Impacto: temblor, bordes a rojo, trama. */
  impact: number;
  /** Los módulos caen fuera de cuadro (ease-in 12 f). */
  fall: number;
  /** Salida de la HUD (vista inversa): termina en el último frame de la escena. */
  hudOut: number;
}

export const T16: Timing = {
  land: 0,
  roll: [2, 4, 6],
  // Javi se lee desde el aterrizaje; B se monta encima sin taparle la fila de total.
  rowText: 2,
  title: 0,
  second: beats(2), // c1.t3 · f30
  impact: bars(1), // c2.t1 · f60
  fall: bars(1) + beats(3), // c2.t4 · f105
  hudOut: 112,
};

export const T9: Timing = {
  land: 0,
  roll: [2, 4, 6],
  rowText: 6,
  title: 0,
  second: beats(1), // t.2 · f15
  impact: beats(2), // t.3 · f30
  fall: beats(3), // t.4 · f45
  hudOut: 52,
};

// Tics del digit-roll afinados en La menor (La–Do–Mi, el contorno del pluck).
const rollTicks = (t: Timing, gain: number): Cue[] =>
  t.roll.map((frame, i) => ({frame, sfx: "tick", note: ["A5", "C6", "E6"][i], gain}));

export const cues: SceneCues = {
  landscape: [
    {frame: T16.land, sfx: "swipe", gain: 0.8},
    ...rollTicks(T16, 0.55),
    {frame: T16.second, sfx: "whoosh", dur: 12, gain: 0.8},
    {frame: T16.impact, sfx: "buzz"},
    {frame: T16.impact, sfx: "tock", pitch: 0.9, metallic: true},
    {frame: T16.fall, sfx: "whooshDown", dur: 15},
  ],
  portrait: [
    {frame: T9.land, sfx: "swipe", gain: 0.8},
    ...rollTicks(T9, 0.45),
    {frame: T9.second, sfx: "swipe", gain: 0.9},
    {frame: T9.impact, sfx: "buzz"},
    {frame: T9.impact, sfx: "tock", pitch: 0.9, metallic: true},
    {frame: T9.fall, sfx: "whooshDown", dur: 15},
  ],
};
