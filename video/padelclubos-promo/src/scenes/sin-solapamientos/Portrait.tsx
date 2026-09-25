import React from "react";
import {AbsoluteFill, Easing, interpolateColors, useCurrentFrame} from "remotion";
import {Check, User} from "lucide-react";
import {color, radius, shadow, textStyle} from "../../brand/tokens";
import {TapRipple, WordsReveal} from "../../components";
import {ease, lerp, motion, pressScale, progress, tween, view} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T9 as T} from "./cues";
import {CelebrateRing, DirBlur, SlotCard, cardHeight, velocity, type CardGeo} from "./ui";

// ─── Geometría 9:16 ────────────────────────────────────────────────────────
// Mismo módulo que en «dobles-reservas» (936 px, valores de 96 px), en claro.
const G: CardGeo = {
  w: 936,
  cols: [220, 336, 376],
  cellH: 208,
  padX: 32,
  padTop: 36,
  padBottom: 38,
  valueSize: 96,
  labelSize: 22,
  footerH: 0,
  stripW: 4,
};
const H = cardHeight(G);
const X = 72;
const A_Y = 680;
const A_H = H;
/** B se detiene a 16 px de la reserva de Javi y, resuelto, se asienta a 48 px. */
const B_STOP = A_Y + A_H + 16;
const B_FINAL = A_Y + A_H + 48;
const B_FROM = 1000;
const PUSH = 540;

const SLAM = Easing.bezier(0.25, 0.4, 0.6, 0.85);

const bY = (f: number) =>
  B_STOP + (1 - progress(f, T.enter, T.stop - T.enter, SLAM)) * B_FROM + progress(f, T.resolve, motion.overlay, ease.overlay) * (B_FINAL - B_STOP);

/** Push del acto: entra desde +540 px en 7 f y sale a −540 px en los últimos 8 f. */
const pushX = (f: number, exit: number) =>
  tween(f, [0, motion.overlay], [PUSH, 0], ease.overlay) + tween(f, [exit, exit + 8], [0, -PUSH], ease.in);

// ─── Piezas ────────────────────────────────────────────────────────────────

/** La reserva de Javi como silueta: bloque verde 600 sin texto, con tira verde, cuatro jugadores y check. */
const Silhouette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: X,
      top: A_Y,
      width: G.w,
      height: A_H,
      boxSizing: "border-box",
      borderRadius: radius.module,
      background: color.green600,
      boxShadow: shadow.card,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `0 48px 0 ${48 + G.stripW}px`,
    }}
  >
    <div style={{position: "absolute", left: 0, top: 0, width: G.stripW + 2, height: A_H, background: color.green300}} />
    <div style={{display: "flex"}}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: 96,
            height: 96,
            marginLeft: i === 0 ? 0 : -20,
            borderRadius: "50%",
            background: color.green700,
            border: `4px solid ${color.green600}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={44} strokeWidth={2.2} color={color.green300} />
        </div>
      ))}
    </div>
    <div style={{width: 72, height: 72, borderRadius: 36, background: color.sand50, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Check size={44} strokeWidth={3} color={color.green600} />
    </div>
  </div>
);

const ModuleB: React.FC<{frame: number}> = ({frame}) => {
  if (frame < T.enter) return null;
  const y = bY(frame);
  // Borrador tinta → warning al chocar; al confirmarse, el discontinuo warning
  // cede al continuo tinta (fundido entre dos trazos, sin tonos intermedios).
  const warnIn = interpolateColors(frame, [T.stop - 1, T.stop + 3], [color.ink900, color.warning]);
  const solid = progress(frame, T.resolve, 3, ease.out);
  const settled = progress(frame, T.resolve, motion.overlay, ease.overlay);
  const focus = progress(frame, T.tap, motion.press, ease.out) * (1 - solid);
  return (
    // El frame del golpe (f15) sale nítido: la estela solo acompaña la subida.
    <DirBlur id="sin-b9" vy={frame === T.stop ? 0 : velocity(bY, frame)} style={{position: "absolute", left: X, top: y}}>
      <div style={{position: "absolute", inset: 0, borderRadius: radius.module, boxShadow: shadow.float, opacity: 1 - settled}} />
      <div style={{position: "absolute", inset: 0, borderRadius: radius.module, boxShadow: shadow.card, opacity: settled}} />
      <SlotCard
        frame={frame}
        g={G}
        ink={color.ink900}
        dashInk={warnIn}
        dashed={1 - solid}
        strip={settled}
        check={{circle: progress(frame, T.resolve, motion.press, ease.out), draw: progress(frame, T.resolve + 2, 8, ease.out)}}
        pistaTint={progress(frame, T.stop, 4, ease.out) * (1 - solid)}
        chevron={1 - progress(frame, T.resolve, 6, ease.out)}
        pistaScale={pressScale(frame, T.tap)}
        focus={focus}
        values={[
          // 1 → 3 directo: un paso intermedio «2» se leería como otra pista.
          {initial: "1", duration: 6, keys: [{at: T.resolve, value: "3"}]},
          {initial: "MAR", keys: []},
          {initial: "19:00", keys: []},
        ]}
      />
      <CelebrateRing frame={frame} at={T.resolve} w={G.w} h={H} spread={16} />
      <StatusChip frame={frame} />
      {/* Toque en la celda PISTA: se apaga antes del digit-roll */}
      <div style={{position: "absolute", inset: 0, opacity: 1 - progress(frame, T.resolve - 4, 4, ease.out)}}>
        <TapRipple frame={frame} at={T.tap} x={144} y={136} />
      </div>
    </DirBlur>
  );
};

// Anchos medidos de «Ocupada» y «Confirmada» (Instrument Sans 600, 44 px) + punto y márgenes.
const CHIP = {h: 88, font: 44, dot: 16, padL: 32, padR: 36, gap: 18, border: 2};
const measure = (() => {
  const cache = new Map<string, number>();
  return (text: string) => {
    const hit = cache.get(text);
    if (hit !== undefined) return hit;
    const ctx = document.createElement("canvas").getContext("2d");
    let w = text.length * CHIP.font * 0.55;
    if (ctx) {
      ctx.font = `600 ${CHIP.font}px 'Instrument Sans Variable'`;
      w = ctx.measureText(text).width;
    }
    cache.set(text, w);
    return w;
  };
})();

/** Chip de estado bajo el módulo: «Ocupada» (warning) → «Confirmada» (success). */
const StatusChip: React.FC<{frame: number}> = ({frame}) => {
  if (frame < T.warn) return null;
  const swap = progress(frame, T.resolve, motion.view, ease.out);
  const tone = progress(frame, T.resolve, 4, ease.out);
  const wOcc = measure("Ocupada");
  const wConf = measure("Confirmada");
  // El chip se ensancha antes de que llegue la palabra nueva: nunca la recorta.
  const textW = lerp(wOcc, wConf, progress(frame, T.resolve, 2, ease.out));
  // + bordes de 2 px (border-box) y 4 px de holgura: la «a» final nunca se recorta.
  const width = CHIP.padL + CHIP.dot + CHIP.gap + Math.ceil(textW) + 4 + CHIP.padR + 2 * CHIP.border;
  const bg = interpolateColors(tone, [0, 1], [color.warningBg, color.successBg]);
  const border = interpolateColors(tone, [0, 1], [color.warningBorder, color.successBorder]);
  const dot = interpolateColors(tone, [0, 1], [color.warning, color.success]);
  const label: React.CSSProperties = {position: "absolute", left: 0, top: 0, lineHeight: `${CHIP.h - 4}px`, whiteSpace: "nowrap"};
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: H + 40,
        width,
        height: CHIP.h,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: CHIP.gap,
        padding: `0 ${CHIP.padR}px 0 ${CHIP.padL}px`,
        borderRadius: radius.pill,
        background: bg,
        border: `${CHIP.border}px solid ${border}`,
        ...textStyle(600),
        fontSize: CHIP.font,
        ...view(frame, T.warn),
      }}
    >
      <span style={{width: CHIP.dot, height: CHIP.dot, borderRadius: CHIP.dot / 2, background: dot, flexShrink: 0}} />
      <span style={{position: "relative", height: CHIP.h - 4, flex: 1, overflow: "hidden"}}>
        <span style={{...label, color: color.ink900, transform: `translateY(${-swap * 100}%)`, opacity: 1 - swap}}>Ocupada</span>
        <span style={{...label, color: color.success, transform: `translateY(${(1 - swap) * 100}%)`, opacity: swap}}>Confirmada</span>
      </span>
    </div>
  );
};

const Content: React.FC<{exit: number}> = ({exit}) => {
  const frame = useCurrentFrame();
  const px = (f: number) => pushX(f, exit);
  return (
    <DirBlur id="sin-push9" vx={velocity(px, frame)} style={{position: "absolute", inset: 0, transform: `translateX(${px(frame)}px)`}}>
      <Silhouette />
      <ModuleB frame={frame} />
    </DirBlur>
  );
};

const HEADLINE: React.CSSProperties = {
  position: "absolute",
  left: X,
  width: G.w,
  fontSize: 88,
  fontWeight: 760,
  lineHeight: 1,
  color: color.ink900,
};

export const Portrait: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useScene();
  // Push en los últimos 8 f; la HUD sale 1 f antes para que el último frame quede limpio.
  const exit = Math.min(T.exit, durationInFrames - motion.exit);
  const hudOut = exit - 1;
  return (
    <AbsoluteFill style={{background: color.sand50}}>
      <Content exit={exit} />
      {/* HUD fija: titulares en dos líneas controladas */}
      <WordsReveal text="Sin dobles" frame={frame} start={T.title} step={3} exitAt={T.titleOut} style={{...HEADLINE, top: 272}} />
      <WordsReveal text="reservas." frame={frame} start={T.title + 6} step={3} exitAt={T.titleOut} style={{...HEADLINE, top: 364}} />
      <WordsReveal text="Dos partidos." frame={frame} start={T.resolve} step={3} exitAt={hudOut} style={{...HEADLINE, top: 272}} />
      <WordsReveal text="Dos pistas." frame={frame} start={T.resolve + 6} step={3} exitAt={hudOut} style={{...HEADLINE, top: 364}} />
    </AbsoluteFill>
  );
};
