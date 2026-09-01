# Piezas de marca

Material gráfico que no forma parte de la web pero usa su misma identidad.
Cada pieza se escribe en HTML y se exporta a PNG, así que se puede reeditar
y regenerar sin herramientas de diseño.

| Fichero | Uso | Medidas |
|---|---|---|
| `twitter-header.html` | Portada de X / Twitter | 1500 × 500 |
| `og-image.html` | Imagen al compartir la web (copia de `public/og-1200x630.png`) | 1200 × 630 |
| `avatar.html` | Foto de perfil de X y GitHub | 512 × 512 |

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
