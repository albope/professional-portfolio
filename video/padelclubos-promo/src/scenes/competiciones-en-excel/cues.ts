import type {SceneCues} from "../../sfx";
import {beats} from "../../lib/anim";

/**
 * Tiempos de «competiciones-en-excel» (solo 9:16, 1 compás = 60 f). Imagen
 * y sonido leen de aquí: cada cue y la animación que lo acompaña comparten
 * el mismo número.
 */
export const T9 = {
  /** La hoja cae sobre la mesa (overlay 7 f): arranca en el corte y se posa en la corchea. */
  drop: 0,
  land: 7,
  /** «Competiciones en Excel.» por palabras (vista, stagger 4 f). */
  title: 0,
  titleStep: 4,
  /** Errores de la columna PTS, D2 → D6, en semicorcheas sobre el redoble de la música. */
  errors: [beats(0.5), beats(0.75), beats(1), beats(1.25), beats(1.5)] as const, // f8 f11 f15 f19 f23
  /** Se selecciona la columna rota entera (D2:D6): completa justo en t.3. */
  range: beats(1.75), // f26
  rangeDur: 4,
  /** t.3: la hoja es succionada al centro del contorno (12 f, ease-in exponencial)… */
  suck: beats(2), // f30
  suckDur: 12,
  /** …mientras se dibuja el contorno vacío del isotipo (10 f). */
  outline: beats(2) + 1, // f31
  outlineDur: 10,
  /** El titular se queda hasta f33 y sale con vista inversa (f34–f40). */
  titleOut: 33,
  titleOutDur: 7,
  /** t.4: plano quieto con el contorno vacío; un único «toc». */
  still: beats(3), // f45
} as const;

// El riser, el platillo invertido y el redoble en semicorcheas (que marca la
// propagación de los errores y acompaña la succión) los pone la música
// (build_short, que culmina al entrar el t.4), y la última corchea va en
// silencio: como en «suena-familiar», aquí solo suena lo que la música no da.
export const cues: SceneCues = {
  landscape: [],
  portrait: [
    // La hoja cae: barrido corto y golpe seco de papel al posarse.
    {frame: T9.drop, sfx: "swipe", gain: 0.7},
    {frame: T9.land, sfx: "impact", gain: 0.2},
    {frame: T9.still, sfx: "tock", gain: 1},
  ],
};
