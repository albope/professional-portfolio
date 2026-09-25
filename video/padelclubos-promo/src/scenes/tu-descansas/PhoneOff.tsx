import React from "react";
import {color} from "../../brand/tokens";

// Misma carcasa que el móvil de «mensajes-a-deshora» (x1280–1640, 780 px de
// alto, radio 64, bisel #282420, pantalla #1E1B17), copiada aquí porque una
// escena no puede depender de otra.
const PHONE = {x: 1280, y: 150, w: 360, h: 780, bezel: 12, r: 64} as const;
const BUTTONS = [
  {side: "left", top: 150, h: 36},
  {side: "left", top: 206, h: 64},
  {side: "left", top: 282, h: 64},
  {side: "right", top: 236, h: 96},
] as const;

/**
 * El móvil del gerente, boca arriba y con la pantalla APAGADA: ni
 * notificación, ni luz, ni vibración. Solo un reflejo tenue en el cristal.
 */
export const PhoneOff: React.FC = () => (
  <div style={{position: "absolute", left: PHONE.x, top: PHONE.y, width: PHONE.w, height: PHONE.h}}>
    {BUTTONS.map((b, i) => (
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
        inset: PHONE.bezel,
        borderRadius: PHONE.r - PHONE.bezel,
        background: color.darkSurface,
        overflow: "hidden",
      }}
    >
      {/* Reflejo tenue en diagonal: cristal apagado, sin luz propia */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(122deg, rgba(241,237,228,0.05) 0%, rgba(241,237,228,0.024) 34%, rgba(241,237,228,0) 34.4%, rgba(241,237,228,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(120% 60% at 30% 0%, rgba(241,237,228,0.03) 0%, rgba(241,237,228,0) 60%)",
        }}
      />
      {/* Isla */}
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
        }}
      />
    </div>
  </div>
);
