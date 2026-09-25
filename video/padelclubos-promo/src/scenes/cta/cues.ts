import type {Cue, SceneCues} from "../../sfx";

/**
 * Tabla de tiempos del golpe final (frames locales). La animación y los cues
 * leen los mismos números. La música ya pone el golpe (Do add9, sub boom y
 * crash en f0) y el acorde final del outro (f120): aquí solo va lo que se ve.
 */
export const T = {
  landscape: {
    /** Palabras del titular en corcheas. */
    words: [0, 7, 15, 22, 30, 37],
    /** El punto final aterriza como bloque del isotipo (c1.t4). */
    dot: 45,
    /** Barrido verde de izquierda a derecha (c2.t2), 8 f. */
    sweep: 75,
    lockup: 80,
    sub: 90,
    button: 97,
    press: 105,
    /** El sello dibuja su borde (c3.t1). */
    seal: 120,
    /** La URL se escribe a 2 f por carácter. */
    type: 135,
    firma: 150,
    cursorOff: 172,
    /** Último «toc» de firma (c4.t1): desde aquí, todo fijo. */
    sign: 180,
  },
  portrait: {
    words: [0, 7, 15, 22, 30, 37],
    dot: 45,
    sweep: 75,
    lockup: 80,
    badge: 90,
    button: 97,
    press: 105,
    /** Aparece la fila de total vacía, con el cursor. */
    row: 112,
    type: 120,
    sign: 120,
    /** Desde aquí, todo fijo. */
    cursorOff: 150,
  },
} as const;

/** Frames por carácter al escribir la URL. */
export const TYPE_STEP = 2;

const L = T.landscape;
const P = T.portrait;

const landscape: Cue[] = [
  {frame: 0, sfx: "tock"},
  {frame: L.dot, sfx: "tock", pitch: 1.2, gain: 0.8},
  {frame: L.sweep, sfx: "whoosh", dur: 12, gain: 0.8},
  {frame: L.sweep, sfx: "clack"},
  {frame: L.press, sfx: "click", note: "C6"},
  // Tecleo muy suave, en corcheas mientras se escribe la URL.
  ...[0, 7, 15, 22].map((d): Cue => ({frame: L.type + d, sfx: "type", gain: 0.5})),
  {frame: L.sign, sfx: "tock"},
];

const portrait: Cue[] = [
  {frame: 0, sfx: "tock"},
  {frame: P.dot, sfx: "tock", pitch: 1.2, gain: 0.8},
  {frame: P.sweep, sfx: "whoosh", dur: 12, gain: 0.8},
  {frame: P.sweep, sfx: "clack"},
  {frame: P.press, sfx: "click", note: "C6"},
  {frame: P.sign, sfx: "tock"},
  ...[7, 15, 22].map((d): Cue => ({frame: P.type + d, sfx: "type", gain: 0.45})),
];

export const cues: SceneCues = {landscape, portrait};
