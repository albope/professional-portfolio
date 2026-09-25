import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {color} from "../../brand/tokens";
import {ease, lerp, motion, progress, tween} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {DirBlur, velocity} from "./blur";
import {T16 as T} from "./cues";
import {CARD, PUSH} from "./geo";
import {Headline, ImportCounter, LightClock} from "./Hud";
import {ImportCard} from "./ImportCard";
import {Panel} from "./Panel";

export {cues} from "./cues";

/**
 * 13:05 — Adiós al Excel. La hoja rota de socios cae en la zona de
 * importación del panel, se endereza, sus errores se deshacen y cada fila se
 * convierte en un socio mientras el contador sube hasta 342.
 * Solo 16:9: no forma parte del corte vertical.
 */

const pushX = (f: number, dur: number) =>
  tween(f, [0, motion.overlay], [PUSH, 0], ease.overlay) + tween(f, [dur - 8, dur], [0, -PUSH], ease.in);

/** Pose de la hoja: cae girada, se posa algo descolocada y se endereza en el tiempo 2. */
const sheetPose = (f: number) => {
  const drop = progress(f, T.drop, motion.overlay, ease.overlay);
  const fix = progress(f, T.straighten, 6, ease.overlay);
  const lift = 1 - drop;
  return {
    o: progress(f, T.drop, 2, ease.out),
    x: lerp(-12, 0, fix),
    y: lift * -72 + lerp(8, 0, fix),
    s: 1 + lift * 0.06,
    r: lerp(-3 - lift * 2, 0, fix),
    lift,
  };
};

const Sheet: React.FC<{frame: number}> = ({frame}) => {
  if (frame < T.drop) return null;
  const p = sheetPose(frame);
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        borderRadius: 12,
        opacity: p.o,
        transform: `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg) scale(${p.s})`,
        boxShadow: `0 ${Math.round(6 + 34 * p.lift)}px ${Math.round(20 + 50 * p.lift)}px -12px rgba(28, 26, 23, ${(0.22 + 0.2 * p.lift).toFixed(3)})`,
      }}
    >
      <ImportCard frame={frame} />
    </div>
  );
};

const Landscape: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useScene();
  // La vista inversa termina justo en el último frame.
  const hudOut = Math.min(T.exit, durationInFrames - motion.exit) - 1;
  const px = (f: number) => pushX(f, durationInFrames);
  return (
    <AbsoluteFill style={{background: color.sand100}}>
      {/* Capa de contenido: push con desenfoque direccional */}
      <DirBlur id="adios-push" vx={velocity(px, frame)} style={{position: "absolute", inset: 0, transform: `translateX(${px(frame)}px)`}}>
        <Panel frame={frame} />
        <Sheet frame={frame} />
      </DirBlur>
      {/* HUD fija: reloj, titular y contador */}
      <LightClock frame={frame} />
      <Headline frame={frame} exitAt={hudOut} />
      <ImportCounter frame={frame} exitAt={hudOut} />
    </AbsoluteFill>
  );
};

export const Scene: React.FC = () => {
  const {portrait, width} = useScene();
  if (!portrait) return <Landscape />;
  // Fuera del corte vertical: si alguien la renderiza, el 16:9 centrado.
  const k = width / 1920;
  return (
    <AbsoluteFill style={{background: color.sand100}}>
      <div style={{position: "absolute", left: 0, top: "50%", width: 1920, height: 1080, transform: `translateY(-50%) scale(${k})`, transformOrigin: "0 50%"}}>
        <Landscape />
      </div>
    </AbsoluteFill>
  );
};
