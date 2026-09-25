import React from "react";
import {ease, tween} from "../../lib/anim";
import {useScene} from "../../lib/scene";

/**
 * Desenfoque de movimiento direccional: gaussiano en el eje del movimiento,
 * proporcional a la velocidad (obturador de 180°: estela de v/2 px,
 * sigma ≈ 0,15·v). Una sola pasada, sin las copias escalonadas que deja
 * apilar muestras a 30 fps y sin el tinte rosa que la suma plus-lighter de
 * CameraMotionBlur deja sobre la arena. Nítido en reposo.
 * Ojo: el filtro trabaja en el espacio local del elemento; si el contenido
 * se escala, la escala va en un hijo para que la estela quede en px de pantalla.
 */
export const DirBlur: React.FC<{
  id: string;
  vx?: number;
  vy?: number;
  /** Sigma por px/frame: 0,15 ≈ obturador de 180°; menos, estela más corta. */
  k?: number;
  /** Margen de la región del filtro, en % de la caja (capas a pantalla completa: poco). */
  pad?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({id, vx = 0, vy = 0, k = 0.15, pad = 100, style, children}) => {
  // Tope común del acto de producto: estela legible, sin barrido en bloque.
  const sx = Math.min(18, Math.abs(vx) * k);
  const sy = Math.min(18, Math.abs(vy) * k);
  const on = sx > 0.3 || sy > 0.3;
  return (
    <>
      {on ? (
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id={id} x={`-${pad}%`} y={`-${pad}%`} width={`${100 + 2 * pad}%`} height={`${100 + 2 * pad}%`} colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
          </filter>
        </svg>
      ) : null}
      <div style={{...style, filter: on ? `url(#${id})` : undefined}}>{children}</div>
    </>
  );
};

/** Velocidad (px/frame) de una magnitud que depende del frame: diferencia central. */
export const velocity = (f: (frame: number) => number, frame: number) => (f(frame + 1) - f(frame - 1)) / 2;

/** Push de salida del acto de producto: −½ ancho en los últimos 8 f (ease.in, como ProductPush). */
export const usePushOut = (frames = 8) => {
  const {width, durationInFrames} = useScene();
  const start = durationInFrames - frames;
  const x = (f: number) => tween(f, [start, durationInFrames], [0, -0.5 * width], ease.in);
  return {x, start};
};
