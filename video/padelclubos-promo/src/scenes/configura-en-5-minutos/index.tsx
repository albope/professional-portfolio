import React from "react";
import {AbsoluteFill, interpolateColors, useCurrentFrame} from "remotion";
import {Timer} from "lucide-react";
import {Isotipo} from "../../brand/Logo";
import {color, demo, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";
import {DigitRoll} from "../../components";
import {ease, motion, pressScale, progress, tween, view, viewOut} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T} from "./cues";

// ---------------------------------------------------------------- maqueta 16:9 (rejilla de 8 px)

const MOD = {x: 304, y: 384, w: 1312, h: 360, row: 96} as const;
const HUD = {x: MOD.x, bottom: 312, size: 80, lead: 88} as const;
const BUBBLE = {w: 440, top: 800} as const;
/** Columnas en píxeles enteros (435 + 2 + 435 + 2 + 434 = 1308): líneas de 2 px nítidas. */
const COLS = [435, 435, 434] as const;
const colLeft = (k: number) => 2 + COLS.slice(0, k).reduce((a, c) => a + c + 2, 0);

const STEPS = [
  // Verbo / complemento: ninguna línea acaba en «tu» ni en «a».
  {n: "01", lines: ["Crea", "tu cuenta"]},
  {n: "02", lines: ["Configura", "tus pistas"]},
  {n: "03", lines: ["Empieza", "a gestionar"]},
] as const;

// ---------------------------------------------------------------- piezas

/**
 * Titular de la HUD en líneas fijas, palabra a palabra (vista, escalonado
 * continuo). Con `onCut`, la primera palabra ya está asentada en el corte seco.
 */
const Headline: React.FC<{frame: number; lines: string[]; start: number; exitAt?: number; onCut?: boolean}> = ({
  frame,
  lines,
  start,
  exitAt,
  onCut,
}) => {
  let idx = 0;
  const exit = exitAt === undefined ? undefined : viewOut(frame, exitAt);
  return (
    <div
      style={{
        position: "absolute",
        left: HUD.x,
        top: HUD.bottom - lines.length * HUD.lead,
        display: "flex",
        flexDirection: "column",
        ...exit,
      }}
    >
      {lines.map((line) => (
        <div
          key={line}
          style={{
            ...displayStyle(760),
            fontSize: HUD.size,
            lineHeight: `${HUD.lead}px`,
            letterSpacing: "-0.02em",
            color: color.ink900,
            whiteSpace: "nowrap",
            display: "flex",
            columnGap: "0.26em",
          }}
        >
          {line.split(" ").map((w) => {
            const i = idx++;
            const at = onCut && i === 0 ? -motion.view : start + i * T.headStep;
            return (
              <span key={i} style={{display: "inline-block", ...view(frame, at)}}>
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/**
 * Check del módulo: casilla vacía (trazo 2 px) que, en su tiempo, se rellena y
 * dibuja el check en 8 f con un press de 120 ms.
 */
const CheckTile: React.FC<{frame: number; appear: number; at: number; size: number; tone: "light" | "dark"}> = ({
  frame,
  appear,
  at,
  size,
  tone,
}) => {
  // Relleno y trazo arrancan 1 f antes del clic: en el frame del sonido ya se ven.
  const fill = progress(frame, at - 1, 4, ease.out);
  const draw = progress(frame, at - 1, T.checkDur, ease.out);
  const pal =
    tone === "light"
      ? {ring: color.sand300, bg: color.greenTint, stroke: color.green600}
      : {ring: color.ink500, bg: color.green400, stroke: color.ink900};
  return (
    <div style={{width: size, height: size, flexShrink: 0, ...view(frame, appear)}}>
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          boxSizing: "border-box",
          borderRadius: radius.control + 2,
          border: `2px solid ${interpolateColors(fill, [0, 1], [pal.ring, pal.bg])}`,
          transform: `scale(${pressScale(frame, at)})`,
        }}
      >
        <div style={{position: "absolute", inset: -2, borderRadius: radius.control + 2, background: pal.bg, opacity: fill}} />
        <svg width={size} height={size} viewBox="0 0 40 40" style={{position: "absolute", left: -2, top: -2}}>
          <path
            d="M11.5 20.5 L17.5 26.5 L29 14.5"
            fill="none"
            stroke={pal.stroke}
            strokeWidth={3.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            opacity={draw > 0 ? 1 : 0}
          />
        </svg>
      </div>
    </div>
  );
};

/**
 * Contorno del módulo: dos trazos de 2 px que nacen en las esquinas de la
 * fila de total, suben y se encuentran arriba en el centro.
 */
const DrawBorder: React.FC<{w: number; top: number; p: number}> = ({w, top, p}) => {
  const r = radius.module;
  const i = 1;
  const a = r - i;
  const left = `M ${i} ${top} V ${r} A ${a} ${a} 0 0 1 ${r} ${i} H ${w / 2}`;
  const right = `M ${w - i} ${top} V ${r} A ${a} ${a} 0 0 0 ${w - r} ${i} H ${w / 2}`;
  return (
    <svg width={w} height={top} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      {[left, right].map((d) => (
        <path key={d} d={d} fill="none" stroke={color.ink900} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      ))}
    </svg>
  );
};

/** Cronómetro lineal 00:00 → 04:52: los minutos ruedan; los segundos corren como en un cronómetro real. */
const Stopwatch: React.FC<{frame: number; size: number}> = ({frame, size}) => {
  const secsAt = (f: number) => Math.floor(tween(f, [T.timerStart, T.timerStop], [0, T.timerSeconds], ease.linear) + 1e-6);
  const s = secsAt(frame);
  // El digit-roll de los minutos se centra en el paso por :00 (empieza 3 f antes),
  // para que nunca se lea «00:01» mientras la cifra aún no ha rodado.
  const keys = [1, 2, 3, 4].map((m) => {
    let f = T.timerStart;
    while (secsAt(f) < m * 60) f++;
    return {at: f - 3, value: String(m)};
  });
  return (
    <span style={{...monoStyle(500), fontSize: size, lineHeight: 1, color: color.darkText, whiteSpace: "pre"}}>
      0
      <DigitRoll frame={frame} keys={keys} initial="0" />
      :{String(s % 60).padStart(2, "0")}
    </span>
  );
};

/** Fila de total tinta: check, «TOTAL · 5 min», progreso contra los 5 min y cronómetro. */
const TotalRow: React.FC<{frame: number}> = ({frame}) => {
  const secs = tween(frame, [T.timerStart, T.timerStop], [0, T.timerSeconds], ease.linear);
  const fill = secs / 300;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: MOD.h - MOD.row,
        bottom: 0,
        background: color.ink900,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 40px 0 32px",
      }}
    >
      <CheckTile frame={frame} appear={-6} at={T.totalCheck} size={40} tone="dark" />
      <span style={{...monoStyle(500), fontSize: 28, letterSpacing: "0.06em", color: color.green300, whiteSpace: "nowrap"}}>
        TOTAL · 5 min
      </span>
      <div style={{flex: 1, height: 4, borderRadius: radius.pill, background: color.ink700, margin: "0 16px", position: "relative"}}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${fill * 100}%`,
            borderRadius: radius.pill,
            background: color.green300,
          }}
        />
      </div>
      <div style={{display: "flex", alignItems: "center", gap: 16}}>
        <Timer size={32} color={color.ink400} strokeWidth={2} />
        <Stopwatch frame={frame} size={44} />
      </div>
    </div>
  );
};

/** Módulo marcador héroe: 01 / 02 / 03 con check, fila de total tinta y cronómetro. */
const SetupModule: React.FC<{frame: number}> = ({frame}) => {
  const b = 2;
  const cellsH = MOD.h - MOD.row - b;
  // El corte seco cae limpio sobre la fila de total; el trazo sube desde ahí.
  const border = progress(frame, T.border, T.borderDur, ease.inOut);
  // La superficie sigue al trazo: no hay caja blanca sin contorno.
  const surface = tween(border, [0.3, 1], [0, 1], ease.linear);
  const dim = tween(frame, [T.rest, T.rest + T.restDur], [1, 0.6], ease.inOut);
  return (
    <div style={{position: "absolute", left: MOD.x, top: MOD.y, width: MOD.w, height: MOD.h}}>
      <div style={{position: "absolute", inset: 0, borderRadius: radius.module, overflow: "hidden"}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 0, height: cellsH + b, background: color.surfaceRaised, opacity: surface}} />
        <TotalRow frame={frame} />
      </div>
      {/* Separadores: crecen hacia arriba desde la fila de total */}
      {[1, 2].map((k) => {
        const p = progress(frame, T.border + 2 + k * 2, 8, ease.out);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: colLeft(k) - 2,
              top: b + cellsH * (1 - p),
              width: 2,
              height: cellsH * p,
              background: color.ink900,
            }}
          />
        );
      })}
      {/* Celdas */}
      {STEPS.map((s, k) => {
        const at = T.cells[k];
        const appear = T.labels + k * 3;
        return (
          <div
            key={s.n}
            style={{
              position: "absolute",
              left: colLeft(k),
              top: b,
              width: COLS[k],
              height: cellsH,
              boxSizing: "border-box",
              padding: "32px 32px 32px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", height: 48}}>
              <span
                style={{
                  ...monoStyle(600),
                  fontSize: 24,
                  letterSpacing: "0.06em",
                  color: color.ink500,
                  ...view(frame, appear),
                  opacity: progress(frame, appear, motion.view, ease.out) * dim,
                }}
              >
                {s.n}
              </span>
              <CheckTile frame={frame} appear={appear} at={at} size={48} tone="light" />
            </div>
            <div
              style={{
                ...textStyle(600),
                fontSize: 44,
                lineHeight: "52px",
                letterSpacing: "-0.01em",
                color: color.ink900,
                // Como el check, arranca 1 f antes: el frame del clic ya lo muestra entrando.
                ...view(frame, at - 1),
                opacity: progress(frame, at - 1, motion.view, ease.out) * dim,
              }}
            >
              {s.lines.map((l) => (
                <div key={l} style={{whiteSpace: "nowrap"}}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div style={{position: "absolute", left: 0, top: 0, width: MOD.w, height: MOD.h, pointerEvents: "none"}}>
        <DrawBorder w={MOD.w} top={MOD.h - MOD.row + 1} p={border} />
      </div>
    </div>
  );
};

/** Burbuja de chat saliente genérica con la tarjeta de enlace del club. */
const ShareBubble: React.FC<{frame: number}> = ({frame}) => {
  // Arranca 1 f antes del «swipe» para que el frame del sonido ya la muestre saliendo.
  const start = T.bubble - 1;
  const p = progress(frame, start, motion.overlay, ease.overlay);
  const slot = MOD.y + MOD.h;
  const travel = BUBBLE.top - slot + 120;
  if (frame < start) return null;
  return (
    // Ventana bajo el módulo: la burbuja sale de debajo de la celda 03.
    <div style={{position: "absolute", left: MOD.x + MOD.w - BUBBLE.w - 40, top: slot, width: BUBBLE.w + 80, height: 300, overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: BUBBLE.top - slot,
          width: BUBBLE.w,
          boxSizing: "border-box",
          padding: 12,
          background: color.sand100,
          border: `2px solid ${color.sand300}`,
          borderRadius: `${radius.surface}px 4px ${radius.surface}px ${radius.surface}px`,
          transform: `translateY(${-(1 - p) * travel}px)`,
          opacity: tween(frame, [start, start + 3], [0, 1], ease.out),
        }}
      >
        <div style={{...textStyle(500), fontSize: 30, lineHeight: "40px", color: color.ink900, padding: "0 4px"}}>Ya podéis reservar:</div>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: 10,
            background: color.surfaceRaised,
            border: `2px solid ${color.sand300}`,
            borderRadius: radius.module,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: radius.control + 2,
              background: color.sand50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Isotipo size={42} />
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: 4, minWidth: 0}}>
            <span style={{...textStyle(600), fontSize: 26, lineHeight: "30px", color: color.ink900, whiteSpace: "nowrap"}}>{demo.club}</span>
            <span style={{...monoStyle(500), fontSize: 22, lineHeight: "26px", color: color.ink500, whiteSpace: "nowrap"}}>{demo.url}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- escena

const Stage: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{background: color.sand50}}>
    <ShareBubble frame={frame} />
    <SetupModule frame={frame} />
    {/* HUD fija: los titulares se apoyan en la misma línea sobre el módulo */}
    {frame < T.headAExit + motion.exit ? (
      <Headline frame={frame} lines={["Configura tu club en 5 minutos."]} start={T.headA - 1} exitAt={T.headAExit} onCut />
    ) : null}
    <Headline frame={frame} lines={["Si sabes usar WhatsApp,", "sabes usar Padel Club OS."]} start={T.headB} />
  </AbsoluteFill>
);

export const Scene: React.FC = () => {
  const raw = useCurrentFrame();
  const {portrait, width, height, durationInFrames} = useScene();
  // Última corchea congelada (f172–f179 en 16:9).
  const frame = Math.min(raw, T.freeze, durationInFrames - 8);
  if (!portrait) return <Stage frame={frame} />;
  // La escena no está en el corte vertical: por robustez, el cuadro 16:9 cabe a lo ancho.
  const s = width / 1920;
  return (
    <AbsoluteFill style={{background: color.sand50}}>
      <div style={{position: "absolute", left: 0, top: (height - 1080 * s) / 2, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: "0 0"}}>
        <Stage frame={frame} />
      </div>
    </AbsoluteFill>
  );
};
