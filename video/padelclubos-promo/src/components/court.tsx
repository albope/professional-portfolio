import React from "react";
import {color} from "../brand/tokens";
import {clamp01} from "../lib/anim";

/**
 * Pista de pádel vista desde arriba, a escala real: 10 × 20 m, red en el
 * centro, líneas de saque a 6,95 m de la red y línea central de saque.
 * `draw` (0→1) dibuja las líneas en orden: perímetro → red → saque → central.
 */
export const CourtLines: React.FC<{
  /** Largo en px del lado de 20 m. */
  length: number;
  orientation?: "horizontal" | "vertical";
  draw?: number;
  stroke?: string;
  strokeWidth?: number;
  /** Relleno de la superficie de juego (0→1 de opacidad). */
  fill?: string;
  fillOpacity?: number;
  netColor?: string;
  style?: React.CSSProperties;
}> = ({
  length,
  orientation = "horizontal",
  draw = 1,
  stroke = color.green400,
  strokeWidth = 3,
  fill,
  fillOpacity = 1,
  netColor,
  style,
}) => {
  // Coordenadas en metros; se dibuja en horizontal (20 de largo × 10 de ancho).
  const L = 20;
  const W = 10;
  const svc = 6.95;
  const k = length / L;
  const horizontal = orientation === "horizontal";
  const w = horizontal ? length : W * k;
  const h = horizontal ? W * k : length;
  const seg = (i: number, n: number) => clamp01(draw * n - i);
  const lines: {d: string; len: number; kind: "line" | "net"}[] = [
    {d: `M0 0 H${L} V${W} H0 Z`, len: 60, kind: "line"},
    {d: `M${L / 2} -0.4 V${W + 0.4}`, len: W + 0.8, kind: "net"},
    {d: `M${L / 2 - svc} 0 V${W}`, len: W, kind: "line"},
    {d: `M${L / 2 + svc} 0 V${W}`, len: W, kind: "line"},
    {d: `M${L / 2 - svc} ${W / 2} H${L / 2 + svc}`, len: svc * 2, kind: "line"},
  ];
  const n = lines.length;
  return (
    <svg width={w} height={h} viewBox={horizontal ? `0 0 ${L} ${W}` : `0 0 ${W} ${L}`} style={{overflow: "visible", ...style}}>
      <g transform={horizontal ? undefined : `translate(${W} 0) rotate(90)`}>
        {fill ? <rect x={0} y={0} width={L} height={W} fill={fill} opacity={fillOpacity * clamp01(draw * 1.5)} /> : null}
        {lines.map((l, i) => {
          const p = seg(i, n);
          return (
            <path
              key={i}
              d={l.d}
              fill="none"
              stroke={l.kind === "net" ? (netColor ?? stroke) : stroke}
              strokeWidth={(l.kind === "net" ? strokeWidth * 1.8 : strokeWidth) / k}
              strokeLinecap="square"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              opacity={p > 0 ? 1 : 0}
            />
          );
        })}
      </g>
    </svg>
  );
};

/** Bola de pádel (acento gráfico). `spin` en grados. */
export const PadelBall: React.FC<{size?: number; spin?: number; style?: React.CSSProperties; shadow?: boolean}> = ({
  size = 40,
  spin = 0,
  style,
  shadow = true,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{overflow: "visible", ...style}}>
    {shadow ? <ellipse cx={20} cy={38} rx={13} ry={3} fill="rgba(20,18,15,0.18)" /> : null}
    <defs>
      <radialGradient id="ballShade" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#F1F7A6" />
        <stop offset="60%" stopColor={color.ball} />
        <stop offset="100%" stopColor="#B7C23A" />
      </radialGradient>
    </defs>
    <circle cx={20} cy={20} r={18} fill="url(#ballShade)" />
    <g transform={`rotate(${spin} 20 20)`}>
      <path d="M6 9 C 16 14, 16 26, 6 31" fill="none" stroke={color.ballSeam} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M34 9 C 24 14, 24 26, 34 31" fill="none" stroke={color.ballSeam} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  </svg>
);
