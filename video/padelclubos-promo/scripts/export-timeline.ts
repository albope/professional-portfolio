// Uso: npx tsx scripts/export-timeline.ts
// Escribe out/timeline.json: escenas colocadas y cues de sonido en segundos
// para cada formato. audio/generate.py lo lee para sincronizar la música.
import fs from "node:fs";
import {BAR, BEAT, BPM, FPS} from "../src/lib/anim";
import {CUES} from "../src/scenes/cues";
import {LANDSCAPE, PORTRAIT, place, totalFrames, type SceneSpec} from "../src/timeline";

const build = (list: SceneSpec[], key: "landscape" | "portrait") => {
  const scenes = place(list);
  const cues = scenes.flatMap((s) =>
    (CUES[s.id]?.[key] ?? [])
      .filter((c) => c.frame >= 0 && c.frame < s.durationInFrames)
      .map((c) => ({...c, scene: s.id, absFrame: s.from + c.frame, t: (s.from + c.frame) / FPS, durS: c.dur ? c.dur / FPS : undefined})),
  );
  return {
    totalFrames: totalFrames(list),
    seconds: totalFrames(list) / FPS,
    scenes: scenes.map((s) => ({...s, startBar: s.from / BAR, t: s.from / FPS})),
    cues: cues.sort((a, b) => a.absFrame - b.absFrame),
  };
};

const out = {fps: FPS, bpm: BPM, beatFrames: BEAT, barFrames: BAR, "16x9": build(LANDSCAPE, "landscape"), "9x16": build(PORTRAIT, "portrait")};
fs.mkdirSync("out", {recursive: true});
fs.writeFileSync("out/timeline.json", JSON.stringify(out, null, 2));
console.log(`out/timeline.json · 16x9 ${out["16x9"].seconds}s, ${out["16x9"].cues.length} cues · 9x16 ${out["9x16"].seconds}s, ${out["9x16"].cues.length} cues`);
