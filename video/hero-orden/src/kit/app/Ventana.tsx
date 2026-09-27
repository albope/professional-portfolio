import React from "react"
import {AbsoluteFill} from "remotion"
import {color, displayStyle, textStyle} from "../../brand/tokens"
import {useLayout} from "../../layout"
import {TEXTOS} from "../../textos"
import {linea} from "./estilo"
import {Glifo, type GlifoProps} from "./Glifo"
import {Marca} from "./Marca"

// Ventana de la aplicación con su cromo: barra de título (glifo y píldora de
// dirección), filete, barra lateral (escritorio), «Hoy» y subtítulo. Los hijos se
// dibujan en px de LIENZO y quedan recortados por la ventana. `textos` funde el
// menú lateral, «Hoy» y el subtítulo, que llegan después del cromo.
export interface VentanaProps {
  opacidad: number
  entrada: number                 // 0 a 1: escala 0,98 → 1 y desplazamiento +ventana.entradaDy → 0
  textos: number                  // 0 a 1: opacidad del menú lateral, «Hoy» y el subtítulo
  glifo: GlifoProps
  children?: React.ReactNode
}

export const Ventana: React.FC<VentanaProps> = ({opacidad, entrada, textos, glifo, children}) => {
  const L = useLayout()
  const v = L.ventana
  const {caja} = v
  const cx = caja.x + caja.w / 2
  const cy = caja.y + caja.h / 2
  const transform = entrada < 1 ? `translateY(${v.entradaDy * (1 - entrada)}px) scale(${0.98 + 0.02 * entrada})` : undefined
  const barraY = caja.y + v.barraH
  const {hoy, sub} = L.cabecera
  const lat = L.lateral
  return (
    <AbsoluteFill style={{opacity: opacidad, transform, transformOrigin: `${cx}px ${cy}px`}}>
      <div
        style={{
          position: "absolute", left: caja.x, top: caja.y, width: caja.w, height: caja.h,
          boxSizing: "border-box", borderRadius: v.radio, border: `${v.borde}px solid ${color.line2}`,
          background: color.surface, boxShadow: L.sombra.ventana, overflow: "hidden",
        }}
      >
        {/* Lienzo desplazado: dentro, todo se coloca en px de composición. */}
        <div style={{position: "absolute", left: -(caja.x + v.borde), top: -(caja.y + v.borde), width: L.W, height: L.H}}>
          <Glifo {...glifo} />
          <div
            style={{
              position: "absolute", left: L.direccion.x, top: L.direccion.y, width: L.direccion.w, height: L.direccion.h,
              borderRadius: L.direccion.h / 2, background: color.pastilla,
            }}
          />
          <div style={{position: "absolute", left: caja.x, top: barraY, width: caja.w, height: L.filete, background: color.line}} />

          {lat ? (
            <>
              <div style={{position: "absolute", left: lat.caja.x, top: lat.caja.y, width: lat.caja.w, height: lat.caja.h, background: color.bg}} />
              <div
                style={{
                  position: "absolute", left: lat.caja.x + lat.caja.w - lat.filete, top: lat.caja.y,
                  width: lat.filete, height: lat.caja.h, background: color.line,
                }}
              />
            </>
          ) : null}

          {textos > 0 ? (
            <div style={{position: "absolute", left: 0, top: 0, width: L.W, height: L.H, opacity: textos}}>
              {lat ? (
                <>
                  <div
                    style={{
                      position: "absolute", left: lat.activo.caja.x, top: lat.activo.caja.y,
                      width: lat.activo.caja.w, height: lat.activo.caja.h, borderRadius: lat.activo.radio, background: color.cobalt50,
                    }}
                  />
                  <Marca
                    x={lat.activo.marca.x}
                    y={lat.activo.caja.y + (lat.activo.caja.h - lat.activo.marca.lado) / 2}
                    lado={lat.activo.marca.lado}
                    trazo={0}
                    dibujo={0}
                    relleno={1}
                  />
                  <div
                    style={{
                      ...linea(textStyle(lat.size, 600, color.cobalt), lat.activo.caja.h),
                      position: "absolute", left: lat.activo.textoX, top: lat.activo.caja.y,
                    }}
                  >
                    {TEXTOS.app.menu[0]}
                  </div>
                  {TEXTOS.app.menu.slice(1).map((entrada, i) => (
                    <div
                      key={entrada}
                      style={{
                        ...linea(textStyle(lat.size, 400, color.ink2), lat.lineaH),
                        position: "absolute", left: lat.textoX, top: lat.itemsCentroY[i] - lat.lineaH / 2,
                      }}
                    >
                      {entrada}
                    </div>
                  ))}
                </>
              ) : null}

              <div
                style={{
                  ...linea(displayStyle(hoy.size), hoy.h),
                  position: "absolute", left: hoy.x, top: hoy.y,
                }}
              >
                {TEXTOS.app.cabecera}
              </div>
              <div
                style={{
                  ...linea(textStyle(sub.size, 400, color.ink3), sub.h),
                  position: "absolute", left: sub.x, top: sub.y,
                }}
              >
                {TEXTOS.app.subtitulo}
              </div>
            </div>
          ) : null}

          {children}
        </div>
      </div>
    </AbsoluteFill>
  )
}
