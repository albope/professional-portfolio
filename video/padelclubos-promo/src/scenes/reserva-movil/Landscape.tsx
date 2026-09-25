import React from "react";
import {AbsoluteFill, Easing, interpolateColors, useCurrentFrame} from "remotion";
import {
  Bell,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Clock,
  Globe,
  Home,
  Lock,
  Monitor,
  Search,
  Smartphone,
  Sun,
  Swords,
  Trophy,
  User,
} from "lucide-react";
import {Isotipo} from "../../brand/Logo";
import {color, displayStyle, monoStyle, shadow, textStyle} from "../../brand/tokens";
import {Avatar, Button, NAV_GROUPS, WordsReveal} from "../../components";
import {clamp01, ease, lerp, progress, view, viewOut} from "../../lib/anim";
import {T16} from "./cues";
import {COURTS, SLOT_END, SLOTS, TARGET, bookingAt, isTarget} from "./data";
import {DirBlur, usePushOut, velocity} from "./blur";
import {ClubAvatar, ConfirmButton, DashedRect, Dotted, LightClock, Marcador, StatusIcons, TapRing, marcadorSize, press} from "./ui";

// ─── Geometría 16:9 ────────────────────────────────────────────────────────
// Panel del club (x96–1100) y portal en el móvil (centrado en x1470).
const PANEL = {x: 96, y: 336, w: 1004, h: 672};
const SIDE = 184; // sidebar de 264 px a 0,7×
const TOPBAR = 56;
const CX = PANEL.x + SIDE + 24;
const CW = PANEL.w - SIDE - 48;
const TITLE_Y = PANEL.y + TOPBAR + 24;
const TITLE_H = 48;
const GRID_Y = TITLE_Y + TITLE_H + 20;
const GRID_B = PANEL.y + PANEL.h - 24;
const COL_GAP = 12;
const COL_W = (CW - 3 * COL_GAP) / 4;
const COL_HEAD = 44;
const COL_PAD = 8;
const CELL_GAP = 8;
const CELL_W = COL_W - 2 * COL_PAD;
const CELL_H = (GRID_B - GRID_Y - COL_HEAD - COL_PAD - 3 * CELL_GAP) / 4;
const colX = (ci: number) => CX + ci * (COL_W + COL_GAP);
const cellX = (ci: number) => colX(ci) + COL_PAD;
const cellY = (si: number) => GRID_Y + COL_HEAD + si * (CELL_H + CELL_GAP);

const PHONE = {w: 352, h: 672, x: 1470 - 176, y: PANEL.y, bezel: 10};
const SCR = {x: PHONE.x + PHONE.bezel, y: PHONE.y + PHONE.bezel, w: PHONE.w - 2 * PHONE.bezel, h: PHONE.h - 2 * PHONE.bezel};
const PG = {x: 16, w: SCR.w - 32, headY: 204, rowY: 236, rowH: 76, gap: 6};
const PCOL = (PG.w - 3 * PG.gap) / 4;
const NAV_H = 80;

const MOD = {w: PG.w, v: 28, l: 16, footerH: 38, cols: [0.3, 0.32, 0.38] as [number, number, number]};
const MOD_H = marcadorSize(MOD.v, MOD.l, MOD.footerH).height;
const BTN_H = 52;
const SHEET_PAD = 28;
const SHEET_H = SHEET_PAD + MOD_H + 16 + BTN_H + 30;
const SHEET_TOP = SCR.h - SHEET_H;

// Vuelo del módulo: del centro de la hoja al centro de la celda Pista 2 · 20:30.
const FLY_FROM = {x: SCR.x + PG.x + MOD.w / 2, y: SCR.y + SHEET_TOP + SHEET_PAD + MOD_H / 2};
const FLY_TO = {x: cellX(TARGET.court) + CELL_W / 2, y: cellY(TARGET.slot) + CELL_H / 2};
const FLY_CTRL = {x: (FLY_FROM.x + FLY_TO.x) / 2, y: Math.min(FLY_FROM.y, FLY_TO.y) - 250};
const FLY_SCALE = (CELL_W - 20) / MOD.w;

// Pistas de «interruptor» en su último frame: 4 × 400×200 separadas 32 px (x112–1808, y630–830).
const COURT = {w: 400, h: 200, gap: 32, cy: 730};
const courtStart = (i: number) => ({
  x: (1920 - (4 * COURT.w + 3 * COURT.gap)) / 2 + i * (COURT.w + COURT.gap),
  y: COURT.cy - COURT.h / 2,
  w: COURT.w,
  h: COURT.h,
});
const courtEnd = (i: number) => ({x: colX(i), y: GRID_Y, w: COL_W, h: GRID_B - GRID_Y});
/** Progreso del aplanado de cada pista (escalonado de 1 f; termina en f12). */
const morphP = (frame: number, i: number) => progress(frame, T16.morph + i, 9, ease.overlay);

const range = (si: number) => `${SLOTS[si]} – ${SLOT_END[si]}`;
/**
 * Curva del vuelo: despega acelerando, cruza a velocidad casi constante y se
 * posa largo (sin overshoot). Pico de ~125 px/f sobre el arco: el módulo se
 * sigue leyendo en vuelo (con overlay o una S más cerrada pasa de 250 px/f y
 * solo queda una estela).
 */
const FLY_EASE = Easing.bezier(0.3, 0, 0.5, 1);
const bez = (t: number, a: number, c: number, b: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
/** Estado del vuelo en un frame (admite fracciones): centro, escala y elevación. */
const flightAt = (frame: number) => {
  const t = clamp01((frame - T16.fly) / (T16.land - T16.fly));
  const u = FLY_EASE(t);
  // Se despega: crece un 5 % hacia la cámara en el arco y vuelve al posarse.
  const lift = Math.sin(Math.PI * t);
  return {
    x: bez(u, FLY_FROM.x, FLY_CTRL.x, FLY_TO.x),
    y: bez(u, FLY_FROM.y, FLY_CTRL.y, FLY_TO.y),
    s: lerp(1, FLY_SCALE, u) * (1 + 0.05 * lift),
    lift,
  };
};

// ─── Panel del club ────────────────────────────────────────────────────────

const PanelSidebar: React.FC = () => (
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
    <div style={{padding: "10px 8px", display: "flex", flexDirection: "column", gap: 6}}>
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
            const on = item.id === "reservas";
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  height: 30,
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

const PanelTopbar: React.FC = () => (
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
      padding: "0 24px",
      borderBottom: `2px solid ${color.sand300}`,
    }}
  >
    <div style={{display: "flex", alignItems: "center", gap: 8, ...textStyle(500), fontSize: 16, color: color.ink500}}>
      <Home size={17} strokeWidth={2} />
      <span>Dashboard</span>
      <ChevronRight size={16} strokeWidth={2} />
      <span style={{...textStyle(600), color: color.ink900}}>Reservas</span>
    </div>
    <div style={{display: "flex", alignItems: "center", gap: 22, color: color.ink900}}>
      <Search size={19} strokeWidth={2} />
      <Globe size={19} strokeWidth={2} />
      <Sun size={19} strokeWidth={2} />
      <Bell size={19} strokeWidth={2} />
      <Avatar initials="LM" size={42} bg={color.green700} />
    </div>
  </div>
);

const PanelTitle: React.FC<{frame: number}> = ({frame}) => (
  <div
    style={{
      position: "absolute",
      left: SIDE + 24,
      top: TOPBAR + 24,
      width: CW,
      height: TITLE_H,
      display: "flex",
      alignItems: "center",
      gap: 20,
      ...view(frame, T16.panel + 3),
    }}
  >
    <span style={{...displayStyle(800), fontSize: 34, lineHeight: 1, color: color.ink900}}>Reservas</span>
    <div
      style={{
        height: 40,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 10px",
        borderRadius: 8,
        border: `2px solid ${color.sand300}`,
        background: color.surface,
        color: color.ink500,
      }}
    >
      <ChevronLeft size={18} strokeWidth={2.2} />
      <span style={{...textStyle(600), fontSize: 16, color: color.ink900}}>Jueves</span>
      <ChevronRight size={18} strokeWidth={2.2} />
    </div>
    <div style={{marginLeft: "auto", ...view(frame, T16.panel + 5)}}>
      <Button icon={CirclePlus} style={{padding: "10px 18px", fontSize: 16}}>
        Nueva Reserva
      </Button>
    </div>
  </div>
);

const Tag: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span
    style={{
      alignSelf: "flex-start",
      ...monoStyle(600),
      fontSize: 16,
      lineHeight: "20px",
      letterSpacing: "0.1em",
      padding: "2px 8px",
      borderRadius: 6,
      background: color.sand50,
      color: color.green700,
    }}
  >
    {children}
  </span>
);

/** Celda de la rejilla del panel (libre, clase, reservada o la nueva de Laura). */
const PanelCell: React.FC<{frame: number; ci: number; si: number}> = ({frame, ci, si}) => {
  const b = bookingAt(ci, si);
  const tgt = isTarget(ci, si);
  const appear = progress(frame, 8 + ci + si, 6, ease.out);
  const base: React.CSSProperties = {
    position: "absolute",
    left: cellX(ci),
    top: cellY(si),
    width: CELL_W,
    height: CELL_H,
    borderRadius: 8,
    opacity: appear,
    transform: `translateY(${(1 - appear) * 4}px)`,
  };
  const body: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 8,
    padding: "0 12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
  };
  if (b) {
    const reserved = b.kind === "reserved";
    const fg = reserved ? color.sand50 : color.green700;
    return (
      <div style={{...base, background: reserved ? color.green600 : "rgba(111,191,156,0.25)"}}>
        <div style={body}>
          <div style={{display: "flex", alignItems: "center", gap: 6, ...textStyle(700), fontSize: 16, color: fg, whiteSpace: "nowrap"}}>
            {reserved ? <Check size={16} strokeWidth={2.8} /> : null}
            <span>
              <Dotted text={b.label} gap={5} />
            </span>
          </div>
          <div style={{...monoStyle(500), fontSize: 16, color: fg, opacity: 0.82}}>{range(si)}</div>
        </div>
      </div>
    );
  }
  // Libre (y, para Pista 2 · 20:30, la reserva que llega del móvil)
  const hl = tgt ? progress(frame, T16.land - 6, 6, ease.out) : 0;
  const fill = tgt ? progress(frame, T16.land, 6, ease.out) : 0;
  const glow = tgt ? progress(frame, T16.land, 20, ease.out) : 0;
  return (
    <div style={base}>
      <DashedRect w={CELL_W} h={CELL_H} r={8} opacity={1 - hl} />
      {hl > 0 ? <div style={{position: "absolute", inset: 0, borderRadius: 8, border: `2px solid ${color.ink900}`, opacity: hl}} /> : null}
      <div style={{...body, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 8, color: color.ink400}}>
        <Clock size={16} strokeWidth={2} />
        <span style={{...monoStyle(500), fontSize: 16, color: color.ink500}}>{SLOTS[si]}</span>
        <CirclePlus size={18} strokeWidth={2} style={{marginLeft: "auto"}} />
      </div>
      {fill > 0 ? (
        <>
          <div
            style={{
              ...body,
              background: color.green600,
              clipPath: `inset(0 ${(1 - fill) * 100}% 0 0 round 8px)`,
              gap: 3,
            }}
          >
            <div style={{display: "flex", flexDirection: "column", gap: 3, ...view(frame, T16.land + 2)}}>
              <Tag>NUEVA</Tag>
              <div style={{display: "flex", alignItems: "center", gap: 6, ...textStyle(700), fontSize: 16, color: color.sand50, whiteSpace: "nowrap"}}>
                <Check size={16} strokeWidth={2.8} />
                Laura Gómez
              </div>
              <div style={{...monoStyle(500), fontSize: 16, color: color.sand50, opacity: 0.82}}>{range(si)}</div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: 12,
              border: `2px solid ${color.green400}`,
              opacity: 0.9 * (1 - glow),
            }}
          />
        </>
      ) : null}
    </div>
  );
};

const Panel: React.FC<{frame: number}> = ({frame}) => (
  <>
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
        ...view(frame, T16.panel),
      }}
    >
      <PanelSidebar />
      <PanelTopbar />
      <PanelTitle frame={frame} />
      <div style={{position: "absolute", inset: 0, borderRadius: 16, border: `2px solid ${color.sand300}`, pointerEvents: "none"}} />
    </div>
    {/* Columnas (Pista 1–4): toman el relevo de las pistas aplanadas */}
    {COURTS.map((name, ci) => {
      const landed = morphP(frame, ci) >= 0.999;
      const head = progress(frame, 7 + ci, 6, ease.out);
      return (
        <div
          key={name}
          style={{
            position: "absolute",
            left: colX(ci),
            top: GRID_Y,
            width: COL_W,
            height: GRID_B - GRID_Y,
            boxSizing: "border-box",
            borderRadius: 12,
            border: `2px solid ${color.sand300}`,
            background: color.surface,
            opacity: landed ? 1 : 0,
          }}
        >
          <div
            style={{
              height: COL_HEAD - 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...displayStyle(700),
              fontSize: 17,
              color: color.ink900,
              opacity: head,
              transform: `translateY(${(1 - head) * 4}px)`,
            }}
          >
            {name}
          </div>
        </div>
      );
    })}
    {COURTS.map((_, ci) => SLOTS.map((__, si) => <PanelCell key={`${ci}-${si}`} frame={frame} ci={ci} si={si} />))}
  </>
);

/** Las cuatro pistas de «interruptor» se aplanan y encajan como columnas. */
const CourtMorph: React.FC<{frame: number}> = ({frame}) => {
  if (frame > T16.morph + 14) return null;
  const inner = 1 - progress(frame, T16.morph, 6, ease.out);
  return (
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      {COURTS.map((_, i) => {
        const p = morphP(frame, i);
        if (p >= 0.999) return null;
        const a = courtStart(i);
        const b = courtEnd(i);
        const r = {x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p)};
        const sw = lerp(3, 2, p);
        const stroke = interpolateColors(p, [0.35, 1], [color.ink900, color.sand300]);
        const svc = (6.95 / 20) * r.w;
        const mx = r.x + r.w / 2;
        const my = r.y + r.h / 2;
        return (
          <g key={i}>
            <rect
              x={r.x + sw / 2}
              y={r.y + sw / 2}
              width={r.w - sw}
              height={r.h - sw}
              rx={lerp(0, 11, p)}
              fill={color.surface}
              fillOpacity={clamp01((p - 0.4) / 0.6)}
              stroke={stroke}
              strokeWidth={sw}
            />
            {/* Mismo trazo que «interruptor»: líneas de 3 px a tope y red de 4 px */}
            <g opacity={inner} stroke={color.ink900} strokeLinecap="butt">
              <line x1={mx} y1={r.y - r.h * 0.04} x2={mx} y2={r.y + r.h * 1.04} strokeWidth={4} strokeLinecap="square" />
              <line x1={mx - svc} y1={r.y} x2={mx - svc} y2={r.y + r.h} strokeWidth={3} />
              <line x1={mx + svc} y1={r.y} x2={mx + svc} y2={r.y + r.h} strokeWidth={3} />
              <line x1={mx - svc} y1={my} x2={mx + svc} y2={my} strokeWidth={3} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Portal del jugador (móvil) ────────────────────────────────────────────

const PortalCell: React.FC<{frame: number; ci: number; si: number}> = ({frame, ci, si}) => {
  const b = bookingAt(ci, si);
  const tgt = isTarget(ci, si);
  const pr = tgt ? press(frame, T16.tap) : 1;
  const sel = tgt ? progress(frame, T16.tap + 2, 6, ease.out) : 0;
  const style: React.CSSProperties = {
    position: "absolute",
    left: PG.x + ci * (PCOL + PG.gap),
    top: PG.rowY + si * (PG.rowH + PG.gap),
    width: PCOL,
    height: PG.rowH,
    borderRadius: 8,
    transform: `scale(${pr})`,
  };
  if (b) return <div style={{...style, background: color.sand300}} />;
  return (
    <div style={style}>
      <DashedRect w={PCOL} h={PG.rowH} r={8} dash="5 4" opacity={1 - sel} />
      {sel > 0 ? (
        <div
          style={{position: "absolute", inset: 0, borderRadius: 8, border: `2px solid ${color.ink900}`, background: color.surfaceRaised, opacity: sel}}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span style={{...monoStyle(sel > 0.5 ? 600 : 500), fontSize: 16, color: sel > 0.5 ? color.ink900 : color.ink400}}>{SLOTS[si]}</span>
        {tgt ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              ...textStyle(600),
              fontSize: 16,
              color: color.ink700,
              height: 20 * sel,
              opacity: sel,
              overflow: "hidden",
            }}
          >
            <span style={{width: 7, height: 7, borderRadius: 4, background: color.green400}} />
            Libre
          </span>
        ) : null}
      </div>
    </div>
  );
};

const NAV = [
  {label: "Reservar", icon: CalendarPlus},
  {label: "Partidas", icon: Swords},
  {label: "Competiciones", icon: Trophy},
  {label: "Perfil", icon: User},
];

const Portal: React.FC<{frame: number}> = ({frame}) => (
  <>
    {/* Barra del navegador: es una web, no hay nada que descargar */}
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
    <div style={{position: "absolute", left: 16, top: 96, width: SCR.w - 32, height: 40, display: "flex", alignItems: "center", gap: 10}}>
      <ClubAvatar size={40} r={10} />
      <span style={{...displayStyle(750), fontSize: 16, color: color.ink900, whiteSpace: "nowrap"}}>Valencia Pádel Club</span>
      <div style={{marginLeft: "auto"}}>
        <Avatar initials="LG" size={42} bg={color.ink700} />
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 16,
        top: 148,
        width: SCR.w - 32,
        height: 44,
        boxSizing: "border-box",
        borderRadius: 10,
        border: `2px solid ${color.sand300}`,
        background: color.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        color: color.ink500,
      }}
    >
      <ChevronLeft size={20} strokeWidth={2.2} />
      <span style={{...displayStyle(750), fontSize: 18, color: color.ink900}}>Jueves</span>
      <ChevronRight size={20} strokeWidth={2.2} />
    </div>
    {COURTS.map((name, ci) => (
      <div
        key={name}
        style={{
          position: "absolute",
          left: PG.x + ci * (PCOL + PG.gap),
          top: PG.headY,
          width: PCOL,
          textAlign: "center",
          ...textStyle(600),
          fontSize: 16,
          lineHeight: "22px",
          color: color.ink700,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
    ))}
    {COURTS.map((_, ci) => SLOTS.map((__, si) => <PortalCell key={`${ci}-${si}`} frame={frame} ci={ci} si={si} />))}
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
      {NAV.map((t, i) => {
        const on = i === 0;
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

const Sheet: React.FC<{frame: number}> = ({frame}) => {
  const sp = progress(frame, T16.sheet, 7, ease.overlay);
  if (sp <= 0) return null;
  const strip = progress(frame, T16.confirm + 4, 8, ease.out);
  return (
    <>
      <div style={{position: "absolute", inset: 0, background: color.ink900, opacity: 0.4 * sp}} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: SHEET_TOP,
          width: SCR.w,
          height: SHEET_H + 40,
          borderRadius: "24px 24px 0 0",
          background: color.surface,
          boxShadow: "0 -16px 40px -16px rgba(20,18,15,0.4)",
          transform: `translateY(${(1 - sp) * (SHEET_H + 24)}px)`,
        }}
      >
        <div style={{position: "absolute", left: SCR.w / 2 - 18, top: 10, width: 36, height: 5, borderRadius: 3, background: color.sand400}} />
        <div style={{position: "absolute", left: PG.x, top: SHEET_PAD}}>
          <ModuleCard frame={frame} strip={strip} />
        </div>
        <div style={{position: "absolute", left: PG.x, top: SHEET_PAD + MOD_H + 16}}>
          <ConfirmButton frame={frame} at={T16.confirm} width={MOD.w} height={BTN_H} fontSize={17} r={8} />
        </div>
        <TapRing frame={frame} at={T16.confirm} x={PG.x + MOD.w / 2} y={SHEET_PAD + MOD_H + 16 + BTN_H / 2} size={64} />
      </div>
    </>
  );
};

const ModuleCard: React.FC<{frame: number; strip: number}> = ({frame, strip}) => (
  <Marcador
    frame={frame}
    start={T16.sheet + 1}
    cellStagger={1}
    width={MOD.w}
    valueSize={MOD.v}
    labelSize={MOD.l}
    cols={MOD.cols}
    strip={strip}
    stripW={4}
    footerH={MOD.footerH}
    footer={
      <span style={{...textStyle(600), fontSize: 16, color: color.ink700}}>
        <Dotted text="90 min · 4 jugadores" />
      </span>
    }
  />
);

const Phone: React.FC<{frame: number}> = ({frame}) => {
  // Sube cuando las pistas ya han dejado libre su hueco (f5–f12).
  const rise = progress(frame, T16.phone, 7, ease.overlay);
  const op = progress(frame, T16.phone, 4, ease.out);
  const tapX = PG.x + TARGET.court * (PCOL + PG.gap) + PCOL / 2;
  const tapY = PG.rowY + TARGET.slot * (PG.rowH + PG.gap) + PG.rowH / 2;
  return (
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
        opacity: op,
        transform: `translateY(${(1 - rise) * 140}px)`,
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
          <span>8:15</span>
          <StatusIcons fg={color.ink900} scale={0.9} />
        </div>
        <Portal frame={frame} />
        <TapRing frame={frame} at={T16.tap} x={tapX} y={tapY} size={64} />
        <Sheet frame={frame} />
        <div style={{position: "absolute", top: 10, left: SCR.w / 2 - 46, width: 92, height: 26, borderRadius: 13, background: "#0B0A09"}} />
        <div style={{position: "absolute", bottom: 8, left: SCR.w / 2 - 60, width: 120, height: 5, borderRadius: 3, background: color.ink900, opacity: 0.85}} />
      </div>
    </div>
  );
};

/** Copia del módulo confirmado que vuela del móvil al panel en arco. */
const FlyingModule: React.FC<{frame: number}> = ({frame}) => {
  if (frame < T16.fly || frame > T16.land + 6) return null;
  const {x, y, s, lift} = flightAt(frame);
  const out = progress(frame, T16.land, 3, ease.out);
  // Estela en px de pantalla: el filtro va en la caja escalada y la escala, en el hijo.
  // Obturador corto (~70°): el módulo se reconoce en vuelo sin saltos de 30 fps.
  const vx = velocity((f) => flightAt(f).x, frame);
  const vy = velocity((f) => flightAt(f).y, frame);
  return (
    <DirBlur
      id="reserva-vuelo"
      vx={vx}
      vy={vy}
      k={0.06}
      style={{
        position: "absolute",
        left: x - (MOD.w * s) / 2,
        top: y - (MOD_H * s) / 2,
        width: MOD.w * s,
        height: MOD_H * s,
        opacity: 1 - out,
        zIndex: 40,
      }}
    >
      <div
        style={{
          width: MOD.w,
          height: MOD_H,
          transform: `scale(${s})`,
          transformOrigin: "0 0",
          borderRadius: 10,
          boxShadow: `0 ${Math.round(24 * lift)}px ${Math.round(48 * lift)}px -16px rgba(20,18,15,${(0.4 * lift).toFixed(3)})`,
        }}
      >
        <ModuleCard frame={frame} strip={1} />
      </div>
    </DirBlur>
  );
};

const FaceLabel: React.FC<{frame: number; cx: number; icon: typeof Monitor; children: React.ReactNode}> = ({frame, cx, icon: Icon, children}) => (
  <div
    style={{
      position: "absolute",
      left: cx - 400,
      width: 800,
      top: 300,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      ...monoStyle(500),
      fontSize: 20,
      lineHeight: "24px",
      letterSpacing: "0.08em",
      color: color.ink500,
      whiteSpace: "nowrap",
      ...view(frame, T16.labels),
    }}
  >
    <Icon size={20} strokeWidth={2} />
    {children}
  </div>
);

const Content: React.FC = () => {
  const frame = useCurrentFrame();
  const push = usePushOut();
  return (
    <DirBlur
      id="reserva-push16"
      vx={velocity(push.x, frame)}
      pad={10}
      style={{position: "absolute", inset: 0, background: color.sand50, transform: `translateX(${push.x(frame)}px)`}}
    >
      <FaceLabel frame={frame} cx={PANEL.x + PANEL.w / 2} icon={Monitor}>
        PANEL DEL CLUB
      </FaceLabel>
      <FaceLabel frame={frame} cx={PHONE.x + PHONE.w / 2} icon={Smartphone}>
        PORTAL DEL JUGADOR · SIN DESCARGAR NADA
      </FaceLabel>
      <Panel frame={frame} />
      <CourtMorph frame={frame} />
      <Phone frame={frame} />
      <FlyingModule frame={frame} />
    </DirBlur>
  );
};

const SUB = ["Sin llamadas,", "sin errores,", "sin dramas."];

export const Landscape: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: color.sand50}}>
      {/* Capa de contenido: desenfoque direccional solo mientras se mueve (vuelo y push) */}
      <Content />
      {/* HUD fija: reloj, titular y subtítulo (no se mueven con el contenido) */}
      <LightClock frame={frame} rollAt={T16.clockRoll} />
      <WordsReveal
        text="Reservas 24/7 online."
        frame={frame}
        start={T16.title}
        step={3}
        exitAt={T16.exit}
        style={{position: "absolute", left: 96, top: 128, fontSize: 80, fontWeight: 760, lineHeight: 1, color: color.ink900}}
      />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 218,
          display: "flex",
          gap: "0.28em",
          ...textStyle(500),
          fontSize: 40,
          lineHeight: 1.2,
          color: color.ink700,
          ...viewOut(frame, T16.exit),
        }}
      >
        {SUB.map((g, i) => (
          <span key={g} style={{display: "inline-block", ...view(frame, T16.sub[i])}}>
            {g}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
