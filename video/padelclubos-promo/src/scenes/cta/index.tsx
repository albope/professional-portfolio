import React from "react";
import {AbsoluteFill, Easing, interpolateColors, useCurrentFrame} from "remotion";
import {ArrowRight} from "lucide-react";
import {Logo} from "../../brand/Logo";
import {color, demo, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";
import {ease, motion, progress, tween, view} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T, TYPE_STEP} from "./cues";

// ---------------------------------------------------------------- utilidades

/** Press de titular: aparece de golpe en su tiempo y asienta 1,04 → 1. */
const hit = (frame: number, at: number): React.CSSProperties => {
  const p = progress(frame, at, 5, ease.out);
  return {
    display: "inline-block",
    opacity: frame >= at ? 1 : 0,
    transform: `scale(${1.04 - 0.04 * p})`,
  };
};

/** Press de botón: 1 → 0,98 → 1, sin rebote. */
const buttonPress = (frame: number, at: number) => {
  const d = frame - at;
  if (d < 0 || d > 6) return 0;
  return d < 2 ? d / 2 : 1 - ease.out((d - 2) / 4);
};

/**
 * Barrido: el bloque verde cruza de izquierda a derecha en 8 f. Arranca un
 * frame antes del cue para que el «clack» ya vea la primera franja.
 * `trail` es el borde que descubre la tarjeta; `lead`, el delantero.
 */
const SWEEP_EASE = Easing.bezier(0.4, 0, 0.2, 1);
const sweepEdges = (frame: number, at: number, width: number) => {
  const band = width * 0.32;
  const p = progress(frame, at - 1, 8, SWEEP_EASE);
  const x = -band + (width + band) * p;
  return {trail: Math.max(0, x), lead: Math.min(width, x + band), p};
};

// ---------------------------------------------------------------- golpe

/** Titular sobre tinta; su punto final es el bloque del isotipo (variante oscura). */
const Golpe: React.FC<{
  frame: number;
  lines: string[][];
  wordAt: readonly number[];
  dotAt: number;
  size: number;
  lineHeight: number;
  centerY: number;
}> = ({frame, lines, wordAt, dotAt, size, lineHeight, centerY}) => {
  const total = lines.reduce((a, l) => a + l.length, 0);
  let k = 0;
  const dotP = progress(frame, dotAt, 5, ease.out);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: centerY - (lines.length * lineHeight) / 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...displayStyle(800),
        letterSpacing: "-0.02em",
        fontSize: size,
        lineHeight: `${lineHeight}px`,
        color: color.sand50,
      }}
    >
      {lines.map((words, li) => (
        <div key={li} style={{display: "flex", alignItems: "baseline", columnGap: "0.24em", whiteSpace: "nowrap"}}>
          {words.map((w) => {
            const i = k++;
            const last = i === total - 1;
            return (
              <span key={i} style={{display: "inline-block", whiteSpace: "nowrap"}}>
                <span style={hit(frame, wordAt[i])}>{w}</span>
                {last ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: "0.3em",
                      height: `${0.3 * (16 / 13)}em`,
                      borderRadius: `${0.3 * (3 / 13)}em`,
                      marginLeft: "0.07em",
                      background: color.green400,
                      opacity: frame >= dotAt ? 1 : 0,
                      transform: `translateY(${-(1 - dotP) * 0.12}em) scale(${1.04 - 0.04 * dotP})`,
                      transformOrigin: "50% 100%",
                    }}
                  />
                ) : null}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------- lockup

/**
 * Lockup oficial cuyo bloque verde entra en el contorno desde la izquierda
 * (overlay 7 f), como en el drop: el bloque que acaba de cruzar la pantalla
 * se enciende dentro del isotipo. Misma caja y viewBox que <Logo>.
 */
const LockupOn: React.FC<{frame: number; at: number; blockAt: number; height: number}> = ({frame, at, blockAt, height}) => {
  const p = progress(frame, blockAt, motion.overlay, ease.overlay);
  const width = (height * 837) / 110;
  return (
    <div style={{position: "relative", width, height, ...view(frame, at)}}>
      <Logo height={height} isoBlock={0} />
      <svg width={width} height={height} viewBox="0 0 837 110" style={{position: "absolute", left: 0, top: 0}}>
        <defs>
          <clipPath id={`cta-iso-${height}`}>
            <rect x={5.5} y={11.5} width={37} height={25} rx={5.5} />
          </clipPath>
        </defs>
        <g transform="translate(0,13) scale(1.75)">
          <g clipPath={`url(#cta-iso-${height})`}>
            <rect x={10 - (1 - p) * 20} y={16} width={13} height={16} rx={3} fill={color.green600} />
          </g>
        </g>
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- piezas de la tarjeta

/** Check verde que se dibuja (trazo con pathLength normalizado). */
const Check: React.FC<{frame: number; at: number; size: number; round?: boolean}> = ({frame, at, size, round}) => {
  const p = progress(frame, at, 8, ease.out);
  const tile = progress(frame, at - 2, 6, ease.out);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: round ? "50%" : radius.control + 2,
        background: color.greenTint,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        opacity: tile,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40">
        <path
          d="M11.5 20.5 L17.5 26.5 L29 14.5"
          fill="none"
          stroke={color.green600}
          strokeWidth={3.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      </svg>
    </div>
  );
};

/** URL escrita carácter a carácter, con cursor mono. Centrada por su ancho final. */
const TypedUrl: React.FC<{
  frame: number;
  start: number;
  cursorFrom: number;
  cursorOff: number;
  size: number;
}> = ({frame, start, cursorFrom, cursorOff, size}) => {
  const text = demo.url;
  const n = frame < start ? 0 : Math.min(text.length, Math.floor((frame - start) / TYPE_STEP) + 1);
  const cursorOn = frame >= cursorFrom && frame < cursorOff;
  return (
    <div
      style={{
        position: "relative",
        width: `${text.length}ch`,
        ...monoStyle(500),
        fontSize: size,
        lineHeight: 1,
        color: color.darkText,
        whiteSpace: "pre",
      }}
    >
      {text.slice(0, n)}
      {/* Reserva la línea aunque aún no haya texto. */}
      <span style={{opacity: 0}}>{text.slice(n) || " "}</span>
      {cursorOn ? (
        <span
          style={{
            position: "absolute",
            left: `calc(${n}ch + ${Math.round(size * 0.06)}px)`,
            top: "-0.06em",
            width: Math.max(3, Math.round(size * 0.09)),
            height: "1.12em",
            borderRadius: 2,
            background: color.green300,
          }}
        />
      ) : null}
    </div>
  );
};

/** Botón primario con press y anillo de foco (como el producto al pulsar). */
const CtaButton: React.FC<{
  frame: number;
  press: number;
  label: string;
  height: number;
  fontSize: number;
  width?: number;
  padX?: number;
}> = ({frame, press, label, height, fontSize, width, padX = 44}) => {
  const d = buttonPress(frame, press);
  const ring = progress(frame, press, 14, ease.out);
  const ringOn = frame >= press && ring < 1;
  const arrow = tween(frame, [press, press + 10], [0, 1], ease.out);
  return (
    <div style={{position: "relative", display: "inline-flex"}}>
      {ringOn ? (
        <div
          style={{
            position: "absolute",
            inset: -(4 + ring * 8),
            borderRadius: radius.module + 4 + ring * 8,
            border: `2px solid ${color.green400}`,
            opacity: 0.55 * (1 - ring),
          }}
        />
      ) : null}
      <div
        style={{
          height,
          width,
          padding: width ? 0 : `0 ${padX}px`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: Math.round(fontSize * 0.42),
          borderRadius: radius.module,
          background: interpolateColors(d, [0, 1], [color.green600, color.green700]),
          color: color.sand50,
          ...textStyle(600),
          fontSize,
          whiteSpace: "nowrap",
          transform: `scale(${1 - 0.02 * d})`,
          boxShadow: "0 1px 2px rgba(14,92,63,0.2), 0 12px 24px -14px rgba(14,92,63,0.5)",
        }}
      >
        <span>{label}</span>
        <ArrowRight
          size={Math.round(fontSize * 1.02)}
          strokeWidth={2.4}
          style={{transform: `translateX(${Math.sin(arrow * Math.PI) * 6}px)`}}
        />
      </div>
    </div>
  );
};

/**
 * Borde del módulo que se dibuja en dos trazos desde la esquina superior
 * izquierda (arriba y abajo a la vez) hasta la inferior derecha.
 */
const DrawBorder: React.FC<{w: number; h: number; p: number; r?: number; stroke?: string}> = ({
  w,
  h,
  p,
  r = radius.module,
  stroke = color.ink900,
}) => {
  const i = 1;
  const a = r - i;
  const top = `M ${i} ${r} A ${a} ${a} 0 0 1 ${r} ${i} H ${w - r} A ${a} ${a} 0 0 1 ${w - i} ${r} V ${h - r} A ${a} ${a} 0 0 1 ${w - r} ${h - i}`;
  const bottom = `M ${i} ${r} V ${h - r} A ${a} ${a} 0 0 0 ${r} ${h - i} H ${w - r}`;
  return (
    <svg width={w} height={h} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      {[top, bottom].map((d, k) => (
        <path
          key={k}
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------- sello (16:9)

const SEAL = {w: 1296, h: 192, cells: 104, pad: 32} as const;
const SEAL_ITEMS = ["Sin tarjeta de crédito", "Sin permanencia", "Configura en 5 minutos"];

/**
 * Posición x de la punta de cada trazo de DrawBorder para un progreso p:
 * la superficie se pinta detrás del trazo superior y la fila tinta detrás
 * del inferior, así nada aparece fuera del borde ya dibujado.
 */
const penX = (w: number, h: number, r: number, p: number) => {
  const arc = (Math.PI / 2) * (r - 1);
  const hor = w - 2 * r;
  const ver = h - 2 * r;
  const sT = p * (arc * 3 + hor + ver);
  const sB = p * (ver + arc + hor);
  const top = sT <= arc ? r * (sT / arc) : Math.min(w, r + (sT - arc));
  const bottom = sB <= ver ? 0 : sB <= ver + arc ? r * ((sB - ver) / arc) : r + (sB - ver - arc);
  return {top: p >= 1 ? w : top, bottom: p >= 1 ? w : bottom};
};

/** Módulo marcador como sello de confianza: 3 celdas con check y fila de total tinta. */
const Seal: React.FC<{frame: number}> = ({frame}) => {
  const t = T.landscape;
  const border = progress(frame, t.seal, 10, ease.inOut);
  const pen = penX(SEAL.w, SEAL.h, radius.module, border);
  const colW = (SEAL.w - 4) / 3;
  const rowTop = 2 + SEAL.cells;
  const reveal =
    border >= 1
      ? undefined
      : `polygon(0 0, ${pen.top}px 0, ${pen.top}px ${rowTop}px, ${pen.bottom}px ${rowTop}px, ${pen.bottom}px ${SEAL.h}px, 0 ${SEAL.h}px)`;
  return (
    <div style={{position: "relative", width: SEAL.w, height: SEAL.h}}>
      {/* Superficie, fila tinta y separadores: se pintan detrás del trazo */}
      <div style={{position: "absolute", inset: 0, borderRadius: radius.module, overflow: "hidden", opacity: border > 0 ? 1 : 0}}>
        <div style={{position: "absolute", inset: 0, clipPath: reveal}}>
          <div style={{position: "absolute", inset: 0, background: color.surfaceRaised}} />
          <div style={{position: "absolute", left: 0, right: 0, top: rowTop, bottom: 0, background: color.ink900}} />
          {[1, 2].map((k) => (
            <div
              key={k}
              style={{position: "absolute", left: 2 + colW * k - 1, top: 2, width: 2, height: SEAL.cells, background: color.ink900}}
            />
          ))}
        </div>
      </div>
      {/* Celdas */}
      {SEAL_ITEMS.map((label, k) => {
        const at = t.seal + 4 + k * 3;
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: 2 + colW * k,
              width: colW,
              top: 2,
              height: SEAL.cells,
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingLeft: SEAL.pad,
              ...view(frame, at),
            }}
          >
            <Check frame={frame} at={at + 3} size={40} />
            <span style={{...textStyle(600), fontSize: 28, color: color.ink900, whiteSpace: "nowrap"}}>{label}</span>
          </div>
        );
      })}
      {/* URL en la fila de total */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: rowTop,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TypedUrl frame={frame} start={t.type} cursorFrom={t.seal + 12} cursorOff={t.cursorOff} size={44} />
      </div>
      <DrawBorder w={SEAL.w} h={SEAL.h} p={border} />
    </div>
  );
};

// ---------------------------------------------------------------- tarjetas finales

const CardLandscape: React.FC<{frame: number}> = ({frame}) => {
  const t = T.landscape;
  const row: React.CSSProperties = {position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center"};
  return (
    <AbsoluteFill style={{background: color.sand50}}>
      <div style={{...row, top: 192}}>
        <LockupOn frame={frame} at={t.lockup} blockAt={t.lockup + 2} height={96} />
      </div>
      <div
        style={{
          ...row,
          top: 344,
          ...displayStyle(700),
          letterSpacing: "-0.015em",
          fontSize: 64,
          lineHeight: "72px",
          color: color.ink900,
          ...view(frame, t.sub),
        }}
      >
        Empieza hoy. Es gratis durante 14 días.
      </div>
      <div style={{...row, top: 472, ...view(frame, t.button)}}>
        <CtaButton frame={frame} press={t.press} label="Solicitar demo gratuita" height={88} fontSize={34} />
      </div>
      <div style={{...row, top: 640}}>
        <Seal frame={frame} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 992,
          ...monoStyle(500),
          fontSize: 20,
          lineHeight: "24px",
          letterSpacing: "0.12em",
          color: color.ink400,
          ...view(frame, t.firma),
        }}
      >
        HECHO EN ESPAÑA · INTEGRADOS CON VERIFACTU
      </div>
    </AbsoluteFill>
  );
};

/** Columna del vertical: botón, badge y fila de total comparten ancho. */
const COL_9x16 = 760;

const CardPortrait: React.FC<{frame: number}> = ({frame}) => {
  const t = T.portrait;
  const row: React.CSSProperties = {position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center"};
  const rowP = progress(frame, t.row, 7, ease.overlay);
  return (
    <AbsoluteFill style={{background: color.sand50}}>
      <div style={{...row, top: 408}}>
        <LockupOn frame={frame} at={t.lockup} blockAt={t.lockup + 2} height={110} />
      </div>
      <div style={{...row, top: 648, ...view(frame, t.badge)}}>
        {/* Misma columna de 760 px que el botón y la fila de total */}
        <div
          style={{
            width: COL_9x16,
            height: 88,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius.pill,
            gap: 14,
            border: `2px solid ${color.sand300}`,
            background: color.surface,
            ...textStyle(600),
            fontSize: 40,
            letterSpacing: "-0.01em",
            color: color.ink900,
            whiteSpace: "nowrap",
          }}
        >
          <Check frame={frame} at={t.badge + 4} size={40} round />
          Prueba gratuita 14 días — sin tarjeta
        </div>
      </div>
      <div style={{...row, top: 864, ...view(frame, t.button)}}>
        <CtaButton frame={frame} press={t.press} label="Solicitar demo" height={120} fontSize={48} width={COL_9x16} />
      </div>
      <div style={{...row, top: 1112}}>
        <div
          style={{
            width: COL_9x16,
            height: 120,
            borderRadius: radius.module,
            background: color.ink900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: rowP > 0 ? 1 : 0,
            clipPath: `inset(0 ${(1 - rowP) * 50}% 0 ${(1 - rowP) * 50}% round ${radius.module}px)`,
          }}
        >
          <TypedUrl frame={frame} start={t.type} cursorFrom={t.row + 4} cursorOff={t.cursorOff} size={56} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- escena

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {portrait, width} = useScene();
  const t = portrait ? T.portrait : T.landscape;
  const {trail, lead, p} = sweepEdges(frame, t.sweep, width);
  const started = frame >= t.sweep - 1;
  const swept = started && p >= 1;
  const sweeping = started && !swept;

  return (
    <AbsoluteFill style={{background: color.ink900}}>
      {!swept ? (
        portrait ? (
          <Golpe
            frame={frame}
            lines={[["Tu", "club"], ["no", "puede"], ["esperar", "más"]]}
            wordAt={t.words}
            dotAt={t.dot}
            size={110}
            lineHeight={116}
            centerY={940}
          />
        ) : (
          <Golpe
            frame={frame}
            lines={[["Tu", "club", "no", "puede"], ["esperar", "más"]]}
            wordAt={t.words}
            dotAt={t.dot}
            size={120}
            lineHeight={128}
            centerY={540}
          />
        )
      ) : null}
      {started ? (
        <AbsoluteFill style={{clipPath: swept ? undefined : `inset(0 ${width - trail}px 0 0)`}}>
          {portrait ? <CardPortrait frame={frame} /> : <CardLandscape frame={frame} />}
        </AbsoluteFill>
      ) : null}
      {sweeping ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: trail,
            width: Math.max(0, lead - trail),
            background: color.green400,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
