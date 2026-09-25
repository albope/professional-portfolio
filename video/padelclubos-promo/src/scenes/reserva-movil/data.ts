// Rejilla del jueves (storyboard §8): mismos datos en el panel y en el portal.

export const SLOTS = ["17:30", "19:00", "20:30", "22:00"] as const;
export const SLOT_END = ["19:00", "20:30", "22:00", "23:30"] as const;
export const COURTS = ["Pista 1", "Pista 2", "Pista 3", "Pista 4"] as const;

export type Kind = "class" | "reserved";

export interface Booked {
  court: number;
  slot: number;
  kind: Kind;
  label: string;
}

export const BOOKED: Booked[] = [
  {court: 0, slot: 0, kind: "class", label: "Clase · Iniciación"},
  {court: 0, slot: 1, kind: "reserved", label: "Castillo ×4"},
  {court: 2, slot: 1, kind: "reserved", label: "Moreno ×4"},
  {court: 3, slot: 2, kind: "reserved", label: "Díaz ×4"},
];

/** La franja que reserva Laura Gómez: Pista 2 · jueves 20:30. */
export const TARGET = {court: 1, slot: 2} as const;

export const bookingAt = (court: number, slot: number) => BOOKED.find((b) => b.court === court && b.slot === slot);

export const isTarget = (court: number, slot: number) => court === TARGET.court && slot === TARGET.slot;

/** Celdas del módulo marcador de la reserva. */
export const RESERVA = [
  {label: "Pista", value: "2"},
  {label: "Fecha", value: "JUE"},
  {label: "Hora", value: "20:30"},
] as const;
