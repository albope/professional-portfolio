/**
 * Motor de la dirección «El punto». Las celdas de una hoja de cálculo se
 * sueltan al hacer scroll, montan el glifo de la marca (— □ ■), se aparcan
 * como glifo pequeño en la esquina, rellenan los cinco cuadrados del método y
 * acaban fundidas en el cuadrado de cierre del titular de Contacto.
 *
 * Dibuja sobre un `<canvas>` fijo y lee el documento a través de atributos
 * `data-*`: `[data-intro]`, `[data-hero-stage]`, `[data-grid-origin]`,
 * `[data-hero-text]`, `[data-avoid]`, `[data-fx-ref]`, `[data-fx-text]`,
 * `[data-palabra="1"]`, `[data-manifesto]`, `[data-glyph-anchor]`,
 * `[data-need]`, `[data-metodo]`, `[data-metodo-anchor]`, `[data-fase]`,
 * `[data-fase-num]`, `[data-ink]`, `[data-punto-final]` y `[data-parallax]`.
 *
 * Es un port tipado de `engine-punto.js` del handoff, sin dependencias. Las
 * diferencias con el original son tres: el canvas se recibe por referencia,
 * la familia monoespaciada se lee de `--font-fragment-mono` (la que expone
 * `next/font`) y el cursor se olvida al levantar el dedo en pantallas
 * táctiles, para que ni la selección ni el campo magnético se queden clavados
 * donde se tocó por última vez.
 */

export type PuntoMotion = "completo" | "contenido";

export interface PuntoOptions {
  /** Canvas fijo a pantalla completa. Sin él se busca `[data-punto-canvas]`. */
  canvas?: HTMLCanvasElement | null;
  /** `contenido` quita la stagger, los arcos, los modos del hero y el parallax. */
  motion?: PuntoMotion;
  /** Selección y barra de fórmulas al pasar el cursor por la hoja. */
  cursor?: boolean;
  /** Tope de celdas; a partir de ahí la hoja se recorta por abajo. */
  maxCells?: number;
  /** Tope de densidad de píxel del canvas. */
  maxDpr?: number;
}

export interface PuntoEngine {
  set(next: Partial<Pick<PuntoOptions, "motion" | "cursor">>): void;
  destroy(): void;
}

type Progress = { i: number; a: number; e: number; f: number; x: number; c: number };
type Palette = "paper" | "ink";
/** fill rgba + stroke rgba */
type Rgba8 = [number, number, number, number, number, number, number, number];
/** columna, fila y tipo de celda dentro de la formación */
type GlyphTile = [number, number, number];
type Glyph = { t: GlyphTile[]; U: number; V: number };
type Metodo = { k2: number; per: number; rank: [number, number, number][]; cellRank: Float32Array };
type Patch = { i: number; label: string; r: number; dx: number; dy: number };

function bezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
  const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const e = sx(t) - x, d = dx(t);
      if (Math.abs(e) < 1e-4 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}

/** La curva única del sistema: cubic-bezier(0.16, 1, 0.3, 1). */
const ease = bezier(0.16, 1, 0.3, 1);
const inout = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Generador determinista: la hoja es la misma en cada carga. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tipo de celda: rejilla, tinta, cobalto, oculta, contorno y papel 2
const K = { GRID: 0, INK: 1, COB: 2, HID: 3, OUT: 4, GEN: 5 } as const;

/** Paleta por tipo de celda sobre papel y sobre tinta. */
const PAL: Record<Palette, Rgba8[]> = {
  paper: [
    [247, 246, 242, 0, 226, 224, 216, 1],
    [16, 16, 19, 1, 16, 16, 19, 0],
    [39, 67, 224, 1, 39, 67, 224, 0],
    [247, 246, 242, 0, 247, 246, 242, 0],
    [247, 246, 242, 0, 90, 89, 79, 0.5],
    [239, 237, 230, 1, 216, 214, 204, 1],
  ],
  ink: [
    [16, 16, 19, 0, 247, 246, 242, 0.12],
    [247, 246, 242, 1, 247, 246, 242, 0],
    [107, 131, 255, 1, 107, 131, 255, 0],
    [16, 16, 19, 0, 16, 16, 19, 0],
    [16, 16, 19, 0, 247, 246, 242, 0.4],
    [24, 24, 28, 1, 247, 246, 242, 0.16],
  ],
};

const TEXTOS = [
  "Pedido 0412", "¿Stock real?", "=SUMA(C2:C9)", "#¡REF!", "Pendiente", "Llamar lunes", "Ver email",
  "Almacén B", "Duplicado", "v3_final.xlsx", "Factura 118", "¿Quién lo tiene?", "14/09", "No cuadra",
  "Copiar del ERP", "Revisar", "Sin asignar", "Cliente nuevo", "#N/D", "Pista 3 · 19:00", "Ruta 2",
  "Albarán 77", "=BUSCARV(A4)", "Pagado?", "Urgente", "Pasar a limpio",
];
const PARCHES = ["Parche", "Temporal", "No tocar", "v2_def", "Arreglo", "Ojo"];
const COLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const colLabel = (c: number) => (c < 26 ? COLS[c] : COLS[Math.floor(c / 26) - 1] + COLS[c % 26]);
const PROGRESS_KEYS: (keyof Progress)[] = ["i", "a", "e", "f", "x", "c"];
/** Selectores cuyos estilos escribe el motor y limpia al destruirse. */
const STYLED =
  "[data-hero-text], [data-grid-origin], [data-manifesto], [data-need], [data-fase], [data-parallax], [data-punto-final]";

function readMonoFont() {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-fragment-mono").trim();
  return `${family ? `${family}, ` : ""}ui-monospace, monospace`;
}

const noop: PuntoEngine = { set() {}, destroy() {} };

export function start(opt: PuntoOptions = {}): PuntoEngine {
  const o = { motion: "completo" as PuntoMotion, cursor: true, maxCells: 900, maxDpr: 2, ...opt };
  const found = o.canvas ?? document.querySelector<HTMLCanvasElement>("[data-punto-canvas]");
  const context = found?.getContext("2d");
  if (!found || !context) return noop;
  // Constantes ya estrechadas: las funciones anidadas no heredan la comprobación de arriba
  const cv: HTMLCanvasElement = found;
  const ctx: CanvasRenderingContext2D = context;
  const q = (s: string) => document.querySelector<HTMLElement>(s);
  const qa = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s));
  const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = reduceQuery.matches;
  const calm = () => reduce || o.motion === "contenido";

  let W = 0, H = 0, DPR = 1, N = 0, cols = 0, rows = 0, CW = 96, RH = 32, oxRel = 40, oyRel = 0;
  let hx = new Float32Array(0), hy = hx, jx = hx, jy = hx, jr = hx, rA = hx, rB = hx, rC = hx;
  let pX = hx, pY = hx, pW = hx, pH = hx, pR = hx, cP = hx, cI = hx;
  let txt: (string | null)[] = [];
  let gIdx = new Int32Array(0), mIdx = gIdx;
  let glyph: Glyph | null = null, metodo: Metodo | null = null;
  let patches: Patch[] = [], copyPath: number[] = [], copySrc = 0;
  let raf = 0, lastRef = "", lastHov = -1, dead = false, monoFont = "ui-monospace, monospace";
  const mouse = { x: -1e4, y: -1e4 };
  const sm: Progress = { i: 0, a: 0, e: 0, f: 0, x: 0, c: 0 };
  const modeW = [1, 0, 0, 0, 0];
  let puntoFinal: HTMLElement | null = null;

  /** Barra (k × 0.24k), cuadrado hueco (perímetro 0.17k) y cuadrado sólido, separados 0.45k. */
  function glyphLayout(k: number): Glyph {
    const bt = Math.max(2, Math.round(k * 0.24));
    const pt = Math.max(2, Math.round(k * 0.17));
    const g = Math.max(2, Math.round(k * 0.45));
    const t: GlyphTile[] = [];
    for (let u = 0; u < k; u++) for (let v = 0; v < bt; v++) t.push([u, Math.floor((k - bt) / 2) + v, K.INK]);
    for (let u = 0; u < k; u++) {
      for (let v = 0; v < k; v++) {
        const edge = u < pt || v < pt || u >= k - pt || v >= k - pt;
        t.push([k + g + u, v, edge ? K.INK : K.HID]);
      }
    }
    for (let u = 0; u < k; u++) for (let v = 0; v < k; v++) t.push([2 * k + 2 * g + u, v, K.COB]);
    return { t, U: 3 * k + 2 * g, V: k };
  }

  function build() {
    if (dead) return;
    DPR = Math.min(o.maxDpr, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.round(W * DPR);
    cv.height = Math.round(H * DPR);
    monoFont = readMonoFont();
    const stage = q("[data-hero-stage]"), fb = q("[data-grid-origin]");
    const sTop = stage ? stage.getBoundingClientRect().top : 0;
    const fbBottom = fb ? fb.getBoundingClientRect().bottom : 108;
    CW = clamp(W / 14, 72, 120);
    RH = CW / 3;
    oxRel = W < 640 ? 28 : 40;
    oyRel = fbBottom - sTop;
    cols = Math.ceil((W - oxRel) / CW);
    rows = Math.ceil((H - oyRel - RH) / RH);
    N = Math.max(0, Math.min(o.maxCells, cols * rows));
    const R = rng(7);
    hx = new Float32Array(N); hy = new Float32Array(N);
    jx = new Float32Array(N); jy = new Float32Array(N); jr = new Float32Array(N);
    rA = new Float32Array(N); rB = new Float32Array(N); rC = new Float32Array(N);
    pX = new Float32Array(N); pY = new Float32Array(N); pW = new Float32Array(N); pH = new Float32Array(N); pR = new Float32Array(N);
    cP = new Float32Array(N * 8); cI = new Float32Array(N * 8);
    txt = new Array<string | null>(N).fill(null);
    // Zonas donde no se escribe (titular, entradilla, botones)
    const hero = q("[data-hero-text]");
    const prevT = hero ? hero.style.transform : "";
    if (hero) hero.style.transform = "none";
    const avoid = qa("[data-avoid]").map((el) => el.getBoundingClientRect());
    if (hero) hero.style.transform = prevT;
    for (let i = 0; i < N; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      hx[i] = oxRel + c * CW;
      hy[i] = oyRel + RH + r * RH;
      jx[i] = (R() - 0.5) * 22; jy[i] = (R() - 0.5) * 12; jr[i] = (R() - 0.5) * 0.09;
      rA[i] = R(); rB[i] = R(); rC[i] = R();
      const x = hx[i], y = hy[i] + sTop;
      const blocked = avoid.some((a) => x + CW > a.left - 12 && x < a.right + 12 && y + RH > a.top - 8 && y < a.bottom + 8);
      if (!blocked && R() < 0.2) txt[i] = TEXTOS[Math.floor(R() * TEXTOS.length)];
    }
    // Parches y recorrido de copia manual
    const free: number[] = [];
    for (let i = 0; i < N; i++) if (txt[i]) free.push(i);
    patches = free.filter(() => R() < 0.35).slice(0, 14).map((i) => ({
      i, label: PARCHES[Math.floor(R() * PARCHES.length)], r: (R() - 0.5) * 0.12, dx: (R() - 0.5) * 10, dy: (R() - 0.5) * 8,
    }));
    copySrc = free[Math.floor(free.length * 0.3)] ?? 0;
    copyPath = [];
    const c0 = copySrc % cols, r0 = Math.floor(copySrc / cols);
    for (let s = 1; s <= 6; s++) {
      const idx = (r0 + s) * cols + c0;
      if (idx < N) copyPath.push(idx);
    }
    // Glifo: tamaño para que las celdas objetivo se parezcan a N
    let k = Math.max(4, Math.floor(Math.sqrt(N / 2.25)));
    let g = glyphLayout(k);
    while (g.t.length > N && k > 4) {
      k--;
      g = glyphLayout(k);
    }
    glyph = g;
    const tOrder = g.t.map((_, j) => j).sort((a, b) => g.t[a][0] - g.t[b][0] || g.t[a][1] - g.t[b][1]);
    const pOrder = Array.from({ length: N }, (_, i) => i).sort((a, b) => (a % cols) - (b % cols) || a - b);
    gIdx = new Int32Array(N);
    const solid = g.t.map((_, j) => j).filter((j) => g.t[j][2] === K.COB);
    const step = N / g.t.length;
    // Reparte manteniendo el orden espacial; las celdas sobrantes se apilan en el cuadrado sólido
    const used = new Set<number>();
    for (let j = 0; j < g.t.length; j++) {
      const p = pOrder[Math.min(N - 1, Math.floor(j * step))];
      gIdx[p] = tOrder[j];
      used.add(p);
    }
    for (let i = 0; i < N; i++) if (!used.has(i)) gIdx[i] = solid[Math.floor(rA[i] * solid.length)];
    // Método: cinco cuadrados de k2×k2 que se rellenan en ola diagonal
    const k2 = Math.max(3, Math.floor(Math.sqrt(N / 5)));
    const per = k2 * k2;
    mIdx = new Int32Array(N);
    const rank: [number, number, number][] = [];
    for (let u = 0; u < k2; u++) for (let v = 0; v < k2; v++) rank.push([u, v, u + (k2 - 1 - v) + rng(u * 31 + v)() * 0.8]);
    const ranked = rank.map((_, j) => j).sort((a, b) => rank[a][2] - rank[b][2]);
    const cellRank = new Float32Array(per);
    ranked.forEach((j, n) => (cellRank[j] = n / per));
    metodo = { k2, per, rank, cellRank };
    for (let i = 0; i < N; i++) mIdx[i] = i < 5 * per ? i : Math.floor(rB[i] * 5 * per);
  }

  const rect = (s: string) => {
    const el = q(s);
    return el ? el.getBoundingClientRect() : null;
  };
  function setColor(arr: Float32Array, i: number, kind: number, pal: Palette) {
    const src = PAL[pal][kind], b = i * 8;
    for (let n = 0; n < 8; n++) arr[b + n] = src[n];
  }
  function mixColor(arr: Float32Array, i: number, kind: number, pal: Palette, w: number) {
    if (w <= 0) return;
    const src = PAL[pal][kind], b = i * 8;
    for (let n = 0; n < 8; n++) arr[b + n] += (src[n] - arr[b + n]) * w;
  }
  function mix2(i: number, kind: number, w: number) {
    mixColor(cP, i, kind, "paper", w);
    mixColor(cI, i, kind, "ink", w);
  }
  /** Retardo por celda: sin él en modo contenido, con él en modo completo. */
  const stag = (t: number, d: number, spread: number) =>
    calm() ? inout(clamp(t)) : inout(clamp((t - d * spread) / (1 - spread)));

  function onMove(e: PointerEvent) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  function onLeave() {
    mouse.x = -1e4;
    mouse.y = -1e4;
  }
  function onPointerEnd(e: PointerEvent) {
    if (e.pointerType !== "mouse") onLeave();
  }
  function onReduce() {
    reduce = reduceQuery.matches;
  }
  let rT = 0;
  function onResize() {
    clearTimeout(rT);
    rT = window.setTimeout(build, 150);
  }
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerup", onPointerEnd, { passive: true });
  window.addEventListener("pointercancel", onPointerEnd, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", onResize);
  reduceQuery.addEventListener("change", onReduce);

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const gl = glyph, me = metodo;
    if (!N || !gl || !me) return;
    if (!puntoFinal) {
      puntoFinal = q("[data-punto-final]");
      if (puntoFinal) puntoFinal.style.opacity = "0";
    }
    const intro = rect("[data-intro]"), stage = rect("[data-hero-stage]"), G = rect("[data-glyph-anchor]");
    const met = rect("[data-metodo]"), MA = rect("[data-metodo-anchor]");
    const F = puntoFinal ? puntoFinal.getBoundingClientRect() : null;
    const raw: Progress = {
      i: intro ? clamp(-intro.top / Math.max(1, intro.height - H)) : 0,
      a: intro ? clamp(1 - intro.bottom / H) : 0,
      e: met ? clamp(1 - met.top / H) : 0,
      f: met ? clamp((-met.top / Math.max(1, met.height - H) - 0.06) / 0.8) * 5 : 0,
      x: met ? clamp(1 - met.bottom / H) : 0,
      c: F ? clamp((H * 0.98 - F.top) / (H * 0.6)) : 0,
    };
    // Con el cursor sobre una fase o su cuadrado, se rellenan todas hasta esa
    if (lastHov >= 0 && sm.e > 0.9 && sm.x < 0.1) raw.f = lastHov + 1;
    const k = calm() ? 0.35 : 0.12;
    for (const n of PROGRESS_KEYS) sm[n] += (raw[n] - sm[n]) * k;
    if (Math.abs(raw.i - sm.i) < 0.0005) sm.i = raw.i;
    const pI = sm.i;
    const tGlyph = clamp((pI - 0.14) / 0.5);
    const heroW = 1 - clamp(tGlyph * 4);
    // Textos del escenario
    const ht = q("[data-hero-text]");
    if (ht) {
      const t = clamp((pI - 0.04) / 0.18);
      ht.style.opacity = String(1 - t);
      ht.style.transform = `translate3d(0,${-t * 80}px,0)`;
      ht.style.pointerEvents = t > 0.5 ? "none" : "";
    }
    const fbar = q("[data-grid-origin]");
    if (fbar) fbar.style.opacity = String(heroW);
    const mf = q("[data-manifesto]");
    if (mf) {
      const t = ease(clamp((pI - 0.46) / 0.18));
      mf.style.opacity = String(t);
      mf.style.transform = `translate3d(0,${(1 - t) * 28}px,0)`;
      mf.style.pointerEvents = t > 0.5 ? "" : "none";
    }
    qa("[data-need]").forEach((el) => {
      const n = Number(el.dataset.need);
      const t = ease(clamp((pI - 0.6 - n * 0.07) / 0.1));
      el.style.opacity = t.toFixed(3);
      el.style.transform = `translate3d(0,${((1 - t) * 16).toFixed(1)}px,0)`;
    });
    // Modo del hero según la frase rotatoria
    let mode = 0;
    if (!calm()) {
      const pal = q('[data-palabra="1"]');
      const an = pal?.getAnimations?.()[0];
      const t = typeof an?.currentTime === "number" ? an.currentTime : now;
      mode = Math.floor((t % 12500) / 2500);
    }
    for (let m = 0; m < 5; m++) modeW[m] += ((m === mode ? 1 : 0) - modeW[m]) * 0.05;
    const sTop = stage ? stage.top : 0;
    // Glifo
    let gs = 0, gx = 0, gy = 0;
    if (G) {
      gs = Math.min(G.width / gl.U, G.height / gl.V);
      gx = G.left + (G.width - gs * gl.U) / 2;
      gy = G.top + (G.height - gs * gl.V) / 2;
    }
    // Aparcado: glifo pequeño en la esquina inferior derecha
    const pkW = W < 640 ? 44 : 58, pkS = pkW / gl.U, pkM = W < 640 ? 18 : 28;
    const pkX = W - pkW - pkM, pkY = H - pkS * gl.V - pkM;
    // Método
    let ms = 0, mgap = 0, mx0 = 0, my0 = 0;
    if (MA) {
      const S = Math.min(MA.width / (5 + 4 * 0.4), MA.height);
      mgap = S * 0.4;
      ms = S / me.k2;
      mx0 = MA.left + (MA.width - (5 * S + 4 * mgap)) / 2;
      my0 = MA.top + (MA.height - S) / 2;
    }
    let hov = -1;
    const fases = qa("[data-fase]");
    fases.forEach((el, j) => {
      const b = el.getBoundingClientRect();
      if (mouse.x >= b.left && mouse.x <= b.right && mouse.y >= b.top && mouse.y <= b.bottom) hov = j;
    });
    if (hov < 0 && MA && ms && mouse.y >= my0 - 12 && mouse.y <= my0 + ms * me.k2 + 12) {
      const S = ms * me.k2;
      for (let j = 0; j < 5; j++) {
        const l = mx0 + j * (S + mgap);
        if (mouse.x >= l - mgap / 2 && mouse.x <= l + S + mgap / 2) hov = j;
      }
    }
    lastHov = hov;
    fases.forEach((el, j) => {
      el.style.opacity = sm.f > j + 0.02 ? "1" : "0.38";
    });
    const fn = q("[data-fase-num]");
    if (fn) fn.textContent = Math.min(5, Math.floor(sm.f) + 1).toFixed(1);
    const wA = sm.a, wE = sm.e, wX = sm.x, wC = sm.c;
    const settled = (1 - heroW) * (1 - wC);
    for (let i = 0; i < N; i++) {
      // 1 · Hoja de cálculo
      let x = hx[i], y = sTop + hy[i], w = CW, h = RH, r = 0;
      const m3 = modeW[3];
      x += jx[i] * m3;
      y += jy[i] * m3;
      r += jr[i] * m3;
      setColor(cP, i, K.GRID, "paper");
      setColor(cI, i, K.GRID, "ink");
      if (modeW[2] > 0.01) mix2(i, K.GEN, modeW[2] * 0.85);
      // 2 · Glifo
      const w1 = stag(tGlyph, rC[i] * 0.5 + (hx[i] / W) * 0.5, 0.45);
      if (w1 > 0) {
        const t = gl.t[gIdx[i]];
        const tx = gx + t[0] * gs, ty = gy + t[1] * gs;
        const arc = calm() ? 0 : Math.sin(Math.PI * w1) * (60 + rA[i] * 180);
        x = lerp(x, tx, w1);
        y = lerp(y, ty, w1) - arc;
        w = lerp(w, gs, w1);
        h = lerp(h, gs, w1);
        r = lerp(r, 0, w1) + (calm() ? 0 : Math.sin(Math.PI * w1) * (rB[i] - 0.5) * 2.4);
        mix2(i, t[2], w1);
      }
      // 3 · Aparcado
      const t0 = gl.t[gIdx[i]];
      const parkX = pkX + t0[0] * pkS, parkY = pkY + t0[1] * pkS;
      const w2 = stag(wA, rA[i], 0.4);
      if (w2 > 0) {
        x = lerp(x, parkX, w2);
        y = lerp(y, parkY, w2);
        w = lerp(w, pkS, w2);
        h = lerp(h, pkS, w2);
        r = lerp(r, 0, w2);
      }
      // 4 · Método
      const w3 = stag(wE, rB[i], 0.45);
      if (w3 > 0 && MA) {
        const mi = mIdx[i], sq = Math.floor(mi / me.per), cell = mi % me.per;
        const u = me.rank[cell][0], v = me.rank[cell][1];
        const tx = mx0 + sq * (ms * me.k2 + mgap) + u * ms, ty = my0 + v * ms;
        const arc = calm() ? 0 : Math.sin(Math.PI * w3) * (40 + rC[i] * 120);
        x = lerp(x, tx, w3);
        y = lerp(y, ty, w3) - arc;
        w = lerp(w, ms, w3);
        h = lerp(h, ms, w3);
        r = lerp(r, 0, w3);
        const fill = clamp((sm.f - sq - me.cellRank[cell]) * 6);
        const target = fill > 0 ? (sq === 4 ? K.COB : K.INK) : K.OUT;
        mix2(i, K.OUT, w3);
        if (fill > 0) mix2(i, target, w3 * fill);
      }
      // 5 · Vuelta al aparcado
      const w4 = stag(wX, rC[i], 0.4);
      if (w4 > 0) {
        x = lerp(x, parkX, w4);
        y = lerp(y, parkY, w4);
        w = lerp(w, pkS, w4);
        h = lerp(h, pkS, w4);
        r = lerp(r, 0, w4);
        mix2(i, gl.t[gIdx[i]][2], w4);
      }
      // 6 · Punto final
      const w5 = stag(wC, rA[i], 0.5);
      if (w5 > 0 && F) {
        const arc = calm() ? 0 : Math.sin(Math.PI * w5) * (rB[i] - 0.5) * 260;
        x = lerp(x, F.left, w5) + arc;
        y = lerp(y, F.top, w5);
        w = lerp(w, F.width, w5);
        h = lerp(h, F.height, w5);
        r = lerp(r, 0, w5) + (calm() ? 0 : Math.sin(Math.PI * w5) * (rC[i] - 0.5) * 3);
        mix2(i, K.COB, w5);
      }
      // Campo magnético del cursor sobre las formaciones
      if (settled > 0.5 && !calm()) {
        const cx = x + w / 2, cy = y + h / 2, dx = cx - mouse.x, dy = cy - mouse.y;
        const d2 = dx * dx + dy * dy, R0 = 130;
        if (d2 < R0 * R0) {
          const d = Math.sqrt(d2) || 1, f = Math.pow(1 - d / R0, 2) * 26 * settled;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
      }
      pX[i] = x; pY[i] = y; pW[i] = w; pH[i] = h; pR[i] = r;
    }
    // Dibujo: paleta papel fuera de las secciones de tinta y paleta tinta dentro
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    const inks = qa("[data-ink]").map((el) => el.getBoundingClientRect()).filter((b) => b.bottom > 0 && b.top < H);
    drawPass(cP, inks, false);
    if (inks.length) drawPass(cI, inks, true);
    if (heroW > 0.01) drawHero(heroW, now, sTop);
    if (puntoFinal) puntoFinal.style.opacity = sm.c > 0.995 ? "1" : "0";
    // Parallax de capturas
    qa("[data-parallax]").forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const p = parent.getBoundingClientRect();
      if (p.bottom < -200 || p.top > H + 200) return;
      const f = parseFloat(el.dataset.parallax || "") || 0.08;
      el.style.transform = `translate3d(0,${(calm() ? 0 : (p.top + p.height / 2 - H / 2) * -f).toFixed(1)}px,0)`;
    });
  }

  function drawPass(C: Float32Array, inks: DOMRect[], onInk: boolean) {
    ctx.save();
    ctx.beginPath();
    if (!onInk) ctx.rect(0, 0, cv.width, cv.height);
    inks.forEach((b) => ctx.rect(b.left * DPR, b.top * DPR, b.width * DPR, b.height * DPR));
    ctx.clip(onInk ? "nonzero" : "evenodd");
    ctx.lineWidth = 1;
    for (let i = 0; i < N; i++) {
      const b = i * 8, fa = C[b + 3], sa = C[b + 7];
      if (fa < 0.01 && sa < 0.01) continue;
      let x = pX[i], y = pY[i];
      const w = pW[i], h = pH[i];
      if (x > W + 50 || y > H + 50 || x + w < -50 || y + h < -50) continue;
      const gap = Math.min(1.6, w * 0.14) * fa;
      const r = pR[i];
      const s = DPR;
      if (Math.abs(r) > 0.002) {
        const c = Math.cos(r), sn = Math.sin(r);
        ctx.setTransform(c * s, sn * s, -sn * s, c * s, (x + w / 2) * s, (y + h / 2) * s);
        x = -w / 2;
        y = -h / 2;
      } else ctx.setTransform(s, 0, 0, s, 0, 0);
      if (fa > 0.01) {
        ctx.fillStyle = `rgba(${C[b] | 0},${C[b + 1] | 0},${C[b + 2] | 0},${fa.toFixed(3)})`;
        ctx.fillRect(x + gap / 2, y + gap / 2, Math.max(0.4, w - gap), Math.max(0.4, h - gap));
      }
      if (sa > 0.01) {
        ctx.strokeStyle = `rgba(${C[b + 4] | 0},${C[b + 5] | 0},${C[b + 6] | 0},${sa.toFixed(3)})`;
        ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w), Math.round(h));
      }
    }
    ctx.restore();
  }

  /** Cabeceras, contenido de celdas, parches, copia manual y selección del cursor. */
  function drawHero(a: number, now: number, sTop: number) {
    const s = DPR;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    const oy = sTop + oyRel;
    ctx.globalAlpha = a;
    // Cabeceras de columna y fila
    ctx.fillStyle = "#efede6";
    ctx.fillRect(0, oy, W, RH);
    ctx.fillRect(0, oy, oxRel, H - oy);
    ctx.strokeStyle = "#d8d6cc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, oy + RH + 0.5);
    ctx.lineTo(W, oy + RH + 0.5);
    ctx.moveTo(oxRel + 0.5, oy);
    ctx.lineTo(oxRel + 0.5, H);
    ctx.stroke();
    // Celda bajo el cursor
    let hc = -1, hr = -1;
    const inGrid = o.cursor && mouse.x > oxRel && mouse.y > oy + RH && a > 0.9;
    if (inGrid) {
      hc = Math.floor((mouse.x - oxRel) / CW);
      hr = Math.floor((mouse.y - oy - RH) / RH);
    }
    const gen = modeW[2];
    ctx.font = `11px ${monoFont}`;
    ctx.textBaseline = "middle";
    for (let c = 0; c < cols; c++) {
      const x = oxRel + c * CW;
      ctx.strokeStyle = "#d8d6cc";
      ctx.beginPath();
      ctx.moveTo(x + 0.5, oy);
      ctx.lineTo(x + 0.5, oy + RH);
      ctx.stroke();
      if (c === hc) {
        ctx.fillStyle = "#d8d6cc";
        ctx.fillRect(x + 1, oy, CW - 1, RH);
      }
      ctx.fillStyle = c === hc ? "#101013" : "#5a594f";
      ctx.textAlign = "center";
      ctx.fillText(gen > 0.5 ? "Campo" : colLabel(c), x + CW / 2, oy + RH / 2 + 1);
    }
    for (let r = 0; r < rows; r++) {
      const y = oy + RH + r * RH;
      if (y > H) break;
      ctx.strokeStyle = "#d8d6cc";
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(oxRel, y + 0.5);
      ctx.stroke();
      if (r === hr) {
        ctx.fillStyle = "#d8d6cc";
        ctx.fillRect(0, y + 1, oxRel, RH - 1);
      }
      ctx.fillStyle = r === hr ? "#101013" : "#5a594f";
      ctx.textAlign = "center";
      ctx.fillText(String(r + 1), oxRel / 2, y + RH / 2 + 1);
    }
    // Contenido de las celdas
    ctx.textAlign = "left";
    const tGl = clamp((sm.i - 0.14) / 0.5);
    const m3 = modeW[3];
    for (let i = 0; i < N; i++) {
      const text = txt[i];
      if (!text) continue;
      const leave = clamp(tGl * 6 - rC[i] * 2);
      const al = 1 - leave;
      if (al <= 0.01) continue;
      const x = pX[i], y = pY[i];
      ctx.save();
      ctx.globalAlpha = a * al;
      if (m3 > 0.01 && Math.abs(pR[i]) > 0.001) {
        ctx.translate(x + CW / 2, y + RH / 2);
        ctx.rotate(pR[i]);
        ctx.translate(-(x + CW / 2), -(y + RH / 2));
      }
      ctx.beginPath();
      ctx.rect(x + 1, y + 1, CW - 2, RH - 2);
      ctx.clip();
      ctx.fillStyle = text[0] === "#" ? "#d4674a" : "#6a685d";
      ctx.fillText(gen > 0.5 ? "—" : text, x + 8, y + RH / 2 + 1);
      ctx.restore();
    }
    ctx.globalAlpha = a;
    // Parches
    if (modeW[4] > 0.01) {
      patches.forEach((p) => {
        const x = hx[p.i] + p.dx, y = sTop + hy[p.i] + p.dy;
        ctx.save();
        ctx.globalAlpha = a * modeW[4];
        ctx.translate(x + CW / 2, y + RH / 2);
        ctx.rotate(p.r);
        ctx.fillStyle = "#efede6";
        ctx.fillRect(-CW / 2 - 6, -RH / 2 - 3, CW + 12, RH + 6);
        ctx.strokeStyle = "#6a685d";
        ctx.strokeRect(-CW / 2 - 6 + 0.5, -RH / 2 - 3 + 0.5, CW + 12, RH + 6);
        ctx.fillStyle = "#3d3c35";
        ctx.textAlign = "center";
        ctx.fillText(p.label.toUpperCase(), 0, 1);
        ctx.restore();
      });
    }
    // Copiar y pegar a mano
    if (modeW[1] > 0.01 && copyPath.length) {
      const src = copySrc, step = Math.floor(now / 520) % copyPath.length;
      ctx.save();
      ctx.globalAlpha = a * modeW[1];
      const sx = hx[src], sy = sTop + hy[src];
      ctx.setLineDash([4, 3]);
      ctx.lineDashOffset = -now / 60;
      ctx.strokeStyle = "#2743e0";
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, CW - 2, RH - 2);
      ctx.setLineDash([]);
      for (let s2 = 0; s2 <= step; s2++) {
        const t = copyPath[s2], tx = hx[t], ty = sTop + hy[t];
        ctx.fillStyle = "#6a685d";
        ctx.textAlign = "left";
        ctx.fillText(txt[src] || "Pedido 0412", tx + 8, ty + RH / 2 + 1);
        if (s2 === step) {
          ctx.strokeRect(tx + 1, ty + 1, CW - 2, RH - 2);
          ctx.fillStyle = "#2743e0";
          ctx.fillRect(tx + CW - 4, ty + RH - 4, 6, 6);
        }
      }
      const lt = copyPath[step];
      ctx.fillStyle = "#2743e0";
      ctx.fillRect(hx[lt] + CW + 6, sTop + hy[lt] + 6, 58, RH - 12);
      ctx.fillStyle = "#f7f6f2";
      ctx.textAlign = "center";
      ctx.font = `10px ${monoFont}`;
      ctx.fillText(step % 2 ? "CTRL+V" : "CTRL+C", hx[lt] + CW + 35, sTop + hy[lt] + RH / 2 + 1);
      ctx.restore();
      ctx.font = `11px ${monoFont}`;
    }
    // Selección del cursor con el tirador cuadrado
    if (inGrid && hc >= 0 && hc < cols && hr >= 0) {
      const x = oxRel + hc * CW, y = oy + RH + hr * RH;
      ctx.strokeStyle = "#2743e0";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, CW - 2, RH - 2);
      ctx.fillStyle = "#f7f6f2";
      ctx.fillRect(x + CW - 5, y + RH - 5, 9, 9);
      ctx.fillStyle = "#2743e0";
      ctx.fillRect(x + CW - 4, y + RH - 4, 7, 7);
      const ref = colLabel(hc) + (hr + 1);
      if (ref !== lastRef) {
        lastRef = ref;
        const idx = hr * cols + hc;
        const refEl = q("[data-fx-ref]"), fx = q("[data-fx-text]");
        if (refEl) refEl.textContent = ref;
        const content = idx < N ? txt[idx] : null;
        if (fx) fx.textContent = content ? (content[0] === "=" ? content : `"${content}"`) : "";
      }
    }
    ctx.globalAlpha = 1;
  }

  /** Deja los nodos como los sirvió el servidor. */
  function restore() {
    qa(STYLED).forEach((el) => {
      el.style.opacity = "";
      el.style.transform = "";
      el.style.pointerEvents = "";
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
  }

  build();
  if (document.fonts?.ready) document.fonts.ready.then(build);
  raf = requestAnimationFrame(frame);
  return {
    set(next) {
      Object.assign(o, next);
    },
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      clearTimeout(rT);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      reduceQuery.removeEventListener("change", onReduce);
      restore();
    },
  };
}
