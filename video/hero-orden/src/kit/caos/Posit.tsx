import React from "react"
import {color, handStyle} from "../../brand/tokens"
import {lerp} from "../../lib/anim"
import {useLayout} from "../../layout"
import {TEXTOS} from "../../textos"

export interface PositProps {opacidad: number, caida: number, contenido: number, dy: number}

/** Interpola dos box-shadow de la forma «x y blur rgba(r,g,b,a)» (desplazamiento, desenfoque y alfa). */
const mezclaSombra = (a: string, b: string, t: number) => {
  if (t <= 0) return a
  if (t >= 1) return b
  const na = (a.match(/-?\d*\.?\d+/g) ?? []).map(Number)
  const nb = (b.match(/-?\d*\.?\d+/g) ?? []).map(Number)
  const [x, y, blur, r, g, bl, al] = na.map((v, i) => lerp(v, nb[i], t))
  return `${x}px ${y}px ${blur}px rgba(${r},${g},${bl},${al})`
}

/**
 * Pósit «Avisar al / cliente / ¡hoy!»: fondo pósit con banda superior, sin
 * borde. Cae desde `caida.dy` con giro `caida.giro` hasta su giro de reposo, y
 * su sombra pasa de alzada a posada. `contenido` funde texto y subrayado.
 */
export const Posit: React.FC<PositProps> = ({opacidad, caida, contenido, dy}) => {
  const L = useLayout()
  const P = L.posit
  if (opacidad <= 0) return null
  const {w, h} = P.caja
  const giro = lerp(P.caida.giro, P.giro, caida)
  const desplazamiento = P.caida.dy * (1 - caida)
  const u = P.subrayado
  const abs = {position: "absolute"} as const
  // Subrayado a mano: se hunde un poco en el centro (así no roza el pie de «¡» ni
  // la cola de la «y») y remata hacia arriba a la derecha, como un trazo rápido.
  const ancho = u.x1 - u.x0
  const trazo = `M${u.x0} ${u.y + 1.5}C${u.x0 + ancho * 0.3} ${u.y + 3} ${u.x0 + ancho * 0.7} ${u.y + 2.5} ${u.x1} ${u.y - 1}`
  return (
    <div
      style={{
        ...abs, left: P.caja.x, top: P.caja.y, width: w, height: h, opacity: opacidad,
        transform: `translateY(${dy + desplazamiento}px) rotate(${giro}deg)`, transformOrigin: "50% 50%",
      }}
    >
      <div style={{...abs, inset: 0, background: color.postit, boxShadow: mezclaSombra(L.sombra.piezaAlzada, L.sombra.pieza, caida)}} />
      <div style={{...abs, left: 0, top: 0, width: w, height: P.banda, background: color.postit2}} />
      {contenido > 0 && (
        <div style={{...abs, inset: 0, opacity: contenido}}>
          {P.lineas.map((l, i) => (
            <div
              key={i}
              style={{
                ...abs, left: l.x, top: l.y, height: l.h, ...handStyle(P.size, i === 2 ? 600 : 450),
                lineHeight: `${l.h}px`, whiteSpace: "nowrap",
              }}
            >
              {TEXTOS.posit[i]}
            </div>
          ))}
          <svg width={w} height={h} style={{...abs, left: 0, top: 0, overflow: "visible"}}>
            <path d={trazo} fill="none" stroke={color.ink} strokeWidth={u.trazo} strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  )
}
