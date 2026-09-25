import React from "react";
import {color} from "../../brand/tokens";
import {cursorPosition, type CursorKey} from "../../components";

/**
 * Cursor de ratón con el recorrido del kit (cursorPosition), pero con el
 * anillo de cada clic anclado donde se hizo: el Cursor del kit lo pinta
 * pegado a la flecha, y si esta sigue moviéndose el anillo viaja con ella.
 */
export const Pointer: React.FC<{frame: number; keys: CursorKey[]; size?: number}> = ({frame, keys, size = 36}) => {
  const {x, y} = cursorPosition(frame, keys);
  const clicks = keys.filter((k) => k.click);
  let press = 0;
  for (const k of clicks) {
    const d = frame - k.at;
    if (d >= 0 && d < 8) press = Math.max(press, d < 3 ? d / 3 : 1 - (d - 3) / 5);
  }
  return (
    <>
      {clicks.map((k) => {
        const d = frame - k.at;
        if (d < 0 || d >= 18) return null;
        const r = d / 18;
        const s = 56 * (0.4 + r);
        return (
          <div
            key={k.at}
            style={{
              position: "absolute",
              left: k.x - s / 2,
              top: k.y - s / 2,
              width: s,
              height: s,
              borderRadius: "50%",
              border: `3px solid ${color.green400}`,
              opacity: 1 - r,
              pointerEvents: "none",
            }}
          />
        );
      })}
      <div style={{position: "absolute", left: x, top: y, pointerEvents: "none"}}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          style={{
            display: "block",
            // La punta de la flecha (4,5; 2,8 en el viewBox) cae en (x, y).
            transform: `translate(${(-4.5 / 24) * size}px, ${(-2.8 / 24) * size}px) scale(${1 - press * 0.15})`,
            transformOrigin: `${(4.5 / 24) * size}px ${(2.8 / 24) * size}px`,
            filter: "drop-shadow(0 4px 6px rgba(20,18,15,0.35))",
          }}
        >
          <path
            d="M4.5 2.8 L4.5 19.6 L8.9 15.6 L11.7 21.6 L14.6 20.3 L11.9 14.4 L17.9 14.4 Z"
            fill={color.ink900}
            stroke={color.sand50}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};
