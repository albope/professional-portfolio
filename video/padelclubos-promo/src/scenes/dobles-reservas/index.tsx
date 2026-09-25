import React from "react";
import {AbsoluteFill, interpolateColors, useCurrentFrame} from "remotion";
import {color, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";
import {DayClock, DigitRoll, WordsReveal} from "../../components";
import {ease, motion, progress, tween} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T16, T9} from "./cues";

// Borde del módulo antes del choque: arena al 80 %.
const CREAM80 = "rgba(241, 237, 228, 0.8)";
const TEXT70 = "rgba(241, 237, 228, 0.7)";
const BG = `radial-gradient(ellipse 70% 60% at 50% 56%, #1B1814 0%, ${color.darkBg} 100%)`;
/** Vista inversa de la HUD: 7 f para que termine justo en el último frame. */
const HUD_EXIT = 7;
/** Sombra de las burbujas de «mensajes-a-deshora» (continuidad del match cut). */
const lift = (k = 1) => `0 ${40 / k}px ${80 / k}px ${-30 / k}px rgba(0, 0, 0, 0.7)`;

/** Temblor amortiguado en x: alterna de lado y se apaga en `dur` frames (sin rebote final). */
const shake = (frame: number, at: number, amp: number, dur = 6) => {
  const d = frame - at;
  if (d < 0 || d >= dur) return 0;
  return amp * Math.pow(1 - d / dur, 1.5) * Math.cos(Math.PI * d);
};

/** Caída fuera de cuadro: ease-in de 12 f. */
const drop = (frame: number, at: number) => progress(frame, at, 12, ease.in);

interface Pose {
  x: number;
  y: number;
  s: number;
  r: number;
  /** Punto de referencia para el desenfoque si no es la esquina (caja que crece). */
  mx?: number;
  my?: number;
}

/** Sigma máxima del desenfoque de movimiento (px): una estela ligera, nunca una losa. */
const MAX_BLUR = 6;

const poseTransform = (p: Pose) =>`translate(${p.x}px, ${p.y}px) scale(${p.s}) rotate(${p.r}deg)`;

/**
 * Capa con desenfoque de movimiento direccional: la velocidad del frame
 * (obturador de 180°) se convierte en un desenfoque gaussiano en x/y. Sin
 * copias fantasma, y nítida en cuanto se detiene.
 */
const Moving: React.FC<{id: string; pose: (f: number) => Pose; frame: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  id,
  pose,
  frame,
  style,
  children,
}) => {
  const a = pose(frame);
  const b = pose(frame - 1);
  // Obturador de 180°: estela de Δ/2 px; su sigma gaussiana equivalente ≈ 0,15·Δ,
  // con tope de MAX_BLUR: en los saltos grandes (B entra ~640 px en un frame)
  // la estela entera convertiría el módulo en una losa.
  const bx = Math.min(MAX_BLUR, Math.abs((a.mx ?? a.x) - (b.mx ?? b.x)) * 0.15);
  const by = Math.min(MAX_BLUR, Math.abs((a.my ?? a.y) - (b.my ?? b.y)) * 0.15);
  const on = bx > 0.3 || by > 0.3;
  return (
    <>
      {on ? (
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id={id} x="-50%" y="-100%" width="200%" height="300%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} />
          </filter>
        </svg>
      ) : null}
      <div style={{position: "absolute", ...style, transform: poseTransform(a), filter: on ? `url(#${id})` : undefined}}>{children}</div>
    </>
  );
};

/** Trama diagonal de conflicto: líneas de 2 px #E08A7A al 35 %, paso 12 px. */
const Hatch: React.FC<{p: number; width: number; height: number; step?: number}> = ({p, width, height, step = 12}) => {
  const dx = step * Math.SQRT2;
  const xs: number[] = [];
  for (let x = -height; x < width + dx; x += dx) xs.push(x);
  return (
    <svg
      width={width}
      height={height}
      style={{position: "absolute", left: 0, top: 0, opacity: p, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}
    >
      {xs.map((x) => (
        <line key={x} x1={x} y1={height} x2={x + height} y2={0} stroke={color.painRed} strokeOpacity={0.35} strokeWidth={2} />
      ))}
    </svg>
  );
};

interface SlotRow {
  text: string;
  /** Iniciales del avatar (solo 16:9: en vertical no caben en el presupuesto de palabras). */
  initials?: string;
  /** Entra desde abajo en el mismo hueco (overlay 7 f). */
  enterAt?: number;
}

interface SlotGeo {
  /** Anchos de PISTA, FECHA y HORA (suman el ancho interior). */
  cols: [number, number, number];
  cellH: number;
  padX: number;
  padTop: number;
  padBottom: number;
  valueSize: number;
  labelSize: number;
  rowH: number;
  rowFont: number;
}

const CELLS = [
  {label: "PISTA", value: "1"},
  {label: "FECHA", value: "MAR"},
  {label: "HORA", value: "19:00"},
];

/** Estado inicial del aterrizaje (lo que el plano anterior deja en el último frame). */
interface Landing {
  /** Progreso 0 → 1 (overlay 7 f). */
  p: number;
  /** Escala de la capa: los trazos se compensan para seguir midiendo 2 px en pantalla. */
  scale?: number;
  /** Tamaño exterior de partida (burbuja de chat en 9:16). */
  box?: {w: number; h: number};
  /** Color de borde de partida. */
  inkFrom?: string;
  /** Opacidad de partida de los separadores. */
  gridFrom?: number;
  /** Columnas de partida (tercios en el módulo de «mensajes-a-deshora»). */
  colsFrom?: [number, number, number];
  cornerFrom?: number;
  /** Esquina superior izquierda de partida (el pico de la burbuja). */
  tailFrom?: number;
  surfaceFrom?: string;
}

const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Módulo marcador del problema en tono oscuro (misma anatomía que el
 * MarcadorModule del kit: borde 2 px, radio 10, etiquetas mono y cifras en
 * Archivo 112 % tabulares), con columnas a medida de su contenido, una o dos
 * filas de total, la trama de conflicto bajo el contenido y el aterrizaje
 * desde la forma con la que termina el plano anterior.
 */
const SlotModule: React.FC<{
  frame: number;
  geo: SlotGeo;
  /** Frames en que ruedan PISTA, FECHA y HORA; sin ellos, los valores ya están. */
  roll?: [number, number, number];
  rows: SlotRow[];
  conflictAt: number;
  hatch: "cells" | "rows";
  landing?: Landing;
  /** Vista de las etiquetas y del texto de la primera fila. */
  labelsAt?: number;
  rowTextAt?: number;
  shadow?: string;
}> = ({frame, geo, roll, rows, conflictAt, hatch, landing, labelsAt, rowTextAt, shadow}) => {
  const lp = landing?.p ?? 1;
  const bw = 2 / (landing?.scale ?? 1);
  const surface = landing?.surfaceFrom ? interpolateColors(lp, [0, 1], [landing.surfaceFrom, color.darkSurface]) : color.darkSurface;
  const baseInk = landing?.inkFrom ? interpolateColors(lp, [0, 1], [landing.inkFrom, CREAM80]) : CREAM80;
  // Las rampas del golpe arrancan un frame antes para que el propio frame del golpe ya se vea rojo.
  const ink = interpolateColors(frame, [conflictAt - 1, conflictAt + 3], [baseInk, color.painRed]);
  const gridO = lerpN(landing?.gridFrom ?? 1, 1, lp);
  const line = gridO < 1 ? interpolateColors(gridO, [0, 1], [surface, ink]) : ink;
  const hatchP = progress(frame, conflictAt - 1, 6, ease.out);
  const cols = geo.cols.map((c, i) => (landing?.colsFrom ? lerpN(landing.colsFrom[i], c, lp) : c));
  const inner = geo.cols[0] + geo.cols[1] + geo.cols[2];
  const grow = rows.map((r) => (r.enterAt === undefined ? 1 : progress(frame, r.enterAt, motion.overlay, ease.overlay)));
  const rowsH = grow.reduce((a, g) => a + (g > 0.001 ? (geo.rowH + 2) * g : 0), 0);
  const labelO = labelsAt === undefined ? 1 : progress(frame, labelsAt, motion.view, ease.out);
  const rowO = rowTextAt === undefined ? 1 : progress(frame, rowTextAt, motion.view, ease.out);
  const box = landing?.box && lp < 1 ? landing.box : undefined;
  return (
    <div
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: box ? lerpN(box.w, inner + 4, lp) : inner + 4,
        height: box ? lerpN(box.h, geo.cellH + rowsH + 4, lp) : undefined,
        border: `${bw}px solid ${ink}`,
        borderRadius: (() => {
          const r = lerpN(landing?.cornerFrom ?? radius.module, radius.module, lp);
          const tl = lerpN(landing?.tailFrom ?? landing?.cornerFrom ?? radius.module, radius.module, lp);
          return `${tl}px ${r}px ${r}px ${r}px`;
        })(),
        background: surface,
        boxShadow: shadow,
        overflow: "hidden",
      }}
    >
      {hatch === "cells" && hatchP > 0 ? (
        <div style={{position: "absolute", left: 0, top: 0, width: inner, height: geo.cellH, overflow: "hidden"}}>
          <Hatch p={hatchP} width={inner} height={geo.cellH} />
        </div>
      ) : null}
      <div style={{position: "relative", display: "flex", width: inner, height: geo.cellH}}>
        {CELLS.map((c, i) => (
          <div
            key={c.label}
            style={{
              width: cols[i],
              flexShrink: 0,
              boxSizing: "border-box",
              borderLeft: i === 0 ? "none" : `${bw}px solid ${line}`,
              padding: `${geo.padTop}px ${geo.padX}px ${geo.padBottom}px`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* La etiqueta recorta la trama con una placa del color de la superficie. */}
            <span
              style={{
                ...monoStyle(600),
                alignSelf: "flex-start",
                fontSize: geo.labelSize,
                lineHeight: 1,
                letterSpacing: "0.14em",
                color: color.ink400,
                background: surface,
                padding: "6px 10px",
                margin: "-6px -10px",
                opacity: labelO,
                whiteSpace: "nowrap",
              }}
            >
              {c.label}
            </span>
            <span style={{...displayStyle(800), fontSize: geo.valueSize, lineHeight: 0.74, color: color.darkText, whiteSpace: "nowrap"}}>
              <DigitRoll
                frame={frame}
                keys={[{at: roll ? roll[i] : -60, value: c.value}]}
                initial={roll ? "" : c.value}
                stagger={1}
                alignRight={false}
              />
            </span>
          </div>
        ))}
      </div>
      <div style={{position: "relative", width: inner, background: color.darkRaised}}>
        {hatch === "rows" && hatchP > 0 ? (
          <div style={{position: "absolute", inset: 0, overflow: "hidden"}}>
            <Hatch p={hatchP} width={inner} height={rowsH + 4} />
          </div>
        ) : null}
        {rows.map((r, i) => {
          const g = grow[i];
          if (g <= 0.001) return null;
          return (
            <div
              key={r.text}
              style={{
                position: "relative",
                boxSizing: "border-box",
                height: (geo.rowH + 2) * g,
                borderTop: `${bw}px solid ${line}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: geo.padX,
                  top: 0,
                  height: geo.rowH,
                  display: "flex",
                  alignItems: "center",
                  ...textStyle(600),
                  fontSize: geo.rowFont,
                  lineHeight: 1,
                  color: color.darkText,
                  whiteSpace: "nowrap",
                  opacity: i === 0 ? rowO : 1,
                  transform: `translateY(${(1 - g) * geo.rowH * 0.6 + (i === 0 ? (1 - rowO) * 4 : 0)}px)`,
                }}
              >
                {r.initials ? (
                  <span
                    style={{
                      width: 48,
                      height: 48,
                      marginRight: 18,
                      borderRadius: 24,
                      background: color.darkBorder,
                      color: color.sand400,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...textStyle(600),
                      fontSize: 19,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {r.initials}
                  </span>
                ) : null}
                {r.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Chip «Ahora» de la landing, con tinte rojo suave. */
const NowChip: React.FC<{frame: number; at: number}> = ({frame, at}) => {
  const p = progress(frame, at, motion.press, ease.out);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: -64,
        height: 48,
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "0 20px 0 16px",
        borderRadius: radius.pill,
        background: "rgba(224, 138, 122, 0.14)",
        border: "2px solid rgba(224, 138, 122, 0.55)",
        ...textStyle(600),
        fontSize: 24,
        color: color.painRed,
        opacity: p,
        transform: `scale(${0.96 + 0.04 * p})`,
        transformOrigin: "0% 100%",
      }}
    >
      <span style={{width: 10, height: 10, borderRadius: 5, background: color.painRed}} />
      Ahora
    </div>
  );
};

// ---------------------------------------------------------------- 16:9

const GEO16: SlotGeo = {
  cols: [212, 384, 440],
  cellH: 214,
  padX: 36,
  padTop: 32,
  padBottom: 32,
  valueSize: 120,
  labelSize: 20,
  rowH: 80,
  rowFont: 36,
};
/** Desfase de la burbuja de Pedro detrás de A en el match cut. */
const OFF = 24;
const W16 = GEO16.cols[0] + GEO16.cols[1] + GEO16.cols[2] + 4;
const H16 = GEO16.cellH + GEO16.rowH + 6;
// B se monta sobre A 24 px a la derecha y 82 px más arriba: su borde inferior
// cae justo sobre el separador de la fila de total de A, así que «Javi
// Martínez + 3» sigue a la vista bajo «Pedro Sanz + 3» (dos grupos, un hueco)
// y A asoma por la izquierda como la tarjeta de debajo.
const B_OFF = {x: 24, y: GEO16.cellH + 4 - H16};
// El conjunto A+B (con el chip encima de B) queda centrado en x; en y deja
// aire bajo el subtítulo.
const A16 = {x: Math.round((1920 - W16 - B_OFF.x) / 2), y: 552};
const B16 = {x: A16.x + B_OFF.x, y: A16.y + B_OFF.y};
/** Centro del conjunto: origen de la cámara. */
const SET16 = {x: A16.x + (W16 + B_OFF.x) / 2, y: (B16.y + A16.y + H16) / 2};

// Match cut con «mensajes-a-deshora»: su último frame deja el módulo A
// (1040×300 al 64 %) centrado en (1100, 640), con los separadores donde caen
// los de THIRDS, y la burbuja de Pedro detrás (+24/+24). A crece desde ahí
// hasta su sitio y B se esconde detrás de él.
const FROM16 = {cx: 1100, cy: 640, s: (1040 * 0.64) / W16};
// Separadores de sus tercios (x = w/3 y 2w/3, trazo centrado) en coordenadas del módulo.
const THIRDS: [number, number, number] = [342, 347, 347];
const landA16 = (f: number) => progress(f, T16.land, motion.overlay, ease.overlay);

// A: aterriza y cae 3 f después que B.
const poseA16 = (f: number): Pose => {
  const land = landA16(f);
  const fall = drop(f, T16.fall + 3);
  const s = lerpN(FROM16.s, 1, land);
  const cx = A16.x + W16 / 2;
  const cy = A16.y + H16 / 2;
  // Mientras aterriza, el borde mide 2/s px sin escalar: la caja es 296 + 4/s
  // de alto y su centro baja 2/s − 2 px. Se compensa para que el centro visible
  // salga de FROM16 exacto (y en s = 1 no cambia nada).
  const grow = 2 / s - 2;
  return {
    x: (FROM16.cx - cx) * (1 - land),
    y: (FROM16.cy - cy) * (1 - land) - grow + fall * 720,
    s,
    r: -4 * fall,
  };
};

// B: entra desde la derecha, fuera de cuadro en el propio f30 (así su primer
// frame visible ya va en movimiento), y se monta sobre A (B_OFF).
const B_FROM = 1500;
const poseB16 = (f: number): Pose => {
  const bIn = progress(f, T16.second, motion.overlay, ease.overlay);
  const fall = drop(f, T16.fall);
  return {x: (1 - bIn) * B_FROM, y: fall * 720, s: 1, r: 4 * fall};
};

/** Silueta de la burbuja de Pedro que llega detrás de A y se esconde al aterrizar. */
const TuckedShell: React.FC<{land: number; scale: number}> = ({land, scale}) => {
  if (land >= 1) return null;
  const off = (OFF * (1 - land)) / scale;
  return (
    <div
      style={{
        position: "absolute",
        left: off,
        top: off,
        width: W16,
        // Mismo alto que A con su borde de 2/scale px.
        height: H16 - 4 + 4 / scale,
        boxSizing: "border-box",
        border: `${2 / scale}px solid ${CREAM80}`,
        borderRadius: radius.module / scale,
        background: color.darkSurface,
        boxShadow: lift(scale),
      }}
    />
  );
};

const Stage16: React.FC = () => {
  const frame = useCurrentFrame();
  const t = T16;
  const land = landA16(frame);
  const scale = lerpN(FROM16.s, 1, land);
  const cam = tween(frame, [t.second, t.fall], [1, 1.03], ease.inOut);
  const sx = shake(frame, t.impact, 6);
  const module = {frame, geo: GEO16, conflictAt: t.impact};
  return (
    <AbsoluteFill style={{transform: `translateX(${sx}px) scale(${cam})`, transformOrigin: `${SET16.x}px ${SET16.y}px`}}>
      <Moving id="dobles-a" pose={poseA16} frame={frame} style={{left: A16.x, top: A16.y}}>
        <TuckedShell land={land} scale={scale} />
        <SlotModule
          {...module}
          roll={t.roll}
          rows={[{text: "Javi Martínez + 3", initials: "JM"}]}
          hatch="cells"
          landing={{p: land, scale, colsFrom: THIRDS, cornerFrom: radius.module / FROM16.s}}
          labelsAt={t.land}
          rowTextAt={t.rowText}
          shadow={lift(scale)}
        />
      </Moving>
      {frame >= t.second ? (
        <Moving id="dobles-b" pose={poseB16} frame={frame} style={{left: B16.x, top: B16.y}}>
          {/* «Ahora» en la esquina superior izquierda del conjunto, que ahora es B. */}
          <NowChip frame={frame} at={t.impact} />
          <SlotModule {...module} rows={[{text: "Pedro Sanz + 3", initials: "PS"}]} hatch="cells" shadow={lift()} />
        </Moving>
      ) : null}
    </AbsoluteFill>
  );
};

const Hud16: React.FC = () => {
  const frame = useCurrentFrame();
  const t = T16;
  return (
    <AbsoluteFill>
      <DayClock frame={frame} mood="alert" surface="dark" day={[{at: -60, value: "MAR"}]} time={[{at: -60, value: "01:12"}]} />
      <WordsReveal
        text="Dobles reservas."
        frame={frame}
        start={t.title}
        step={3}
        exitAt={t.hudOut}
        exitDuration={HUD_EXIT}
        style={{position: "absolute", left: 96, top: 152, fontSize: 96, fontWeight: 760, lineHeight: 1, color: color.darkText}}
      />
      <WordsReveal
        text="Dos partidos. Una pista."
        frame={frame}
        start={t.impact}
        step={3}
        exitAt={t.hudOut}
        exitDuration={HUD_EXIT}
        style={{
          position: "absolute",
          left: 96,
          top: 280,
          ...textStyle(500),
          fontStretch: "100%",
          letterSpacing: 0,
          columnGap: "0.27em",
          fontSize: 44,
          lineHeight: 1.2,
          color: TEXT70,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 9:16

const GEO9: SlotGeo = {
  cols: [220, 336, 376],
  cellH: 200,
  padX: 32,
  padTop: 32,
  padBottom: 32,
  valueSize: 96,
  labelSize: 22,
  rowH: 144,
  rowFont: 56,
};
// Centrado en la franja y640–1180 con las dos filas ya dentro.
const M9 = {x: 72, y: 664};

/** Escala con la que V01 deja la burbuja (588×112 → 658,56×125,44). */
const BUBBLE9_K = 1.12;
// Match cut con «mensajes-a-deshora» (9:16): la burbuja de Javi termina
// centrada en (540, 900), de 588×112 a 1,12, radio 28 con la esquina del pico
// a 8 (también a 1,12) y contorno rojo suave.
const BUBBLE9 = {cx: 540, cy: 900, w: 588 * BUBBLE9_K, h: 112 * BUBBLE9_K, r: 28 * BUBBLE9_K, tail: 8 * BUBBLE9_K};

/**
 * Texto de la burbuja de Javi tal como lo deja V01 («Pista 1» y «19:00» en
 * rojo): sigue ahí en f0 y se apaga mientras la burbuja se vuelve módulo y
 * sus cifras ruedan.
 */
const BubbleText: React.FC<{o: number}> = ({o}) => {
  if (o <= 0) return null;
  const hl: React.CSSProperties = {color: color.painRed, fontWeight: 600};
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 588,
        height: 112,
        padding: "0 28px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        transform: `scale(${BUBBLE9_K})`,
        transformOrigin: "0 0",
        ...textStyle(500),
        fontSize: 44,
        lineHeight: "56px",
        color: color.darkText,
        whiteSpace: "nowrap",
        opacity: o,
      }}
    >
      <span>
        ¿<span style={hl}>Pista 1</span> mañana, <span style={hl}>19:00</span>?
      </span>
    </div>
  );
};
const H9_START = GEO9.cellH + GEO9.rowH + 6;
const landM9 = (f: number) => progress(f, T9.land, motion.overlay, ease.overlay);

const poseM9 = (f: number): Pose => {
  const land = landM9(f);
  const fall = drop(f, T9.fall);
  // Esquina superior izquierda de la burbuja respecto a la del módulo.
  const dx = BUBBLE9.cx - BUBBLE9.w / 2 - M9.x;
  const dy = BUBBLE9.cy - BUBBLE9.h / 2 - M9.y;
  const sx = shake(f, T9.impact, 8);
  // La caja crece mientras se desplaza: lo que se mueve de verdad es su centro
  // (en x no se mueve). El temblor no desenfoca: el golpe se lee nítido.
  const my = (BUBBLE9.cy - (M9.y + H9_START / 2)) * (1 - land) + fall * 1320;
  return {x: dx * (1 - land) + sx, y: dy * (1 - land) + fall * 1320, s: 1, r: 4 * fall, mx: 0, my};
};

const Stage9: React.FC = () => {
  const frame = useCurrentFrame();
  const t = T9;
  const land = landM9(frame);
  return (
    <AbsoluteFill>
      <Moving id="dobles-m9" pose={poseM9} frame={frame} style={{left: M9.x, top: M9.y, transformOrigin: `50% ${H9_START / 2}px`}}>
        <SlotModule
          frame={frame}
          geo={GEO9}
          roll={t.roll}
          rows={[{text: "Javi + 3"}, {text: "Pedro + 3", enterAt: t.second}]}
          conflictAt={t.impact}
          hatch="rows"
          landing={{
            p: land,
            box: {w: BUBBLE9.w, h: BUBBLE9.h},
            inkFrom: color.painRed,
            gridFrom: 0,
            cornerFrom: BUBBLE9.r,
            tailFrom: BUBBLE9.tail,
            surfaceFrom: color.darkRaised,
          }}
          labelsAt={t.land + 2}
          rowTextAt={t.rowText}
          // La sombra de la burbuja venía escalada con ella (×1,12): se recoge al aterrizar.
          shadow={lift(lerpN(1 / BUBBLE9_K, 1, land))}
        />
        <BubbleText o={1 - progress(frame, t.land, 3, ease.out)} />
      </Moving>
    </AbsoluteFill>
  );
};

const Hud9: React.FC = () => {
  const frame = useCurrentFrame();
  const t = T9;
  return (
    <AbsoluteFill>
      <WordsReveal
        text="Dobles reservas."
        frame={frame}
        start={t.title}
        step={3}
        exitAt={t.hudOut}
        exitDuration={HUD_EXIT}
        style={{position: "absolute", left: 72, top: 308, fontSize: 96, fontWeight: 760, lineHeight: 1, color: color.darkText}}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- escena

export const Scene: React.FC = () => {
  const {portrait} = useScene();
  return (
    <AbsoluteFill style={{background: BG}}>
      {portrait ? <Stage9 /> : <Stage16 />}
      {portrait ? <Hud9 /> : <Hud16 />}
    </AbsoluteFill>
  );
};
