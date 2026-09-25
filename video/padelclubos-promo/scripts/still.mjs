// Uso: node scripts/still.mjs <composicion> <frames> [--scale=0.5] [--out=out/stills]
//   <frames>: lista separada por comas (p. ej. 0,30,59) o «auto» (8 frames repartidos).
// Renderiza fotogramas sueltos para revisar una escena sin generar el vídeo.
import path from "node:path";
import fs from "node:fs";
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import {browserExecutable} from "./browser.mjs";

const [id, framesArg = "auto", ...rest] = process.argv.slice(2);
if (!id) {
  console.error("Falta el id de la composición");
  process.exit(1);
}
const opt = Object.fromEntries(rest.map((a) => a.replace(/^--/, "").split("=")));
const scale = Number(opt.scale ?? 0.5);
const outDir = path.resolve(opt.out ?? "out/stills");
fs.mkdirSync(outDir, {recursive: true});

// Las composiciones de una sola escena (S16-<id>, S9-<id>) se empaquetan con
// una entrada propia que solo importa esa escena: así el trabajo a medias de
// otra escena no rompe esta revisión.
const only = id.match(/^S(16|9)-(.+)$/);
let entryPoint = path.resolve("src/index.ts");
if (only && opt.full === undefined) {
  const sceneId = only[2];
  const dir = path.resolve("out/entries", sceneId);
  fs.mkdirSync(dir, {recursive: true});
  entryPoint = path.join(dir, "index.tsx");
  fs.writeFileSync(
    entryPoint,
    `import React from "react";
import {AbsoluteFill, Composition, registerRoot} from "remotion";
import {FontGate} from "../../../src/brand/fonts";
import {color} from "../../../src/brand/tokens";
import {SceneProvider} from "../../../src/lib/scene";
import {Scene} from "../../../src/scenes/${sceneId}";
import {LANDSCAPE, PORTRAIT, place} from "../../../src/timeline";

const dur = (list: typeof LANDSCAPE) => place(list).find((s) => s.id === "${sceneId}")?.durationInFrames;
const Comp: React.FC<{d: number}> = ({d}) => (
  <FontGate>
    <AbsoluteFill style={{background: color.ink900}}>
      <SceneProvider durationInFrames={d}>
        <Scene />
      </SceneProvider>
    </AbsoluteFill>
  </FontGate>
);
const L = dur(LANDSCAPE);
const P = dur(PORTRAIT);
const Root: React.FC = () => (
  <>
    {L ? <Composition id="S16-${sceneId}" component={Comp} defaultProps={{d: L}} durationInFrames={L} fps={30} width={1920} height={1080} /> : null}
    {P ? <Composition id="S9-${sceneId}" component={Comp} defaultProps={{d: P}} durationInFrames={P} fps={30} width={1080} height={1920} /> : null}
  </>
);
registerRoot(Root);
`,
  );
}
const serveUrl = await bundle({entryPoint, onProgress: () => {}});
const exe = browserExecutable();
const composition = await selectComposition({serveUrl, id, browserExecutable: exe, logLevel: "error"});
const frames =
  framesArg === "auto"
    ? Array.from({length: 8}, (_, i) => Math.round((i * (composition.durationInFrames - 1)) / 7))
    : framesArg.split(",").map(Number);
try {
  for (const frame of frames) {
    const output = path.join(outDir, `${id}-f${String(frame).padStart(4, "0")}.png`);
    await renderStill({composition, serveUrl, output, frame, scale, browserExecutable: exe, imageFormat: "png", logLevel: "error"});
    console.log(output);
  }
} finally {
  // Cada empaquetado ocupa ~100 MB en el directorio temporal: se borra al terminar.
  fs.rmSync(serveUrl, {recursive: true, force: true});
}
