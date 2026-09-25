# Vídeo promocional de Padel Club OS

Vídeo de lanzamiento de [padelclubos.com](https://www.padelclubos.com) hecho al 100 % en código con [Remotion](https://www.remotion.dev): motion graphics, interfaz del producto recreada en vectores con la identidad «Marcador» y banda sonora original sintetizada. Sin metraje, sin fotos de banco y sin música de terceros, así que no hay licencias que pagar.

Los vídeos terminados están en [`entregables/`](entregables):

| Pieza | Formato | Duración | Uso |
|---|---|---|---|
| `padelclubos-promo-16x9.mp4` | 1920×1080 · 30 fps | 60 s | Web, YouTube, LinkedIn, presentaciones |
| `padelclubos-promo-9x16.mp4` | 1080×1920 · 30 fps | 30 s | Reels, TikTok, Shorts, stories |
| `…-solo-efectos.mp4` | igual | igual | Para montar encima otra música con licencia |

H.264 High, yuv420p BT.709, AAC 320 kbps. Audio a −14 LUFS integrados y −1 dBTP (el estándar de las redes sociales).

Guion y dirección: [`docs/storyboard.md`](docs/storyboard.md) («23:47 — Un día en Valencia Pádel Club»).

## Requisitos

- Node 20 o superior y Python 3.10 o superior.
- `npm install` en esta carpeta.
- `pip install numpy scipy soundfile pyloudnorm pillow` (audio y hojas de revisión).
- Chromium: Remotion descarga el suyo la primera vez. Si ya hay uno instalado, se puede indicar con `REMOTION_BROWSER_EXECUTABLE=/ruta/al/chrome`.

## Generar el vídeo

```bash
npx tsx scripts/export-timeline.ts   # escenas y cues de sonido → out/timeline.json
python3 audio/generate.py            # banda sonora → public/audio/*.wav
node scripts/render.mjs              # MP4 de los dos formatos → out/
node scripts/render.mjs 9x16 --audio=sfx   # variante vertical solo con efectos
```

Para ver y retocar en directo: `npm run studio` (abre Remotion Studio en el navegador).

## Cambiar cosas habituales

- **Textos**: cada escena vive en `src/scenes/<id>/index.tsx`. Los textos están escritos tal cual en el componente.
- **Colores y tipografías**: `src/brand/tokens.ts` (tokens de la identidad Marcador).
- **Duración de las escenas**: `src/timeline.ts` (en compases de 2 s; la música se regenera sola a partir de ahí).
- **Música**: el arreglo está en `audio/arrangement.py` y los instrumentos en `audio/synth.py`. Para usar otra canción, renderiza con `--audio=sfx` y súmala en el editor, o sustituye `public/audio/soundtrack-<formato>.wav` antes de renderizar (120 BPM para que los cortes caigan a tiempo).

## Estructura

```
docs/        storyboard y guía para construir escenas
src/brand/   tokens, logotipo oficial en trazados, carga de fuentes
src/components/  kit de producto: panel, portal móvil, parrilla, módulo marcador, reloj del día…
src/scenes/  una carpeta por escena (componente + cues de sonido)
audio/       motor de síntesis, arreglo y generador de la banda sonora
scripts/     render, fotogramas de revisión y utilidades
```
