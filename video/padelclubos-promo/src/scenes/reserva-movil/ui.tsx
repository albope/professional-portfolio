import React from "react";
import {interpolateColors} from "remotion";
import {color, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";
import {CourtLines, DigitRoll} from "../../components";
import {clamp01, ease, progress} from "../../lib/anim";
import {RESERVA} from "./data";

/**
 * Reloj del día en su versión clara (storyboard L06: píldora #E7E2D8, texto
 * tinta). El DayClock del kit solo tiene la variante tinta sobre claro.
 */
export const LightClock: React.FC<{frame: number; rollAt: number; enterAt?: number}> = ({frame, rollAt, enterAt = 0}) => {
  const p = progress(frame, enterAt, 6, ease.out);
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
        background: color.sand200,
        border: `2px solid ${color.sand300}`,
        ...monoStyle(500),
        fontSize: 28,
        lineHeight: 1.15,
        letterSpacing: "0.04em",
        color: color.ink500,
        opacity: p,
        transform: `translateY(${(1 - p) * 4}px)`,
        zIndex: 50,
      }}
    >
      <span>MAR</span>
      <span style={{opacity: 0.6}}>·</span>
      <DigitRoll frame={frame} keys={[{at: rollAt, value: "08:15"}]} initial="01:12" style={{color: color.ink900, fontWeight: 600}} />
    </div>
  );
};

/** Toque (press 120 ms): 1 → 0,97 → 1 sin rebote. */
export const press = (frame: number, at: number, depth = 0.03) => {
  const d = frame - at;
  if (d < 0 || d > 8) return 1;
  return 1 - depth * (d < 4 ? d / 4 : 1 - (d - 4) / 4);
};

/** Alto exacto del módulo (para calcular vuelos y maquetas sin medir el DOM). */
export const marcadorSize = (valueSize: number, labelSize: number, footerH = 0, line = 2) => {
  const padT = Math.round(valueSize * 0.3);
  const gap = Math.round(valueSize * 0.12);
  const cellH = padT + Math.round(labelSize * 1.25) + gap + Math.round(valueSize * 1.04) + padT;
  return {cellH, height: line + cellH + (footerH ? line + footerH : 0) + line, padT, gap};
};

/**
 * Módulo marcador de la reserva (PISTA | FECHA | HORA) con el aspecto del kit
 * (borde 2 px tinta, radio 10, etiquetas mono, cifras Archivo 112 % con
 * digit-roll), pero con columnas de ancho propio, tira verde de «reserva
 * hecha» y check: el MarcadorModule del kit reparte las celdas a partes
 * iguales y no cabe «20:30» a 96 px en vertical.
 */
export const Marcador: React.FC<{
  frame: number;
  /** Frame en que ruedan las cifras (celda i en start + i·cellStagger). */
  start: number;
  cellStagger?: number;
  width: number;
  valueSize: number;
  labelSize: number;
  cols: [number, number, number];
  /** 0→1: tira verde a la izquierda (reserva hecha). */
  strip?: number;
  stripW?: number;
  /** 0→1: check verde en la celda HORA. */
  check?: number;
  footer?: React.ReactNode;
  footerH?: number;
  surface?: string;
  /** Grosor de borde y separadores (2 px en 16:9; 3 px en vertical, con cifras de 96 px). */
  line?: number;
  style?: React.CSSProperties;
}> = ({frame, start, cellStagger = 2, width, valueSize, labelSize, cols, strip = 0, stripW = 4, check = 0, footer, footerH = 0, surface = color.surfaceRaised, line = 2, style}) => {
  const {cellH, padT, gap} = marcadorSize(valueSize, labelSize, footer ? footerH : 0, line);
  const padX = Math.round(valueSize * 0.32);
  const total = cols[0] + cols[1] + cols[2];
  const checkSize = Math.round(labelSize * 1.25);
  return (
    <div
      style={{
        position: "relative",
        width,
        border: `${line}px solid ${color.ink900}`,
        borderRadius: radius.module,
        background: surface,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{display: "flex", height: cellH}}>
        {RESERVA.map((c, i) => (
          <div
            key={c.label}
            style={{
              width: `${(cols[i] / total) * 100}%`,
              padding: `${padT}px ${padX}px 0 ${padX + (i === 0 ? stripW : 0)}px`,
              borderLeft: i === 0 ? "none" : `${line}px solid ${color.ink900}`,
              display: "flex",
              flexDirection: "column",
              gap,
              minWidth: 0,
              position: "relative",
            }}
          >
            <span
              style={{
                ...monoStyle(600),
                fontSize: labelSize,
                lineHeight: 1.25,
                height: Math.round(labelSize * 1.25),
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: color.ink400,
              }}
            >
              {c.label}
            </span>
            <span
              style={{
                ...displayStyle(800),
                fontSize: valueSize,
                lineHeight: 1.04,
                height: Math.round(valueSize * 1.04),
                color: color.ink900,
                whiteSpace: "nowrap",
              }}
            >
              <DigitRoll frame={frame} keys={[{at: start + i * cellStagger, value: c.value}]} alignRight={false} stagger={1} />
            </span>
            {i === 2 && check > 0 ? (
              <div
                style={{
                  position: "absolute",
                  right: padX - 2,
                  top: padT - 2,
                  width: checkSize,
                  height: checkSize,
                  borderRadius: "50%",
                  background: color.green600,
                  opacity: clamp01(check * 3),
                  transform: `scale(${0.96 + 0.04 * clamp01(check * 2)})`,
                }}
              >
                <CheckStroke p={clamp01(check * 1.4 - 0.25)} size={checkSize} stroke={color.sand50} width={Math.max(2, checkSize / 9)} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {footer ? (
        <div
          style={{
            height: footerH,
            borderTop: `${line}px solid ${color.ink900}`,
            background: color.sand50,
            display: "flex",
            alignItems: "center",
            padding: `0 ${padX}px 0 ${padX + stripW}px`,
          }}
        >
          {footer}
        </div>
      ) : null}
      {strip > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: stripW,
            background: color.green600,
            transform: `scaleY(${strip})`,
            transformOrigin: "top",
          }}
        />
      ) : null}
    </div>
  );
};

/** Check que se dibuja (stroke-dashoffset). */
export const CheckStroke: React.FC<{p: number; size: number; stroke: string; width?: number; style?: React.CSSProperties}> = ({
  p,
  size,
  stroke,
  width = 2.5,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: "block", overflow: "visible", ...style}}>
    <path
      d="M6.2 12.6 L10.3 16.6 L18 8.2"
      fill="none"
      stroke={stroke}
      strokeWidth={(width * 24) / size}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - clamp01(p)}
      opacity={p > 0 ? 1 : 0}
    />
  </svg>
);

/** Rectángulo de borde discontinuo nítido (SVG): franja libre. */
export const DashedRect: React.FC<{w: number; h: number; r: number; stroke?: string; sw?: number; dash?: string; opacity?: number}> = ({
  w,
  h,
  r,
  stroke = color.sand400,
  sw = 2,
  dash = "6 5",
  opacity = 1,
}) => (
  <svg width={w} height={h} style={{position: "absolute", left: 0, top: 0, overflow: "visible", opacity}}>
    <rect x={sw / 2} y={sw / 2} width={w - sw} height={h - sw} rx={Math.max(0, r - sw / 2)} fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />
  </svg>
);

/**
 * Anillo de toque (tinta al 20 %): el dedo se acerca 5 f antes, pulsa y
 * deja un anillo que se abre y se desvanece.
 */
export const TapRing: React.FC<{frame: number; at: number; x: number; y: number; size: number}> = ({frame, at, x, y, size}) => {
  const d = frame - at;
  if (d < -5 || d > 16) return null;
  const pre = clamp01((d + 5) / 5);
  const disc = d < 0 ? 0.2 * ease.out(pre) : 0.2 * (1 - progress(frame, at + 2, 8, ease.out));
  const discScale = d < 0 ? 1.12 - 0.12 * ease.out(pre) : 0.97 + 0.03 * progress(frame, at, 4, ease.out);
  const ring = progress(frame, at, 14, ease.out);
  return (
    <div style={{position: "absolute", left: x, top: y, width: 0, height: 0, zIndex: 60, pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color.ink900,
          opacity: disc,
          transform: `scale(${discScale})`,
        }}
      />
      {d >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: -size / 2,
            top: -size / 2,
            width: size,
            height: size,
            borderRadius: "50%",
            border: `2px solid ${color.ink900}`,
            opacity: 0.35 * (1 - ring),
            transform: `scale(${1 + 0.55 * ring})`,
          }}
        />
      ) : null}
    </div>
  );
};

/** Botón «Confirmar reserva» → «Reserva confirmada» con celebrate de 12 f. */
export const ConfirmButton: React.FC<{
  frame: number;
  at: number;
  width: number;
  height: number;
  fontSize: number;
  r: number;
}> = ({frame, at, width, height, fontSize, r}) => {
  const bgP = progress(frame, at, 6, ease.out);
  const bg = interpolateColors(bgP, [0, 1], [color.primary, color.success]);
  const oldP = progress(frame, at, 4, ease.in);
  const newP = progress(frame, at + 3, 6, ease.out);
  const checkP = progress(frame, at + 3, 8, ease.out);
  const ring = progress(frame, at, 12, ease.out);
  const iconSize = Math.round(fontSize * 1.25);
  const label: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: Math.round(fontSize * 0.45),
    ...textStyle(700),
    fontSize,
    color: color.onPrimary,
    whiteSpace: "nowrap",
  };
  return (
    <div style={{position: "relative", width, height}}>
      {/* Anillo del celebrate: crece un 15 % del alto por igual en todo el
          contorno (un scale 1,15 deformaría el halo en botones anchos) */}
      {frame >= at && ring < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: -0.15 * height * ring,
            borderRadius: r + 0.15 * height * ring,
            border: `${Math.max(2, Math.round(height / 40))}px solid ${color.success}`,
            opacity: 0.8 * (1 - ring),
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          background: bg,
          boxShadow: "0 6px 16px -8px rgba(21,121,85,0.6)",
          transform: `scale(${press(frame, at)})`,
          overflow: "hidden",
        }}
      >
        <div style={{...label, opacity: 1 - oldP, transform: `translateY(${-oldP * 4}px)`}}>Confirmar reserva</div>
        <div style={{...label, opacity: newP, transform: `translateY(${(1 - newP) * 4}px)`}}>
          <CheckStroke p={checkP} size={iconSize} stroke={color.onPrimary} width={Math.max(2.5, fontSize / 7)} />
          Reserva confirmada
        </div>
      </div>
    </div>
  );
};

/**
 * Avatar del club: cuadrado tinta con una pista dibujada en arena. En tinta y
 * no en verde: el verde solo significa reservado, confirmado o activo.
 */
export const ClubAvatar: React.FC<{size: number; r?: number}> = ({size, r = Math.round(size * 0.24)}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: r,
      background: color.ink900,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <CourtLines length={size * 0.66} orientation="vertical" stroke={color.sand50} strokeWidth={Math.max(2, size / 28)} />
  </div>
);

/** Iconos de la barra de estado (cobertura, wifi, batería). */
export const StatusIcons: React.FC<{fg: string; scale?: number}> = ({fg, scale = 1}) => (
  <span style={{display: "flex", gap: 6 * scale, alignItems: "center"}}>
    <svg width={18 * scale} height={12 * scale} viewBox="0 0 18 12">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 5} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill={fg} />
      ))}
    </svg>
    <svg width={16 * scale} height={12 * scale} viewBox="0 0 16 12">
      <path d="M8 11.5 L5.6 9 A3.4 3.4 0 0 1 10.4 9 Z" fill={fg} />
      <path d="M3.4 6.8 A6.6 6.6 0 0 1 12.6 6.8" stroke={fg} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M1 4.2 A10 10 0 0 1 15 4.2" stroke={fg} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
    <svg width={27 * scale} height={13 * scale} viewBox="0 0 27 13">
      <rect x="0.75" y="0.75" width="22.5" height="11.5" rx="3.5" stroke={fg} strokeWidth="1.5" fill="none" opacity="0.5" />
      <rect x="2.5" y="2.5" width="15" height="8" rx="2" fill={fg} />
      <rect x="24.5" y="4.5" width="1.8" height="4" rx="0.9" fill={fg} opacity="0.5" />
    </svg>
  </span>
);

/** Texto con separadores « · » con aire propio (el espacio de Instrument Sans es estrecho). */
export const Dotted: React.FC<{text: string; gap?: number}> = ({text, gap = 6}) => (
  <>
    {text.split(" · ").map((part, i) => (
      <React.Fragment key={i}>
        {i > 0 ? <span style={{margin: `0 ${gap}px`, opacity: 0.7}}>·</span> : null}
        {part}
      </React.Fragment>
    ))}
  </>
);
