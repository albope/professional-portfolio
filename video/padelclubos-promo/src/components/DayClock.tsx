import React from "react";
import {color, monoStyle, radius} from "../brand/tokens";
import {ease, progress} from "../lib/anim";
import {DigitRoll, type RollKey} from "./DigitRoll";

export type ClockMood = "alert" | "neutral" | "calm";

/**
 * «Reloj del día» (solo 16:9): píldora arriba a la izquierda (x96, y56) con
 * DÍA · HORA en JetBrains Mono 28 px. Los dígitos ruedan como un marcador.
 *   alert   → hora en rojo suave sobre #282420 (acto del problema)
 *   neutral → hora en arena sobre tinta (producto)
 *   calm    → hora en verde #6FBF9C (23:47 finales)
 */
export const DayClock: React.FC<{
  frame: number;
  /** Claves del día (p. ej. [{at: 0, value: "LUN"}, {at: 75, value: "MAR"}]). */
  day: RollKey[];
  /** Claves de la hora («23:47», «00:06»…). */
  time: RollKey[];
  mood?: ClockMood;
  /** Frame de entrada (vista 180 ms). Por defecto ya está presente en f0. */
  enterAt?: number;
  /** Frame en que empieza a salir (vista inversa de 8 f). */
  exitAt?: number;
  /** Tono del fondo sobre el que va: oscuro (problema) o claro (producto). */
  surface?: "dark" | "light";
  style?: React.CSSProperties;
}> = ({frame, day, time, mood = "neutral", enterAt, exitAt, surface = "dark", style}) => {
  const inP = enterAt === undefined ? 1 : progress(frame, enterAt, 6, ease.out);
  const outP = exitAt === undefined ? 0 : progress(frame, exitAt, 8, ease.in);
  const o = inP * (1 - outP);
  const timeColor = mood === "alert" ? color.painRed : mood === "calm" ? color.gainGreen : surface === "dark" ? color.darkText : color.ink900;
  const bg = surface === "dark" ? color.darkRaised : color.ink900;
  const fg = surface === "dark" ? color.ink300 : color.sand300;
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 56,
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 22px",
        borderRadius: radius.pill,
        background: bg,
        border: `2px solid ${surface === "dark" ? color.darkBorder : color.ink900}`,
        ...monoStyle(500),
        fontSize: 28,
        lineHeight: 1.15,
        letterSpacing: "0.04em",
        color: fg,
        opacity: o,
        transform: `translateY(${(1 - inP) * 4 - outP * 4}px)`,
        zIndex: 50,
        ...style,
      }}
    >
      <DigitRoll frame={frame} keys={day} alignRight={false} />
      <span style={{opacity: 0.6}}>·</span>
      <DigitRoll frame={frame} keys={time} style={{color: mood === "neutral" && surface === "light" ? color.sand50 : timeColor}} />
    </div>
  );
};
