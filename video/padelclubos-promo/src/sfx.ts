/**
 * Efectos de sonido disponibles (los sintetiza audio/synth.py).
 * Cada escena declara sus cues en src/scenes/<id>/cues.ts con frames
 * relativos a su inicio; la misma lista puede usarse para animar, así imagen
 * y sonido comparten una única fuente de verdad.
 */
export type Sfx =
  | "tock" // golpe de bola de pádel
  | "whoosh" // barrido de transición (sube)
  | "whooshDown" // barrido de transición (baja)
  | "swipe" // barrido corto y agudo
  | "click" // clic de ratón / botón
  | "pop" // aparición de tarjeta o chip
  | "ping" // aviso de mensaje entrante
  | "success" // confirmación de reserva o pago
  | "tick" // tic seco (contadores, listas)
  | "flip" // paleta de marcador que gira
  | "type" // pulsación de tecla
  | "buzz" // error / conflicto
  | "impact" // golpe grave de revelación
  | "riser" // subida de tensión (usa `dur`)
  | "vibrate" // móvil vibrando (cuadrada 150 Hz con AM a 25 Hz)
  | "clack"; // interruptor mecánico (doble clic): solo drop y CTA

export interface Cue {
  /** Frame relativo al inicio de la escena (30 fps). */
  frame: number;
  sfx: Sfx;
  /** Ganancia lineal (1 = nivel por defecto). */
  gain?: number;
  /** Multiplicador de tono (tock, pop…). */
  pitch?: number;
  /** Duración en frames (riser, whoosh). */
  dur?: number;
  /** -1 izquierda … 1 derecha. */
  pan?: number;
  /** ping: «dissonant» (La5+Si♭5, antes del drop) o «consonant» (Do6+Sol6, después). */
  tone?: "dissonant" | "consonant";
  /** Afinación para click/pop/tick/tock (p. ej. "C6", "E6"): clics afinados en la tonalidad. */
  note?: string;
  /** tock: variante metálica «valla» para errores. */
  metallic?: boolean;
}

export interface SceneCues {
  landscape?: Cue[];
  portrait?: Cue[];
}
