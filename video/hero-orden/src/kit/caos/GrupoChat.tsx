import React, {type CSSProperties} from "react"
import {color} from "../../brand/tokens"
import {useLayout} from "../../layout"
import {TEXTOS} from "../../textos"
import {T} from "../../timeline"
import type {CaosEstado} from "../estados"
import {Burbuja} from "./Burbuja"

export interface GrupoChatProps {estado: CaosEstado, dy: number}

// Puntos de «escribiendo»: periodo de 18 f y 4 f de desfase entre puntos (plan, S2 80-96).
const PERIODO_PUNTOS = 18
const DESFASE_PUNTOS = 4

/** Entrada de una burbuja nueva: +12 → 0 y escala 0,96 → 1 desde abajo a la izquierda. */
const entrada = (opacidad: number, v: number): CSSProperties => ({
  opacity: opacidad,
  transform: `translateY(${12 * (1 - v)}px) scale(${0.96 + 0.04 * v})`,
  transformOrigin: "0% 100%",
})

/**
 * El chat del cliente: pregunta, respuesta, «escribiendo» y el mensaje nuevo,
 * con el resalte de copia detrás de la segunda línea de la pregunta. Gira
 * alrededor del centro de su caja y respira en vertical.
 */
export const GrupoChat: React.FC<GrupoChatProps> = ({estado, dy}) => {
  const L = useLayout()
  const C = L.chat
  const {contenido, seleccionChat: sc, escribiendo: e, nuevo: n} = estado
  const sel = C.seleccion
  const E = C.escribiendo
  const hPregunta = C.pregunta.hora
  const hNuevo = C.nuevo.hora

  const resalte =
    sc.progreso > 0 && sc.opacidad > 0 && contenido > 0 ? (
      <div
        style={{
          position: "absolute", left: sel.x0, top: sel.y, width: (sel.x1 - sel.x0) * sc.progreso, height: sel.h,
          borderRadius: sel.radio, background: color.cobalt100, opacity: sc.opacidad * contenido,
        }}
      />
    ) : null

  const puntos =
    contenido > 0
      ? E.centrosX.map((cx, i) => {
          const t = (e.fase - T.copiarAMano.puntos[0] - DESFASE_PUNTOS * i) / PERIODO_PUNTOS
          const o = 0.3 + 0.7 * (0.5 - 0.5 * Math.cos(2 * Math.PI * t))
          return (
            <div
              key={i}
              style={{
                position: "absolute", left: cx - E.punto / 2, top: E.centroY - E.punto / 2,
                width: E.punto, height: E.punto, borderRadius: E.punto / 2,
                background: color.ink3, opacity: o * contenido,
              }}
            />
          )
        })
      : null

  return (
    <div
      style={{
        position: "absolute", left: C.caja.x, top: C.caja.y, width: C.caja.w, height: C.caja.h,
        transform: `translateY(${dy}px) rotate(${C.giro}deg)`, transformOrigin: "50% 50%",
      }}
    >
      <Burbuja
        tipo="entrante"
        caja={C.pregunta.caja}
        lineas={TEXTOS.chat.pregunta}
        lineasY={C.pregunta.lineasY}
        hora={hPregunta && {texto: TEXTOS.chat.horaPregunta, ...hPregunta}}
        contenido={contenido}
        fondo={resalte}
      />
      <Burbuja
        tipo="saliente"
        caja={C.respuesta.caja}
        lineas={[TEXTOS.chat.respuesta]}
        lineasY={[C.respuesta.textoY]}
        checks={C.respuesta.checks}
        contenido={contenido}
      />
      {e.opacidad > 0 && (
        <Burbuja
          tipo="entrante"
          caja={E.caja}
          lineas={[]}
          lineasY={[]}
          contenido={contenido}
          style={entrada(e.opacidad, e.entrada)}
        >
          {puntos}
        </Burbuja>
      )}
      {n.opacidad > 0 && (
        <Burbuja
          tipo="entrante"
          caja={C.nuevo.caja}
          lineas={[TEXTOS.chat.nuevo]}
          lineasY={[C.nuevo.textoY]}
          hora={hNuevo && {texto: TEXTOS.chat.horaNuevo, ...hNuevo}}
          contenido={contenido}
          style={entrada(n.opacidad, n.entrada)}
        />
      )}
    </div>
  )
}
