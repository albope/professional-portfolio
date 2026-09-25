import type {SceneCues} from "../../sfx";
import {beats} from "../../lib/anim";

/**
 * Tiempos de «suena-familiar» (1 compás, 60 f). Solo existe en 16:9.
 * Imagen y sonido leen de aquí.
 */
export const T16 = {
  /** «¿Suena familiar?» por palabras (vista, stagger 6 f). */
  title: 0,
  titleStep: 6,
  /** El montón pierde foco para dejar sitio al titular. */
  focus: 2,
  /** Órbita: giro 0 → 8° y contracción 1 → 0,7 (ease-in) hasta t.3. */
  orbitEnd: beats(2), // f30
  /** t.3: el titular sale (f30–f38)… */
  titleOut: beats(2), // f30
  /** …los fragmentos son succionados al centro (12 f, ease-in exponencial)… */
  suck: beats(2), // f30
  suckDur: 12,
  /** …y se dibuja el contorno del isotipo (10 f): se cierra en f40, con lo último ya dentro. */
  outline: beats(2), // f30
  outlineDur: 10,
  /** t.4: plano quieto; un único «toc» en el silencio. */
  still: beats(3), // f45
} as const;

// El riser y el platillo invertido que culminan en t.3 los pone la música
// (build_short), y t.4 va en silencio: aquí solo suena lo que se ve.
export const cues: SceneCues = {
  landscape: [
    // La succión: barrido descendente cuyo pico cae en la corchea (f37).
    {frame: T16.suck, sfx: "whooshDown", dur: 14, gain: 0.5},
    {frame: T16.still, sfx: "tock", gain: 1},
  ],
  portrait: [],
};
