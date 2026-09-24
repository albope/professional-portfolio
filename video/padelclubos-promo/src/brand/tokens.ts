// Identidad «Marcador» de Padel Club OS.
// Fuente: padel-club-os/design_handoff_fase2/tokens.padelclubos.json

import type {CSSProperties} from "react";

export const color = {
  // Tinta
  ink900: "#1C1A17",
  ink700: "#3C382F",
  ink500: "#5C564C",
  ink400: "#8A8377",
  ink300: "#A39C8E",
  // Arena
  sand50: "#F6F3ED",
  sand100: "#EFECE6",
  sand200: "#E7E2D8",
  sand300: "#DDD7CC",
  sand400: "#C9C2B4",
  // Verde pista
  green300: "#6FBF9C",
  green400: "#2FA075",
  green600: "#157A54",
  green700: "#0E5C3F",
  green900: "#0B241A",
  // Superficies oscuras
  darkBg: "#14120F",
  darkSurface: "#1E1B17",
  darkRaised: "#282420",
  darkBorder: "#37322A",
  darkText: "#F1EDE4",
  // Semánticos claros (hsl del sistema convertidos a hex)
  background: "#F6F3EF",
  foreground: "#1C1A17",
  surface: "#FAF8F5",
  surfaceRaised: "#FFFFFF",
  border: "#DBD6CC",
  primary: "#157955",
  onPrimary: "#F8F6F2",
  primaryHover: "#0E5D40",
  // Estados
  info: "#2E63C0",
  infoBg: "#E8EFFA",
  infoBorder: "#C6D8F2",
  success: "#3D8B37",
  successBg: "#E9F4E6",
  successBorder: "#C8E4C3",
  warning: "#C7871E",
  warningBg: "#FBF1DD",
  warningBorder: "#EFD9AC",
  error: "#B3402E",
  errorBg: "#F9E8E4",
  errorBorder: "#EFC9C0",
  // Landing: «Ahora» / «Con Padel Club OS» sobre tinta
  painRed: "#E08A7A",
  gainGreen: "#6FBF9C",
  // Estados en oscuro
  darkSuccess: "#7FC276",
  darkWarning: "#E5B05C",
  darkError: "#E08A7A",
  darkInfo: "#7FA6E8",
  // Verde tinte de los iconos de KPI
  greenTint: "#E3EEE7",
  // Bola de pádel (solo como acento gráfico, nunca como color de UI)
  ball: "#DDE85A",
  ballSeam: "#F4F7D2",
} as const;

export const dataviz = ["#157A54", "#2E63C0", "#C7871E", "#7B4B94", "#4A9DA8", "#8A8377"] as const;

export const font = {
  display: "'Archivo Variable', 'Archivo', 'Arial Narrow', Arial, sans-serif",
  text: "'Instrument Sans Variable', 'Instrument Sans', Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace",
} as const;

/** Estilo display de la marca: Archivo expandida (wdth 112). */
export const displayStyle = (weight = 800): CSSProperties => ({
  fontFamily: font.display,
  fontWeight: weight,
  fontStretch: "112%",
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "-0.01em",
});

export const monoStyle = (weight = 500): CSSProperties => ({
  fontFamily: font.mono,
  fontWeight: weight,
  fontVariantNumeric: "tabular-nums",
});

export const textStyle = (weight = 400): CSSProperties => ({
  fontFamily: font.text,
  fontWeight: weight,
});

export const radius = { control: 6, module: 10, surface: 14, pill: 999 } as const;

export const shadow = {
  card: "0 1px 2px rgba(28,26,23,0.06), 0 8px 24px -12px rgba(28,26,23,0.18)",
  float: "0 24px 60px -24px rgba(28,26,23,0.35), 0 2px 6px rgba(28,26,23,0.08)",
  device: "0 50px 120px -40px rgba(20,18,15,0.55), 0 12px 30px -12px rgba(20,18,15,0.35)",
} as const;

/** Club demo coherente en todo el vídeo. */
export const demo = {
  club: "Valencia Pádel Club",
  url: "padelclubos.com",
} as const;
