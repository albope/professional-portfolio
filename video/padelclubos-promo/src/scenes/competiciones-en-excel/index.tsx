import React from "react";
import {AbsoluteFill, interpolateColors, useCurrentFrame} from "remotion";
import {color} from "../../brand/tokens";
import {WordsReveal} from "../../components";
import {clamp01, ease, lerp, motion, progress, tween} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T9} from "./cues";
import {LigaSheet, SHEET_H, SHEET_W} from "./Sheet";

// Escena solo vertical (1080×1920). En 16:9 no forma parte del montaje: si
// alguien la renderiza así, se ve el plano vertical entero, centrado.
const W = 1080;
const H = 1920;

/** Hoja a toda la anchura (x72–1008), bajo el titular de dos líneas, girada −2°. */
const SHEET = {x: 72, y: 560, r: -2} as const;

// Geometría oficial del isotipo (viewBox 48): marco 40×28, rx 7, trazo 3.
// A 8× es el contorno de 320×224, rx 56 y trazo de 24 px con el que arranca «interruptor» en vertical.
const ISO = {x: 4, y: 10, w: 40, h: 28, rx: 7, stroke: 3} as const;
const OUT = {cx: 540, cy: 850, s: 8} as const;

// ---------------------------------------------------------------- tiempo

// Ease-in exponencial de la succión.
const K = 5;
const expo = (u: number) => (Math.pow(2, K * u) - 1) / (Math.pow(2, K) - 1);

/** Caída de la hoja sobre la mesa (overlay 7 f). */
const landAt = (f: number) => progress(f, T9.drop, motion.overlay, ease.overlay);
/** 0 → 1 durante la succión. */
const suckAt = (f: number) => expo(clamp01((f - T9.suck) / T9.suckDur));
// Los dos brazos del contorno salen rápido (ningún frame muestra un trazo suelto) y cierran arriba despacio,
// justo cuando la hoja termina de hundirse.
const outlineAt = (f: number) => progress(f, T9.outline, T9.outlineDur, ease.out);

// ---------------------------------------------------------------- hoja

interface Pose {
  /** Caída: desplazamiento, escala y giro de la hoja sobre su centro. */
  dy: number;
  s0: number;
  r0: number;
  /** Cámara y remolino, sobre el centro del contorno. */
  scale: number;
  spin: number;
}

const pose = (f: number): Pose => {
  const land = landAt(f);
  const k = suckAt(f);
  // Leve acercamiento mientras se rompe la columna; luego, el remolino hacia el contorno.
  const push = tween(f, [T9.land, T9.suck], [1, 1.03], ease.inOut);
  return {
    // Cae desde algo más cerca de cámara: baja, se posa (1,06 → 1) y gira hasta −2°.
    dy: (1 - land) * -88,
    s0: 1 + (1 - land) * 0.06,
    r0: SHEET.r * land,
    scale: push * (1 - k),
    spin: -14 * k,
  };
};

/**
 * Desenfoque de movimiento (obturador centrado en el frame): la velocidad de
 * los bordes se convierte en un desenfoque gaussiano, vertical en la caída y
 * uniforme en la succión. Un solo filtro sobre una sola capa: no altera el color.
 */
const motionBlur = (f: number) => {
  const a = pose(f - 0.5);
  const b = pose(f + 0.5);
  const fall = Math.abs(b.dy - a.dy) + Math.abs(b.s0 - a.s0) * (SHEET_H / 2);
  const swirl = (SHEET_W / 1.6) * (Math.abs(b.scale - a.scale) + b.scale * Math.abs(((b.spin - a.spin) * Math.PI) / 180));
  return {by: Math.min(10, fall * 0.16), b: Math.min(14, swirl * 0.14)};
};

const SheetLayer: React.FC<{frame: number}> = ({frame}) => {
  const p = pose(frame);
  const lift = 1 - landAt(frame);
  // Lo que se traga el contorno se apaga al hundirse.
  const k = suckAt(frame);
  const {by, b} = motionBlur(frame);
  const filters = [by > 0.3 ? "url(#cee-fall)" : "", b > 0.3 ? `blur(${b.toFixed(2)}px)` : "", k > 0 ? `brightness(${(1 - 0.45 * k).toFixed(3)})` : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <AbsoluteFill style={{filter: filters || undefined}}>
      {by > 0.3 ? (
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id="cee-fall" x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`0 ${by.toFixed(2)}`} />
          </filter>
        </svg>
      ) : null}
      <AbsoluteFill style={{transformOrigin: `${OUT.cx}px ${OUT.cy}px`, transform: `rotate(${p.spin}deg) scale(${p.scale})`}}>
        <div
          style={{
            position: "absolute",
            left: SHEET.x,
            top: SHEET.y,
            width: SHEET_W,
            height: SHEET_H,
            transform: `translateY(${p.dy}px) rotate(${p.r0}deg) scale(${p.s0})`,
            borderRadius: 14,
            boxShadow: `0 ${Math.round(40 + 48 * lift)}px ${Math.round(88 + 64 * lift)}px -24px rgba(0, 0, 0, ${(0.8 - 0.25 * lift).toFixed(2)})`,
          }}
        >
          <LigaSheet frame={frame} errors={T9.errors} rangeAt={T9.range} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- contorno

// Dos mitades simétricas: nacen abajo en el centro, suben por los lados y se cierran arriba.
const R = ISO.rx;
const X0 = ISO.x;
const X1 = ISO.x + ISO.w;
const Y0 = ISO.y;
const Y1 = ISO.y + ISO.h;
const HALF_R = `M24 ${Y1} H${X1 - R} A${R} ${R} 0 0 0 ${X1} ${Y1 - R} V${Y0 + R} A${R} ${R} 0 0 0 ${X1 - R} ${Y0} H24`;
const HALF_L = `M24 ${Y1} H${X0 + R} A${R} ${R} 0 0 1 ${X0} ${Y1 - R} V${Y0 + R} A${R} ${R} 0 0 1 ${X0 + R} ${Y0} H24`;

/** Interior del contorno (línea media del trazo): lo que cae dentro, se lo traga. */
const insideClip = () => {
  const l = OUT.cx + (X0 - 24) * OUT.s;
  const r = W - (OUT.cx + (X1 - 24) * OUT.s);
  const t = OUT.cy + (Y0 - 24) * OUT.s;
  const b = H - (OUT.cy + (Y1 - 24) * OUT.s);
  return `inset(${t}px ${r}px ${b}px ${l}px round ${R * OUT.s}px)`;
};

/** Máscara suave que se estrecha hacia el contorno en los últimos frames del cierre. */
const closingMask = (frame: number): React.CSSProperties => {
  const m = progress(frame, T9.outline + T9.outlineDur - 5, 5, ease.in);
  if (m <= 0) return {};
  const rx = lerp(1120, 200, m);
  const ry = lerp(1400, 136, m);
  const g = `radial-gradient(${rx}px ${ry}px at ${OUT.cx}px ${OUT.cy}px, #000 72%, transparent 100%)`;
  return {maskImage: g, WebkitMaskImage: g};
};

const Outline: React.FC<{frame: number}> = ({frame}) => {
  const p = outlineAt(frame);
  if (p <= 0) return null;
  const t = `translate(${OUT.cx} ${OUT.cy}) scale(${OUT.s}) translate(-24 -24)`;
  return (
    <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
      <g transform={t}>
        {p >= 1 ? (
          <rect x={X0} y={Y0} width={ISO.w} height={ISO.h} rx={R} fill="none" stroke={color.darkText} strokeWidth={ISO.stroke} />
        ) : (
          [HALF_R, HALF_L].map((d) => (
            <path key={d} d={d} fill="none" stroke={color.darkText} strokeWidth={ISO.stroke} pathLength={1} strokeDasharray={`${p} 1`} />
          ))
        )}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- HUD

const TITLE = {x: 72, y: 308, size: 96, line: 98} as const;

const Title: React.FC<{frame: number}> = ({frame}) => {
  const style: React.CSSProperties = {
    fontSize: TITLE.size,
    fontWeight: 760,
    lineHeight: `${TITLE.line}px`,
    color: color.darkText,
    whiteSpace: "nowrap",
    flexWrap: "nowrap",
  };
  const common = {frame, step: T9.titleStep, exitAt: T9.titleOut, exitDuration: T9.titleOutDur, style};
  return (
    <div style={{position: "absolute", left: TITLE.x, top: TITLE.y}}>
      <WordsReveal text="Competiciones" start={T9.title} {...common} />
      <WordsReveal text="en Excel." start={T9.title + T9.titleStep} {...common} />
    </div>
  );
};

// ---------------------------------------------------------------- escena

const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  // Foco cálido de «dobles-reservas» que se apaga con la succión: el último
  // frame es el #14120F liso con el que arranca «interruptor».
  const glow = 0.7 * (1 - progress(frame, T9.suck, T9.suckDur, ease.inOut));
  const inner = interpolateColors(glow, [0, 1], [color.darkBg, color.darkSurface]);
  const bg = `radial-gradient(ellipse 70% 60% at 50% 56%, ${inner} 0%, ${color.darkBg} 100%)`;
  const closed = outlineAt(frame) >= 1;
  const gone = frame >= T9.suck + T9.suckDur;
  return (
    <AbsoluteFill style={{background: bg, overflow: "hidden"}}>
      {gone ? null : (
        <AbsoluteFill style={{clipPath: closed ? insideClip() : undefined, ...closingMask(frame)}}>
          <SheetLayer frame={frame} />
        </AbsoluteFill>
      )}
      <Outline frame={frame} />
      <Title frame={frame} />
    </AbsoluteFill>
  );
};

export const Scene: React.FC = () => {
  const {portrait, width, height} = useScene();
  if (portrait) return <Stage />;
  return (
    <AbsoluteFill style={{background: color.darkBg, justifyContent: "center", alignItems: "center"}}>
      <div style={{width: W, height: H, flexShrink: 0, position: "relative", transform: `scale(${Math.min(width / W, height / H)})`}}>
        <Stage />
      </div>
    </AbsoluteFill>
  );
};
