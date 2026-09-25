import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {OS_CHIP, OS_GLYPHS, OS_GLYPHS_OFFSET, WORDMARK_GLYPHS} from "../../brand/logoPaths";
import {color, displayStyle} from "../../brand/tokens";
import {ease, lerp, pressScale, progress} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T16, T9} from "./cues";

// Geometría oficial del isotipo (viewBox 48): marco 40×28 rx 7 trazo 3 y bloque 13×16 rx 3.
const ISO = {x: 4, y: 10, w: 40, h: 28, rx: 7, stroke: 3, bx: 10, by: 16, bw: 13, bh: 16, brx: 3} as const;
// Lockup horizontal oficial (viewBox 837×110): isotipo a 1,75 desplazado 13 en y; wordmark en (114, 88).
const LOCKUP = {w: 837, h: 110, isoScale: 1.75, isoDy: 13, wordX: 114, wordY: 88} as const;

interface Layout {
  /** Fondo con el que termina la escena anterior. */
  dark: string;
  /** Isotipo al inicio: centro y escala (px por unidad del viewBox 48). */
  iso0: {x: number; y: number; s: number};
  /** Lockup final: centro y px por unidad del viewBox 837×110. */
  lock: {cx: number; cy: number; u: number};
}

// 16:9: contorno 400×280 (10×) en el centro, como lo deja «suena-familiar»; lockup de 128 px de alto en y≈300
// (su sitio desde el c2; en el c1 va desplazado GROUP_DY, ver groupDy).
const L16: Layout = {
  dark: color.darkSurface,
  iso0: {x: 960, y: 540, s: 10},
  lock: {cx: 960, cy: 300, u: 128 / LOCKUP.h},
};
// 9:16: contorno 320×224 (8×) en y≈850, como lo deja «competiciones-en-excel»; lockup de 840 px
// de ancho en y≈860 (x120–960: fuera de la columna de botones de la plataforma).
const L9: Layout = {
  dark: color.darkBg,
  iso0: {x: 540, y: 850, s: 8},
  lock: {cx: 540, cy: 860, u: 840 / LOCKUP.w},
};

// Pista (16:9): 680×340 en y560–900 bajo el H1 y, al final, cuatro pistas de 400×200 separadas
// 32 px (x112–1808, y630–830): el primer frame de «reserva-movil», que las aplana en columnas.
const COURT = {k0: 34, k1: 20, y: 730, pitch: 400 + 32} as const;

// 16:9, c1: el grupo lockup + H1 (tinta en y254–495 en su sitio) baja 165 px para quedar centrado
// en el cuadro (y419–660, centro ≈ 540) mientras la mitad inferior está vacía.
const GROUP_DY = 165;

const useSetup = () => {
  const {portrait, width, height} = useScene();
  return {portrait, width, height, Lx: portrait ? L9 : L16, T: portrait ? T9 : T16};
};

/** Desplazamiento vertical del grupo lockup + H1 (16:9): centrado en el c1, sube en f60–f72. */
const groupDy = (frame: number, portrait: boolean) =>
  portrait ? 0 : GROUP_DY * (1 - progress(frame, T16.rise, 12, ease.inOut));

/** Barrido arena del drop (0→1). */
const sweepAt = (frame: number, T: typeof T16 | typeof T9) => progress(frame, T.drop, 7, ease.overlay);

/** Salida del lockup: en 16:9 sube (overlay 7 f); en 9:16 se reduce con vista inversa. */
const lockExit = (frame: number, portrait: boolean, Lx: Layout) => {
  if (portrait) {
    const p = progress(frame, T9.exit, 7, ease.in);
    const {cx, cy} = Lx.lock;
    return {opacity: 1 - p, transform: `translate(${cx} ${cy - 4 * p}) scale(${1 - 0.06 * p}) translate(${-cx} ${-cy})`};
  }
  const p = progress(frame, T16.exit, 7, ease.overlay);
  return {opacity: 1 - p, transform: `translate(0 ${-72 * p})`};
};

/** Marco del isotipo en coordenadas de su viewBox. */
const IsoFrame: React.FC<{stroke: string}> = ({stroke}) => (
  <rect x={ISO.x} y={ISO.y} width={ISO.w} height={ISO.h} rx={ISO.rx} fill="none" stroke={stroke} strokeWidth={ISO.stroke} />
);

/**
 * El isotipo: el bloque verde entra desde debajo del trazo como la palanca de
 * un interruptor; el barrido arena recolorea el marco a tinta a su paso; luego
 * baja a su sitio en el lockup con un zoom de punto fijo (escala geométrica,
 * ease.inOut). Sin desenfoque: el trazo se mantiene nítido en todos los frames.
 */
const IsoLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {portrait, width, height, Lx, T} = useSetup();
  const sweep = sweepAt(frame, T);
  const sweepX = sweep * width;
  const blockIn = progress(frame, T.drop, 7, ease.overlay);
  const blockDx = -(ISO.bx - ISO.x) * (1 - blockIn);

  const {u} = Lx.lock;
  const lockX = Lx.lock.cx - (LOCKUP.w * u) / 2;
  const lockY = Lx.lock.cy - (LOCKUP.h * u) / 2 + groupDy(frame, portrait);
  const s0 = Lx.iso0.s;
  const s1 = LOCKUP.isoScale * u;
  const m = progress(frame, T.zoom, T.zoomDur, ease.inOut);
  const s = Math.exp(lerp(Math.log(s0), Math.log(s1), m));
  const q = (s0 - s) / (s0 - s1);
  const x = lerp(Lx.iso0.x, lockX + 24 * LOCKUP.isoScale * u, q);
  const y = lerp(Lx.iso0.y, lockY + (LOCKUP.isoDy + 24 * LOCKUP.isoScale) * u, q);
  // El interruptor se pulsa en el downbeat (press 120 ms) mientras entra el bloque.
  const isoT = `translate(${x} ${y}) scale(${s * pressScale(frame, T.drop)}) translate(-24 -24)`;
  const exit = lockExit(frame, portrait, Lx);

  return (
    <svg width={width} height={height} style={{position: "absolute", inset: 0}}>
      {sweep < 1 ? (
        <defs>
          <clipPath id="interruptor-sand">
            <rect x={0} y={0} width={sweepX} height={height} />
          </clipPath>
          <clipPath id="interruptor-dark">
            <rect x={sweepX} y={0} width={width - sweepX} height={height} />
          </clipPath>
        </defs>
      ) : null}
      <g transform={exit.transform} opacity={exit.opacity}>
        <g transform={isoT}>
          <rect x={ISO.bx + blockDx} y={ISO.by} width={ISO.bw} height={ISO.bh} rx={ISO.brx} fill={color.green600} />
        </g>
        {sweep < 1 ? (
          <>
            <g clipPath="url(#interruptor-sand)">
              <g transform={isoT}>
                <IsoFrame stroke={color.ink900} />
              </g>
            </g>
            <g clipPath="url(#interruptor-dark)">
              <g transform={isoT}>
                <IsoFrame stroke={color.darkText} />
              </g>
            </g>
          </>
        ) : (
          <g transform={isoT}>
            <IsoFrame stroke={color.ink900} />
          </g>
        )}
      </g>
    </svg>
  );
};

/** «PadelClub» con máscara letra a letra y chip «OS» con press, trazados oficiales. */
const WordmarkLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {portrait, width, height, Lx, T} = useSetup();
  if (frame < T.word) return null;
  const {u} = Lx.lock;
  const lockX = Lx.lock.cx - (LOCKUP.w * u) / 2;
  const lockY = Lx.lock.cy - (LOCKUP.h * u) / 2 + groupDy(frame, portrait);
  const n = WORDMARK_GLYPHS.length;
  const glyphDur = 5;
  const glyphStep = (10 - glyphDur) / (n - 1);
  const chipP = progress(frame, T.chip, 4, ease.out);
  const chipS = 0.96 + 0.04 * chipP;
  const chipCx = OS_CHIP.x + OS_CHIP.width / 2;
  const chipCy = OS_CHIP.y + OS_CHIP.height / 2;
  const exit = lockExit(frame, portrait, Lx);
  return (
    <svg width={width} height={height} style={{position: "absolute", inset: 0}}>
      <defs>
        <clipPath id="interruptor-mask">
          <rect x={-20} y={-96} width={600} height={100} />
        </clipPath>
      </defs>
      <g transform={exit.transform} opacity={exit.opacity}>
        <g transform={`translate(${lockX} ${lockY}) scale(${u}) translate(${LOCKUP.wordX} ${LOCKUP.wordY})`}>
          <g clipPath="url(#interruptor-mask)">
            {WORDMARK_GLYPHS.map((d, i) => {
              const p = progress(frame, T.word + i * glyphStep, glyphDur, ease.overlay);
              return p <= 0 ? null : <path key={i} d={d} fill={color.ink900} transform={`translate(0 ${(1 - p) * 96})`} />;
            })}
          </g>
          {chipP > 0 ? (
            <g opacity={chipP} transform={`translate(${chipCx} ${chipCy}) scale(${chipS}) translate(${-chipCx} ${-chipCy})`}>
              <rect {...OS_CHIP} fill={color.green600} />
              <g transform={`translate(${OS_GLYPHS_OFFSET.x},${OS_GLYPHS_OFFSET.y})`}>
                {OS_GLYPHS.map((d, i) => (
                  <path key={i} d={d} fill={color.sand50} />
                ))}
              </g>
            </g>
          ) : null}
        </g>
      </g>
    </svg>
  );
};

/**
 * Pista de pádel desde arriba (20 × 10 m) en px, centrada en el origen. Cada
 * grupo se dibuja por separado y de forma simétrica: perímetro desde la red
 * hacia los fondos (empieza por la banda inferior y cierra por la superior, que
 * así no cruza el H1 mientras sube), red de arriba abajo, líneas de saque a la
 * vez y línea central desde la red hacia fuera. La geometría va en px (no se escala el
 * trazo): líneas de 3 px y red de 4 px a cualquier tamaño.
 */
const Court: React.FC<{
  x: number;
  y: number;
  /** px por metro. */
  k: number;
  per: number;
  net: number;
  svc: number;
  ctr: number;
  /** Recorte horizontal en px de pantalla: la réplica solo se ve a un lado de su costura. */
  clip?: {id: string; x0: number; x1: number; h: number};
}> = ({x, y, k, per, net, svc, ctr, clip}) => {
  // El trazo del perímetro va por dentro de la caja de 20 × 10 m.
  const hw = 10 * k - 1.5;
  const hh = 5 * k - 1.5;
  const bh = 5 * k;
  const sv = 6.95 * k;
  const ext = 0.4 * k;
  const line = (d: string, p: number, w = 3) =>
    p <= 0 ? null : (
      <path
        d={d}
        fill="none"
        stroke={color.ink900}
        strokeWidth={w}
        strokeLinecap={w > 3 ? "square" : "butt"}
        strokeLinejoin="miter"
        pathLength={1}
        strokeDasharray={p >= 1 ? undefined : "1 1"}
        strokeDashoffset={p >= 1 ? undefined : 1 - p}
      />
    );
  const lines = (
    <g transform={`translate(${x} ${y})`}>
      {line(`M0 ${hh} H${-hw} V${-hh} H0`, per)}
      {line(`M0 ${hh} H${hw} V${-hh} H0`, per)}
      {line(`M${-sv} ${-bh} V${bh}`, svc)}
      {line(`M${sv} ${-bh} V${bh}`, svc)}
      {line(`M0 0 H${-sv}`, ctr)}
      {line(`M0 0 H${sv}`, ctr)}
      {line(`M0 ${-bh - ext} V${bh + ext}`, net, 4)}
    </g>
  );
  if (!clip) return lines;
  if (clip.x1 <= clip.x0) return null;
  return (
    <>
      <defs>
        <clipPath id={clip.id}>
          <rect x={clip.x0} y={0} width={clip.x1 - clip.x0} height={clip.h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip.id})`}>{lines}</g>
    </>
  );
};

/**
 * La pista se dibuja en el c2; en f105 se reduce a 400×200 en su sitio y se
 * replica ×4 en horizontal. Cada réplica asoma por una costura, sin fundidos
 * ni líneas cruzadas: la pista se parte por la red (cada mitad se recorta a
 * su lado del centro) y, 3 f después, cada mitad suelta su réplica exterior,
 * que sale de debajo de su borde. Las líneas horizontales siguen continuas
 * hasta que las pistas se separan del todo.
 */
const CourtLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useSetup();
  const per = progress(frame, T16.perimeter, 12, ease.inOut);
  if (per <= 0) return null;
  const net = progress(frame, T16.net, 8, ease.inOut);
  const svc = progress(frame, T16.service, 8, ease.inOut);
  const ctr = progress(frame, T16.center, 6, ease.inOut);
  const k = lerp(COURT.k0, COURT.k1, progress(frame, T16.exit, 7, ease.overlay));
  const inner = progress(frame, T16.split, 7, ease.overlay);
  const outer = progress(frame, T16.spread, 7, ease.overlay);
  const cx = width / 2;
  // Borde exterior del trazo del perímetro (caja de 20 m).
  const hw = 10 * k;
  const xl = cx - (COURT.pitch / 2) * inner;
  const xr = cx + (COURT.pitch / 2) * inner;
  const far = 4 * width;
  const courts = [
    {x: xl, x0: -far, x1: cx},
    {x: xr, x0: cx, x1: far},
    ...(outer > 0
      ? [
          {x: xl - COURT.pitch * outer, x0: -far, x1: xl - hw},
          {x: xr + COURT.pitch * outer, x0: xr + hw, x1: far},
        ]
      : []),
  ];
  return (
    <svg width={width} height={height} style={{position: "absolute", inset: 0}}>
      {courts.map((c, i) => (
        <Court
          key={i}
          x={c.x}
          y={COURT.y}
          k={k}
          per={per}
          net={net}
          svc={svc}
          ctr={ctr}
          clip={{id: `interruptor-court-${i}`, x0: c.x0, x1: c.x1, h: height}}
        />
      ))}
    </svg>
  );
};

/** Palabra del H1 con entrada «vista» (fundido + 4 px en 6 f). */
const Word: React.FC<{frame: number; at: number; children: React.ReactNode}> = ({frame, at, children}) => {
  const p = progress(frame, at, 6, ease.out);
  return <span style={{display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 4}px)`}}>{children}</span>;
};

/** H1 en la capa HUD: «Todas las herramientas para tu club.» con «tu club» subrayado. */
const Headline: React.FC<{frame: number}> = ({frame}) => {
  if (frame < T16.h1) return null;
  const at = (i: number) => T16.h1 + i * 3;
  const line = progress(frame, T16.underline, 10, ease.out);
  const exitP = progress(frame, T16.exit, 7, ease.overlay);
  const dy = groupDy(frame, false) - 72 * exitP;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 408,
        display: "flex",
        justifyContent: "center",
        opacity: 1 - exitP,
        transform: `translateY(${dy}px)`,
      }}
    >
      <div
        style={{
          ...displayStyle(700),
          fontSize: 72,
          lineHeight: 1,
          color: color.ink900,
          display: "flex",
          alignItems: "baseline",
          columnGap: "0.26em",
          whiteSpace: "nowrap",
        }}
      >
        {["Todas", "las", "herramientas", "para"].map((w, i) => (
          <Word key={w} frame={frame} at={at(i)}>
            {w}
          </Word>
        ))}
        <span style={{display: "inline-flex", alignItems: "baseline"}}>
          <span style={{position: "relative", display: "inline-flex", alignItems: "baseline", columnGap: "0.26em"}}>
            <Word frame={frame} at={at(4)}>
              tu
            </Word>
            <Word frame={frame} at={at(5)}>
              club
            </Word>
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "100%",
                marginTop: 10,
                height: 6,
                borderRadius: 3,
                background: color.green400,
                transformOrigin: "left center",
                transform: `scaleX(${line})`,
                opacity: line > 0 ? 1 : 0,
              }}
            />
          </span>
          <Word frame={frame} at={at(5)}>
            .
          </Word>
        </span>
      </div>
    </div>
  );
};

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {portrait, Lx, T} = useSetup();
  const sweep = sweepAt(frame, T);
  return (
    <AbsoluteFill style={{background: Lx.dark, overflow: "hidden"}}>
      {/* Arena lisa #F6F3ED: la misma de «reserva-movil», para que el corte no cambie de tono */}
      {sweep > 0 ? <AbsoluteFill style={{background: color.sand50, clipPath: `inset(0 ${(1 - sweep) * 100}% 0 0)`}} /> : null}
      <IsoLayer />
      <WordmarkLayer />
      {!portrait ? <Headline frame={frame} /> : null}
      {!portrait ? <CourtLayer /> : null}
    </AbsoluteFill>
  );
};
