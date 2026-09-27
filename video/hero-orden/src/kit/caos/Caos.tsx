import React, {type ReactNode} from "react"
import {useScene} from "../../lib/scene"
import {useLayout, type Caja} from "../../layout"
import type {FilaId} from "../../textos"
import type {CaosEstado} from "../estados"
import {baldosa, centroCaja, vuelo} from "../geom"
import {GrupoChat} from "./GrupoChat"
import {Hoja} from "./Hoja"
import {NotaPapel} from "./NotaPapel"
import {Posit} from "./Posit"
import {Rotulo} from "./Rotulo"

export interface CaosProps {estado: CaosEstado}

/**
 * Vuelo de una pieza a la baldosa de su fila (S3). Cada pieza se dibuja en su
 * sitio con su giro; este envoltorio la lleva de su centro al de la baldosa,
 * la escala y deshace el giro: translate · rotate(giroVuelo − giro) · scale con
 * origen en el centro de la caja equivale a colocar la pieza con el centro, el
 * giro y la escala de `vuelo()`. Con p = 0 no envuelve nada.
 * En vuelo la pieza va por encima de las que siguen en reposo (`z`), así la
 * silueta viaja limpia. Entre dos piezas en vuelo queda encima la que salió
 * antes: chat 4, hoja 3, nota 2 y pósit 1.
 */
const Vuelo: React.FC<{p: number, z: number, caja: Caja, giro: number, destino: () => Caja, children: ReactNode}> = ({p, z, caja, giro, destino, children}) => {
  const {width, height} = useScene()
  if (p <= 0) return <>{children}</>
  const v = vuelo(p, {caja, giro}, destino())
  if (v.opacidad <= 0) return null
  const c = centroCaja(caja)
  return (
    <div
      style={{
        position: "absolute", left: 0, top: 0, width, height, opacity: v.opacidad, zIndex: z,
        transformOrigin: `${c.x}px ${c.y}px`,
        transform: `translate(${v.cx - c.x}px, ${v.cy - c.y}px) rotate(${v.giro - giro}deg) scale(${v.escala})`,
      }}
    >
      {children}
    </div>
  )
}

/** El caos de la mesa. Apilado en reposo, de abajo arriba: rótulo, chat, hoja, nota y pósit. */
export const Caos: React.FC<CaosProps> = ({estado}) => {
  const L = useLayout()
  const {corte} = useScene()
  const {vuelo: p, respira: r, contenido} = estado
  const destino = (id: FilaId) => () => baldosa(L, corte, id)
  return (
    <>
      <Rotulo opacidad={estado.rotulo.opacidad} dy={estado.rotulo.dy} />
      <Vuelo p={p.chat} z={4} caja={L.chat.caja} giro={L.chat.giro} destino={destino("reserva")}>
        <GrupoChat estado={estado} dy={r.chat} />
      </Vuelo>
      <Vuelo p={p.hoja} z={3} caja={L.hoja.caja} giro={L.hoja.giro} destino={destino("cobros")}>
        <Hoja estado={estado} dy={r.hoja} />
      </Vuelo>
      {L.nota && (
        <Vuelo p={p.nota} z={2} caja={L.nota.caja} giro={L.nota.giro} destino={destino("pedido")}>
          <NotaPapel contenido={contenido} dy={r.nota} />
        </Vuelo>
      )}
      <Vuelo p={p.posit} z={1} caja={L.posit.caja} giro={L.posit.giro} destino={destino("aviso")}>
        <Posit opacidad={estado.posit.opacidad} caida={estado.posit.caida} contenido={contenido} dy={r.posit} />
      </Vuelo>
    </>
  )
}
