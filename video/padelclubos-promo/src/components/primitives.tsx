import React from "react";
import type {LucideIcon} from "lucide-react";
import {color, displayStyle, monoStyle, radius, shadow, textStyle} from "../brand/tokens";

/** Superficie base del producto: tarjeta arena clara con borde y radio 14. */
export const Card: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  tone?: "light" | "dark" | "raised";
  padding?: number;
}> = ({children, style, tone = "light", padding = 24}) => {
  const bg = tone === "dark" ? color.darkSurface : tone === "raised" ? color.surfaceRaised : color.surface;
  const border = tone === "dark" ? color.darkBorder : color.border;
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: radius.surface,
        boxShadow: tone === "dark" ? "none" : shadow.card,
        padding,
        color: tone === "dark" ? color.darkText : color.foreground,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Cuadro de icono con verde tinte, como en los KPI del panel. */
export const IconTile: React.FC<{icon: LucideIcon; size?: number; tone?: "green" | "warning" | "info" | "error" | "ink"}> = ({
  icon: Icon,
  size = 48,
  tone = "green",
}) => {
  const map = {
    green: {bg: color.greenTint, fg: color.green600},
    warning: {bg: color.warningBg, fg: color.warning},
    info: {bg: color.infoBg, fg: color.info},
    error: {bg: color.errorBg, fg: color.error},
    ink: {bg: color.sand200, fg: color.ink900},
  }[tone];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius.module,
        background: map.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={size * 0.5} color={map.fg} strokeWidth={2} />
    </div>
  );
};

/** Tarjeta KPI del dashboard: etiqueta, cifra grande tabular e icono. */
export const KpiCard: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: LucideIcon;
  iconTone?: "green" | "warning" | "info" | "error" | "ink";
  style?: React.CSSProperties;
  valueSize?: number;
}> = ({label, value, sub, icon, iconTone = "green", style, valueSize = 44}) => (
  <Card style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, ...style}}>
    <div style={{display: "flex", flexDirection: "column", gap: 6, minWidth: 0}}>
      <div style={{...textStyle(500), fontSize: 18, color: color.ink500}}>{label}</div>
      <div style={{...displayStyle(750), fontSize: valueSize, lineHeight: 1.05, color: color.foreground}}>{value}</div>
      {sub ? <div style={{...textStyle(400), fontSize: 15, color: color.ink400}}>{sub}</div> : null}
    </div>
    <IconTile icon={icon} tone={iconTone} size={52} />
  </Card>
);

/** Botón del sistema. `pressed` (0→1) simula la pulsación (token press 120 ms). */
export const Button: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ink" | "ghost";
  icon?: LucideIcon;
  pressed?: number;
  size?: "md" | "lg";
  style?: React.CSSProperties;
}> = ({children, variant = "primary", icon: Icon, pressed = 0, size = "md", style}) => {
  const v = {
    primary: {bg: pressed > 0.5 ? color.primaryHover : color.primary, fg: color.onPrimary, border: "transparent"},
    secondary: {bg: color.surface, fg: color.foreground, border: color.border},
    ink: {bg: color.ink900, fg: color.sand50, border: "transparent"},
    ghost: {bg: "transparent", fg: color.foreground, border: "transparent"},
  }[variant];
  const pad = size === "lg" ? "18px 30px" : "12px 20px";
  const fs = size === "lg" ? 22 : 17;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: pad,
        borderRadius: radius.control + 2,
        background: v.bg,
        color: v.fg,
        border: `1.5px solid ${v.border}`,
        ...textStyle(700),
        fontSize: fs,
        whiteSpace: "nowrap",
        transform: `scale(${1 - pressed * 0.04})`,
        boxShadow: variant === "primary" ? "0 6px 16px -8px rgba(21,121,85,0.6)" : "none",
        ...style,
      }}
    >
      {Icon ? <Icon size={fs + 2} strokeWidth={2.2} /> : null}
      {children}
    </div>
  );
};

export type BadgeTone = "success" | "warning" | "info" | "error" | "neutral" | "green" | "ink";

/** Chip de estado. Los semánticos nunca toman el color del club. */
export const Badge: React.FC<{children: React.ReactNode; tone?: BadgeTone; style?: React.CSSProperties; solid?: boolean}> = ({
  children,
  tone = "neutral",
  style,
  solid = false,
}) => {
  const map = {
    success: {bg: color.successBg, fg: color.success, border: color.successBorder},
    warning: {bg: color.warningBg, fg: color.warning, border: color.warningBorder},
    info: {bg: color.infoBg, fg: color.info, border: color.infoBorder},
    error: {bg: color.errorBg, fg: color.error, border: color.errorBorder},
    neutral: {bg: color.sand100, fg: color.ink500, border: color.sand300},
    green: {bg: color.green600, fg: color.sand50, border: color.green600},
    ink: {bg: color.ink900, fg: color.sand50, border: color.ink900},
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: radius.control,
        background: solid ? map.fg : map.bg,
        color: solid ? color.sand50 : map.fg,
        border: `1px solid ${solid ? map.fg : map.border}`,
        ...textStyle(700),
        fontSize: 14,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Etiqueta mono en mayúsculas (numeración 01–08, metadatos, eyebrows). */
export const MonoLabel: React.FC<{children: React.ReactNode; style?: React.CSSProperties; tone?: "ink" | "green" | "muted" | "light"}> = ({
  children,
  style,
  tone = "muted",
}) => {
  const fg = {ink: color.ink900, green: color.green600, muted: color.ink400, light: color.darkText}[tone];
  return (
    <span style={{...monoStyle(500), fontSize: 16, letterSpacing: "0.12em", textTransform: "uppercase", color: fg, ...style}}>
      {children}
    </span>
  );
};

/** Avatar de iniciales. */
export const Avatar: React.FC<{initials: string; size?: number; bg?: string; fg?: string; ring?: string}> = ({
  initials,
  size = 40,
  bg = color.green700,
  fg = color.sand50,
  ring,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...textStyle(700),
      fontSize: size * 0.38,
      boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

/** Aviso flotante (toast) del producto. */
export const Toast: React.FC<{title: string; body?: string; style?: React.CSSProperties; icon?: LucideIcon}> = ({
  title,
  body,
  style,
  icon: Icon,
}) => (
  <div
    style={{
      background: color.surfaceRaised,
      border: `1px solid ${color.border}`,
      borderRadius: radius.surface,
      boxShadow: shadow.float,
      padding: "18px 22px",
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      minWidth: 340,
      ...style,
    }}
  >
    {Icon ? (
      <div style={{marginTop: 2}}>
        <Icon size={22} color={color.success} strokeWidth={2.4} />
      </div>
    ) : null}
    <div style={{display: "flex", flexDirection: "column", gap: 4}}>
      <div style={{...textStyle(700), fontSize: 18, color: color.foreground}}>{title}</div>
      {body ? <div style={{...textStyle(400), fontSize: 16, color: color.ink500}}>{body}</div> : null}
    </div>
  </div>
);
