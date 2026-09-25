// Uso: node scripts/render.mjs [16x9|9x16|all] [--audio=full|sfx|none] [--concurrency=N]
// Genera los MP4 finales en out/.
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import {bundle} from "@remotion/bundler";
import {renderMedia, selectComposition} from "@remotion/renderer";
import {browserExecutable} from "./browser.mjs";

const args = process.argv.slice(2);
const which = args.find((a) => !a.startsWith("--")) ?? "all";
const audio = (args.find((a) => a.startsWith("--audio=")) ?? "--audio=full").split("=")[1];
const conc = Number((args.find((a) => a.startsWith("--concurrency=")) ?? "").split("=")[1]) || Math.max(1, os.cpus().length - 1);
const targets = which === "all" ? ["16x9", "9x16"] : [which];

fs.mkdirSync("out", {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts"), onProgress: () => {}});
const exe = browserExecutable();

for (const fmt of targets) {
  const id = `Promo-${fmt}`;
  const inputProps = {audio};
  const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable: exe, logLevel: "error"});
  const suffix = {full: "", sfx: "-solo-efectos", none: "-sin-audio"}[audio];
  const output = path.resolve("out", `padelclubos-promo-${fmt}${suffix}.mp4`);
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: output,
    inputProps,
    browserExecutable: exe,
    concurrency: conc,
    logLevel: "error",
    imageFormat: "jpeg",
    jpegQuality: 95,
    crf: 16,
    pixelFormat: "yuv420p",
    audioCodec: "aac",
    audioBitrate: "320k",
    x264Preset: "slow",
    onProgress: ({progress}) => {
      const pct = Math.floor(progress * 100);
      if (pct % 10 === 0 && pct !== last) {
        last = pct;
        console.log(`${id}: ${pct}%`);
      }
    },
  });
  console.log(output);
}

fs.rmSync(serveUrl, {recursive: true, force: true});
