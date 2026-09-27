# Vídeo del hero (del caos al orden)

Vídeo mudo de 18 s que ocupa el hueco de la ilustración en el hero de bpmtechstudio.com. Se hizo con [/brag-slim](https://github.com/latent-spaces/brag), la variante que usa `/brag` en Claude Opus 5.5, y se construyó en código con [Remotion](https://www.remotion.dev).

- Guion y especificación: [`brag-output/brag-plan.md`](brag-output/brag-plan.md). Ángulo «Un día cualquiera»: lunes a las 9:00, el dato se copia a mano del chat a la hoja, todo entra en una sola aplicación, un clic confirma la reserva y el aviso sale solo, y todo queda «Todo al día».
- Hay dos cortes con las mismas escenas:
  - `HeroEscritorio`: 1280×1080 (64:54), la proporción del SVG anterior.
  - `HeroMovil`: 960×900. Se usa por debajo de 768 px.
- Se reproduce una vez y se queda en el último fotograma. El fotograma 0 es el póster del caos y el 539, la imagen fija para movimiento reducido y sin JS.

## Requisitos

- Node 20 o superior.
- `npm install` en esta carpeta.
- Remotion descarga su Chrome headless y trae su propio ffmpeg. No hace falta instalar nada en el sistema.

## Generar

```bash
npx tsc --noEmit                    # tipos
node scripts/render.mjs all         # másteres sin audio → out/hero-orden-<corte>-master.mp4
node scripts/encode.mjs             # MP4 H.264 para la web (sin audio) → ../../public/hero/
node scripts/posters.mjs            # pósters PNG de inicio y final → ../../public/hero/
```

## Revisar

```bash
node scripts/still.mjs HeroEscritorio 0,264,539 --scale=0.47 --out=out/stills/x   # fotogramas globales, a tamaño real en la web
node scripts/still.mjs E-un-clic 28,40 --scale=1                                  # una sola escena, fotogramas relativos
node scripts/compare.mjs a.png b.png                                             # ¿idénticas píxel a píxel?
node scripts/sheet.mjs hoja.png 4 a.png b.png c.png d.png                        # hoja de contactos
npm run studio                                                                    # Remotion Studio
```

## Dónde está cada cosa

- `src/timeline.ts`: escenas y fotogramas clave.
- `src/layout.ts`: geometría de los dos cortes.
- `src/textos.ts`: todos los textos en pantalla.
- `src/kit/`: componentes del caos (chat, hoja, nota y pósit), de la aplicación (ventana, filas, glifo y aviso) y el cursor.
- `src/kit/estados.ts`: estados de traspaso entre escenas. Las fronteras son idénticas píxel a píxel.
- `src/scenes/`: una escena por fichero. Cada una solo calcula el estado de cada fotograma.
