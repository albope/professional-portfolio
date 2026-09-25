import type {SceneCues} from "../../sfx";

/** Tiempos del 16:9 (2 compases, 120 f). La animación lee estos mismos números. */
export const T16 = {
  /** Downbeat del drop: el bloque verde entra y barre la arena (7 f). */
  drop: 0,
  /**
   * El isotipo baja de 10× a su sitio en el lockup: zoom geométrico con ease.inOut
   * en f5–f21 (ningún frame encoge más de ~23 %, sin desenfoque). Los primeros
   * frames apenas se mueven: el movimiento visible arranca con el whoosh (lockup).
   */
  zoom: 5,
  zoomDur: 16,
  /** Whoosh del zoom. */
  lockup: 8,
  /** «PadelClub» letra a letra con máscara (10 f), en el tiempo 2. */
  word: 15,
  /** Chip «OS» con press (4 f), en la corchea. */
  chip: 23,
  /** H1 palabra a palabra (stagger 3 f). */
  h1: 30,
  /** Subrayado verde de «tu club» (10 f). */
  underline: 45,
  /**
   * Lockup + H1 centrados ópticamente (centro ≈ y540) hasta el c2; en su downbeat
   * suben a su sitio (ease.inOut, 12 f) mientras la pista empieza a dibujarse.
   */
  rise: 60,
  /** La pista se dibuja por grupos, uno por tiempo. */
  perimeter: 60,
  net: 75,
  service: 90,
  center: 97,
  /** Lockup y H1 salen hacia arriba; la pista se reduce a 400×200 (overlay 7 f). */
  exit: 105,
  /** Réplica ×4 en horizontal (stagger 3 f): en el tiempo, la pista se parte en dos… */
  split: 105,
  /** …y cada mitad suelta su réplica exterior. */
  spread: 108,
} as const;

/** Tiempos del 9:16 (1 compás, 60 f): solo el lockup. */
export const T9 = {
  drop: 0,
  zoom: 5,
  zoomDur: 16,
  lockup: 8,
  word: 15,
  chip: 23,
  /** El lockup se reduce y sale con vista inversa (f52–f59). */
  exit: 52,
} as const;

// El impacto y el crash del drop ya los pone la música (sec_drop): aquí solo
// suena lo que se ve.
export const cues: SceneCues = {
  landscape: [
    {frame: T16.drop, sfx: "clack", gain: 1},
    {frame: T16.drop, sfx: "tock", gain: 0.9},
    {frame: T16.lockup, sfx: "whoosh", dur: 12, gain: 0.7, pan: -0.25},
    {frame: T16.h1, sfx: "click", note: "C6", gain: 0.45},
    {frame: T16.perimeter, sfx: "swipe", gain: 0.5},
    {frame: T16.net, sfx: "swipe", gain: 0.5},
    {frame: T16.service, sfx: "swipe", gain: 0.5},
    {frame: T16.center, sfx: "swipe", gain: 0.42},
    {frame: T16.exit, sfx: "swipe", gain: 0.6},
  ],
  portrait: [
    {frame: T9.drop, sfx: "clack", gain: 1},
    {frame: T9.drop, sfx: "tock", gain: 0.9},
    {frame: T9.lockup, sfx: "whoosh", dur: 12, gain: 0.6, pan: -0.25},
  ],
};
