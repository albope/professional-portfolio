import React from "react"
import {color, handStyle} from "../../brand/tokens"
import {useLayout} from "../../layout"
import {TEXTOS} from "../../textos"

export interface NotaPapelProps {contenido: number, dy: number}

// Garabato: onda de 4 crestas de la ilustración de la web (68 unidades de ancho),
// escalada de forma uniforme al ancho de cada garabato.
const GARABATO = "M0 0c6-5 11 4 17 0s11-5 17 0 11 4 17 0 11-5 17 0"
const GARABATO_W = 68
const GARABATO_TRAZO = 3

/** Contorno del papel con el borde superior dentado, metido medio trazo para no salirse de la caja. */
const contornoDentado = (w: number, h: number, dw: number, dh: number, trazo: number) => {
  const m = trazo / 2
  const pts: string[] = [`M${m} ${dh}`]
  for (let x = 0; x < w; x += dw) {
    pts.push(`L${Math.min(x + dw / 2, w - m)} ${m}`)
    pts.push(`L${Math.min(x + dw, w - m)} ${dh}`)
  }
  pts.push(`L${w - m} ${h - m}`, `L${m} ${h - m}`, "Z")
  return pts.join("")
}

/**
 * Nota de papel (solo escritorio): borde superior dentado, renglones, dos
 * líneas manuscritas y dos garabatos. `contenido` funde textos y garabatos.
 */
export const NotaPapel: React.FC<NotaPapelProps> = ({contenido, dy}) => {
  const L = useLayout()
  const N = L.nota
  if (!N) return null
  const {w, h} = N.caja
  const f = L.filete
  const abs = {position: "absolute"} as const
  return (
    <div
      style={{
        ...abs, left: N.caja.x, top: N.caja.y, width: w, height: h,
        transform: `translateY(${dy}px) rotate(${N.giro}deg)`, transformOrigin: "50% 50%",
      }}
    >
      <svg width={w} height={h} style={{...abs, left: 0, top: 0, overflow: "visible", filter: `drop-shadow(${L.sombra.pieza})`}}>
        <path
          d={contornoDentado(w, h, N.diente.w, N.diente.h, f)}
          fill={color.papel}
          stroke={color.line2}
          strokeWidth={f}
          strokeLinejoin="round"
        />
      </svg>
      {N.renglones.map((y, i) => (
        <div
          key={i}
          style={{...abs, left: N.renglonX[0], top: y - f / 2, width: N.renglonX[1] - N.renglonX[0], height: f, background: color.renglon}}
        />
      ))}
      {contenido > 0 && (
        <div style={{...abs, inset: 0, opacity: contenido}}>
          {N.lineas.map((l, i) => (
            <div
              key={i}
              style={{...abs, left: l.x, top: l.y, height: l.h, ...handStyle(N.size, 450), lineHeight: `${l.h}px`, whiteSpace: "nowrap"}}
            >
              {TEXTOS.nota[i]}
            </div>
          ))}
          <svg width={w} height={h} style={{...abs, left: 0, top: 0, overflow: "visible"}}>
            {N.garabatos.map((g, i) => {
              const k = g.w / GARABATO_W
              return (
                <path
                  key={i}
                  d={GARABATO}
                  transform={`translate(${g.x} ${g.y}) scale(${k})`}
                  fill="none"
                  stroke={color.ink2}
                  strokeWidth={GARABATO_TRAZO / k}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            })}
          </svg>
        </div>
      )}
    </div>
  )
}
