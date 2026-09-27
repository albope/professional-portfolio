// Uso: node scripts/encode.mjs [--dest=../../public/hero]
// Del máster de cada corte (out/hero-orden-<corte>-master.mp4) saca las
// versiones para la web, sin pista de audio:
//   hero-orden-<corte>.mp4   H.264 High, yuv420p, BT.709, faststart
// Solo MP4: con esta animación plana el VP9 pesaba más que el H.264
// (595 frente a 472 KB en escritorio) y el H.264 lo reproduce cualquier navegador.
// Los pósters (primer y último fotograma) se sacan aparte con scripts/posters.mjs,
// directamente de Remotion: el ffmpeg de Remotion pasa de YUV a RGB con otra
// matriz y el papel saldría #F6F4F0 en vez de #F7F6F2.
// Usa el ffmpeg que trae Remotion (`npx remotion ffmpeg`).
import path from "node:path";
import fs from "node:fs";
import {execFileSync} from "node:child_process";

const opt = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")));
const dest = path.resolve(opt.dest ?? "../../public/hero");
fs.mkdirSync(dest, {recursive: true});

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const ff = (...args) => execFileSync(npx, ["remotion", "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", ...args], {stdio: "inherit", shell: process.platform === "win32"});
const probe = (file) =>
  execFileSync(npx, ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration,size:stream=codec_type,codec_name,pix_fmt,color_space,width,height,nb_frames", "-of", "json", file], {
    shell: process.platform === "win32",
  }).toString();

const COLOR = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"];

for (const corte of ["escritorio", "movil"]) {
  const master = path.resolve("out", `hero-orden-${corte}-master.mp4`);
  if (!fs.existsSync(master)) {
    console.log(`Sin máster de ${corte}, se salta`);
    continue;
  }
  const mp4 = path.join(dest, `hero-orden-${corte}.mp4`);
  ff("-i", master, "-an", "-c:v", "libx264", "-preset", "veryslow", "-crf", opt.crf ?? "24", "-profile:v", "high", "-pix_fmt", "yuv420p", ...COLOR, "-movflags", "+faststart", mp4);
  console.log(path.basename(mp4), probe(mp4).replace(/\s+/g, " "));
}
