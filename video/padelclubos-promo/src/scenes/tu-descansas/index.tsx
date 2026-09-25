import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {color} from "../../brand/tokens";
import {WordsReveal} from "../../components";
import {useScene} from "../../lib/scene";
import {Clock, ClockPortrait} from "./Clock";
import {TIMING} from "./cues";
import {PanelCard} from "./PanelCard";
import {PhoneOff} from "./PhoneOff";

/** Noche: #14120F con una viñeta radial muy suave hacia #1E1B17 (rima con el f0 del vídeo). */
const Night: React.FC<{portrait: boolean}> = ({portrait}) => (
  <AbsoluteFill
    style={{
      background: portrait
        ? `radial-gradient(100% 70% at 50% 42%, ${color.darkSurface} 0%, ${color.darkBg} 70%)`
        : `radial-gradient(90% 90% at 62% 46%, ${color.darkSurface} 0%, ${color.darkBg} 72%)`,
    }}
  />
);

/** Titular en líneas fijas, palabra a palabra con un escalonado continuo entre líneas. */
const Headline: React.FC<{
  frame: number;
  lines: string[];
  start: number;
  step: number;
  size: number;
  leading: number;
  style?: React.CSSProperties;
}> = ({frame, lines, start, step, size, leading, style}) => {
  let idx = 0;
  return (
    <div style={{position: "absolute", display: "flex", flexDirection: "column", ...style}}>
      {lines.map((line) => {
        const s = start + idx * step;
        idx += line.split(" ").length;
        return (
          <WordsReveal
            key={line}
            text={line}
            frame={frame}
            start={s}
            step={step}
            style={{fontSize: size, fontWeight: 720, lineHeight: leading, color: color.darkText, whiteSpace: "nowrap"}}
          />
        );
      })}
    </div>
  );
};

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {portrait} = useScene();
  const t = portrait ? TIMING.portrait : TIMING.landscape;

  if (portrait) {
    return (
      <AbsoluteFill>
        <Night portrait />
        {/* 23:47 en la misma posición y tamaño que el gancho (y290–500), ya en f0 */}
        <ClockPortrait />
        <PanelCard frame={frame} t={t} portrait style={{left: 72, top: 712, width: 936}} />
        <Headline
          frame={frame}
          lines={["Ellos reservan.", "Tú descansas."]}
          start={t.headline}
          step={t.headlineStep}
          size={84}
          leading={1.06}
          style={{left: 72, top: 1260}}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <Night portrait={false} />
      <PhoneOff />
      <Headline
        frame={frame}
        lines={["Ellos reservan", "desde el móvil;", "tú descansas."]}
        start={t.headline}
        step={t.headlineStep}
        size={80}
        leading={1.04}
        style={{left: 176, top: 454}}
      />
      {/* La columna izquierda ocupa y150–930, igual que el móvil */}
      <PanelCard frame={frame} t={t} portrait={false} style={{left: 176, top: 750, width: 1040, height: 180}} />
      {/* El chip del reloj crece hasta el reloj gigante (x160, y150–450) */}
      <Clock frame={frame} left={160} top={150} size={300} growAt={t.clockGrow} growDur={t.clockGrowDur} />
    </AbsoluteFill>
  );
};
