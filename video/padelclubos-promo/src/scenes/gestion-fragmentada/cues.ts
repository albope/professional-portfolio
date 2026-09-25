import type {Cue, SceneCues} from "../../sfx";
import {bars, beats} from "../../lib/anim";

/**
 * Tiempos de «gestion-fragmentada» (16:9, 2 compases = 120 f). Imagen y
 * sonido leen de aquí: cada cue y la animación que lo acompaña comparten el
 * mismo número. La escena no existe en el corte 9:16.
 */
export const T = {
  /** Frase del titular y ventana que cae con ella: socios, pagos, liga (c1.t1, c1.t3, c2.t1). */
  drops: [0, beats(2), bars(1)] as const,
  /**
   * La caída arranca 3 f antes del tiempo: en el propio tiempo (golpe de
   * papel) la ventana ya está a medio posarse, y el f0 nunca queda vacío.
   */
  lead: 3,
  /** El móvil pequeño entra desde la derecha, escalonado tras la hoja de la liga, vibrando. */
  phone: bars(1) + 3,
  /** Pulsos de vibración del móvil (los dos del sonido «vibrate», 0 y 0,26 s), relativos a `phone`. */
  vibePulses: [0, 8] as const,
  vibeLen: 6,
  /** Errores celda a celda en corcheas: socios C3, C4 · pagos C3, C4, D4. */
  errors: [beats(1), beats(1) + 7, beats(2) + 7, beats(3), beats(3) + 7] as const,
  /** Las dos posiciones «1» de la liga se marcan en rojo. */
  duplicate: bars(1) + 7,
  /** Se rompe entera la columna PTS de la liga (c2.t2); escalonado de 2 f por celda. */
  ptsBreak: bars(1) + beats(1),
  ptsStagger: 2,
  /**
   * Todo se comprime (c2.t3, arranque ease-in) sobre su propio centro y
   * después viaja al centro del cuadro. El viaje empieza tarde: el montón no
   * entra en la columna del titular mientras este se lee (hasta f110) y ocupa
   * el hueco que deja al salir. Se posa a velocidad casi nula en el último
   * frame, que es el primero de «suena-familiar».
   */
  compress: bars(1) + beats(2),
  compressEnd: bars(2) - 12,
  travel: bars(1) + beats(2) + 12,
  travelEnd: bars(2) - 1,
  /** Salida de la HUD: titular y reloj (vista inversa 8 f). */
  hudOut: 110,
} as const;

// Tics de los errores afinados en La menor (La–Do–Mi–Si, el contorno del pluck).
const ERR_NOTES = ["A5", "C6", "E6", "B5", "C6"];

const landscape: Cue[] = [
  // Cada ventana: whoosh desde que empieza a caer (su pico, ~4 f después, coincide
  // con el aterrizaje) + golpe seco de papel al posarse, en el tiempo.
  ...T.drops.flatMap((frame, i): Cue[] => [
    {frame: Math.max(0, frame - T.lead), sfx: "swipe", gain: 0.75, pan: 0.35 + i * 0.1},
    // Golpe seco muy suave: el bombo half-time ya cae en estos mismos tiempos.
    {frame, sfx: "impact", gain: 0.22, pan: 0.3},
  ]),
  // Errores en corcheas (−22 dB aprox.).
  ...T.errors.map((frame, i): Cue => ({frame, sfx: "tick", note: ERR_NOTES[i], gain: 0.5, pan: 0.4})),
  // El móvil del gerente llega vibrando; la posición duplicada (f67) se marca en silencio mientras vibra.
  {frame: T.phone, sfx: "vibrate", gain: 0.6, pan: 0.65},
  // «Bonk» grave: se rompe la liga.
  {frame: T.ptsBreak, sfx: "buzz", pitch: 0.7, gain: 0.85, pan: 0.2},
  // El riser desde f60 ya lo pone la música (sección «tension», riser_from c.6).
];

export const cues: SceneCues = {landscape, portrait: []};
