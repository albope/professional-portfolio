import React from "react"
import {Composition} from "remotion"
import {Hero} from "./Hero"
import {FPS} from "./lib/anim"
import {TOTAL} from "./timeline"

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HeroEscritorio" component={Hero} durationInFrames={TOTAL} fps={FPS} width={1280} height={1080} />
    <Composition id="HeroMovil" component={Hero} durationInFrames={TOTAL} fps={FPS} width={960} height={900} />
  </>
)
