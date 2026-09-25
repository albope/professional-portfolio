import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {color} from "../../brand/tokens";
import {WordsReveal} from "../../components";
import {clamp01, ease, fmt, lerp, progress} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T16} from "./cues";
import {FallenModule, MODULE_S, NightSheet, PHONE_S, Shadowed, SmallPhone, sheetSize, type SheetSpec} from "./fragments";

// Geometría oficial del isotipo (viewBox 48): marco 40×28, rx 7, trazo 3.
// A 10× es el contorno de 400×280, rx 70 y trazo de 30 px con el que arranca «interruptor».
const ISO = {x: 4, y: 10, w: 40, h: 28, rx: 7, stroke: 3} as const;

interface Layout {
  /** Centro del montón y del contorno. */
  cx: number;
  cy: number;
  /** Escala del montón y px por unidad del isotipo. */
  heap: number;
  iso: number;
  title: {top: number; size: number; width: number};
}

const L16: Layout = {cx: 960, cy: 540, heap: 1, iso: 10, title: {top: 474, size: 120, width: 1920}};
// Esta escena no está en el corte vertical; la maqueta existe solo por robustez
// (contorno 8× en y≈850, como el de «competiciones-en-excel»).
const L9: Layout = {cx: 540, cy: 850, heap: 1.1, iso: 8, title: {top: 300, size: 104, width: 900}};

// ---------------------------------------------------------------- tiempo

/**
 * Ease-in con una pizca de velocidad inicial: «gestion-fragmentada» posa el
 * montón casi en reposo y así no se queda congelado en el downbeat del c.7.
 */
const ALPHA = 0.25;
const inQuad = (t: number) => ALPHA * t + (1 - ALPHA) * t * t;
const IN_END = 2 - ALPHA; // pendiente de inQuad en 1

// Ease-in exponencial de la succión.
const K = 5;
const EXPO = (u: number) => (Math.pow(2, K * u) - 1) / (Math.pow(2, K) - 1);
const EXPO0 = (K * Math.LN2) / (Math.pow(2, K) - 1);
// La succión arranca con la misma velocidad con la que termina la órbita: sin enganchón en t.3.
const G0 = ((0.3 * IN_END) / T16.orbitEnd) * (T16.suckDur / 0.7);
const A = (G0 - EXPO0) / (1 - EXPO0);

/** Escala del montón: órbita (1 → 0,7, ease-in) y succión (→ 0, ease-in exponencial). */
const heapScale = (t: number) => {
  if (t <= T16.orbitEnd) return 1 - 0.3 * inQuad(Math.max(0, t) / T16.orbitEnd);
  const u = clamp01((t - T16.suck) / T16.suckDur);
  return 0.7 * (1 - (A * u + (1 - A) * EXPO(u)));
};

/** Giro de la órbita (0 → 8° en t.3) que se acelera en la succión, como un remolino. */
const heapAngle = (t: number) => {
  if (t <= T16.orbitEnd) return 8 * inQuad(Math.max(0, t) / T16.orbitEnd);
  const u = clamp01((t - T16.suck) / T16.suckDur);
  return 8 + ((8 * IN_END) / T16.orbitEnd) * (t - T16.suck) + 16 * EXPO(u);
};

// ---------------------------------------------------------------- montón

// Estado final de las hojas en «gestion-fragmentada»: errores propagados,
// la posición 1 duplicada y la columna PTS rota.
const eur = fmt.eur2;
const ERR_V = {red: true, text: "#¡VALOR!"};
const ERR_R = {red: true, text: "#¡REF!"};

const SOCIOS: SheetSpec = {
  title: "socios_v3_FINAL.xlsx",
  cols: [
    {label: "Nombre", w: 248},
    {label: "Teléfono", w: 176},
    {label: "Cuota", w: 152, align: "right", mono: true},
    {label: "Pagado", w: 112, align: "center", mono: true},
  ],
  // Las cinco primeras filas de la hoja que cae en «adios-al-excel».
  rows: [
    [{text: "Laura Gómez"}, {skel: 96}, {text: eur(35)}, {text: "Sí"}],
    [{text: "Javi Martínez"}, {skel: 112}, ERR_V, {text: "Sí"}],
    [{text: "Pedro Sanz"}, {skel: 128}, {...ERR_R, active: true}, {text: "Sí"}],
    [{text: "Marta Ruiz"}, {skel: 104}, {text: eur(35)}, {text: "Sí"}],
    [{text: "Carlos Navarro"}, {skel: 120}, {text: eur(35)}, {text: "Sí"}],
  ],
  rowH: 48,
  headH: 48,
  font: 20,
  formula: {ref: "C4", text: "=#¡REF!*12"},
};

const PAGOS: SheetSpec = {
  title: "pagos_FINAL (2).xlsx",
  cols: [
    {label: "Socio", w: 224},
    {label: "Mes", w: 104},
    {label: "Importe", w: 136, align: "right", mono: true},
    {label: "¿Pagado?", w: 128, align: "center", mono: true},
  ],
  rows: [
    [{text: "Laura Gómez"}, {skel: 56}, {text: eur(7)}, {text: "Sí"}],
    [{text: "Javi Martínez"}, {skel: 64}, ERR_V, {text: "Sí"}],
    [{text: "Pedro Sanz"}, {skel: 48}, ERR_R, {...ERR_R, active: true}],
    [{text: "Marta Ruiz"}, {skel: 60}, {text: eur(7)}, {text: "Sí"}],
    [{text: "Carlos Navarro"}, {skel: 52}, {text: eur(28)}, {text: "No"}],
  ],
  rowH: 48,
  headH: 48,
  font: 20,
  formula: {ref: "D4", text: '=SI(C4>0;"Sí";"No")'},
};

const LIGA: SheetSpec = {
  title: "liga_otoño_BUENO (2).xlsx",
  cols: [
    {label: "Pos.", w: 96, align: "center", mono: true},
    {label: "Pareja", w: 304},
    {label: "PJ", w: 88, align: "right", mono: true},
    {label: "PTS", w: 128, align: "right", mono: true},
  ],
  rows: [
    ["1", "Navarro / Sanz", "6"],
    ["1", "Ruiz / Castillo", "5"],
    ["3", "Gómez / Ferrer", "5"],
    ["4", "Moreno / Martínez", "4"],
  ].map(([pos, pareja, pj], r) => [
    {text: pos, red: r < 2},
    {text: pareja},
    {text: pj},
    {text: "#¡REF!", red: true},
  ]),
  rowH: 60,
  headH: 56,
  font: 26,
  formula: {ref: "D2", text: "=SUMA(#¡REF!)"},
  // La columna PTS entera, seleccionada.
  range: {col: 3, from: 2, to: 5},
};

interface DeskItem {
  id: string;
  /** Pose sobre la mesa de «gestion-fragmentada»: esquina, tamaño y giro. */
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  /** Orden de caída (las ventanas que caen después empujan a las de debajo). */
  drop?: number;
  /** Velo de lo que queda debajo. */
  dim: number;
  /** Factor de órbita (lo de dentro gira algo más) y retraso de la succión (f). */
  k: number;
  d: number;
  node: React.ReactNode;
}

const S = sheetSize(SOCIOS);
const P = sheetSize(PAGOS);
const L = sheetSize(LIGA);

// De atrás hacia delante, como en el plano anterior.
const DESK: DeskItem[] = [
  {id: "modA", x: 1000, y: 470, w: MODULE_S.w, h: MODULE_S.h, r: -5, dim: 0.66, k: 1.12, d: 0, node: <FallenModule who="Javi Martínez + 3" />},
  {id: "modB", x: 1196, y: 560, w: MODULE_S.w, h: MODULE_S.h, r: 4, dim: 0.66, k: 1.06, d: 0.3, node: <FallenModule who="Pedro Sanz + 3" />},
  {id: "socios", x: 904, y: 128, w: S.w, h: S.h, r: -3, drop: 0, dim: 0.6, k: 0.94, d: 0.6, node: <NightSheet spec={SOCIOS} />},
  {id: "pagos", x: 1120, y: 288, w: P.w, h: P.h, r: 2, drop: 1, dim: 0.3, k: 1, d: 0.3, node: <NightSheet spec={PAGOS} />},
  {id: "phone", x: 1584, y: 548, w: PHONE_S.w, h: PHONE_S.h, r: 4, dim: 0, k: 0.88, d: 0.8, node: <SmallPhone />},
  {id: "liga", x: 904, y: 576, w: L.w, h: L.h, r: -1.5, drop: 2, dim: 0, k: 1, d: 0.4, node: <NightSheet spec={LIGA} />},
];

// Compresión con la que termina «gestion-fragmentada»: separación ×0,62 hacia
// el centro del montón, escala 1,02 × 0,6 y el montón llevado al centro del
// cuadro; cada ventana posada empujó 8 px a lo de debajo y los giros se acumularon.
const PILE = {x: 1364, y: 564} as const;
const SPREAD = 0.62;
const ITEM_SCALE = 1.02 * 0.6;

interface PileItem extends DeskItem {
  /** Centro respecto al del cuadro y giro con los que arranca esta escena. */
  ox: number;
  oy: number;
  rot: number;
}

const PILE_ITEMS: PileItem[] = DESK.map((it) => {
  const cx = it.x + it.w / 2;
  const cy = it.y + it.h / 2;
  let dx = 0;
  let dy = 0;
  let r = it.r;
  // El móvil llegó después de las tres ventanas: nadie lo empujó.
  for (const o of DESK) {
    if (o === it || o.drop === undefined || it.id === "phone" || (it.drop !== undefined && o.drop <= it.drop)) continue;
    const vx = cx - (o.x + o.w / 2);
    const vy = cy - (o.y + o.h / 2);
    const len = Math.max(1, Math.hypot(vx, vy));
    dx += (vx / len) * 8;
    dy += (vy / len) * 8;
    r += Math.sign(it.r) * 0.6;
  }
  return {
    ...it,
    ox: (cx + dx - PILE.x) * SPREAD * ITEM_SCALE,
    oy: (cy + dy - PILE.y) * SPREAD * ITEM_SCALE,
    rot: r + Math.sign(it.r) * 7,
  };
});

/** Pose en pantalla de un fragmento: centro, giro y escala (t en frames, admite subframes). */
const poseAt = (it: PileItem, t: number, Lx: Layout) => {
  const s = heapScale(t - it.d);
  const a = heapAngle(t - it.d) * it.k;
  const rad = (a * Math.PI) / 180;
  const k = s * Lx.heap;
  return {
    x: (it.ox * Math.cos(rad) - it.oy * Math.sin(rad)) * k,
    y: (it.ox * Math.sin(rad) + it.oy * Math.cos(rad)) * k,
    r: it.rot + a,
    s: ITEM_SCALE * k,
  };
};

/**
 * Desenfoque de movimiento (obturador de 180°): lo que recorre en medio frame
 * la esquina más rápida del fragmento, convertido en desenfoque gaussiano.
 * Se mide en pantalla y se pasa al espacio local del fragmento, que está escalado.
 */
const motionBlur = (it: PileItem, frame: number, Lx: Layout) => {
  const a = poseAt(it, frame, Lx);
  const b = poseAt(it, frame - 0.5, Lx);
  const half = Math.hypot(it.w, it.h) / 2;
  const travel = Math.hypot(a.x - b.x, a.y - b.y) + Math.abs(a.s - b.s) * half + (Math.abs(a.r - b.r) * Math.PI * half * a.s) / 180;
  const sigma = travel * 0.3;
  return sigma < 0.4 || a.s <= 0 ? 0 : sigma / a.s;
};

/** El montón en órbita. */
const Heap: React.FC<{frame: number; Lx: Layout}> = ({frame, Lx}) => {
  // Foco al titular: el montón se desenfoca y se apaga; al caer recupera el foco.
  const toTitle = progress(frame, T16.focus, 10, ease.out);
  const back = progress(frame, T16.suck + 3, 6, ease.inOut);
  // Lo justo para que el titular mande sin que el caos rojo deje de leerse detrás.
  const blur = 2.5 * toTitle * (1 - back);
  const dim = 1 - 0.34 * toTitle + 0.14 * back;
  return (
    <AbsoluteFill style={{opacity: dim, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
      {PILE_ITEMS.map((it) => {
        const p = poseAt(it, frame, Lx);
        if (p.s <= 0.002) return null;
        const mb = motionBlur(it, frame, Lx);
        return (
          <div
            key={it.id}
            style={{
              position: "absolute",
              left: Lx.cx,
              top: Lx.cy,
              width: it.w,
              height: it.h,
              transformOrigin: "0 0",
              transform: `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg) scale(${p.s}) translate(-50%, -50%)`,
              filter: mb > 0 ? `blur(${mb.toFixed(2)}px)` : undefined,
            }}
          >
            <Shadowed w={it.w} h={it.h} r={it.id === "phone" ? PHONE_S.r : 12} dim={it.dim}>
              {it.node}
            </Shadowed>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- contorno

// Dos mitades simétricas: nacen bajo el titular (centro de abajo), suben por
// los lados y se cierran arriba, cuando el titular ya se ha ido.
const R = ISO.rx;
const X0 = ISO.x;
const X1 = ISO.x + ISO.w;
const Y0 = ISO.y;
const Y1 = ISO.y + ISO.h;
const HALF_R = `M24 ${Y1} H${X1 - R} A${R} ${R} 0 0 0 ${X1} ${Y1 - R} V${Y0 + R} A${R} ${R} 0 0 0 ${X1 - R} ${Y0} H24`;
const HALF_L = `M24 ${Y1} H${X0 + R} A${R} ${R} 0 0 1 ${X0} ${Y1 - R} V${Y0 + R} A${R} ${R} 0 0 1 ${X0 + R} ${Y0} H24`;

// Ease-in cúbico: en f37 el trazo aún no ha pasado de la curva de abajo (el
// titular sigue a medio salir) y en el último frame no salta medio contorno de golpe.
const outlineAt = (frame: number) => progress(frame, T16.outline, T16.outlineDur, (u) => u * u * u);

/** Interior del contorno en pantalla (línea media del trazo): lo que cae dentro, se lo traga. */
const insideClip = (Lx: Layout, width: number, height: number) => {
  const l = Lx.cx + (X0 - 24) * Lx.iso;
  const r = width - (Lx.cx + (X1 - 24) * Lx.iso);
  const t = Lx.cy + (Y0 - 24) * Lx.iso;
  const b = height - (Lx.cy + (Y1 - 24) * Lx.iso);
  return `inset(${t}px ${r}px ${b}px ${l}px round ${R * Lx.iso}px)`;
};

/** Máscara suave que se estrecha hacia el contorno en los últimos frames del cierre. */
const closingMask = (frame: number, Lx: Layout): React.CSSProperties => {
  const m = progress(frame, T16.outline + T16.outlineDur - 5, 5, ease.in);
  if (m <= 0) return {};
  const rx = lerp(1400, 250, m) * (Lx.iso / 10);
  const ry = lerp(900, 170, m) * (Lx.iso / 10);
  const g = `radial-gradient(${rx}px ${ry}px at ${Lx.cx}px ${Lx.cy}px, #000 72%, transparent 100%)`;
  return {maskImage: g, WebkitMaskImage: g};
};

/** Contorno vacío del isotipo: se cierra alrededor del montón y se queda. */
const Outline: React.FC<{frame: number; Lx: Layout; width: number; height: number}> = ({frame, Lx, width, height}) => {
  const p = outlineAt(frame);
  if (p <= 0) return null;
  const t = `translate(${Lx.cx} ${Lx.cy}) scale(${Lx.iso}) translate(-24 -24)`;
  return (
    <svg width={width} height={height} style={{position: "absolute", inset: 0}}>
      <g transform={t}>
        {p >= 1 ? (
          <rect x={X0} y={Y0} width={ISO.w} height={ISO.h} rx={R} fill="none" stroke={color.darkText} strokeWidth={ISO.stroke} />
        ) : (
          [HALF_R, HALF_L].map((d) => (
            // Extremos redondos mientras se dibuja (como el Isotipo del kit): punto → píldora → contorno.
            <path
              key={d}
              d={d}
              fill="none"
              stroke={color.darkText}
              strokeWidth={ISO.stroke}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`${p} 2`}
            />
          ))
        )}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- escena

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {portrait, width, height} = useScene();
  const Lx = portrait ? L9 : L16;
  return (
    // #1E1B17 liso de principio a fin: el fondo con el que termina «gestion-fragmentada» y con el que empieza «interruptor».
    <AbsoluteFill style={{background: color.darkSurface, overflow: "hidden"}}>
      {/* Lo que queda fuera se apaga mientras el contorno se cierra; cerrado, el montón solo existe dentro. */}
      <AbsoluteFill style={{clipPath: outlineAt(frame) >= 1 ? insideClip(Lx, width, height) : undefined, ...closingMask(frame, Lx)}}>
        <Heap frame={frame} Lx={Lx} />
      </AbsoluteFill>
      <Outline frame={frame} Lx={Lx} width={width} height={height} />
      {/* HUD: el reloj ya se ocultó al final del plano anterior. */}
      <WordsReveal
        text="¿Suena familiar?"
        frame={frame}
        start={T16.title}
        step={T16.titleStep}
        exitAt={T16.titleOut}
        align="center"
        style={{
          position: "absolute",
          left: (width - Lx.title.width) / 2,
          width: Lx.title.width,
          top: Lx.title.top,
          fontSize: Lx.title.size,
          fontWeight: 800,
          lineHeight: 1.04,
          color: color.darkText,
          textShadow: "0 4px 40px rgba(20, 18, 15, 0.55)",
        }}
      />
    </AbsoluteFill>
  );
};
