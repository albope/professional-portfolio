import React from "react"
import {color, textStyle} from "../../brand/tokens"
import {lerp} from "../../lib/anim"
import {useScene} from "../../lib/scene"
import {useLayout, type Caja} from "../../layout"
import {TEXTOS} from "../../textos"
import type {CaosEstado} from "../estados"

export interface HojaProps {estado: CaosEstado, dy: number}

/**
 * Hoja de cálculo «Cobros»: banda y columna pastilla sin letras ni números,
 * rejilla, cabeceras, valores, barras grises, pestañas, marco de selección
 * (de la celda «¿?» a la celda destino con `seleccionHoja`), texto tecleado y
 * caret. `contenido` funde textos, barras y selección, no la forma.
 * Cifras proporcionales, como en las medidas del plan: con las tabulares
 * «jueves 19» mide 160 px en móvil y el caret casi toca el marco.
 */
export const Hoja: React.FC<HojaProps> = ({estado, dy}) => {
  const L = useLayout()
  const {corte} = useScene()
  const H = L.hoja
  const {w, h} = H.caja
  const f = L.filete
  const g = H.rejilla
  const c = estado.contenido
  const cols = H.columnas
  const filas = H.filas
  const ultima = filas[filas.length - 1]
  const finFilas = ultima.y + ultima.h

  const celda = (col: number, fila: number): Caja => ({x: cols[col].x, y: filas[fila].y, w: cols[col].w, h: filas[fila].h})
  const texto = (col: number, fila: number, t: string, peso: number) => (
    <div
      key={`${col}-${fila}`}
      style={{
        position: "absolute", left: cols[col].x + H.padX, top: filas[fila].y, height: filas[fila].h,
        ...textStyle(H.size, peso, color.ink), fontVariantNumeric: "normal", lineHeight: `${filas[fila].h}px`, whiteSpace: "nowrap",
      }}
    >
      {t}
    </div>
  )

  // Marco de selección: interpola la caja de la celda inicio a la destino.
  const a = celda(H.seleccion.inicio.col, H.seleccion.inicio.fila)
  const b = celda(H.seleccion.destino.col, H.seleccion.destino.fila)
  const s = estado.seleccionHoja
  const sel = {x: lerp(a.x, b.x, s), y: lerp(a.y, b.y, s), w: lerp(a.w, b.w, s), h: lerp(a.h, b.h, s)}
  const {trazo, tirador} = H.seleccion

  // Pestañas contiguas desde x0.
  const P = H.pestanas
  const nombres: readonly string[] = TEXTOS.hoja.pestanas[corte]
  const anchos: readonly number[] = P.anchos
  const xs = anchos.map((_, i) => P.x0 + anchos.slice(0, i).reduce((acc, v) => acc + v, 0))

  const {tecleo} = estado
  const tecleado = TEXTOS.hoja.tecleo.slice(0, Math.round(tecleo.caracteres))

  const abs = {position: "absolute"} as const

  return (
    <div
      style={{
        position: "absolute", left: H.caja.x, top: H.caja.y, width: w, height: h,
        transform: `translateY(${dy}px) rotate(${H.giro}deg)`, transformOrigin: "50% 50%",
      }}
    >
      {/* Papel de la hoja con su sombra */}
      <div style={{...abs, inset: 0, background: color.surface, boxShadow: L.sombra.pieza}} />

      {/* Banda superior y columna izquierda, sin letras ni números */}
      <div style={{...abs, left: 0, top: 0, width: w, height: H.banda, background: color.pastilla}} />
      <div style={{...abs, left: 0, top: H.banda, width: H.numeros, height: finFilas - H.banda, background: color.pastilla}} />

      {/* Rejilla */}
      {cols.map((col, i) => (
        <div key={`v${i}`} style={{...abs, left: col.x - g / 2, top: 0, width: g, height: finFilas, background: color.celda}} />
      ))}
      {filas.map((fila, i) => (
        <div key={`h${i}`} style={{...abs, left: 0, top: fila.y - g / 2, width: w, height: g, background: color.celda}} />
      ))}

      {/* Pestañas: franja pastilla con filete arriba, «Cobros» activa en blanco */}
      <div style={{...abs, left: 0, top: P.y, width: w, height: P.h, background: color.pastilla}} />
      <div style={{...abs, left: 0, top: P.y - f / 2, width: w, height: f, background: color.line2}} />
      <div
        style={{
          ...abs, left: xs[0], top: P.y - f / 2, width: anchos[0], height: P.h + f / 2, boxSizing: "border-box",
          background: color.surface, borderLeft: `${f}px solid ${color.line2}`, borderRight: `${f}px solid ${color.line2}`,
        }}
      />
      {xs.slice(2).map((x, i) => (
        <div key={`s${i}`} style={{...abs, left: x - f / 2, top: P.y + (P.h - P.size) / 2, width: f, height: P.size, background: color.line2}} />
      ))}

      {c > 0 && (
        <div style={{...abs, inset: 0, opacity: c}}>
          {/* Cabeceras y valores */}
          {TEXTOS.hoja.cabeceras.map((t, i) => texto(i, 0, t, 600))}
          {H.barras.map((ancho, i) => {
            const fila = filas[i + 1]
            return (
              <div
                key={`b${i}`}
                style={{
                  ...abs, left: cols[0].x + H.padX, top: fila.y + (fila.h - H.barraH) / 2, width: ancho, height: H.barraH,
                  borderRadius: H.barraH / 2, background: color.barra,
                }}
              />
            )
          })}
          {TEXTOS.hoja.dia.map((t, i) => texto(1, i + 1, t, 400))}
          {TEXTOS.hoja.pagado.map((t, i) => texto(2, i + 1, t, t === "¿?" ? 600 : 400))}

          {/* Texto de las pestañas */}
          {nombres.map((t, i) => (
            <div
              key={`p${i}`}
              style={{
                ...abs, left: xs[i], top: P.y, width: anchos[i], height: P.h, textAlign: "center",
                ...textStyle(P.size, i === 0 ? 600 : 500, i === 0 ? color.ink : color.ink2), fontVariantNumeric: "normal",
                lineHeight: `${P.h}px`, whiteSpace: "nowrap",
              }}
            >
              {t}
            </div>
          ))}

          {/* Texto tecleado con el caret en línea */}
          {(tecleado.length > 0 || tecleo.caret > 0) && (
            <div
              style={{
                ...abs, left: b.x + H.padX, top: b.y, height: b.h, display: "flex", alignItems: "center", whiteSpace: "nowrap",
              }}
            >
              <span style={{...textStyle(H.size, 400, color.ink), fontVariantNumeric: "normal", lineHeight: `${b.h}px`, whiteSpace: "pre"}}>{tecleado}</span>
              <div style={{width: H.caret.w, height: H.caret.h, marginLeft: 1, background: color.ink, opacity: tecleo.caret}} />
            </div>
          )}
        </div>
      )}

      {/* Borde de la hoja */}
      <div style={{...abs, inset: 0, boxSizing: "border-box", border: `${f}px solid ${color.line2}`}} />

      {/* Marco de selección con su tirador */}
      {c > 0 && (
        <div style={{...abs, inset: 0, opacity: c}}>
          <div
            style={{
              ...abs, left: sel.x, top: sel.y, width: sel.w, height: sel.h, boxSizing: "border-box",
              border: `${trazo}px solid ${color.cobalt}`,
            }}
          />
          <div
            style={{
              ...abs, left: sel.x + sel.w - tirador / 2, top: sel.y + sel.h - tirador / 2, width: tirador, height: tirador,
              background: color.cobalt,
            }}
          />
        </div>
      )}
    </div>
  )
}
