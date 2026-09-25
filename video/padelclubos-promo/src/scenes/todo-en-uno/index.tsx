import React from "react";
import {AbsoluteFill, Easing, interpolateColors, useCurrentFrame} from "remotion";
import {color, monoStyle, radius} from "../../brand/tokens";
import {DigitRoll, WordsReveal, type CursorKey} from "../../components";
import {clamp01, ease, lerp, progress, view} from "../../lib/anim";
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
// Titular del acto de producto: Archivo 760 de 80 px, dos líneas en y128 e y208.
const HEAD = {x: 96, y: 128, size: 80, leading: 1};

// Casilla 04 (fila 1, columna 4): destino de la Recepción y centro del zoom-out.
const T04 = {x: COL_X[3], y: ROW_Y[0]};
const ORIGIN = {x: T04.x + TILE.w / 2, y: T04.y + TILE.h / 2};

/**
 * La Recepción como la deja «control-de-cobros»: su panel (x96 y256, 1728×688)
 * se encoge 1 → 0,95 (ease-in t⁴ en 30 f) hacia el punto fijo de la
 * semejanza panel → casilla 04 y llega a 0,95 justo en este f0.
 */
const PREV = {x: 96, y: 256, k: 0.95, power: 4, frames: 30} as const;
const KW = TILE.w / RECEPCION.w;
const KH = TILE.h / RECEPCION.h;
/** Punto fijo del zoom (borde derecho del panel y de la casilla, y ≈ 400): el mismo origen que usa «control-de-cobros». */
const FIX = {x: (T04.x - PREV.x * KW) / (1 - KW), y: (T04.y - PREV.y * KH) / (1 - KH)};
/** Ancho y alto se interpolan en escala logarítmica con la misma forma: ky = k·(kx/k)^R. */
const R = Math.log(KH / PREV.k) / Math.log(KW / PREV.k);
const W0 = RECEPCION.w * PREV.k;

/**
 * Curva del zoom (12 f, como pide el storyboard): arranca a la velocidad con la
 * que llega el panel de «control-de-cobros» (≈11 px/f en el borde izquierdo),
 * acelera hasta ≈290 px/f hacia f4–f5 y se posa sin overshoot. Sin frame
 * repetido ni caída de velocidad en el corte. La cola es corta a propósito: en
 * f9, cuando la casilla 03 (entra en f8) ya se ve, el borde izquierdo de la
 * tarjeta ha pasado su texto e icono, y en f10 deja libre también su borde.
 */
const ENTRY_SPEED = (RECEPCION.w * (1 - PREV.k) * PREV.power) / PREV.frames;
const ZOOM_X1 = 0.5;
const ZOOM_X2 = 0.2;
const ZOOM_EASE = Easing.bezier(ZOOM_X1, ZOOM_X1 * ((ENTRY_SPEED * T16.zoomDur) / (W0 - TILE.w)), ZOOM_X2, 1);
const zoomP = (f: number) => ZOOM_EASE(clamp01((f - T16.zoom) / T16.zoomDur));

// El tablero parte algo más cerca y se asienta a 1 con la tarjeta (misma curva).
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

/**
 * Titular del acto de producto en dos líneas fijas (y128 e y208, tinta 900),
 * palabra a palabra con escalonado continuo. Queda sobre la capa de noche.
 */
const Headline: React.FC<{frame: number}> = ({frame}) => {
  const lines = ["Todo lo que tu club necesita.", "Nada que no necesite."];
  let idx = 0;
  return (
    <div style={{position: "absolute", left: HEAD.x, top: HEAD.y, display: "flex", flexDirection: "column"}}>
      {lines.map((line) => {
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
              color: color.ink900,
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

/**
 * Rectángulo de la tarjeta: zoom con punto fijo FIX (ningún borde cambia de
 * dirección respecto al pre-encogido de «control-de-cobros»). El ancho sigue
 * la curva en px (el borde izquierdo, el que más recorre, acelera y frena sin
 * saltos); el alto, la misma forma en escala logarítmica.
 */
const morphRect = (f: number) => {
  const q = zoomP(f);
  const w = lerp(W0, TILE.w, q);
  const kx = w / RECEPCION.w;
  const ky = PREV.k * Math.pow(kx / PREV.k, R);
  return {q, w, h: RECEPCION.h * ky, left: FIX.x + (PREV.x - FIX.x) * kx, top: FIX.y + (PREV.y - FIX.y) * ky};
};

/**
 * Desenfoque direccional ligero (gaussiano por eje, sin copias ni sumas
 * plus-lighter): σ = 0,04 × velocidad del centro, con tope de 4 px. Suaviza el
 * barrido sin convertir la tarjeta en una mancha; nítido en f0 y al posarse.
 */
const BLUR = {k: 0.04, max: 4, min: 0.5};
const morphBlur = (f: number) => {
  if (f <= T16.zoom) return {sx: 0, sy: 0};
  const c = (g: number) => {
    const r = morphRect(g);
    return {x: r.left + r.w / 2, y: r.top + r.h / 2};
  };
  const a = c(f - 1);
  const b = c(f + 1);
  const sig = (v: number) => {
    const sgm = Math.min(BLUR.max, (Math.abs(v) / 2) * BLUR.k);
    return sgm >= BLUR.min ? sgm : 0;
  };
  return {sx: sig(b.x - a.x), sy: sig(b.y - a.y)};
};

/**
 * La Recepción, tal como la deja «control-de-cobros», se encoge hasta la
 * casilla 04. Su contenido se funde antes del tramo más rápido (f0–f4) y el
 * de la casilla entra a continuación (vista desde f3): sin dobles
 * exposiciones ni un marco vacío.
 */
const MorphCard: React.FC<{f: number}> = ({f}) => {
  const {q, w, h, left, top} = morphRect(f);
  const recOpacity = 1 - progress(f, T16.zoom, T16.recFade, ease.linear);
  const borderA = progress(f, T16.zoom + 4, 6, ease.inOut);
  // Sombra float del panel, escalada como la deja el pre-encogido; se apaga al posarse.
  const lift = (1 - q) * PREV.k;
  const {sx, sy} = morphBlur(f);
  const blurred = sx > 0 || sy > 0;
  // La casilla cabe entera mientras la tarjeta aún es más apaisada que ella (cifra sin recortar).
  const tileK = Math.min(w / TILE.w, h / TILE.h);
  return (
    <>
      {blurred ? (
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id="todo-morph-blur" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
          </filter>
        </svg>
      ) : null}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: w,
          height: h,
          boxSizing: "border-box",
          borderRadius: lerp(RECEPCION.radius * PREV.k, radius.module, q),
          border: `${TILE.border}px solid ${interpolateColors(borderA, [0, 1], [color.sand300, color.ink900])}`,
          background: interpolateColors(q, [0, 1], [color.background, color.sand50]),
          overflow: "hidden",
          boxShadow: `0 ${24 * lift}px ${60 * lift}px ${-24 * lift}px rgba(28,26,23,${0.35 * (1 - q)}), 0 ${2 * lift}px ${6 * lift}px rgba(28,26,23,${0.08 * (1 - q)})`,
          filter: blurred ? "url(#todo-morph-blur)" : undefined,
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
            width: w / tileK,
            height: h / tileK,
            transform: `scale(${tileK})`,
            transformOrigin: "0 0",
          }}
        >
          {/* La vista va en un hijo: su translateY no puede pisar la escala. */}
          <div style={{position: "absolute", inset: TILE.border, ...view(f, T16.tile04)}}>
            <TileBody tile={MAIN_TILES[3]} frame={f} enterAt={T16.tile04} rolled />
          </div>
        </div>
      </div>
    </>
  );
};

const Landscape: React.FC = () => {
  const frame = useCurrentFrame();
  const T = T16;

  // Zoom-out: el tablero parte algo más cerca y se asienta a 1 con la tarjeta.
  const cam = Math.pow(CAM0, 1 - zoomP(frame));

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
    <AbsoluteFill style={{background: color.sand50}}>
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

      {/* La Recepción que se encoge y se queda como casilla 04 */}
      <MorphCard f={frame} />

      {/* Cursor (bajo la HUD, sobre el tablero) */}
      <AbsoluteFill style={{opacity: cursorO}}>
        <Pointer frame={frame} keys={cursorKeys()} size={36} />
      </AbsoluteFill>

      {/* Se hace de noche sobre el contenido; la HUD queda por encima */}
      <AbsoluteFill style={{background: color.darkBg, opacity: night}} />

      {/* HUD fija */}
      <Headline frame={frame} />
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
