// Uso: node scripts/render.mjs [escritorio|movil|all] [--concurrency=N]
// Genera los másteres sin audio en out/ (H.264, CRF 16, BT.709).
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import {bundle} from "@remotion/bundler";
import {renderMedia, selectComposition} from "@remotion/renderer";
import {browserExecutable} from "./browser.mjs";

const args = process.argv.slice(2);
const which = args.find((a) => !a.startsWith("--")) ?? "all";
const conc = Number((args.find((a) => a.startsWith("--concurrency=")) ?? "").split("=")[1]) || Math.max(1, os.cpus().length - 1);
const IDS = {escritorio: "HeroEscritorio", movil: "HeroMovil"};
const targets = which === "all" ? ["escritorio", "movil"] : [which];

fs.mkdirSync("out", {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts"), onProgress: () => {}});
const exe = browserExecutable();

try {
  for (const corte of targets) {
    const id = IDS[corte];
    const composition = await selectComposition({serveUrl, id, browserExecutable: exe, logLevel: "error"});
    const output = path.resolve("out", `hero-orden-${corte}-master.mp4`);
    let last = -1;
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: output,
      browserExecutable: exe,
      concurrency: conc,
      logLevel: "error",
      imageFormat: "png",
      crf: 16,
      pixelFormat: "yuv420p",
      colorSpace: "bt709",
      x264Preset: "slow",
      muted: true,
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
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}
