import React from "react";
import {AbsoluteFill, Easing, interpolateColors, useCurrentFrame} from "remotion";
import {CalendarPlus, Lock, TriangleAlert} from "lucide-react";
import {color, monoStyle, radius, shadow, textStyle} from "../../brand/tokens";
import {WordsReveal} from "../../components";
import {ease, motion, pressScale, progress, tween} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T16 as T} from "./cues";
import {CelebrateRing, ClickCursor, DirBlur, LightClock, SlotCard, cardHeight, velocity, type CardGeo} from "./ui";

// ─── Geometría 16:9 ────────────────────────────────────────────────────────
const G: CardGeo = {
  w: 848,
  cols: [176, 312, 356],
  cellH: 188,
  padX: 28,
  padTop: 30,
  padBottom: 32,
  valueSize: 92,
  labelSize: 20,
  footerH: 80,
  footerFont: 30,
  avatar: 46,
  stripW: 4,
};
const H = cardHeight(G);
const Y0 = 528;
const A_X = 96;
/** B se detiene a 16 px de A y, resuelto, queda a 32 px (x96–1824, márgenes de la HUD). */
const B_STOP = A_X + G.w + 16;
const B_FINAL = A_X + G.w + 32;
const B_FROM = 900;
const NOTICE_Y = Y0 + H + 32;
const NOTICE_H = 80;
// El selector termina por encima del texto del aviso: lo tapa sin cortarlo.
const SEL = {dx: 12, y: Y0 + 2 + G.cellH + 6, w: 400, row: 56, pad: 6};
const PUSH = 960;

/** Llega con velocidad y se detiene en seco (sin rebote). */
const SLAM = Easing.bezier(0.25, 0.4, 0.6, 0.85);

const bX = (f: number) =>
  B_STOP + (1 - progress(f, T.enter, T.stop - T.enter, SLAM)) * B_FROM + progress(f, T.resolve, motion.overlay, ease.overlay) * (B_FINAL - B_STOP);

/** Vista inversa corta: fundido + 4 px en 6 f, con la caída al principio. */
const quickOut = (frame: number, at: number): React.CSSProperties => {
  const p = progress(frame, at, 6, ease.out);
  return {opacity: 1 - p, transform: `translateY(${-p * 4}px)`};
};

/** Push del acto: entra desde +960 px en 7 f y sale a −960 px en los últimos 8 f. */
const pushX = (f: number, exit: number) =>
  tween(f, [0, motion.overlay], [PUSH, 0], ease.overlay) + tween(f, [exit, exit + 8], [0, -PUSH], ease.in);

// Cursor: entra, clic en PISTA de B, clic en «Pista 3 · Libre» y se aparta.
const PISTA_TIP = {x: B_STOP + 120, y: Y0 + 140};
const OPTION_TIP = {x: B_STOP + SEL.dx + 176, y: SEL.y + SEL.pad + SEL.row * 1.5 + 6};
const CURSOR_KEYS = [
  {at: T.cursorIn, x: 1480, y: 1010},
  {at: T.open, x: PISTA_TIP.x, y: PISTA_TIP.y, click: true},
  {at: T.pick, x: OPTION_TIP.x, y: OPTION_TIP.y, click: true},
  {at: T.pick + 4, x: OPTION_TIP.x, y: OPTION_TIP.y},
  {at: T.resolve + 10, x: 1440, y: 1000},
];

// ─── Piezas ────────────────────────────────────────────────────────────────

const JAVI = {initials: "JM", name: "Javi Martínez + 3"};
const PEDRO = {initials: "PS", name: "Pedro Sanz + 3"};

const ModuleA: React.FC<{frame: number}> = ({frame}) => (
  <div style={{position: "absolute", left: A_X, top: Y0, borderRadius: radius.module, boxShadow: shadow.card}}>
    <SlotCard
      frame={frame}
      g={G}
      ink={color.ink900}
      strip={1}
      check={{circle: 1, draw: 1}}
      values={[
        {keys: [{at: T.roll[0], value: "1"}]},
        {keys: [{at: T.roll[1], value: "MAR"}]},
        {keys: [{at: T.roll[2], value: "19:00"}]},
      ]}
      footer={JAVI}
    />
  </div>
);

const ModuleB: React.FC<{frame: number}> = ({frame}) => {
  if (frame < T.enter) return null;
  const x = bX(frame);
  const warnIn = interpolateColors(frame, [T.stop - 1, T.stop + 3], [color.ink900, color.warning]);
  const ink = frame < T.resolve ? warnIn : interpolateColors(frame, [T.resolve, T.resolve + 4], [color.warning, color.ink900]);
  const solid = progress(frame, T.resolve, 4, ease.out);
  const settled = progress(frame, T.resolve, motion.overlay, ease.overlay);
  const focus = progress(frame, T.open, motion.press, ease.out) * (1 - progress(frame, T.resolve, 4, ease.out));
  return (
    <DirBlur id="sin-b16" vx={velocity(bX, frame)} style={{position: "absolute", left: x, top: Y0}}>
      {/* Pestaña de borrador «Nueva Reserva» */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -44,
          height: 28,
          display: "flex",
          alignItems: "center",
          gap: 10,
          ...monoStyle(500),
          fontSize: 18,
          letterSpacing: "0.12em",
          color: color.ink500,
          whiteSpace: "nowrap",
          ...quickOut(frame, T.resolve),
        }}
      >
        <CalendarPlus size={20} strokeWidth={2} />
        NUEVA RESERVA
      </div>
      {/* Sombra: flota como borrador y se asienta al confirmarse */}
      <div style={{position: "absolute", inset: 0, borderRadius: radius.module, boxShadow: shadow.float, opacity: 1 - settled}} />
      <div style={{position: "absolute", inset: 0, borderRadius: radius.module, boxShadow: shadow.card, opacity: settled}} />
      <SlotCard
        frame={frame}
        g={G}
        ink={ink}
        dashed={1 - solid}
        strip={settled}
        check={{circle: progress(frame, T.resolve, motion.press, ease.out), draw: progress(frame, T.resolve + 2, 8, ease.out)}}
        pistaTint={progress(frame, T.stop, 4, ease.out) * (1 - solid)}
        chevron={1 - progress(frame, T.resolve, 6, ease.out)}
        pistaScale={pressScale(frame, T.open)}
        focus={focus}
        values={[
          // 1 → 3 directo: un paso intermedio «2» se leería como otra pista.
          {initial: "1", duration: 6, keys: [{at: T.resolve, value: "3"}]},
          {initial: "MAR", keys: []},
          {initial: "19:00", keys: []},
        ]}
        footer={PEDRO}
      />
      <CelebrateRing frame={frame} at={T.resolve} w={G.w} h={H} />
    </DirBlur>
  );
};

/** Aviso en línea del producto (tinte warning, texto tinta). */
const Notice: React.FC<{frame: number}> = ({frame}) => {
  if (frame < T.stop || frame > T.noticeOut + 6) return null;
  const inP = progress(frame, T.stop, motion.view, ease.out);
  const outP = progress(frame, T.noticeOut, 6, ease.out);
  const o = inP * (1 - outP);
  const dy = (1 - inP) * 4 - outP * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: bX(frame),
        top: NOTICE_Y,
        width: G.w,
        boxSizing: "border-box",
        height: NOTICE_H,
        display: "flex",
        gap: 16,
        alignItems: "center",
        padding: "0 28px",
        borderRadius: radius.module,
        background: color.warningBg,
        border: `2px solid ${color.warningBorder}`,
        opacity: o,
        transform: `translateY(${dy}px)`,
      }}
    >
      <TriangleAlert size={30} strokeWidth={2.2} color={color.warning} style={{flexShrink: 0}} />
      {/* Resumen del mensaje real: «Este horario ya está ocupado en la pista seleccionada.» */}
      <span style={{...textStyle(700), fontSize: 30, lineHeight: 1, color: color.ink900, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap"}}>
        Pista 1 ocupada · 19:00–20:30
      </span>
    </div>
  );
};

/** Selector de pista que se despliega desde la celda PISTA de B. */
const CourtSelect: React.FC<{frame: number}> = ({frame}) => {
  const open = progress(frame, T.open, motion.overlay, ease.overlay);
  const close = progress(frame, T.pick + 1, 4, ease.out);
  if (open <= 0 || close >= 1) return null;
  const hover = progress(frame, T.pick - 3, 3, ease.out);
  const rowStyle: React.CSSProperties = {
    height: SEL.row,
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "0 18px",
    borderRadius: radius.control,
    ...textStyle(500),
    fontSize: 24,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
  return (
    <div
      style={{
        position: "absolute",
        left: bX(frame) + SEL.dx,
        top: SEL.y,
        width: SEL.w,
        boxSizing: "border-box",
        padding: SEL.pad,
        borderRadius: radius.control,
        background: color.surfaceRaised,
        border: `2px solid ${color.sand300}`,
        boxShadow: shadow.float,
        opacity: Math.min(1, open * 2.5) * (1 - close),
        transform: `translateY(${(1 - open) * -8 - close * 4}px)`,
        clipPath: `inset(0 -40px ${(1 - open) * 100}% -40px)`,
      }}
    >
      <div style={{...rowStyle, color: color.ink400}}>
        <Lock size={20} strokeWidth={2} color={color.ink300} />
        <span>Pista 1 · Ocupada</span>
      </div>
      <div
        style={{
          ...rowStyle,
          color: color.ink900,
          background: `rgba(231, 226, 216, ${hover})`,
          transform: `scale(${pressScale(frame, T.pick) * 0.5 + 0.5})`,
        }}
      >
        <span style={{width: 20, display: "flex", justifyContent: "center"}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: color.green600}} />
        </span>
        <span style={{...textStyle(600)}}>Pista 3</span>
        <span style={{color: color.ink500, marginLeft: -6}}>· Libre</span>
      </div>
    </div>
  );
};

/** Chip «Con Padel Club OS»: el mismo sitio que tenía «Ahora» en «dobles-reservas». */
const GainChip: React.FC<{frame: number}> = ({frame}) => {
  const p = progress(frame, T.chip, motion.press, ease.out);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: A_X,
        top: Y0 - 64,
        height: 48,
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "0 20px 0 16px",
        borderRadius: radius.pill,
        background: "rgba(111, 191, 156, 0.2)",
        border: "2px solid rgba(111, 191, 156, 0.55)",
        ...textStyle(600),
        fontSize: 24,
        color: color.green700,
        whiteSpace: "nowrap",
        opacity: p,
        transform: `scale(${0.96 + 0.04 * p})`,
        transformOrigin: "0% 100%",
      }}
    >
      <span style={{width: 10, height: 10, borderRadius: 5, background: color.green600}} />
      Con Padel Club OS
    </div>
  );
};

const Content: React.FC<{exit: number}> = ({exit}) => {
  const frame = useCurrentFrame();
  const cursorOut = progress(frame, T.pick + 6, 8, ease.in);
  const px = (f: number) => pushX(f, exit);
  return (
    <DirBlur id="sin-push16" vx={velocity(px, frame)} style={{position: "absolute", inset: 0, transform: `translateX(${px(frame)}px)`}}>
      <GainChip frame={frame} />
      <ModuleA frame={frame} />
      <Notice frame={frame} />
      <ModuleB frame={frame} />
      <CourtSelect frame={frame} />
      {frame >= T.cursorIn && cursorOut < 1 ? (
        <ClickCursor frame={frame} keys={CURSOR_KEYS} opacity={progress(frame, T.cursorIn, 6, ease.out) * (1 - cursorOut)} />
      ) : null}
    </DirBlur>
  );
};

export const Landscape: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useScene();
  // Salida en los últimos 8 f de la escena (T.exit = 112 en 2 compases).
  const hudOut = Math.min(T.exit, durationInFrames - 8);
  return (
    <AbsoluteFill style={{background: color.sand100}}>
      <Content exit={hudOut} />
      {/* HUD fija: reloj, titular y subtítulo */}
      <LightClock frame={frame} rollAt={T.clock} />
      <WordsReveal
        text="Detección de solapamientos."
        frame={frame}
        start={T.title}
        step={3}
        exitAt={hudOut}
        style={{position: "absolute", left: 96, top: 128, fontSize: 80, fontWeight: 760, lineHeight: 1, color: color.ink900}}
      />
      <WordsReveal
        text="Dos partidos. Dos pistas."
        frame={frame}
        start={T.resolve}
        step={3}
        exitAt={hudOut}
        style={{
          position: "absolute",
          left: 96,
          top: 222,
          ...textStyle(500),
          fontStretch: "100%",
          letterSpacing: 0,
          columnGap: "0.27em",
          fontSize: 44,
          lineHeight: 1.2,
          color: color.ink700,
        }}
      />
    </AbsoluteFill>
  );
};
