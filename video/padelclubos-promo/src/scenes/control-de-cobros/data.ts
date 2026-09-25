import {fmt} from "../../lib/anim";
import {T16} from "./cues";

// Datos del club demo (storyboard §8): cobros del martes.
export const COBRADO_INICIAL = 532;
export const PENDIENTE_INICIAL = 112;
export const PRECIO = 7;

export type Metodo = "tarjeta" | "efectivo";

/** Carlos Navarro + 3 · Pista 4 · 20:30: se cobra jugador a jugador. */
export const JUGADORES: {nombre: string; iniciales: string; metodo: Metodo}[] = [
  {nombre: "Carlos Navarro", iniciales: "CN", metodo: "tarjeta"},
  {nombre: "Sergio Vidal", iniciales: "SV", metodo: "efectivo"},
  {nombre: "Ana Torres", iniciales: "AT", metodo: "tarjeta"},
  {nombre: "Raúl Prats", iniciales: "RP", metodo: "tarjeta"},
];

/** Cobrado hoy 532 → 539 → 546 → 553 → 560 (rueda en cada clic). */
export const COBRADO_KEYS = T16.pay.map((at, i) => ({at, value: fmt.eur2(COBRADO_INICIAL + PRECIO * (i + 1))}));

/** Pendiente 112 → 105 → 98 → 91 → 84 (2 f después). */
export const PENDIENTE_KEYS = T16.pay.map((at, i) => ({at: at + T16.kpiLag, value: fmt.eur2(PENDIENTE_INICIAL - PRECIO * (i + 1))}));
