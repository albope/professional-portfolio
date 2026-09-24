import React from "react";
import {CalendarPlus, Home, Swords, Trophy, User, type LucideIcon} from "lucide-react";
import {color, radius, shadow, textStyle} from "../brand/tokens";

export const PHONE_W = 390;
export const PHONE_H = 844;

/**
 * Teléfono genérico (sin marca de fabricante). El contenido se maqueta a
 * 390×844 px CSS; `scale` escala todo el dispositivo.
 */
export const PhoneFrame: React.FC<{
  children?: React.ReactNode;
  scale?: number;
  style?: React.CSSProperties;
  screenBg?: string;
  statusBarTone?: "dark" | "light";
  shadowed?: boolean;
}> = ({children, scale = 1, style, screenBg = color.background, statusBarTone = "dark", shadowed = true}) => {
  const bezel = 13;
  return (
    <div
      style={{
        width: PHONE_W + bezel * 2,
        height: PHONE_H + bezel * 2,
        padding: bezel,
        borderRadius: 64,
        background: "linear-gradient(145deg, #2A2724 0%, #14120F 60%, #24211D 100%)",
        boxShadow: shadowed ? `${shadow.device}, inset 0 0 0 1.5px #3C382F` : "inset 0 0 0 1.5px #3C382F",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 52,
          overflow: "hidden",
          position: "relative",
          background: screenBg,
        }}
      >
        <StatusBar tone={statusBarTone} />
        <div style={{position: "absolute", inset: 0, top: 0}}>{children}</div>
        {/* Isla */}
        <div
          style={{
            position: "absolute",
            top: 11,
            left: "50%",
            width: 118,
            height: 34,
            marginLeft: -59,
            borderRadius: 20,
            background: "#0B0A09",
            zIndex: 20,
          }}
        />
        {/* Indicador de inicio */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            width: 134,
            height: 5,
            marginLeft: -67,
            borderRadius: 3,
            background: statusBarTone === "dark" ? color.ink900 : color.darkText,
            opacity: 0.85,
            zIndex: 20,
          }}
        />
      </div>
    </div>
  );
};

export const STATUS_BAR_H = 54;

const StatusBar: React.FC<{tone: "dark" | "light"}> = ({tone}) => {
  const fg = tone === "dark" ? color.ink900 : color.darkText;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: STATUS_BAR_H,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 34px 0 40px",
        zIndex: 19,
        color: fg,
        ...textStyle(700),
        fontSize: 16,
      }}
    >
      <span>9:41</span>
      <span style={{display: "flex", gap: 6, alignItems: "center"}}>
        <svg width="18" height="12" viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 5} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill={fg} />
          ))}
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path d="M8 11.5 L5.6 9 A3.4 3.4 0 0 1 10.4 9 Z" fill={fg} />
          <path d="M3.4 6.8 A6.6 6.6 0 0 1 12.6 6.8" stroke={fg} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M1 4.2 A10 10 0 0 1 15 4.2" stroke={fg} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={fg} fill="none" opacity="0.5" />
          <rect x="2.5" y="2.5" width="17" height="8" rx="2" fill={fg} />
          <rect x="24.5" y="4.5" width="1.8" height="4" rx="0.9" fill={fg} opacity="0.5" />
        </svg>
      </span>
    </div>
  );
};

export type PlayerTab = "inicio" | "reservar" | "partidas" | "ranking" | "perfil";

const PLAYER_TABS: {id: PlayerTab; label: string; icon: LucideIcon}[] = [
  {id: "inicio", label: "Inicio", icon: Home},
  {id: "reservar", label: "Reservar", icon: CalendarPlus},
  {id: "partidas", label: "Partidas", icon: Swords},
  {id: "ranking", label: "Ranking", icon: Trophy},
  {id: "perfil", label: "Perfil", icon: User},
];

/** Barra inferior del portal del jugador (64 px + zona segura). */
export const PlayerBottomNav: React.FC<{active?: PlayerTab; accent?: string}> = ({active = "reservar", accent = color.green600}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 88,
      paddingBottom: 22,
      background: color.surfaceRaised,
      borderTop: `1px solid ${color.border}`,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 10,
    }}
  >
    {PLAYER_TABS.map((t) => {
      const on = t.id === active;
      const Icon = t.icon;
      return (
        <div
          key={t.id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            color: on ? accent : color.ink400,
            ...textStyle(on ? 700 : 500),
            fontSize: 12,
          }}
        >
          <Icon size={23} strokeWidth={on ? 2.3 : 1.8} />
          {t.label}
        </div>
      );
    })}
  </div>
);

/** Ventana de navegador sobria para mostrar el panel. */
export const BrowserFrame: React.FC<{
  children?: React.ReactNode;
  width: number;
  height: number;
  url?: string;
  style?: React.CSSProperties;
  tone?: "light" | "dark";
}> = ({children, width, height, url = "padelclubos.com", style, tone = "light"}) => {
  const barH = 46;
  const dark = tone === "dark";
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius.surface + 2,
        overflow: "hidden",
        background: dark ? color.darkSurface : color.sand100,
        boxShadow: shadow.device,
        border: `1px solid ${dark ? color.darkBorder : color.sand300}`,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          height: barH,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 18px",
          background: dark ? color.darkRaised : color.sand100,
          borderBottom: `1px solid ${dark ? color.darkBorder : color.sand300}`,
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: dark ? "#4A443B" : color.sand400}} />
        ))}
        <div
          style={{
            margin: "0 auto",
            padding: "6px 18px",
            borderRadius: radius.pill,
            background: dark ? color.darkBg : color.surfaceRaised,
            border: `1px solid ${dark ? color.darkBorder : color.sand300}`,
            color: dark ? color.darkText : color.ink500,
            ...textStyle(500),
            fontSize: 14,
            minWidth: 280,
            textAlign: "center",
          }}
        >
          {url}
        </div>
        <div style={{width: 52}} />
      </div>
      <div style={{flex: 1, position: "relative", overflow: "hidden"}}>{children}</div>
    </div>
  );
};
