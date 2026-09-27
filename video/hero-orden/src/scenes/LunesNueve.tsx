import React from "react"
import {useCurrentFrame} from "remotion"
import {Caos} from "../kit/caos/Caos"
import {CAOS_POSTER, type CaosEstado} from "../kit/estados"
import {respira} from "../kit/geom"
import {useLayout} from "../layout"
import {ease, tween} from "../lib/anim"
import {useScene} from "../lib/scene"
import {RESPIRA, T} from "../timeline"

type Respiracion = {k: number, signo: number} | null

/**
 * S1 · lunes-nueve (global 0-59). El póster cobra vida: chat, hoja y nota
 * respiran y a los 0,33 s cae el pósit «Avisar al cliente ¡hoy!» en el hueco
 * libre. f0 = CAOS_POSTER y f59 = CAOS_FIN_S1 (pósit posado, respiración 0).
 */
export const Escena: React.FC = () => {
  const frame = useCurrentFrame()
  const {durationInFrames} = useScene()
  const L = useLayout()
  const t = T.lunesNueve
  const R = RESPIRA.lunesNueve

  const r = (c: Respiracion) => (c ? respira(frame, durationInFrames, c.k, c.signo, L.respiracion) : 0)

  const estado: CaosEstado = {
    ...CAOS_POSTER,
    respira: {chat: r(R.chat), hoja: r(R.hoja), nota: L.nota ? r(R.nota) : 0, posit: r(R.posit)},
    posit: {
      opacidad: tween(frame, t.positOpacidad, [0, 1], ease.out),
      caida: tween(frame, t.positCaida, [0, 1], ease.out),
    },
  }

  return <Caos estado={estado} />
}
