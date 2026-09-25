import React from "react";
import {AbsoluteFill, interpolateColors, useCurrentFrame} from "remotion";
import {ChevronLeft, Mic, Plus, Users} from "lucide-react";
import {color, monoStyle, radius, textStyle} from "../../brand/tokens";
import {DayClock, DigitRoll, WordsReveal, type RollKey} from "../../components";
import {bars, ease, lerp, progress, tween} from "../../lib/anim";
import {CHIP_TIMES, L, UNREAD} from "./cues";
import {BubbleHead, BubbleLines, Initials, JAVI_16, PEDRO_16, SkelBubble, bubbleRadius, outline, type Seg} from "./Chat";
import {NEXT_BG} from "./bg";
import {LockScreen, NightPhone, PHONE, SCREEN, STATUS_H, StatusBar} from "./NightPhone";

// ---------------------------------------------------------------- reloj

/** Reloj gigante: JetBrains Mono 500 de 300 px en x160 (rima con «tu-descansas»). */
const CLOCK = {x: 160, y: 150, size: 300} as const;
// Mismo interlineado que el chip; el tracking pasa de −0,04 em (reloj
// gigante, más compacto) a 0,04 em (chip) durante el vuelo.
const CLOCK_LH = 1.15;
const CLOCK_TRACK = -0.04;
const CHIP_TRACK = 0.04;
// Posición de la hora dentro del chip del DayClock (x96 y56, borde 2, relleno
// 12/22, «LUN», hueco 14, «·», hueco 14; JetBrains Mono avanza 0,6 em).
const CHIP_FS = 28;
const CHAR = CHIP_FS * (0.6 + CHIP_TRACK);
const CHIP_TIME = {x: 96 + 2 + 22 + CHAR * 3 + 14 + CHAR + 14, y: 56 + 2 + 12} as const;

/** La píldora del chip se forma cuando los dígitos ya han aterrizado. */
const CHIP_AT = L.toCorner + 6;

const dayKeys: RollKey[] = [
  {at: 0, value: "LUN"},
  {at: L.bubbles[2], value: "MAR"},
];
const timeKeys: RollKey[] = [{at: 0, value: "23:47"}, ...CHIP_TIMES.map((value, i) => ({at: L.bubbles[i], value}))];

const BigClock: React.FC<{frame: number}> = ({frame}) => {
  const p = progress(frame, L.toCorner, 7, ease.overlay);
  // Escala lineal: el reloj se ve encoger camino de la esquina.
  const s = lerp(1, CHIP_FS / CLOCK.size, p);
  const x = lerp(CLOCK.x, CHIP_TIME.x, p);
  const y0 = CLOCK.y - ((CLOCK_LH - 1) * CLOCK.size) / 2;
  const y = lerp(y0, CHIP_TIME.y, p);
  // Va por encima del chip y desaparece cuando la píldora ya está entera:
  // debajo quedan los mismos glifos en el mismo sitio.
  if (frame >= CHIP_AT + 6) return null;
  // Los dos puntos parpadean en cada tiempo mientras es el reloj gigante.
  const colonOn = frame >= L.toCorner || frame % L.beat < 8;
  const fg = interpolateColors(p, [0, 1], [color.darkText, color.painRed]);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transformOrigin: "0 0",
        transform: `translate(${x}px, ${y}px) scale(${s})`,
        ...monoStyle(500),
        fontSize: CLOCK.size,
        lineHeight: CLOCK_LH,
        letterSpacing: `${lerp(CLOCK_TRACK, CHIP_TRACK, p)}em`,
        color: fg,
        whiteSpace: "pre",
      }}
    >
      23<span style={{opacity: colonOn ? 1 : 0.16}}>:</span>47
    </div>
  );
};

// ---------------------------------------------------------------- chat

const HEADER_H = 64;
const VIEW = {top: STATUS_H + HEADER_H, bottom: SCREEN.h - 64} as const;
const PAD = {top: 12, bottom: 12, gap: 10} as const;
const AV = 42;
const AV_X = 10;
const BUBBLE_X = AV_X + AV + 8;
const MSG_W = SCREEN.w - BUBBLE_X - 10;
const MSG_H = 114;

type Item =
  | {kind: "skel"; h: number; w: number; bars: number[]; at?: number}
  | {kind: "msg"; who: "javi" | "pedro"; h: number; at?: number};

// Chat anclado abajo, como una app real: el historial llena el visor y la de
// Javi es el último mensaje al abrir. Cada burbuja nueva entra abajo y empuja
// la lista (autoscroll overlay), así que Javi sube hasta arriba en f97.
// Solo dos burbujas legibles; el resto son esqueletos.
const ITEMS: Item[] = [
  {kind: "skel", h: 62, w: 196, bars: [150, 96]},
  {kind: "skel", h: 44, w: 172, bars: [128]},
  {kind: "skel", h: 62, w: 226, bars: [180, 118]},
  {kind: "skel", h: 44, w: 138, bars: [96]},
  {kind: "skel", h: 62, w: 212, bars: [166, 132]},
  {kind: "skel", h: 44, w: 190, bars: [146]},
  {kind: "skel", h: 62, w: 234, bars: [188, 104]},
  {kind: "msg", who: "javi", h: MSG_H},
  {kind: "skel", h: 44, w: 164, bars: [122], at: L.bubbles[0]},
  {kind: "msg", who: "pedro", h: MSG_H, at: L.bubbles[1]},
  {kind: "skel", h: 62, w: 232, bars: [186, 100], at: L.bubbles[2]},
  {kind: "skel", h: 44, w: 148, bars: [104], at: L.bubbles[3]},
  {kind: "skel", h: 62, w: 204, bars: [158, 128], at: L.bubbles[4]},
  {kind: "skel", h: 44, w: 182, bars: [138], at: L.bubbles[5]},
];
const JAVI_IDX = ITEMS.findIndex((it) => it.kind === "msg" && it.who === "javi");
const PEDRO_IDX = ITEMS.findIndex((it) => it.kind === "msg" && it.who === "pedro");

const TOPS = ITEMS.reduce<number[]>((acc, it, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + ITEMS[i - 1].h + PAD.gap);
  return acc;
}, []);
const VIEW_H = VIEW.bottom - VIEW.top;
/** Scroll con Javi como último mensaje (el chat se abre ahí). */
const SCROLL0 = TOPS[JAVI_IDX] + MSG_H + PAD.bottom - VIEW_H;

/** Autoscroll: cada burbuja nueva sube la lista su alto con curva overlay. */
const scrollAt = (frame: number) =>
  ITEMS.reduce((s, it) => (it.at === undefined ? s : s + (it.h + PAD.gap) * progress(frame, it.at, 7, ease.overlay)), SCROLL0);

const MsgBody: React.FC<{who: "javi" | "pedro"; hl: number}> = ({who, hl}) => (
  <div style={{padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4}}>
    <BubbleHead name={who === "javi" ? "Javi Martínez" : "Pedro Sanz"} time={who === "javi" ? "23:47" : "23:52"} nameSize={18} timeSize={16} />
    <BubbleLines lines={(who === "javi" ? JAVI_16 : PEDRO_16) as Seg[][]} size={26} lineHeight={32} hl={hl} />
  </div>
);

const ChatScreen: React.FC<{frame: number}> = ({frame}) => {
  const scroll = scrollAt(frame);
  const conflict = progress(frame, L.conflict, 4, ease.out);
  const detached = frame >= L.detach;
  return (
    <AbsoluteFill style={{background: color.darkSurface}}>
      <StatusBar frame={frame} time={timeKeys} />
      {/* Cabecera del grupo */}
      <div
        style={{
          position: "absolute",
          top: STATUS_H,
          left: 0,
          right: 0,
          height: HEADER_H,
          background: color.darkRaised,
          borderBottom: `2px solid ${color.darkBorder}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px 0 6px",
          zIndex: 5,
        }}
      >
        <ChevronLeft size={28} color={color.sand400} strokeWidth={2.2} />
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: color.darkBorder,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Users size={20} color={color.sand400} strokeWidth={2.2} />
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 1, marginLeft: 4, minWidth: 0}}>
          <span style={{...textStyle(600), fontSize: 18, color: color.darkText, whiteSpace: "nowrap"}}>Reservas Valencia Pádel</span>
          <span style={{...textStyle(400), fontSize: 16, color: color.ink400, whiteSpace: "nowrap"}}>142 participantes</span>
        </div>
      </div>
      {/* Mensajes */}
      <div style={{position: "absolute", top: VIEW.top, left: 0, width: SCREEN.w, height: VIEW_H, overflow: "hidden"}}>
        {ITEMS.map((it, i) => {
          const pIn = it.at === undefined ? 1 : progress(frame, it.at, 7, ease.overlay);
          if (pIn <= 0) return null;
          const y = TOPS[i] - scroll + (1 - pIn) * 12;
          if (y > VIEW_H || y + it.h < -PAD.top) return null;
          const isMsg = it.kind === "msg";
          const dim = isMsg ? 1 : 1 - 0.6 * conflict;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translateY(${y}px)`,
                width: SCREEN.w,
                opacity: Math.min(1, pIn * 1.6) * dim,
              }}
            >
              <Initials size={AV} text={isMsg ? (it.who === "javi" ? "JM" : "PS") : undefined} fontSize={16} style={{position: "absolute", left: AV_X, top: 0}} />
              {it.kind === "skel" ? (
                <SkelBubble
                  w={it.w}
                  h={it.h}
                  bars={it.bars}
                  barH={14}
                  pad={12}
                  gap={10}
                  r={18}
                  tail={6}
                  style={{position: "absolute", left: BUBBLE_X, top: 0}}
                />
              ) : detached ? null : (
                // Al despegarse, en el chat queda solo su avatar.
                <div
                  style={{
                    position: "absolute",
                    left: BUBBLE_X,
                    top: 0,
                    width: MSG_W,
                    height: it.h,
                    borderRadius: bubbleRadius(18, 6),
                    background: color.darkRaised,
                    boxShadow: outline(conflict),
                    boxSizing: "border-box",
                  }}
                >
                  <MsgBody who={it.who} hl={conflict} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Barra de escritura */}
      <div style={{position: "absolute", top: VIEW.bottom, left: 0, right: 0, height: SCREEN.h - VIEW.bottom, background: color.darkSurface}}>
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 8,
            width: SCREEN.w - 12 - 12 - 44 - 8,
            height: 44,
            borderRadius: 22,
            background: color.darkRaised,
            boxShadow: `inset 0 0 0 2px ${color.darkBorder}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
          }}
        >
          <Plus size={22} color={color.ink400} strokeWidth={2.2} />
        </div>
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 8,
            width: 44,
            height: 44,
            borderRadius: 22,
            background: color.darkRaised,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mic size={22} color={color.sand400} strokeWidth={2.2} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- notificación

const NOTIF_TOP = 204;
const NOTIF_H = 104;

/** Notificación de Javi sobre una pila de dos avisos más (3 sin leer). */
const Notification: React.FC<{frame: number}> = ({frame}) => {
  const p = progress(frame, L.notif, 7, ease.overlay);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        top: NOTIF_TOP,
        height: NOTIF_H,
        transform: `translateY(${(1 - p) * -(NOTIF_TOP + NOTIF_H + 40)}px)`,
      }}
    >
      {/* Pila: los avisos anteriores asoman por debajo. */}
      {[2, 1].map((n) => (
        <div
          key={n}
          style={{
            position: "absolute",
            left: 12 * n,
            right: 12 * n,
            top: 12 * n,
            height: NOTIF_H,
            borderRadius: radius.surface,
            background: color.darkRaised,
            boxShadow: `inset 0 0 0 2px ${color.darkBorder}`,
            opacity: n === 1 ? 0.7 : 0.4,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: color.darkRaised,
          borderRadius: radius.surface,
          boxShadow: `inset 0 0 0 2px ${color.darkBorder}, 0 12px 24px -12px rgba(0,0,0,0.6)`,
          padding: "14px 16px 16px 14px",
          boxSizing: "border-box",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <Initials size={42} text="JM" fontSize={16} />
        <div style={{display: "flex", flexDirection: "column", gap: 3, minWidth: 0, flex: 1}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
            <span style={{...textStyle(700), fontSize: 18, color: color.darkText}}>Javi Martínez</span>
            <span style={{...textStyle(400), fontSize: 16, color: color.ink400}}>ahora</span>
          </div>
          <span style={{...textStyle(400), fontSize: 18, lineHeight: 1.3, color: color.sand400}}>
            ¿Nos guardas la 1 mañana
            <br />a las 19:00?
          </span>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- vuelo al módulo

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t)});
const centered = (cx: number, cy: number, w: number, h: number): Rect => ({x: cx - w / 2, y: cy - h / 2, w, h});

const PHONE_C = {x: PHONE.x + PHONE.w / 2, y: PHONE.y + PHONE.h / 2} as const;
const pushIn = (frame: number) => 1 + 0.05 * tween(frame, [L.chatOpen, bars(2)], [0, 1], ease.in);

/** Rectángulo de una burbuja del chat en coordenadas del cuadro. */
const bubbleOnScreen = (idx: number, frame: number): Rect => {
  const s = pushIn(frame);
  const x = PHONE.x + PHONE.bezel + BUBBLE_X;
  const y = PHONE.y + PHONE.bezel + VIEW.top + TOPS[idx] - scrollAt(frame);
  return {x: PHONE_C.x + (x - PHONE_C.x) * s, y: PHONE_C.y + (y - PHONE_C.y) * s, w: MSG_W * s, h: MSG_H * s};
};

// Módulo A de «dobles-reservas» tal como lo dibuja su f0: 1040 px de ancho al
// 64 %, celdas de 214 y fila de total de 82 (con su separador), y un borde
// que mide 2 px en pantalla. Con B detrás (+24/+24). Se forma a la derecha
// del titular: su borde izquierdo queda en x767 y «deshora.» acaba en x≈680,
// así que no se tocan mientras la HUD sale. «dobles-reservas» (FROM16)
// arranca exactamente de este rectángulo.
const MOD_K = 0.64;
const MOD_B = 2;
const MOD_W = 1040 * MOD_K;
const MOD_H = (214 + 82) * MOD_K + 2 * MOD_B;
const MOD = centered(1100, 640, MOD_W, MOD_H);
// Trazos de 2 px en el mismo sitio que los de ese módulo (columnas de 342 y
// 347 al aterrizar): centro del trazo, en fracción de la caja.
/** Separadores de PISTA | FECHA | HORA. */
const SEP_X = [(MOD_B + 342 * MOD_K + 1) / MOD_W, (MOD_B + (342 + 347) * MOD_K + 1) / MOD_W] as const;
/** Separador de la fila de total y arranque de su relleno. */
const TOTAL_LINE = (MOD_B + 214 * MOD_K + 1) / MOD_H;
const TOTAL_FILL = (MOD_B + 214 * MOD_K + 2) / MOD_H;
const LIFT = 1.5;

const FlyingBubble: React.FC<{frame: number; who: "javi" | "pedro"}> = ({frame, who}) => {
  const idx = who === "javi" ? JAVI_IDX : PEDRO_IDX;
  const front = who === "javi";
  // 1) Despegue (overlay 7 f): salen del móvil y se leen grandes.
  // 2) Módulo (overlay 7 f): se funden en el mismo hueco del centro.
  const p1 = progress(frame, L.detach, 7, ease.overlay);
  const p2 = progress(frame, L.detach + 7, 7, ease.overlay);
  const r0 = bubbleOnScreen(idx, L.detach);
  const r1 = centered(1056, front ? 404 : 612, MSG_W * LIFT, MSG_H * LIFT);
  const off = front ? 0 : 24;
  const r2: Rect = {x: MOD.x + off, y: MOD.y + off, w: MOD.w, h: MOD.h};
  const r = p2 > 0 ? lerpRect(r1, r2, p2) : lerpRect(r0, r1, p1);
  // El texto se apaga en cuanto empieza a ser módulo, sin crecer con la caja.
  const textO = 1 - progress(frame, L.detach + 7, 2, ease.out);
  const k = Math.min(r.w / MSG_W, LIFT);
  const border = interpolateColors(p2, [0, 1], [color.painRed, "rgba(241,237,228,0.8)"]);
  const fill = interpolateColors(p2, [0, 1], [color.darkRaised, color.darkSurface]);
  const rad = lerp(18 * Math.min(k, LIFT), radius.module, p2);
  const tail = lerp(6 * Math.min(k, LIFT), radius.module, p2);
  // Separadores de las tres celdas y de la fila de total (solo el módulo A).
  // Se dibujan cuando el texto ya se ha ido (nunca se cruzan) y cierran en f119.
  const lineP = progress(frame, L.detach + 9, 5, ease.overlay);
  const totalP = progress(frame, L.detach + 9, 5, ease.out);
  return (
    <div
      style={{
        position: "absolute",
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        borderRadius: `${tail}px ${rad}px ${rad}px ${rad}px`,
        background: fill,
        boxShadow: `0 40px 80px -30px rgba(0,0,0,0.7)`,
        overflow: "hidden",
      }}
    >
      {front && totalP > 0 ? (
        // La fila de total conserva el color de la burbuja (#282420).
        <div style={{position: "absolute", left: 0, right: 0, top: r.h * TOTAL_FILL, bottom: 0, background: color.darkRaised, opacity: totalP}} />
      ) : null}
      {textO > 0 ? (
        <div style={{position: "absolute", left: 0, top: 0, width: MSG_W, transformOrigin: "0 0", transform: `scale(${k})`, opacity: textO}}>
          <MsgBody who={who} hl={1} />
        </div>
      ) : null}
      {front && lineP > 0 ? (
        <svg width={r.w} height={r.h} style={{position: "absolute", left: 0, top: 0}}>
          {SEP_X.map((fx) => (
            <line key={fx} x1={r.w * fx} x2={r.w * fx} y1={0} y2={r.h * TOTAL_LINE * lineP} stroke={border} strokeWidth={2} />
          ))}
          <line x1={0} x2={r.w * lineP} y1={r.h * TOTAL_LINE} y2={r.h * TOTAL_LINE} stroke={border} strokeWidth={2} />
        </svg>
      ) : null}
      {/* Borde de 2 px encima de todo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          boxShadow: `inset 0 0 0 2px ${border}`,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------- escena

// La HUD termina de salir en f119: el último frame queda limpio para el corte.
const HUD_OUT = 7;

export const Landscape: React.FC = () => {
  const frame = useCurrentFrame();

  // Móvil: vibración amortiguada de ±3 px y push-in 1 → 1,05 durante el c.2.
  const d = frame - L.notif;
  const vib = d >= 0 && d < 10 ? 3 * (1 - d / 10) * (d % 2 === 0 ? 1 : -1) : 0;
  const s = pushIn(frame);
  const wake = 0.34 * (1 - progress(frame, L.notif, 5, ease.out));
  // La pantalla de bloqueo se despeja en 3 f mientras el chat entra con vista (6 f).
  const lockOut = progress(frame, L.chatOpen, 3, ease.out);
  const chatP = progress(frame, L.chatOpen, 6, ease.out);
  // El móvil se apaga mientras las burbujas salen: el último frame es solo el módulo.
  const phoneO = 1 - 0.72 * progress(frame, L.detach, 7, ease.out) - 0.28 * progress(frame, L.detach + 7, 7, ease.in);

  // HUD
  const labelOut = progress(frame, L.toCorner, 6, ease.in);
  const chipIn = progress(frame, CHIP_AT, 6, ease.out);
  const unreadIn = progress(frame, L.chatOpen, 6, ease.out);
  const hudOut = progress(frame, L.hudOut, HUD_OUT, ease.in);
  const unreadKeys: RollKey[] = UNREAD.map((v, i) => ({at: L.bubbles[i], value: String(v)}));
  const twoDigits = unreadKeys.find((k) => k.value.length > 1)?.at ?? 0;
  const unreadGrow = progress(frame, twoDigits, 6, ease.overlay);

  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 90% at 62% 46%, ${color.darkSurface} 0%, ${color.darkBg} 72%)`}}>
      {/* La viñeta se centra en el módulo: el corte a «dobles-reservas» no salta. */}
      <AbsoluteFill style={{background: NEXT_BG, opacity: progress(frame, L.detach, 14, ease.inOut)}} />
      {/* Cámara: el móvil */}
      <AbsoluteFill
        style={{
          transformOrigin: `${PHONE_C.x}px ${PHONE_C.y}px`,
          transform: `translateX(${vib}px) scale(${s})`,
          opacity: phoneO,
        }}
      >
        <NightPhone>
          {lockOut < 1 ? (
            <AbsoluteFill style={{opacity: 1 - lockOut}}>
              <LockScreen>
                <Notification frame={frame} />
              </LockScreen>
              <AbsoluteFill style={{background: "#000", opacity: wake}} />
            </AbsoluteFill>
          ) : null}
          {chatP > 0 ? (
            <AbsoluteFill style={{opacity: chatP, transform: `translateY(${(1 - chatP) * 4}px)`}}>
              <ChatScreen frame={frame} />
            </AbsoluteFill>
          ) : null}
        </NightPhone>
      </AbsoluteFill>

      {/* Las dos burbujas se despegan y empiezan a ser módulos */}
      {frame >= L.detach ? (
        <>
          <FlyingBubble frame={frame} who="pedro" />
          <FlyingBubble frame={frame} who="javi" />
        </>
      ) : null}

      {/* HUD fija */}
      <div
        style={{
          position: "absolute",
          left: CLOCK.x + 14,
          top: 468,
          ...monoStyle(500),
          fontSize: 24,
          letterSpacing: "0.14em",
          color: color.ink400,
          opacity: 1 - labelOut,
          transform: `translateY(${-labelOut * 4}px)`,
          whiteSpace: "nowrap",
        }}
      >
        LUNES · VALENCIA PÁDEL CLUB
      </div>
      {chipIn > 0 ? (
        <AbsoluteFill style={{opacity: chipIn}}>
          <DayClock frame={frame} day={dayKeys} time={timeKeys} mood="alert" surface="dark" />
        </AbsoluteFill>
      ) : null}
      <BigClock frame={frame} />

      <div style={{position: "absolute", left: 96, top: 560}}>
        <WordsReveal text="Mensajes" frame={frame} start={L.title} step={3} exitAt={L.hudOut} exitDuration={HUD_OUT} style={{fontSize: 104, fontWeight: 760, lineHeight: 1.04, color: color.darkText}} />
        <WordsReveal text="a deshora." frame={frame} start={L.title + 3} step={3} exitAt={L.hudOut} exitDuration={HUD_OUT} style={{fontSize: 104, fontWeight: 760, lineHeight: 1.04, color: color.darkText}} />
        <div
          style={{
            marginTop: 40,
            ...monoStyle(500),
            fontSize: 40,
            letterSpacing: "0.06em",
            color: color.painRed,
            opacity: unreadIn * (1 - hudOut),
            transform: `translateY(${(1 - unreadIn) * 4 - hudOut * 4}px)`,
            whiteSpace: "pre",
          }}
        >
          {/* Alineada a x96; al pasar de 9 a 16 la celda crece y «SIN LEER» se desliza. */}
          <span style={{display: "inline-block", width: `${(1 + unreadGrow) * 0.66}em`}}>
            <DigitRoll frame={frame} keys={unreadKeys.slice(1)} initial="3" alignRight={false} />
          </span>
          {" SIN LEER"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
