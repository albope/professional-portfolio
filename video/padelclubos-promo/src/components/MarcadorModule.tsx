import React from "react";
import {color, displayStyle, monoStyle, radius, textStyle} from "../brand/tokens";
import {progress} from "../lib/anim";
import {DigitRoll} from "./DigitRoll";

export interface MarcadorCell {
  label: string;
  value: string;
  /** Valor anterior desde el que rueda (por defecto, vacío). */
  from?: string;
  /** Frame en que rueda hacia `value` (por defecto: start + i·2). */
  at?: number;
}

/**
 * «Módulo marcador», el gesto propietario de la marca: 3 celdas
 * Pista / Fecha / Hora con borde de 2 px, radio 10, etiquetas en JetBrains
 * Mono y cifras en Archivo 112 % tabulares, con fila de total opcional.
 * Las cifras cambian con digit-roll (nunca con giros 3D).
 */
export const MarcadorModule: React.FC<{
  frame: number;
  /** Frame en que empiezan a rodar las cifras. */
  start?: number;
  cells?: MarcadorCell[];
  totalLabel?: React.ReactNode;
  total?: React.ReactNode;
  /** Frame en que aparece la fila de total (vista). */
  totalAt?: number;
  width?: number;
  valueSize?: number;
  labelSize?: number;
  tone?: "light" | "dark";
  /** Color del borde y separadores (por defecto tinta o arena según tono). */
  borderColor?: string;
  surface?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  frame,
  start = 0,
  cells = [
    {label: "Pista", value: "3"},
    {label: "Fecha", value: "JUE"},
    {label: "Hora", value: "19:30"},
  ],
  totalLabel = "Total",
  total,
  totalAt,
  width = 560,
  valueSize,
  labelSize,
  tone = "light",
  borderColor,
  surface,
  style,
  children,
}) => {
  const ink = borderColor ?? (tone === "light" ? color.ink900 : color.darkText);
  const txt = tone === "light" ? color.ink900 : color.darkText;
  const bg = surface ?? (tone === "light" ? color.surfaceRaised : color.darkSurface);
  const muted = tone === "light" ? color.ink400 : color.ink400;
  const vSize = valueSize ?? Math.round(width / 12);
  const lSize = labelSize ?? Math.max(14, Math.round(width / 40));
  const tAt = totalAt ?? start + cells.length * 2 + 6;
  const tP = progress(frame, tAt, 6);
  return (
    <div
      style={{
        position: "relative",
        width,
        border: `2px solid ${ink}`,
        borderRadius: radius.module,
        background: bg,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{display: "grid", gridTemplateColumns: `repeat(${cells.length}, 1fr)`}}>
        {cells.map((c, i) => (
          <div
            key={c.label + i}
            style={{
              padding: `${Math.round(vSize * 0.28)}px ${Math.round(vSize * 0.32)}px ${Math.round(vSize * 0.3)}px`,
              borderLeft: i === 0 ? "none" : `2px solid ${ink}`,
              display: "flex",
              flexDirection: "column",
              gap: Math.round(vSize * 0.12),
              minWidth: 0,
            }}
          >
            <span style={{...monoStyle(600), fontSize: lSize, letterSpacing: "0.14em", textTransform: "uppercase", color: muted}}>
              {c.label}
            </span>
            <span style={{...displayStyle(800), fontSize: vSize, lineHeight: 1.05, color: txt, whiteSpace: "nowrap"}}>
              <DigitRoll frame={frame} keys={[{at: c.at ?? start + i * 2, value: c.value}]} initial={c.from ?? ""} alignRight={false} />
            </span>
          </div>
        ))}
      </div>
      {total !== undefined ? (
        <div
          style={{
            borderTop: `2px solid ${ink}`,
            padding: `${Math.round(vSize * 0.2)}px ${Math.round(vSize * 0.32)}px`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            ...textStyle(600),
            fontSize: Math.max(16, Math.round(vSize * 0.3)),
            color: txt,
            background: tone === "light" ? color.sand50 : color.darkRaised,
            opacity: tP,
            transform: `translateY(${(1 - tP) * 4}px)`,
          }}
        >
          <span>{totalLabel}</span>
          <span style={{...displayStyle(750), fontSize: Math.max(18, Math.round(vSize * 0.36))}}>{total}</span>
        </div>
      ) : null}
      {children}
    </div>
  );
};
