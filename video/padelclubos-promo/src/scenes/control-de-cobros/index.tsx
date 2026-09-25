import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {color} from "../../brand/tokens";
import {Cursor, WordsReveal, type CursorKey} from "../../components";
import {clamp01, ease, progress, view} from "../../lib/anim";
import {useScene} from "../../lib/scene";
import {T16} from "./cues";
import {PushIn} from "./push";
import {LightClock, Panel, VerifactuChip, ZOOM, cobrarCenter} from "./ui";

export {cues} from "./cues";

// Punta de la flecha del Cursor del kit (34 px, viewBox 24): (4,5; 2,8) → (6; 4) px.
const TIP = {x: 6, y: 4};

// La punta se apoya abajo a la derecha del botón, fuera del texto: «Cobrar» →
// «Cobrado» se lee entero en cada clic.
const aim = (i: number) => {
  const c = cobrarCenter(i);
  return {x: c.x + 44 - TIP.x, y: c.y + 12 - TIP.y};
};

// Llega un poco antes de cada clic y se queda quieto durante la pulsación.
const CURSOR_KEYS: CursorKey[] = [
  {at: T16.cursorIn, x: aim(0).x + 112, y: aim(0).y + 176},
  ...T16.pay.flatMap((at, i): CursorKey[] => [
    {at: at - (i === 0 ? 3 : 1), ...aim(i)},
    {at, ...aim(i), click: true},
    {at: at + 2, ...aim(i)},
  ]),
  {at: T16.paid - 2, ...aim(3)},
  {at: T16.paid + 14, x: aim(3).x + 70, y: aim(3).y + 60},
];

/** Vista inversa de 7 f: a f119 el titular y el chip ya no están. */
const EXIT_FRAMES = 7;

const exitStyle = (frame: number): React.CSSProperties => {
  const p = progress(frame, T16.exit, EXIT_FRAMES, ease.in);
  return {opacity: 1 - p, transform: `translateY(${-p * 4}px)`};
};

/**
 * Pre-encogido (c2.t3): 1 → 0,95 en ease-in t⁴ hacia el punto fijo del zoom a
 * la casilla 04. Llega a 0,95 en f120, que es el f0 de «todo-en-uno»: a f119
 * aún le falta un paso (≈10 px en el borde izquierdo), así el corte no repite
 * posición y el zoom sigue acelerando al otro lado.
 */
const shrinkAt = (frame: number, duration: number) => {
  const t = clamp01((frame - T16.shrink) / (duration - T16.shrink));
  return 1 - (1 - ZOOM.to) * Math.pow(t, ZOOM.power);
};

/** Capa de contenido: se desplaza con el push y se encoge al final (cámara). */
const Content: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useScene();
  const scale = shrinkAt(frame, durationInFrames);
  const cursorOut = progress(frame, T16.paid + 6, 8, ease.in);
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: `${ZOOM.origin.x}px ${ZOOM.origin.y}px`}}>
      <Panel frame={frame} />
      <VerifactuChip style={{...view(frame, T16.verifactu), ...(frame >= T16.exit ? exitStyle(frame) : {})}} />
      <div style={{position: "absolute", inset: 0, opacity: 1 - cursorOut}}>
        <Cursor frame={frame} keys={CURSOR_KEYS} appearAt={T16.cursorIn} />
      </div>
    </AbsoluteFill>
  );
};

/** 16:9. La HUD (reloj y titular) queda fuera del push y de la cámara. */
const Landscape: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: color.sand50}}>
      <PushIn id="cobros-push" inFrames={7} distance={0.5}>
        <Content />
      </PushIn>
      <LightClock frame={frame} rollAt={T16.clockRoll} />
      <WordsReveal
        text="Control de cobros."
        frame={frame}
        start={T16.title}
        step={3}
        exitAt={T16.exit}
        exitDuration={EXIT_FRAMES}
        style={{position: "absolute", left: 96, top: 128, fontSize: 80, fontWeight: 760, lineHeight: 1, color: color.ink900}}
      />
    </AbsoluteFill>
  );
};

/**
 * 20:25 — Control de cobros (L10). Solo existe en el master 16:9; si se
 * monta en vertical, se encaja la maqueta horizontal a lo ancho.
 */
export const Scene: React.FC = () => {
  const {portrait, width, height} = useScene();
  if (!portrait) return <Landscape />;
  const s = width / 1920;
  return (
    <AbsoluteFill style={{background: color.sand50}}>
      <div style={{position: "absolute", left: 0, top: (height - 1080 * s) / 2, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: "0 0"}}>
        <Landscape />
      </div>
    </AbsoluteFill>
  );
};
