import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {CalendarPlus, ChevronLeft, ChevronRight, Plus, Swords, Trophy, User} from "lucide-react";
import {color, displayStyle, monoStyle} from "../../brand/tokens";
import {WordsReveal} from "../../components";
import {ease, progress} from "../../lib/anim";
import {T9} from "./cues";
import {COURTS, SLOTS, TARGET, bookingAt, isTarget} from "./data";
import {DirBlur, usePushOut, velocity} from "./blur";
import {ClubAvatar, ConfirmButton, DashedRect, Marcador, TapRing, marcadorSize, press} from "./ui";

// ─── Geometría 9:16 ────────────────────────────────────────────────────────
// Portal a pantalla completa y sin marco (y480–1520), titulares en y272–452.
// Márgenes laterales de 72 px (x72–1008), como el resto de escenas verticales.
const X = 72;
const W = 936;
const HEAD = {y: 496, h: 88};
const NUM_Y = 608;
const GRID = {y: 664, gap: 16, h: 168};
const CELL_W = (W - 3 * GRID.gap) / 4;
const BAR = {y: 1424, h: 96};
const cellX = (ci: number) => X + ci * (CELL_W + GRID.gap);
const cellY = (si: number) => GRID.y + si * (GRID.h + GRID.gap);

const SHEET_TOP = 944;
/**
 * Velo: nace transparente bajo el titular A (y272–452) y llega al 40 %
 * sobre la rejilla. Un degradado largo, no un borde: no parte el cuadro en dos.
 */
const VEIL_Y = 456;
const VEIL_FULL = GRID.y;
const MOD = {v: 96, l: 28, cols: [0.22, 0.34, 0.44] as [number, number, number]};
const MOD_H = marcadorSize(MOD.v, MOD.l, 0, 3).height;
const MOD_Y = 64;
const BTN = {w: W, h: 110};
const BTN_Y = MOD_Y + MOD_H + 80;

/** Entrada «vista» adelantada 3 f: el primer frame ya muestra el portal. */
const enter = (frame: number, at: number) => {
  const p = progress(frame, at - 3, 6, ease.out);
  return {opacity: p, transform: `translateY(${(1 - p) * 4}px)`};
};

const Cell: React.FC<{frame: number; ci: number; si: number}> = ({frame, ci, si}) => {
  const b = bookingAt(ci, si);
  const tgt = isTarget(ci, si);
  const pr = tgt ? press(frame, T9.tap) : 1;
  const sel = tgt ? progress(frame, T9.tap + 2, 6, ease.out) : 0;
  const e = enter(frame, si * 0.5);
  const style: React.CSSProperties = {
    position: "absolute",
    left: cellX(ci),
    top: cellY(si),
    width: CELL_W,
    height: GRID.h,
    borderRadius: 16,
    opacity: e.opacity,
    transform: `${e.transform} scale(${pr})`,
  };
  if (b) return <div style={{...style, background: color.sand300}} />;
  return (
    <div style={style}>
      <DashedRect w={CELL_W} h={GRID.h} r={16} dash="10 8" opacity={1 - sel} />
      {sel > 0 ? (
        <div
          style={{position: "absolute", inset: 0, borderRadius: 16, border: `3px solid ${color.ink900}`, background: color.surfaceRaised, opacity: sel}}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...monoStyle(600),
          fontSize: 44,
          color: sel > 0.5 ? color.ink900 : color.ink500,
        }}
      >
        {tgt ? SLOTS[si] : <Plus size={36} strokeWidth={2.2} color={color.sand400} />}
      </div>
    </div>
  );
};

const Portal: React.FC<{frame: number}> = ({frame}) => (
  <>
    <div style={{position: "absolute", left: X, top: HEAD.y, width: W, height: HEAD.h, display: "flex", gap: 24, ...enter(frame, 0)}}>
      <ClubAvatar size={HEAD.h} r={20} />
      <div
        style={{
          flex: 1,
          boxSizing: "border-box",
          borderRadius: 18,
          border: `3px solid ${color.sand300}`,
          background: color.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          color: color.ink500,
        }}
      >
        <ChevronLeft size={40} strokeWidth={2.4} />
        <span style={{...displayStyle(800), fontSize: 48, color: color.ink900}}>Jueves</span>
        <ChevronRight size={40} strokeWidth={2.4} />
      </div>
    </div>
    {COURTS.map((_, ci) => (
      <div
        key={ci}
        style={{
          position: "absolute",
          left: cellX(ci),
          top: NUM_Y,
          width: CELL_W,
          textAlign: "center",
          ...monoStyle(600),
          fontSize: 32,
          lineHeight: "40px",
          color: color.ink500,
          ...enter(frame, 1),
        }}
      >
        {ci + 1}
      </div>
    ))}
    {COURTS.map((_, ci) => SLOTS.map((__, si) => <Cell key={`${ci}-${si}`} frame={frame} ci={ci} si={si} />))}
    {/* Barra inferior decorativa: solo iconos */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: BAR.y,
        width: 1080,
        height: BAR.h,
        boxSizing: "border-box",
        borderTop: `3px solid ${color.sand300}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: `0 ${X}px`,
        ...enter(frame, 1),
      }}
    >
      {[CalendarPlus, Swords, Trophy, User].map((Icon, i) => (
        <Icon key={i} size={48} strokeWidth={i === 0 ? 2.4 : 2.1} color={i === 0 ? color.green600 : color.ink400} />
      ))}
    </div>
  </>
);

const Sheet: React.FC<{frame: number}> = ({frame}) => {
  const sp = progress(frame, T9.sheet, 7, ease.overlay);
  if (sp <= 0) return null;
  const strip = progress(frame, T9.done, 8, ease.out);
  const check = progress(frame, T9.done + 1, 10, ease.out);
  return (
    <>
      {/* Velo tinta al 40 % sobre la rejilla; la cabecera queda en la penumbra */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: VEIL_Y,
          width: 1080,
          height: 1920 - VEIL_Y,
          background: `linear-gradient(to bottom, rgba(28,26,23,0) 0px, rgba(28,26,23,0.14) ${(VEIL_FULL - VEIL_Y) * 0.4}px, rgba(28,26,23,0.4) ${VEIL_FULL - VEIL_Y}px, rgba(28,26,23,0.4) 100%)`,
          opacity: sp,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: SHEET_TOP,
          width: 1080,
          height: 1920 - SHEET_TOP,
          borderRadius: "40px 40px 0 0",
          background: color.surface,
          boxShadow: "0 -24px 60px -24px rgba(20,18,15,0.45)",
          transform: `translateY(${(1 - sp) * (1920 - SHEET_TOP + 40)}px)`,
        }}
      >
        <div style={{position: "absolute", left: 540 - 40, top: 24, width: 80, height: 8, borderRadius: 4, background: color.sand400}} />
        <div style={{position: "absolute", left: X, top: MOD_Y}}>
          <Marcador
            frame={frame}
            start={T9.sheet + 2}
            cellStagger={1}
            width={W}
            valueSize={MOD.v}
            labelSize={MOD.l}
            cols={MOD.cols}
            strip={strip}
            stripW={10}
            check={check}
            line={3}
          />
        </div>
        <div style={{position: "absolute", left: 540 - BTN.w / 2, top: BTN_Y}}>
          <ConfirmButton frame={frame} at={T9.confirm} width={BTN.w} height={BTN.h} fontSize={40} r={16} />
        </div>
        <TapRing frame={frame} at={T9.confirm} x={540} y={BTN_Y + BTN.h / 2} size={96} />
      </div>
    </>
  );
};

const Content: React.FC = () => {
  const frame = useCurrentFrame();
  const push = usePushOut();
  return (
    <DirBlur
      id="reserva-push9"
      vx={velocity(push.x, frame)}
      pad={10}
      style={{position: "absolute", inset: 0, background: color.sand50, transform: `translateX(${push.x(frame)}px)`}}
    >
      <Portal frame={frame} />
      <TapRing
        frame={frame}
        at={T9.tap}
        x={cellX(TARGET.court) + CELL_W / 2}
        y={cellY(TARGET.slot) + GRID.h / 2}
        size={96}
      />
      <Sheet frame={frame} />
    </DirBlur>
  );
};

const HEADLINE: React.CSSProperties = {
  position: "absolute",
  left: X,
  top: 272,
  fontSize: 88,
  fontWeight: 760,
  lineHeight: 1,
  color: color.ink900,
  whiteSpace: "nowrap",
};

/** Salida del titular B en 7 f (f112–f119): el último frame de la escena ya queda limpio. */
const HUD_EXIT = 7;

export const Portrait: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: color.sand50}}>
      <Content />
      {/* HUD fija. A en dos líneas controladas (272 / 364, como «sin-solapamientos»); B en una sola línea a 80 px (≈855 px, cabe en x72–1008). */}
      <WordsReveal text="Reservas 24/7" frame={frame} start={-3} step={3} exitAt={T9.titleOut} style={HEADLINE} />
      <WordsReveal text="desde el móvil." frame={frame} start={3} step={3} exitAt={T9.titleOut} style={{...HEADLINE, top: 364}} />
      <WordsReveal
        text="Sin descargar nada."
        frame={frame}
        start={T9.sheet}
        step={3}
        exitAt={T9.exit}
        exitDuration={HUD_EXIT}
        style={{...HEADLINE, fontSize: 80}}
      />
    </AbsoluteFill>
  );
};
