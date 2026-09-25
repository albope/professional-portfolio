import React from "react";
import {AbsoluteFill, interpolateColors, useCurrentFrame} from "remotion";
import {color, displayStyle, monoStyle, radius, shadow, textStyle} from "../../brand/tokens";
import {DigitRoll, WordsReveal} from "../../components";
import {ease, motion, pressScale, progress, tween, view} from "../../lib/anim";
import {T9 as T} from "./cues";
import {RESULT, STANDINGS, rollSteps, type Standing} from "./data";
import {CheckStroke, DirBlur, LiveDot, PersonAvatar, TapRing, flip, liftShadow, settle, riseTint, velocity} from "./ui";

// ─── Geometría 9:16 ─────────────────────────────────────────────────────────
// Todo entre y250 e y1520; el texto, con x ≤ 960.
const X = 72;
const W = 936;
/** Con cifras de 96 px, el módulo lleva líneas de 3 px (como en «reserva-movil» vertical). */
const LW = 3;
const LINE = `${LW}px solid ${color.ink900}`;

/** Módulo de resultado: pareja (avatares) | set 1 | set 2 | guardar. */
const MOD = {y: 504, row: 124, set: 200, save: 168};
const MOD_H = LW + MOD.row + LW + MOD.row + LW;
const PAIR_COL = W - 2 * LW - (MOD.save + LW) - 2 * (MOD.set + LW);

/** Clasificación: tres filas altas. */
const TAB = {y: 824, row: 196};
const TAB_H = 4 + 3 * TAB.row;
const ROW_PAD = 40;

/** Push del acto: entra desde +540 px en 7 f. Sin salida: corte seco a la noche. */
const PUSH = 540;
const pushX = (f: number) => tween(f, [0, motion.overlay], [PUSH, 0], ease.overlay);

const TONES = {
  gf: [color.ink700, color.ink500],
  mm: [color.ink300, color.sand400],
  ghost: [color.sand300, color.sand400],
} as const;

const Pair: React.FC<{size: number; tones: readonly [string, string]; ring: string; overlap: number}> = ({size, tones, ring, overlap}) => (
  <div style={{display: "flex", flexShrink: 0}}>
    <PersonAvatar size={size} bg={tones[0]} ring={ring} ringW={4} />
    <PersonAvatar size={size} bg={tones[1]} ring={ring} ringW={4} style={{marginLeft: -overlap}} />
  </div>
);

// ─── Módulo de resultado ────────────────────────────────────────────────────

const SetCell: React.FC<{frame: number; value: string; at: number; next: number}> = ({frame, value, at, next}) => {
  const focus = progress(frame, Math.max(at - 3, T.result), 3, ease.out) * (1 - progress(frame, next - 2, 3, ease.out));
  const dash = 1 - progress(frame, at, 3, ease.out);
  return (
    <div style={{position: "relative", width: MOD.set, height: MOD.row, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: 10,
          boxShadow: `inset 0 0 0 3px ${color.green400}`,
          background: `rgba(47,160,117,${(0.08 * focus).toFixed(3)})`,
          opacity: focus,
        }}
      />
      <span style={{position: "absolute", width: 44, height: 6, borderRadius: 3, background: color.sand300, opacity: dash}} />
      <span style={{...displayStyle(800), fontSize: 96, lineHeight: 1, color: color.ink900, position: "relative"}}>
        <DigitRoll frame={frame} keys={[{at, value}]} alignRight={false} />
      </span>
    </div>
  );
};

const ResultModule: React.FC<{frame: number}> = ({frame}) => {
  const inP = progress(frame, T.result, motion.overlay, ease.overlay);
  const op = progress(frame, T.result, 3, ease.out);
  if (op <= 0) return null;
  const typedAt = (pair: number, set: number): number => T.games[RESULT.order.findIndex(([p, s]) => p === pair && s === set)];
  const order: number[] = RESULT.order.map(([p, s]) => typedAt(p, s));
  const nextOf = (at: number) => {
    const i = order.indexOf(at);
    return i < order.length - 1 ? order[i + 1] : T.save - 3;
  };
  const saved = progress(frame, T.save + 2, 6, ease.out);
  const enabled = progress(frame, T.games[3] + 3, 4, ease.out);
  const setCol: React.CSSProperties = {width: MOD.set + LW, boxSizing: "border-box", borderLeft: LINE, flexShrink: 0};
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: MOD.y,
        width: W,
        height: MOD_H,
        boxSizing: "border-box",
        border: LINE,
        borderRadius: radius.module,
        background: color.surfaceRaised,
        overflow: "hidden",
        boxShadow: liftShadow(settle(frame, T.save + 2)),
        display: "flex",
        opacity: op,
        transform: `translateY(${(1 - inP) * 40}px)`,
      }}
    >
      <div style={{display: "flex", flexDirection: "column", width: W - 2 * LW - MOD.save - LW}}>
        {[0, 1].map((p) => (
          <div key={p} style={{display: "flex", height: MOD.row, borderBottom: p === 0 ? LINE : "none"}}>
            <div style={{width: PAIR_COL, display: "flex", alignItems: "center", justifyContent: "center"}}>
              <Pair size={84} tones={p === 0 ? TONES.gf : TONES.mm} ring={color.surfaceRaised} overlap={18} />
            </div>
            {[0, 1].map((s) => {
              const at = typedAt(p, s);
              return (
                <div key={s} style={setCol}>
                  <SetCell frame={frame} value={RESULT.games[p][s]} at={at} next={nextOf(at)} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Guardar: columna a toda altura. Deshabilitada → verde al escribir el último juego → confirmada al tocar */}
      <div
        style={{
          width: MOD.save + LW,
          boxSizing: "border-box",
          borderLeft: LINE,
          background: interpolateColors(saved, [0, 1], [
            interpolateColors(enabled, [0, 1], [color.sand200, frame >= T.save && frame < T.save + 4 ? color.primaryHover : color.primary]),
            color.greenTint,
          ]),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{transform: `scale(${pressScale(frame, T.save)})`}}>
          <CheckStroke
            p={1}
            size={72}
            stroke={interpolateColors(saved, [0, 1], [interpolateColors(enabled, [0, 1], [color.ink300, color.onPrimary]), color.green600])}
            width={2.8}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Clasificación ──────────────────────────────────────────────────────────

const Row: React.FC<{frame: number; s: Standing}> = ({frame, s}) => {
  const slot = flip(frame, T.reorder, s.from, s.to);
  const rising = s.to < s.from;
  const tint = rising ? riseTint(frame, T.reorder) : 0;
  const moving = s.from !== s.to ? Math.sin(Math.PI * progress(frame, T.reorder, 7, ease.overlay)) : 0;
  const hero = s.id === "gf";
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: slot * TAB.row,
        width: W - 4,
        height: TAB.row,
        boxSizing: "border-box",
        padding: `0 ${ROW_PAD + 8}px 0 ${ROW_PAD + 96}px`,
        display: "flex",
        alignItems: "center",
        gap: 28,
        background: interpolateColors(tint, [0, 1], [color.sand50, color.greenTint]),
        borderTop: slot < 0.5 ? "none" : `2px solid ${color.sand200}`,
        boxShadow: moving > 0.01 && rising ? `0 ${Math.round(14 * moving)}px ${Math.round(32 * moving)}px -16px rgba(28,26,23,${(0.3 * moving).toFixed(3)})` : "none",
        zIndex: rising ? 3 : 1,
        ...view(frame, T.rows[s.from]),
      }}
    >
      <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: color.green600, opacity: tint}} />
      <Pair size={88} tones={hero ? TONES.gf : TONES.ghost} ring={color.sand50} overlap={20} />
      {hero ? (
        <>
          <span style={{...textStyle(600), fontSize: 44, lineHeight: 1, color: color.ink900, whiteSpace: "nowrap"}}>{s.name}</span>
          <span style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: 16}}>
            <span style={{...monoStyle(700), fontSize: 28, color: color.green600, ...view(frame, T.reorder + 4)}}>▲</span>
            <span style={{...displayStyle(800), fontSize: 72, lineHeight: 1, color: color.ink900, minWidth: "1.2ch", textAlign: "right"}}>
              <DigitRoll frame={frame} keys={rollSteps(s.before.pts, s.after.pts, T.points[0], T.points)} initial={String(s.before.pts)} />
            </span>
          </span>
        </>
      ) : (
        <>
          <span style={{width: 248, height: 24, borderRadius: 12, background: color.sand300}} />
          <span style={{marginLeft: "auto", width: 64, height: 48, borderRadius: 10, background: color.sand200}} />
        </>
      )}
    </div>
  );
};

const Standings: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: "absolute",
      left: X,
      top: TAB.y,
      width: W,
      height: TAB_H,
      boxSizing: "border-box",
      border: `2px solid ${color.sand300}`,
      borderRadius: radius.surface,
      background: color.sand50,
      overflow: "hidden",
      boxShadow: shadow.card,
    }}
  >
    {STANDINGS.filter((s) => s.from < 3).map((s) => (
      <Row key={s.id} frame={frame} s={s} />
    ))}
    {/* Posiciones fijas en su franja */}
    {[1, 2, 3].map((n, i) => (
      <div
        key={n}
        style={{
          position: "absolute",
          left: ROW_PAD,
          top: i * TAB.row,
          height: TAB.row,
          display: "flex",
          alignItems: "center",
          ...monoStyle(600),
          fontSize: 56,
          lineHeight: 1,
          color: n === 1 ? color.ink900 : color.ink500,
          zIndex: 5,
          ...view(frame, T.rows[i]),
        }}
      >
        {n}
      </div>
    ))}
  </div>
);

// ─── Composición ────────────────────────────────────────────────────────────

const HEADLINE: React.CSSProperties = {fontSize: 88, fontWeight: 760, lineHeight: 1, color: color.ink900, whiteSpace: "nowrap"};

export const Portrait: React.FC = () => {
  const frame = useCurrentFrame();
  const tapX = X + W - LW - MOD.save / 2;
  const tapY = MOD.y + MOD_H / 2;
  return (
    <AbsoluteFill style={{background: color.sand100}}>
      <DirBlur id="ligas-push9" vx={velocity(pushX, frame)} style={{position: "absolute", inset: 0, transform: `translateX(${pushX(frame)}px)`}}>
        <Standings frame={frame} />
        <ResultModule frame={frame} />
        <TapRing frame={frame} at={T.save} x={tapX} y={tapY} size={112} />
      </DirBlur>
      {/* HUD fija: titular en dos líneas; el punto verde late tras «real.» */}
      <WordsReveal text="Ligas en" frame={frame} start={T.title} step={3} style={{...HEADLINE, position: "absolute", left: X, top: 272}} />
      <div style={{position: "absolute", left: X, top: 364, display: "flex", alignItems: "center", gap: 28}}>
        <WordsReveal text="tiempo real." frame={frame} start={T.title + 6} step={3} style={HEADLINE} />
        <div style={{...view(frame, T.title + 12), marginTop: 12}}>
          <LiveDot frame={frame} pulses={T.pulses} size={24} ring={3} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
