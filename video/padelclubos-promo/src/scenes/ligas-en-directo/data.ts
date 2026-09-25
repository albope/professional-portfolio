// Datos de la Liga de Otoño · 2.ª categoría (storyboard §8). Sistema de
// puntos real del producto: victoria 2, derrota 1.

export interface Stats {
  pj: number;
  pg: number;
  pts: number;
}

export interface Standing {
  id: "ns" | "rc" | "gf" | "mm" | "dr";
  name: string;
  /** Posición (0-based) antes y después del resultado. */
  from: number;
  to: number;
  before: Stats;
  after: Stats;
}

export const LIGA = "Liga de Otoño · 2.ª categoría";

export const STANDINGS: Standing[] = [
  {id: "ns", name: "Navarro / Sanz", from: 0, to: 0, before: {pj: 6, pg: 5, pts: 11}, after: {pj: 6, pg: 5, pts: 11}},
  {id: "rc", name: "Ruiz / Castillo", from: 1, to: 2, before: {pj: 5, pg: 3, pts: 8}, after: {pj: 5, pg: 3, pts: 8}},
  {id: "gf", name: "Gómez / Ferrer", from: 2, to: 1, before: {pj: 5, pg: 2, pts: 7}, after: {pj: 6, pg: 3, pts: 9}},
  {id: "mm", name: "Moreno / Martínez", from: 3, to: 3, before: {pj: 4, pg: 1, pts: 5}, after: {pj: 5, pg: 1, pts: 6}},
  {id: "dr", name: "Díaz / Romero", from: 4, to: 4, before: {pj: 4, pg: 0, pts: 4}, after: {pj: 4, pg: 0, pts: 4}},
];

/** Resultado: Gómez / Ferrer 6-4 6-3 Moreno / Martínez. */
export const RESULT = {
  pairs: ["Gómez / Ferrer", "Moreno / Martínez"] as const,
  /** Juegos por set: [pareja][set]. */
  games: [
    ["6", "6"],
    ["4", "3"],
  ] as const,
  /** Orden de escritura (corcheas): set 1 arriba, set 1 abajo, set 2 arriba, set 2 abajo. */
  order: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ] as const,
};

/** Pasos del digit-roll de un valor: PTS 7 → 8 → 9 sube de uno en uno. */
export const rollSteps = (from: number, to: number, at: number, points: readonly number[]) => {
  if (from === to) return [];
  const n = to - from;
  if (n === 1) return [{at, value: String(to)}];
  return points.slice(0, n).map((f, i) => ({at: f, value: String(from + i + 1)}));
};
