import React from "react";
import {interpolateColors} from "remotion";
import {color, monoStyle} from "../../brand/tokens";
import {DigitRoll} from "../../components";
import {ease, lerp, progress} from "../../lib/anim";

// Geometría del chip del reloj del día (la misma que DayClock, superficie oscura).
const CHIP = {left: 96, top: 56, padX: 22, padY: 12, border: 2, size: 28, gap: 14, ls: 0.04, lh: 1.15};
// JetBrains Mono: avance de 600/1000 em por carácter.
const ADV = 0.6;
// Tracking del reloj gigante del gancho (más compacto que el del chip).
const BIG_LS = -0.04;

/**
 * 16:9: el chip «MAR · 22:00» de la esquina, en un solo gesto (overlay),
 * rueda hasta 23:47, crece y viaja hasta el reloj gigante (JetBrains Mono 500,
 * tabular, sin parpadeo): el inverso exacto de «mensajes-a-deshora».
 */
export const Clock: React.FC<{
  frame: number;
  left: number;
  top: number;
  size: number;
  /** Frame en que el chip empieza a crecer. */
  growAt: number;
  growDur?: number;
}> = ({frame, left, top, size, growAt, growDur = 12}) => {
  const k = size / CHIP.size;
  const p = progress(frame, growAt, growDur, ease.overlay);
  // Posición del recuadro de la hora (interlineado 1) dentro del chip.
  const dayW = 3 * (ADV + CHIP.ls) * CHIP.size;
  const dotW = (ADV + CHIP.ls) * CHIP.size;
  const x0 = CHIP.left + CHIP.border + CHIP.padX + dayW + CHIP.gap + dotW + CHIP.gap;
  const y0 = CHIP.top + CHIP.border + CHIP.padY + ((CHIP.lh - 1) / 2) * CHIP.size;
  // Escala interpolada en logaritmo: el crecimiento se percibe uniforme.
  const s = Math.pow(1 / k, 1 - p);
  const x = lerp(x0, left, p);
  const y = lerp(y0, top, p);
  // El resto del chip (píldora y día) se disuelve al empezar a crecer.
  const chipO = 1 - progress(frame, growAt, 3, ease.out);
  const ls = lerp(CHIP.ls, BIG_LS, p);
  // La hora llega en verde (no en el rojo de la noche anterior) y se funde a arena.
  const timeColor = interpolateColors(progress(frame, growAt, growDur, ease.inOut), [0, 1], [color.gainGreen, color.darkText]);
  // Medidas del chip expresadas en unidades del reloj grande.
  const em = (px: number) => (px / CHIP.size) * size;
  const timeW = 5 * (ADV + CHIP.ls) * CHIP.size;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px) scale(${s})`,
        transformOrigin: "0 0",
        ...monoStyle(500),
        fontSize: size,
        lineHeight: 1,
      }}
    >
      {chipO > 0 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: -em(CHIP.border + CHIP.padX + dayW + CHIP.gap + dotW + CHIP.gap),
              top: -em(CHIP.border + CHIP.padY) - ((CHIP.lh - 1) / 2) * size,
              width: em(CHIP.border * 2 + CHIP.padX * 2 + dayW + CHIP.gap + dotW + CHIP.gap + timeW),
              height: em(CHIP.border * 2 + CHIP.padY * 2) + CHIP.lh * size,
              borderRadius: 999 * k,
              background: color.darkRaised,
              border: `${em(CHIP.border)}px solid ${color.darkBorder}`,
              boxSizing: "border-box",
              opacity: chipO,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -em(dayW + CHIP.gap + dotW + CHIP.gap),
              top: 0,
              letterSpacing: `${CHIP.ls}em`,
              color: color.ink300,
              whiteSpace: "pre",
              opacity: chipO,
            }}
          >
            MAR
          </div>
          <div
            style={{
              position: "absolute",
              left: -em(dotW + CHIP.gap),
              top: 0,
              letterSpacing: `${CHIP.ls}em`,
              color: color.ink300,
              opacity: 0.6 * chipO,
            }}
          >
            ·
          </div>
        </>
      ) : null}
      <div style={{position: "relative", letterSpacing: `${ls}em`, color: timeColor, whiteSpace: "pre"}}>
        <DigitRoll frame={frame} keys={[{at: growAt, value: "23:47"}]} initial="22:00" />
      </div>
    </div>
  );
};

/** 9:16: el 23:47 del gancho, en la misma caja (y290–500, centrado), ya en f0 y sin parpadeo. */
export const ClockPortrait: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 290,
      height: 210,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...monoStyle(500),
      fontSize: 240,
      lineHeight: 1,
      letterSpacing: `${BIG_LS}em`,
      color: color.darkText,
      whiteSpace: "pre",
    }}
  >
    23:47
  </div>
);
