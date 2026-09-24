import React from "react";
import {color, displayStyle, monoStyle, radius, textStyle} from "../brand/tokens";
import {ease, progress} from "../lib/anim";

/**
 * «Módulo marcador», el gesto propietario de la marca: 3 celdas
 * Pista / Fecha / Hora con borde de 2 px tinta, como un marcador deportivo,
 * y fila de total. Cada cifra entra como una paleta de marcador que gira.
 */
export const MarcadorModule: React.FC<{
  frame: number;
  /** Frame en que empiezan a girar las paletas. */
  start?: number;
  cells?: {label: string; value: string}[];
  totalLabel?: string;
  total?: string;
  width?: number;
  tone?: "light" | "dark";
  style?: React.CSSProperties;
}> = ({
  frame,
  start = 0,
  cells = [
    {label: "Pista", value: "3"},
    {label: "Fecha", value: "Jue 12"},
    {label: "Hora", value: "19:30"},
  ],
  totalLabel = "Total",
  total,
  width = 560,
  tone = "light",
  style,
}) => {
  const ink = tone === "light" ? color.ink900 : color.darkText;
  const bg = tone === "light" ? color.surfaceRaised : color.darkSurface;
  const muted = tone === "light" ? color.ink400 : color.ink300;
  return (
    <div
      style={{
        width,
        border: `2px solid ${ink}`,
        borderRadius: radius.module + 2,
        background: bg,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{display: "grid", gridTemplateColumns: `repeat(${cells.length}, 1fr)`}}>
        {cells.map((c, i) => {
          const p = progress(frame, start + i * 5, 14, ease.overlay);
          const angle = (1 - p) * -90;
          return (
            <div
              key={c.label}
              style={{
                padding: "16px 18px 18px",
                borderLeft: i === 0 ? "none" : `2px solid ${ink}`,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                perspective: 400,
              }}
            >
              <span style={{...monoStyle(600), fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: muted}}>
                {c.label}
              </span>
              <span
                style={{
                  ...displayStyle(750),
                  fontSize: width / 14,
                  lineHeight: 1,
                  color: ink,
                  display: "inline-block",
                  transform: `rotateX(${angle}deg)`,
                  transformOrigin: "50% 100%",
                  opacity: p > 0 ? 0.25 + 0.75 * p : 0,
                  whiteSpace: "nowrap",
                }}
              >
                {c.value}
              </span>
            </div>
          );
        })}
      </div>
      {total ? (
        <div
          style={{
            borderTop: `2px solid ${ink}`,
            padding: "12px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            ...textStyle(600),
            fontSize: 17,
            color: ink,
            opacity: progress(frame, start + cells.length * 5 + 4, 12),
          }}
        >
          <span>{totalLabel}</span>
          <span style={{...displayStyle(750), fontSize: 22}}>{total}</span>
        </div>
      ) : null}
    </div>
  );
};
