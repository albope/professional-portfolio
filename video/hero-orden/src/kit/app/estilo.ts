import type {CSSProperties} from "react"

/**
 * Texto de una línea centrado en su caja de alto `h`. Quita `tabular-nums` de los
 * estilos de marca: en Schibsted Grotesk la variante tabular también ensancha la
 * coma y los dos puntos («Antes , en», «19 : 00»).
 */
export const linea = (base: CSSProperties, h: number): CSSProperties => ({
  ...base,
  fontVariantNumeric: "normal",
  lineHeight: `${h}px`,
  height: h,
  whiteSpace: "nowrap",
})
