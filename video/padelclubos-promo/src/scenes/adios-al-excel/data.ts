import {fmt} from "../../lib/anim";

/** Socios de la hoja «socios_v3_FINAL.xlsx» (datos del club demo). */
export interface Member {
  name: string;
  initials: string;
  /** Cuota del mes al día (Sí) o pendiente (No). */
  paid: boolean;
  /** Error de la hoja en la columna Cuota. */
  err?: "#¡VALOR!" | "#¡REF!";
}

export const FILE = "socios_v3_FINAL.xlsx";
export const TOTAL = 342;
export const FEE = fmt.eur2(35);

export const MEMBERS: Member[] = [
  {name: "Laura Gómez", initials: "LG", paid: true},
  {name: "Javi Martínez", initials: "JM", paid: true, err: "#¡VALOR!"},
  {name: "Pedro Sanz", initials: "PS", paid: true, err: "#¡REF!"},
  {name: "Marta Ruiz", initials: "MR", paid: true},
  {name: "Carlos Navarro", initials: "CN", paid: true},
  {name: "Lucía Ferrer", initials: "LF", paid: true, err: "#¡REF!"},
  {name: "Álvaro Moreno", initials: "ÁM", paid: false},
  {name: "Nuria Castillo", initials: "NC", paid: false, err: "#¡VALOR!"},
];

/** Orden en que se deshacen los errores (índices de fila). */
export const ERROR_ROWS = MEMBERS.map((m, i) => (m.err ? i : -1)).filter((i) => i >= 0);
