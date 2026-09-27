// Uso: node scripts/still.mjs <composicion> <fotogramas> [--scale=0.5] [--out=out/stills]
//   <composicion>: HeroEscritorio, HeroMovil (fotogramas GLOBALES) o
//                  E-<escena>, M-<escena> (fotogramas RELATIVOS a la escena;
//                  <escena> es el id de ESCENAS, p. ej. E-copiar-a-mano).
//   <fotogramas>: lista separada por comas (p. ej. 0,30,59) o «auto» (8 repartidos).
// Renderiza fotogramas sueltos en PNG para revisar sin generar el vídeo.
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

// Fichero de cada escena en src/scenes/ (cada uno exporta `Escena`).
const FICHEROS = {
  "lunes-nueve": "LunesNueve",
  "copiar-a-mano": "CopiarAMano",
  "todo-en-una-app": "TodoEnUnaApp",
  "un-clic": "UnClic",
  "todo-al-dia": "TodoAlDia",
};

// Las composiciones de una sola escena se empaquetan con una entrada propia
// que solo importa esa escena: así el trabajo a medias de otra escena no
// rompe esta revisión.
const only = id.match(/^(E|M)-(.+)$/);
let entryPoint = path.resolve("src/index.ts");
if (only) {
  const sceneId = only[2];
  const fichero = FICHEROS[sceneId];
  if (!fichero) {
    console.error(`Escena desconocida: ${sceneId}. Válidas: ${Object.keys(FICHEROS).join(", ")}`);
    process.exit(1);
  }
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
import {FPS} from "../../../src/lib/anim";
import {Escena} from "../../../src/scenes/${fichero}";
import {ESCENAS} from "../../../src/timeline";

const d = ESCENAS.find((s) => s.id === "${sceneId}")!.duracion;
const Comp: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{background: color.bg, willChange: "transform", WebkitFontSmoothing: "antialiased"}}>
      <SceneProvider durationInFrames={d}>
        <Escena />
      </SceneProvider>
    </AbsoluteFill>
  </FontGate>
);
const Root: React.FC = () => (
  <>
    <Composition id="E-${sceneId}" component={Comp} durationInFrames={d} fps={FPS} width={1280} height={1080} />
    <Composition id="M-${sceneId}" component={Comp} durationInFrames={d} fps={FPS} width={960} height={900} />
  </>
);
registerRoot(Root);
`,
  );
}
// Sin caché de webpack: varias revisiones pueden empaquetar a la vez.
const serveUrl = await bundle({entryPoint, onProgress: () => {}, enableCaching: false});
const exe = browserExecutable();
try {
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
} finally {
  // Cada empaquetado ocupa ~100 MB en el directorio temporal: se borra al terminar.
  fs.rmSync(serveUrl, {recursive: true, force: true});
}
