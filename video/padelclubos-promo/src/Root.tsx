import React from "react";
import {AbsoluteFill, Audio, Composition, getStaticFiles, Sequence, staticFile} from "remotion";
import {FontGate} from "./brand/fonts";
import {color} from "./brand/tokens";
import {useFormat} from "./components/backgrounds";
import {KitPreview} from "./KitPreview";
import {FPS} from "./lib/anim";
import {Placeholder} from "./Placeholder";
import {SceneProvider} from "./lib/scene";
import {SCENES} from "./scenes";
import {LANDSCAPE, PORTRAIT, place, totalFrames, type SceneSpec} from "./timeline";

const SIZE = {
  "16x9": {width: 1920, height: 1080},
  "9x16": {width: 1080, height: 1920},
} as const;

const SceneById: React.FC<{id: string}> = ({id}) => {
  const Comp = SCENES[id];
  return Comp ? <Comp /> : <Placeholder id={id} />;
};

const hasFile = (name: string) => getStaticFiles().some((f) => f.name === name);

/** full = música + efectos · sfx = solo efectos · none = sin audio */
type PromoProps = {audio: "full" | "sfx" | "none"};

const Promo: React.FC<PromoProps> = ({audio: mode}) => {
  const {format} = useFormat();
  const list = format === "16x9" ? LANDSCAPE : PORTRAIT;
  const audio = `audio/${mode === "sfx" ? "sfx" : "soundtrack"}-${format}.wav`;
  return (
    <FontGate>
      <AbsoluteFill style={{background: color.ink900}}>
        {place(list).map((s) => (
          <Sequence key={s.id + s.from} from={s.from} durationInFrames={s.durationInFrames} name={s.id}>
            <SceneProvider durationInFrames={s.durationInFrames}>
              <SceneById id={s.id} />
            </SceneProvider>
          </Sequence>
        ))}
        {mode !== "none" && hasFile(audio) ? <Audio src={staticFile(audio)} /> : null}
      </AbsoluteFill>
    </FontGate>
  );
};

const SingleScene: React.FC<{id: string; d: number}> = ({id, d}) => (
  <FontGate>
    <AbsoluteFill style={{background: color.ink900}}>
      <SceneProvider durationInFrames={d}>
        <SceneById id={id} />
      </SceneProvider>
    </AbsoluteFill>
  </FontGate>
);

const sceneComps = (fmt: "16x9" | "9x16", list: SceneSpec[]) => {
  const seen = new Set<string>();
  return place(list)
    .filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true)))
    .map((s) => (
      <Composition
        key={`${fmt}-${s.id}`}
        id={`S${fmt === "16x9" ? "16" : "9"}-${s.id}`}
        component={SingleScene}
        defaultProps={{id: s.id, d: s.durationInFrames}}
        durationInFrames={s.durationInFrames}
        fps={FPS}
        {...SIZE[fmt]}
      />
    ));
};

export const Root: React.FC = () => (
  <>
    <Composition
      id="Promo-16x9"
      component={Promo}
      defaultProps={{audio: "full"} satisfies PromoProps}
      durationInFrames={totalFrames(LANDSCAPE)}
      fps={FPS}
      {...SIZE["16x9"]}
    />
    <Composition
      id="Promo-9x16"
      component={Promo}
      defaultProps={{audio: "full"} satisfies PromoProps}
      durationInFrames={totalFrames(PORTRAIT)}
      fps={FPS}
      {...SIZE["9x16"]}
    />
    {sceneComps("16x9", LANDSCAPE)}
    {sceneComps("9x16", PORTRAIT)}
    <Composition
      id="KitPreview"
      component={() => (
        <FontGate>
          <KitPreview />
        </FontGate>
      )}
      durationInFrames={90}
      fps={FPS}
      {...SIZE["16x9"]}
    />
  </>
);
