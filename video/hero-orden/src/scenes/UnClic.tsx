import React from "react"
import {useCurrentFrame} from "remotion"
import {App} from "../kit/app/App"
import {Cursor} from "../kit/Cursor"
import {useLayout} from "../layout"
import {estadoS4} from "./UnClic/estado"

// S4 · un-clic (global 320-449). El cursor entra y pulsa «Confirmar» en la
// reserva, que pasa a ■ «Confirmada» y se tiñe. El cursor se retira. Una señal
// cobalto baja por el canal derecho hasta «Aviso al cliente», que se llena
// solo: □ «Pendiente» → ■ «Enviado». Aparece «Aviso enviado al cliente» y los
// tintes vuelven a blanco. Entra en APP_FIN_S3 (sin caos: todas las piezas ya
// volaron) y sale en APP_FIN_S4.
export const Escena: React.FC = () => {
  const L = useLayout()
  const {app, cursor} = estadoS4(useCurrentFrame(), L.cursor)
  return (
    <>
      <App estado={app} />
      <Cursor {...cursor} />
    </>
  )
}
