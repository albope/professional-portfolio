import React from "react"
import {useCurrentFrame} from "remotion"
import {App} from "../kit/app/App"
import {Caos} from "../kit/caos/Caos"
import {estadoS3} from "./TodoEnUnaApp/estado"

// S3 · todo-en-una-app (global 190-319). Sale el rótulo, el texto de las piezas
// se funde y quedan sus siluetas. Por debajo entra la ventana solo con su cromo
// (sus textos y el chip llegan en 60-72, cuando las siluetas ya no los tapan) y cada
// silueta vuela a la baldosa de su fila, que se revela con título, origen y
// estado. Entra en CAOS_FIN_S2 + APP_OCULTA y sale en APP_FIN_S3, sin cursor.
// La aplicación va SIEMPRE debajo del caos.
export const Escena: React.FC = () => {
  const {caos, app} = estadoS3(useCurrentFrame())
  return (
    <>
      <App estado={app} />
      <Caos estado={caos} />
    </>
  )
}
