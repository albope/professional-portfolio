# Tokens corporativos de presentación

> Estos valores describen la versión de las plantillas de presentación, no los
> tokens actuales del sitio. La web cambió `ink-faint` a `#6A685D` el 9 de
> septiembre de 2026 para mejorar el contraste. Los valores web canónicos están
> en `src/app/globals.css` y `tailwind.config.ts`; véase el
> [contexto vigente](../../../docs/contexto-actual.md). Esta nota no regenera las
> presentaciones ni acredita su contraste con el nuevo color.

Fuente de verdad: `Identidad visual pending respuestas.pdf`. La web se utilizó como comprobación de continuidad y la propuesta FELT únicamente como referencia de nivel y estructura.

## Color

| Token | Valor | Uso |
|---|---:|---|
| `paper` | `#F7F6F2` | Fondo editorial principal |
| `paper_2` | `#EFEDE6` | Superficies y bandas secundarias |
| `ink` | `#101013` | Fondo oscuro y texto principal |
| `ink_2` | `#18181C` | Superficie sobre fondo oscuro |
| `ink_soft` | `#3D3C35` | Texto secundario fuerte |
| `ink_mute` | `#5A594F` | Texto explicativo |
| `ink_faint` | `#8A887D` | Captions y metadatos |
| `cobalt` | `#2743E0` | Acento sobre papel |
| `cobalt_deep` | `#1E35B8` | Variante de apoyo |
| `cobalt_bright` | `#6B83FF` | Acento legible sobre tinta |
| `line` | `#E2E0D8` | Hairlines sobre papel |
| `line_dark` | `#38383D` | Hairlines sobre tinta |

## Tipografía

- `fontDisplay`: Archivo Black. Titulares principales, cifras y mensajes de alto impacto.
- `fontBody`: Archivo. Texto de lectura, subtítulos y explicaciones.
- `fontMono`: Fragment Mono. Etiquetas, numeración, estados, captions y metadatos.

El briefing textual mencionaba Geist, pero la guía de identidad establece Archivo, Archivo Black y Fragment Mono. Se aplica la prioridad solicitada y se incluyen los `.ttf` corporativos en `assets/fonts`; no se ha realizado una sustitución silenciosa.

## Geometría y retícula

- Formato: `13.333 × 7.5 in`, 16:9.
- Margen lateral: `0.72 in`.
- Margen superior: `0.52 in`; pie a `7.08 in`.
- Gutter base: `0.22 in`.
- Spacing: `0.08`, `0.16`, `0.24`, `0.48`, `0.72` y `1.00 in`.
- Radio: `0`. La identidad evita cajas redondeadas.
- Hairline: `0.75 pt`; regla de énfasis: `1 pt`.
- Cuadrado de cierre: aproximadamente `0.105 in`, cobalt o cobalt bright según fondo.

## Reglas de composición

- Una función narrativa dominante por diapositiva.
- Titular en mayúsculas con un cuadrado de acento como cierre.
- Alternancia medida de fondos `paper` e `ink` para marcar ritmo.
- Líneas finas y numeración mono para estructurar; sin sombras ni degradados.
- Capturas reales como protagonistas, sin marcos de dispositivos decorativos.
- Arquitectura, workflows, tablas y roadmaps se construyen con objetos editables.
