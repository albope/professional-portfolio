import React from "react";
import {AbsoluteFill, useVideoConfig} from "remotion";
import {color} from "../brand/tokens";

/** Fondo arena con luz cenital muy suave (sin grano: la marca no lo usa). */
export const PaperBg: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 90% at 50% 0%, ${color.surface} 0%, ${color.sand50} 55%, ${color.sand100} 100%)`,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Fondo tinta con viñeta cálida. */
export const InkBg: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(110% 85% at 50% 35%, #25221E 0%, ${color.ink900} 55%, ${color.darkBg} 100%)`,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Fondo verde pista (escena de marca). */
export const GreenBg: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(110% 90% at 50% 30%, #13704D 0%, ${color.green700} 55%, #0A4A33 100%)`,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Formato actual: horizontal 16:9 o vertical 9:16. */
export const useFormat = () => {
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  return {portrait, width, height, format: portrait ? ("9x16" as const) : ("16x9" as const)};
};

/**
 * Zona segura vertical: nada importante en los 250 px superiores ni en los
 * 400 px inferiores (interfaz de Reels/TikTok/Shorts).
 */
export const SAFE_9x16 = {top: 250, bottom: 400, side: 90} as const;
export const SAFE_16x9 = {top: 80, bottom: 80, side: 120} as const;
