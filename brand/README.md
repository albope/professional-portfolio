# Piezas de marca

Материal gráfico que no forma parte de la web pero usa su misma identidad.
Cada pieza se escribe en HTML y se exporta a PNG, así que se puede reeditar
y regenerar sin herramientas de diseño.

| Fichero | Uso | Medidas |
|---|---|---|
| `twitter-header.html` | Portada de X / Twitter | 1500 × 500 |
| `og-image.html` | Imagen al compartir la web (copia de `public/og-1200x630.png`) | 1200 × 630 |

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
