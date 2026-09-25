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

// El riser, el platillo invertido y el redoble que acompañan la succión los
// pone la música (build_short, que culmina al entrar el t.4), y el t.4 va en
// silencio: el único cue es el «toc» seco sobre el plano quieto.
export const cues: SceneCues = {
  landscape: [{frame: T16.still, sfx: "tock", gain: 1}],
  portrait: [],
};
