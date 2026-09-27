import React from "react"
import {color} from "../../brand/tokens"
import {clamp01} from "../../lib/anim"

// Cuadrado de estado del glifo: □ tinta trazado por dentro de su caja y ■ cobalto
// del mismo lado que crece desde el centro. (x, y) = esquina de la caja en px del
// contenedor.
export interface MarcaProps {
  x: number, y: number
  lado: number, trazo: number
  dibujo: number                  // trazo del □, 0 a 1
  relleno: number                 // ■ desde el centro, 0 a 1
}

export const Marca: React.FC<MarcaProps> = ({x, y, lado, trazo, dibujo, relleno}) => {
  const d = clamp01(dibujo)
  const r = clamp01(relleno)
  if (d <= 0 && r <= 0) return null
  const m = trazo / 2
  // Se traza desde la esquina superior izquierda en el sentido de las agujas del
  // reloj. Completo (dibujo 1) se pinta sin guiones, con las cuatro esquinas unidas.
  const ruta = `M${m} ${m}H${lado - m}V${lado - m}H${m}Z`
  return (
    <div style={{position: "absolute", left: x, top: y, width: lado, height: lado}}>
      {d > 0 && r < 1 ? (
        <svg width={lado} height={lado} style={{position: "absolute", left: 0, top: 0, display: "block"}}>
          <path
            d={ruta}
            fill="none"
            stroke={color.ink}
            strokeWidth={trazo}
            strokeLinejoin="miter"
            {...(d < 1 ? {pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - d} : {})}
          />
        </svg>
      ) : null}
      {r > 0 ? (
        <div
          style={{
            position: "absolute", left: 0, top: 0, width: lado, height: lado,
            background: color.cobalt,
            transform: r < 1 ? `scale(${r})` : undefined,
          }}
        />
      ) : null}
    </div>
  )
}
