# brag-plan · Vídeo del hero de BPM Tech · «Un día cualquiera» (definitivo)

Las menciones a `HeroArt.tsx` y `HeroIllustration.tsx` se refieren a la ilustración SVG que este vídeo sustituyó (retirada; `git show 639331e:src/components/hero/`).

Base: guion ganador «Un día cualquiera» (ángulo A), con todos los fallos de los tres jueces corregidos y las mejores ideas de «glifo» y «control» injertadas sin alargar el relato.

**Convenciones de este documento**
- Todas las medidas son px de composición: escritorio 1280×1080 (se ve a ≈0,5) y móvil 960×900 (se ve a ≈0,36-0,46).
- «f» es fotograma. Dentro de cada escena los fotogramas son RELATIVOS a la escena (el primero es f0). Donde se dan globales se dice «global».
- «a-b» en un movimiento significa `tween(frame, [a, b], [desde, hasta], curva)` de `src/lib/anim.ts`: empieza en a y llega a su valor final en b.
- Curvas: solo `ease.out` (entradas y asentamientos) y `ease.inOut` (desplazamientos, salidas y cambios de estado). No se usa `ease.in`, así que tampoco el helper `fadeOut`. Nada de `spring()`, rebotes, overshoot, 3D, parallax, zoom de cámara ni desenfoque de movimiento.
- Toda la geometría sale de un único objeto `LAYOUT` (sección 5.3). Ninguna escena escribe coordenadas propias.

---

## 1. Encabezado

| Campo | Valor |
|---|---|
| **Ángulo** | «Un día cualquiera». La mesa del dueño un lunes por la mañana: un cliente pregunta por mensaje, la respuesta es un «ya te diremos», un pósit recuerda avisar «¡hoy!», el dato se copia a mano del chat a la hoja y el cliente vuelve a preguntar. Llega la aplicación, cada cosa ocupa su fila con su origen, un solo clic confirma la reserva y el aviso al cliente sale solo. El día acaba «Todo al día». El caos se mueve y el orden está quieto. |
| **Gancho (0-2 s)** | Póster con la pregunta «¿Tenéis hueco el jueves a las 19?», la respuesta evasiva «Lo miramos y te decimos», una hoja «Cobros» con la celda «¿?» seleccionada y las pestañas «Stock», «Stock 2», «Stock final». A los 0,33 s cae el pósit «Avisar al cliente ¡hoy!». |
| **Highlights** | 1. **Copiar a mano** (el problema de `servicios.items[1].para_cuando`): se selecciona «el jueves a las 19» en el chat y se teclea «jueves 19» en la hoja, y mientras tanto el cliente insiste «¿Al final hay hueco?». 2. **Todo en una sola aplicación**: cada pieza vuela a su fila y la fila dice de dónde venía («Antes, en un mensaje», «Antes, en una hoja de cálculo», «Antes, en un papel», «Antes, en un pósit»). 3. **Un clic y lo demás va solo**: «Confirmar» marca la reserva y una señal baja hasta «Aviso al cliente», que pasa a «Enviado» sin que nadie la toque. Aparece «Aviso enviado al cliente». |
| **Remate** | El estado de la cabecera pasa de «□ Por revisar» a «■ Todo al día»: su cuadrado se llena de cobalto. Todas las filas en ■. Silencio y quietud. El pie de la web pone la frase. |
| **Tono** | `polished` adaptado: sereno, sin guiños salvo el que sale del propio mundo del cliente («Stock final»). Cinco escenas en un único plano continuo, sin cortes ni fundidos entre composiciones: lo viejo sale y después entra lo nuevo. Pocos saltos de cursor (cinco desplazamientos en todo el vídeo) y un foco por momento. |
| **Identidad «Orden»** | `color`, `font`, `radius`, `shadow`, `displayStyle`, `textStyle`, `handStyle`, `monoStyle` de `src/brand/tokens.ts`. Schibsted Grotesk (560 en «Hoy», 600 en títulos de fila y botones, 400/500 en interfaz, cursiva 450/600 en lo manuscrito) y Fragment Mono solo en el rótulo y las horas. Esquinas: 14 px en pantalla para ventanas y 10 px para filas (28/20 en escritorio y 34/24 en móvil). Sombras muy suaves (5.3). El cobalto se reserva para el orden: en el caos solo aparece en la selección de la hoja y en el resalte de copia, que son acciones del cursor. |
| **Duración** | **540 fotogramas exactos (18,0 s) a 30 fps**, mudo. Se reproduce una vez y se queda en el último fotograma. |

### 1.1 Adaptaciones al hero

- Va junto al H1 «Software a medida para ordenar la gestión de tu negocio» y encima del pie fijo «Lo que hoy está repartido entre mensajes, hojas de cálculo y papel, reunido en una sola aplicación.». El vídeo no repite el H1: su único rótulo sobreimpreso es «Lunes, 9:00» (dos palabras, solo en el caos). Todo lo demás es texto de interfaz.
- Dos composiciones con las mismas escenas y los mismos tiempos: `HeroEscritorio` 1280×1080 y `HeroMovil` 960×900. Móvil se simplifica: sin nota de papel (3 piezas y 3 filas), sin barra lateral, sin horas en el chat y con tres pestañas en la hoja.
- Texto mínimo: 28 px en escritorio y 36 px en móvil. Medido con las fuentes reales (fontTools sobre los woff2 de `node_modules`), todos los anchos de la sección 5.3 caben con margen.
- Escritorio: la ventana final empieza en x = 88 (6,875 % de 1280), igual que el relleno del pie (`768:px-[6,875%]` en `HeroIllustration.tsx`), y es simétrica (88 a 1192). Móvil: ventana de 16 a 944, márgenes de 16 px.
- Fondo del lienzo #F7F6F2 en todos los fotogramas. En el hero no hay tarjeta redondeada alrededor de la figura: el vídeo se apoya directamente en el papel de la página. Aun así ninguna pieza queda a menos de 23 px del borde.
- Fotograma 0 = póster antes de arrancar (se exporta con `remotion still`, no se incrusta). Fotograma 539 = imagen fija final (movimiento reducido y sin JS). Todo el movimiento termina en el global 484. Del 484 al 539 hay 56 fotogramas idénticos y después el vídeo se queda parado.
- Los textos del vídeo viven en `src/textos.ts` del proyecto Remotion. No se tocan `copy.json` ni `copy.test.ts`.

### 1.2 Qué se corrige del guion ganador (fallos de los jueces)

| Fallo señalado | Corrección |
|---|---|
| «Lo miro y te digo» en primera persona del singular y en color de marca | «Lo miramos y te decimos» en una burbuja NEUTRA (pastilla #F2F0EA, filete-2, ✓✓ en tinta-3). El cobalto no aparece en boca de nadie |
| «¿Me lo confirmáis?» lleva «Me» | «¿Al final hay hueco?», precedida de la burbuja de «escribiendo» con tres puntos |
| «jueves 1» se lee como errata | El tecleo termina: «jueves 19». La insistencia del cliente llega después, así que no hay interrupción ambigua |
| □ huecos en la barra lateral contradicen el glifo | Solo «■ Hoy» activo. «Reservas», «Cobros», «Stock» y «Pedidos» sin cuadrados |
| El dueño de tienda o almacén no se reconoce | Pestañas «Stock», «Stock 2» y «Stock final» en la hoja (móvil: «Stock» y «Stock final») y «Stock» en la barra lateral |
| El final no dice «en orden y bajo control» por sí solo y los dos cortes acaban distinto | Chip de cabecera «□ Por revisar» que pasa a «■ Todo al día». Todas las filas acaban en ■ en los dos cortes |
| Incoherencia: se teclea una reserva en la hoja y la hoja acaba en «Cuotas de octubre» | La hoja es la de «Cobros» (Cliente, Día, Pagado): cada reserva de la semana es un cobro de la semana. La hoja se convierte en «Cobros de la semana · ■ Al día» |
| «Cobradas» aparece hecho sin acción | Es intencionado y ahora se explica en el propio relato: los datos de la hoja ya están en la aplicación, así que la fila llega con su estado real. La única acción humana del vídeo es «Confirmar» |
| Entre f186 y f200 cuatro piezas con texto tapan la cabecera de la ventana | El texto de todas las piezas se funde (S3 12-24) ANTES de que entre la ventana (S3 22-46). Sobre la ventana solo hay siluetas limpias |
| Móvil: el origen de 36 px choca con la columna de estado | El estado va en la línea del título y el origen en la segunda línea. Anchos medidos: nada se toca (5.3) |
| Móvil: hoja pegada al borde | Extensiones calculadas con el giro: margen mínimo 23,5 px a la derecha y 30 px abajo |
| Contradicción ≤2× frente a ≤1,5× en el vuelo | Una sola fórmula (5.5, `vuelo`) con valores calculados: a mitad de vuelo la silueta mide 116-181 px y al empezar el fundido (80 %) mide 1,05× la baldosa |
| Póster de móvil pobre | La respuesta ya está en el póster y la hoja lleva pestañas: rótulo, dos burbujas y hoja grande |
| Letras de columna en tinta-4 con poco contraste | No hay letras ni números de fila: son bandas de pastilla sin texto |
| Imagen fija final corta (58 f) | 56 f de quietud dentro del vídeo y congelación indefinida después. El control «Ver de nuevo» no aparece encima de ningún movimiento |
| «una corchete» | Se llama «trazo de señal» |
| Demasiado parecido a `HeroArt` | Ver 1.4 |

### 1.3 Ideas injertadas y descartadas

| Idea | Decisión |
|---|---|
| Pestañas «Stock», «Stock 2», «Stock final» | **Sí**, como textura con broma legible (6 palabras, en pantalla 6,7 s) |
| Glifo de la barra de título montado por partes | **Sí**: barra, cuadrado hueco que se traza y cuadrado cobalto que crece, S3 32-52 |
| Única acción humana: botón «Confirmar» | **Sí**, ya estaba. Se añade la onda cuadrada al pulsar, para que el clic se lea a 0,4 de escala. Montaje: la onda pasa de cobalto-100 a cobalto con opacidad 0,6·(1 − progreso), porque el cobalto-100 sobre blanco no llegaba a 1,4:1 a escala real |
| «Aviso enviado al cliente» como prueba de la automatización | **Sí**, aviso dentro de la ventana, justo debajo de la fila del aviso (un solo foco) |
| Escena de copiar a mano | **Sí**, corregida (termina el tecleo) |
| «Todo al día» o cuadrado de estado que se llena | **Las dos en una**: chip de cabecera cuyo □ se llena y cuyo texto pasa de «Por revisar» a «Todo al día» |
| Burbuja de «escribiendo» con tres puntos | **Sí**, 16 f, antes de «¿Al final hay hueco?» |
| Tira de resumen ■■□■ y leyenda «▢ Pendiente ■ Hecho» | **No**: redundantes con el chip y didácticas |
| Fila «Stock del almacén» (quinta fila) | **No**: el final quedaría denso. El stock vive en las pestañas del caos y en «Stock» de la barra lateral |
| Clics extra para cobros o stock | **No**: convierten la aplicación en una lista de tareas |
| Tarjetas-pregunta y ocho saltos de cursor | **No**: ritmo nervioso |
| Rótulo «Lo que hoy cuesta saber» | **No**: segundo «Lo que hoy» junto al pie |
| Nota «Cuota en efectivo / ¿Está apuntada?» | **No**: duplicaría los cobros y se perdería «pedidos en papel» de la entradilla |
| Mover textos a `copy.json` o ampliar `copy.test.ts` | **No**, por encargo |

### 1.4 Qué supera frente a la ilustración actual (`HeroArt.tsx`)

1. Cuenta un día con tiempo (rótulo «Lunes, 9:00», horas 9:02 y 9:41) en lugar de cuatro piezas que vuelan.
2. Enseña el trabajo de copiar datos a mano, que hoy no aparece.
3. Enseña una automatización en marcha: un clic resuelve dos filas y lo prueba un aviso.
4. Nombra el problema del stock que nunca cuadra.
5. Termina con un estado global explícito («Todo al día») y sin ambigüedades en el glifo.
6. Texto legible a escala real, medido.

---

## 2. Respuestas de Inspect (brag-slim)

| Pregunta | Respuesta |
|---|---|
| **Qué es (una frase)** | BPM Tech es un estudio de Valencia que hace software de gestión a medida, automatizaciones e integraciones y webs para pymes. |
| **Para quién y qué hace por ellos** | Para dueños y gerentes de clubes, academias, tiendas, almacenes, talleres y despachos que llevan el negocio entre mensajes, hojas de cálculo, papel y pósits. Les reúne todo en una aplicación hecha a su forma de trabajar, conectada con lo que ya usan, donde se ve de un vistazo qué está hecho y qué falta y donde los datos pasan solos de una herramienta a otra. |
| **Qué le distingue** | Hecho a medida: las filas hablan el idioma del negocio (reservas, cobros, pedidos, avisos), no el de un programa genérico. Conecta lo que ya existe en lugar de obligar a cambiarlo todo. Una sola acción humana pone en marcha el resto. |
| **La afirmación más fuerte o más graciosa** | La más fuerte, de la entradilla: «Lo reunimos en una aplicación hecha para tu forma de trabajar y conectamos las herramientas que ya usas». Se demuestra sin cifras: las piezas se convierten en filas y un «Confirmar» avisa solo al cliente, que es el ejemplo literal de `servicios.items[1].ejemplo` («enviar un aviso por email cuando alguien confirma»). La más graciosa sale del propio cliente (`diagnostico.placeholders[0]`, «Llevamos el stock en tres hojas de cálculo y nunca cuadra»): las pestañas «Stock», «Stock 2» y «Stock final». |
| **Gancho visual** | Lunes a las 9:00. Un cliente pregunta por un hueco, la respuesta es «Lo miramos y te decimos» y le cae encima un pósit: «Avisar al cliente ¡hoy!». |
| **UI o flujo real que se enseña** | No se puede enseñar un proyecto real (eso es la sección siguiente), así que el «producto» es el vocabulario de la propia web «Orden»: la ventana, las filas con su origen, el glifo □/■ y los iconos de origen de `HeroArt.tsx`, reconstruidos en Remotion con los tokens. Flujo: entrada (la petición por mensaje, copiada a mano a la hoja) → acción clave (pulsar «Confirmar») → resultado («Enviado», «Aviso enviado al cliente» y «Todo al día»). |
| **Tono** | `polished` adaptado (ver encabezado). |
| **Frase para compartir** | No hace falta `share-copy.txt`: el pie fijo de la web hace de cierre verbal. «Hoy», la cabecera de la aplicación, rima con el «hoy» del pie. |

**Desvíos conscientes de brag-slim**: es mudo por requisito, el fotograma 0 NO se sustituye por el mejor fotograma (tiene que ser el póster del caos), el fotograma más fuerte y asentado es el último y se exporta como imagen fija, y no hay `share-copy.txt`.

---

## 3. Tabla resumen de escenas

Un único plano continuo montado con `<Series>`. Cada escena recibe fotogramas relativos (`useCurrentFrame()` dentro de su `Series.Sequence`) y su duración con `useScene().durationInFrames`.

| # | id | Global inicio | Global fin (incluido) | Duración |
|---|---|---|---|---|
| S1 | `lunes-nueve` | 0 | 59 | 60 f · 2,00 s |
| S2 | `copiar-a-mano` | 60 | 189 | 130 f · 4,33 s |
| S3 | `todo-en-una-app` | 190 | 319 | 130 f · 4,33 s |
| S4 | `un-clic` | 320 | 449 | 130 f · 4,33 s |
| S5 | `todo-al-dia` | 450 | 539 | 90 f · 3,00 s |
| | **Total** | **0** | **539** | **540 f · 18,0 s** |

**Regla de traspaso.** Todo lo que cruza de una escena a la siguiente está EN REPOSO en la frontera, así que el último fotograma de una escena y el primero de la siguiente son idénticos píxel a píxel (se comprueba en 7.3). Para que eso se cumpla también con la respiración del caos, la respiración vale 0 en el primer y en el último fotograma de cada escena (fórmula en 5.5). Los estados de traspaso están escritos como objetos en `src/kit/estados.ts` (5.4): cada escena empieza exactamente en el estado con el que acabó la anterior.

---

## 4. Escenas

### S1 · `lunes-nueve` (global 0-59, 60 f)

**Qué se ve.** El póster del caos (sección 6) cobra vida: las piezas respiran y a los 0,33 s cae el pósit «Avisar al cliente ¡hoy!» en el hueco libre (abajo a la derecha en escritorio, abajo a la izquierda en móvil).

**Movimiento (relativo a la escena)**

| Fotogramas | Qué pasa | Curva |
|---|---|---|
| 0 | Estado `CAOS_POSTER` | |
| 10-16 | Pósit: opacidad 0 → 1 | `ease.out` |
| 10-30 | Pósit: `caida` 0 → 1. Desplazamiento vertical desde `LAYOUT.posit.caida.dy` (−100 escritorio, −120 móvil) hasta 0, y giro desde `caida.giro` (11° escritorio, −10° móvil) hasta el giro de reposo (5° y −4°). Sombra de `sombra.piezaAlzada` a `sombra.pieza` (se interpolan desplazamiento, desenfoque y alfa) | `ease.out` |
| 0-59 | Respiración (5.5): chat `k=1, signo −1`, hoja `k=2, signo +1`, nota `k=1, signo +1` (solo escritorio). El pósit no respira en S1 | seno |
| 30-59 | Quietud salvo la respiración. Se lee el pósit | |

**Textos en pantalla y lectura** (0,3 s = 9 f por palabra, desde que el texto está entero)

| Texto literal | Palabras | Mínimo | Entero desde (global) | Visible hasta (global) | Cumple |
|---|---|---|---|---|---|
| «Lunes, 9:00» | 2 | 18 f | 0 | 190 | Sí |
| «¿Tenéis hueco» / «el jueves a las 19?» | 7 | 63 f | 0 | 202 | Sí |
| «9:02» (solo escritorio) | textura | | 0 | 202 | |
| «Lo miramos y te decimos» | 5 | 45 f | 0 | 202 | Sí |
| Hoja: «Cliente», «Día», «Pagado», «lunes», «martes», «sí», «¿?» | textura | | 0 | 202 | |
| Pestañas «Cobros», «Stock», «Stock 2», «Stock final» (móvil sin «Stock 2») | 6 | 54 f | 0 | 202 | Sí |
| «Pedido pendiente» / «¿quién lo pidió?» (solo escritorio) | 5 | 45 f | 0 | 202 | Sí |
| «Avisar al» / «cliente» / «¡hoy!» | 4 | 36 f | 30 | 202 | Sí |

**Maquetación.** Todas las cajas en `LAYOUT.*` (5.3). Resumen:

| Elemento | Escritorio 1280×1080 | Móvil 960×900 |
|---|---|---|
| Rótulo | caja 88, 80, 250×52 · Mono 28 tinta-2 | caja 32, 32, 314×64 · Mono 36 tinta-2 |
| Grupo chat (giro −2°) | caja 88, 164, 540×352, centro 358, 340 · Schibsted 32/400 | caja 32, 104, 680×380, centro 372, 294 · 40/400 |
| Hoja (giro 3°) | caja 676, 124, 560×300, centro 956, 274 · 28 (cabeceras 600) | caja 384, 516, 544×340, centro 656, 686 · 36 |
| Nota (giro −5°) | caja 110, 664, 380×250 · cursiva 34/450 | no existe |
| Pósit posado | caja 880, 624, 300×290, giro 5° · cursiva 38, «¡hoy!» 600 | caja 32, 540, 320×300, giro −4° · cursiva 44 |

Extensiones reales con el giro (comprobadas): escritorio chat x 82-634 · y 155-525, hoja x 668-1244 · y 110-438, nota x 100-500 · y 648-930, pósit x 868-1192 · y 612-927. Móvil chat x 26-718 · y 92-496, hoja x 376-937 · y 502-870, pósit x 22-362 · y 529-851. Ningún par se solapa (el más justo: pósit y hoja en móvil, a 14 px).

**Entrada y salida.** Entra por corte desde el póster (f0 = póster). Sale en reposo: la escena S2 arranca sin ningún cambio.

**Estado en f0** = `CAOS_POSTER`: rótulo visible, pregunta y respuesta visibles, hoja con la selección en la celda «¿?» (Pagado, fila 2), nota visible (escritorio), pósit invisible (`opacidad 0`, `caida 0`), sin cursor, sin selección de texto, sin tecleo, sin «escribiendo», sin mensaje nuevo, respiración 0.

**Estado en f59** = `CAOS_FIN_S1`: igual que f0 pero con el pósit posado (`opacidad 1`, `caida 1`, giro de reposo, sombra `pieza`). Respiración 0 (sen(πk) = 0).

---

### S2 · `copiar-a-mano` (global 60-189, 130 f)

**Qué se ve.** Un cursor entra, arrastra para seleccionar «el jueves a las 19» en la pregunta, va a la hoja, hace clic en la celda vacía de «Día» de la tercera fila y teclea «jueves 19» a ritmo humano. Después el cliente escribe (tres puntos) e insiste: «¿Al final hay hueco?». Pico del caos. Mientras el cursor trabaja, chat y hoja están quietos. La nota y el pósit respiran.

**Movimiento (relativo a la escena)**

| Fotogramas | Qué pasa | Curva |
|---|---|---|
| 0-16 | Cursor de `cursor.inicioS2` (fuera del lienzo, abajo al centro) a `selIni` | `ease.inOut` |
| 18-30 | Arrastre: el cursor va de `selIni` a `selFin` y el resalte cobalto-100 crece de izquierda a derecha con el mismo progreso (`seleccionChat.progreso` 0 → 1), por detrás del texto | `ease.inOut` |
| 32-46 | Cursor de `selFin` a `celda` | `ease.inOut` |
| 46 | Clic: `pressScale(frame, 46)` en el cursor | |
| 46-52 | El marco de selección de la hoja salta de la celda «¿?» a la celda destino (`seleccionHoja` 0 → 1, se interpolan x, y, ancho y alto del marco). «¿?» sigue en 600 sin marco | `ease.inOut` |
| 48-54 | Cursor: opacidad 1 → 0 | `ease.inOut` |
| 50 | Aparece el cursor de texto (caret) | corte |
| 52, 55, 57, 61, 63, 66, 69, 72, 75 | Tecleo: en cada uno de estos fotogramas aparece un carácter de «jueves 19» (j, u, e, v, e, s, espacio, 1, 9). En f75 está completo | corte |
| 50-84 | Caret encendido fijo | |
| 84-99 apagado, 99-114 encendido, 114-129 apagado | Parpadeo del caret. En f129 está APAGADO | corte |
| 76-84 | El resalte del chat se funde (`seleccionChat.opacidad` 1 → 0) | `ease.inOut` |
| 80-92 | Burbuja «escribiendo»: opacidad 0 → 1 y `entrada` 0 → 1 (desplazamiento +12 → 0 y escala 0,96 → 1, origen abajo a la izquierda) | `ease.out` |
| 80-96 | Puntos: opacidad del punto i = 0,3 + 0,7 × (0,5 − 0,5·cos(2π·(f − 80 − 4i)/18)) | función de f |
| 92-96 | Burbuja «escribiendo»: opacidad 1 → 0 | `ease.inOut` |
| 94-100 | Mensaje nuevo: opacidad 0 → 1 | `ease.out` |
| 94-104 | Mensaje nuevo: `entrada` 0 → 1 (+12 → 0, escala 0,96 → 1, origen abajo a la izquierda) | `ease.out` |
| 104-129 | Quietud (pico del caos). Se lee «¿Al final hay hueco?» | |
| 0-129 | Respiración: nota `k=2, signo +1` (escritorio), pósit `k=2, signo −1`. Chat y hoja a 0 | seno |

**Puntos del cursor** (punta de la flecha). Se calculan SIEMPRE con `aGlobal()` (5.5) a partir de `LAYOUT`. Valores de control:

| Punto | Local | Escritorio (global) | Móvil (global) |
|---|---|---|---|
| `inicioS2` | | 640, 1120 | 480, 960 |
| `selIni` | pregunta: `seleccion.x0`, centro vertical de la selección | 112,9 · 256,5 | 61,1 · 216,8 |
| `selFin` | pregunta: `seleccion.x1`, mismo centro | 357,3 · 248,0 | 366,5 · 206,1 |
| `celda` | hoja: centro de la celda Día de la fila 3 (310, 222 · 289, 254) | 982,2 · 347,5 | 668,6 · 770,8 |

**Textos en pantalla y lectura**

| Texto literal | Palabras | Mínimo | Entero desde (global) | Visible hasta (global) | Cumple |
|---|---|---|---|---|---|
| «jueves 19» (tecleado) | 2 | 18 f | 135 | 202 | Sí (67 f) |
| «¿Al final hay hueco?» | 4 | 36 f | 164 | 202 | Sí (38 f) |
| «9:41» (solo escritorio) | textura | | 164 | 202 | |

**Maquetación**

| Elemento | Escritorio | Móvil |
|---|---|---|
| Resalte de copia (local a la pregunta) | x 28 → 272,5 · y 64 · alto 40 · radio 4 · cobalto-100 | x 32 → 337,6 · y 80 · alto 44 · radio 5 |
| Burbuja «escribiendo» (local al grupo) | 0, 268, 128×84 · puntos de 14 en x 39/64/89, y 42 · tinta-3 | 0, 288, 152×92 · puntos de 16 en x 46/76/106, y 46 |
| Mensaje nuevo (local al grupo) | 0, 268, 440×84 · 32/400 · hora «9:41» Mono 28 tinta-3 a 24 del borde derecho | 0, 288, 432×92 · 40/400 · sin hora |
| Celda destino (local a la hoja) | col 1 (x 210, ancho 200) · fila 3 (y 196, alto 52) | col 1 (x 194, ancho 190) · fila 3 (y 224, alto 60) |
| Texto tecleado | x celda + 16 · 28/400 tinta · ancho final 118 | x celda + 16 · 36/400 · ancho final 152 |
| Caret | 3×32 tinta, pegado al texto (va en línea tras el `<span>` del texto) | 4×42 |
| Marco de selección | trazo 3 cobalto + tirador 10×10 cobalto en la esquina inferior derecha | trazo 4 + tirador 12 |
| Cursor | flecha 40×56 | la misma a escala 1,3 (52×72) |

**Entrada y salida.** Entra desde `CAOS_FIN_S1` sin ningún cambio (el cursor empieza fuera del lienzo). Sale en reposo en `CAOS_FIN_S2`.

**Estado en f0** = `CAOS_FIN_S1` + cursor en `inicioS2` (fuera del lienzo, invisible).

**Estado en f129** = `CAOS_FIN_S2`: rótulo visible, pregunta, respuesta y mensaje nuevo visibles, resalte de copia a opacidad 0, marco de selección en la celda destino, «jueves 19» completo, caret APAGADO, «escribiendo» a opacidad 0, cursor a opacidad 0, respiración 0 en todas las piezas.

---

### S3 · `todo-en-una-app` (global 190-319, 130 f)

**Qué se ve.** Sale el rótulo. El texto de todas las piezas se funde a la vez y quedan sus siluetas (burbujas, rejilla y pestañas, papel dentado con renglones, pósit con su banda). Por debajo entra la ventana «Hoy» con su cromo completo, cuatro huecos punteados (tres en móvil) y el chip «□ Por revisar». El glifo de la barra de título se monta por partes. Cada silueta vuela a la baldosa de su fila, encogiendo, y la fila se revela con su título, su origen y su estado.

**Movimiento (relativo a la escena)**

| Fotogramas | Qué pasa | Curva |
|---|---|---|
| 0-10 | Rótulo: opacidad 1 → 0 y desplazamiento 0 → −10 | `ease.inOut` |
| 12-24 | `contenido` 1 → 0 en todas las piezas: textos, horas, ✓✓, barras grises, selección de la hoja, texto tecleado, texto de las pestañas, garabatos y subrayado. Quedan formas, rejilla, bandas, renglones y sombras | `ease.inOut` |
| 22-32 | Ventana: opacidad 0 → 1 | `ease.out` |
| 22-46 | Ventana: `entrada` 0 → 1 (escala 0,98 → 1 y desplazamiento +`ventana.entradaDy` → 0: 24 en escritorio y 8 en móvil, origen en el centro de la ventana. Montaje: con +24 en móvil el borde inferior bajaba hasta 899 y la sombra se cortaba contra el lienzo; con 8 nunca baja de su posición de reposo). Entra con cromo, barra lateral, «Hoy», subtítulo, chip «□ Por revisar» y huecos punteados. Está SIEMPRE por debajo de las piezas | `ease.out` |
| 32-40 | Glifo: barra `scaleX` 0 → 1 desde la izquierda | `ease.out` |
| 36-46 | Glifo: cuadrado hueco se traza (`pathLength = 1`, `strokeDashoffset` 1 → 0) | `ease.inOut` |
| 42-52 | Glifo: cuadrado cobalto crece desde su centro (escala 0 → 1) | `ease.out` |
| 36-66 | Vuelo del chat → baldosa de «reserva» | p lineal, el kit aplica `ease.inOut` |
| 46-76 | Vuelo de la hoja → baldosa de «cobros» | idem |
| 56-86 | Vuelo de la nota → baldosa de «pedido» (solo escritorio) | idem |
| 66-96 | Vuelo del pósit → baldosa de «aviso» (en los dos cortes) | idem |
| L−6 a L | Baldosa de la fila: opacidad 0 → 1 (L = fin del vuelo: 66, 76, 86, 96) | lineal |
| L a L+8 | Superficie de la fila (blanco con filete de 2) 0 → 1. El hueco punteado baja a la vez (opacidad = 1 − superficie) | `ease.out` |
| L+2 a L+14 | Título y origen se descubren de izquierda a derecha (`clipPath: inset(0 X% 0 0)`) | `ease.out` |
| L+6 a L+14 | Marca: «cobros» y «pedido» crecen como ■ desde el centro. «aviso» traza su □. «reserva» hace aparecer el botón «Confirmar» (opacidad) | `ease.out` (trazo con `ease.inOut`) |
| L+8 a L+16 | Texto de estado inicial: opacidad 0 → 1 y desplazamiento x +8 → 0 («Al día», «Recibido», «Pendiente») | `ease.out` |
| 112-129 | Quietud. Todas las filas legibles | |

**Vuelo** (kit, `vuelo()` en 5.5): centro de la pieza → centro de la baldosa con `ease.inOut`, escala geométrica de 1 a `lado / max(w, h)`, giro → 0, silueta a opacidad 1 hasta p = 0,8 y a 0 en p = 1. Tamaños de control:

| Pieza → fila | Escritorio: origen → destino, escala final, lado a mitad de vuelo | Móvil |
|---|---|---|
| Chat → reserva | (358, 340) → (436, 392) · 0,1185 · 145 px | (372, 294) → (120, 346) · 0,1176 · 181 px |
| Hoja → cobros | (956, 274) → (436, 528) · 0,1143 · 147 px | (656, 686) → (120, 510) · 0,1471 · 167 px |
| Nota → pedido | (300, 789) → (436, 664) · 0,1684 · 127 px | no existe |
| Pósit → aviso | (1030, 769) → (436, 800) · 0,2133 · 116 px | (192, 690) → (120, 674) · 0,25 · 136 px |

En p = 0,8 (inicio del fundido) todas las siluetas miden entre 67 y 85 px, es decir 1,05× la baldosa: el relevo silueta → baldosa no deja doble exposición.

**Estados de las filas al aterrizar**

| Fila | Icono | Título escritorio / móvil | Origen | Estado al aterrizar |
|---|---|---|---|---|
| reserva | chat | «Reserva, jueves 19:00» / «Reserva del jueves» | «Antes, en un mensaje» | botón «Confirmar» (blanco, contorno cobalto) |
| cobros | hoja | «Cobros de la semana» | «Antes, en una hoja de cálculo» | ■ «Al día» |
| pedido (solo escritorio) | papel | «Pedido de material» | «Antes, en un papel» | ■ «Recibido» |
| aviso | pósit | «Aviso al cliente» | «Antes, en un pósit» | □ «Pendiente» |

**Textos en pantalla y lectura**

| Texto literal | Palabras | Mínimo | Entero desde (global) | Visible hasta (global) | Cumple |
|---|---|---|---|---|---|
| «Hoy», «Lunes · Actualizado ahora» | 4 | 36 f | 222 | final | Sí |
| Menú «Hoy», «Reservas», «Cobros», «Stock», «Pedidos» (escritorio) | 5 | 45 f | 222 | final | Sí |
| «Por revisar» | 2 | 18 f | 222 | 466 | Sí |
| Fila reserva: título + origen | 7 (4 en móvil + 4) | 63 f | 270 | final | Sí |
| «Confirmar» | 1 | 9 f | 270 | 356 | Sí (86 f) |
| Fila cobros: título + origen + «Al día» | 12 | 108 f | 282 | final | Sí |
| Fila pedido (escritorio) | 9 | 81 f | 292 | final | Sí |
| Fila aviso: título + origen | 7 | 63 f | 300 | final | Sí |
| «Pendiente» | 1 | 9 f | 302 | 390 | Sí (88 f) |

**Maquetación.** Ventana, cabecera, barra lateral, filas y baldosas: `LAYOUT.ventana`, `glifo`, `direccion`, `lateral`, `cabecera`, `filas` (5.3). Resumen:

| Elemento | Escritorio | Móvil |
|---|---|---|
| Ventana | 88, 96, 1104×888 · radio 28 · borde 2 filete-2 · barra de título 80 | 16, 16, 928×868 · radio 34 · borde 2 · barra 88 |
| Glifo | barra 22×6 en x 128 · □ 22 trazo 4 en x 160 · ■ 22 en x 192 · centro y 136 | barra 28×8 en x 56 · □ 28 trazo 5 en x 96 · ■ 28 en x 136 · centro y 60 |
| «Hoy» | x 380, caja y 204 alto 64 · 60/560 | x 56, caja y 128 alto 72 · 64/560 |
| Subtítulo | x 380, y 272, alto 36 · 28/400 tinta-3 | x 56, y 204, alto 44 · 36/400 tinta-3 |
| Chip | 940, 212, 220×48 · □ 20 trazo 3 en x 960 · texto 28/600 en x 992 | 626, 132, 278×64 · □ 26 trazo 4 en x 650 · texto 36/600 en x 690 |
| Filas | x 380, ancho 780, alto 120, arriba en 332/468/604/740 · radio 20 | x 56, ancho 848, alto 148, arriba en 272/436/600 · radio 24 |
| Baldosa | x 404, y fila+28, 64×64 | x 80, y fila+34, 80×80 |
| Título / origen | x 492 · 34/600 (caja y+18, alto 44) / 28/400 tinta-3 (caja y+66, alto 36) | x 184 · 42/600 (y+22, alto 52) / 36/400 (y+78, alto 48) |
| Columna de estado | ■/□ 22 en x 938 · texto 30/500 tinta-2 en x 972 (caja y+20, alto 40) | ■/□ 28 en x 643 · texto 36/500 en x 683 (y+26, alto 44) |
| Botón «Confirmar» | 952, fila+34, 184×52 · radio 16 · contorno 3 cobalto · 28/600 cobalto | 648, fila+42, 232×64 · radio 20 · contorno 4 · 36/600 |

**Entrada y salida.** Entra desde `CAOS_FIN_S2` (el rótulo y los textos siguen enteros en f0 y f11). Sale en `APP_FIN_S3`, sin caos.

**Estado en f0** = `CAOS_FIN_S2` + `APP_OCULTA` (ventana a opacidad 0).

**Estado en f129** = `APP_FIN_S3`: ventana entera y quieta, glifo montado, chip «□ Por revisar» (fondo pastilla), filas reveladas con los estados de la tabla, huecos punteados a 0, sin piezas (vuelo 1, silueta a 0), sin rótulo, sin cursor, sin señal, sin aviso.

---

### S4 · `un-clic` (global 320-449, 130 f)

**Qué se ve.** El cursor entra y pulsa «Confirmar» en la reserva. El botón se convierte en ■ «Confirmada» y la fila se tiñe. El cursor se retira. Un trazo de señal cobalto baja por el canal izquierdo desde la reserva hasta «Aviso al cliente», que se llena solo: □ «Pendiente» → ■ «Enviado». Debajo de la última fila aparece «Aviso enviado al cliente». Los tintes vuelven a blanco.

**Movimiento (relativo a la escena)**

| Fotogramas | Qué pasa | Curva |
|---|---|---|
| 0-22 | Cursor de `cursor.inicioS4` a `cursor.clicS4` | `ease.inOut` |
| 22-28 | Hover: fondo del botón blanco → cobalto-50 (`boton.fondo` 0 → 1) | `ease.out` |
| 28 | Clic: `pressScale(frame, 28)` en el cursor | |
| 28-32 / 32-36 | Fondo del botón cobalto-50 → cobalto-100 → cobalto-50 (`fondo` 1 → 2 → 1). El botón NO se escala | `ease.out` |
| 28-40 | Onda cuadrada: rectángulo con el radio del botón, inflado de 0 a `filas.onda` (14 / 16), trazo cobalto (3 / 4), opacidad 0,6 → 0 (0,6·(1 − progreso)). Desde f40, onda a 0 | `ease.inOut` |
| 36-42 | Botón: opacidad 1 → 0 | `ease.inOut` |
| 36-44 | Tinte de la fila reserva 0 → 1 (fondo blanco → cobalto-50, borde filete → cobalto-100) | `ease.out` |
| 42-52 | ■ de la reserva crece desde el centro (`relleno` 0 → 1) | `ease.out` |
| 46-54 | «Confirmada»: opacidad 0 → 1 y x +8 → 0 | `ease.out` |
| 40-60 | Cursor se retira de `clicS4` a `retiroS4` (+40, +40) y su opacidad baja 1 → 0 | `ease.out` |
| 50-70 | Señal: `cabeza` 0 → 1 (se traza desde la reserva hacia abajo) | `ease.inOut` |
| 70-82 | Señal: `cola` 0 → 1 (se borra desde arriba, se lee como algo que viaja) | `ease.inOut` |
| 70-78 | Tinte de la fila aviso 0 → 1 | `ease.out` |
| 70-80 | ■ del aviso crece desde el centro dentro del □ (`relleno` 0 → 1) | `ease.out` |
| 70-75 | «Pendiente»: opacidad 1 → 0 | `ease.inOut` |
| 75-84 | «Enviado»: opacidad 0 → 1 y x +8 → 0 | `ease.out` |
| 84-96 | Aviso «Aviso enviado al cliente»: opacidad 0 → 1 y desplazamiento +16 → 0 | `ease.out` |
| 98-118 | Tintes de reserva y aviso 1 → 0 | `ease.inOut` |
| 118-129 | Quietud con el aviso en pantalla | |

**Puntos del cursor**: escritorio `inicioS4` 1250, 1120 (fuera) → `clicS4` 1030, 406 (dentro del botón 952-1136 × 366-418) → `retiroS4` 1070, 446. Móvil 1000, 960 (fuera) → 750, 362 (dentro del botón 648-880 × 314-378) → 790, 402. Montaje: la punta baja 8 px (escritorio) y 12 px (móvil) respecto a la primera versión (398 y 350) para quedar bajo la línea base de «Confirmar» y no tapar la palabra durante el clic.

**Señal** (SVG con `pathLength = 1`, `strokeDasharray = "${cabeza − cola} 1"`, `strokeDashoffset = −cola`, trazo cobalto, remate recto):
- Escritorio: `M380 392 H364 V800 H380`, trazo 4 (de la mitad de la reserva a la mitad del aviso por el canal entre la barra lateral y las filas).
- Móvil: `M56 346 H36 V674 H56`, trazo 5.

**Textos en pantalla y lectura**

| Texto literal | Palabras | Mínimo | Entero desde (global) | Visible hasta (global) | Cumple |
|---|---|---|---|---|---|
| «Confirmada» | 1 | 9 f | 374 | final | Sí |
| «Enviado» | 1 | 9 f | 404 | final | Sí |
| «Aviso enviado al cliente» | 4 | 36 f | 416 | 454 | Sí (38 f) |

**Maquetación del aviso**: escritorio 560, 890, 420×56, radio 28, fondo cobalto-50, borde 2 cobalto-100, ■ 20 cobalto en x 584, texto 30/600 cobalto-600 en x 616 (ancho 337, acaba en 953). Móvil 224, 784, 512×68, radio 34, ■ 26 en x 252, texto 36/600 en x 292 (ancho 405, acaba en 697). En los dos cortes queda centrado en la columna de contenido y a más de 30 px de la última fila y del borde de la ventana.

**Entrada y salida.** Entra desde `APP_FIN_S3` con el cursor fuera del lienzo. Sale en `APP_FIN_S4`.

**Estado en f0** = `APP_FIN_S3` + cursor en `inicioS4` (invisible).

**Estado en f129** = `APP_FIN_S4`: reserva ■ «Confirmada» sin botón, aviso ■ «Enviado», tintes a 0, señal borrada (cabeza 1, cola 1), aviso «Aviso enviado al cliente» visible y asentado, chip «□ Por revisar», cursor a opacidad 0.

---

### S5 · `todo-al-dia` (global 450-539, 90 f)

**Qué se ve.** Sale el aviso. El chip de la cabecera cambia: «Por revisar» se va, su cuadrado se llena de cobalto, el fondo pasa a cobalto-50 y entra «Todo al día» en cobalto. Después, quietud total: es el fotograma final.

**Movimiento (relativo a la escena)**

| Fotogramas | Qué pasa | Curva |
|---|---|---|
| 0-4 | Nada (el aviso cumple su lectura) | |
| 4-14 | Aviso: opacidad 1 → 0 y desplazamiento 0 → +12 | `ease.inOut` |
| 16-22 | «Por revisar»: opacidad 1 → 0 | `ease.inOut` |
| 16-28 | Fondo del chip pastilla → cobalto-50 (`mix`) | `ease.out` |
| 20-30 | Cuadrado del chip: `relleno` 0 → 1 desde el centro | `ease.out` |
| 24-34 | «Todo al día» en cobalto 600: opacidad 0 → 1 y x +8 → 0 | `ease.out` |
| 34-89 | Quietud absoluta: 56 fotogramas idénticos | |

**Textos en pantalla y lectura**

| Texto literal | Palabras | Mínimo | Entero desde (global) | Visible hasta | Cumple |
|---|---|---|---|---|---|
| «Todo al día» | 3 | 27 f | 484 | final y congelado | Sí |

**Maquetación.** Chip de `LAYOUT.cabecera.chip`: el cuadrado no se mueve al cambiar el texto (columna fija a la izquierda del chip). «Por revisar» mide 148 / 190 y «Todo al día» 146 / 188: caben en el mismo chip.

**Entrada y salida.** Entra desde `APP_FIN_S4`. Termina en `APP_FINAL`, que es el fotograma 539 y la imagen fija.

**Estado en f0** = `APP_FIN_S4`. **Estado en f34 a f89** = `APP_FINAL` (sección 6).

---

## 5. Kit común

### 5.1 Ficheros y dueños (para trabajar en paralelo sin pisarse)

Orden de trabajo: primero el agente del kit escribe los contratos (`timeline.ts`, `layout.ts`, `textos.ts`, `kit/estados.ts`) tal cual están en este plan y los componentes. Después cinco agentes, uno por escena, escriben SOLO su fichero de `src/scenes/`. Una escena no dibuja nada a mano: calcula el estado de cada fotograma y llama a `<Caos/>`, `<App/>` y `<Cursor/>`.

| Fichero | Dueño | Contenido |
|---|---|---|
| `src/index.ts` | kit | `registerRoot(RemotionRoot)` |
| `src/Root.tsx` | kit | `<Composition id="HeroEscritorio" width={1280} height={1080}>` y `<Composition id="HeroMovil" width={960} height={900}>`, las dos con `fps={30}`, `durationInFrames={540}` y `component={Hero}` |
| `src/Hero.tsx` | kit | `AbsoluteFill` con `background: color.bg` y `WebkitFontSmoothing: "antialiased"`, `FontGate` y `<Series>` que recorre `ESCENAS`: cada una en `<Series.Sequence durationInFrames={d}><SceneProvider durationInFrames={d}><Componente/></SceneProvider></Series.Sequence>` |
| `src/timeline.ts` | kit | `ESCENAS`, `TOTAL`, `T` y `RESPIRA` (5.2) |
| `src/layout.ts` | kit | `LAYOUT`, tipos, `useLayout()` (5.3) |
| `src/textos.ts` | kit | `TEXTOS` y `FILAS` (5.3) |
| `src/kit/estados.ts` | kit | Estados de traspaso (5.4) |
| `src/kit/geom.ts` | kit | `aGlobal`, `centroCaja`, `respira`, `vuelo`, `baldosa` (5.5) |
| `src/kit/caos/*.tsx` | kit | `Rotulo`, `Burbuja`, `GrupoChat`, `Hoja`, `NotaPapel`, `Posit`, `Caos` |
| `src/kit/app/*.tsx` | kit | `Ventana`, `Glifo`, `ChipEstado`, `Fila`, `Marca`, `IconoOrigen`, `Senal`, `Toast`, `Onda`, `App` |
| `src/kit/Cursor.tsx` | kit | `Cursor` |
| `src/scenes/LunesNueve.tsx` | escena S1 | |
| `src/scenes/CopiarAMano.tsx` | escena S2 | |
| `src/scenes/TodoEnUnaApp.tsx` | escena S3 | |
| `src/scenes/UnClic.tsx` | escena S4 | |
| `src/scenes/TodoAlDia.tsx` | escena S5 | |

Todo se dibuja con `div` absolutos y SVG en línea, en px de composición. Nada en %, rem ni vw. Los textos usan `{...textStyle(size, peso, color), lineHeight: \`${h}px\`, whiteSpace: "nowrap"}` (o `displayStyle`, `handStyle`, `monoStyle`) dentro de una caja de alto `h`, así el texto queda centrado en su caja sin depender de métricas.

### 5.2 `src/timeline.ts`

```ts
export const ESCENAS = [
  {id: "lunes-nueve", inicio: 0, duracion: 60},
  {id: "copiar-a-mano", inicio: 60, duracion: 130},
  {id: "todo-en-una-app", inicio: 190, duracion: 130},
  {id: "un-clic", inicio: 320, duracion: 130},
  {id: "todo-al-dia", inicio: 450, duracion: 90},
] as const
export const TOTAL = 540

// Fotogramas RELATIVOS a cada escena. [a, b] = tween(frame, [a, b], ...)
export const T = {
  lunesNueve: {positOpacidad: [10, 16], positCaida: [10, 30]},
  copiarAMano: {
    cursorEntra: [0, 16], seleccion: [18, 30], cursorACelda: [32, 46], clic: 46,
    seleccionHoja: [46, 52], cursorSale: [48, 54],
    caretEncendido: [[50, 84], [99, 114]],
    tecleo: [52, 55, 57, 61, 63, 66, 69, 72, 75],
    resalteSale: [76, 84], escribiendoEntra: [80, 92], escribiendoSale: [92, 96], puntos: [80, 96],
    nuevoOpacidad: [94, 100], nuevoEntra: [94, 104],
  },
  todoEnUnaApp: {
    rotuloSale: [0, 10], contenidoSale: [12, 24],
    ventanaOpacidad: [22, 32], ventanaEntrada: [22, 46],
    glifoBarra: [32, 40], glifoHueco: [36, 46], glifoMacizo: [42, 52],
    vuelos: {chat: [36, 66], hoja: [46, 76], nota: [56, 86], posit: [66, 96]},
    // Revelado de la fila, relativo a L = fin del vuelo de su pieza
    fila: {baldosa: [-6, 0], superficie: [0, 8], texto: [2, 14], marca: [6, 14], estado: [8, 16]},
  },
  unClic: {
    cursorEntra: [0, 22], hover: [22, 28], clic: 28, press: [28, 32], suelta: [32, 36], onda: [28, 40],
    botonSale: [36, 42], tinteReserva: [36, 44], marcaReserva: [42, 52], confirmadaEntra: [46, 54],
    cursorSale: [40, 60], senalTraza: [50, 70], senalBorra: [70, 82],
    tinteAviso: [70, 78], marcaAviso: [70, 80], pendienteSale: [70, 75], enviadoEntra: [75, 84],
    toastEntra: [84, 96], tintesVuelven: [98, 118],
  },
  todoAlDia: {
    toastSale: [4, 14], porRevisarSale: [16, 22], chipFondo: [16, 28], chipRelleno: [20, 30], todoAlDiaEntra: [24, 34],
  },
} as const

// Respiración del caos: null = quieta
export const RESPIRA = {
  lunesNueve: {chat: {k: 1, signo: -1}, hoja: {k: 2, signo: 1}, nota: {k: 1, signo: 1}, posit: null},
  copiarAMano: {chat: null, hoja: null, nota: {k: 2, signo: 1}, posit: {k: 2, signo: -1}},
} as const
```

### 5.3 `src/layout.ts` y `src/textos.ts` (única fuente de verdad)

Coordenadas absolutas del lienzo salvo donde se dice «local» (relativas a la esquina superior izquierda de la caja de su pieza SIN girar). Cada pieza gira alrededor del centro de su caja. `useLayout()` devuelve `LAYOUT[useScene().corte]`.

```ts
export const LAYOUT = {
  escritorio: {
    W: 1280, H: 1080, filete: 2, respiracion: 3,
    sombra: {
      pieza: "0 8px 16px rgba(16,16,19,0.08)",
      piezaAlzada: "0 24px 36px rgba(16,16,19,0.10)",
      ventana: "0 24px 48px rgba(16,16,19,0.08)",
      cursor: "drop-shadow(0 2px 3px rgba(16,16,19,0.18))",
    },
    rotulo: {caja: {x: 88, y: 80, w: 250, h: 52}, padX: 26, size: 28},
    chat: {
      caja: {x: 88, y: 164, w: 540, h: 352}, giro: -2,
      radio: 28, radioCola: 6, padX: 28, size: 32, lineaH: 44,
      pregunta: {caja: {x: 0, y: 0, w: 420, h: 136}, lineasY: [18, 62], hora: {y: 68, h: 36, derecha: 24, size: 28}},
      respuesta: {caja: {x: 60, y: 156, w: 480, h: 84}, textoY: 20, checks: {x: 412, y: 30, w: 40, h: 24}},
      escribiendo: {caja: {x: 0, y: 268, w: 128, h: 84}, punto: 14, centrosX: [39, 64, 89], centroY: 42},
      nuevo: {caja: {x: 0, y: 268, w: 440, h: 84}, textoY: 20, hora: {y: 24, h: 36, derecha: 24, size: 28}},
      seleccion: {x0: 28, x1: 272.5, y: 64, h: 40, radio: 4},
    },
    hoja: {
      caja: {x: 676, y: 124, w: 560, h: 300}, giro: 3,
      banda: 40, numeros: 40, rejilla: 2,
      columnas: [{x: 40, w: 170}, {x: 210, w: 200}, {x: 410, w: 150}],
      filas: [{y: 40, h: 52}, {y: 92, h: 52}, {y: 144, h: 52}, {y: 196, h: 52}],
      padX: 16, size: 28, barras: [96, 80, 112], barraH: 12,
      seleccion: {trazo: 3, tirador: 10, inicio: {col: 2, fila: 2}, destino: {col: 1, fila: 3}},
      caret: {w: 3, h: 32},
      pestanas: {y: 248, h: 52, x0: 8, anchos: [128, 107, 130, 170], size: 28},
    },
    nota: {
      caja: {x: 110, y: 664, w: 380, h: 250}, giro: -5,
      diente: {w: 20, h: 10}, renglones: [84, 128, 172, 216], renglonX: [24, 356],
      lineas: [{x: 28, y: 36, h: 48}, {x: 28, y: 80, h: 48}], size: 34,
      garabatos: [{x: 28, y: 160, w: 200}, {x: 28, y: 204, w: 120}],
    },
    posit: {
      caja: {x: 880, y: 624, w: 300, h: 290}, giro: 5, banda: 40,
      lineas: [{x: 32, y: 64, h: 52}, {x: 32, y: 116, h: 52}, {x: 32, y: 176, h: 56}], size: 38,
      subrayado: {x0: 30, x1: 130, y: 230, trazo: 4},
      caida: {dy: -100, giro: 11},
    },
    cursor: {
      escala: 1,
      inicioS2: {x: 640, y: 1120},
      inicioS4: {x: 1250, y: 1120}, clicS4: {x: 1030, y: 398}, retiroS4: {x: 1070, y: 438},
    },
    ventana: {caja: {x: 88, y: 96, w: 1104, h: 888}, radio: 28, borde: 2, barraH: 80},
    glifo: {x: 128, cy: 136, barra: {w: 22, h: 6}, lado: 22, trazo: 4, gap: 10},
    direccion: {x: 500, y: 118, w: 280, h: 36},
    lateral: {
      caja: {x: 88, y: 178, w: 260, h: 804}, filete: 2,
      activo: {caja: {x: 108, y: 200, w: 220, h: 60}, radio: 20, marca: {x: 132, lado: 18}, textoX: 166},
      itemsCentroY: [290, 350, 410, 470], textoX: 132, lineaH: 44, size: 30,
    },
    cabecera: {
      hoy: {x: 380, y: 204, h: 64, size: 60},
      sub: {x: 380, y: 272, h: 36, size: 28},
      chip: {caja: {x: 940, y: 212, w: 220, h: 48}, radio: 20, padX: 20, marca: 20, trazo: 3, gap: 12, size: 28},
    },
    filas: {
      x: 380, w: 780, h: 120, tops: [332, 468, 604, 740], radio: 20, borde: 2, guion: [10, 10],
      baldosa: {dx: 24, dy: 28, lado: 64},
      titulo: {dx: 112, dy: 18, h: 44, size: 34},
      origen: {dx: 112, dy: 66, h: 36, size: 28},
      estado: {x: 938, dy: 20, h: 40, marca: 22, trazo: 3, gap: 12, size: 30},
      boton: {x: 952, dy: 34, w: 184, h: 52, radio: 16, borde: 3, size: 28},
      onda: 14,
    },
    senal: {x: 364, trazo: 4},
    toast: {caja: {x: 560, y: 890, w: 420, h: 56}, radio: 28, borde: 2, padX: 24, marca: 20, gap: 12, size: 30},
  },
  movil: {
    W: 960, H: 900, filete: 2, respiracion: 4,
    sombra: {
      pieza: "0 8px 18px rgba(16,16,19,0.08)",
      piezaAlzada: "0 24px 40px rgba(16,16,19,0.10)",
      ventana: "0 4px 8px rgba(16,16,19,0.06)",
      cursor: "drop-shadow(0 3px 4px rgba(16,16,19,0.18))",
    },
    rotulo: {caja: {x: 32, y: 32, w: 314, h: 64}, padX: 30, size: 36},
    chat: {
      caja: {x: 32, y: 104, w: 680, h: 380}, giro: -2,
      radio: 32, radioCola: 8, padX: 32, size: 40, lineaH: 52,
      pregunta: {caja: {x: 0, y: 0, w: 400, h: 156}, lineasY: [24, 76], hora: null},
      respuesta: {caja: {x: 96, y: 176, w: 584, h: 92}, textoY: 20, checks: {x: 508, y: 33, w: 44, h: 26}},
      escribiendo: {caja: {x: 0, y: 288, w: 152, h: 92}, punto: 16, centrosX: [46, 76, 106], centroY: 46},
      nuevo: {caja: {x: 0, y: 288, w: 432, h: 92}, textoY: 20, hora: null},
      seleccion: {x0: 32, x1: 337.6, y: 80, h: 44, radio: 5},
    },
    hoja: {
      caja: {x: 384, y: 516, w: 544, h: 340}, giro: 3,
      banda: 44, numeros: 44, rejilla: 2,
      columnas: [{x: 44, w: 150}, {x: 194, w: 190}, {x: 384, w: 160}],
      filas: [{y: 44, h: 60}, {y: 104, h: 60}, {y: 164, h: 60}, {y: 224, h: 60}],
      padX: 16, size: 36, barras: [104, 88, 120], barraH: 14,
      seleccion: {trazo: 4, tirador: 12, inicio: {col: 2, fila: 2}, destino: {col: 1, fila: 3}},
      caret: {w: 4, h: 42},
      pestanas: {y: 284, h: 56, x0: 8, anchos: [162, 132, 213], size: 36},
    },
    nota: null,
    posit: {
      caja: {x: 32, y: 540, w: 320, h: 300}, giro: -4, banda: 44,
      lineas: [{x: 36, y: 70, h: 58}, {x: 36, y: 128, h: 58}, {x: 36, y: 194, h: 62}], size: 44,
      subrayado: {x0: 34, x1: 146, y: 256, trazo: 5},
      caida: {dy: -120, giro: -10},
    },
    cursor: {
      escala: 1.3,
      inicioS2: {x: 480, y: 960},
      inicioS4: {x: 1000, y: 960}, clicS4: {x: 750, y: 350}, retiroS4: {x: 790, y: 390},
    },
    ventana: {caja: {x: 16, y: 16, w: 928, h: 868}, radio: 34, borde: 2, barraH: 88},
    glifo: {x: 56, cy: 60, barra: {w: 28, h: 8}, lado: 28, trazo: 5, gap: 12},
    direccion: {x: 360, y: 40, w: 240, h: 40},
    lateral: null,
    cabecera: {
      hoy: {x: 56, y: 128, h: 72, size: 64},
      sub: {x: 56, y: 204, h: 44, size: 36},
      chip: {caja: {x: 626, y: 132, w: 278, h: 64}, radio: 24, padX: 24, marca: 26, trazo: 4, gap: 14, size: 36},
    },
    filas: {
      x: 56, w: 848, h: 148, tops: [272, 436, 600], radio: 24, borde: 2, guion: [12, 12],
      baldosa: {dx: 24, dy: 34, lado: 80},
      titulo: {dx: 128, dy: 22, h: 52, size: 42},
      origen: {dx: 128, dy: 78, h: 48, size: 36},
      estado: {x: 643, dy: 26, h: 44, marca: 28, trazo: 4, gap: 12, size: 36},
      boton: {x: 648, dy: 42, w: 232, h: 64, radio: 20, borde: 4, size: 36},
      onda: 16,
    },
    senal: {x: 36, trazo: 5},
    toast: {caja: {x: 224, y: 784, w: 512, h: 68}, radio: 34, borde: 2, padX: 28, marca: 26, gap: 14, size: 36},
  },
} as const
```

**Cómo se lee cada bloque**
- `chat`: la pregunta y el mensaje nuevo son ENTRANTES (fondo blanco, borde 2 filete-2, esquina inferior izquierda con `radioCola`). La respuesta es SALIENTE y neutra (fondo `color.pastilla`, borde 2 filete-2, esquina inferior derecha con `radioCola`, ✓✓ en tinta-3 con trazo 3 y remate redondo: `M2 12l6 6 12-12M16 12l6 6 12-12` en una caja de 40×24, escalada a 44×26 en móvil). No hay colas dibujadas: la esquina casi recta hace de cola. Textos en `textStyle(size, 400, color.ink)`, a `padX` del borde izquierdo de su burbuja. La pregunta tiene dos líneas: «¿Tenéis hueco» en `lineasY[0]` y «el jueves a las 19?» en `lineasY[1]`, alto `lineaH`. La hora va alineada a la derecha, a `derecha` px del borde.
- `hoja`: borde 2 filete-2, fondo blanco. `banda` es una franja `color.pastilla` arriba, SIN letras. `numeros` es una columna `color.pastilla` a la izquierda desde la banda hasta el final de la fila 3, SIN números. Rejilla `color.celda` de 2 px en los bordes de columnas y filas. Fila 0 = cabeceras «Cliente», «Día», «Pagado» en 600. Filas 1 a 3: barra gris (`color.barra`, radio barraH/2, ancho `barras[i]`, centrada en vertical) en «Cliente», y en «Día» y «Pagado»: «lunes» · «sí», «martes» · «¿?» (600), y la fila 3 vacía hasta el tecleo. Marco de selección: rectángulo de trazo cobalto `trazo` alineado por dentro con los bordes de la celda, más un tirador cuadrado cobalto de `tirador` centrado en su esquina inferior derecha. Pestañas: franja `color.pastilla` desde `pestanas.y`, pestañas contiguas desde `x0` con los anchos dados. La primera («Cobros») es la activa: fondo blanco, filete-2 a los lados y abajo, texto 600 tinta. Las demás: texto 500 tinta-2 sobre la franja, separadas por filetes verticales de 2 px y 28 de alto (36 en móvil). Texto centrado en cada pestaña.
- `nota`: papel `color.papel` con borde superior dentado (dientes de `diente.w` × `diente.h`), borde 2 filete-2, renglones `color.renglon` de 2 px en las `y` dadas. Texto `handStyle(size, 450)`. Garabatos: trazo tinta-2 de 3 px, onda de 4 crestas (`M0 0c6-5 11 4 17 0s11-5 17 0 …` escalado al ancho).
- `posit`: fondo `color.postit`, banda superior `color.postit2` de alto `banda`, sin borde. Líneas en `handStyle(size, 450)` y la tercera («¡hoy!») en 600, subrayada a mano con trazo tinta de `subrayado.trazo`.
- `lateral`: fondo `color.bg`, filete de 2 a la derecha, recortado por el radio de la ventana. «Hoy» activo: píldora cobalto-50, ■ cobalto de 18 centrado en vertical, texto 30/600 cobalto. Resto: 30/400 tinta-2, SIN cuadrados.
- `filas`: superficie blanca, borde 2 `color.line`, radio. Hueco punteado: mismo rectángulo sin relleno, trazo 2 `color.line2`, `strokeDasharray` = `guion`. Baldosa = `IconoOrigen` a tamaño `lado`. Título en `textStyle(size, 600, ink)`, origen en `textStyle(size, 400, ink3)`, estado en `textStyle(size, 500, ink2)` a la derecha de su marca (x = `estado.x + estado.marca + estado.gap`). La marca y su texto están en una columna FIJA (`estado.x`), así el cuadrado no se mueve cuando cambia el texto.
- `toast`: píldora cobalto-50 con borde cobalto-100, ■ cobalto de `marca` centrado en vertical a `padX` del borde, texto `textStyle(size, 600, color.cobalt600)`.

**Anchos medidos** (fontTools sobre las woff2 del proyecto, con el interletraje de los tokens). El margen es lo que sobra dentro de su caja.

| Texto | Escritorio | Margen | Móvil | Margen |
|---|---|---|---|---|
| «el jueves a las 19?» | 261 (32) | 103 | 327 (40) | 41 |
| «Lo miramos y te decimos» | 368 (32) | ✓✓ en 412 | 460 (40) | ✓✓ en 508 |
| «¿Al final hay hueco?» | 294 (32) | hora en 344 | 368 (40) | 32 |
| «jueves 19» | 118 (28) | 66 en la celda | 152 (36) | 18 + caret |
| «Stock final» | 138 (28/500) | 16 por lado | 177 (36/500) | 18 por lado |
| «Pagado» | 100 (28/600) | 34 | 128 (36/600) | 16 |
| «Reserva, jueves 19:00» / «Reserva del jueves» | 351 (34/600), acaba en 843 | 95 hasta el estado | 378 (42/600), acaba en 562 | 81 |
| «Cobros de la semana» | 338, acaba en 830 | 108 | 417, acaba en 601 | 42 |
| «Antes, en una hoja de cálculo» | 377 (28), acaba en 869 | línea propia | 485 (36), acaba en 669 | línea propia |
| «Confirmada» | 164 (30/500), acaba en 1136 | 24 hasta el borde de la fila | 197 (36/500), acaba en 880 | 24 |
| «Por revisar» / «Todo al día» | 148 / 146 (28/600) | 20 | 190 / 188 (36/600) | 24 |
| «Aviso enviado al cliente» | 337 (30/600) | 27 | 405 (36/600) | 39 |
| «Lunes · Actualizado ahora» | 332 (28) | | 427 (36) | chip en 626 |

**`src/textos.ts`** (literales exactos, revisados en 7.4):

```ts
export const TEXTOS = {
  rotulo: "Lunes, 9:00",
  chat: {
    pregunta: ["¿Tenéis hueco", "el jueves a las 19?"],
    respuesta: "Lo miramos y te decimos",
    nuevo: "¿Al final hay hueco?",
    horaPregunta: "9:02",
    horaNuevo: "9:41",
  },
  hoja: {
    cabeceras: ["Cliente", "Día", "Pagado"],
    dia: ["lunes", "martes"],
    pagado: ["sí", "¿?"],
    tecleo: "jueves 19",
    pestanas: {escritorio: ["Cobros", "Stock", "Stock 2", "Stock final"], movil: ["Cobros", "Stock", "Stock final"]},
  },
  nota: ["Pedido pendiente", "¿quién lo pidió?"],
  posit: ["Avisar al", "cliente", "¡hoy!"],
  app: {
    cabecera: "Hoy",
    subtitulo: "Lunes · Actualizado ahora",
    menu: ["Hoy", "Reservas", "Cobros", "Stock", "Pedidos"],
    chip: {pendiente: "Por revisar", hecho: "Todo al día"},
    boton: "Confirmar",
    toast: "Aviso enviado al cliente",
  },
  filas: {
    reserva: {icono: "chat", titulo: {escritorio: "Reserva, jueves 19:00", movil: "Reserva del jueves"}, origen: "Antes, en un mensaje", inicial: null, final: "Confirmada"},
    cobros: {icono: "hoja", titulo: "Cobros de la semana", origen: "Antes, en una hoja de cálculo", inicial: "Al día", final: null},
    pedido: {icono: "papel", titulo: "Pedido de material", origen: "Antes, en un papel", inicial: "Recibido", final: null},
    aviso: {icono: "posit", titulo: "Aviso al cliente", origen: "Antes, en un pósit", inicial: "Pendiente", final: "Enviado"},
  },
} as const

export type FilaId = "reserva" | "cobros" | "pedido" | "aviso"
// Orden de las filas en cada corte: el índice elige LAYOUT.filas.tops[i]
export const FILAS = {escritorio: ["reserva", "cobros", "pedido", "aviso"], movil: ["reserva", "cobros", "aviso"]} as const
// Pieza que vuela a cada fila
export const PIEZA_DE_FILA = {reserva: "chat", cobros: "hoja", pedido: "nota", aviso: "posit"} as const
```

Las horas «9:02» y «9:41» solo se pintan en escritorio (`hora: null` en móvil).

### 5.4 `src/kit/estados.ts` (contratos de traspaso)

Las escenas pasan valores YA suavizados (salvo `vuelo`, que es progreso lineal y el kit le aplica `ease.inOut`). `dx` y `dy` en px.

```ts
export interface CaosEstado {
  rotulo: {opacidad: number, dy: number}
  respira: {chat: number, hoja: number, nota: number, posit: number}   // dy en px, de respira()
  contenido: number                                                   // 1 textos visibles, 0 solo siluetas
  posit: {opacidad: number, caida: number}                            // caida 0 arriba, 1 posado
  seleccionChat: {progreso: number, opacidad: number}
  seleccionHoja: number                                               // 0 en «¿?», 1 en la celda destino
  tecleo: {caracteres: number, caret: number}                         // 0 a 9, caret 0 o 1
  escribiendo: {opacidad: number, entrada: number, fase: number}      // fase = frame relativo de S2
  nuevo: {opacidad: number, entrada: number}
  vuelo: {chat: number, hoja: number, nota: number, posit: number}    // progreso LINEAL 0 a 1
}

export const CAOS_POSTER: CaosEstado = {
  rotulo: {opacidad: 1, dy: 0}, respira: {chat: 0, hoja: 0, nota: 0, posit: 0}, contenido: 1,
  posit: {opacidad: 0, caida: 0}, seleccionChat: {progreso: 0, opacidad: 0}, seleccionHoja: 0,
  tecleo: {caracteres: 0, caret: 0}, escribiendo: {opacidad: 0, entrada: 0, fase: 0},
  nuevo: {opacidad: 0, entrada: 0}, vuelo: {chat: 0, hoja: 0, nota: 0, posit: 0},
}
export const CAOS_FIN_S1: CaosEstado = {...CAOS_POSTER, posit: {opacidad: 1, caida: 1}}
export const CAOS_FIN_S2: CaosEstado = {
  ...CAOS_FIN_S1,
  seleccionChat: {progreso: 1, opacidad: 0}, seleccionHoja: 1,
  tecleo: {caracteres: 9, caret: 0}, escribiendo: {opacidad: 0, entrada: 1, fase: 96},
  nuevo: {opacidad: 1, entrada: 1},
}

export interface FilaEstado {
  baldosa: number, superficie: number, texto: number
  dibujo: number                  // trazo del □ (0 a 1)
  relleno: number                 // ■ que crece desde el centro (0 a 1)
  inicial: {opacidad: number, dx: number}
  final: {opacidad: number, dx: number}
  boton: {opacidad: number, fondo: number}   // fondo 0 blanco, 1 cobalto-50, 2 cobalto-100
  tinte: number
}
export interface AppEstado {
  ventana: {opacidad: number, entrada: number}
  glifo: {barra: number, hueco: number, macizo: number}
  chip: {dibujo: number, relleno: number, fondo: number, pendiente: number, hecho: {opacidad: number, dx: number}}
  filas: Record<FilaId, FilaEstado>
  senal: {cabeza: number, cola: number}
  toast: {opacidad: number, dy: number}
  onda: number                    // 0 a 1, solo S4
}

const FILA_OCULTA: FilaEstado = {
  baldosa: 0, superficie: 0, texto: 0, dibujo: 0, relleno: 0,
  inicial: {opacidad: 0, dx: 8}, final: {opacidad: 0, dx: 8}, boton: {opacidad: 0, fondo: 0}, tinte: 0,
}
const FILA_REVELADA = {...FILA_OCULTA, baldosa: 1, superficie: 1, texto: 1}

export const APP_OCULTA: AppEstado = {
  ventana: {opacidad: 0, entrada: 0}, glifo: {barra: 0, hueco: 0, macizo: 0},
  chip: {dibujo: 1, relleno: 0, fondo: 0, pendiente: 1, hecho: {opacidad: 0, dx: 8}},
  filas: {reserva: FILA_OCULTA, cobros: FILA_OCULTA, pedido: FILA_OCULTA, aviso: FILA_OCULTA},
  senal: {cabeza: 0, cola: 0}, toast: {opacidad: 0, dy: 16}, onda: 0,
}
export const APP_FIN_S3: AppEstado = {
  ...APP_OCULTA,
  ventana: {opacidad: 1, entrada: 1}, glifo: {barra: 1, hueco: 1, macizo: 1},
  filas: {
    reserva: {...FILA_REVELADA, boton: {opacidad: 1, fondo: 0}},
    cobros: {...FILA_REVELADA, relleno: 1, inicial: {opacidad: 1, dx: 0}},
    pedido: {...FILA_REVELADA, relleno: 1, inicial: {opacidad: 1, dx: 0}},
    aviso: {...FILA_REVELADA, dibujo: 1, inicial: {opacidad: 1, dx: 0}},
  },
}
export const APP_FIN_S4: AppEstado = {
  ...APP_FIN_S3,
  filas: {
    ...APP_FIN_S3.filas,
    reserva: {...FILA_REVELADA, relleno: 1, final: {opacidad: 1, dx: 0}, boton: {opacidad: 0, fondo: 1}},
    aviso: {...FILA_REVELADA, dibujo: 1, relleno: 1, inicial: {opacidad: 0, dx: 0}, final: {opacidad: 1, dx: 0}},
  },
  senal: {cabeza: 1, cola: 1}, toast: {opacidad: 1, dy: 0},
}
export const APP_FINAL: AppEstado = {
  ...APP_FIN_S4,
  toast: {opacidad: 0, dy: 12},
  chip: {dibujo: 1, relleno: 1, fondo: 1, pendiente: 0, hecho: {opacidad: 1, dx: 0}},
}
```

Mapa de estados por escena: S1 va de `CAOS_POSTER` a `CAOS_FIN_S1`. S2 de `CAOS_FIN_S1` a `CAOS_FIN_S2`. S3 de (`CAOS_FIN_S2` + `APP_OCULTA`) a `APP_FIN_S3` (el caos ya no se pinta: todo vuelo = 1). S4 de `APP_FIN_S3` a `APP_FIN_S4`. S5 de `APP_FIN_S4` a `APP_FINAL`. En móvil `filas.pedido` y `vuelo.nota` existen pero no se pintan.

### 5.5 `src/kit/geom.ts`

| Función | Firma | Qué hace |
|---|---|---|
| `centroCaja` | `(c: Caja) => {x, y}` | Centro de una caja |
| `aGlobal` | `(caja: Caja, giro: number, xl: number, yl: number, dy = 0) => {x, y}` | Punto local de una pieza → lienzo, aplicando el giro alrededor del centro de la caja (matriz de pantalla con y hacia abajo: x' = dx·cos θ − dy·sin θ, y' = dx·sin θ + dy·cos θ). El cursor usa SIEMPRE esta función. Para puntos dentro de una burbuja, antes se suma su `caja.x/y` local al grupo |
| `respira` | `(frame, dur, k, signo, A) => number` | `signo · A · sin(π · k · frame / (dur − 1))`. Vale 0 en frame 0 y en frame dur − 1 |
| `baldosa` | `(L, corte, id: FilaId) => Caja` | Caja de la baldosa de la fila `id` en el corte: x = `filas.x + baldosa.dx`, y = `tops[i] + baldosa.dy`, lado |
| `vuelo` | `(p, origen: {caja, giro}, destino: Caja) => {cx, cy, escala, giro, opacidad}` | q = `ease.inOut(p)`. Centro: lerp del centro de la caja al centro de la baldosa con q. Escala = `(destino.w / max(caja.w, caja.h)) ** q`. Giro = `giro · (1 − q)`. Opacidad de la silueta = 1 si p ≤ 0,8, luego `1 − (p − 0,8) / 0,2` |

### 5.6 Componentes

**Caos** (debajo, en este orden de apilado: rótulo, chat, hoja, nota, pósit)

| Componente | Props | Responsabilidad y geometría |
|---|---|---|
| `Rotulo` | `{opacidad, dy}` | Píldora `LAYOUT.rotulo`: fondo pastilla, borde 2 filete-2, radio h/2, texto `monoStyle(size, ink2)` a `padX` |
| `Burbuja` | `{tipo: "entrante" \| "saliente", caja, lineas: string[], lineasY, hora?, checks?, contenido}` | Una burbuja (5.3). `contenido` multiplica la opacidad de textos, hora y ✓✓, no la forma |
| `GrupoChat` | `{estado: CaosEstado, dy}` | Pregunta, respuesta, «escribiendo», mensaje nuevo y el resalte de copia (detrás del texto de la línea 2, ancho `(x1 − x0) · progreso`). Aplica el giro del grupo y la respiración |
| `Hoja` | `{estado: CaosEstado, dy}` | Rejilla, banda, columna, cabeceras, valores, barras, pestañas, marco de selección (interpola la caja de la celda inicio a la destino con `seleccionHoja`), texto tecleado (`TEXTOS.hoja.tecleo.slice(0, caracteres)`) y caret |
| `NotaPapel` | `{contenido, dy}` | Solo escritorio. Papel dentado, renglones, dos líneas y dos garabatos |
| `Posit` | `{opacidad, caida, contenido, dy}` | Pósit con su caída (dy y giro desde `caida.*`) y sombra interpolada de `piezaAlzada` a `pieza` |
| `Caos` | `{estado: CaosEstado}` | Monta todo lo anterior. Si `vuelo.x > 0`, envuelve la pieza en el transform de `vuelo()` (posición por su centro, `transformOrigin: center`) y multiplica su opacidad por la de la silueta. Las piezas llevan `sombra.pieza` |

**Aplicación** (debajo del caos)

| Componente | Props | Responsabilidad y geometría |
|---|---|---|
| `Ventana` | `{opacidad, entrada, glifo, children}` | Caja `LAYOUT.ventana`, fondo blanco, borde filete-2, radio, `overflow: hidden`, `sombra.ventana`. Transform `translateY(entradaDy·(1 − entrada)) scale(0,98 + 0,02·entrada)` con origen en su centro (`ventana.entradaDy` 24 en escritorio y 8 en móvil). Barra de título con `Glifo`, píldora de dirección (`direccion`, pastilla, radio h/2) y filete de 2 bajo la barra. Barra lateral (escritorio). «Hoy» (`displayStyle`) y subtítulo |
| `Glifo` | `{barra, hueco, macizo}` (0 a 1) | `LAYOUT.glifo`: barra tinta (escalaX desde la izquierda), □ tinta de trazo `trazo` (se traza con `pathLength`), ■ cobalto (escala desde el centro). Todo centrado en `cy` |
| `ChipEstado` | `AppEstado["chip"]` | `cabecera.chip`: fondo `mix(pastilla, cobalt50, fondo)`, `Marca` en `x + padX`, «Por revisar» (600 tinta-2) y «Todo al día» (600 cobalto) superpuestos en `x + padX + marca + gap` |
| `Marca` | `{lado, trazo, dibujo, relleno}` | □ tinta trazado por dentro de la caja (visible mientras relleno < 1) y ■ cobalto del mismo lado escalado por `relleno` desde el centro |
| `IconoOrigen` | `{tipo: "chat" \| "hoja" \| "papel" \| "posit", lado}` | SVG `viewBox 0 0 32 32` con la baldosa pastilla `rx 8` y el trazo tinta de 1,5 (unidades del viewBox). `chat`, `hoja` y `papel`: trazados copiados de `IconoOrigen` en `HeroArt.tsx`. `posit` (nuevo): `M9 8h14v16H9z` y `M9 12.5h14` |
| `Fila` | `{id: FilaId, estado: FilaEstado}` | Hueco punteado (opacidad 1 − superficie), superficie (fondo `mix(#FFFFFF, cobalt50, tinte)`, borde `mix(line, cobalt100, tinte)`), baldosa, título y origen dentro de un contenedor con `clipPath: inset(0 ${(1 − texto)·100}% 0 0)`, `Marca` en la columna fija, texto inicial y final superpuestos, botón «Confirmar» (fondo según `fondo`: 0 a 1 `mix(white, cobalt50)`, 1 a 2 `mix(cobalt50, cobalt100)`) |
| `Onda` | `{progreso}` | Rectángulo del botón de la reserva inflado `onda · progreso`, radio + inflado, trazo cobalto de grosor `boton.borde`, opacidad 0,6·(1 − progreso) (antes cobalto-100 y 1 − progreso: cambio del montaje por contraste) |
| `Senal` | `{cabeza, cola}` | SVG a pantalla completa con la ruta de S4 |
| `Toast` | `{opacidad, dy}` | `LAYOUT.toast` |
| `App` | `{estado: AppEstado}` | `Ventana` con `ChipEstado`, las filas de `FILAS[corte]`, `Senal`, `Onda` y `Toast` |

**Cursor**

| Componente | Props | Responsabilidad |
|---|---|---|
| `Cursor` | `{x, y, opacidad, escala}` | Flecha genérica con la punta en (x, y): caja 40×56, `M3 3L3 45L13.5 35.5L20.5 52L28 48.8L21 32.5L35 32.5Z`, relleno tinta, contorno blanco de 3 (`paintOrder: stroke`), `filter: sombra.cursor`. Se escala `LAYOUT.cursor.escala · escala` con origen en la punta. Siempre encima de todo |

---

## 6. Fotograma 0 y fotograma final

### 6.1 Fotograma 0 (póster, anuncia el caos) = `CAOS_POSTER`

**Escritorio 1280×1080**
```
+-----------------------------------------------------------------+
| (Lunes, 9:00)                                                   |
|  .-------------------.            +--------------------------+  |
|  | ¿Tenéis hueco     |   (-2°)    |####|Cliente|Día   |Pagado|  |
|  | el jueves a las 19?  9:02      |####|====   |lunes |sí    |  | (3°)
|  '-------------------'            |####|===    |martes|[¿?]  |  |
|        .------------------------. |####|=====  |      |      |  |
|        | Lo miramos y te decimos vv|[Cobros]Stock|Stock 2|Stock final|
|        '------------------------' +--------------------------+  |
|                                                                 |
|   /\/\/\/\/\/\/\/\/\/\                                          |
|   | Pedido pendiente |  (-5°)                                   |
|   | ¿quién lo pidió? |                                          |
|   |  ~~~~~~~~        |                                          |
|   '------------------'                                          |
+-----------------------------------------------------------------+
```
- Papel #F7F6F2 liso.
- Arriba a la izquierda el rótulo «Lunes, 9:00» (88, 80).
- Debajo, girado −2°, el chat: la pregunta blanca «¿Tenéis hueco / el jueves a las 19?» con «9:02» y la respuesta neutra «Lo miramos y te decimos» con ✓✓ tinta-3. Sin tercer mensaje.
- Arriba a la derecha, girada 3°, la hoja con «Cliente / Día / Pagado», «lunes · sí», «martes · ¿?» (la celda «¿?» con marco y tirador cobalto), la tercera fila vacía y las pestañas «Cobros» (activa), «Stock», «Stock 2», «Stock final».
- Abajo a la izquierda, girada −5°, la nota «Pedido pendiente / ¿quién lo pidió?».
- Libre el cuadrante inferior derecho (ahí caerá el pósit) y el centro inferior (por ahí entra el cursor).
- Sin cursor, sin ventana, sin pósit. Respiración 0. Sombras `pieza`.

**Móvil 960×900**
- Rótulo «Lunes, 9:00» (32, 32).
- Chat girado −2° con la pregunta en dos líneas y la respuesta «Lo miramos y te decimos».
- Abajo a la derecha, girada 3°, la hoja con «¿?» seleccionada y las pestañas «Cobros», «Stock», «Stock final».
- Abajo a la izquierda, el hueco libre donde caerá el pósit.

Qué transmite: un cliente sin respuesta, una hoja con dudas y un stock que nadie sabe cuál es. Se lee solo y encaja con la entradilla de al lado.

### 6.2 Fotograma final (global 539 = global 484) = `APP_FINAL`

**Escritorio 1280×1080**
```
+-----------------------------------------------------------------+
|        +------------------------------------------------------+ |
|        | =  []  #          (            )                      | |
|        +-----------+------------------------------------------+ |
|        | [# Hoy  ] | Hoy                      [# Todo al día] | |
|        |  Reservas | Lunes · Actualizado ahora                | |
|        |  Cobros   | [chat] Reserva, jueves 19:00  # Confirmada| |
|        |  Stock    |        Antes, en un mensaje              | |
|        |  Pedidos  | [hoja] Cobros de la semana    # Al día   | |
|        |           |        Antes, en una hoja de cálculo     | |
|        |           | [papel] Pedido de material    # Recibido | |
|        |           |        Antes, en un papel                | |
|        |           | [pósit] Aviso al cliente      # Enviado  | |
|        |           |        Antes, en un pósit                | |
|        +-----------+------------------------------------------+ |
+-----------------------------------------------------------------+
```
(`#` = ■ cobalto, `[]` = □ del glifo)
- Papel alrededor. Ventana blanca 88, 96, 1104×888, radio 28, borde filete-2, sombra `0 24px 48px rgba(16,16,19,.08)`.
- Barra de título (96-176): glifo ▬ □ ■ en x 128-214, píldora de dirección vacía en 500-780, filete en y 176.
- Barra lateral (88-348): «■ Hoy» activo en píldora cobalto-50 (108, 200, 220×60). «Reservas», «Cobros», «Stock», «Pedidos» en tinta-2, sin cuadrados.
- Cabecera: «Hoy» 60/560 (380, 204), «Lunes · Actualizado ahora» 28 tinta-3 (380, 272), chip «■ Todo al día» cobalto sobre cobalto-50 (940, 212, 220×48).
- Cuatro filas blancas (x 380-1160, alto 120, en 332/468/604/740), sin tintes:

| Baldosa | Título | Origen | Estado |
|---|---|---|---|
| chat | Reserva, jueves 19:00 | Antes, en un mensaje | ■ Confirmada |
| hoja | Cobros de la semana | Antes, en una hoja de cálculo | ■ Al día |
| papel | Pedido de material | Antes, en un papel | ■ Recibido |
| pósit | Aviso al cliente | Antes, en un pósit | ■ Enviado |

- Bajo la última fila, 124 px de aire blanco dentro de la ventana (donde estuvo el aviso) y 96 px de papel bajo la ventana.
- No hay cursor, señal, aviso, tinte, hueco punteado, pieza ni rótulo.

**Móvil 960×900**: ventana 16, 16, 928×868 (radio 34) con glifo y píldora, «Hoy» 64/560, «Lunes · Actualizado ahora», chip «■ Todo al día» (626, 132, 278×64) y tres filas (x 56-904, alto 148, en 272/436/600): «Reserva del jueves · Antes, en un mensaje · ■ Confirmada», «Cobros de la semana · Antes, en una hoja de cálculo · ■ Al día», «Aviso al cliente · Antes, en un pósit · ■ Enviado».

**Cómo casa con el pie**: los orígenes nombran literalmente mensaje, hoja de cálculo, papel y pósit y todo está dentro de una sola aplicación. El chip «Todo al día» dice «en orden y bajo control» sin rótulo sobreimpreso. El único □ que queda es el del glifo de marca en la barra de título, que forma parte del logo.

---

## 7. Riesgos y comprobaciones

### 7.1 Riesgos y cómo se evitan

1. **Texto ilegible a escala real.** Mínimos 28 y 36 respetados y medidos. Títulos de fila a 34 y 42 (unos 17 y 15-19 px en pantalla). Sin tinta-4 en ningún texto. Tinta-3 sobre blanco ≈ 5,7:1. Cobalto sobre cobalto-50 solo en 600.
2. **Desbordes.** Todos los anchos de 5.3 están medidos con las fuentes reales. Los más justos: «Confirmada» acaba justo a 24 px del borde de la fila en los dos cortes, «Pagado» deja 16 px en móvil, el aviso móvil deja 11 px dentro de su píldora. Si al renderizar el ancho real (con kerning) supera la medida en más de 4 px, se ensancha la caja, nunca se baja la letra.
3. **Doble exposición.** El texto del caos se funde (S3 12-24) antes de que la ventana suba de 0 (S3 22). Las siluetas viajan limpias y el relevo con la baldosa se hace cuando miden 1,05× la baldosa. El botón sale (S4 36-42) antes de que crezca el ■ (42-52). «Pendiente» sale (70-75) antes de que entre «Enviado» (75-84). «Por revisar» sale (S5 16-22) antes de que entre «Todo al día» (24-34). La burbuja «escribiendo» sale (92-96) mientras entra el mensaje nuevo en la MISMA caja y con fondo opaco del mismo color, así que no se ven dos textos a la vez.
4. **Colisiones del caos.** Extensiones con giro calculadas (S1). El par más justo es pósit y hoja en móvil, a 14 px. Nada queda a menos de 23 px del borde del lienzo.
5. **Sombras cortadas por el borde del lienzo.** La sombra de la ventana se ha elegido para que valga 0 antes del borde: en escritorio (96 px de papel debajo) `0 24 48` y en móvil (16 px) `0 4 8`. Un corte de sombra dejaría una costura contra el papel de la página.
6. **Frontera entre escenas.** Nada se anima a través de una frontera y la respiración vale 0 en los extremos de cada escena. El cursor empieza fuera del lienzo en S2 y S4.
7. **Determinismo.** Todo es función del fotograma: sin `Math.random`, sin `Date`, sin CSS `transition` ni `animation`. Tecleo, parpadeo y puntos salen de constantes de `T`. `FontGate` espera a las fuentes antes de cada fotograma (Schibsted normal y cursiva variables, Fragment Mono).
8. **Color y compresión.** Render en h264 `yuv420p` con BT.709 en rango TV (ya comprobado con una prueba de color previa) y CRF bajo. El 4:2:0 emborrona el texto cobalto fino: por eso todo texto cobalto va en 600. Suavizado de texto en escala de grises en la raíz.
9. **Lectura como marca.** La burbuja del negocio es neutra y el cobalto no aparece en boca de nadie. En el caos el cobalto solo marca selecciones del cursor.
10. **Que parezca una lista de tareas o una promesa de resultados.** Un solo clic en una acción del negocio («Confirmar»), el resto llega con su estado. Sin cifras de resultado: las horas y «Stock 2» son texto de interfaz ilustrativo que vive en el vídeo. La aplicación no lleva reloj ni contadores.
11. **Ritmo.** Cinco desplazamientos de cursor en 18 s (entrar, arrastrar, ir a la celda, entrar, retirarse) y un foco por momento: pósit, copia, cliente, ventana, filas, botón, señal, aviso, chip.
12. **Integración en la web** (fuera de este render, solo como nota): el vídeo se queda en su último fotograma al acabar. Si `play()` falla, conviene mostrar la imagen fija final y no el póster. El control «Pausar» / «Ver de nuevo» ya vive en el pie de `HeroIllustration`, fuera del vídeo.

### 7.2 Fotogramas fijos que se revisan antes del render completo

En los dos cortes, reducidos a 600 px (escritorio) y 330 px (móvil) de ancho:

| Global | Qué se mira |
|---|---|
| 0 | Póster |
| 30 | Pósit recién posado |
| 84 | Arrastre a mitad |
| 106 | Clic en la celda |
| 135 | «jueves 19» completo |
| 164 | «¿Al final hay hueco?» entero |
| 206 | Texto del caos a mitad de fundido, ventana todavía a 0 |
| 216 | Ventana a mitad de entrada bajo las siluetas |
| 238 | Glifo a medio montar, chat empezando a volar |
| 241 | Chat a mitad de vuelo |
| 251 | Hoja a mitad de vuelo |
| 264 | Fila reserva descubriéndose |
| 283 | Relevo silueta → baldosa del pósit |
| 302 | Todas las filas reveladas |
| 354 | Onda del clic a mitad |
| 380 | Señal a mitad |
| 416 | Aviso entero |
| 470 | Chip a mitad de cambio |
| 539 | Final |

### 7.3 Comprobaciones automáticas

- **Fronteras idénticas**: comparar píxel a píxel los pares globales (59, 60), (189, 190), (319, 320) y (449, 450). Deben ser iguales.
- **Final asentado**: 484 y 539 idénticos píxel a píxel. La imagen fija se exporta con `remotion still` en 539 y el póster en 0.
- **Mínimos de letra**: recorrer `LAYOUT` y fallar si algún `size` baja de 28 en escritorio o de 36 en móvil (las horas y el caret no son excepción: la hora va a 28).
- **Lienzo**: el píxel (0, 0) y el (W−1, H−1) de todos los fotogramas revisados deben ser #F7F6F2 antes de codificar.
- `npm run typecheck` sin errores.

### 7.4 Revisión de todos los textos en pantalla

| Texto | Tildes, «¿» y «¡» | Sin punto y coma ni rayas | Sin primera persona singular ni «me/mí/yo» | Sin marcas ni cifras de resultado |
|---|---|---|---|---|
| Lunes, 9:00 | Sí | Sí | Sí | Sí (hora ilustrativa) |
| ¿Tenéis hueco / el jueves a las 19? | Sí | Sí | Sí (vosotros) | Sí |
| Lo miramos y te decimos | Sí | Sí | Sí (nosotros) | Sí |
| ¿Al final hay hueco? | Sí | Sí | Sí (impersonal) | Sí |
| 9:02 · 9:41 | | Sí | Sí | Sí (horas ilustrativas) |
| Cliente · Día · Pagado · lunes · martes · sí · ¿? | Sí | Sí | Sí | Sí |
| jueves 19 | Sí | Sí | Sí | Sí |
| Cobros · Stock · Stock 2 · Stock final | Sí | Sí | Sí | Sí (nombre de pestaña, no resultado) |
| Pedido pendiente / ¿quién lo pidió? | Sí | Sí | Sí (tercera persona) | Sí |
| Avisar al / cliente / ¡hoy! | Sí | Sí | Sí | Sí |
| Hoy · Lunes · Actualizado ahora | Sí («·» es punto medio) | Sí | Sí | Sí |
| Hoy · Reservas · Cobros · Stock · Pedidos | Sí | Sí | Sí | Sí |
| Por revisar · Todo al día | Sí | Sí | Sí | Sí |
| Reserva, jueves 19:00 · Reserva del jueves | Sí | Sí | Sí | Sí |
| Cobros de la semana · Pedido de material · Aviso al cliente | Sí | Sí | Sí | Sí |
| Antes, en un mensaje · Antes, en una hoja de cálculo · Antes, en un papel · Antes, en un pósit | Sí | Sí | Sí | Sí (no dice «WhatsApp») |
| Confirmar · Confirmada · Al día · Recibido · Pendiente · Enviado | Sí | Sí | Sí | Sí |
| Aviso enviado al cliente | Sí | Sí | Sí | Sí |

Ningún texto nombra a BPM Tech, a un cliente real ni a un producto de terceros. No hay «€», porcentajes, contadores ni testimonios. La marca no habla en ningún momento: todo el texto pertenece a la escena.
