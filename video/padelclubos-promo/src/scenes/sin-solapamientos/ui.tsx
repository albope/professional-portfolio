import React from "react";
import {ChevronDown} from "lucide-react";
import {color, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";
import {DigitRoll, cursorPosition, type CursorKey, type RollKey} from "../../components";
import {clamp01, ease, progress} from "../../lib/anim";

// ─── Reloj del día en versión clara ───────────────────────────────────────
// El DayClock del kit pinta la píldora en tinta sobre fondo claro; el
// storyboard la quiere clara (#E7E2D8, texto tinta), igual que «reserva-movil».

export const LightClock: React.FC<{frame: number; rollAt: number}> = ({frame, rollAt}) => (
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
      background: color.sand200,
      border: `2px solid ${color.sand300}`,
      ...monoStyle(500),
      fontSize: 28,
      lineHeight: 1.15,
      letterSpacing: "0.04em",
      color: color.ink500,
      zIndex: 50,
    }}
  >
    <span>MAR</span>
    <span style={{opacity: 0.6}}>·</span>
    <DigitRoll frame={frame} keys={[{at: rollAt, value: "11:20"}]} initial="08:15" style={{color: color.ink900, fontWeight: 600}} />
  </div>
);

// ─── Desenfoque de movimiento direccional ─────────────────────────────────

/**
 * Desenfoque gaussiano en el eje del movimiento, proporcional a la velocidad
 * (obturador de 180°: estela de v/2 px, sigma ≈ 0,15·v). Nítido en reposo y
 * sin el tinte que deja la suma de capas de CameraMotionBlur sobre la arena.
 */
export const DirBlur: React.FC<{
  id: string;
  vx?: number;
  vy?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({id, vx = 0, vy = 0, style, children}) => {
  // Tope común del acto de producto: estela legible, sin barrido en bloque.
  const sx = Math.min(18, Math.abs(vx) * 0.15);
  const sy = Math.min(18, Math.abs(vy) * 0.15);
  const on = sx > 0.3 || sy > 0.3;
  return (
    <>
      {on ? (
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id={id} x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
          </filter>
        </svg>
      ) : null}
      <div style={{...style, filter: on ? `url(#${id})` : undefined}}>{children}</div>
    </>
  );
};

/** Velocidad (px/frame) de una posición que depende del frame: diferencia central. */
export const velocity = (f: (frame: number) => number, frame: number) => (f(frame + 1) - f(frame - 1)) / 2;

// ─── Check dibujado ───────────────────────────────────────────────────────

/** Check en círculo verde: el círculo entra con press y el trazo se dibuja. */
export const CheckDot: React.FC<{size: number; circle: number; draw: number}> = ({size, circle, draw}) => {
  const len = 20;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display: "block", opacity: circle, transform: `scale(${0.96 + 0.04 * circle})`}}>
      <circle cx={12} cy={12} r={12} fill={color.green600} />
      <path
        d="M6.6 12.4 L10.4 16 L17.6 8.6"
        fill="none"
        stroke={color.sand50}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - clamp01(draw))}
      />
    </svg>
  );
};

// ─── Módulo marcador claro ────────────────────────────────────────────────

export interface CardGeo {
  w: number;
  /** Anchos de PISTA, FECHA y HORA (incluyen su separador de 2 px). */
  cols: [number, number, number];
  cellH: number;
  padX: number;
  padTop: number;
  padBottom: number;
  valueSize: number;
  labelSize: number;
  /** Alto de la fila de total (0 = sin fila). */
  footerH: number;
  footerFont?: number;
  avatar?: number;
  stripW: number;
}

export const cardHeight = (g: CardGeo) => 2 + g.cellH + (g.footerH ? 2 + g.footerH : 0) + 2;

export interface CellValue {
  keys: RollKey[];
  initial?: string;
  duration?: number;
}

const LABELS = ["PISTA", "FECHA", "HORA"];

/** Borde completo del módulo (contorno y separadores) en un solo trazo. */
const Frame: React.FC<{g: CardGeo; h: number; ink: string; dash?: string; opacity: number}> = ({g, h, ink, dash, opacity}) => {
  if (opacity <= 0.001) return null;
  const x1 = 2 + g.cols[0] + 1;
  const x2 = x1 + g.cols[1];
  const yF = 2 + g.cellH + 1;
  return (
    <svg width={g.w} height={h} style={{position: "absolute", left: 0, top: 0, opacity, overflow: "visible"}}>
      <rect x={1} y={1} width={g.w - 2} height={h - 2} rx={radius.module - 1} fill="none" stroke={ink} strokeWidth={2} strokeDasharray={dash} />
      <line x1={x1} y1={2} x2={x1} y2={2 + g.cellH} stroke={ink} strokeWidth={2} strokeDasharray={dash} />
      <line x1={x2} y1={2} x2={x2} y2={2 + g.cellH} stroke={ink} strokeWidth={2} strokeDasharray={dash} />
      {g.footerH ? <line x1={2} y1={yF} x2={g.w - 2} y2={yF} stroke={ink} strokeWidth={2} strokeDasharray={dash} /> : null}
    </svg>
  );
};

/**
 * Módulo marcador en versión clara (tarjeta blanca sobre la página #F6F3ED,
 * como el marcador de «reserva-movil»; borde 2 px, radio 10, etiquetas mono
 * ink-500 y cifras en Archivo 112 % con digit-roll), con estados de
 * borrador (borde discontinuo), conflicto (warning) y reserva hecha (tira
 * verde y check). El MarcadorModule del kit reparte las celdas a partes
 * iguales y no admite estos estados.
 */
export const SlotCard: React.FC<{
  frame: number;
  g: CardGeo;
  values: [CellValue, CellValue, CellValue];
  /** Color del borde continuo (tinta, warning…). */
  ink: string;
  /** Color del borde discontinuo (por defecto, el mismo): se funden sin mezclar tonos. */
  dashInk?: string;
  /** 0 = borde continuo, 1 = discontinuo (borrador). */
  dashed?: number;
  /** 0→1: tira verde de reserva hecha (crece desde el centro). */
  strip?: number;
  /** Check en la celda HORA: aparición del círculo y dibujo del trazo. */
  check?: {circle: number; draw: number};
  /** 0→1: tinte warning de la celda PISTA. */
  pistaTint?: number;
  /** 0→1: chevron de selector junto al valor PISTA (solo en borrador). */
  chevron?: number;
  /** Escala de pulsación de la celda PISTA. */
  pistaScale?: number;
  /** 0→1: anillo de foco dentro de la celda PISTA. */
  focus?: number;
  footer?: {initials: string; name: string; meta?: string};
  surface?: string;
  footerBg?: string;
  style?: React.CSSProperties;
}> = ({
  frame,
  g,
  values,
  ink,
  dashInk,
  dashed = 0,
  strip = 0,
  check,
  pistaTint = 0,
  chevron = 0,
  pistaScale = 1,
  focus = 0,
  footer,
  surface = color.surfaceRaised,
  footerBg = color.sand50,
  style,
}) => {
  const h = cardHeight(g);
  const checkSize = Math.round(g.labelSize * 1.5);
  return (
    <div
      style={{
        position: "relative",
        width: g.w,
        height: h,
        borderRadius: radius.module,
        background: surface,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Celdas */}
      <div style={{position: "absolute", left: 2, top: 2, display: "flex", height: g.cellH}}>
        {values.map((v, i) => {
          const isPista = i === 0;
          return (
            <div
              key={LABELS[i]}
              style={{
                position: "relative",
                width: g.cols[i],
                height: g.cellH,
              }}
            >
              {isPista && pistaTint > 0 ? (
                <div style={{position: "absolute", inset: 0, background: color.warningBg, opacity: pistaTint}} />
              ) : null}
              <div
                style={{
                  position: "absolute",
                  left: i === 0 ? 0 : 2,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  padding: `${g.padTop}px ${g.padX}px ${g.padBottom}px ${g.padX + (i === 0 ? g.stripW : 0)}px`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: isPista ? `scale(${pistaScale})` : undefined,
                  transformOrigin: "40% 60%",
                }}
              >
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", height: checkSize, marginTop: -(checkSize - g.labelSize) / 2}}>
                  <span style={{...monoStyle(600), fontSize: g.labelSize, lineHeight: 1, letterSpacing: "0.14em", color: color.ink500}}>
                    {LABELS[i]}
                  </span>
                  {i === 2 && check && check.circle > 0 ? <CheckDot size={checkSize} circle={check.circle} draw={check.draw} /> : null}
                </div>
                <div style={{display: "flex", alignItems: "flex-end", gap: Math.round(g.valueSize * 0.14)}}>
                  <span style={{...displayStyle(800), fontSize: g.valueSize, lineHeight: 0.74, color: color.ink900, whiteSpace: "nowrap"}}>
                    <DigitRoll
                      frame={frame}
                      keys={v.keys}
                      initial={v.initial ?? ""}
                      duration={v.duration ?? 6}
                      stagger={1}
                      alignRight={false}
                    />
                  </span>
                  {isPista && chevron > 0 ? (
                    <ChevronDown
                      size={Math.round(g.valueSize * 0.4)}
                      strokeWidth={2.5}
                      color={color.ink500}
                      style={{opacity: chevron, marginBottom: Math.round(g.valueSize * 0.08)}}
                    />
                  ) : null}
                </div>
              </div>
              {isPista && focus > 0 ? (
                <div
                  style={{
                    position: "absolute",
                    left: 8 + g.stripW,
                    top: 8,
                    right: 8,
                    bottom: 8,
                    borderRadius: radius.control,
                    border: `2px solid ${color.ink900}`,
                    opacity: focus,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      {/* Fila de total */}
      {g.footerH && footer ? (
        <div
          style={{
            position: "absolute",
            left: 2,
            top: 2 + g.cellH + 2,
            width: g.w - 4,
            height: g.footerH,
            background: footerBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
            padding: `0 ${g.padX}px 0 ${g.padX + g.stripW}px`,
          }}
        >
          <div style={{display: "flex", alignItems: "center", gap: 16}}>
            <div
              style={{
                width: g.avatar,
                height: g.avatar,
                borderRadius: "50%",
                background: color.greenTint,
                color: color.green700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...textStyle(700),
                fontSize: Math.round((g.avatar ?? 40) * 0.4),
                letterSpacing: "0.02em",
              }}
            >
              {footer.initials}
            </div>
            <span style={{...textStyle(600), fontSize: g.footerFont, lineHeight: 1, color: color.ink900, whiteSpace: "nowrap"}}>{footer.name}</span>
          </div>
          {footer.meta ? <span style={{...monoStyle(500), fontSize: 18, letterSpacing: "0.1em", color: color.ink500}}>{footer.meta}</span> : null}
        </div>
      ) : null}
      {/* Tira verde de reserva hecha */}
      {strip > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 2,
            top: 2,
            width: g.stripW,
            height: h - 4,
            background: color.green600,
            transform: `scaleY(${strip})`,
          }}
        />
      ) : null}
      {/* Borde: continuo y discontinuo se funden */}
      <Frame g={g} h={h} ink={ink} opacity={1 - dashed} />
      <Frame g={g} h={h} ink={dashInk ?? ink} dash="12 8" opacity={dashed} />
    </div>
  );
};

/** Pulso de celebrate: contorno verde que crece unos px y se desvanece (12 f). */
export const CelebrateRing: React.FC<{frame: number; at: number; w: number; h: number; spread?: number}> = ({frame, at, w, h, spread = 14}) => {
  const p = progress(frame, at, 12, ease.out);
  if (p <= 0 || p >= 1) return null;
  const s = spread * p;
  return (
    <div
      style={{
        position: "absolute",
        left: -s,
        top: -s,
        width: w + 2 * s,
        height: h + 2 * s,
        boxSizing: "border-box",
        borderRadius: radius.module + s,
        border: `2px solid ${color.green400}`,
        opacity: 0.8 * (1 - p),
        pointerEvents: "none",
      }}
    />
  );
};

// ─── Cursor con anillo de clic fijo ───────────────────────────────────────

/**
 * Flecha tinta de 28 px que reutiliza la trayectoria del Cursor del kit, pero
 * deja el anillo de clic (tinta al 20 %) en el punto pulsado: el del kit
 * viaja pegado a la flecha cuando esta se aparta.
 */
export const ClickCursor: React.FC<{frame: number; keys: CursorKey[]; size?: number; opacity?: number}> = ({
  frame,
  keys,
  size = 28,
  opacity = 1,
}) => {
  const {x, y} = cursorPosition(frame, keys);
  let press = 0;
  const rings: React.ReactNode[] = [];
  keys.forEach((k, i) => {
    if (!k.click) return;
    const d = frame - k.at;
    if (d >= 0 && d < 8) press = Math.max(press, d < 3 ? d / 3 : 1 - (d - 3) / 5);
    // Anillo corto (10 f): no sobrevive a lo que se pulsó (p. ej. el menú que se cierra).
    if (d >= 0 && d < 10) {
      const p = ease.out(d / 10);
      const r = 10 + 26 * p;
      rings.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: k.x - r,
            top: k.y - r,
            width: 2 * r,
            height: 2 * r,
            borderRadius: "50%",
            boxSizing: "border-box",
            border: `2px solid rgba(28, 26, 23, ${0.35 * (1 - p)})`,
            background: `rgba(28, 26, 23, ${0.1 * (1 - p)})`,
          }}
        />,
      );
    }
  });
  return (
    <div style={{position: "absolute", inset: 0, pointerEvents: "none", opacity}}>
      {rings}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: x - (4.5 / 24) * size,
          top: y - (2.8 / 24) * size,
          transform: `scale(${1 - press * 0.12})`,
          transformOrigin: "19% 12%",
          filter: "drop-shadow(0 3px 5px rgba(20,18,15,0.3))",
        }}
      >
        <path
          d="M4.5 2.8 L4.5 19.6 L8.9 15.6 L11.7 21.6 L14.6 20.3 L11.9 14.4 L17.9 14.4 Z"
          fill={color.ink900}
          stroke={color.sand50}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
