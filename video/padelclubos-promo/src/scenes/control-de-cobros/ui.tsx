import React from "react";
import {interpolateColors} from "remotion";
import {
  Banknote,
  Bell,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Clock,
  CreditCard,
  Download,
  Euro,
  Globe,
  Home,
  RefreshCw,
  Search,
  ShieldCheck,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react";
import {Isotipo} from "../../brand/Logo";
import {color, displayStyle, monoStyle, radius, shadow, textStyle} from "../../brand/tokens";
import {Avatar, NAV_GROUPS, type RollKey} from "../../components";
import {ease, fmt, pressScale, progress, view} from "../../lib/anim";
import {T16} from "./cues";
import {COBRADO_INICIAL, COBRADO_KEYS, JUGADORES, PENDIENTE_INICIAL, PENDIENTE_KEYS, PRECIO, type Metodo} from "./data";

// ─── Geometría 16:9 (rejilla de 8 px) ───────────────────────────────────────
// Panel en coordenadas de pantalla; todo lo interior, relativo al panel. Mismo
// marco que «adios-al-excel» (titular de una línea: panel en y256) y la misma
// carcasa que todo el acto de producto: sidebar de 264 px a 0,7×.
const PANEL = {x: 96, y: 256, w: 1728, h: 688};
const SIDE = 184;
const TOPBAR = 56;
const CX = SIDE + 32;
const CW = PANEL.w - SIDE - 64;
const TITLE_Y = 80;
const KPI = {y: 176, h: 136, gap: 16};
const KPI_W = (CW - 3 * KPI.gap) / 4;
const FILTER = {y: 336, h: 40};
const CARD = {y: 400, h: 260, sum: 360, row: 64};
const ROWS_X = 2 + CARD.sum + 2;
const ROWS_W = CW - 2 - ROWS_X;
const BTN = {w: 136, h: 40};
const SEG = {w: 232, h: 40};
const BTN_X = ROWS_W - 24 - BTN.w;
const SEG_X = BTN_X - 16 - SEG.w;
const AMOUNT_R = SEG_X - 40;

/** Centro del botón «Cobrar» de la fila i, en coordenadas de pantalla. */
export const cobrarCenter = (i: number) => ({
  x: PANEL.x + CX + ROWS_X + BTN_X + BTN.w / 2,
  y: PANEL.y + CARD.y + 2 + i * CARD.row + CARD.row / 2,
});

/**
 * Zoom-out hacia «todo-en-uno»: la Recepción entera se convierte en su casilla
 * 04 (x1416 y360, 408×192). El pre-encogido de esta escena (1 → 0,95, justo
 * lo que deja el texto de UI de 16 px a ≥ 15 px efectivos) usa como origen el
 * punto fijo de la semejanza panel → casilla (borde derecho, y ≈ 400): así este
 * gesto y el zoom de «todo-en-uno» son un único movimiento, sin cambios de
 * dirección en ningún borde. «todo-en-uno» repite estos números (PREV).
 */
const TILE04 = {x: 1416, y: 360, w: 408, h: 192};
export const ZOOM = {
  /** Escala a la que llega el panel en el corte (f120 = f0 de «todo-en-uno»). */
  to: 0.95,
  /** Exponente del ease-in (t⁴): a f119 va a 10 px/f y «todo-en-uno» sigue acelerando. */
  power: 4,
  origin: {
    x: (TILE04.x - PANEL.x * (TILE04.w / PANEL.w)) / (1 - TILE04.w / PANEL.w),
    y: (TILE04.y - PANEL.y * (TILE04.h / PANEL.h)) / (1 - TILE04.h / PANEL.h),
  },
} as const;

// ─── Reloj del día (versión clara del acto de producto) ─────────────────────

/**
 * Píldora #E7E2D8 con texto tinta (storyboard L06). El DayClock del kit solo
 * ofrece la variante tinta, así que se replica aquí la de «reserva-movil».
 */
export const LightClock: React.FC<{frame: number; rollAt: number}> = ({frame, rollAt}) => (
  <div
    style={{
      position: "absolute",
      left: 96,
      top: 56,
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 22px",
      borderRadius: radius.pill,
      background: color.sand200,
      border: `2px solid ${color.sand300}`,
      ...monoStyle(500),
      fontSize: 28,
      lineHeight: 1.15,
      letterSpacing: "0.04em",
      color: color.ink500,
      zIndex: 50,
    }}
  >
    <span>MAR</span>
    <span style={{opacity: 0.6}}>·</span>
    <Roll frame={frame} keys={[{at: rollAt, value: "20:25"}]} initial="18:40" style={{color: color.ink900, fontWeight: 600}} />
  </div>
);

// ─── Digit-roll con celdas que se pliegan ───────────────────────────────────

/**
 * Digit-roll alineado a la derecha. A diferencia del DigitRoll del kit, las
 * cifras que desaparecen (105 → 98) pliegan su celda en vez de dejar un
 * espacio delante: el importe sigue alineado a la izquierda en la tarjeta.
 */
export const Roll: React.FC<{
  frame: number;
  keys: RollKey[];
  initial: string;
  duration?: number;
  stagger?: number;
  style?: React.CSSProperties;
  /** Color con el que entra cada cifra nueva antes de asentarse en `base`. */
  flash?: {from: string; base: string};
}> = ({frame, keys, initial, duration = 6, stagger = 2, style, flash}) => {
  let idx = -1;
  for (let i = 0; i < keys.length; i++) if (frame >= keys[i].at) idx = i;
  const cur = idx >= 0 ? keys[idx].value : initial;
  const prev = idx > 0 ? keys[idx - 1].value : initial;
  const start = idx >= 0 ? keys[idx].at : 0;
  const len = Math.max(cur.length, prev.length);
  const pad = (s: string) => [...Array<string>(len - s.length).fill(""), ...Array.from(s)];
  const a = pad(prev);
  const b = pad(cur);
  let changed = 0;
  const cell: React.CSSProperties = {display: "inline-block", whiteSpace: "pre"};
  return (
    <span style={{display: "inline-block", whiteSpace: "pre", fontVariantNumeric: "tabular-nums", ...style}}>
      {b.map((to, i) => {
        const from = a[i];
        if (from === to || idx < 0) return to ? <span key={i} style={cell}>{to}</span> : null;
        // La cifra que se pliega no ocupa turno: sale a la vez que cambia la siguiente.
        const cellStart = start + changed * stagger;
        const p = progress(frame, cellStart, to === "" ? duration + stagger : duration, ease.overlay);
        if (to !== "") changed++;
        const tint = flash && to !== "" ? interpolateColors(progress(frame, cellStart + 4, 14, ease.out), [0, 1], [flash.from, flash.base]) : undefined;
        // Celda que se pliega (la cifra sale y no entra ninguna) o que se abre.
        const maxWidth = to === "" ? `${(1 - p) * 0.72}em` : from === "" ? `${p * 0.72}em` : undefined;
        const flow = to === "" ? from : to;
        return (
          <span key={i} style={{...cell, position: "relative", overflow: "hidden", verticalAlign: "bottom", maxWidth}}>
            <span style={{...cell, color: tint, transform: `translateY(${to === "" ? -p * 100 : (1 - p) * 100}%)`, opacity: to === "" ? 1 - p : 1}}>
              {flow}
            </span>
            {to !== "" && from !== "" ? (
              <span style={{...cell, position: "absolute", left: 0, top: 0, transform: `translateY(${-p * 100}%)`, opacity: p > 0.98 ? 0 : 1}}>
                {from}
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
};

// ─── Chrome del panel ───────────────────────────────────────────────────────

/** Sidebar tinta a 0,7× (184 px, texto de 16 px), idéntica a la de «adios-al-excel» y «ligas-en-directo». */
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
            const on = item.id === "recepcion";
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
      <span style={{...textStyle(600), color: color.ink900}}>Recepción</span>
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

const IconButton: React.FC<{icon: LucideIcon}> = ({icon: Icon}) => (
  <div
    style={{
      width: 40,
      height: 40,
      boxSizing: "border-box",
      borderRadius: 8,
      border: `2px solid ${color.sand300}`,
      background: color.surface,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: color.ink700,
    }}
  >
    <Icon size={18} strokeWidth={2.2} />
  </div>
);

// La página llega entera con el push (f0 nunca muestra un panel vacío); solo
// las tarjetas KPI entran en cascada, porque son las cifras que van a rodar.
const TitleBlock: React.FC = () => (
  <div style={{position: "absolute", left: CX, top: TITLE_Y, width: CW}}>
    <div style={{display: "flex", alignItems: "center", gap: 16, height: 40}}>
      <span style={{...displayStyle(800), fontSize: 36, lineHeight: 1, color: color.ink900}}>Recepción Hoy</span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 28,
          padding: "0 12px",
          borderRadius: 6,
          background: color.green600,
          color: color.sand50,
          ...textStyle(700),
          fontSize: 16,
        }}
      >
        <span style={{width: 8, height: 8, borderRadius: 4, background: color.green300}} />
        Abierto
      </span>
      <div style={{marginLeft: "auto", display: "flex", gap: 8}}>
        <IconButton icon={CircleHelp} />
        <IconButton icon={Download} />
        <IconButton icon={RefreshCw} />
      </div>
    </div>
    <div style={{marginTop: 8, ...textStyle(400), fontSize: 18, lineHeight: "24px", color: color.ink500}}>Martes · Valencia Pádel Club</div>
  </div>
);

// ─── KPI ────────────────────────────────────────────────────────────────────

const KpiTile: React.FC<{
  frame: number;
  i: number;
  label: string;
  icon: LucideIcon;
  sub?: string;
  children: React.ReactNode;
}> = ({frame, i, label, icon: Icon, sub, children}) => (
  <div
    style={{
      position: "absolute",
      left: CX + i * (KPI_W + KPI.gap),
      top: KPI.y,
      width: KPI_W,
      height: KPI.h,
      boxSizing: "border-box",
      borderRadius: radius.surface,
      border: `2px solid ${color.sand300}`,
      background: color.surface,
      padding: "22px 24px",
      ...view(frame, T16.kpi[i]),
    }}
  >
    <div style={{...textStyle(500), fontSize: 18, lineHeight: "24px", color: color.ink500}}>{label}</div>
    <div style={{marginTop: 8, ...displayStyle(700), fontSize: 38, lineHeight: "44px", color: color.ink900, whiteSpace: "nowrap"}}>
      {children}
    </div>
    {sub ? <div style={{marginTop: 6, ...textStyle(400), fontSize: 16, lineHeight: "20px", color: color.ink500}}>{sub}</div> : null}
    <div
      style={{
        position: "absolute",
        right: 22,
        top: 22,
        width: 40,
        height: 40,
        borderRadius: radius.module,
        background: color.greenTint,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={21} color={color.green600} strokeWidth={2} />
    </div>
  </div>
);

const Kpis: React.FC<{frame: number}> = ({frame}) => (
  <>
    <KpiTile frame={frame} i={0} label="Reservas activas" icon={CalendarDays}>
      24
    </KpiTile>
    <KpiTile frame={frame} i={1} label="Participantes" icon={Users}>
      86
    </KpiTile>
    <KpiTile frame={frame} i={2} label="Cobrado hoy" icon={Euro} sub="Según momento del cobro">
      <Roll frame={frame} keys={COBRADO_KEYS} initial={fmt.eur2(COBRADO_INICIAL)} flash={{from: color.green600, base: color.ink900}} />
    </KpiTile>
    <KpiTile frame={frame} i={3} label="Pendiente" icon={Banknote}>
      <Roll frame={frame} keys={PENDIENTE_KEYS} initial={fmt.eur2(PENDIENTE_INICIAL)} />
    </KpiTile>
  </>
);

// ─── Filtros ────────────────────────────────────────────────────────────────

const FILTROS = ["Todas", "Próximas", "En pista", "Cobro pendiente", "Llegada pendiente"];

const Filters: React.FC = () => (
  <div style={{position: "absolute", left: CX, top: FILTER.y, width: CW, height: FILTER.h, display: "flex", gap: 8}}>
    <div
      style={{
        width: 400,
        height: FILTER.h,
        boxSizing: "border-box",
        borderRadius: 8,
        border: `2px solid ${color.sand300}`,
        background: color.surface,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        color: color.ink400,
      }}
    >
      <Search size={18} strokeWidth={2.2} />
    </div>
    <div style={{marginLeft: "auto", display: "flex", gap: 8}}>
      {FILTROS.map((f) => {
        const on = f === "Cobro pendiente";
        return (
          <div
            key={f}
            style={{
              height: FILTER.h,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderRadius: 8,
              border: `2px solid ${on ? color.green600 : color.sand300}`,
              background: on ? color.green600 : color.surface,
              color: on ? color.sand50 : color.ink900,
              ...textStyle(700),
              fontSize: 16,
              whiteSpace: "nowrap",
            }}
          >
            {f}
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Tarjeta de la reserva ──────────────────────────────────────────────────

const CheckMark: React.FC<{p: number; size: number; stroke: string; width?: number}> = ({p, size, stroke, width = 2.6}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path
      d="M4.5 12.5 L9.5 17.5 L19.5 6.5"
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={24}
      strokeDashoffset={24 * (1 - p)}
    />
  </svg>
);

/** Selector de método (Tarjeta / Efectivo). Tras el cobro queda bloqueado. */
const MethodToggle: React.FC<{metodo: Metodo; locked: number}> = ({metodo, locked}) => {
  const opts: {id: Metodo; label: string; icon: LucideIcon}[] = [
    {id: "tarjeta", label: "Tarjeta", icon: CreditCard},
    {id: "efectivo", label: "Efectivo", icon: Banknote},
  ];
  return (
    <div
      style={{
        width: SEG.w,
        height: SEG.h,
        boxSizing: "border-box",
        display: "flex",
        padding: 3,
        gap: 2,
        borderRadius: 8,
        border: `2px solid ${color.sand300}`,
        background: color.sand100,
        opacity: 1 - 0.45 * locked,
      }}
    >
      {opts.map((o) => {
        const on = o.id === metodo;
        const Icon = o.icon;
        return (
          <div
            key={o.id}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderRadius: 5,
              background: on ? color.surfaceRaised : "transparent",
              boxShadow: on ? "0 1px 2px rgba(28,26,23,0.12)" : "none",
              color: on ? color.ink900 : color.ink500,
              ...textStyle(on ? 600 : 500),
              fontSize: 16,
            }}
          >
            <Icon size={16} strokeWidth={2.2} />
            {o.label}
          </div>
        );
      })}
    </div>
  );
};

/** Botón «Cobrar» (primario, radio 6) que pasa a contorno con check al cobrar. */
const CobrarButton: React.FC<{frame: number; at: number; hover: number}> = ({frame, at, hover}) => {
  const s = pressScale(frame, at);
  const done = progress(frame, at + 3, 5, ease.out);
  const check = progress(frame, at + 4, 7, ease.out);
  const bg = interpolateColors(hover, [0, 1], [color.primary, color.primaryHover]);
  const label: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...textStyle(700),
    fontSize: 16,
    whiteSpace: "nowrap",
  };
  return (
    <div style={{position: "relative", width: BTN.w, height: BTN.h, transform: `scale(${s})`}}>
      <div
        style={{
          ...label,
          borderRadius: 6,
          background: bg,
          color: color.onPrimary,
          boxShadow: "0 6px 14px -8px rgba(21,121,85,0.7)",
          opacity: 1 - done,
        }}
      >
        Cobrar
      </div>
      {done > 0 ? (
        <div
          style={{
            ...label,
            boxSizing: "border-box",
            borderRadius: 6,
            border: `2px solid ${color.green600}`,
            background: color.surface,
            color: color.green600,
            opacity: done,
          }}
        >
          <CheckMark p={check} size={18} stroke={color.green600} />
          Cobrado
        </div>
      ) : null}
    </div>
  );
};

const PlayerRow: React.FC<{frame: number; i: number}> = ({frame, i}) => {
  const j = JUGADORES[i];
  const at = T16.pay[i];
  // Hover: la fila se ilumina cuando el cursor llega y se apaga al pasar a la siguiente.
  const next = i < 3 ? T16.pay[i + 1] - 4 : T16.paid - 2;
  const hover = progress(frame, at - 5, 4, ease.out) * (1 - progress(frame, next, 4, ease.out));
  const locked = progress(frame, at + 3, 6, ease.out);
  return (
    <div
      style={{
        position: "absolute",
        left: ROWS_X,
        top: 2 + i * CARD.row,
        width: ROWS_W,
        height: CARD.row,
        borderTop: i === 0 ? "none" : `2px solid ${color.sand200}`,
        boxSizing: "border-box",
        background: `rgba(231,226,216,${(0.45 * hover).toFixed(3)})`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{position: "absolute", left: 28}}>
        <Avatar initials={j.iniciales} size={40} bg={color.greenTint} fg={color.green700} />
      </div>
      <div style={{position: "absolute", left: 84, ...textStyle(600), fontSize: 20, color: color.ink900, whiteSpace: "nowrap"}}>{j.nombre}</div>
      <div
        style={{
          position: "absolute",
          right: ROWS_W - AMOUNT_R,
          ...displayStyle(700),
          fontSize: 24,
          color: color.ink900,
          whiteSpace: "nowrap",
        }}
      >
        {fmt.eur2(PRECIO)}
      </div>
      <div style={{position: "absolute", left: SEG_X}}>
        <MethodToggle metodo={j.metodo} locked={locked} />
      </div>
      <div style={{position: "absolute", left: BTN_X}}>
        <CobrarButton frame={frame} at={at} hover={hover} />
      </div>
    </div>
  );
};

/**
 * Chip de estado de la reserva. En c2.t1 «Cobro pendiente» sale (vista
 * inversa, 4 f) y entra «Cobrado» con el check dibujado y el anillo del
 * celebrate (1 → 1,15 y se desvanece): sin fundidos cruzados de textos.
 */
const StatusChip: React.FC<{frame: number}> = ({frame}) => {
  const out = progress(frame, T16.paid, 4, ease.in);
  const inn = progress(frame, T16.paid + 3, 6, ease.out);
  const check = progress(frame, T16.paid + 4, 8, ease.out);
  const ring = progress(frame, T16.paid + 3, 12, ease.out);
  const chip: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    height: 40,
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "0 16px 0 12px",
    borderRadius: radius.control,
    ...textStyle(700),
    fontSize: 18,
    whiteSpace: "nowrap",
  };
  return (
    <div style={{position: "relative", height: 40}}>
      {out < 1 ? (
        <div
          style={{
            ...chip,
            background: color.warningBg,
            border: `2px solid ${color.warningBorder}`,
            color: color.warning,
            opacity: 1 - out,
            transform: `translateY(${-out * 4}px)`,
          }}
        >
          <Clock size={18} strokeWidth={2.4} />
          Cobro pendiente
        </div>
      ) : null}
      {inn > 0 ? (
        <div
          style={{
            ...chip,
            background: color.successBg,
            border: `2px solid ${color.successBorder}`,
            color: color.success,
            opacity: inn,
            transform: `translateY(${(1 - inn) * 4}px)`,
          }}
        >
          <CheckMark p={check} size={20} stroke={color.success} width={2.8} />
          Cobrado
          {ring < 1 ? (
            <div
              style={{
                position: "absolute",
                inset: -2,
                borderRadius: radius.control + 2,
                border: `2px solid ${color.success}`,
                opacity: 0.85 * (1 - ring),
                transform: `scale(${1 + 0.15 * ring})`,
              }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const ReservationCard: React.FC<{frame: number}> = ({frame}) => {
  const strip = interpolateColors(progress(frame, T16.paid, 6, ease.out), [0, 1], [color.warning, color.green600]);
  // Celebrate (12 f): la tarjeta se tiñe de verde éxito y vuelve a arena.
  const wash = progress(frame, T16.paid, 3, ease.out) * (1 - progress(frame, T16.paid + 3, 9, ease.inOut));
  const bg = interpolateColors(wash, [0, 1], [color.surface, color.successBg]);
  return (
    <div
      style={{
        position: "absolute",
        left: CX,
        top: CARD.y,
        width: CW,
        height: CARD.h,
        boxSizing: "border-box",
        borderRadius: radius.surface,
        border: `2px solid ${color.sand300}`,
        background: bg,
        overflow: "hidden",
      }}
    >
      <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: strip}} />
      {/* Resumen: hora, pista, titular y estado */}
      <div style={{position: "absolute", left: 36, top: 34, width: CARD.sum - 52}}>
        <div style={{...displayStyle(800), fontSize: 56, lineHeight: "56px", color: color.ink900}}>20:30</div>
        <div style={{marginTop: 10, display: "flex", alignItems: "center", gap: 10}}>
          <span
            style={{
              ...monoStyle(600),
              fontSize: 16,
              lineHeight: "24px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0 8px",
              borderRadius: 6,
              background: color.sand200,
              color: color.ink700,
            }}
          >
            Pista 4
          </span>
        </div>
        <div style={{marginTop: 10, ...textStyle(700), fontSize: 20, lineHeight: "26px", color: color.ink900, whiteSpace: "nowrap"}}>
          Carlos Navarro <span style={{color: color.ink500, fontWeight: 600}}>+3</span>
        </div>
        <div style={{marginTop: 20}}>
          <StatusChip frame={frame} />
        </div>
      </div>
      <div style={{position: "absolute", left: 2 + CARD.sum, top: 0, bottom: 0, width: 2, background: color.sand200}} />
      {JUGADORES.map((_, i) => (
        <PlayerRow key={i} frame={frame} i={i} />
      ))}
    </div>
  );
};

// ─── Panel completo ─────────────────────────────────────────────────────────

export const Panel: React.FC<{frame: number}> = ({frame}) => (
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
    <TitleBlock />
    <Kpis frame={frame} />
    <Filters />
    <ReservationCard frame={frame} />
    <div style={{position: "absolute", inset: 0, borderRadius: 16, border: `2px solid ${color.sand300}`, pointerEvents: "none"}} />
  </div>
);

/** Chip «INTEGRADOS CON VERIFACTU» bajo el panel. */
export const VerifactuChip: React.FC<{style?: React.CSSProperties}> = ({style}) => (
  <div
    style={{
      position: "absolute",
      left: PANEL.x,
      top: PANEL.y + PANEL.h + 24,
      height: 48,
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "0 24px 0 18px",
      borderRadius: radius.pill,
      border: `2px solid ${color.ink900}`,
      background: color.surfaceRaised,
      ...monoStyle(600),
      fontSize: 20,
      letterSpacing: "0.12em",
      color: color.ink900,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <ShieldCheck size={22} color={color.green600} strokeWidth={2.2} />
    INTEGRADOS CON VERIFACTU
  </div>
);
