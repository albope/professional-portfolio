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

const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts"), onProgress: () => {}});
const exe = browserExecutable();
const composition = await selectComposition({serveUrl, id, browserExecutable: exe, logLevel: "error"});
const frames =
  framesArg === "auto"
    ? Array.from({length: 8}, (_, i) => Math.round((i * (composition.durationInFrames - 1)) / 7))
    : framesArg.split(",").map(Number);
for (const frame of frames) {
  const output = path.join(outDir, `${id}-f${String(frame).padStart(4, "0")}.png`);
  await renderStill({composition, serveUrl, output, frame, scale, browserExecutable: exe, imageFormat: "png", logLevel: "error"});
  console.log(output);
}
