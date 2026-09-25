import React from "react";
import {Camera, Flashlight, Lock} from "lucide-react";
import {color, displayStyle, textStyle} from "../../brand/tokens";
import {DigitRoll, type RollKey} from "../../components";

// Móvil vectorial neutro del gerente (16:9): x1280–1640, 780 px de alto,
// radio 64, bisel #282420 y pantalla #1E1B17. El PhoneFrame del kit lleva la
// hora 9:41 fija y un bisel pensado para UI clara; este es el de la noche.
export const PHONE = {x: 1280, y: 150, w: 360, h: 780, bezel: 12, r: 64} as const;
export const SCREEN = {w: PHONE.w - PHONE.bezel * 2, h: PHONE.h - PHONE.bezel * 2, r: PHONE.r - PHONE.bezel} as const;
export const STATUS_H = 44;

const Island: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 10,
      left: "50%",
      width: 96,
      height: 28,
      marginLeft: -48,
      borderRadius: 14,
      background: "#0B0A09",
      zIndex: 30,
    }}
  />
);

const StatusIcons: React.FC<{fg: string}> = ({fg}) => (
  <span style={{display: "flex", gap: 6, alignItems: "center"}}>
    <svg width="18" height="12" viewBox="0 0 18 12">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 5} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill={fg} opacity={i === 3 ? 0.35 : 1} />
      ))}
    </svg>
    <svg width="16" height="12" viewBox="0 0 16 12">
      <path d="M8 11.5 L5.6 9 A3.4 3.4 0 0 1 10.4 9 Z" fill={fg} />
      <path d="M3.4 6.8 A6.6 6.6 0 0 1 12.6 6.8" stroke={fg} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M1 4.2 A10 10 0 0 1 15 4.2" stroke={fg} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
    {/* Batería baja: es casi medianoche. */}
    <svg width="27" height="13" viewBox="0 0 27 13">
      <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={fg} fill="none" opacity="0.5" />
      <rect x="2.5" y="2.5" width="5" height="8" rx="1.5" fill={fg} />
      <rect x="24.5" y="4.5" width="1.8" height="4" rx="0.9" fill={fg} opacity="0.5" />
    </svg>
  </span>
);

/** Barra de estado con la hora rodando igual que el chip del reloj. */
export const StatusBar: React.FC<{frame: number; time?: RollKey[]}> = ({frame, time}) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: STATUS_H,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "4px 26px 0 34px",
      color: color.darkText,
      ...textStyle(600),
      fontSize: 16,
      zIndex: 25,
    }}
  >
    <span style={{minWidth: 48, fontVariantNumeric: "tabular-nums"}}>{time ? <DigitRoll frame={frame} keys={time} alignRight={false} /> : null}</span>
    <StatusIcons fg={color.darkText} />
  </div>
);

/** Carcasa: bisel, botones laterales, isla e indicador de inicio. */
export const NightPhone: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: "absolute", left: PHONE.x, top: PHONE.y, width: PHONE.w, height: PHONE.h, ...style}}>
    {/* Botones laterales */}
    {[
      {side: "left", top: 150, h: 36},
      {side: "left", top: 206, h: 64},
      {side: "left", top: 282, h: 64},
      {side: "right", top: 236, h: 96},
    ].map((b, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: b.top,
          [b.side]: -4,
          width: 6,
          height: b.h,
          borderRadius: 3,
          background: color.darkRaised,
          boxShadow: `inset 0 0 0 2px ${color.darkBorder}`,
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: PHONE.r,
        background: color.darkRaised,
        boxShadow: `inset 0 0 0 2px ${color.darkBorder}, 0 60px 120px -40px rgba(0,0,0,0.75), 0 20px 40px -20px rgba(0,0,0,0.6)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: PHONE.bezel,
        top: PHONE.bezel,
        width: SCREEN.w,
        height: SCREEN.h,
        borderRadius: SCREEN.r,
        overflow: "hidden",
        background: color.darkSurface,
      }}
    >
      {children}
      <Island />
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          width: 120,
          height: 5,
          marginLeft: -60,
          borderRadius: 3,
          background: color.darkText,
          opacity: 0.7,
          zIndex: 30,
        }}
      />
    </div>
  </div>
);

/** Pantalla de bloqueo: candado, hora y los accesos directos de abajo. */
export const LockScreen: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(120% 70% at 50% 0%, ${color.darkRaised} 0%, ${color.darkSurface} 60%)`,
    }}
  >
    <StatusBar frame={0} />
    <div style={{position: "absolute", top: 56, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
      <Lock size={20} color={color.sand400} strokeWidth={2.2} />
    </div>
    <div
      style={{
        position: "absolute",
        top: 84,
        left: 0,
        right: 0,
        textAlign: "center",
        ...displayStyle(500),
        fontSize: 72,
        lineHeight: 1,
        letterSpacing: "-0.01em",
        color: color.sand400,
        opacity: 0.8,
      }}
    >
      23:47
    </div>
    {children}
    {[
      {icon: Flashlight, left: 36},
      {icon: Camera, left: SCREEN.w - 36 - 52},
    ].map(({icon: Icon, left}, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left,
          bottom: 40,
          width: 52,
          height: 52,
          borderRadius: 26,
          background: color.darkRaised,
          boxShadow: `inset 0 0 0 2px ${color.darkBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={22} color={color.sand400} strokeWidth={2} />
      </div>
    ))}
  </div>
);
