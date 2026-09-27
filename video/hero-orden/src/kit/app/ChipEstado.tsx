import React from "react"
import {color, textStyle} from "../../brand/tokens"
import {mix} from "../../lib/anim"
import {useLayout} from "../../layout"
import {TEXTOS} from "../../textos"
import type {AppEstado} from "../estados"
import {linea} from "./estilo"
import {Marca} from "./Marca"

// Chip de la cabecera: «□ Por revisar» → «■ Todo al día». La marca está en una
// columna fija a la izquierda, así el cuadrado no se mueve al cambiar el texto.
// El contorno tiene el color del fondo mientras está pendiente y se vuelve cobalto
// con «Todo al día», para que el remate se note a tamaño real.
export const ChipEstado: React.FC<AppEstado["chip"]> = ({dibujo, relleno, fondo, pendiente, hecho}) => {
  const c = useLayout().cabecera.chip
  const {x, y, w, h} = c.caja
  const textoX = x + c.padX + c.marca + c.gap
  const texto = (col: string) => ({
    ...linea(textStyle(c.size, 600, col), h),
    position: "absolute" as const, left: textoX, top: y,
  })
  return (
    <>
      <div
        style={{
          position: "absolute", left: x, top: y, width: w, height: h, borderRadius: c.radio, boxSizing: "border-box",
          background: mix(color.pastilla, color.cobalt50, fondo),
          border: `${c.borde}px solid ${mix(color.pastilla, color.cobalt, fondo)}`,
        }}
      />
      <Marca x={x + c.padX} y={y + (h - c.marca) / 2} lado={c.marca} trazo={c.trazo} dibujo={dibujo} relleno={relleno} />
      {pendiente > 0 ? <div style={{...texto(color.ink2), opacity: pendiente}}>{TEXTOS.app.chip.pendiente}</div> : null}
      {hecho.opacidad > 0 ? (
        <div style={{...texto(color.cobalt), opacity: hecho.opacidad, transform: hecho.dx ? `translateX(${hecho.dx}px)` : undefined}}>
          {TEXTOS.app.chip.hecho}
        </div>
      ) : null}
    </>
  )
}
