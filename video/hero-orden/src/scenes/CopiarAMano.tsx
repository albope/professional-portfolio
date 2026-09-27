import React from "react"
import {useCurrentFrame} from "remotion"
import {Caos} from "../kit/caos/Caos"
import {Cursor} from "../kit/Cursor"
import {useLayout} from "../layout"
import {useScene} from "../lib/scene"
import {estadoS2} from "./CopiarAMano/estado"

// S2 · copiar-a-mano (global 60-189). El cursor selecciona «el jueves a las 19»
// en el chat, hace clic en la celda vacía de «Día» y teclea «jueves 19». Después
// el cliente escribe e insiste: «¿Al final hay hueco?». Chat y hoja quietos,
// nota y pósit respiran. Entra en CAOS_FIN_S1 y sale en CAOS_FIN_S2.
export const Escena: React.FC = () => {
  const f = useCurrentFrame()
  const {durationInFrames} = useScene()
  const L = useLayout()
  const {caos, cursor} = estadoS2(f, durationInFrames, L)
  return (
    <>
      <Caos estado={caos} />
      <Cursor {...cursor} />
    </>
  )
}
