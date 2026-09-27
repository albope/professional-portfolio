import React from "react"
import {color, textStyle} from "../../brand/tokens"
import {clamp01, mix} from "../../lib/anim"
import {useScene} from "../../lib/scene"
import {useLayout, type Caja, type Corte, type Layout} from "../../layout"
import {FILAS, TEXTOS, type FilaId} from "../../textos"
import type {FilaEstado} from "../estados"
import {linea} from "./estilo"
import {IconoOrigen} from "./IconoOrigen"
import {Marca} from "./Marca"

/** Caja de la fila `id` en el corte (x, top, ancho y alto de LAYOUT.filas). */
export const cajaFila = (L: Layout, corte: Corte, id: FilaId): Caja => {
  const i = (FILAS[corte] as readonly FilaId[]).indexOf(id)
  if (i < 0) throw new Error(`La fila «${id}» no existe en el corte ${corte}`)
  return {x: L.filas.x, y: L.filas.tops[i], w: L.filas.w, h: L.filas.h}
}

/** Guion del hueco punteado repartido para que cierre sin un tramo cojo. */
const guionExacto = (w: number, h: number, r: number, guion: number) => {
  const perimetro = 2 * (w + h) - 8 * r + 2 * Math.PI * r
  const n = Math.max(1, Math.round(perimetro / (2 * guion)))
  return perimetro / (2 * n)
}

const fondoBoton = (f: number) =>
  f <= 1 ? mix(color.surface, color.cobalt50, f) : mix(color.cobalt50, color.cobalt100, f - 1)

export const Fila: React.FC<{id: FilaId, estado: FilaEstado}> = ({id, estado}) => {
  const L = useLayout()
  const {corte} = useScene()
  const F = L.filas
  const {x, y: top, w, h} = cajaFila(L, corte, id)
  const datos = TEXTOS.filas[id]
  const titulo = typeof datos.titulo === "string" ? datos.titulo : datos.titulo[corte]
  const {baldosa, superficie, texto, dibujo, relleno, inicial, final, boton, tinte} = estado

  const hueco = 1 - clamp01(superficie)
  const b = F.borde
  const guion = guionExacto(w - b, h - b, F.radio - b / 2, F.guion[0])

  const estadoX = F.estado.x + F.estado.marca + F.estado.gap
  const textoEstado = (valor: string, e: {opacidad: number, dx: number}) =>
    e.opacidad > 0 ? (
      <div
        style={{
          ...linea(textStyle(F.estado.size, 500, color.ink2), F.estado.h),
          position: "absolute", left: estadoX, top: top + F.estado.dy,
          opacity: e.opacidad, transform: e.dx ? `translateX(${e.dx}px)` : undefined,
        }}
      >
        {valor}
      </div>
    ) : null

  const t = clamp01(texto)
  return (
    <>
      {hueco > 0 ? (
        <svg width={w} height={h} style={{position: "absolute", left: x, top, display: "block", opacity: hueco}}>
          <rect
            x={b / 2} y={b / 2} width={w - b} height={h - b} rx={F.radio - b / 2}
            fill="none" stroke={color.line2} strokeWidth={b} strokeDasharray={`${guion} ${guion}`}
          />
        </svg>
      ) : null}
      {superficie > 0 ? (
        <div
          style={{
            position: "absolute", left: x, top, width: w, height: h, boxSizing: "border-box",
            borderRadius: F.radio, border: `${b}px solid ${mix(color.line, color.cobalt100, tinte)}`,
            background: mix(color.surface, color.cobalt50, tinte), opacity: superficie,
          }}
        />
      ) : null}
      {baldosa > 0 ? (
        <div style={{position: "absolute", left: x + F.baldosa.dx, top: top + F.baldosa.dy, opacity: baldosa}}>
          <IconoOrigen tipo={datos.icono} lado={F.baldosa.lado} />
        </div>
      ) : null}
      {t > 0 ? (
        // Título y origen se descubren de izquierda a derecha. La caja mide lo que
        // la línea más larga, así el recorte avanza al ritmo del texto.
        <div
          style={{
            position: "absolute", left: x + F.titulo.dx, top: top + F.titulo.dy, width: "max-content",
            clipPath: t < 1 ? `inset(-12px ${(1 - t) * 100}% -12px -12px)` : undefined,
          }}
        >
          <div style={linea(textStyle(F.titulo.size, 600, color.ink), F.titulo.h)}>
            {titulo}
          </div>
          <div
            style={{
              ...linea(textStyle(F.origen.size, 400, color.ink3), F.origen.h),
              marginTop: F.origen.dy - F.titulo.dy - F.titulo.h, marginLeft: F.origen.dx - F.titulo.dx,
            }}
          >
            {datos.origen}
          </div>
        </div>
      ) : null}
      <Marca
        x={F.estado.x}
        y={top + F.estado.dy + (F.estado.h - F.estado.marca) / 2}
        lado={F.estado.marca}
        trazo={F.estado.trazo}
        dibujo={dibujo}
        relleno={relleno}
      />
      {datos.inicial ? textoEstado(datos.inicial, inicial) : null}
      {datos.final ? textoEstado(datos.final, final) : null}
      {boton.opacidad > 0 ? (
        <div
          style={{
            position: "absolute", left: F.boton.x, top: top + F.boton.dy, width: F.boton.w, height: F.boton.h,
            boxSizing: "border-box", borderRadius: F.boton.radio, border: `${F.boton.borde}px solid ${color.cobalt}`,
            background: fondoBoton(boton.fondo), opacity: boton.opacidad,
          }}
        >
          <div style={{...linea(textStyle(F.boton.size, 600, color.cobalt), F.boton.h - 2 * F.boton.borde), textAlign: "center"}}>
            {TEXTOS.app.boton}
          </div>
        </div>
      ) : null}
    </>
  )
}
