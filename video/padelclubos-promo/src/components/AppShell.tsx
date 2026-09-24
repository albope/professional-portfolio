import React from "react";
import {
  Bell,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Database,
  Globe,
  GraduationCap,
  Home,
  LayoutDashboard,
  LayoutGrid,
  Newspaper,
  Repeat,
  Search,
  Settings,
  ShieldOff,
  Sun,
  Trophy,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import {Isotipo} from "../brand/Logo";
import {color, displayStyle, monoStyle, textStyle} from "../brand/tokens";
import {Avatar} from "./primitives";

export type NavId =
  | "academia"
  | "dashboard"
  | "recepcion"
  | "reservas"
  | "clases-fijas"
  | "bloqueos"
  | "pistas"
  | "competiciones"
  | "socios"
  | "noticias"
  | "facturacion"
  | "funcionalidades"
  | "equipo"
  | "migracion";

interface NavItem {
  id: NavId;
  label: string;
  icon: LucideIcon;
}

/** Navegación real del panel (grupos Operación / Comunidad / Contenido / Negocio / Sistema). */
export const NAV_GROUPS: {title: string; items: NavItem[]}[] = [
  {
    title: "Operación",
    items: [
      {id: "dashboard", label: "Dashboard", icon: LayoutDashboard},
      {id: "recepcion", label: "Recepción", icon: ClipboardCheck},
      {id: "reservas", label: "Reservas", icon: Calendar},
      {id: "academia", label: "Academia", icon: GraduationCap},
      {id: "clases-fijas", label: "Clases Fijas", icon: Repeat},
      {id: "bloqueos", label: "Bloqueos", icon: ShieldOff},
      {id: "pistas", label: "Pistas", icon: LayoutGrid},
    ],
  },
  {
    title: "Comunidad",
    items: [
      {id: "socios", label: "Socios", icon: Users},
      {id: "competiciones", label: "Competiciones", icon: Trophy},
    ],
  },
  {title: "Contenido", items: [{id: "noticias", label: "Noticias", icon: Newspaper}]},
  {title: "Negocio", items: [{id: "facturacion", label: "Facturación", icon: CreditCard}]},
  {
    title: "Sistema",
    items: [
      {id: "funcionalidades", label: "Funcionalidades", icon: Settings},
      {id: "equipo", label: "Equipo", icon: UserCog},
      {id: "migracion", label: "Migración", icon: Database},
    ],
  },
];

export const NAV_LABEL: Record<NavId, string> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label])),
) as Record<NavId, string>;

export const SIDEBAR_WIDTH = 264;
export const HEADER_HEIGHT = 64;

export const Sidebar: React.FC<{active?: NavId; height: number}> = ({active, height}) => (
  <div
    style={{
      width: SIDEBAR_WIDTH,
      height,
      background: color.ink900,
      color: color.darkText,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: HEADER_HEIGHT,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 18px",
        borderBottom: `1px solid ${color.darkBorder}`,
      }}
    >
      <Isotipo size={34} tone="dark" />
      <span style={{...displayStyle(750), fontSize: 21, color: color.darkText}}>PadelClub OS</span>
    </div>
    <div style={{padding: "14px 12px", display: "flex", flexDirection: "column", gap: 4}}>
      {NAV_GROUPS.map((g) => (
        <div key={g.title} style={{display: "flex", flexDirection: "column", gap: 2, marginBottom: 10}}>
          <div
            style={{
              ...textStyle(600),
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: color.ink400,
              padding: "6px 12px",
            }}
          >
            {g.title}
          </div>
          {g.items.map((item) => {
            const on = item.id === active;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 12px",
                  borderRadius: 8,
                  background: on ? "#1F3A2C" : "transparent",
                  boxShadow: on ? `inset 3px 0 0 ${color.green400}` : "none",
                  color: on ? color.darkText : "#CFC8BA",
                  ...textStyle(on ? 700 : 500),
                  fontSize: 16,
                }}
              >
                <Icon size={19} strokeWidth={1.8} />
                {item.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

export const Header: React.FC<{crumb: string; width: number}> = ({crumb, width}) => (
  <div
    style={{
      height: HEADER_HEIGHT,
      width,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      borderBottom: `1px solid ${color.border}`,
      background: color.background,
      flexShrink: 0,
    }}
  >
    <div style={{display: "flex", alignItems: "center", gap: 10, ...textStyle(500), fontSize: 16, color: color.ink500}}>
      <Home size={17} />
      <span>Dashboard</span>
      <ChevronRight size={16} />
      <span style={{color: color.foreground, ...textStyle(600)}}>{crumb}</span>
    </div>
    <div style={{display: "flex", alignItems: "center", gap: 26, color: color.foreground}}>
      <Search size={21} />
      <Globe size={21} />
      <Sun size={21} />
      <Bell size={21} />
      <Avatar initials="LM" size={38} bg={color.green700} />
    </div>
  </div>
);

/**
 * Panel de administración completo (sidebar tinta + cabecera + contenido).
 * Se diseña a tamaño CSS real (por defecto 1440×900) y la escena lo escala.
 */
export const AppShell: React.FC<{
  active?: NavId;
  crumb?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  contentStyle?: React.CSSProperties;
}> = ({active = "dashboard", crumb, width = 1440, height = 900, children, contentStyle}) => (
  <div
    style={{
      width,
      height,
      display: "flex",
      background: color.background,
      overflow: "hidden",
      fontFamily: textStyle().fontFamily,
    }}
  >
    <Sidebar active={active} height={height} />
    <div style={{display: "flex", flexDirection: "column", flex: 1, minWidth: 0}}>
      <Header crumb={crumb ?? NAV_LABEL[active]} width={width - SIDEBAR_WIDTH} />
      <div style={{flex: 1, padding: "32px 36px", overflow: "hidden", position: "relative", ...contentStyle}}>{children}</div>
    </div>
  </div>
);

/** Título de página del panel (H1 Archivo + subtítulo). */
export const PageTitle: React.FC<{title: string; subtitle?: string; right?: React.ReactNode; style?: React.CSSProperties}> = ({
  title,
  subtitle,
  right,
  style,
}) => (
  <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, ...style}}>
    <div style={{display: "flex", flexDirection: "column", gap: 6}}>
      <div style={{...displayStyle(800), fontSize: 40, lineHeight: 1.05, color: color.foreground}}>{title}</div>
      {subtitle ? <div style={{...textStyle(400), fontSize: 19, color: color.ink500}}>{subtitle}</div> : null}
    </div>
    {right}
  </div>
);

export const MonoMeta: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{...monoStyle(500), fontSize: 14, color: color.ink400}}>{children}</span>
);
