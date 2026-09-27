import React from "react"
import {color} from "../../brand/tokens"
import {useScene} from "../../lib/scene"
import {useLayout} from "../../layout"
import {cajaFila} from "./Fila"

// Onda cuadrada del clic en «Confirmar»: el contorno del botón se infla hasta
// `filas.onda` y se apaga. El anillo va POR FUERA del borde del botón, así nunca
// lo tapa.
export const Onda: React.FC<{progreso: number}> = ({progreso}) => {
  const L = useLayout()
  const {corte} = useScene()
  if (progreso <= 0 || progreso >= 1) return null
  const {boton, onda} = L.filas
  const top = cajaFila(L, corte, "reserva").y
  const e = onda * progreso + boton.borde
  return (
    <div
      style={{
        position: "absolute", left: boton.x - e, top: top + boton.dy - e,
        width: boton.w + 2 * e, height: boton.h + 2 * e, boxSizing: "border-box",
        borderRadius: boton.radio + e, border: `${boton.borde}px solid ${color.cobalt}`,
        opacity: 0.6 * (1 - progreso),
      }}
    />
  )
}
