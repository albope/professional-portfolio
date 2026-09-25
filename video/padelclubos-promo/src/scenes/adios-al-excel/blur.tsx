import React from "react";

/**
 * Desenfoque de movimiento direccional: gaussiano en el eje del movimiento,
 * proporcional a la velocidad (obturador de 180°). Nítido en reposo y sin el
 * tinte rosado que deja CameraMotionBlur del kit al sumar capas sobre la arena.
 */
export const DirBlur: React.FC<{id: string; vx: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  id,
  vx,
  style,
  children,
}) => {
  const sx = Math.abs(vx) * 0.15;
  const on = sx > 0.3;
  return (
    <>
      {on ? (
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${sx.toFixed(2)} 0`} />
          </filter>
        </svg>
      ) : null}
      <div style={{...style, filter: on ? `url(#${id})` : undefined}}>{children}</div>
    </>
  );
};

/** Velocidad (px/frame) de una posición que depende del frame: diferencia central. */
export const velocity = (f: (frame: number) => number, frame: number) => (f(frame + 1) - f(frame - 1)) / 2;
