import type {Cue, SceneCues} from "../../sfx";

// Tiempos de la escena: la animación y el sonido leen los mismos números.

/** 16:9 · 2 compases (120 f). */
export const L = {
  /** Tiempos del compás 1 en que parpadean los dos puntos del reloj. */
  beat: 15,
  /** Vibración y notificación de Javi. */
  notif: 15,
  /** El reloj gigante viaja a la esquina. */
  toCorner: 45,
  /** «Mensajes a deshora.» palabra a palabra. */
  title: 50,
  /** La pantalla de bloqueo se abre al chat. */
  chatOpen: 60,
  /** Burbujas nuevas en corcheas (la de Pedro es la segunda). */
  bubbles: [60, 67, 75, 82, 90, 97],
  /** Misma pista, misma hora: contorno rojo. */
  conflict: 90,
  /** Las dos burbujas se despegan hacia el centro. */
  detach: 105,
  /** Salida de la HUD (vista inversa). */
  hudOut: 112,
} as const;

/** Hora del chip con cada burbuja (digit-roll). */
export const CHIP_TIMES = ["23:48", "23:52", "00:06", "00:21", "00:40", "01:12"] as const;
/** «SIN LEER» con cada burbuja: de 3 a 38. */
export const UNREAD = [3, 9, 16, 23, 31, 38] as const;

/** 9:16 · 1 compás (60 f). */
export const P = {
  /** Las burbujas esqueleto empujan hacia arriba en cada corchea. */
  pushes: [8, 15, 23, 30, 38],
  /** Vibraciones del chat. */
  vibrate: [0, 30],
  /** La burbuja de Javi se contornea y se desprende hacia el centro. */
  detach: 45,
} as const;

/** Badge del chat vertical: de 12 a 38 con cada empuje. */
export const BADGE = [12, 17, 22, 27, 33, 38] as const;

// Un semitono arriba o abajo para que la ráfaga de avisos no suene clonada.
const SEMI = 2 ** (1 / 12);
const PING_PITCH = [1, SEMI, 1 / SEMI, 1, SEMI, 1 / SEMI];

// El tic de reloj en negras ya lo da la música (sección «tension»): no se duplica.
const landscape: Cue[] = [
  // Llega el WhatsApp de Javi: vibración + ping disonante.
  {frame: L.notif, sfx: "vibrate", gain: 0.9, pan: 0.45},
  {frame: L.notif, sfx: "ping", tone: "dissonant", pan: 0.45},
  // El reloj gigante vuela a la esquina.
  {frame: L.toCorner, sfx: "swipe", gain: 0.7, pan: -0.5},
  // Un ping disonante por burbuja (−18 dB), desde el móvil a la derecha.
  ...L.bubbles.map(
    (frame, i): Cue => ({frame, sfx: "ping", tone: "dissonant", gain: i === 1 ? 0.62 : 0.42, pitch: PING_PITCH[i], pan: 0.4}),
  ),
  // Las dos burbujas se despegan hacia el centro.
  {frame: L.detach, sfx: "whoosh", gain: 0.6, dur: 9, pan: 0.2},
];

const portrait: Cue[] = [
  // Gancho: el móvil ya está vibrando en f0.
  {frame: P.vibrate[0], sfx: "vibrate", gain: 0.9},
  {frame: 0, sfx: "ping", tone: "dissonant", gain: 0.6},
  // Pings en corcheas con cada empuje; en f30 manda la segunda vibración.
  ...P.pushes.map(
    (frame, i): Cue =>
      frame === P.vibrate[1]
        ? {frame, sfx: "vibrate", gain: 0.8}
        : {frame, sfx: "ping", tone: "dissonant", gain: 0.36 + (i % 2) * 0.1, pitch: PING_PITCH[i + 1]},
  ),
  // La burbuja de Javi se desprende (match cut con «dobles-reservas»).
  {frame: P.detach, sfx: "swipe", gain: 0.6},
];

export const cues: SceneCues = {landscape, portrait};
