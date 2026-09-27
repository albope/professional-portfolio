// Uso: node scripts/sheet.mjs <salida.png> <columnas> <a.png> <b.png> ...
// Monta una hoja de contactos con los PNG (mismo tamaño) en una rejilla.
import fs from "node:fs";
import {PNG} from "pngjs";

const [salida, cols, ...files] = process.argv.slice(2);
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const w = imgs[0].width, h = imgs[0].height, gap = 8, c = Number(cols);
const r = Math.ceil(imgs.length / c);
const out = new PNG({width: c * w + (c + 1) * gap, height: r * h + (r + 1) * gap});
out.data.fill(0x55);
imgs.forEach((img, k) => {
  const ox = gap + (k % c) * (w + gap), oy = gap + Math.floor(k / c) * (h + gap);
  for (let y = 0; y < Math.min(h, img.height); y++) img.data.copy(out.data, ((oy + y) * out.width + ox) * 4, y * img.width * 4, (y * img.width + Math.min(w, img.width)) * 4);
});
fs.writeFileSync(salida, PNG.sync.write(out));
console.log(salida);
