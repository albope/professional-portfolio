import React from "react";
import {AbsoluteFill, Easing, interpolateColors, useCurrentFrame} from "remotion";
import {color} from "../../brand/tokens";
import {DayClock, WordsReveal} from "../../components";
import {ease, fmt, lerp, motion, progress, tween} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T} from "./cues";
import {FallenModule, MODULE_S, PHONE_S, SmallPhone, UnreadBadge} from "./Props";
import {SheetWindow, sheetSize, type SheetSpec} from "./Sheet";

// ---------------------------------------------------------------- datos

const eur = (v: number) => fmt.eur2(v);
const [E_SOC_4, E_SOC_5, E_PAG_4, E_PAG_5, E_PAG_D5] = T.errors;

const SOCIOS: SheetSpec = {
  title: "socios_v3_FINAL.xlsx",
  cols: [
    {label: "Nombre", w: 248},
    {label: "Teléfono", w: 176},
    {label: "Cuota", w: 152, align: "right", mono: true},
    {label: "Pagado", w: 112, align: "center", mono: true},
  ],
  rows: [
    [{text: "Carlos Navarro"}, {skel: 112}, {text: eur(35)}, {text: "Sí"}],
    [{text: "Laura Gómez"}, {skel: 128}, {text: eur(35)}, {text: "Sí"}],
    [{text: "Nuria Castillo"}, {skel: 104}, {text: eur(35), err: "#¡VALOR!", errAt: E_SOC_4}, {text: "No"}],
    [{text: "Javi Martínez"}, {skel: 120}, {text: eur(35), err: "#¡VALOR!", errAt: E_SOC_5}, {text: "Sí"}],
    [{text: "Pedro Sanz"}, {skel: 96}, {text: eur(35)}, {text: "No"}],
  ],
  rowH: 48,
  headH: 48,
  font: 20,
  formula: [
    {at: -1, ref: "C4", text: "=B4*12"},
    {at: E_SOC_5, ref: "C5", text: "=B5*12"},
  ],
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
    [{text: "Carlos Navarro"}, {skel: 56}, {text: eur(28)}, {text: "No"}],
    [{text: "Laura Gómez"}, {skel: 64}, {text: eur(7)}, {text: "Sí"}],
    [{text: "Nuria Castillo"}, {skel: 48}, {text: eur(35), err: "#¡VALOR!", errAt: E_PAG_4}, {text: "Sí"}],
    [{text: "Javi Martínez"}, {skel: 60}, {text: eur(35), err: "#¡VALOR!", errAt: E_PAG_5}, {text: "No", err: "#¡VALOR!", errAt: E_PAG_D5}],
    [{text: "Pedro Sanz"}, {skel: 52}, {text: eur(7)}, {text: "No"}],
  ],
  rowH: 48,
  headH: 48,
  font: 20,
  formula: [
    {at: -1, ref: "C4", text: "='[socios_v3_FINAL.xlsx]Hoja1'!C4"},
    {at: E_PAG_5, ref: "C5", text: "='[socios_v3_FINAL.xlsx]Hoja1'!C5"},
    {at: E_PAG_D5, ref: "D5", text: '=SI(C5>0;"Sí";"No")'},
  ],
};

// Clasificación «antes» de «ligas-en-directo», con la posición 1 duplicada.
const LIGA: SheetSpec = {
  title: "liga_otoño_BUENO (2).xlsx",
  cols: [
    {label: "Pos.", w: 96, align: "center", mono: true},
    {label: "Pareja", w: 304},
    {label: "PJ", w: 88, align: "right", mono: true},
    {label: "PTS", w: 128, align: "right", mono: true},
  ],
  rows: [
    ["1", "Navarro / Sanz", "6", "11"],
    ["1", "Ruiz / Castillo", "5", "8"],
    ["3", "Gómez / Ferrer", "5", "7"],
    ["4", "Moreno / Martínez", "4", "5"],
  ].map(([pos, pareja, pj, pts], r) => [
    {text: pos, redAt: r < 2 ? T.duplicate : undefined},
    {text: pareja},
    {text: pj},
    {text: pts, err: "#¡REF!", errAt: T.ptsBreak + r * T.ptsStagger},
  ]),
  rowH: 60,
  headH: 56,
  font: 26,
  formula: [
    {at: -1, ref: "D2", text: "=SUMA(E2:K2)"},
    {at: T.duplicate, ref: "A3", text: "1"},
    {at: T.ptsBreak, ref: "D2", text: "=SUMA(#¡REF!)"},
  ],
  // Filas 2–5 de la columna D (PTS).
  range: {col: 3, from: 2, to: 5, at: T.ptsBreak},
};

// ---------------------------------------------------------------- montón

export interface Item {
  id: string;
  /** Esquina superior izquierda y tamaño en su pose final. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Rotación final (grados). */
  r: number;
  /** Frame de entrada (sin él, ya está en f0). */
  at?: number;
  kind: "drop" | "slide" | "rest";
}

const S = sheetSize(SOCIOS);
const P = sheetSize(PAGOS);
const L = sheetSize(LIGA);

// Mesa de caos en la columna derecha (x860–1824).
// Los módulos de «dobles-reservas» ya están en el f0: han caído en el centro
// del montón y cada ventana que cae los tapa un poco más.
export const ITEMS: Item[] = [
  {id: "modA", x: 1000, y: 470, w: MODULE_S.w, h: MODULE_S.h, r: -5, kind: "rest"},
  {id: "modB", x: 1196, y: 560, w: MODULE_S.w, h: MODULE_S.h, r: 4, kind: "rest"},
  {id: "socios", x: 904, y: 128, w: S.w, h: S.h, r: -3, at: T.drops[0] - T.lead, kind: "drop"},
  {id: "pagos", x: 1120, y: 288, w: P.w, h: P.h, r: 2, at: T.drops[1] - T.lead, kind: "drop"},
  // El móvil entra después, pero queda bajo la liga: la columna PTS nunca se tapa.
  {id: "phone", x: 1584, y: 548, w: PHONE_S.w, h: PHONE_S.h, r: 4, at: T.phone, kind: "slide"},
  {id: "liga", x: 904, y: 576, w: L.w, h: L.h, r: -1.5, at: T.drops[2] - T.lead, kind: "drop"},
];

/** Centro del montón: hacia él se comprime y es él el que viaja al centro del cuadro. */
export const PILE = {x: 1364, y: 564} as const;
const FRAME_C = {x: 960, y: 540} as const;

// Compresión: arranca en ease-in sobre el tiempo y se posa suave (la succión de
// «suena-familiar» parte casi en reposo). El viaje, algo detrás, igual.
const SQUEEZE = Easing.bezier(0.3, 0, 0.2, 1);
const GLIDE = Easing.bezier(0.4, 0, 0.4, 1);
export const squeezeAt = (f: number) => tween(f, [T.compress, T.compressEnd], [0, 1], SQUEEZE);
const travelAt = (f: number) => tween(f, [T.travel, T.travelEnd], [0, 1], GLIDE);

/** Cámara del montón: leve acercamiento durante el caos, compresión y viaje al centro. */
export const pileXform = (f: number) => {
  const push = tween(f, [0, T.compress], [1, 1.02], ease.inOut);
  const tr = travelAt(f);
  return {scale: push * lerp(1, 0.6, squeezeAt(f)), tx: (FRAME_C.x - PILE.x) * tr, ty: (FRAME_C.y - PILE.y) * tr};
};

/** Entrada de cada objeto (overlay 7 f): las ventanas caen, el móvil llega desde la derecha. */
const entry = (it: Item, frame: number) => {
  const p = it.at === undefined ? 1 : progress(frame, it.at, motion.overlay, ease.overlay);
  return it.kind === "drop"
    ? // Cae sobre la mesa: baja, se posa (escala 1,06 → 1) y gira hasta su ángulo.
      {dx: 0, dy: (1 - p) * -64, s: 1 + (1 - p) * 0.06, r: it.r * p}
    : {dx: (1 - p) * 420 + vibration(frame), dy: 0, s: 1, r: it.r + (1 - p) * 6};
};

/** Vibración del móvil: ±3 px en x, alterna cada frame y se apaga en cada pulso. */
const vibration = (frame: number) => {
  for (const off of T.vibePulses) {
    const d = frame - (T.phone + off);
    if (d >= 0 && d < T.vibeLen) return 3 * (1 - d / T.vibeLen) * (d % 2 === 0 ? 1 : -1);
  }
  return 0;
};

/**
 * Desenfoque de movimiento de la entrada (obturador de 180°): la velocidad
 * del frame se convierte en un desenfoque gaussiano en x/y, solo mientras se mueve.
 */
const entryBlur = (it: Item, frame: number) => {
  if (it.at === undefined) return null;
  const a = entry(it, frame);
  const b = entry(it, frame - 1);
  const v = it.kind === "slide" ? vibration(frame) - vibration(frame - 1) : 0;
  const bx = Math.abs(a.dx - b.dx - v) * 0.15;
  const by = Math.abs(a.dy - b.dy) * 0.15;
  return bx > 0.3 || by > 0.3 ? {bx, by} : null;
};

export const itemPose = (it: Item, frame: number, cp: number) => {
  const cx = it.x + it.w / 2;
  const cy = it.y + it.h / 2;
  let dx = 0;
  let dy = 0;
  let s = 1;
  let r = it.r;
  let o = 1;
  if (it.at !== undefined) {
    const e = entry(it, frame);
    dx = e.dx;
    dy = e.dy;
    s = e.s;
    r = e.r;
    o = progress(frame, it.at, 2, ease.out);
  }
  // Cada ventana que se posa encima empuja un poco lo de debajo (sin rebote).
  for (const up of ITEMS) {
    if (up === it || up.kind !== "drop" || up.at === undefined || (it.at !== undefined && up.at <= it.at)) continue;
    const j = progress(frame, up.at + T.lead, motion.overlay, ease.overlay);
    if (j <= 0) continue;
    const vx = cx - (up.x + up.w / 2);
    const vy = cy - (up.y + up.h / 2);
    const len = Math.max(1, Math.hypot(vx, vy));
    dx += (vx / len) * 8 * j;
    dy += (vy / len) * 8 * j;
    r += Math.sign(it.r) * 0.6 * j;
  }
  // Compresión: los objetos se juntan y sus rotaciones se acumulan.
  const k = 1 - 0.38 * cp;
  const ox = (cx + dx - PILE.x) * k + PILE.x;
  const oy = (cy + dy - PILE.y) * k + PILE.y;
  r += Math.sign(it.r) * 7 * cp;
  return {left: ox - it.w / 2, top: oy - it.h / 2, s, r, o};
};

/**
 * Desenfoque direccional de la compresión, con la misma regla que el de las
 * entradas: la velocidad del frame en pantalla, pasada al espacio local (escalado).
 */
const squeezeBlur = (it: Item, frame: number) => {
  if (frame <= T.compress) return null;
  const at = (f: number) => {
    const p = itemPose(it, f, squeezeAt(f));
    const c = pileXform(f);
    return {
      x: (p.left + it.w / 2 - PILE.x) * c.scale + PILE.x + c.tx,
      y: (p.top + it.h / 2 - PILE.y) * c.scale + PILE.y + c.ty,
      s: c.scale,
    };
  };
  const a = at(frame);
  const b = at(frame - 1);
  const bx = (Math.abs(a.x - b.x) * 0.15) / a.s;
  const by = (Math.abs(a.y - b.y) * 0.15) / a.s;
  return bx > 0.3 || by > 0.3 ? {bx, by} : null;
};

/** Oscurecimiento de lo que queda debajo: un foco cada vez. */
const dimAt = (it: Item, frame: number) => {
  const later = ITEMS.filter((o) => o.at !== undefined && o.kind === "drop" && (it.at === undefined || o.at > it.at));
  const n = later.reduce((a, o) => a + progress(frame, (o.at ?? 0) + 2, 8, ease.out), 0);
  // Los módulos ya son pasado: empiezan algo apagados.
  const base = it.kind === "rest" ? 0.3 : 0;
  return Math.min(0.66, base + n * (it.kind === "rest" ? 0.12 : 0.3));
};

const Shadowed: React.FC<{frame: number; it: Item; children: React.ReactNode}> = ({frame, it, children}) => {
  const lift = it.at === undefined ? 0 : 1 - progress(frame, it.at, motion.overlay, ease.overlay);
  const d = dimAt(it, frame);
  return (
    <div
      style={{
        position: "relative",
        width: it.w,
        height: it.h,
        borderRadius: it.id === "phone" ? PHONE_S.r : 12,
        boxShadow: `0 ${Math.round(28 + 40 * lift)}px ${Math.round(64 + 60 * lift)}px -24px rgba(0, 0, 0, ${(0.78 - 0.2 * lift).toFixed(2)})`,
      }}
    >
      {children}
      {d > 0 ? (
        <div style={{position: "absolute", inset: 0, borderRadius: "inherit", background: `rgba(20, 18, 15, ${d.toFixed(3)})`}} />
      ) : null}
    </div>
  );
};

const Pile: React.FC<{frame: number}> = ({frame}) => {
  const cp = squeezeAt(frame);
  const {scale, tx, ty} = pileXform(frame);
  return (
    <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: `${PILE.x}px ${PILE.y}px`}}>
      {ITEMS.map((it) => {
        if (it.at !== undefined && frame < it.at) return null;
        const p = itemPose(it, frame, cp);
        const blur = entryBlur(it, frame) ?? squeezeBlur(it, frame);
        const fid = `gf-blur-${it.id}`;
        return (
          <div
            key={it.id}
            style={{
              position: "absolute",
              left: p.left,
              top: p.top,
              width: it.w,
              height: it.h,
              opacity: p.o,
              transform: `rotate(${p.r}deg) scale(${p.s})`,
              filter: blur ? `url(#${fid})` : undefined,
            }}
          >
            {blur ? (
              <svg width={0} height={0} style={{position: "absolute"}}>
                <filter id={fid} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                  <feGaussianBlur stdDeviation={`${blur.bx.toFixed(2)} ${blur.by.toFixed(2)}`} />
                </filter>
              </svg>
            ) : null}
            <Shadowed frame={frame} it={it}>
              {it.id === "modA" ? <FallenModule who="Javi Martínez + 3" /> : null}
              {it.id === "modB" ? <FallenModule who="Pedro Sanz + 3" /> : null}
              {it.id === "socios" ? <SheetWindow frame={frame} spec={SOCIOS} /> : null}
              {it.id === "pagos" ? <SheetWindow frame={frame} spec={PAGOS} /> : null}
              {it.id === "liga" ? <SheetWindow frame={frame} spec={LIGA} /> : null}
              {it.id === "phone" ? <SmallPhone badge={<UnreadBadge style={{right: -14, top: -16}}>38</UnreadBadge>} /> : null}
            </Shadowed>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- HUD

const PHRASES = [
  {lines: ["Un Excel", "para socios,"], at: T.drops[0] - T.lead},
  {lines: ["otro", "para pagos,"], at: T.drops[1] - T.lead},
  {lines: ["WhatsApp", "para comunicar."], at: T.drops[2] - T.lead},
];
const H_SIZE = 88;
const H_LINE = Math.round(H_SIZE * 1.04);
const H_GAP = 40;
const H_TOP = 240;
const STEP = 3;

const Headline: React.FC<{frame: number}> = ({frame}) => (
  <>
    {PHRASES.map((ph, i) => {
      const next = PHRASES[i + 1];
      // La frase anterior cede el foco a la nueva, sin desaparecer.
      const dim = next ? progress(frame, next.at, 8, ease.out) * 0.5 : 0;
      const top = H_TOP + i * (2 * H_LINE + H_GAP);
      const firstWords = ph.lines[0].split(" ").length;
      return (
        <div key={i} style={{position: "absolute", left: 96, top, opacity: 1 - dim}}>
          {ph.lines.map((line, k) => (
            <WordsReveal
              key={k}
              text={line}
              frame={frame}
              start={ph.at + (k === 0 ? 0 : firstWords * STEP)}
              step={STEP}
              exitAt={T.hudOut}
              style={{fontSize: H_SIZE, fontWeight: 720, lineHeight: `${H_LINE}px`, color: color.darkText, whiteSpace: "nowrap", flexWrap: "nowrap"}}
            />
          ))}
        </div>
      );
    })}
  </>
);

const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DayClock frame={frame} mood="alert" surface="dark" day={[{at: -60, value: "MAR"}]} time={[{at: -60, value: "01:12"}]} exitAt={T.hudOut} />
      <Headline frame={frame} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- escena

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {portrait, width} = useScene();
  const tr = travelAt(frame);
  // El foco de luz sigue al montón hasta el centro del cuadro.
  const lx = lerp(70, 50, tr);
  // El fondo llega al #1E1B17 de «suena-familiar» con el montón: corte invisible.
  const glow = interpolateColors(0.45, [0, 1], [color.darkBg, color.darkSurface]);
  const inner = interpolateColors(tr, [0, 1], [glow, color.darkSurface]);
  const outer = interpolateColors(tr, [0, 1], [color.darkBg, color.darkSurface]);
  const bg = `radial-gradient(ellipse 62% 72% at ${lx}% 55%, ${inner} 0%, ${outer} 100%)`;
  if (portrait) {
    // No forma parte del corte 9:16 (allí la sustituye «competiciones-en-excel»):
    // si alguien la renderiza en vertical, se ve el plano horizontal completo, centrado.
    return (
      <AbsoluteFill style={{background: color.darkBg, justifyContent: "center", alignItems: "center"}}>
        <div style={{width: 1920, height: 1080, flexShrink: 0, position: "relative", transform: `scale(${width / 1920})`, background: bg}}>
          <Pile frame={frame} />
          <Hud />
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: bg}}>
      <Pile frame={frame} />
      <Hud />
    </AbsoluteFill>
  );
};
