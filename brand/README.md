# Piezas de marca

Los HTML y PNG de esta carpeta son originales de marca con su propia versión.
La web genera actualmente sus imágenes Open Graph desde `src/app/opengraph-image.tsx`
y `src/app/proyectos/[slug]/opengraph-image.tsx`. El antiguo `og-image.html` y
`public/og-1200x630.png` son referencias históricas, no las fuentes de los
metadatos actuales. Antes de reutilizar una pieza, contrastar su copy y sus
colores con el [contexto vigente](../docs/contexto-actual.md) y los tokens del código.

Material gráfico que no forma parte de la web pero usa su misma identidad.
Cada pieza se escribe en HTML y se exporta a PNG, así que se puede reeditar
y regenerar sin herramientas de diseño.

| Fichero | Uso | Medidas |
|---|---|---|
| `twitter-header.html` | Portada de X / Twitter | 1500 × 500 |
| `og-image.html` | Original histórico de la imagen para compartir | 1200 × 630 |
| `avatar.html` | Foto de perfil de X y GitHub | 512 × 512 |
| `logo-completo.html` | Logo completo de la cabecera, fuente editable | Según el viewport |
| `bpm-tech-perfil-cal-512.png` | Logo completo para cargar como perfil de Cal.com | 512 × 512 |
| `bpm-tech-logo-horizontal-1024.png` | Logo completo horizontal sobre tinta | 1024 × 256 |

Las dos exportaciones del logo completo usan las proporciones de
`src/components/ui/Wordmark.tsx` (size 19, tone paper), con Fragment Mono local,
fondo tinta y acento cobalto brillante. El PNG de perfil mantiene margen para el
recorte circular. El wordmark completo se verá pequeño en avatares de 64 px.
Para regenerarlos, abrir `logo-completo.html`, esperar `document.fonts.ready`
y capturar el viewport a escala 1 en las dimensiones indicadas. La licencia de
la fuente está en `src/assets/fonts/OFL-Fragment-Mono.txt`.

El avatar va a sangre, sin círculo dibujado: X lo recorta en círculo y GitHub
lo muestra cuadrado, así que el fondo tiene que llegar a los bordes. La marca
vive dentro del círculo inscrito para que ningún recorte la toque. Hay versión
en tinta y en cobalto. El glifo de tres piezas se descartó para el avatar
porque a 48px, el tamaño real en un timeline, pierde definición.

## Regenerar un PNG

Con Edge o Chrome en modo headless, ajustando `--window-size` a las medidas
de la tabla:

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1500,500 --virtual-time-budget=9000 \
  --screenshot=twitter-header-1500x500.png twitter-header.html
```

## Zonas seguras de la portada de X

El avatar tapa la esquina inferior izquierda y en móvil se recortan los
laterales, así que el contenido va centrado en vertical, con margen lateral
amplio y sin nada en esa esquina.
