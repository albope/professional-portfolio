import React from "react"
import {color} from "../../brand/tokens"
import {clamp01} from "../../lib/anim"
import {useLayout} from "../../layout"
import {Marca} from "./Marca"

// Glifo de la marca en la barra de título: barra, □ y ■, centrados en `cy`.
// barra: escalaX desde la izquierda · hueco: el □ se traza · macizo: el ■ crece.
export interface GlifoProps {barra: number, hueco: number, macizo: number}

export const Glifo: React.FC<GlifoProps> = ({barra, hueco, macizo}) => {
  const g = useLayout().glifo
  const b = clamp01(barra)
  const xHueco = g.x + g.barra.w + g.gap
  const xMacizo = xHueco + g.lado + g.gap
  const y = g.cy - g.lado / 2
  return (
    <>
      {b > 0 ? (
        <div
          style={{
            position: "absolute", left: g.x, top: g.cy - g.barra.h / 2, width: g.barra.w, height: g.barra.h,
            background: color.ink,
            transform: b < 1 ? `scaleX(${b})` : undefined, transformOrigin: "0 50%",
          }}
        />
      ) : null}
      <Marca x={xHueco} y={y} lado={g.lado} trazo={g.trazo} dibujo={hueco} relleno={0} />
      <Marca x={xMacizo} y={y} lado={g.lado} trazo={g.trazo} dibujo={0} relleno={macizo} />
    </>
  )
}
