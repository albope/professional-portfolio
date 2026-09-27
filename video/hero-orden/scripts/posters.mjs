// Uso: node scripts/posters.mjs [--dest=../../public/hero]
// Pósters del hero a tamaño completo en PNG, renderizados por Remotion:
//   hero-orden-<corte>-inicio.png  fotograma 0 (el caos, antes de arrancar)
//   hero-orden-<corte>-final.png   último fotograma (imagen fija asentada)
import path from "node:path";
import fs from "node:fs";
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import {browserExecutable} from "./browser.mjs";

const opt = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")));
const dest = path.resolve(opt.dest ?? "../../public/hero");
fs.mkdirSync(dest, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts"), onProgress: () => {}, enableCaching: false});
const exe = browserExecutable();
try {
  for (const [corte, id] of [["escritorio", "HeroEscritorio"], ["movil", "HeroMovil"]]) {
    const composition = await selectComposition({serveUrl, id, browserExecutable: exe, logLevel: "error"});
    for (const [nombre, frame] of [["inicio", 0], ["final", composition.durationInFrames - 1]]) {
      const output = path.join(dest, `hero-orden-${corte}-${nombre}.png`);
      await renderStill({composition, serveUrl, output, frame, scale: 1, browserExecutable: exe, imageFormat: "png", logLevel: "error"});
      console.log(output);
    }
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}
