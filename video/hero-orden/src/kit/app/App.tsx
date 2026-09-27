import React from "react"
import {useScene} from "../../lib/scene"
import {useLayout} from "../../layout"
import {FILAS} from "../../textos"
import type {AppEstado} from "../estados"
import {ChipEstado} from "./ChipEstado"
import {Fila} from "./Fila"
import {Onda} from "./Onda"
import {Senal} from "./Senal"
import {Toast} from "./Toast"
import {Ventana} from "./Ventana"

// La aplicación entera a partir de su estado (plan §5.4). Va SIEMPRE debajo del caos.
export interface AppProps {estado: AppEstado}

export const App: React.FC<AppProps> = ({estado}) => {
  const {corte} = useScene()
  const L = useLayout()
  const {opacidad, entrada, textos} = estado.ventana
  if (opacidad <= 0) return null
  return (
    <Ventana opacidad={opacidad} entrada={entrada} textos={textos} glifo={estado.glifo}>
      {/* El chip llega con los textos de la ventana, cuando las siluetas ya han dejado libre la cabecera. */}
      {textos > 0 ? (
        <div style={{position: "absolute", left: 0, top: 0, width: L.W, height: L.H, opacity: textos}}>
          <ChipEstado {...estado.chip} />
        </div>
      ) : null}
      {FILAS[corte].map((id) => (
        <Fila key={id} id={id} estado={estado.filas[id]} />
      ))}
      <Senal {...estado.senal} />
      <Onda progreso={estado.onda} />
      <Toast {...estado.toast} />
    </Ventana>
  )
}
