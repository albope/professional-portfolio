import {Euro, Newspaper, Smartphone, Trophy, UserCog, Users, type LucideIcon} from "lucide-react";
import {fmt} from "../../lib/anim";

/** Datos del club demo que arrastra el tablero (storyboard §8). */
export const DATA = {
  reservasHoy: "24",
  socios: "342",
  cobrado: fmt.eur2(560),
  pendiente: fmt.eur2(84),
  participantes: "86",
  ocupacion: 87,
  // Pista 1–4: media 87 %.
  ocupacionPistas: [92, 88, 85, 83],
} as const;

export type TileData =
  | {kind: "number"; value: string; pre?: string; post?: string}
  | {kind: "text"; value: string; live?: boolean};

export interface MainTile {
  n: string;
  name: string;
  col: number;
  row: number;
  icon?: LucideIcon;
  viz?: "grid" | "bars";
  data: TileData;
}

export const MAIN_TILES: MainTile[] = [
  {n: "01", name: "Reservas", col: 0, row: 0, viz: "grid", data: {kind: "number", value: DATA.reservasHoy, post: "hoy"}},
  {n: "02", name: "Socios", col: 1, row: 0, icon: Users, data: {kind: "number", value: DATA.socios}},
  {n: "03", name: "Ligas y torneos", col: 2, row: 0, icon: Trophy, data: {kind: "text", value: "En directo", live: true}},
  {n: "04", name: "Cobros", col: 3, row: 0, icon: Euro, data: {kind: "number", value: DATA.cobrado}},
  {n: "05", name: "Portal móvil", col: 0, row: 1, icon: Smartphone, data: {kind: "text", value: "Sin descargar nada"}},
  {n: "06", name: "Analíticas", col: 1, row: 1, viz: "bars", data: {kind: "number", value: fmt.pct(DATA.ocupacion), pre: "Ocupación"}},
  {n: "07", name: "Noticias y blog", col: 2, row: 1, icon: Newspaper, data: {kind: "text", value: "Blog del club"}},
  {n: "08", name: "Roles y permisos", col: 3, row: 1, icon: UserCog, data: {kind: "text", value: "Acceso por roles"}},
];

export interface ExtraTile {
  id: "academia" | "bar" | "multisede" | "verifactu";
  name: string;
  sub?: string;
  /** Interruptor estándar (VeriFactu no tiene: va incluido). */
  toggle: boolean;
}

export const EXTRAS: ExtraTile[] = [
  {id: "academia", name: "Academia", sub: "Clases y cuotas", toggle: true},
  {id: "bar", name: "Bar y tienda", sub: "Consumos", toggle: true},
  {id: "multisede", name: "Multisede", sub: "Varias sedes", toggle: true},
  {id: "verifactu", name: "VeriFactu", toggle: false},
];

/** Mini-rejilla de la landing: 4 pistas × 4 franjas (r = reservada, c = clase, l = libre). */
export const MINI_GRID: ("r" | "c" | "l")[][] = [
  ["r", "c", "r", "l"],
  ["r", "r", "l", "r"],
  ["c", "r", "r", "r"],
  ["l", "r", "r", "l"],
];
