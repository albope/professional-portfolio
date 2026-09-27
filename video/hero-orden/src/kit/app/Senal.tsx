import React from "react"
import {color} from "../../brand/tokens"
import {useScene} from "../../lib/scene"
import {useLayout} from "../../layout"
import {cajaFila} from "./Fila"

// Trazo de señal: baja por el canal derecho, entre el final de las filas y el
// borde de la ventana, desde la mitad de la reserva hasta la mitad del aviso. Va
// junto al clic, «Confirmada» y «Enviado», así el ojo no salta de lado.
// `cabeza` lo traza y `cola` lo borra desde arriba.
export const Senal: React.FC<{cabeza: number, cola: number}> = ({cabeza, cola}) => {
  const L = useLayout()
  const {corte} = useScene()
  if (cabeza - cola <= 0) return null
  const r = cajaFila(L, corte, "reserva")
  const a = cajaFila(L, corte, "aviso")
  const x0 = L.filas.x + L.filas.w
  const ruta = `M${x0} ${r.y + r.h / 2}H${L.senal.x}V${a.y + a.h / 2}H${x0}`
  return (
    <svg width={L.W} height={L.H} style={{position: "absolute", left: 0, top: 0, display: "block"}}>
      <path
        d={ruta}
        fill="none"
        stroke={color.cobalt}
        strokeWidth={L.senal.trazo}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        pathLength={1}
        strokeDasharray={`${cabeza - cola} 1`}
        strokeDashoffset={-cola}
      />
    </svg>
  )
}
