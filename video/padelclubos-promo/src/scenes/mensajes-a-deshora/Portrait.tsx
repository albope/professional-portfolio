import React from "react";
import {AbsoluteFill, interpolateColors, useCurrentFrame} from "remotion";
import {ChevronLeft, Users} from "lucide-react";
import {color, displayStyle, monoStyle} from "../../brand/tokens";
import {DigitRoll, type RollKey} from "../../components";
import {BEAT, ease, progress} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {NEXT_BG} from "./bg";
import {BADGE, P} from "./cues";
import {BubbleLines, Initials, JAVI_9, SkelBubble, bubbleRadius, outline} from "./Chat";

// Maqueta vertical (1080×1920): reloj en y290–500, chat a toda la anchura en
// x72–1008 · y560–1220 y titular en y1260–1480. Nada en los 250 px de arriba
// ni por debajo de y1520.
const PANEL = {x: 72, y: 560, w: 936, h: 660, r: 32} as const;
const HEADER_H = 112;
const VIEW = {top: PANEL.y + HEADER_H, bottom: PANEL.y + PANEL.h} as const;
const AV = 64;
const AV_X = PANEL.x + 28;
const BUBBLE_X = AV_X + AV + 16;
const GAP = 14;
const JAVI = {w: 588, h: 112} as const;
// Javi es el último mensaje en f0; los esqueletos llegan debajo y lo empujan.
const JAVI_TOP0 = VIEW.bottom - 28 - JAVI.h;

interface Skel {
  y: number;
  h: number;
  w: number;
  bars: number[];
  at?: number;
}

const SKEL_1 = 60;
const SKEL_2 = 94;
// Historial anterior (encima de Javi), en coordenadas con Javi en y=0.
const OLDER: Skel[] = (() => {
  const spec = [
    {h: SKEL_1, w: 300, bars: [236]},
    {h: SKEL_2, w: 640, bars: [566, 330]},
    {h: SKEL_1, w: 380, bars: [312]},
    {h: SKEL_2, w: 700, bars: [620, 410]},
    {h: SKEL_1, w: 260, bars: [196]},
    {h: SKEL_2, w: 560, bars: [486, 268]},
  ];
  let y = 0;
  return spec.map((s) => {
    y -= s.h + GAP;
    return {...s, y};
  });
})();
// Mensajes que llegan en cada corchea.
const NEWER: Skel[] = (() => {
  const widths = [
    {w: 420, bars: [350]},
    {w: 600, bars: [528]},
    {w: 300, bars: [232]},
    {w: 680, bars: [606]},
    {w: 380, bars: [312]},
  ];
  let y = JAVI.h + GAP;
  return P.pushes.map((at, i) => {
    const s = {y, h: SKEL_1, ...widths[i], at};
    y += SKEL_1 + GAP;
    return s;
  });
})();

const scrollAt = (frame: number) => NEWER.reduce((acc, s) => acc + (s.h + GAP) * progress(frame, s.at ?? 0, 7, ease.overlay), 0);

const vibrationAt = (frame: number) => {
  for (const v of P.vibrate) {
    const d = frame - v;
    if (d >= 1 && d < 10) return 4 * (1 - d / 10) * (d % 2 === 1 ? 1 : -1);
  }
  return 0;
};

export const Portrait: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useScene();
  const scroll = scrollAt(frame);
  const vib = vibrationAt(frame);
  const hot = progress(frame, P.detach, 4, ease.out);
  const lift = progress(frame, P.detach, 7, ease.overlay);
  const colonOn = frame % BEAT < 8;
  // Salida: reloj, chat y titular se funden y el titular sube 4 px (vista
  // inversa) entre f53 y el último frame; la burbuja de Javi sigue opaca y
  // queda sola en f59 para el match cut con «dobles-reservas».
  const out = progress(frame, P.out, durationInFrames - 1 - P.out, ease.in);
  const badgeKeys: RollKey[] = P.pushes.map((at, i) => ({at, value: String(BADGE[i + 1])}));

  // Burbuja de Javi: de su sitio en el chat hacia el centro (match cut).
  const javiY = JAVI_TOP0 - scroll;
  const from = {cx: BUBBLE_X + JAVI.w / 2, cy: javiY + JAVI.h / 2};
  const to = {cx: 540, cy: 900};
  const cx = from.cx + (to.cx - from.cx) * lift;
  const cy = from.cy + (to.cy - from.cy) * lift;
  const k = 1 + 0.12 * lift;

  const skel = (s: Skel, key: string) => {
    const pIn = s.at === undefined ? 1 : progress(frame, s.at, 7, ease.overlay);
    if (pIn <= 0) return null;
    const y = JAVI_TOP0 + s.y - scroll + (1 - pIn) * 12;
    if (y > VIEW.bottom || y + s.h < VIEW.top - 40) return null;
    return (
      <div key={key} style={{position: "absolute", left: 0, top: y, opacity: Math.min(1, pIn * 1.6)}}>
        <Initials size={AV} style={{position: "absolute", left: AV_X, top: 0}} />
        <SkelBubble
          w={s.w}
          h={s.h}
          bars={s.bars}
          barH={20}
          pad={20}
          gap={14}
          r={28}
          tail={8}
          style={{position: "absolute", left: BUBBLE_X, top: 0}}
        />
      </div>
    );
  };

  return (
    <AbsoluteFill style={{background: `radial-gradient(100% 70% at 50% 42%, ${color.darkSurface} 0%, ${color.darkBg} 70%)`}}>
      {/* El fondo pasa al de «dobles-reservas» mientras la burbuja se desprende. */}
      <AbsoluteFill style={{background: NEXT_BG, opacity: progress(frame, P.detach, 14, ease.inOut)}} />
      {/* Reloj gigante */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 290,
          height: 210,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...monoStyle(500),
          fontSize: 240,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: color.darkText,
          whiteSpace: "pre",
          opacity: 1 - out,
        }}
      >
        23<span style={{opacity: colonOn ? 1 : 0.16}}>:</span>47
      </div>

      {/* Chat del grupo, sin marco de móvil */}
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          borderRadius: PANEL.r,
          background: color.darkSurface,
          boxShadow: `inset 0 0 0 2px ${color.darkBorder}, 0 50px 100px -40px rgba(0,0,0,0.7)`,
          transform: `translateX(${vib}px)`,
          opacity: (1 - 0.6 * hot) * (1 - out),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: HEADER_H,
            background: color.darkRaised,
            borderBottom: `2px solid ${color.darkBorder}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 32px 0 16px",
            zIndex: 5,
          }}
        >
          <ChevronLeft size={48} color={color.sand400} strokeWidth={2.4} />
          <div
            style={{
              marginLeft: -8,
              padding: "4px 16px",
              borderRadius: 999,
              background: color.painRed,
              color: color.darkBg,
              ...monoStyle(700),
              fontSize: 34,
              lineHeight: 1.2,
              minWidth: 44,
              textAlign: "center",
            }}
          >
            <DigitRoll frame={frame} keys={badgeKeys} initial={String(BADGE[0])} />
          </div>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: color.darkBorder,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginLeft: 8,
            }}
          >
            <Users size={32} color={color.sand400} strokeWidth={2.2} />
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: 12}}>
            <div style={{width: 300, height: 22, borderRadius: 11, background: color.darkBorder}} />
            <div style={{width: 184, height: 16, borderRadius: 8, background: color.darkBorder, opacity: 0.7}} />
          </div>
        </div>
        {/* Los mensajes se dibujan en coordenadas del cuadro, recortados al visor */}
        <div style={{position: "absolute", left: -PANEL.x, top: -PANEL.y, width: 1080, height: 1920}}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: VIEW.top,
              width: 1080,
              height: VIEW.bottom - VIEW.top,
              overflow: "hidden",
            }}
          >
            <div style={{position: "absolute", left: 0, top: -VIEW.top}}>
              {OLDER.map((s, i) => skel(s, `o${i}`))}
              {/* Al desprenderse la burbuja, el avatar se queda como uno más del historial. */}
              <Initials
                size={AV}
                text="JM"
                fontSize={26}
                style={{position: "absolute", left: AV_X, top: javiY, color: interpolateColors(lift, [0, 1], [color.sand400, color.darkBorder])}}
              />
              {NEWER.map((s, i) => skel(s, `n${i}`))}
            </div>
          </div>
        </div>
      </div>

      {/* Burbuja legible de Javi (fuera del recorte para poder despegarse) */}
      <div
        style={{
          position: "absolute",
          left: cx - JAVI.w / 2,
          top: cy - JAVI.h / 2,
          width: JAVI.w,
          height: JAVI.h,
          transform: `translateX(${vib * (1 - lift)}px) scale(${k})`,
          borderRadius: bubbleRadius(28, 8),
          background: color.darkRaised,
          // Misma sombra que el módulo de «dobles-reservas» (0,7), aquí escalada con la burbuja.
          boxShadow: [outline(hot), lift > 0 ? `0 40px 80px -30px rgba(0,0,0,${(0.7 * lift).toFixed(3)})` : undefined]
            .filter(Boolean)
            .join(", ") || undefined,
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          boxSizing: "border-box",
        }}
      >
        <BubbleLines lines={JAVI_9} size={44} lineHeight={56} hl={hot} />
      </div>

      {/* Titular */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 1260,
          width: 888,
          ...displayStyle(760),
          fontSize: 84,
          lineHeight: 1.06,
          color: color.darkText,
          opacity: 1 - out,
          transform: `translateY(${-4 * out}px)`,
        }}
      >
        ¿Otra reserva
        <br />
        por WhatsApp?
      </div>
    </AbsoluteFill>
  );
};
