import React from "react";
import {interpolateColors} from "remotion";
import {color, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";
import {DigitRoll} from "../../components";
import {BEAT, ease, pressScale, progress} from "../../lib/anim";
import {DATA, MINI_GRID, type ExtraTile, type MainTile} from "./data";

/** Módulo marcador del tablero: 408×192 (extras 408×160), borde 2 px tinta, radio 10. */
export const TILE = {w: 408, h: 192, extraH: 160, border: 2, padX: 22, padY: 18} as const;

const HATCH_FREE = color.sand400;

/** Mini-rejilla de la landing: sólido = reservada, tinte = clase, discontinuo = libre. */
const MiniGrid: React.FC<{frame: number; at: number}> = ({frame, at}) => {
  const cw = 28;
  const ch = 14;
  const gap = 6;
  return (
    <div style={{position: "relative", width: cw * 4 + gap * 3, height: ch * 4 + gap * 3}}>
      {MINI_GRID.map((row, r) =>
        row.map((s, c) => {
          // Se llena por franjas, de izquierda a derecha.
          const p = progress(frame, at + r * 2 + c, 6, ease.out);
          const x = c * (cw + gap);
          const y = r * (ch + gap);
          if (s === "l") {
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: cw,
                  height: ch,
                  borderRadius: 3,
                  border: `2px dashed ${HATCH_FREE}`,
                  boxSizing: "border-box",
                }}
              />
            );
          }
          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: cw,
                height: ch,
                borderRadius: 3,
                background: s === "r" ? color.green600 : "rgba(111, 191, 156, 0.35)",
                clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round 3px)`,
              }}
            />
          );
        }),
      )}
    </div>
  );
};

/** Mini-barras de ocupación por pista (media 87 %). */
const MiniBars: React.FC<{frame: number; at: number}> = ({frame, at}) => {
  const bw = 16;
  const gap = 10;
  const h = 74;
  const w = bw * 4 + gap * 3;
  return (
    <div style={{position: "relative", width: w, height: h}}>
      {DATA.ocupacionPistas.map((v, i) => {
        const p = progress(frame, at + i * 2, 10, ease.out);
        const bh = (h * v) / 100;
        return (
          <React.Fragment key={i}>
            <div
              style={{position: "absolute", left: i * (bw + gap), bottom: 0, width: bw, height: h, borderRadius: 3, background: color.sand200}}
            />
            <div
              style={{
                position: "absolute",
                left: i * (bw + gap),
                bottom: 0,
                width: bw,
                height: bh * p,
                borderRadius: 3,
                background: color.green600,
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Punto verde «en directo»: late en cada tiempo, como en «ligas-en-directo». */
const LiveDot: React.FC<{frame: number; from: number}> = ({frame, from}) => {
  // Late en cada tiempo del compás (múltiplos de 15 f), no desde su entrada.
  const k = frame < from ? -1 : ((frame % BEAT) + BEAT) % BEAT;
  const p = k < 0 ? 1 : Math.min(1, k / 12);
  return (
    <span style={{position: "relative", width: 14, height: 14, flexShrink: 0, display: "inline-block"}}>
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px solid ${color.green400}`,
          transform: `scale(${1 + p * 1.1})`,
          opacity: (1 - p) * 0.7,
        }}
      />
      <span style={{position: "absolute", inset: 0, borderRadius: "50%", background: color.green400}} />
    </span>
  );
};

/** Contenido de una casilla (sin marco): número, nombre, icono o mini-gráfico y dato vivo. */
export const TileBody: React.FC<{tile: MainTile; frame: number; enterAt: number; rolled?: boolean}> = ({
  tile,
  frame,
  enterAt,
  rolled = false,
}) => {
  const Icon = tile.icon;
  const rollAt = enterAt + 2;
  const d = tile.data;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <span
        style={{
          position: "absolute",
          left: TILE.padX,
          top: TILE.padY,
          ...monoStyle(500),
          fontSize: 22,
          lineHeight: 1,
          letterSpacing: "0.06em",
          color: color.ink500,
        }}
      >
        {tile.n}
      </span>
      <span
        style={{
          position: "absolute",
          left: TILE.padX,
          top: 52,
          ...displayStyle(700),
          fontSize: 30,
          lineHeight: 1,
          letterSpacing: "0.005em",
          textTransform: "uppercase",
          color: color.ink900,
          whiteSpace: "nowrap",
        }}
      >
        {tile.name}
      </span>
      <div style={{position: "absolute", right: TILE.padX, top: TILE.padY}}>
        {tile.viz === "grid" ? <MiniGrid frame={frame} at={enterAt + 3} /> : null}
        {tile.viz === "bars" ? <MiniBars frame={frame} at={enterAt + 3} /> : null}
        {Icon ? <Icon size={26} color={color.ink400} strokeWidth={2} style={{display: "block", marginTop: -2}} /> : null}
      </div>
      <div
        style={{
          position: "absolute",
          left: TILE.padX,
          right: TILE.padX,
          bottom: TILE.padY,
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          whiteSpace: "nowrap",
        }}
      >
        {d.kind === "number" ? (
          <>
            {d.pre ? <span style={{...textStyle(600), fontSize: 22, color: color.ink500}}>{d.pre}</span> : null}
            <span style={{...displayStyle(800), fontSize: 56, lineHeight: 1, color: color.green600}}>
              {rolled ? d.value : <DigitRoll frame={frame} keys={[{at: rollAt, value: d.value}]} />}
            </span>
            {d.post ? <span style={{...textStyle(600), fontSize: 22, color: color.ink500}}>{d.post}</span> : null}
          </>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              ...displayStyle(800),
              fontSize: 30,
              lineHeight: 1.1,
              // Misma línea base que las cifras de 56 px.
              marginBottom: 3,
              color: color.green600,
              opacity: progress(frame, rollAt, 6, ease.out),
              transform: `translateY(${(1 - progress(frame, rollAt, 6, ease.out)) * 4}px)`,
            }}
          >
            {d.live ? <LiveDot frame={frame} from={rollAt} /> : null}
            {d.value}
          </span>
        )}
      </div>
    </div>
  );
};

/** Marco del módulo marcador (fondo arena 50, borde 2 px tinta, radio 10). */
export const tileFrame: React.CSSProperties = {
  position: "absolute",
  boxSizing: "border-box",
  width: TILE.w,
  height: TILE.h,
  background: color.sand50,
  border: `${TILE.border}px solid ${color.ink900}`,
  borderRadius: radius.module,
  overflow: "hidden",
};

/** Interruptor estándar del producto: apagado arena con el pomo a la izquierda; encendido verde con el pomo a la derecha. */
export const SWITCH = {w: 56, h: 32, knob: 24, inset: 4} as const;

const Switch: React.FC<{on: number; hover: number; press: number}> = ({on, hover, press}) => {
  const off = interpolateColors(hover, [0, 1], [color.sand300, color.sand400]);
  const track = interpolateColors(on, [0, 1], [off, color.green600]);
  const travel = SWITCH.w - SWITCH.knob - SWITCH.inset * 2;
  return (
    <div
      style={{
        position: "relative",
        width: SWITCH.w,
        height: SWITCH.h,
        borderRadius: radius.pill,
        background: track,
        transform: `scale(${press})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: SWITCH.inset + travel * on,
          top: SWITCH.inset,
          width: SWITCH.knob,
          height: SWITCH.knob,
          borderRadius: "50%",
          background: color.surfaceRaised,
          boxShadow: "0 1px 3px rgba(28,26,23,0.25)",
        }}
      />
    </div>
  );
};

/**
 * Casilla de extra: discontinua y apagada hasta que se activa (entonces pasa
 * a módulo sólido, como una franja libre que se reserva). VeriFactu no tiene
 * interruptor: su chip «Incluido» la activa.
 */
export const ExtraTileView: React.FC<{
  tile: ExtraTile;
  frame: number;
  /** Frame de activación (interruptor o chip). */
  onAt?: number;
  /** 0→1: el cursor está encima. */
  hover?: number;
}> = ({tile, frame, onAt, hover = 0}) => {
  const on = onAt === undefined ? 0 : progress(frame, onAt, 7, ease.overlay);
  const solid = onAt === undefined ? 0 : progress(frame, onAt, 5, ease.out);
  const press = onAt === undefined ? 1 : pressScale(frame, onAt);
  const dashed = interpolateColors(hover, [0, 1], [color.sand400, color.ink400]);
  const nameColor = interpolateColors(solid, [0, 1], [color.ink500, color.ink900]);
  const chipP = tile.toggle || onAt === undefined ? 0 : progress(frame, onAt, 4, ease.out);
  return (
    <div
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: TILE.w,
        height: TILE.extraH,
        borderRadius: radius.module,
        border: `${TILE.border}px dashed ${dashed}`,
      }}
    >
      {/* Módulo activo: fondo arena y borde sólido de tinta. */}
      <div
        style={{
          position: "absolute",
          inset: -TILE.border,
          borderRadius: radius.module,
          border: `${TILE.border}px solid ${color.ink900}`,
          background: color.sand50,
          opacity: solid,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: TILE.padX,
          top: 42,
          ...displayStyle(700),
          fontSize: 30,
          lineHeight: 1,
          textTransform: "uppercase",
          color: nameColor,
          whiteSpace: "nowrap",
        }}
      >
        {tile.name}
      </div>
      {tile.sub ? (
        <div
          style={{
            position: "absolute",
            left: TILE.padX,
            top: 86,
            ...textStyle(500),
            fontSize: 22,
            lineHeight: 1.2,
            color: color.ink500,
            whiteSpace: "nowrap",
          }}
        >
          {tile.sub}
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: TILE.padX,
            top: 84,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "3px 12px 3px 10px",
            borderRadius: radius.control,
            background: color.successBg,
            border: `2px solid ${color.successBorder}`,
            color: color.success,
            ...textStyle(700),
            fontSize: 20,
            lineHeight: 1.2,
            opacity: chipP,
            transform: `scale(${0.96 + 0.04 * chipP})`,
            transformOrigin: "0 50%",
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5 L10 17.5 L19 7.5"
              stroke={color.success}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={22}
              strokeDashoffset={22 * (1 - progress(frame, (onAt ?? 0) + 2, 8, ease.out))}
            />
          </svg>
          Incluido
        </div>
      )}
      {tile.toggle ? (
        <div style={{position: "absolute", right: TILE.padX, top: (TILE.extraH - TILE.border * 2 - SWITCH.h) / 2}}>
          <Switch on={on} hover={hover} press={press} />
        </div>
      ) : null}
    </div>
  );
};
