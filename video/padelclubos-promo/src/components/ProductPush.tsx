import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {CameraMotionBlur} from "@remotion/motion-blur";
import {ease, tween} from "../lib/anim";
import {useScene} from "../lib/scene";

interface PushOpts {
  enter: boolean;
  exit: boolean;
  inFrames: number;
  outFrames: number;
  distance: number;
}

const offsetAt = (frame: number, width: number, durationInFrames: number, o: PushOpts) => {
  const inX = o.enter ? tween(frame, [0, o.inFrames], [o.distance * width, 0], ease.overlay) : 0;
  const outX = o.exit ? tween(frame, [durationInFrames - o.outFrames, durationInFrames], [0, -o.distance * width], ease.in) : 0;
  return inX + outX;
};

// El desplazamiento se calcula DENTRO de la capa: CameraMotionBlur vuelve a
// pintarla en instantes intermedios y cada muestra debe ver su propio frame.
const PushLayer: React.FC<{children: React.ReactNode; o: PushOpts}> = ({children, o}) => {
  const frame = useCurrentFrame();
  const {width, durationInFrames} = useScene();
  const x = offsetAt(frame, width, durationInFrames, o);
  return <AbsoluteFill style={{transform: `translateX(${x}px)`}}>{children}</AbsoluteFill>;
};

/**
 * Push horizontal del acto de producto («avanza el día»): la capa de contenido
 * entra desde la derecha en los primeros `inFrames` y sale hacia la izquierda
 * en los últimos `outFrames`, con desenfoque de movimiento solo mientras se
 * mueve. La HUD (titulares, reloj) va FUERA de este componente.
 */
export const ProductPush: React.FC<{
  children: React.ReactNode;
  enter?: boolean;
  exit?: boolean;
  inFrames?: number;
  outFrames?: number;
  /** Desplazamiento como fracción del ancho del cuadro. */
  distance?: number;
}> = ({children, enter = true, exit = true, inFrames = 7, outFrames = 8, distance = 0.35}) => {
  const frame = useCurrentFrame();
  const {width, durationInFrames} = useScene();
  const o: PushOpts = {enter, exit, inFrames, outFrames, distance};
  const moving =
    Math.abs(offsetAt(frame, width, durationInFrames, o)) > 0.5 ||
    Math.abs(offsetAt(frame - 1, width, durationInFrames, o)) > 0.5;
  const layer = <PushLayer o={o}>{children}</PushLayer>;
  return moving ? (
    <CameraMotionBlur samples={8} shutterAngle={180}>
      {layer}
    </CameraMotionBlur>
  ) : (
    layer
  );
};
