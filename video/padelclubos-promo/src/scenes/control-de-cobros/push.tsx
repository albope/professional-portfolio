import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {ease, tween} from "../../lib/anim";
import {useScene} from "../../lib/scene";

/** σ del gaussiano por px/frame: ≈ obturador de 180° (caja de ½ frame → σ = L/√12). */
const SIGMA_PER_PX = 0.15;

/**
 * Push de entrada del acto de producto (+960 px → 0 en 7 f, curva overlay)
 * con desenfoque direccional: gaussiano solo en X y proporcional a la
 * velocidad, el mismo que usan «sin-solapamientos», «adios-al-excel» y
 * «ligas-en-directo», así el push se ve igual a los dos lados del corte. La
 * velocidad se mide con diferencia central: f0 ya lleva estela (el corte cae
 * a velocidad máxima, como la salida de la escena anterior) y f7 aterriza
 * nítido.
 *
 * No se usa el ProductPush del kit: CameraMotionBlur suma muestras con
 * «plus-lighter» y opacidad 1/n, y el redondeo por canal tiñe la arena de
 * rosa. Promediar muchas muestras con opacidad 1/(k+1) tampoco es exacto: con
 * 40 o más muestras el redondeo a 8 bits oscurece la tinta (28,26,23 → 2,1,0)
 * y deja flecos amarillos y rosas en la sombra.
 */
export const PushIn: React.FC<{
  children: React.ReactNode;
  /** Id único del filtro SVG en el documento. */
  id: string;
  inFrames?: number;
  distance?: number;
}> = ({children, id, inFrames = 7, distance = 0.5}) => {
  const frame = useCurrentFrame();
  const {width} = useScene();
  const x = (f: number) => tween(f, [0, inFrames], [distance * width, 0], ease.overlay);
  // Tope común del acto de producto: estela legible, sin barrido en bloque.
  const sigma = Math.min(18, (Math.abs(x(frame + 1) - x(frame - 1)) / 2) * SIGMA_PER_PX);
  const on = sigma > 0.3;
  return (
    <>
      {on ? (
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${sigma.toFixed(2)} 0`} />
          </filter>
        </svg>
      ) : null}
      <AbsoluteFill style={{transform: `translateX(${x(frame)}px)`, filter: on ? `url(#${id})` : undefined}}>{children}</AbsoluteFill>
    </>
  );
};
