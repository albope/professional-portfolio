import React from "react";
import {Check, Clock, Plus} from "lucide-react";
import {color, displayStyle, monoStyle, radius, textStyle} from "../brand/tokens";
import {ease, progress} from "../lib/anim";

export type CellState = "free" | "reserved" | "class" | "recurring" | "pending" | "blocked";

export interface GridCell {
  court: number;
  slot: number;
  state: CellState;
  /** Texto principal (titular, nombre del grupo…). */
  label?: string;
  /** Frame (relativo a la escena) en el que la celda pasa de libre a su estado. */
  at?: number;
  /** Celdas que ocupan varias franjas. */
  span?: number;
}

const HATCH_AMBER = `repeating-linear-gradient(135deg, ${color.warningBg} 0 10px, #F6E3BC 10px 20px)`;
const HATCH_SAND = `repeating-linear-gradient(135deg, ${color.sand100} 0 10px, ${color.sand200} 10px 20px)`;

const cellLook = (state: CellState) => {
  switch (state) {
    case "reserved":
      return {bg: color.green600, fg: color.sand50, border: color.green600, dashed: false, bar: color.green900};
    case "class":
      return {bg: color.greenTint, fg: color.green700, border: "#BFD9C9", dashed: false, bar: color.green600};
    case "recurring":
      return {bg: HATCH_AMBER, fg: color.ink900, border: color.warningBorder, dashed: false, bar: color.warning};
    case "pending":
      return {bg: HATCH_SAND, fg: color.ink700, border: color.sand300, dashed: false, bar: color.ink400};
    case "blocked":
      return {bg: color.sand200, fg: color.ink400, border: color.sand300, dashed: false, bar: color.ink300};
    default:
      return {bg: "transparent", fg: color.ink400, border: color.sand400, dashed: true, bar: "transparent"};
  }
};

const STATE_WORD: Record<CellState, string> = {
  free: "Libre",
  reserved: "Reservada",
  class: "Clase",
  recurring: "Reserva habitual",
  pending: "Pendiente",
  blocked: "Bloqueada",
};

/**
 * Parrilla de reservas: pistas en columnas, franjas en filas. Cada celda con
 * `at` se «llena» en ese frame (escala + fundido del color), así la parrilla
 * se va ocupando al ritmo de la música.
 */
export const BookingGrid: React.FC<{
  frame: number;
  courts: string[];
  slots: string[];
  cells: GridCell[];
  cellWidth?: number;
  cellHeight?: number;
  gap?: number;
  showHeader?: boolean;
  showTimes?: boolean;
  /** Frame de entrada de la estructura (celdas libres) con escalonado. */
  structureAt?: number;
  style?: React.CSSProperties;
}> = ({
  frame,
  courts,
  slots,
  cells,
  cellWidth = 220,
  cellHeight = 72,
  gap = 10,
  showHeader = true,
  showTimes = true,
  structureAt = 0,
  style,
}) => {
  const timeCol = showTimes ? 86 : 0;
  const headerH = showHeader ? 44 : 0;
  const width = timeCol + courts.length * cellWidth + (courts.length - 1) * gap;
  const height = headerH + slots.length * cellHeight + (slots.length - 1) * gap;
  const covered = new Set<string>();
  cells.forEach((c) => {
    for (let k = 1; k < (c.span ?? 1); k++) covered.add(`${c.court}:${c.slot + k}`);
  });

  return (
    <div style={{position: "relative", width, height: height + (showHeader ? gap : 0), ...style}}>
      {showHeader &&
        courts.map((name, ci) => {
          const p = progress(frame, structureAt + ci * 2, 14);
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: timeCol + ci * (cellWidth + gap),
                top: 0,
                width: cellWidth,
                height: headerH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...displayStyle(700),
                fontSize: 18,
                color: color.ink900,
                opacity: p,
              }}
            >
              {name}
            </div>
          );
        })}
      {showTimes &&
        slots.map((t, si) => {
          const p = progress(frame, structureAt + si * 2, 14);
          return (
            <div
              key={t}
              style={{
                position: "absolute",
                left: 0,
                top: headerH + gap + si * (cellHeight + gap),
                width: timeCol - 14,
                height: cellHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                ...monoStyle(500),
                fontSize: 16,
                color: color.ink500,
                opacity: p,
              }}
            >
              {t}
            </div>
          );
        })}
      {courts.map((_, ci) =>
        slots.map((slotLabel, si) => {
          if (covered.has(`${ci}:${si}`)) return null;
          const cell = cells.find((c) => c.court === ci && c.slot === si);
          const appear = progress(frame, structureAt + (ci + si) * 1.5, 16);
          const fillP = cell && cell.state !== "free" ? progress(frame, cell.at ?? -999, 12, ease.overlay) : 0;
          const look = cellLook(cell && fillP > 0 ? cell.state : "free");
          const free = cellLook("free");
          const span = cell?.span ?? 1;
          const h = span * cellHeight + (span - 1) * gap;
          const pop = 1;
          return (
            <div
              key={`${ci}-${si}`}
              style={{
                position: "absolute",
                left: timeCol + ci * (cellWidth + gap),
                top: headerH + (showHeader ? gap : 0) + si * (cellHeight + gap),
                width: cellWidth,
                height: h,
                opacity: appear,
                transform: `scale(${(0.92 + 0.08 * appear) * pop})`,
              }}
            >
              {/* Estado libre (debajo) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: radius.module,
                  border: `1.5px dashed ${free.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 14px",
                  color: color.ink400,
                  ...monoStyle(500),
                  fontSize: 15,
                  opacity: 1 - fillP,
                }}
              >
                <Clock size={16} />
                {slotLabel}
                <Plus size={17} style={{marginLeft: "auto"}} />
              </div>
              {/* Estado ocupado (encima) */}
              {cell && cell.state !== "free" ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: radius.module,
                    background: look.bg,
                    border: `1.5px solid ${look.border}`,
                    boxShadow: `inset 4px 0 0 ${look.bar}`,
                    opacity: fillP,
                    transform: `scale(${0.9 + 0.1 * fillP})`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0 16px",
                    gap: 2,
                    overflow: "hidden",
                  }}
                >
                  <div style={{display: "flex", alignItems: "center", gap: 6, ...textStyle(700), fontSize: 17, color: look.fg, whiteSpace: "nowrap"}}>
                    {cell.state === "reserved" ? <Check size={17} strokeWidth={2.6} /> : null}
                    {cell.label ?? STATE_WORD[cell.state]}
                  </div>
                  <div style={{...monoStyle(500), fontSize: 13, color: look.fg, opacity: 0.8}}>{slotLabel}</div>
                </div>
              ) : null}
            </div>
          );
        }),
      )}
    </div>
  );
};
