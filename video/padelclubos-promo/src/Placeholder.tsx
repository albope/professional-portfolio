import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {color, displayStyle, monoStyle} from "./brand/tokens";

export const Placeholder: React.FC<{id: string}> = ({id}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: color.sand200, alignItems: "center", justifyContent: "center", gap: 16}}>
      <div style={{...displayStyle(800), fontSize: 64, color: color.ink900}}>{id}</div>
      <div style={{...monoStyle(500), fontSize: 24, color: color.ink500}}>
        {frame} / {durationInFrames}
      </div>
    </AbsoluteFill>
  );
};
