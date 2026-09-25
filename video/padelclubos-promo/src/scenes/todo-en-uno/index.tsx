import React from "react";
import {AbsoluteFill, interpolateColors, useCurrentFrame} from "remotion";
import {color, monoStyle, radius} from "../../brand/tokens";
import {DigitRoll, WordsReveal, type CursorKey} from "../../components";
import {ease, lerp, progress, view} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T16} from "./cues";
import {EXTRAS, MAIN_TILES} from "./data";
import {RECEPCION, Recepcion} from "./Recepcion";
import {Pointer} from "./Pointer";
import {ExtraTileView, SWITCH, TILE, TileBody, tileFrame} from "./Tiles";

export {cues} from "./cues";

// Retícula de 8 px: cuatro columnas de 408 con 32 de calle entre x96 y x1824.
const COL_X = [96, 536, 976, 1416];
const ROW_Y = [360, 584];
const EXTRA_Y = 848;
const MONO_Y = 808;
const HEAD = {x: 96, y: 160, size: 72, leading: 1.04};

// Casilla 04 (fila 1, columna 4): destino de la Recepción y centro del zoom-out.
const T04 = {x: COL_X[3], y: ROW_Y[0]};
const ORIGIN = {x: T04.x + TILE.w / 2, y: T04.y + TILE.h / 2};
// La Recepción como la deja «control-de-cobros»: su panel (x96 y240, 1728×688)
// reducido al 90 % en torno a la tarjeta «Cobrado hoy» (1254, 484).
const PREV = {k: 0.9, ox: 1254, oy: 484, x: 96, y: 240};
const R0 = {
  cx: PREV.ox + (PREV.x + RECEPCION.w / 2 - PREV.ox) * PREV.k,
  cy: PREV.oy + (PREV.y + RECEPCION.h / 2 - PREV.oy) * PREV.k,
  w: RECEPCION.w * PREV.k,
  h: RECEPCION.h * PREV.k,
};
// El tablero parte algo más cerca y se asienta a 1 con la tarjeta.
const CAM0 = 1.08;

/** Centro del interruptor de la casilla de extra `i` (coordenadas de cuadro). */
const switchAt = (i: number) => ({
  x: COL_X[i] + TILE.w - TILE.border - TILE.padX - SWITCH.w / 2,
  y: EXTRA_Y + TILE.extraH / 2,
});

// La HUD sale con vista inversa desde f112 y ha desaparecido del todo en el último frame.
const HUD_EXIT = 7;
const hudExit = (frame: number): React.CSSProperties => {
  const p = progress(frame, T16.hudOut, HUD_EXIT, ease.in);
  return {opacity: 1 - p, transform: `translateY(${-p * 4}px)`};
};

/** Arena del tablero; parte del arena lisa de «control-de-cobros» y se asienta con el zoom-out. */
const Page: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{background: color.sand50}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 18%, ${color.sand100} 0%, ${color.sand100} 45%, ${color.sand200} 100%)`,
        opacity: progress(frame, T16.zoom, 14, ease.inOut),
      }}
    />
  </AbsoluteFill>
);

/**
 * Titular en dos líneas fijas, palabra a palabra con escalonado continuo.
 * Con la noche, la segunda línea se oscurece (ink500 → ink700) para no perder
 * contraste sobre el fondo que se apaga.
 */
const Headline: React.FC<{frame: number; dusk: number}> = ({frame, dusk}) => {
  const second = interpolateColors(dusk, [0, 1], [color.ink500, color.ink700]);
  const lines = ["Todo lo que tu club necesita.", "Nada que no necesite."];
  let idx = 0;
  return (
    <div style={{position: "absolute", left: HEAD.x, top: HEAD.y, display: "flex", flexDirection: "column"}}>
      {lines.map((line, li) => {
        const s = T16.headline + idx * T16.headlineStep;
        idx += line.split(" ").length;
        return (
          <WordsReveal
            key={line}
            text={line}
            frame={frame}
            start={s}
            step={T16.headlineStep}
            exitAt={T16.hudOut}
            exitDuration={HUD_EXIT}
            style={{
              fontSize: HEAD.size,
              fontWeight: 760,
              lineHeight: HEAD.leading,
              color: li === 0 ? color.ink900 : second,
              whiteSpace: "nowrap",
            }}
          />
        );
      })}
    </div>
  );
};

/** Una cara del reloj del día: clara (acto de producto) u oscura (noche, la de «tu-descansas»). */
const ChipFace: React.FC<{frame: number; night: boolean; style?: React.CSSProperties}> = ({frame, night, style}) => (
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
      background: night ? color.darkRaised : color.sand200,
      border: `2px solid ${night ? color.darkBorder : color.sand300}`,
      ...monoStyle(500),
      fontSize: 28,
      lineHeight: 1.15,
      letterSpacing: "0.04em",
      color: night ? color.ink300 : color.ink500,
      zIndex: 50,
      ...style,
    }}
  >
    <span>MAR</span>
    <span style={{opacity: 0.6}}>·</span>
    <DigitRoll
      frame={frame}
      keys={[{at: T16.clockRoll, value: "22:00"}]}
      initial="20:25"
      style={night ? {color: color.gainGreen, fontWeight: 500} : {color: color.ink900, fontWeight: 600}}
    />
  </div>
);

/**
 * Reloj del día. En c2.t4 la cara de noche sube desde abajo con un borde
 * nítido (como la capa de noche): cada mitad conserva su contraste, sin el
 * gris intermedio de un fundido de colores.
 */
const DayChip: React.FC<{frame: number}> = ({frame}) => {
  const n = progress(frame, T16.clockNight, 6, ease.inOut);
  return (
    <>
      {n < 1 ? <ChipFace frame={frame} night={false} /> : null}
      {n > 0 ? <ChipFace frame={frame} night style={{clipPath: `inset(${(1 - n) * 100}% 0 0 0)`}} /> : null}
    </>
  );
};

// Línea mono de la HUD (JetBrains Mono 22 px, tracking 0,14 em) y la regla que la sigue.
const MONO = {size: 22, tracking: 0.14, text: "ACTIVA ÚNICAMENTE LO QUE UTILICES"};
const MONO_W = MONO.text.length * (0.6 + MONO.tracking) * MONO.size;
const RULE_X = COL_X[0] + MONO_W + 24;

/** Línea mono sobre la fila de extras (HUD: no la cubre la noche). */
const MonoLine: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: "absolute",
      left: COL_X[0],
      top: MONO_Y,
      height: 24,
      display: "flex",
      alignItems: "center",
      ...hudExit(frame),
    }}
  >
    <span
      style={{
        ...monoStyle(500),
        fontSize: MONO.size,
        lineHeight: 1.1,
        letterSpacing: `${MONO.tracking}em`,
        color: color.ink500,
        whiteSpace: "nowrap",
        ...view(frame, T16.extras),
      }}
    >
      {MONO.text}
    </span>
  </div>
);

/** Regla de 2 px que se dibuja tras la línea mono. Va en el contenido: la noche la oscurece con el tablero. */
const MonoRule: React.FC<{frame: number}> = ({frame}) => {
  const rule = progress(frame, T16.extras + 2, 14, ease.out);
  return (
    <div
      style={{
        position: "absolute",
        left: RULE_X,
        top: MONO_Y + 11,
        width: (COL_X[3] + TILE.w - RULE_X) * rule,
        height: 2,
        background: color.sand400,
        ...hudExit(frame),
      }}
    />
  );
};

/** Recorrido del cursor: enciende Academia y Bar y tienda, se posa sobre Multisede y sigue de largo. */
const cursorKeys = (): CursorKey[] => {
  const a = switchAt(0);
  const b = switchAt(1);
  const m = switchAt(2);
  // La punta cae en la parte baja izquierda de la pista: la flecha queda por
  // debajo del recorrido del pomo y se ve cómo pasa a la derecha.
  const tip = (p: {x: number; y: number}) => ({x: p.x - 16, y: p.y + 8});
  return [
    // Llega un par de frames antes de cada clic y se queda quieto durante la pulsación.
    {at: T16.cursorIn, x: a.x + 120, y: 1100},
    {at: T16.academia - 2, ...tip(a)},
    {at: T16.academia, ...tip(a), click: true},
    {at: T16.academia + 1, ...tip(a)},
    {at: T16.bar - 1, ...tip(b)},
    {at: T16.bar, ...tip(b), click: true},
    {at: T16.bar + 6, ...tip(b)},
    {at: T16.multisede, ...tip(m)},
    {at: T16.hoverEnd, ...tip({x: m.x + 4, y: m.y + 2})},
    {at: T16.hoverEnd + 12, x: m.x + 90, y: 1130},
  ];
};

// Desenfoque de movimiento de la tarjeta: obturador de 180° con muestras hacia atrás en el tiempo.
// Las muestras se suman en dos niveles (grupos de 4): con una sola capa de 16
// el redondeo a 8 bits de cada muestra aclara la tarjeta.
const BLUR_PER_GROUP = 4;
const SHUTTER = 0.5;

/** Lo que recorre el borde más rápido de la tarjeta durante el obturador (px). */
const morphSpread = (f: number) => {
  const a = morphRect(f);
  const b = morphRect(f - SHUTTER);
  const left = Math.abs(a.cx - a.w / 2 - (b.cx - b.w / 2));
  const right = Math.abs(a.cx + a.w / 2 - (b.cx + b.w / 2));
  const top = Math.abs(a.cy - a.h / 2 - (b.cy - b.h / 2));
  return Math.max(left, right, top);
};

/** Solo hay desenfoque mientras algún borde recorre más de 10 px por medio frame (f1–f6). */
const morphMoving = (f: number) => morphSpread(f) > 10;

const BLUR_GROUPS = 4;

const BlurredMorph: React.FC<{frame: number}> = ({frame}) => {
  const groups = BLUR_GROUPS;
  const n = groups * BLUR_PER_GROUP;
  // En f1–f3 las copias quedan a ~13 px: un desenfoque de media separación
  // por muestra las funde en una estela continua (sin escalones ni texto punteado).
  const soften = Math.min(6, (morphSpread(frame) / (n - 1)) * 0.5);
  const add: React.CSSProperties = {mixBlendMode: "plus-lighter", opacity: 1 / BLUR_PER_GROUP};
  return (
    <AbsoluteFill style={{isolation: "isolate"}}>
      {Array.from({length: groups}, (_, g) => (
        <AbsoluteFill key={g} style={{...add, opacity: 1 / groups, isolation: "isolate"}}>
          {Array.from({length: BLUR_PER_GROUP}, (_, k) => {
            const i = g * BLUR_PER_GROUP + k;
            return (
              <AbsoluteFill key={k} style={{...add, filter: soften >= 0.5 ? `blur(${soften.toFixed(2)}px)` : undefined}}>
                <MorphCard f={frame - (SHUTTER * i) / (n - 1)} />
              </AbsoluteFill>
            );
          })}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

/** Rectángulo de la tarjeta: tamaño en escala logarítmica (el zoom se percibe uniforme), overlay 12 f. */
const morphRect = (f: number) => {
  const zp = progress(f, T16.zoom, T16.zoomDur, ease.overlay);
  const cam = Math.pow(CAM0, 1 - zp);
  const r1 = {cx: ORIGIN.x, cy: ORIGIN.y, w: TILE.w * cam, h: TILE.h * cam};
  return {
    zp,
    w: R0.w * Math.pow(r1.w / R0.w, zp),
    h: R0.h * Math.pow(r1.h / R0.h, zp),
    cx: lerp(R0.cx, r1.cx, zp),
    cy: lerp(R0.cy, r1.cy, zp),
  };
};

/**
 * La Recepción, tal como la deja «control-de-cobros», se encoge hasta la
 * casilla 04 y funde su contenido con el de la casilla. `f` puede ser
 * fraccionario (muestras del desenfoque).
 */
const MorphCard: React.FC<{f: number}> = ({f}) => {
  const {zp, w, h, cx, cy} = morphRect(f);
  const recOpacity = 1 - progress(f, T16.zoom + 2, 6, ease.out);
  const borderA = progress(f, T16.zoom + 3, 6, ease.out);
  const lift = 1 - zp;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: lerp(RECEPCION.radius * PREV.k, radius.module, zp),
        border: `${TILE.border}px solid ${interpolateColors(borderA, [0, 1], [color.sand300, color.ink900])}`,
        background: interpolateColors(zp, [0, 1], [color.background, color.sand50]),
        overflow: "hidden",
        boxShadow: `0 ${24 * lift}px ${60 * lift}px -24px rgba(28,26,23,${0.35 * lift}), 0 2px 6px rgba(28,26,23,${0.08 * lift})`,
      }}
    >
      {recOpacity > 0 ? (
        <div
          style={{
            position: "absolute",
            left: -TILE.border,
            top: -TILE.border,
            width: RECEPCION.w,
            height: RECEPCION.h,
            transform: `scale(${w / RECEPCION.w})`,
            transformOrigin: "0 0",
            opacity: recOpacity,
          }}
        >
          <Recepcion />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: -TILE.border,
          top: -TILE.border,
          width: TILE.w,
          height: TILE.h,
          transform: `scale(${w / TILE.w})`,
          transformOrigin: "0 0",
          ...view(f, T16.tile04),
        }}
      >
        <div style={{position: "absolute", inset: TILE.border}}>
          <TileBody tile={MAIN_TILES[3]} frame={f} enterAt={T16.tile04} rolled />
        </div>
      </div>
    </div>
  );
};

const Landscape: React.FC = () => {
  const frame = useCurrentFrame();
  const T = T16;

  // Zoom-out: el tablero parte algo más cerca y se asienta a 1 con la tarjeta.
  const cam = Math.pow(CAM0, 1 - progress(frame, T.zoom, T.zoomDur, ease.overlay));

  // Noche de 0 a 60 % entre f90 y f119, en curva cuadrática: se nota desde
  // c2.t3 (7 % en f100), deja la HUD legible (35 % en f112) y cae del todo
  // con su salida, hacia el negro de «tu-descansas».
  const nightP = progress(frame, T.night, T.nightDur - 1, ease.linear);
  const night = 0.6 * nightP * nightP;

  // Hover sobre Multisede: entra con el cursor y se apaga cuando se va.
  const hover = progress(frame, T.multisede - 3, 4, ease.out) * (1 - progress(frame, T.hoverEnd, 6, ease.out));
  const cursorO = progress(frame, T.cursorIn, 6, ease.out) * (1 - progress(frame, T.cursorOut + 4, 8, ease.in));

  const onAt: Record<string, number | undefined> = {academia: T.academia, bar: T.bar, verifactu: T.verifactu};

  return (
    <AbsoluteFill>
      <Page frame={frame} />

      {/* Capa de contenido (cámara): tablero de módulos */}
      <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px`}}>
        {MAIN_TILES.filter((t) => t.n !== "04").map((t) => {
          const at = T.tiles[t.n];
          return (
            <div key={t.n} style={{...tileFrame, left: COL_X[t.col], top: ROW_Y[t.row], ...view(frame, at)}}>
              <TileBody tile={t} frame={frame} enterAt={at} />
            </div>
          );
        })}
        {EXTRAS.map((x, i) => {
          const at = T.extras + i * T.extrasStep;
          return (
            <div key={x.id} style={{position: "absolute", left: COL_X[i], top: EXTRA_Y, ...view(frame, at)}}>
              <ExtraTileView tile={x} frame={frame} onAt={onAt[x.id]} hover={x.id === "multisede" ? hover : 0} />
            </div>
          );
        })}
        <MonoRule frame={frame} />
      </AbsoluteFill>

      {/* La Recepción que se encoge y se queda como casilla 04 (con desenfoque mientras vuela) */}
      {morphMoving(frame) ? <BlurredMorph frame={frame} /> : <MorphCard f={frame} />}

      {/* Cursor (bajo la HUD, sobre el tablero) */}
      <AbsoluteFill style={{opacity: cursorO}}>
        <Pointer frame={frame} keys={cursorKeys()} size={36} />
      </AbsoluteFill>

      {/* Se hace de noche sobre el contenido; la HUD queda por encima */}
      <AbsoluteFill style={{background: color.darkBg, opacity: night}} />

      {/* HUD fija */}
      <Headline frame={frame} dusk={nightP} />
      <MonoLine frame={frame} />
      <DayChip frame={frame} />
    </AbsoluteFill>
  );
};

/** La escena no está en el corte vertical: si se pide en 9:16, se muestra el 16:9 centrado. */
const PortraitFallback: React.FC = () => (
  <AbsoluteFill style={{background: color.sand100, justifyContent: "center"}}>
    <div style={{position: "relative", width: 1920, height: 1080, transform: "scale(0.5625)", transformOrigin: "0 50%"}}>
      <Landscape />
    </div>
  </AbsoluteFill>
);

/** 22:00 — Todo lo que tu club necesita: el tablero de módulos marcador con datos vivos. */
export const Scene: React.FC = () => {
  const {portrait} = useScene();
  return portrait ? <PortraitFallback /> : <Landscape />;
};
