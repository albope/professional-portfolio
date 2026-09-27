import React from "react"
import {color} from "../brand/tokens"
import {useLayout} from "../layout"

// (x, y) = punta de la flecha en px de lienzo. `escala` = pulsación (pressScale),
// se multiplica por LAYOUT.cursor.escala dentro del componente.
export interface CursorProps {x: number, y: number, opacidad: number, escala: number}

// Flecha genérica en una caja de 40×56 con la punta en (3, 3).
const FLECHA = "M3 3L3 45L13.5 35.5L20.5 52L28 48.8L21 32.5L35 32.5Z"
const W = 40
const H = 56
const PUNTA = 3

/**
 * Cursor: flecha tinta con contorno blanco y sombra corta. Se escala con
 * origen en la punta (la caja se dibuja ya al tamaño final para que el
 * vector salga nítido). Va siempre encima de todo.
 */
export const Cursor: React.FC<CursorProps> = ({x, y, opacidad, escala}) => {
  const L = useLayout()
  if (opacidad <= 0) return null
  const s = L.cursor.escala * escala
  return (
    <svg
      width={W * s}
      height={H * s}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: "absolute", left: x - PUNTA * s, top: y - PUNTA * s, overflow: "visible",
        opacity: opacidad, filter: L.sombra.cursor, zIndex: 10,
      }}
    >
      <path d={FLECHA} fill={color.ink} stroke={color.surface} strokeWidth={3} strokeLinejoin="round" style={{paintOrder: "stroke"}} />
    </svg>
  )
}
