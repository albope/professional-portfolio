import React, {type CSSProperties, type ReactNode} from "react"
import {color, monoStyle, textStyle} from "../../brand/tokens"
import {useLayout, type Caja} from "../../layout"

export interface HoraBurbuja {texto: string, y: number, h: number, derecha: number, size: number}

export interface BurbujaProps {
  tipo: "entrante" | "saliente"
  /** Caja local al grupo del chat. */
  caja: Caja
  lineas: readonly string[]
  lineasY: readonly number[]
  hora?: HoraBurbuja | null
  /** Caja local de los ✓✓ (solo en la respuesta). */
  checks?: Caja | null
  /** Multiplica la opacidad de textos, hora y ✓✓, no la forma. */
  contenido: number
  /** Entre la forma y el texto (el resalte de copia). */
  fondo?: ReactNode
  /** Encima de la forma (los puntos de «escribiendo»). */
  children?: ReactNode
  /** Opacidad y transform de la burbuja entera (entrada de «escribiendo» y del mensaje nuevo). */
  style?: CSSProperties
}

/**
 * Burbuja de chat. Entrante: fondo blanco y esquina inferior izquierda casi
 * recta. Saliente (la respuesta del negocio): fondo pastilla, neutra, con la
 * esquina inferior derecha casi recta. No hay colas dibujadas.
 * El texto va con cifras proporcionales: los anchos de LAYOUT (el resalte de
 * copia acaba en `seleccion.x1`, justo tras «19») están medidos así.
 */
export const Burbuja: React.FC<BurbujaProps> = ({tipo, caja, lineas, lineasY, hora, checks, contenido, fondo, children, style}) => {
  const L = useLayout()
  const C = L.chat
  const r = C.radio
  const rc = C.radioCola
  const entrante = tipo === "entrante"
  return (
    <div style={{position: "absolute", left: caja.x, top: caja.y, width: caja.w, height: caja.h, ...style}}>
      <div
        style={{
          position: "absolute", inset: 0, boxSizing: "border-box",
          background: entrante ? color.surface : color.pastilla,
          border: `${L.filete}px solid ${color.line2}`,
          borderRadius: entrante ? `${r}px ${r}px ${r}px ${rc}px` : `${r}px ${r}px ${rc}px ${r}px`,
          boxShadow: L.sombra.pieza,
        }}
      />
      {fondo}
      {contenido > 0 && (
        <div style={{position: "absolute", inset: 0, opacity: contenido}}>
          {lineas.map((texto, i) => (
            <div
              key={i}
              style={{
                position: "absolute", left: C.padX, top: lineasY[i], height: C.lineaH,
                ...textStyle(C.size, 400, color.ink), fontVariantNumeric: "normal", lineHeight: `${C.lineaH}px`, whiteSpace: "nowrap",
              }}
            >
              {texto}
            </div>
          ))}
          {hora && (
            <div
              style={{
                position: "absolute", right: hora.derecha, top: hora.y, height: hora.h,
                ...monoStyle(hora.size, color.ink3), lineHeight: `${hora.h}px`, whiteSpace: "nowrap",
              }}
            >
              {hora.texto}
            </div>
          )}
          {checks && (
            <svg
              width={checks.w}
              height={checks.h}
              viewBox="0 0 40 24"
              preserveAspectRatio="none"
              style={{position: "absolute", left: checks.x, top: checks.y, overflow: "visible"}}
            >
              <path
                d="M2 12l6 6 12-12M16 12l6 6 12-12"
                fill="none"
                stroke={color.ink3}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
