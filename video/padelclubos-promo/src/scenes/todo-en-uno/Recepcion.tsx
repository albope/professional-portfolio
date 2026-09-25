import React from "react";
import {
  Banknote,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Download,
  Euro,
  Globe,
  Home,
  RefreshCw,
  Search,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react";
import {Isotipo} from "../../brand/Logo";
import {color, displayStyle, monoStyle, radius, textStyle} from "../../brand/tokens";
import {Avatar, NAV_GROUPS} from "../../components";
import {fmt} from "../../lib/anim";
import {DATA} from "./data";

/**
 * Vista «Recepción» tal como la deja «control-de-cobros» en su último frame:
 * la reserva de Carlos Navarro ya cobrada (4 × 7,00 €) y los KPI en
 * 560,00 € / 84,00 €. Misma geometría que aquel panel (1728×688, rejilla de
 * 8 px) para que el corte sea invisible; aquí solo se pinta el estado final.
 */
export const RECEPCION = {w: 1728, h: 688, radius: 16} as const;

const SIDE = 224;
const TOPBAR = 56;
const CX = SIDE + 32;
const CW = RECEPCION.w - SIDE - 64;
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

const JUGADORES: {nombre: string; iniciales: string; metodo: "tarjeta" | "efectivo"}[] = [
  {nombre: "Carlos Navarro", iniciales: "CN", metodo: "tarjeta"},
  {nombre: "Sergio Vidal", iniciales: "SV", metodo: "efectivo"},
  {nombre: "Ana Torres", iniciales: "AT", metodo: "tarjeta"},
  {nombre: "Raúl Prats", iniciales: "RP", metodo: "tarjeta"},
];

const Sidebar: React.FC = () => (
  <div style={{position: "absolute", left: 0, top: 0, width: SIDE, height: RECEPCION.h, background: color.ink900, overflow: "hidden"}}>
    <div
      style={{
        height: TOPBAR,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 16px",
        borderBottom: `2px solid ${color.darkBorder}`,
      }}
    >
      <Isotipo size={32} tone="dark" />
      <span style={{...displayStyle(750), fontSize: 18, color: color.darkText, whiteSpace: "nowrap"}}>PadelClub OS</span>
    </div>
    <div style={{padding: "12px 10px", display: "flex", flexDirection: "column", gap: 6}}>
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
              padding: "0 12px",
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
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0 12px",
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
      width: RECEPCION.w - SIDE,
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
      <Avatar initials="LM" size={34} bg={color.green700} />
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

const Kpi: React.FC<{i: number; label: string; icon: LucideIcon; sub?: string; value: string}> = ({i, label, icon: Icon, sub, value}) => (
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
    }}
  >
    <div style={{...textStyle(500), fontSize: 18, lineHeight: "24px", color: color.ink500}}>{label}</div>
    <div style={{marginTop: 8, ...displayStyle(700), fontSize: 38, lineHeight: "44px", color: color.ink900, whiteSpace: "nowrap"}}>{value}</div>
    {sub ? <div style={{marginTop: 6, ...textStyle(400), fontSize: 16, lineHeight: "20px", color: color.ink400}}>{sub}</div> : null}
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

const Method: React.FC<{metodo: "tarjeta" | "efectivo"}> = ({metodo}) => (
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
      opacity: 0.55,
    }}
  >
    {(
      [
        {id: "tarjeta", label: "Tarjeta", icon: CreditCard},
        {id: "efectivo", label: "Efectivo", icon: Banknote},
      ] as const
    ).map((o) => {
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

const Paid: React.FC<{size?: number; fontSize?: number; style?: React.CSSProperties}> = ({size = 18, fontSize = 16, style}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      boxSizing: "border-box",
      borderRadius: radius.control,
      ...textStyle(700),
      fontSize,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <Check size={size} strokeWidth={2.6} />
    Cobrado
  </div>
);

const ReservationCard: React.FC = () => (
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
      background: color.surface,
      overflow: "hidden",
    }}
  >
    <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: color.green600}} />
    <div style={{position: "absolute", left: 36, top: 34, width: CARD.sum - 52}}>
      <div style={{...displayStyle(800), fontSize: 56, lineHeight: "56px", color: color.ink900}}>20:30</div>
      <div style={{marginTop: 10, display: "flex"}}>
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
      <div style={{marginTop: 20, display: "flex"}}>
        <Paid
          size={20}
          fontSize={18}
          style={{
            height: 40,
            padding: "0 16px 0 12px",
            background: color.successBg,
            border: `2px solid ${color.successBorder}`,
            color: color.success,
          }}
        />
      </div>
    </div>
    <div style={{position: "absolute", left: 2 + CARD.sum, top: 0, bottom: 0, width: 2, background: color.sand200}} />
    {JUGADORES.map((j, i) => (
      <div
        key={j.nombre}
        style={{
          position: "absolute",
          left: ROWS_X,
          top: 2 + i * CARD.row,
          width: ROWS_W,
          height: CARD.row,
          borderTop: i === 0 ? "none" : `2px solid ${color.sand200}`,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{position: "absolute", left: 28}}>
          <Avatar initials={j.iniciales} size={40} bg={color.greenTint} fg={color.green700} />
        </div>
        <div style={{position: "absolute", left: 84, ...textStyle(600), fontSize: 20, color: color.ink900, whiteSpace: "nowrap"}}>{j.nombre}</div>
        <div style={{position: "absolute", right: ROWS_W - AMOUNT_R, ...displayStyle(700), fontSize: 24, color: color.ink900, whiteSpace: "nowrap"}}>
          {fmt.eur2(7)}
        </div>
        <div style={{position: "absolute", left: SEG_X}}>
          <Method metodo={j.metodo} />
        </div>
        <div style={{position: "absolute", left: BTN_X}}>
          <Paid
            style={{
              width: BTN.w,
              height: BTN.h,
              border: `2px solid ${color.green600}`,
              background: color.surface,
              color: color.green600,
            }}
          />
        </div>
      </div>
    ))}
  </div>
);

export const Recepcion: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: RECEPCION.w,
      height: RECEPCION.h,
      overflow: "hidden",
      background: color.background,
    }}
  >
    <Sidebar />
    <Topbar />
    <div style={{position: "absolute", left: CX, top: 80, width: CW}}>
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
    <Kpi i={0} label="Reservas activas" icon={CalendarDays} value={DATA.reservasHoy} />
    <Kpi i={1} label="Participantes" icon={Users} value={DATA.participantes} />
    <Kpi i={2} label="Cobrado hoy" icon={Euro} sub="Según momento del cobro" value={DATA.cobrado} />
    <Kpi i={3} label="Pendiente" icon={Banknote} value={DATA.pendiente} />
    <Filters />
    <ReservationCard />
  </div>
);
