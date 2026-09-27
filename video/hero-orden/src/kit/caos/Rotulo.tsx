import React from "react"
import {color, monoStyle} from "../../brand/tokens"
import {useLayout} from "../../layout"
import {TEXTOS} from "../../textos"

export interface RotuloProps {opacidad: number, dy: number}

/** Píldora «Lunes, 9:00»: fondo pastilla, borde de filete-2 y texto mono en tinta-2. */
export const Rotulo: React.FC<RotuloProps> = ({opacidad, dy}) => {
  const L = useLayout()
  const {caja, padX, size} = L.rotulo
  if (opacidad <= 0) return null
  return (
    <div
      style={{
        position: "absolute", left: caja.x, top: caja.y, width: caja.w, height: caja.h,
        opacity: opacidad, transform: `translateY(${dy}px)`,
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0, boxSizing: "border-box", background: color.pastilla,
          border: `${L.filete}px solid ${color.line2}`, borderRadius: caja.h / 2,
        }}
      />
      <div
        style={{
          position: "absolute", left: padX, top: 0, height: caja.h,
          ...monoStyle(size, color.ink2), lineHeight: `${caja.h}px`, whiteSpace: "nowrap",
        }}
      >
        {TEXTOS.rotulo}
      </div>
    </div>
  )
}
