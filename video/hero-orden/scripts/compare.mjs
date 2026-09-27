// Uso: node scripts/compare.mjs a.png b.png
//      node scripts/compare.mjs --pixel a.png x y
// Compara dos PNG del mismo tamaño píxel a píxel («IDÉNTICAS» o cuántos
// píxeles difieren y la diferencia máxima por canal) o imprime el color
// #RRGGBB de un píxel.
import fs from "node:fs";
import {PNG} from "pngjs";

const read = (file) => PNG.sync.read(fs.readFileSync(file));
const args = process.argv.slice(2);

if (args[0] === "--pixel") {
  const [, file, x, y] = args;
  const img = read(file);
  const i = (Number(y) * img.width + Number(x)) * 4;
  console.log(`#${[0, 1, 2].map((k) => img.data[i + k].toString(16).padStart(2, "0")).join("").toUpperCase()}`);
} else {
  const [a, b] = args.map(read);
  if (a.width !== b.width || a.height !== b.height) {
    console.log(`DISTINTO TAMAÑO (${a.width}×${a.height} frente a ${b.width}×${b.height})`);
    process.exit(1);
  }
  let distintos = 0;
  let maxDelta = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const d = Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2]));
    if (d > 0) distintos++;
    if (d > maxDelta) maxDelta = d;
  }
  console.log(distintos === 0 ? "IDÉNTICAS" : `DISTINTAS: ${distintos} píxeles, diferencia máxima ${maxDelta}`);
  process.exit(distintos === 0 ? 0 : 1);
}
