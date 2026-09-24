import {BAR} from "./lib/anim";

/**
 * Montaje sincronizado a 120 BPM: 1 compás = 2 s = 60 frames a 30 fps.
 * Fuente de verdad compartida con la música (audio/generate.py lee
 * out/timeline.json, que genera scripts/export-timeline.mjs).
 */
export interface SceneSpec {
  id: string;
  bars: number;
}

// Provisional: se sustituye por el storyboard definitivo (docs/storyboard.md).
export const LANDSCAPE: SceneSpec[] = [{id: "placeholder", bars: 30}];
export const PORTRAIT: SceneSpec[] = [{id: "placeholder", bars: 15}];

export interface PlacedScene extends SceneSpec {
  from: number;
  durationInFrames: number;
}

export const place = (list: SceneSpec[]): PlacedScene[] => {
  let acc = 0;
  return list.map((s) => {
    const durationInFrames = Math.round(s.bars * BAR);
    const placed = {...s, from: acc, durationInFrames};
    acc += durationInFrames;
    return placed;
  });
};

export const totalFrames = (list: SceneSpec[]) => list.reduce((a, s) => a + Math.round(s.bars * BAR), 0);
