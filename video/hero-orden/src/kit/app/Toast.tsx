import React from "react"
import {color, textStyle} from "../../brand/tokens"
import {useLayout} from "../../layout"
import {TEXTOS} from "../../textos"
import {linea} from "./estilo"

// Aviso «Aviso enviado al cliente», dentro de la ventana bajo la última fila.
// El ■ y el texto van centrados como grupo en la píldora: con el texto real el
// hueco queda igual a los dos lados (a `padX` fijo, en móvil sobraban 18 px a la derecha).
export const Toast: React.FC<{opacidad: number, dy: number}> = ({opacidad, dy}) => {
  const t = useLayout().toast
  if (opacidad <= 0) return null
  const {x, y, w, h} = t.caja
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box",
        borderRadius: t.radio, border: `${t.borde}px solid ${color.cobalt100}`, background: color.cobalt50,
        display: "flex", alignItems: "center", justifyContent: "center", gap: t.gap,
        opacity: opacidad, transform: dy ? `translateY(${dy}px)` : undefined,
      }}
    >
      <div style={{width: t.marca, height: t.marca, flex: "none", background: color.cobalt}} />
      <div style={linea(textStyle(t.size, 600, color.cobalt600), h - 2 * t.borde)}>{TEXTOS.app.toast}</div>
    </div>
  )
}
