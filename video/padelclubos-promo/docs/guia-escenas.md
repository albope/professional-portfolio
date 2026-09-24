# Guía para construir escenas

Contrato común de todas las escenas del vídeo. Si una escena lo incumple, no entra en el montaje.

## Estructura

```
src/
  brand/        tokens (color, font, radius, shadow), Logo/Isotipo oficiales, fuentes
  components/   kit de marca: AppShell, KpiCard, Button, Badge, BookingGrid, MarcadorModule,
                PhoneFrame + PlayerBottomNav, BrowserFrame, Cursor/TapRipple, WordsReveal,
                Counter, CourtLines, PadelBall, PaperBg/InkBg/GreenBg, useFormat, SAFE_*
  lib/anim.ts   BEAT (15 f), BAR (60 f), tween, progress, fadeUp, fadeOut, springAt, ease, fmt
  scenes/<id>/  index.tsx (componente) + cues.ts (sonidos)
  scenes/index.ts  registro id → componente
  scenes/cues.ts   registro id → cues
  timeline.ts   escenas y compases de cada formato
```

## Reglas

1. **Una escena, una carpeta.** Solo se tocan `src/scenes/<id>/index.tsx` y `src/scenes/<id>/cues.ts` (y archivos nuevos dentro de esa carpeta). El kit compartido no se modifica desde una escena: si falta algo, se crea dentro de la carpeta de la escena.
2. **Frames relativos.** `useCurrentFrame()` empieza en 0 al inicio de la escena. La duración sale de `useVideoConfig().durationInFrames`. Nada puede depender de otra escena.
3. **Ritmo musical.** 1 tiempo = 15 frames, 1 compás = 60 frames. Las entradas importantes caen en tiempo (múltiplos de 15) o en corchea (múltiplos de 7,5 → 7 u 8). Usa `beats(n)` y `bars(n)`.
4. **Dos formatos.** `const {portrait} = useFormat()`. 16:9 es 1920×1080 y 9:16 es 1080×1920. En vertical, nada importante en los 250 px superiores ni en los 400 px inferiores (`SAFE_9x16`). No basta con escalar: el vertical se maqueta de nuevo (apilar en columna, tipografía más grande respecto al ancho).
5. **Determinismo.** Prohibido `Math.random()`, `Date`, `setTimeout` y CSS `transition`/`animation`. Todo movimiento es función del frame. Para aleatoriedad usa `random(seed)` de `remotion`.
6. **Marca.** Solo colores de `color` (tokens). Tipos: `displayStyle()` (Archivo expandida) para titulares y cifras, `textStyle()` para UI, `monoStyle()` para etiquetas y numeración. Cifras siempre tabulares. Cero azul SaaS (el azul `info` solo como estado). Nada de confeti, neón, degradados chillones ni sombras duras.
7. **Legibilidad.** Titulares 16:9 entre 64 y 120 px; en 9:16 entre 72 y 110 px. Texto de UI nunca por debajo de 16 px efectivos tras escalar. Cada texto en pantalla se queda al menos 0,35 s por palabra antes de salir.
8. **Movimiento con oficio.** Entradas con `ease.outExpo` o muelles `springAt`; salidas más cortas que las entradas (`ease.in`). Escalonados de 2–4 frames. Cámara virtual: mueve/escala un contenedor con `ease.inOut`. Evita que todo se mueva a la vez: un foco por momento.
9. **Transiciones.** Cada escena resuelve su propia entrada y salida dentro de su duración (los cortes entre escenas son secos y caen en compás). Si la salida es un barrido, ocurre en los últimos 8–12 frames.
10. **Español impecable.** Tildes, «¿» y «¡», sin anglicismos innecesarios. Importes con `fmt.eur` / `fmt.eur2` (formato es-ES).

## Sonido

`src/scenes/<id>/cues.ts` exporta `cues: SceneCues` con `landscape` y `portrait`: lista de `{frame, sfx, gain?, pitch?, dur?, pan?}` relativa a la escena. Tipos en `src/sfx.ts`. Importa esos cues en `index.tsx` y usa sus frames para animar: así imagen y sonido nunca se desfasan. Un sonido por acción visible; no más de ~3 por segundo.

## Revisión

```
npx tsc --noEmit                               # debe pasar
scripts/review.sh S16-<id>                     # hoja de contactos en out/review/S16-<id>.png
scripts/review.sh S9-<id>                      # versión vertical
scripts/review.sh S16-<id> 0,15,30,45 1        # fotogramas concretos a tamaño real
```

Mira la hoja de contactos y los fotogramas clave a tamaño real antes de dar una escena por buena: textos cortados, solapes, elementos fuera de cuadro, contraste, zonas seguras y el primer y último frame (no deben quedar vacíos salvo que sea intencionado).
