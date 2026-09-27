import React from "react"
import {useCurrentFrame} from "remotion"
import {App} from "../kit/app/App"
import {estadoS5} from "./TodoAlDia/estado"

// S5 · todo-al-dia (global 450-539). Sale el aviso «Aviso enviado al cliente» y
// el chip de la cabecera pasa de «□ Por revisar» a «■ Todo al día»: su cuadrado
// se llena de cobalto, el fondo pasa a cobalto-50 y el contorno a cobalto. Del f34 al f89, quietud
// absoluta (56 fotogramas idénticos). Entra en APP_FIN_S4 y sale en APP_FINAL.
export const Escena: React.FC = () => <App estado={estadoS5(useCurrentFrame())} />
