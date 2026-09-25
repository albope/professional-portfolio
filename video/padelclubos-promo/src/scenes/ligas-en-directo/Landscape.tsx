import React from "react";
import {AbsoluteFill, interpolateColors, useCurrentFrame} from "remotion";
import {Bell, CalendarPlus, ChevronRight, Globe, Home, Info, Lock, Save, Search, Sun, Swords, Trophy, User} from "lucide-react";
import {Isotipo} from "../../brand/Logo";
import {color, displayStyle, monoStyle, radius, shadow, textStyle} from "../../brand/tokens";
import {Avatar, Cursor, DigitRoll, NAV_GROUPS, WordsReveal, type CursorKey} from "../../components";
import {clamp01, ease, motion, pressScale, progress, tween, view} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T16 as T} from "./cues";
import {LIGA, RESULT, STANDINGS, rollTo, type Standing} from "./data";
import {CheckStroke, DirBlur, FocusRing, LightClock, LiveDot, PersonAvatar, UpMark, flip, liftShadow, pulseAt, settle, riseTint, velocity, type Rect} from "./ui";

// ─── Geometría 16:9 (rejilla de 8 px) ───────────────────────────────────────
// Panel del club (x96–1424) y portal del jugador en el móvil (x1472–1824).
// Bajo el titular de dos líneas a 80 px (y128–288): ≥ 24 px de aire bajo los
// descendentes; panel y móvil acaban en y1024, como el resto del acto.
const PANEL = {x: 96, y: 336, w: 1328, h: 688};
const SIDE = 184; // sidebar de 264 px a 0,7×
const TOPBAR = 56;
const CX = SIDE + 32;
const CW = PANEL.w - SIDE - 64;
const HEAD_Y = TOPBAR + 24;
const BODY_Y = HEAD_Y + 48 + 32;

/** Clasificación (coordenadas relativas al panel). */
const TABLE = {x: CX, y: BODY_Y, w: 576, head: 52, row: 72};
const TABLE_H = 4 + TABLE.head + 5 * TABLE.row;
const COLS = {pad: 24, pos: 60, pj: 64, pg: 64, pts: 72};
const PAIR_W = TABLE.w - 4 - 2 * COLS.pad - COLS.pos - COLS.pj - COLS.pg - COLS.pts;

/** Tarjeta de resultado en formato módulo marcador, a la derecha. */
const CARD = {x: CX + TABLE.w + 32, y: BODY_Y, w: CW - TABLE.w - 32, label: 44, row: 128, set: 100};
const CARD_FOOT = TABLE_H - 4 - 3 * 2 - CARD.label - 2 * CARD.row;
const PAIR_COL = CARD.w - 4 - 2 * (CARD.set + 2);
const LINE = `2px solid ${color.ink900}`;

const PHONE = {x: 1472, y: 376, w: 352, h: 648, bezel: 10};
const SCR = {w: PHONE.w - 2 * PHONE.bezel, h: PHONE.h - 2 * PHONE.bezel};
const NAV_H = 80;
// Filas de 50 px: la tabla (y232–522) deja 26 px hasta la barra de pestañas.
const PT = {x: 16, y: 232, w: SCR.w - 32, head: 36, row: 50};

/** Push del acto: entra desde +960 px en 7 f y sale a −960 px en los últimos 8 f. */
const PUSH = 960;
const pushX = (f: number, dur: number) =>
  tween(f, [0, motion.overlay], [PUSH, 0], ease.overlay) + tween(f, [dur - 8, dur], [0, -PUSH], ease.in);

// Centro del botón «Guardar resultado» en pantalla.
const SAVE = {
  x: PANEL.x + CARD.x + CARD.w / 2,
  y: PANEL.y + CARD.y + TABLE_H - 2 - CARD_FOOT / 2,
};

const CURSOR_KEYS: CursorKey[] = [
  {at: T.cursorIn, x: SAVE.x + 260, y: SAVE.y + 150},
  {at: T.save - 2, x: SAVE.x + 150, y: SAVE.y - 6},
  {at: T.save, x: SAVE.x + 150, y: SAVE.y - 6, click: true},
  {at: T.save + 5, x: SAVE.x + 150, y: SAVE.y - 6},
  {at: T.reorder - 2, x: SAVE.x + 230, y: SAVE.y + 100},
];

// ─── Panel del club ─────────────────────────────────────────────────────────

const Sidebar: React.FC = () => (
  <div style={{position: "absolute", left: 0, top: 0, width: SIDE, height: PANEL.h, background: color.ink900, overflow: "hidden"}}>
    <div
      style={{
        height: TOPBAR,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 14px",
        borderBottom: `2px solid ${color.darkBorder}`,
      }}
    >
      <Isotipo size={30} tone="dark" />
      <span style={{...displayStyle(750), fontSize: 16, color: color.darkText, whiteSpace: "nowrap"}}>PadelClub OS</span>
    </div>
    <div style={{padding: "12px 8px", display: "flex", flexDirection: "column", gap: 8}}>
      {NAV_GROUPS.map((g) => (
        <div key={g.title} style={{display: "flex", flexDirection: "column"}}>
          <div
            style={{
              ...textStyle(600),
              fontSize: 16,
              lineHeight: "26px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: color.ink400,
              padding: "0 10px",
            }}
          >
            {g.title}
          </div>
          {g.items.map((item) => {
            const on = item.id === "competiciones";
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  height: 31,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 10px",
                  borderRadius: 6,
                  background: on ? "#1F3A2C" : "transparent",
                  boxShadow: on ? `inset 3px 0 0 ${color.green400}` : "none",
                  color: on ? color.darkText : "#CFC8BA",
                  ...textStyle(on ? 700 : 500),
                  fontSize: 16,
                  whiteSpace: "nowrap",
                }}
              >
                <Icon size={18} strokeWidth={2} />
                {item.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

const Topbar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: SIDE,
      top: 0,
      width: PANEL.w - SIDE,
      height: TOPBAR,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      borderBottom: `2px solid ${color.sand300}`,
    }}
  >
    <div style={{display: "flex", alignItems: "center", gap: 8, ...textStyle(500), fontSize: 16, color: color.ink500}}>
      <Home size={17} strokeWidth={2} />
      <span>Dashboard</span>
      <ChevronRight size={16} strokeWidth={2} />
      <span style={{...textStyle(600), color: color.ink900}}>Competiciones</span>
    </div>
    <div style={{display: "flex", alignItems: "center", gap: 24, color: color.ink900}}>
      <Search size={20} strokeWidth={2} />
      <Globe size={20} strokeWidth={2} />
      <Sun size={20} strokeWidth={2} />
      <Bell size={20} strokeWidth={2} />
      <Avatar initials="LM" size={40} bg={color.green700} />
    </div>
  </div>
);

/** Cabecera de la competición: nombre de la liga y pestañas. */
const PageHead: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: CX,
      top: HEAD_Y,
      width: CW,
      height: 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <span style={{...displayStyle(800), fontSize: 36, lineHeight: 1, color: color.ink900, whiteSpace: "nowrap"}}>{LIGA}</span>
    <div style={{display: "flex", gap: 4, padding: 4, borderRadius: radius.module, background: color.sand200}}>
      {["Clasificación", "Partidos", "Calendario"].map((t, i) => (
        <span
          key={t}
          style={{
            padding: "8px 16px",
            borderRadius: radius.control + 1,
            background: i === 0 ? color.surfaceRaised : "transparent",
            boxShadow: i === 0 ? "0 1px 2px rgba(28,26,23,0.08)" : "none",
            ...textStyle(i === 0 ? 600 : 500),
            fontSize: 16,
            lineHeight: "20px",
            color: i === 0 ? color.ink900 : color.ink500,
          }}
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

// ─── Clasificación ──────────────────────────────────────────────────────────

const cell = (w: number, align: "left" | "center" | "right" = "center"): React.CSSProperties => ({
  width: w,
  flexShrink: 0,
  textAlign: align,
  display: "flex",
  justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
  alignItems: "center",
});

const Num: React.FC<{frame: number; from: number; to: number; at: number; style: React.CSSProperties}> = ({frame, from, to, at, style}) => (
  <DigitRoll frame={frame} keys={rollTo(from, to, at)} initial={String(from)} style={style} />
);

const PAIR_TONES: Record<Standing["id"], [string, string]> = {
  ns: [color.ink500, color.ink400],
  rc: [color.ink400, color.ink300],
  gf: [color.ink700, color.ink500],
  mm: [color.ink300, color.sand400],
  dr: [color.ink400, color.sand400],
};

const TableRow: React.FC<{frame: number; s: Standing}> = ({frame, s}) => {
  const slot = flip(frame, T.reorder, s.from, s.to);
  const rising = s.to < s.from;
  const tint = rising ? riseTint(frame, T.reorder) : 0;
  const moving = s.from !== s.to ? Math.sin(Math.PI * progress(frame, T.reorder, 7, ease.overlay)) : 0;
  const enter = view(frame, T.rows[s.from]);
  const gf = s.id === "gf";
  const num: React.CSSProperties = {...displayStyle(600), fontSize: 22, lineHeight: 1, color: color.ink700};
  const rowBg = interpolateColors(tint, [0, 1], [color.sand50, color.greenTint]);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: TABLE.head + slot * TABLE.row,
        width: TABLE.w - 4,
        height: TABLE.row,
        boxSizing: "border-box",
        padding: `0 ${COLS.pad}px`,
        display: "flex",
        alignItems: "center",
        background: rowBg,
        borderTop: slot < 0.5 ? "none" : `2px solid ${color.sand200}`,
        boxShadow: moving > 0.01 && rising ? `0 ${Math.round(10 * moving)}px ${Math.round(24 * moving)}px -12px rgba(28,26,23,${(0.3 * moving).toFixed(3)})` : "none",
        zIndex: rising ? 3 : s.from !== s.to ? 2 : 1,
        ...enter,
      }}
    >
      {/* Tira verde de la fila que sube */}
      <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: color.green600, opacity: tint}} />
      <div style={cell(COLS.pos, "left")} />
      <div style={{...cell(PAIR_W, "left"), gap: 12}}>
        <div style={{display: "flex"}}>
          <PersonAvatar size={32} bg={PAIR_TONES[s.id][0]} ring={rowBg} ringW={2} />
          <PersonAvatar size={32} bg={PAIR_TONES[s.id][1]} ring={rowBg} ringW={2} style={{marginLeft: -8}} />
        </div>
        <span style={{...textStyle(600), fontSize: 20, color: color.ink900, whiteSpace: "nowrap"}}>{s.name}</span>
        {gf ? <UpMark size={16} style={view(frame, T.points)} /> : null}
      </div>
      <div style={cell(COLS.pj)}>
        <Num frame={frame} from={s.before.pj} to={s.after.pj} at={gf ? T.reorder : T.reorder + 2} style={num} />
      </div>
      <div style={cell(COLS.pg)}>
        <Num frame={frame} from={s.before.pg} to={s.after.pg} at={T.reorder + 2} style={num} />
      </div>
      <div style={cell(COLS.pts, "right")}>
        <Num frame={frame} from={s.before.pts} to={s.after.pts} at={T.points} style={{...displayStyle(800), fontSize: 24, lineHeight: 1, color: color.ink900}} />
      </div>
    </div>
  );
};

const HEADERS: [string, number, "left" | "center" | "right"][] = [
  ["Pos", COLS.pos, "left"],
  ["Pareja", PAIR_W, "left"],
  ["PJ", COLS.pj, "center"],
  ["PG", COLS.pg, "center"],
  ["PTS", COLS.pts, "right"],
];

const Standings: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: "absolute",
      left: TABLE.x,
      top: TABLE.y,
      width: TABLE.w,
      height: TABLE_H,
      boxSizing: "border-box",
      border: `2px solid ${color.sand300}`,
      borderRadius: radius.surface,
      background: color.sand50,
      overflow: "hidden",
      boxShadow: shadow.card,
    }}
  >
    <div
      style={{
        height: TABLE.head,
        boxSizing: "border-box",
        padding: `0 ${COLS.pad}px`,
        display: "flex",
        alignItems: "center",
        background: color.ink900,
        ...monoStyle(500),
        fontSize: 16,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: color.darkText,
        ...view(frame, 0),
      }}
    >
      {HEADERS.map(([t, w, a]) => (
        <div key={t} style={cell(w, a)}>
          {t}
        </div>
      ))}
    </div>
    {STANDINGS.map((s) => (
      <TableRow key={s.id} frame={frame} s={s} />
    ))}
    {/* Posiciones: fijas en su franja, la pareja se mueve por debajo */}
    {[1, 2, 3, 4, 5].map((n, i) => (
      <div
        key={n}
        style={{
          position: "absolute",
          left: COLS.pad,
          top: TABLE.head + i * TABLE.row,
          width: COLS.pos,
          height: TABLE.row,
          display: "flex",
          alignItems: "center",
          ...monoStyle(600),
          fontSize: 20,
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

const Legend: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: "absolute",
      left: TABLE.x + 4,
      top: TABLE.y + TABLE_H + 24,
      display: "flex",
      alignItems: "center",
      gap: 12,
      ...monoStyle(500),
      fontSize: 18,
      color: color.ink500,
      whiteSpace: "nowrap",
      ...view(frame, T.rows[4] + 2),
    }}
  >
    <Info size={18} strokeWidth={2} color={color.ink400} />
    Victoria 2 · Derrota 1
  </div>
);

// ─── Resultado (módulo marcador) ────────────────────────────────────────────

/** Celda de set: marcador vacío con guion hasta que se escribe su juego. */
const SetCell: React.FC<{frame: number; value: string; at: number}> = ({frame, value, at}) => {
  const dash = 1 - progress(frame, at, 3, ease.out);
  return (
    <div style={{position: "relative", width: CARD.set, height: CARD.row - 2, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <span style={{position: "absolute", ...displayStyle(700), fontSize: 56, color: color.sand400, opacity: dash}}>–</span>
      <span style={{...displayStyle(800), fontSize: 72, lineHeight: 1, color: color.ink900, position: "relative"}}>
        <DigitRoll frame={frame} keys={[{at, value}]} alignRight={false} />
      </span>
    </div>
  );
};

/** Celdas de juego en orden de escritura, dentro del borde de la tarjeta (anillo con 8 px de aire). */
const FOCUS_CELLS: Rect[] = RESULT.order.map(([p, s]) => ({
  x: PAIR_COL + s * (CARD.set + 2) + 2 + 8,
  y: CARD.label + p * CARD.row + 8,
  w: CARD.set - 16,
  h: CARD.row - 2 - 16,
}));

const ResultCard: React.FC<{frame: number}> = ({frame}) => {
  // Ciclo de la tarjeta: en reposo con el panel → se eleva al editar (f15) → se asienta al guardar.
  const lift = progress(frame, T.result, motion.overlay, ease.overlay) * settle(frame, T.save + 2);
  const enter = progress(frame, 0, motion.view, ease.out);
  const typedAt = (pair: number, set: number): number => T.games[RESULT.order.findIndex(([p, s]) => p === pair && s === set)];
  const saved = progress(frame, T.save + 2, 6, ease.out);
  // «Guardar resultado» se habilita cuando se ha escrito el último juego; el foco pasa al botón.
  const enabled = progress(frame, T.games[3] + 3, 4, ease.out);
  const btnBg = interpolateColors(saved, [0, 1], [interpolateColors(enabled, [0, 1], [color.sand200, color.primary]), color.surfaceRaised]);
  const btnBorder = interpolateColors(saved, [0, 1], [interpolateColors(enabled, [0, 1], [color.sand300, color.primary]), color.green600]);
  const btnFg = interpolateColors(saved, [0, 1], [interpolateColors(enabled, [0, 1], [color.ink400, color.onPrimary]), color.green700]);
  const label: React.CSSProperties = {
    ...monoStyle(600),
    fontSize: 16,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: color.ink500,
    display: "flex",
    alignItems: "center",
  };
  const setCol: React.CSSProperties = {width: CARD.set + 2, boxSizing: "border-box", borderLeft: LINE, flexShrink: 0};
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: TABLE_H,
        boxSizing: "border-box",
        border: LINE,
        borderRadius: radius.module,
        background: color.surfaceRaised,
        overflow: "hidden",
        boxShadow: liftShadow(lift),
        display: "flex",
        flexDirection: "column",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 4 - 8 * lift}px)`,
      }}
    >
      <FocusRing frame={frame} cells={FOCUS_CELLS} at={T.games} inAt={T.result} outAt={T.games[3] + 3} line={2} r={8} />
      {/* Etiquetas */}
      <div style={{display: "flex", height: CARD.label, flexShrink: 0, borderBottom: LINE, background: color.sand50}}>
        <div style={{...label, width: PAIR_COL, boxSizing: "border-box", padding: "0 24px"}}>Pareja</div>
        {["Set 1", "Set 2"].map((t) => (
          <div key={t} style={{...label, ...setCol, justifyContent: "center", paddingLeft: "0.14em"}}>
            {t}
          </div>
        ))}
      </div>
      {RESULT.pairs.map((name, p) => (
        <div key={name} style={{display: "flex", height: CARD.row, flexShrink: 0, borderBottom: LINE}}>
          <div style={{width: PAIR_COL, boxSizing: "border-box", padding: "0 24px", display: "flex", alignItems: "center"}}>
            <span style={{...textStyle(600), fontSize: 24, lineHeight: 1.1, color: color.ink900, whiteSpace: "nowrap"}}>{name}</span>
          </div>
          {[0, 1].map((s) => {
            const at = typedAt(p, s);
            return (
              <div key={s} style={setCol}>
                <SetCell frame={frame} value={RESULT.games[p][s]} at={at} />
              </div>
            );
          })}
        </div>
      ))}
      {/* Fila de total: guardar */}
      <div style={{flex: 1, background: color.sand50, display: "flex", alignItems: "center", padding: "0 24px"}}>
        <div
          style={{
            width: "100%",
            height: 56,
            boxSizing: "border-box",
            borderRadius: radius.control + 2,
            background: btnBg,
            border: `2px solid ${btnBorder}`,
            color: btnFg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            ...textStyle(700),
            fontSize: 20,
            transform: `scale(${pressScale(frame, T.save)})`,
            boxShadow: `0 6px 16px -8px rgba(21,121,85,${(0.6 * enabled * (1 - saved)).toFixed(3)})`,
          }}
        >
          <span style={{position: "relative", width: 22, height: 22}}>
            <span style={{position: "absolute", inset: 0, opacity: 1 - saved}}>
              <Save size={22} strokeWidth={2.2} />
            </span>
            <span style={{position: "absolute", inset: -1, opacity: saved}}>
              <CheckStroke p={progress(frame, T.save + 3, 8, ease.out)} size={24} stroke={color.green600} width={2.6} />
            </span>
          </span>
          Guardar resultado
        </div>
      </div>
    </div>
  );
};

// ─── Móvil: portal del jugador ──────────────────────────────────────────────

const PORTAL_NAV = [
  {label: "Reservar", icon: CalendarPlus},
  {label: "Partidas", icon: Swords},
  {label: "Competiciones", icon: Trophy},
  {label: "Perfil", icon: User},
];

const StatusIcons: React.FC = () => (
  <span style={{display: "flex", gap: 6, alignItems: "center"}}>
    <svg width="17" height="11" viewBox="0 0 18 12">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 5} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill={color.ink900} />
      ))}
    </svg>
    <svg width="15" height="11" viewBox="0 0 16 12">
      <path d="M8 11.5 L5.6 9 A3.4 3.4 0 0 1 10.4 9 Z" fill={color.ink900} />
      <path d="M3.4 6.8 A6.6 6.6 0 0 1 12.6 6.8" stroke={color.ink900} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M1 4.2 A10 10 0 0 1 15 4.2" stroke={color.ink900} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
    <svg width="25" height="12" viewBox="0 0 27 13">
      <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={color.ink900} fill="none" opacity="0.5" />
      <rect x="2.5" y="2.5" width="14" height="8" rx="2" fill={color.ink900} />
      <rect x="24.5" y="4.5" width="1.8" height="4" rx="0.9" fill={color.ink900} opacity="0.5" />
    </svg>
  </span>
);

const PHONE_COLS = {pos: 32, pj: 36, pts: 44, pad: 14};
const PHONE_PAIR = PT.w - 4 - 2 * PHONE_COLS.pad - PHONE_COLS.pos - PHONE_COLS.pj - PHONE_COLS.pts;

const PhoneRow: React.FC<{frame: number; s: Standing}> = ({frame, s}) => {
  const at = T.reorder + T.phoneLag;
  const slot = flip(frame, at, s.from, s.to);
  const rising = s.to < s.from;
  const tint = rising ? riseTint(frame, at) : 0;
  const gf = s.id === "gf";
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: PT.head + slot * PT.row,
        width: PT.w - 4,
        height: PT.row,
        boxSizing: "border-box",
        padding: `0 ${PHONE_COLS.pad}px`,
        display: "flex",
        alignItems: "center",
        background: interpolateColors(tint, [0, 1], [color.surface, color.greenTint]),
        borderTop: slot < 0.5 ? "none" : `2px solid ${color.sand200}`,
        zIndex: rising ? 3 : 1,
        ...view(frame, T.rows[s.from] + T.phoneLag),
      }}
    >
      <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color.green600, opacity: tint}} />
      <div style={cell(PHONE_COLS.pos, "left")} />
      <div style={{...cell(PHONE_PAIR, "left"), gap: 6}}>
        <span style={{...textStyle(gf ? 700 : 600), fontSize: 16, color: color.ink900, whiteSpace: "nowrap", letterSpacing: "-0.01em"}}>{s.name}</span>
      </div>
      <div style={cell(PHONE_COLS.pj)}>
        <Num
          frame={frame}
          from={s.before.pj}
          to={s.after.pj}
          at={at + (gf ? 0 : 2)}
          style={{...displayStyle(600), fontSize: 17, lineHeight: 1, color: color.ink700}}
        />
      </div>
      <div style={cell(PHONE_COLS.pts, "right")}>
        <Num
          frame={frame}
          from={s.before.pts}
          to={s.after.pts}
          at={T.points + T.phoneLag}
          style={{...displayStyle(800), fontSize: 19, lineHeight: 1, color: color.ink900}}
        />
      </div>
    </div>
  );
};

const PortalTable: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: "absolute",
      left: PT.x,
      top: PT.y,
      width: PT.w,
      height: 4 + PT.head + 5 * PT.row,
      boxSizing: "border-box",
      border: `2px solid ${color.sand300}`,
      borderRadius: 12,
      background: color.surface,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: PT.head,
        boxSizing: "border-box",
        padding: `0 ${PHONE_COLS.pad}px`,
        display: "flex",
        alignItems: "center",
        background: color.ink900,
        ...monoStyle(500),
        fontSize: 16,
        letterSpacing: "0.08em",
        color: color.darkText,
      }}
    >
      <div style={cell(PHONE_COLS.pos, "left")}>#</div>
      <div style={cell(PHONE_PAIR, "left")}>PAREJA</div>
      <div style={cell(PHONE_COLS.pj)}>PJ</div>
      <div style={cell(PHONE_COLS.pts, "right")}>PTS</div>
    </div>
    {STANDINGS.map((s) => (
      <PhoneRow key={s.id} frame={frame} s={s} />
    ))}
    {[1, 2, 3, 4, 5].map((n, i) => (
      <div
        key={n}
        style={{
          position: "absolute",
          left: PHONE_COLS.pad,
          top: PT.head + i * PT.row,
          height: PT.row,
          display: "flex",
          alignItems: "center",
          ...monoStyle(600),
          fontSize: 17,
          color: n === 1 ? color.ink900 : color.ink500,
          zIndex: 5,
          ...view(frame, T.rows[i] + T.phoneLag),
        }}
      >
        {n}
      </div>
    ))}
  </div>
);

const Portal: React.FC<{frame: number}> = ({frame}) => (
  <>
    {/* Barra del navegador: el portal es una web */}
    <div
      style={{
        position: "absolute",
        left: 12,
        top: 48,
        width: SCR.w - 24,
        height: 36,
        borderRadius: 10,
        background: color.sand200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        color: color.ink500,
        ...textStyle(500),
        fontSize: 16,
      }}
    >
      <Lock size={14} strokeWidth={2.4} />
      <span style={{color: color.ink700}}>padelclubos.com</span>
    </div>
    <div style={{position: "absolute", left: 16, top: 96, width: SCR.w - 32, height: 42, display: "flex", alignItems: "center", gap: 10}}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: color.ink900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Isotipo size={30} tone="dark" />
      </div>
      <span style={{...displayStyle(750), fontSize: 16, color: color.ink900, whiteSpace: "nowrap"}}>Valencia Pádel Club</span>
      <div style={{marginLeft: "auto"}}>
        <Avatar initials="LG" size={42} bg={color.ink700} />
      </div>
    </div>
    <div style={{position: "absolute", left: 16, top: 156, width: SCR.w - 32}}>
      <div style={{...displayStyle(800), fontSize: 24, lineHeight: 1.1, color: color.ink900}}>Liga de Otoño</div>
      <div style={{marginTop: 8, height: 28, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <span style={{...textStyle(500), fontSize: 16, color: color.ink500}}>2.ª categoría</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            height: 28,
            padding: "0 10px 0 9px",
            borderRadius: radius.pill,
            background: interpolateColors(pulseAt(frame, T.pulses).glow, [0, 1], [color.greenTint, "#CFE5D8"]),
            ...monoStyle(600),
            fontSize: 16,
            letterSpacing: "0.04em",
            color: color.green700,
          }}
        >
          <LiveDot frame={frame} pulses={T.pulses} size={12} spread={1.1} />
          EN DIRECTO
        </span>
      </div>
    </div>
    <PortalTable frame={frame} />
    <div
      style={{
        position: "absolute",
        left: 0,
        top: SCR.h - NAV_H,
        width: SCR.w,
        height: NAV_H,
        boxSizing: "border-box",
        borderTop: `2px solid ${color.sand300}`,
        background: color.surface,
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 12px 0",
      }}
    >
      {PORTAL_NAV.map((t) => {
        const on = t.label === "Competiciones";
        const Icon = t.icon;
        return (
          <div
            key={t.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              color: on ? color.green600 : color.ink400,
              ...textStyle(on ? 700 : 500),
              fontSize: 16,
              letterSpacing: "-0.01em",
            }}
          >
            <Icon size={22} strokeWidth={on ? 2.3 : 2} />
            {t.label}
          </div>
        );
      })}
    </div>
  </>
);

const Phone: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: "absolute",
      left: PHONE.x,
      top: PHONE.y,
      width: PHONE.w,
      height: PHONE.h,
      boxSizing: "border-box",
      padding: PHONE.bezel,
      borderRadius: 54,
      background: "linear-gradient(145deg, #2A2724 0%, #14120F 60%, #24211D 100%)",
      boxShadow: `${shadow.device}, inset 0 0 0 2px #3C382F`,
    }}
  >
    <div style={{position: "relative", width: SCR.w, height: SCR.h, borderRadius: 44, overflow: "hidden", background: color.background}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SCR.w,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 26px 0 34px",
          boxSizing: "border-box",
          ...textStyle(700),
          fontSize: 16,
          color: color.ink900,
        }}
      >
        <span>18:40</span>
        <StatusIcons />
      </div>
      <Portal frame={frame} />
      <div style={{position: "absolute", top: 10, left: SCR.w / 2 - 46, width: 92, height: 26, borderRadius: 13, background: "#0B0A09"}} />
      <div style={{position: "absolute", bottom: 8, left: SCR.w / 2 - 60, width: 120, height: 5, borderRadius: 3, background: color.ink900, opacity: 0.85}} />
    </div>
  </div>
);

// ─── Composición ────────────────────────────────────────────────────────────

const Panel: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: "absolute",
      left: PANEL.x,
      top: PANEL.y,
      width: PANEL.w,
      height: PANEL.h,
      borderRadius: 16,
      overflow: "hidden",
      background: color.background,
      boxShadow: shadow.float,
    }}
  >
    <Sidebar />
    <Topbar />
    <PageHead />
    <Standings frame={frame} />
    <Legend frame={frame} />
    <ResultCard frame={frame} />
    <div style={{position: "absolute", inset: 0, borderRadius: 16, border: `2px solid ${color.sand300}`, pointerEvents: "none"}} />
  </div>
);

/** Titular en dos líneas fijas (y128 e y208), palabra a palabra con escalonado continuo. */
const HEADLINE = ["Ligas automáticas", "con clasificación en tiempo real."];

const Headline: React.FC<{frame: number; exitAt: number}> = ({frame, exitAt}) => (
  <div style={{position: "absolute", left: 96, top: 128, display: "flex", flexDirection: "column"}}>
    {HEADLINE.map((line, i) => (
      <WordsReveal
        key={line}
        text={line}
        frame={frame}
        start={T.title + i * HEADLINE[0].split(" ").length * 3}
        step={3}
        exitAt={exitAt}
        style={{fontSize: 80, fontWeight: 760, lineHeight: 1, color: color.ink900, whiteSpace: "nowrap"}}
      />
    ))}
  </div>
);

export const Landscape: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useScene();
  // Vista inversa de 8 f que termina justo en el último frame.
  const exit = Math.min(T.exit, durationInFrames - motion.exit) - 1;
  const px = (f: number) => pushX(f, durationInFrames);
  const cursorOut = progress(frame, T.reorder - 4, 6, ease.in);
  return (
    <AbsoluteFill style={{background: color.sand50}}>
      {/* Capa de contenido: push con desenfoque direccional */}
      <DirBlur id="ligas-push16" vx={velocity(px, frame)} style={{position: "absolute", inset: 0, transform: `translateX(${px(frame)}px)`}}>
        <Panel frame={frame} />
        <Phone frame={frame} />
        {frame >= T.cursorIn && cursorOut < 1 ? (
          <div style={{position: "absolute", inset: 0, opacity: clamp01(1 - cursorOut)}}>
            <Cursor frame={frame} keys={CURSOR_KEYS} appearAt={T.cursorIn} />
          </div>
        ) : null}
      </DirBlur>
      {/* HUD fija: reloj y titular */}
      <LightClock frame={frame} rollAt={T.clock} />
      <Headline frame={frame} exitAt={exit} />
    </AbsoluteFill>
  );
};
