// Geometría 16:9 (rejilla de 8 px). Panel del club a lo ancho del cuadro,
// bajo la banda de la HUD (reloj, titular y contador).

export const PANEL = {x: 96, y: 256, w: 1728, h: 768} as const;
/** Sidebar de 264 px a 0,7×. */
export const SIDE = 184;
export const TOPBAR = 56;
/** Contenido del panel (márgenes de 32 px). */
export const CONTENT = {x: PANEL.x + SIDE + 32, r: PANEL.x + PANEL.w - 32} as const;
export const PAGE_TITLE_Y = PANEL.y + TOPBAR + 24;

/** Zona de importación (borde discontinuo). */
export const ZONE = {x: CONTENT.x, y: 400, w: CONTENT.r - CONTENT.x, h: 592} as const;
/** Hoja / lista: mismo marco antes y después de importar. */
export const CARD = {x: 728, y: ZONE.y + 24, w: 1040, h: 544} as const;
/** Columna de la etiqueta, a la izquierda de la zona, centrada con la hoja. */
export const LABEL_COL = {x: ZONE.x + 32, y: CARD.y, w: 352, h: CARD.h} as const;
export const CHROME = 72; // barra de título (44) + letras de columna (28)
export const TITLE_H = 44;
export const HEAD = 40;
export const ROW = 54;

/** Columnas de la hoja: filas · Nombre · Teléfono · Cuota · Pagado. */
export const GUT = 56;
export const COLS = [376, 248, 208, 152] as const;
export const colX = (i: number) => GUT + COLS.slice(0, i).reduce((a, w) => a + w, 0);

/** Push del acto de producto: ±960 px (entra 7 f, sale 8 f). */
export const PUSH = 960;
