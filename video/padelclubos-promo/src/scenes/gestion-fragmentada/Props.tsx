import React from "react";
import {ChevronLeft, Users} from "lucide-react";
import {color, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";

// ---------------------------------------------------------------- móvil del chat

/**
 * El móvil del chat de «mensajes-a-deshora» a 0,6× (360×780 → 216×468), con
 * líneas de 2 px reales (no escaladas). A este tamaño ningún texto llegaría a
 * 16 px efectivos, así que la pantalla es solo esqueleto: la cifra que se lee
 * es el badge «38».
 */
export const PHONE_S = {w: 216, h: 468, bezel: 8, r: 40} as const;
const SCR = {w: PHONE_S.w - PHONE_S.bezel * 2, h: PHONE_S.h - PHONE_S.bezel * 2, r: PHONE_S.r - PHONE_S.bezel} as const;

const Bar: React.FC<{w: number; h?: number; o?: number}> = ({w, h = 8, o = 1}) => (
  <div style={{width: w, height: h, borderRadius: h / 2, background: color.darkBorder, opacity: o}} />
);

// Burbujas esqueleto del grupo (ancho de burbuja, barras).
const BUBBLES: {w: number; bars: number[]}[] = [
  {w: 118, bars: [92, 60]},
  {w: 92, bars: [66]},
  {w: 132, bars: [104, 72]},
  {w: 84, bars: [58]},
  {w: 124, bars: [96, 54]},
  {w: 104, bars: [78]},
  {w: 128, bars: [100, 66]},
];

export const SmallPhone: React.FC<{badge: React.ReactNode}> = ({badge}) => (
  <div style={{position: "relative", width: PHONE_S.w, height: PHONE_S.h}}>
    {/* Botones laterales */}
    {[
      {side: "left", top: 90, h: 22},
      {side: "left", top: 124, h: 38},
      {side: "right", top: 142, h: 58},
    ].map((b, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: b.top,
          [b.side]: -3,
          width: 5,
          height: b.h,
          borderRadius: 3,
          background: color.darkRaised,
          boxShadow: `inset 0 0 0 2px ${color.darkBorder}`,
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: PHONE_S.r,
        background: color.darkRaised,
        boxShadow: `inset 0 0 0 2px ${color.darkBorder}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: PHONE_S.bezel,
        top: PHONE_S.bezel,
        width: SCR.w,
        height: SCR.h,
        borderRadius: SCR.r,
        overflow: "hidden",
        background: color.darkSurface,
      }}
    >
      {/* Cabecera del grupo */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 0,
          right: 0,
          height: 42,
          boxSizing: "border-box",
          background: color.darkRaised,
          borderBottom: `2px solid ${color.darkBorder}`,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 8px 0 2px",
        }}
      >
        <ChevronLeft size={18} color={color.sand400} strokeWidth={2.4} />
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            background: color.darkBorder,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Users size={14} color={color.sand400} strokeWidth={2.4} />
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 5, marginLeft: 2}}>
          <Bar w={92} h={8} o={1} />
          <Bar w={58} h={6} o={0.7} />
        </div>
      </div>
      {/* Mensajes esqueleto */}
      <div style={{position: "absolute", top: 78, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 8}}>
        {BUBBLES.map((b, i) => (
          <div key={i} style={{display: "flex", gap: 6, paddingLeft: 7, alignItems: "flex-start"}}>
            <div style={{width: 20, height: 20, borderRadius: 10, background: color.darkBorder, flexShrink: 0}} />
            <div
              style={{
                width: b.w,
                boxSizing: "border-box",
                padding: "9px 10px",
                borderRadius: "4px 12px 12px 12px",
                background: color.darkRaised,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {b.bars.map((w, k) => (
                <Bar key={k} w={w} h={7} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Barra de escritura */}
      <div
        style={{
          position: "absolute",
          left: 8,
          right: 38,
          bottom: 16,
          height: 26,
          borderRadius: 13,
          background: color.darkRaised,
          boxShadow: `inset 0 0 0 2px ${color.darkBorder}`,
        }}
      />
      <div style={{position: "absolute", right: 8, bottom: 16, width: 26, height: 26, borderRadius: 13, background: color.darkRaised}} />
      {/* Isla e indicador de inicio */}
      <div style={{position: "absolute", top: 7, left: "50%", width: 58, height: 17, marginLeft: -29, borderRadius: 9, background: color.darkBg}} />
      <div
        style={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          width: 72,
          height: 4,
          marginLeft: -36,
          borderRadius: 2,
          background: color.darkText,
          opacity: 0.6,
        }}
      />
    </div>
    {badge}
  </div>
);

/** Badge de no leídos: píldora #E08A7A con la cifra en tinta. */
export const UnreadBadge: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: "absolute",
      height: 64,
      minWidth: 64,
      boxSizing: "border-box",
      padding: "0 14px",
      borderRadius: radius.pill,
      background: color.painRed,
      boxShadow: `0 0 0 5px ${color.darkBg}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...displayStyle(800),
      fontSize: 32,
      lineHeight: 1,
      color: color.darkBg,
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------- módulos caídos

/**
 * Los dos módulos en conflicto de «dobles-reservas», ya caídos en el montón:
 * misma anatomía (borde 2 px #E08A7A, trama diagonal, PISTA · FECHA · HORA),
 * a 0,56× pero con líneas de 2 px y etiquetas de 16 px.
 */
const K = 0.56;
const COLS = [212, 388, 440].map((c) => Math.round(c * K));
export const MODULE_S = {w: COLS[0] + COLS[1] + COLS[2] + 4, h: Math.round(216 * K) + Math.round(80 * K) + 6} as const;
const CELL_H = Math.round(216 * K);
const ROW_H = Math.round(80 * K);
const CELLS = [
  {label: "PISTA", value: "1"},
  {label: "FECHA", value: "MAR"},
  {label: "HORA", value: "19:00"},
];

const Hatch: React.FC<{width: number; height: number}> = ({width, height}) => {
  const dx = 12 * Math.SQRT2;
  const xs: number[] = [];
  for (let x = -height; x < width + dx; x += dx) xs.push(x);
  return (
    <svg width={width} height={height} style={{position: "absolute", left: 0, top: 0}}>
      {xs.map((x) => (
        <line key={x} x1={x} y1={height} x2={x + height} y2={0} stroke={color.painRed} strokeOpacity={0.35} strokeWidth={2} />
      ))}
    </svg>
  );
};

export const FallenModule: React.FC<{who: string}> = ({who}) => {
  const inner = COLS[0] + COLS[1] + COLS[2];
  return (
    <div
      style={{
        position: "relative",
        width: MODULE_S.w,
        boxSizing: "border-box",
        border: `2px solid ${color.painRed}`,
        borderRadius: radius.module,
        background: color.darkSurface,
        overflow: "hidden",
      }}
    >
      <div style={{position: "relative", display: "flex", height: CELL_H}}>
        <Hatch width={inner} height={CELL_H} />
        {CELLS.map((c, i) => (
          <div
            key={c.label}
            style={{
              position: "relative",
              width: COLS[i],
              boxSizing: "border-box",
              borderLeft: i === 0 ? "none" : `2px solid ${color.painRed}`,
              padding: "16px 18px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                ...monoStyle(600),
                alignSelf: "flex-start",
                fontSize: 16,
                lineHeight: 1,
                letterSpacing: "0.14em",
                color: color.ink400,
                background: color.darkSurface,
                padding: "4px 6px",
                margin: "-4px -6px",
              }}
            >
              {c.label}
            </span>
            <span style={{...displayStyle(800), fontSize: 64, lineHeight: 0.74, color: color.darkText, whiteSpace: "nowrap"}}>{c.value}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          height: ROW_H,
          boxSizing: "border-box",
          borderTop: `2px solid ${color.painRed}`,
          background: color.darkRaised,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          ...textStyle(600),
          fontSize: 20,
          color: color.darkText,
          whiteSpace: "nowrap",
        }}
      >
        {who}
      </div>
    </div>
  );
};
