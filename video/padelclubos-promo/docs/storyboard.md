# 23:47 — Un día en Valencia Pádel Club

**Storyboard definitivo del vídeo promocional de Padel Club OS** (padelclubos.com) · Master 16:9 de 60 s y corte vertical 9:16 de 30 s · 120 BPM · 30 fps · sin locución · construido al 100 % en código con Remotion.

> A las 23:47 el gerente de Valencia Pádel Club sigue contestando WhatsApps, deshaciendo dobles reservas y cuadrando Excels rotos. Padel Club OS «enciende» el club y le devuelve un día entero en orden, hasta que a las 23:47 del día siguiente las reservas se confirman solas y su móvil, por fin, no suena.

## 1. La idea

Un gerente de club de barrio no compra software: compra dormir tranquilo. El vídeo arranca en su noche real (las 23:47 del lunes: mensajes a deshora, dos partidos prometidos para la misma pista y tres Excels rotos) y se reconoce en «¿Suena familiar?». En el drop, el contorno del isotipo se traga todo ese caos y el bloque verde lo «enciende». A partir de ahí el vídeo recorre UN martes del club (08:15 → 22:00): cada dolor se resuelve con la pieza concreta del producto y con el MISMO objeto visual que lo representaba. El cierre vuelve a las 23:47: el móvil del gerente sigue apagado mientras una reserva se confirma sola. Las funciones aparecen como consecuencias, no como una lista.

| | 16:9 (master) | 9:16 (Reels, TikTok, Shorts) |
|---|---|---|
| Resolución | 1920×1080 · 30 fps | 1080×1920 · 30 fps |
| Duración | 30 compases = 60 s = 1800 frames | 15 compases = 30 s = 900 frames |
| Problema | 14 s (c.1–7) | 6 s (c.1–3) |
| Drop / marca | 0:14 (c.8) | 0:06 (c.4) |
| Producto | 24 s (c.10–21) | 12 s (c.5–10) |
| Breakdown | 0:42 (c.22) | 0:20 (c.11) |
| Golpe final / CTA | 0:52 (c.27) | 0:24 (c.13) |
| Último fotograma fijo | 2 s | 1 s |

**Notación.** «c.X» es el compás absoluto del vídeo; dentro de cada escena, «cX.tY» es compás/tiempo local y «fN» el frame local (1 tiempo = 0,5 s = 15 f; 1 compás = 2 s = 60 f). Todos los cortes caen en múltiplos de 15 f.

## 2. Firma visual y reglas de marca

- «El marcador del día». Cuatro reglas visuales sostienen la pieza.
- (1) EL RELOJ DEL DÍA: un chip en píldora arriba a la izquierda (16:9: x96 y56; JetBrains Mono 28 px, tabular-nums) con DÍA · HORA —sin celda PISTA, para no competir con los módulos— cuyos dígitos ruedan como un marcador (digit-roll de 180 ms por dígito, stagger 2 f): LUN · 23:47 → MAR · 01:12 (hora en rojo suave #E08A7A sobre #282420) → 08:15 → 11:20 → 13:05 → 18:40 → 20:25 → 22:00 → 23:47 (hora en verde #6FBF9C), momento en que el chip crece hasta volver a ser el reloj gigante del principio. Se oculta en «suena-familiar», en el drop y cuando el módulo marcador es protagonista («configura-en-5-minutos», «cta»). En 9:16 no existe: bastan las 23:47 gigantes del gancho y del breakdown.
- (2) EL MÓDULO MARCADOR (3 celdas, borde 2 px tinta, radio 10, etiquetas en JetBrains Mono, cifras en Archivo 112 % tabulares, fila de total) es el objeto que cuenta problema y solución: nace de dos burbujas de chat, choca en la doble reserva, es la hoja de confirmación del portal y vuela hasta el panel, se recoloca en otra pista, es el resultado de la liga, son las casillas del tablero, son los 3 pasos de configuración y es el sello de confianza final con padelclubos.com en la fila de total.
- (3) EL ISOTIPO COMO INTERRUPTOR: su contorno vacío se traga el caos («suena-familiar»), el bloque verde #157A54 entra en el downbeat del drop y «enciende» el club («interruptor»), es el punto final de «Tu club no puede esperar más» y cruza la pantalla como barrido hacia la tarjeta final («cta»). Siempre el logotipo oficial (public/brand/*.svg), nunca redibujado; sobre tinta, la variante oscura oficial (bloque #2FA075).
- (4) COLOR CON SIGNIFICADO: cero verde antes del drop (el problema vive en #14120F / #1E1B17 / #282420 con un único acento rojo suave #E08A7A); el bloque del isotipo es el primer píxel verde del vídeo y, desde ahí, el verde solo significa reservado, confirmado o activo. Cero azul SaaS.
- GRAMÁTICA: los titulares viven en una capa HUD fija al cuadro (no se mueven con la cámara ni reciben desenfoque; salen con vista inversa en los últimos 8 f); press 120 ms ease-out para toques, overlay 220 ms cubic-bezier(0.32,0.72,0,1) para hojas y desplazamientos, vista 180 ms fade+4 px para entradas, celebrate 400 ms solo en confirmación de reserva o pago, digit-roll para toda cifra; sin rebotes, sin overshoot, sin rotaciones 3D; líneas de 2 px como mínimo. Transiciones por acto: match cuts en el problema, push horizontal con CameraMotionBlur solo en la capa de contenido en el producto («avanza el día») y cortes secos en el cierre. Sonido espejo: pings disonantes (segunda menor) antes del drop, el mismo ping en quinta justa después y silencio total a las 23:47 finales.

**Prohibido:** confeti, palas o bolas en primer plano como cliché, rebotes elásticos, glitch, lens flares, partículas, HDR, teal & orange, pistas azules, azul SaaS, logos o verdes de WhatsApp y Excel (solo se nombran como palabras), menciones a Matchpoint o Playtomic, precios, años y fechas absolutas.

## 3. Tabla de tiempos

### 16:9 · master de 60 s (30 compases)

| # | Escena (id del componente) | Compases | Compás de inicio | Segundo de inicio | Frame de inicio | Frames | Energía |
|---|---|---|---|---|---|---|---|
| 1 | 23:47 — Mensajes a deshora (`mensajes-a-deshora`) | 2 | 1 | 0:00 (0,0 s) | 0 | 0–119 | 2/10 |
| 2 | Dobles reservas (`dobles-reservas`) | 2 | 3 | 0:04 (4,0 s) | 120 | 120–239 | 4/10 |
| 3 | Gestión fragmentada (`gestion-fragmentada`) | 2 | 5 | 0:08 (8,0 s) | 240 | 240–359 | 5/10 |
| 4 | ¿Suena familiar? (`suena-familiar`) | 1 | 7 | 0:12 (12,0 s) | 360 | 360–419 | 6/10 |
| 5 | El interruptor — revelación de marca (DROP) (`interruptor`) | 2 | 8 | 0:14 (14,0 s) | 420 | 420–539 | 9/10 |
| 6 | 08:15 — Reservas 24/7: dos caras, mismos datos (`reserva-movil`) | 2 | 10 | 0:18 (18,0 s) | 540 | 540–659 | 8/10 |
| 7 | 11:20 — Detección de solapamientos (`sin-solapamientos`) | 2 | 12 | 0:22 (22,0 s) | 660 | 660–779 | 8/10 |
| 8 | 13:05 — Adiós al Excel (`adios-al-excel`) | 2 | 14 | 0:26 (26,0 s) | 780 | 780–899 | 8/10 |
| 9 | 18:40 — Ligas en tiempo real (`ligas-en-directo`) | 2 | 16 | 0:30 (30,0 s) | 900 | 900–1019 | 9/10 |
| 10 | 20:25 — Control de cobros (`control-de-cobros`) | 2 | 18 | 0:34 (34,0 s) | 1020 | 1020–1139 | 9/10 |
| 11 | 22:00 — Todo lo que tu club necesita (`todo-en-uno`) | 2 | 20 | 0:38 (38,0 s) | 1140 | 1140–1259 | 9/10 |
| 12 | 23:47 — Tú descansas (BREAKDOWN) (`tu-descansas`) | 2 | 22 | 0:42 (42,0 s) | 1260 | 1260–1379 | 3/10 |
| 13 | Configura en 5 minutos (BUILD) (`configura-en-5-minutos`) | 3 | 24 | 0:46 (46,0 s) | 1380 | 1380–1559 | 7/10 |
| 14 | Tu club no puede esperar más (GOLPE FINAL) (`cta`) | 4 | 27 | 0:52 (52,0 s) | 1560 | 1560–1799 | 10/10 |
| | **Total** | **30** | | **1:00** | | **1800** | |

### 9:16 · corte vertical de 30 s (15 compases)

| # | Escena (id del componente) | Compases | Compás de inicio | Segundo de inicio | Frame de inicio | Frames | Reutilización |
|---|---|---|---|---|---|---|---|
| 1 | Gancho 23:47 (`mensajes-a-deshora`) | 1 | 1 | 0:00 (0,0 s) | 0 | 0–59 | mismo componente que en 16:9, maqueta vertical y versión de 1 compás |
| 2 | Dobles reservas (`dobles-reservas`) | 1 | 2 | 0:02 (2,0 s) | 60 | 60–119 | mismo componente que en 16:9, con la variante apilada: un solo módulo y dos filas de total |
| 3 | Competiciones en Excel (`competiciones-en-excel`) | 1 | 3 | 0:04 (4,0 s) | 120 | 120–179 | escena solo vertical: reutiliza la hoja de «gestion-fragmentada» y el contorno de «suena-familiar» |
| 4 | El interruptor (DROP) (`interruptor`) | 1 | 4 | 0:06 (6,0 s) | 180 | 180–239 | mismo componente que en 16:9; en vertical solo se usa su primer compás, el lockup, sin H1 ni pista |
| 5 | Reserva desde el móvil, sin descargar nada (`reserva-movil`) | 2 | 5 | 0:08 (8,0 s) | 240 | 240–359 | mismo componente que en 16:9, maqueta vertical: solo la cara del jugador |
| 6 | Sin dobles reservas (`sin-solapamientos`) | 2 | 7 | 0:12 (12,0 s) | 360 | 360–479 | mismo componente que en 16:9, maqueta vertical |
| 7 | Ligas en tiempo real (`ligas-en-directo`) | 2 | 9 | 0:16 (16,0 s) | 480 | 480–599 | mismo componente que en 16:9, maqueta vertical: tres filas y una sola pareja con nombre |
| 8 | 23:47 — Tú descansas (BREAKDOWN) (`tu-descansas`) | 2 | 11 | 0:20 (20,0 s) | 600 | 600–719 | mismo componente que en 16:9, maqueta vertical sin el móvil |
| 9 | Tu club no puede esperar más (GOLPE FINAL) (`cta`) | 3 | 13 | 0:24 (24,0 s) | 720 | 720–899 | mismo componente que en 16:9, maqueta vertical y versión de 3 compases |
| | **Total** | **15** | | **0:30** | | **900** | |

Mismo id = mismo componente (`src/scenes/<id>/`), que lee `useFormat()` y cambia de maqueta en vertical. Solo `competiciones-en-excel` es exclusiva del vertical.

## 4. Escena a escena · 16:9

### L01 · 23:47 — Mensajes a deshora — `mensajes-a-deshora`

**c.1–2** · 2 compases · 0:00–0:04 · frames 0–119 · energía musical 2/10

**Textos en pantalla**

- 23:47
- LUNES · VALENCIA PÁDEL CLUB
- Notificación: Javi Martínez · ahora — ¿Nos guardas la 1 mañana a las 19:00?
- Mensajes a deshora.
- 38 SIN LEER
- Chat «Reservas Valencia Pádel · 142 participantes»
- 23:47 Javi Martínez: ¿Nos guardas la 1 mañana a las 19:00?
- 23:52 Pedro Sanz: Somos 4. ¿La 1 mañana a las 19:00?
- Reloj: LUN · 23:47 → MAR · 01:12

**Visual.** Fondo #14120F con viñeta radial muy suave hacia #1E1B17. «23:47» en JetBrains Mono 500 de 300 px, #F1EDE4, tabular (x160, y150–450); debajo, la etiqueta mono «LUNES · VALENCIA PÁDEL CLUB» en #8A8377 (24 px, tracking 0,14 em). A la derecha, móvil vectorial neutro (x1280–1640, 780 px de alto, radio 64, bisel #282420, pantalla #1E1B17) con pantalla de bloqueo. La notificación es genérica (tarjeta #282420, radio 14, avatar de iniciales «JM» en #37322A): sin logo ni verde de WhatsApp. Después, el chat de grupo genérico: cabecera #282420, burbujas #282420 con texto #F1EDE4 (Instrument Sans 26 px), nombre en #C9C2B4 y hora en mono #8A8377. En el chat solo son legibles dos burbujas: la de Javi (la misma de la notificación, arriba) y la de Pedro; el resto son esqueletos (avatar y barras #37322A, sin texto). Titular a la izquierda (x96, y560) en Archivo 112 %, 760, 104 px, #F1EDE4; debajo, el contador mono «38 SIN LEER» en #E08A7A, 40 px. Chip del reloj arriba a la izquierda (píldora #282420, hora en #E08A7A). Ni un píxel verde.

**Movimiento.**

- f0: fotograma ya poblado (reloj, etiqueta y móvil con la pantalla de bloqueo): sirve de miniatura. Los dos puntos del reloj parpadean en cada tiempo.
- c1.t2 (f15): vibración de ±3 px en x (10 f, amortiguada) y la notificación de Javi cae desde el borde superior de la pantalla (overlay 7 f).
- c1.t4 (f45): el reloj grande se encoge y viaja a la esquina (overlay 7 f) hasta convertirse en el chip «LUN · 23:47»; la etiqueta sale con vista inversa (6 f).
- f50: «Mensajes a deshora.» palabra a palabra (stagger 3 f, vista 180 ms fade+4 px); queda hasta f112.
- c2.t1 (f60): la pantalla de bloqueo se abre al chat (vista 6 f). Las burbujas entran en corcheas (f60, 67, 75, 82, 90, 97), 12 px desde abajo, con autoscroll en curva overlay; la de Javi ya está arriba, la de Pedro entra en f67 (23:52) y el resto son esqueletos. El chip rueda con cada burbuja (digit-roll): 23:48 → 23:52 → 00:06 (LUN pasa a MAR) → 00:21 → 00:40 → 01:12. «38 SIN LEER» sube de 3 a 38 entre f60 y f97.
- Push-in del móvil 1 → 1,05 (ease-in) durante el c.2.
- c2.t3 (f90): la burbuja de Javi y la de Pedro se contornean en #E08A7A (2 px): misma pista, misma hora. El resto baja al 40 %.
- c2.t4 (f105): esas dos burbujas se despegan hacia el centro y su rectángulo empieza a convertirse en el de un módulo marcador (overlay 7 f).
- HUD: el titular sale en f112.

**Transición de salida.** Match cut en el downbeat del c.3: las dos burbujas aterrizan como los módulos A y B de «dobles-reservas».

**Sonido.** Todo el plano: room tone grave y «tic» de reloj seco en cada tiempo (−24 dB) [tick]. f15: vibración (onda cuadrada de 150 Hz con AM a 25 Hz, 2 pulsos) + ping DISONANTE La5+Si♭5, 150 ms [ping]. f45: whoosh corto (reloj a la esquina) [swipe]. f60–f97: un ping disonante por burbuja (−18 dB, variación de ±1 semitono dentro de la escala). f105: whoosh corto [whoosh].

### L02 · Dobles reservas — `dobles-reservas`

**c.3–4** · 2 compases · 0:04–0:08 · frames 120–239 · energía musical 4/10

**Textos en pantalla**

- Dobles reservas.
- Dos partidos. Una pista.
- Módulo A: PISTA 1 | FECHA MAR | HORA 19:00 — Javi Martínez + 3
- Módulo B: PISTA 1 | FECHA MAR | HORA 19:00 — Pedro Sanz + 3
- Chip: Ahora
- Reloj: MAR · 01:12

**Visual.** Fondo #14120F. Módulo marcador grande en el centro (1040×300, radio 10, borde 2 px #F1EDE4 al 80 %, superficie #1E1B17): etiquetas mono de 20 px en #8A8377 (PISTA / FECHA / HORA) y valores en Archivo 112 %, 800, 120 px, tabulares, #F1EDE4. Fila de total #282420 con «Javi Martínez + 3» en Instrument Sans 36 px. El módulo B es idéntico con «Pedro Sanz + 3». La zona de solape lleva una trama diagonal SVG (líneas de 2 px #E08A7A al 35 %, paso 12 px). Chip píldora «Ahora» con tinte #E08A7A en la esquina superior izquierda del conjunto (la etiqueta de la landing). Titular arriba a la izquierda (Archivo 112 %, 760, 96 px) y subtítulo debajo en Instrument Sans 44 px, #F1EDE4 al 70 %.

**Movimiento.**

- c1.t1 (f0): A aterriza (fin del match cut, overlay 7 f) y sus valores ruedan con digit-roll (stagger 2 f); titular por palabras (stagger 3 f).
- c1.t3 (f30): B entra desde x+900 (overlay 7 f) y se monta sobre A con un desfase de 24/24 px.
- c2.t1 (f60): impacto. Temblor de ±6 px en x (6 f, amortiguado, sin rebote), bordes a #E08A7A en 4 f, aparece la trama (6 f), el chip «Ahora» entra con press (scale 0,96 → 1, sin overshoot) y entra el subtítulo.
- c2.t4 (f105): los dos módulos caen fuera de cuadro (translateY +320, rotación ±4°, ease-in 12 f).
- HUD: titular y subtítulo salen en f112.

**Transición de salida.** Corte en el downbeat del c.5: los módulos caídos reaparecen en el montón de «gestion-fragmentada».

**Sonido.** f0: whoosh corto de aterrizaje y 3 ticks del digit-roll [swipe, tick]. f30: whoosh [whoosh]. f60: golpe de error (70 Hz + clúster disonante de 120 ms) [buzz] y «toc» metálico, como de bola contra la valla [tock, pitch 0,8]. f105: whoosh descendente [whooshDown]. El tic de reloj sigue a −24 dB.

### L03 · Gestión fragmentada — `gestion-fragmentada`

**c.5–6** · 2 compases · 0:08–0:12 · frames 240–359 · energía musical 5/10

**Textos en pantalla**

- Un Excel para socios,
- otro para pagos,
- WhatsApp para comunicar.
- Ventanas: socios_v3_FINAL.xlsx · pagos_FINAL (2).xlsx · liga_otoño_BUENO (2).xlsx
- Hoja de la liga: Pos. · Pareja · PJ · PTS — Navarro / Sanz · Ruiz / Castillo · Gómez / Ferrer · Moreno / Martínez
- Celdas: #¡REF! · #¡VALOR!
- Badge del móvil: 38
- Reloj: MAR · 01:12

**Visual.** Mesa de caos en vectores planos sobre #14120F, en la columna derecha (x860–1824). (1) Ventana de hoja de cálculo genérica «socios_v3_FINAL.xlsx», sin logo ni verde de Excel: barra de título #282420 con el nombre en mono 18 px #8A8377, rejilla de líneas de 2 px #37322A sobre #1E1B17, cabeceras Nombre · Teléfono · Cuota · Pagado; la columna Teléfono son barras esqueleto (nunca números con formato real); rotada −3°. (2) «pagos_FINAL (2).xlsx» (Socio · Mes · Importe · ¿Pagado?), rotada +2°. (3) «liga_otoño_BUENO (2).xlsx», rotada −1,5°: la clasificación con las mismas parejas que resolverá «ligas-en-directo», dos posiciones «1» duplicadas en #E08A7A y la columna PTS rompiéndose en #¡REF!. (4) El móvil del chat a 0,6× con el badge «38». Sin libreta. Los errores (#¡REF!, #¡VALOR!) van en #E08A7A. Titular de tres líneas a la izquierda (x96–836) en Archivo 112 %, 720, 88 px.

**Movimiento.**

- c1.t1 (f0): línea 1 del titular y cae la ventana de socios (overlay 7 f), que gira hasta −3° al asentarse.
- c1.t3 (f30): línea 2 y cae la ventana de pagos.
- c2.t1 (f60): línea 3; cae la hoja de la liga y el móvil pequeño entra desde la derecha (overlay 7 f).
- Desde c1.t2, los errores se propagan celda a celda en semicorcheas (cada 7–8 f); en c2.t2 (f75) se rompe entera la columna PTS de la liga.
- c2.t3 (f90): todo empieza a comprimirse hacia el centro (scale 1 → 0,6, las rotaciones se acumulan, ease-in).
- HUD: el titular completo (10 palabras) sale en f110.

**Transición de salida.** Sin corte visible: el montón comprimido continúa en «suena-familiar», con el corte en el downbeat del c.7.

**Sonido.** f0, f30, f60: golpe seco de papel + whoosh por ventana [impact suave, swipe]. Ticks en semicorcheas para los errores (−22 dB) [tick]. f75: «bonk» grave (se rompe la liga) [buzz, pitch 0,7]. Riser desde f60 [riser, dur 60].

### L04 · ¿Suena familiar? — `suena-familiar`

**c.7** · 1 compás · 0:12–0:14 · frames 360–419 · energía musical 6/10

**Textos en pantalla**

- ¿Suena familiar?

**Visual.** El montón de fragmentos (hojas, chat y módulos rojos) orbita en el centro sobre #1E1B17. Titular gigante centrado en Archivo 112 %, 800, 120 px, #F1EDE4. Después queda solo el contorno del isotipo a 10× (400×280, rx 70, trazo de 30 px #F1EDE4), VACÍO, sin el bloque verde. El chip del reloj se oculta.

**Movimiento.**

- f0: el titular entra por palabras (2 palabras, stagger 6 f, vista); los fragmentos giran despacio (0 → 8°) y se contraen (1 → 0,7) con ease-in.
- t.3 (f30): el titular sale (f30–f38) y los fragmentos son succionados al centro (scale → 0, 12 f, ease-in exponencial) mientras se dibuja el contorno del isotipo (stroke-dashoffset, 10 f).
- t.4 (f45–f59): plano totalmente quieto, con el contorno vacío en el centro.

**Transición de salida.** Sin corte: el contorno vacío continúa en «interruptor» y el bloque verde entra exactamente en el downbeat del c.8 (drop).

**Sonido.** El riser culmina en t.3 (f30) con un reverse cymbal [riser]. t.4: SILENCIO total salvo un único «toc» seco de bola de pádel en f45 [tock].

### L05 · El interruptor — revelación de marca (DROP) — `interruptor`

**c.8–9** · 2 compases · 0:14–0:18 · frames 420–539 · energía musical 9/10

**Textos en pantalla**

- PadelClub OS (logotipo oficial)
- Todas las herramientas para tu club.

**Visual.** En el contorno del isotipo entra el bloque verde #157A54 (130×160, rx 30: el 13×16 rx 3 oficial a 10×), el primer píxel verde del vídeo. El fondo pasa de #14120F a arena #F6F3ED con un barrido de izquierda a derecha y el contorno cambia a tinta #1C1A17. Se forma el lockup horizontal OFICIAL (public/brand/logo-horizontal-outline.svg: isotipo + «PadelClub» + chip «OS» verde #157A54 con letras arena, tal como está trazado, sin retipografiar) a 128 px de alto, centrado en y≈300. Debajo, el H1 en Archivo 112 %, 700, 72 px, tinta, con «tu club» subrayado por un trazo de 6 px #2FA075. En el c.2, bajo el H1 (y560–900), una pista de pádel vista desde arriba (proporción 20×10, 680×340) dibujada con líneas tinta de 3 px (red de 4 px) sobre arena.

**Movimiento.**

- f0, en el downbeat exacto del drop: el bloque verde entra en el contorno desde la izquierda (translateX −60 → 0, overlay 7 f, sin overshoot) y, sincronizado, el barrido arena (clip-path, 7 f).
- f8–f24: el isotipo pasa de 400 px a su tamaño en el lockup y se coloca (overlay); «PadelClub» se revela letra a letra (máscara, 10 f) y el chip «OS» entra con press (scale 0,96 → 1, sin rebote).
- c1.t3 (f30): el H1 entra palabra a palabra (stagger 3 f, vista) y queda hasta f105 (2,5 s).
- f45: se dibuja el subrayado verde (10 f).
- c2: la pista se dibuja por grupos, uno por tiempo: f60 perímetro (12 f), f75 red (8 f), f90 líneas de saque (8 f), f97 línea central (6 f).
- c2.t4 (f105): lockup y H1 salen hacia arriba (overlay 7 f) y la pista se replica ×4 en horizontal (stagger 3 f).

**Transición de salida.** Morph continuo en el downbeat del c.10: las cuatro pistas se aplanan y se convierten en las cuatro columnas (Pista 1–4) de la rejilla de Reservas de «reserva-movil». El producto sale de la pista.

**Sonido.** f0: el drop completo con bombo, sub, «clack» mecánico doble de interruptor y «toc» de pala [impact, click×2, tock]. f8: whoosh ascendente con el wordmark [whoosh]. f30: clic de UI muy suave [click]. f60, f75, f90, f97: un «zip» de línea por grupo (ruido filtrado de 6 f) [swipe]. f105: whoosh corto [swipe].

### L06 · 08:15 — Reservas 24/7: dos caras, mismos datos — `reserva-movil`

**c.10–11** · 2 compases · 0:18–0:22 · frames 540–659 · energía musical 8/10

**Textos en pantalla**

- Reloj: MAR · 08:15
- Reservas 24/7 online.
- Sin llamadas, sin errores, sin dramas.
- PANEL DEL CLUB
- PORTAL DEL JUGADOR · SIN DESCARGAR NADA
- Panel: Reservas · Jueves · Nueva Reserva
- Rejilla: Pista 1 · Pista 2 · Pista 3 · Pista 4 / 17:30 · 19:00 · 20:30 · 22:00
- Celdas: Clase · Iniciación · Castillo ×4 · Moreno ×4 · Díaz ×4
- Portal: Valencia Pádel Club · Jueves · Pista 2 · 20:30 · Libre · Reservar · Partidas · Competiciones · Perfil
- Hoja: PISTA 2 | JUE | 20:30 — 90 min · 4 jugadores
- Confirmar reserva → Reserva confirmada
- Celda nueva: Laura Gómez · NUEVA

**Visual.** Arena #F6F3ED. Izquierda (x96–1100, y290–1000): el panel real recreado en vectores. Sidebar tinta de 264 px a 0,7× (texto nunca por debajo de 16 px efectivos) con los grupos Operación / Comunidad / Contenido / Negocio / Sistema y «Reservas» activo en tinte verde; cabecera «Reservas · Jueves» y botón primario verde «Nueva Reserva». Rejilla de 4 pistas × 4 franjas de 90 min: reservada = verde sólido #157A54 con texto #F6F3ED («Castillo ×4» P1 19:00, «Moreno ×4» P3 19:00, «Díaz ×4» P4 20:30); clase = tinte #6FBF9C al 25 % con texto #0E5C3F («Clase · Iniciación» P1 17:30); libre = borde discontinuo de 2 px #C9C2B4. Derecha (x1180–1760): móvil con el Portal del Jugador en el navegador (PWA): cabecera «Valencia Pádel Club», día «Jueves» activo, franjas por pista y barra inferior Reservar / Partidas / Competiciones / Perfil. Etiquetas mono de 20 px en ink-500 encima de cada cara. HUD: titular arriba a la izquierda (x96, y120) en Archivo 112 %, 760, 80 px y subtítulo en Instrument Sans 40 px ink-700 (y215). Aquí aparece por primera vez el chip del reloj en versión clara (píldora #E7E2D8, texto tinta).

**Movimiento.**

- f0–f12: las cuatro pistas de «interruptor» se aplanan y encajan como columnas de la rejilla (overlay); el resto del panel aparece con vista 180 ms y el móvil sube desde y+140 (overlay 7 f). El reloj rueda 01:12 → 08:15.
- f6: titular (stagger 3 f).
- c1.t3 (f30): un anillo de toque (tinta al 20 %, 64 px) pulsa «Pista 2 · 20:30» en el portal (press 120 ms, scale 0,97).
- c1.t4 (f45): sube la hoja inferior (overlay 7 f) con el módulo marcador PISTA 2 | JUE | 20:30 y el botón verde «Confirmar reserva». El subtítulo entra en tres grupos: f45 «Sin llamadas,», f52 «sin errores,», f60 «sin dramas.»; queda hasta f112.
- c2.t1 (f60): toque en «Confirmar reserva» y celebrate de 400 ms (12 f): se dibuja el check, el botón pasa a «Reserva confirmada» (success #3D8B37) y un anillo crece de 1 a 1,15 y se desvanece.
- c2.t2 (f75): el módulo confirmado se despega de la hoja (elemento compartido) y viaja en arco bezier hasta la celda Pista 2 · 20:30 del panel, encogiéndose (overlay, 12 f).
- f87: aterriza. La celda se rellena de izquierda a derecha (6 f) con «Laura Gómez» y la etiqueta mono «NUEVA». Mismos datos, dos caras.
- c2.t3–t4: reposo.
- f112: la capa de contenido inicia el push de salida.

**Transición de salida.** Push horizontal a la izquierda, repartido entre las dos escenas para que el corte caiga en el downbeat del c.12: la saliente desplaza su contenido −960 px en sus últimos 8 f y la entrante entra desde +960 px en sus primeros 7 f (curva overlay, CameraMotionBlur de 6 muestras solo en la capa de contenido). La HUD no se mueve: sus titulares salen con vista inversa y entran los nuevos. Es la gramática fija del acto: avanza el día.

**Sonido.** f0: whoosh suave y ticks del reloj al rodar [whoosh, tick]. f30: clic de UI [click]. f45: whoosh suave de la hoja [swipe]. f60: clic + celebrate, quinta justa ascendente Do6 → Sol6 de 400 ms [click, success]. f75: whoosh corto de vuelo [swipe]. f87: el primer ping CONSONANTE del vídeo (Do6+Sol6, 150 ms), espejo de los pings disonantes del problema [ping]. f112: whoosh del push [whoosh].

### L07 · 11:20 — Detección de solapamientos — `sin-solapamientos`

**c.12–13** · 2 compases · 0:22–0:26 · frames 660–779 · energía musical 8/10

**Textos en pantalla**

- Reloj: MAR · 11:20
- Detección de solapamientos.
- Módulo A: PISTA 1 | MAR | 19:00 — Javi Martínez + 3
- Módulo B (Nueva Reserva): PISTA 1 | MAR | 19:00 — Pedro Sanz + 3
- Aviso: Pista 1 ocupada · 19:00–20:30
- Selector: Pista 1 · Ocupada / Pista 3 · Libre
- Módulo B corregido: PISTA 3 | MAR | 19:00 — Pedro Sanz + 3
- Dos partidos. Dos pistas.
- Chip: Con Padel Club OS

**Visual.** Fondo #EFECE6. Los mismos módulos de «dobles-reservas», ahora en versión clara: tarjeta #F6F3ED, borde 2 px tinta y tira verde #157A54 de 4 px a la izquierda del módulo A (reserva hecha). B llega como borrador de «Nueva Reserva» (borde discontinuo). Al chocar, el borde de B pasa a warning #C7871E y debajo aparece un aviso en línea con tinte warning (#FBF1DD, borde #EFD9AC, texto tinta) que resume el mensaje real del producto («Este horario ya está ocupado en la pista seleccionada.»). Un selector (radio 6, sombra flotante) se despliega desde la celda PISTA de B: «Pista 1 · Ocupada» en ink-400 deshabilitada y «Pista 3 · Libre» con punto verde. Al final, A y B quedan lado a lado, los dos con tira verde y check. El chip «Con Padel Club OS» (tinte #6FBF9C al 20 %, texto #0E5C3F) ocupa exactamente la posición que tenía «Ahora» en «dobles-reservas». Titular en la HUD; subtítulo en Instrument Sans 44 px ink-700.

**Movimiento.**

- f0–f7: entra el push; A ya está asentado y sus valores ruedan (f0–f10).
- f6: titular.
- f8: B entra desde x+900 (overlay 7 f) hacia el mismo hueco.
- c1.t2 (f15): se detiene en seco a 16 px de A, como contra un muro (sin rebote); su borde pasa a warning en 4 f y aparece el aviso (vista 180 ms).
- c1.t4 (f45): el cursor (flecha tinta de 28 px) hace clic en la celda PISTA de B (press) y se despliega el selector (overlay 7 f).
- f52: clic en «Pista 3 · Libre».
- c2.t1 (f60): el valor PISTA de B rueda de 1 a 3 (digit-roll 6 f); B se coloca junto a A (overlay 7 f); el borde vuelve a tinta, gana la tira verde y se dibuja el check con celebrate de 400 ms; el aviso se cierra (vista inversa). El chip «Con Padel Club OS» entra (press, sin overshoot) y entra el subtítulo; los dos quedan hasta f112. La recolocación es manual: el sistema detecta y bloquea, el gerente elige.
- c2.t2–t4: reposo.

**Transición de salida.** Push horizontal a la izquierda (mismo reparto 8 f + 7 f) en el downbeat del c.14.

**Sonido.** f8: whoosh [swipe]. f15: golpe seco y amortiguado de madera al detenerse, sin «bonk» de rebote [tock, pitch 0,6] + blip de aviso sordo (onda triangular grave, 80 ms) [buzz suave]. f45 y f52: clics [click]. f60: 3 ticks de digit-roll + celebrate a −6 dB respecto a «reserva-movil» + ping consonante [tick, success, ping]. f112: whoosh del push.

### L08 · 13:05 — Adiós al Excel — `adios-al-excel`

**c.14–15** · 2 compases · 0:26–0:30 · frames 780–899 · energía musical 8/10

**Textos en pantalla**

- Reloj: MAR · 13:05
- Adiós al Excel.
- Socios · Importar desde Excel
- IMPORTACIÓN MASIVA
- Archivo: socios_v3_FINAL.xlsx
- Filas: Laura Gómez · Javi Martínez · Pedro Sanz · Marta Ruiz · Carlos Navarro · Lucía Ferrer · Álvaro Moreno · Nuria Castillo
- Chips: Socio · Al día · Pendiente
- 342 socios importados

**Visual.** Vista «Socios» del panel (en el sidebar, «Socios» activo en el grupo Comunidad). Zona de importación con borde discontinuo de 2 px #C9C2B4 (radio 14), la etiqueta «Importar desde Excel» y el eyebrow mono «IMPORTACIÓN MASIVA». Cae dentro la misma hoja rota de «gestion-fragmentada», con sus mismos errores. Filas de socio: avatar de iniciales en círculo #E3EEE7, nombre en Instrument Sans 26 px tinta, chip «Socio» neutro y chip de cuota «Al día» (success sobre #E9F4E6) o «Pendiente» (warning sobre #FBF1DD; solo Álvaro Moreno y Nuria Castillo). Separadores de 2 px #E7E2D8. Contador mono de 96 px arriba a la derecha, tabular, con la etiqueta «socios importados».

**Movimiento.**

- f0–f7: entra el push.
- f6: titular. La hoja «socios_v3_FINAL.xlsx» cae dentro de la zona (overlay 7 f), todavía girada −3°.
- c1.t2 (f15): la hoja se endereza (−3° → 0°, 6 f) y los #¡REF! se borran (vista inversa).
- c1.t3 → c2.t1 (f30–f58): las 8 filas de la hoja se convierten una a una en filas de socio (vista 180 ms fade+4 px, stagger 4 f; sin rotaciones 3D).
- f30–f75: el contador sube de 0 a 342 (ease-out, tabular-nums).
- c2.t2 (f75): check verde junto al contador (se dibuja en 8 f).
- c2.t3–t4: reposo.

**Transición de salida.** Push horizontal a la izquierda en el downbeat del c.16.

**Sonido.** f0: golpe sordo del archivo que cae [impact suave]. f15: whoosh mínimo [swipe]. f30–f58: un tick por fila, con el tono subiendo por la escala de Do [tick]. f75: clic de confirmación + ping consonante [click, ping]. f112: whoosh del push.

### L09 · 18:40 — Ligas en tiempo real — `ligas-en-directo`

**c.16–17** · 2 compases · 0:30–0:34 · frames 900–1019 · energía musical 9/10

**Textos en pantalla**

- Reloj: MAR · 18:40
- Ligas automáticas con clasificación en tiempo real.
- Liga de Otoño · 2.ª categoría
- Resultado: Gómez / Ferrer 6 | 6 — Moreno / Martínez 4 | 3 · Guardar resultado
- Cabecera: POS · PAREJA · PJ · PG · PTS
- Antes: 1 Navarro / Sanz 6 5 11 · 2 Ruiz / Castillo 5 3 8 · 3 Gómez / Ferrer 5 2 7 · 4 Moreno / Martínez 4 1 5 · 5 Díaz / Romero 4 0 4
- Después: 1 Navarro / Sanz 6 5 11 · 2 Gómez / Ferrer 6 3 9 ▲ · 3 Ruiz / Castillo 5 3 8 · 4 Moreno / Martínez 5 1 6 · 5 Díaz / Romero 4 0 4
- Leyenda: Victoria 2 · Derrota 1
- EN DIRECTO

**Visual.** Vista «Competiciones» del panel. Cabecera «Liga de Otoño · 2.ª categoría». Tabla de clasificación con cabecera tinta #1C1A17 y texto mono #F1EDE4, filas #F6F3ED con separadores de 2 px #E7E2D8 y cifras tabulares; leyenda mono de 18 px ink-500 con el sistema de puntos real del producto (victoria 2, derrota 1). A la derecha, la tarjeta de resultado en formato módulo marcador (borde 2 px tinta, radio 10): dos filas de pareja y celdas de set 6 | 6 y 4 | 3, el marcador deportivo literal. Abajo a la derecha, un móvil pequeño con la misma tabla en el portal del jugador (pestaña Competiciones activa) y el punto verde «EN DIRECTO». Callback: son las parejas de la hoja rota «liga_otoño_BUENO (2).xlsx».

**Movimiento.**

- f0–f7: entra el push; la tabla aparece con vista (filas en stagger 3 f).
- f6: titular por palabras (queda hasta f112).
- c1.t2 (f15): entra el módulo de resultado (overlay 7 f) y los juegos se escriben con digit-roll en corcheas: f15 «6», f22 «4», f30 «6», f37 «3».
- c1.t4 (f45): toque en «Guardar resultado» (press 120 ms).
- c2.t1 (f60): la tabla se reordena con FLIP (overlay 220 ms): Gómez / Ferrer sube de 3.º a 2.º y Ruiz / Castillo baja a 3.º. Ruedan PJ 5 → 6, PG 2 → 3 y PTS 7 → 9 de Gómez / Ferrer, y PJ 4 → 5 y PTS 5 → 6 de Moreno / Martínez. La fila que sube queda con tinte verde, que se apaga en 400 ms. El móvil repite la reordenación 3 f después.
- c2.t2 → t4: el punto verde «EN DIRECTO» (#2FA075) late en cada tiempo.

**Transición de salida.** Push horizontal a la izquierda en el downbeat del c.18.

**Sonido.** f15–f37: rally de cuatro «tocs» en corcheas, uno por juego, con paneo alternado ±20 [tock]. f45: clic [click]. f60: whoosh corto de reordenación + ticks de puntos + ping consonante [swipe, tick, ping]. f112: whoosh del push.

### L10 · 20:25 — Control de cobros — `control-de-cobros`

**c.18–19** · 2 compases · 0:34–0:38 · frames 1020–1139 · energía musical 9/10

**Textos en pantalla**

- Reloj: MAR · 20:25
- Control de cobros.
- Recepción Hoy · Abierto · Martes · Valencia Pádel Club
- KPI: Reservas activas 24 · Participantes 86 · Cobrado hoy 532,00 € → 560,00 € (Según momento del cobro) · Pendiente 112,00 € → 84,00 €
- Filtros: Todas · Próximas · En pista · Cobro pendiente · Llegada pendiente
- Reserva: 20:30 · Pista 4 · Carlos Navarro +3 · Cobro pendiente → Cobrado
- Jugadores: Carlos Navarro · Sergio Vidal · Ana Torres · Raúl Prats — 7,00 € cada uno · Tarjeta / Efectivo · Cobrar
- Chip: INTEGRADOS CON VERIFACTU

**Visual.** Vista «Recepción» recreada en vectores con la captura real (public/reference/recepcion.png) como referencia de fidelidad: título «Recepción Hoy» con el chip «Abierto», fecha relativa «Martes · Valencia Pádel Club», cuatro tarjetas KPI (radio 14, icono en un cuadro de 40 px con tinte verde, cifras en Archivo 112 %, 700, tabulares, importes con el formato del producto: dos decimales, espacio fino antes de «€» y siempre por debajo de 1000) y la fila de filtros real con «Cobro pendiente» activo. Debajo, la tarjeta de la reserva de Carlos Navarro con sus 4 jugadores, cada uno con 7,00 €, selector de método (Tarjeta / Efectivo) y botón primario «Cobrar» #157A54 (radio 6), como en la Recepción real, que cobra jugador a jugador. Chip de estado de la reserva «Cobro pendiente» (warning #C7871E). Cuadran las cifras: 4 × 7,00 € = 28,00 €; 532 + 28 = 560; 112 − 28 = 84.

**Movimiento.**

- f0–f7: entra el push; las tarjetas KPI entran en cascada (vista, stagger 4 f).
- f6: titular.
- c1.t3 → c1.t4 (f30, f37, f45, f52): cuatro clics en «Cobrar», uno por corchea (press 120 ms). En cada clic la fila pasa a cobrada (botón a contorno con check) y los KPI ruedan 7,00 € (digit-roll, stagger 2 f): Cobrado hoy 532 → 539 → 546 → 553 → 560 y Pendiente 112 → 105 → 98 → 91 → 84.
- c2.t1 (f60): con el cuarto cobro la reserva queda pagada: celebrate de 400 ms; el chip «Cobro pendiente» pasa a «Cobrado» (success #3D8B37) con el check dibujado.
- c2.t2 (f75): el chip «INTEGRADOS CON VERIFACTU» sube bajo el panel (vista).
- c2.t3 (f90): la vista empieza a reducirse (1 → 0,9, ease-in), anticipando el zoom-out.

**Transición de salida.** Zoom-out en el downbeat del c.20: la Recepción se encoge hasta ser la casilla «04 COBROS» del tablero de «todo-en-uno» (overlay 220 ms).

**Sonido.** f30, f37, f45, f52: cuatro clics afinados (Do–Re–Mi–Sol) con un tick de contador cada uno [click, tick]. f60: el mismo celebrate que en la reserva, por coherencia de sistema, + ping consonante [success, ping]. f75: tick suave. f105: whoosh de zoom-out [whooshDown]. Sin caja registradora.

### L11 · 22:00 — Todo lo que tu club necesita — `todo-en-uno`

**c.20–21** · 2 compases · 0:38–0:42 · frames 1140–1259 · energía musical 9/10

**Textos en pantalla**

- Reloj: MAR · 22:00
- Todo lo que tu club necesita. Nada que no necesite.
- 01 RESERVAS · 24 hoy
- 02 SOCIOS · 342
- 03 LIGAS Y TORNEOS · En directo
- 04 COBROS · 560,00 €
- 05 PORTAL MÓVIL · Sin descargar nada
- 06 ANALÍTICAS · Ocupación 87 %
- 07 NOTICIAS Y BLOG · Blog del club
- 08 ROLES Y PERMISOS · Acceso por roles
- ACTIVA ÚNICAMENTE LO QUE UTILICES
- ACADEMIA · Clases y cuotas
- BAR Y TIENDA · Consumos
- MULTISEDE · Varias sedes
- VERIFACTU · Incluido

**Visual.** Tablero de 4×3 módulos marcador sobre arena (cada uno de 400×190, radio 10, borde 2 px tinta, fondo #F6F3ED): número mono de 22 px ink-500 arriba a la izquierda, nombre en Archivo 700 de 30 px y dato vivo en Archivo 800, tabular, verde 600, arrastrado de las escenas anteriores. La casilla 01 lleva la mini-rejilla de la landing (4 pistas × 4 franjas: sólido / tinte / discontinuo) y la 06, mini-barras de ocupación (Pista 1 92 %, Pista 2 88 %, Pista 3 85 %, Pista 4 83 %: media 87 %). Fila inferior de extras: Academia, Bar y tienda y Multisede con un interruptor de UI estándar (pista 44×24, radio 999: apagado #DDD7CC con el pomo a la izquierda; encendido #157A54 con el pomo a la derecha; el isotipo no se usa como interruptor) y VeriFactu con el chip «Incluido» (success). HUD: titular arriba (y110–220) en Archivo 112 %, 760, 72 px y la línea mono «ACTIVA ÚNICAMENTE LO QUE UTILICES» sobre la fila de extras. Sin ticker. Al final, una capa de noche #14120F sobre el contenido.

**Movimiento.**

- f0–f12: zoom-out desde la tarjeta de Recepción, que se queda como casilla 04 (overlay, asentamiento sin rebote).
- f4: titular por palabras (stagger 3 f), hasta f112.
- f0–f28: el resto de casillas 01–08 entran en semicorcheas (cada 4 f, vista fade+4 px, sin rotaciones) y su dato rueda (digit-roll).
- c1.t3 (f30): entran la fila de extras y la línea mono.
- c1.t4 (f45): se enciende Academia; f52: Bar y tienda; c2.t1 (f60): entra el chip «Incluido» de VeriFactu.
- c2.t2 (f75): el cursor pasa por encima de Multisede y no lo activa (un club, una sede): la demostración de «activa únicamente lo que utilices».
- c2.t3 (f90): se hace de noche: la capa #14120F sube de 0 a 60 % en 30 f sobre el contenido; la HUD queda por encima.

**Transición de salida.** Corte seco en el downbeat del c.22 a la noche de «tu-descansas» (#14120F).

**Sonido.** f0: whoosh de zoom-out [whooshDown]. f0–f28: ticks cortos de entrada (−26 dB) [tick]. f45, f52, f60: clics afinados Do, Mi y Sol, las tres primeras notas del motivo de marimba [click con pitch]. f75: silencio intencionado donde tocaría la cuarta nota (Multisede no se activa). f90–f119: barrido descendente del filtro de la música hacia el breakdown.

### L12 · 23:47 — Tú descansas (BREAKDOWN) — `tu-descansas`

**c.22–23** · 2 compases · 0:42–0:46 · frames 1260–1379 · energía musical 3/10

**Textos en pantalla**

- 23:47
- Reloj: MAR · 22:00 → 23:47 (hora en verde; el chip crece hasta ser el reloj gigante)
- Ellos reservan desde el móvil; tú descansas.
- Tarjeta del panel: PANEL DEL CLUB · RESERVAS · VIERNES
- Confirmada automáticamente
- Nuria Castillo · Pista 4 · Vie 19:00

**Visual.** Rima visual exacta con el fotograma 0 de «mensajes-a-deshora»: fondo #14120F, «23:47» en JetBrains Mono de 300 px en la misma posición (x160, y150–450), sin parpadeo: es el chip del reloj, que ha vuelto a crecer. A la derecha, el mismo móvil en la misma posición, boca arriba y con la pantalla APAGADA (#1E1B17 con un reflejo tenue): ni notificación, ni luz, ni vibración. Bajo el reloj, el titular en Archivo 112 %, 720, 80 px, #F1EDE4, en dos líneas (y500–700). Debajo (y780–940), una tarjeta del panel en modo oscuro (#1E1B17, borde 2 px #37322A, radio 14): eyebrow mono «PANEL DEL CLUB · RESERVAS · VIERNES», una fila de 4 celdas (Pista 1–4, 19:00) y, cuando llega la reserva, la línea principal «Confirmada automáticamente» en Archivo 700 de 40 px #F1EDE4 con check #6FBF9C y la secundaria «Nuria Castillo · Pista 4 · Vie 19:00» en Instrument Sans 26 px #C9C2B4. Al empezar, la hora del chip va en verde #6FBF9C (no en el rojo suave de la noche anterior) y se funde a #F1EDE4 mientras crece.

**Movimiento.**

- f0–f12: el chip del reloj rueda de 22:00 a 23:47 y, en el mismo gesto, crece y viaja hasta la posición del reloj gigante del principio (overlay 12 f): el inverso exacto de «mensajes-a-deshora».
- f12–f14: quietud; el silencio es el mensaje.
- c1.t2 (f15): aparece la tarjeta del panel (vista 180 ms), sin sonido.
- f22–f34: la celda Pista 4 · 19:00 se rellena sola de verde #2FA075 (de izquierda a derecha, 12 f) y aparece «Confirmada automáticamente» con su check (8 f). Nadie la toca: no hay cursor ni celebrate.
- c1.t3 (f30): el titular entra palabra a palabra con stagger de 4 f, más lento que en el problema, y se queda hasta f119.
- c2: nada se mueve. El móvil sigue apagado y el reloj no cambia.

**Transición de salida.** Corte seco a arena en el downbeat del c.24, donde arranca el build.

**Sonido.** Sin vibración ni ping, a propósito. Solo el pad y el piano del breakdown y un «tic» de reloj por tiempo a −30 dB (el motivo de «mensajes-a-deshora», ahora en tonalidad mayor) [tick]. Swell invertido en c2.t4.

### L13 · Configura en 5 minutos (BUILD) — `configura-en-5-minutos`

**c.24–26** · 3 compases · 0:46–0:52 · frames 1380–1559 · energía musical 7/10

**Textos en pantalla**

- Configura tu club en 5 minutos.
- 01 Crea tu cuenta
- 02 Configura tus pistas
- 03 Empieza a gestionar
- Cronómetro: 00:00 → 04:52
- TOTAL · 5 min
- Burbuja: Ya podéis reservar: — tarjeta de enlace «Valencia Pádel Club · padelclubos.com»
- Si sabes usar WhatsApp, sabes usar Padel Club OS.

**Visual.** Arena #F6F3ED. El módulo marcador a tamaño héroe en el centro (1320×360, y380–740): las cabeceras mono son 01 / 02 / 03 en lugar de PISTA / FECHA / HORA, los valores van en Instrument Sans 600, 44 px, tinta, cada uno con check verde #157A54, y la fila de total es tinta #1C1A17 con «TOTAL · 5 min» en JetBrains Mono #6FBF9C a la izquierda y el cronómetro en JetBrains Mono 44 px #F1EDE4, tabular, a la derecha. El chip del reloj se oculta (el protagonista es el módulo). Bajo la celda 03 (y800–960), una burbuja de chat saliente genérica (#EFECE6, borde 2 px #DDD7CC, radio 14, sin verde de WhatsApp) con una tarjeta de enlace (isotipo de 32 px, «Valencia Pádel Club» y el dominio «padelclubos.com» en mono): no se muestra ninguna ruta inventada. Titulares en la HUD (y150–300), Archivo 112 %, 760, 80 px.

**Movimiento.**

- f0: corte seco a arena. Titular A por palabras (stagger 3 f), hasta f68. El borde del módulo se dibuja (stroke-dashoffset, 12 f) y el cronómetro arranca, lineal, de 00:00 a 04:52 entre f0 y f105.
- c1.t2 (f15): celda 01 (valor con vista + check dibujado en 8 f).
- c1.t4 (f45): celda 02.
- f72: titular B «Si sabes usar WhatsApp, sabes usar Padel Club OS.» por palabras (stagger 3 f), hasta f172.
- c2.t2 (f75): celda 03.
- c2.t3 (f90): la burbuja con el enlace sale de la celda 03 (overlay 7 f): compartir el link es un mensaje más.
- c2.t4 (f105): el cronómetro se detiene en 04:52 y la fila «TOTAL · 5 min» recibe su check (press).
- c3 (f120–f171): reposo; las etiquetas del módulo bajan al 60 % para que manden el titular y la burbuja.
- f172–f179: imagen congelada, en silencio (última corchea).

**Transición de salida.** Corte seco a fondo tinta en el downbeat del c.27: el golpe final.

**Sonido.** f15, f45, f75: un clic de UI por celda [click]. f90: swoosh de envío suave [swipe]. f105: «clack» corto al parar el cronómetro [click, pitch 0,8]. Tic mono del cronómetro en corcheas (−28 dB) entre f0 y f105 [tick]. La caja del build pasa de corcheas (c.25) a semicorcheas (c.26) con riser. Silencio entre f172 y f179.

### L14 · Tu club no puede esperar más (GOLPE FINAL) — `cta`

**c.27–30** · 4 compases · 0:52–1:00 · frames 1560–1799 · energía musical 10/10

**Textos en pantalla**

- Tu club no puede esperar más.
- PadelClub OS (logotipo oficial)
- Empieza hoy. Es gratis durante 14 días.
- Solicitar demo gratuita
- Sello: Sin tarjeta de crédito | Sin permanencia | Configura en 5 minutos — padelclubos.com
- HECHO EN ESPAÑA · INTEGRADOS CON VERIFACTU

**Visual.** c.1–c.2: fondo tinta #1C1A17 con el titular centrado en Archivo 112 %, 800, 120 px, #F6F3ED; su punto final es el bloque del isotipo (#2FA075, variante oscura oficial). Desde c.2 t.2, tarjeta final sobre arena #F6F3ED: lockup oficial claro centrado en y≈240 (96 px de alto); subtítulo en Archivo 112 %, 700, 64 px, tinta, en y≈380; botón primario #157A54 (radio 10, 88 px de alto, «Solicitar demo gratuita» en Instrument Sans 600 de 34 px #F6F3ED) en y≈520; debajo, el módulo marcador como sello de confianza (1200×190, y640–830): tres celdas con check verde y una fila de total tinta con «padelclubos.com» en JetBrains Mono 44 px #F1EDE4. Abajo a la izquierda (y1000), la firma mono de 20 px #8A8377 «HECHO EN ESPAÑA · INTEGRADOS CON VERIFACTU». Sin precios.

**Movimiento.**

- c1.t1 (f0): GOLPE. El titular entra por palabras en corcheas (f0, 7, 15, 22, 30), cada una con press (scale 1,04 → 1, sin rebote).
- c1.t4 (f45): el punto final aterriza como el bloque verde del isotipo (press): el interruptor, encendido.
- c2.t2 (f75): ese mismo bloque cruza la pantalla de izquierda a derecha como barrido (1920 px en 8 f, curva overlay) y descubre la tarjeta final.
- f80: lockup (vista).
- f90: subtítulo.
- f105: el botón hace un press, como si alguien lo pulsara (scale 0,98 → 1).
- c3.t1 (f120): el sello dibuja su borde (10 f), sus celdas entran con stagger 3 f y se dibujan los checks.
- f135–f165: la URL se escribe en la fila de total (2 f por carácter, cursor mono).
- f150: la firma entra con vista.
- c4 (f180–f239): todo FIJO durante 2 s: el último fotograma queda limpio para leer y como portada.

**Transición de salida.** Fin. El último fotograma (f1799) es la tarjeta final completa y estática, sin fundido a negro.

**Sonido.** f0: golpe final con Do add9 completo, sub boom, crash filtrado y «toc» de pala [impact, tock]. f45: «toc» corto, el punto [tock]. f75: whoosh + «clack» doble del interruptor, en rima con «interruptor» [whoosh, click×2]. f105: clic de UI [click]. f120: acorde final sostenido. f135–f165: tecleo muy suave [type]. f180: un último «toc» seco, la firma sonora [tock]. La cola se apaga con un fade de 12 f antes de f1795.

## 5. Escena a escena · 9:16

Zonas seguras: nada importante por encima de y=250 ni por debajo de y=1520; texto con x ≤ 960 (botones de la plataforma). El fotograma 0 ya tiene contenido y nunca hay más de 12 palabras en pantalla a la vez. Sin reloj de esquina.

### V01 · Gancho 23:47 — `mensajes-a-deshora`

**c.1** · 1 compás · 0:00–0:02 · frames 0–59 · mismo componente que en 16:9, maqueta vertical y versión de 1 compás

**Textos en pantalla**

- 23:47
- ¿Otra reserva por WhatsApp?
- Burbuja (avatar JM): ¿Pista 1 mañana, 19:00?
- Badge: 38

**Visual.** Fondo #14120F. «23:47» en JetBrains Mono de 240 px #F1EDE4, centrado en y290–500. Chat genérico a toda la anchura, sin marco de móvil (x72–1008, y560–1220): burbujas esqueleto #282420 (avatar y barras, sin texto) y una sola legible, con el avatar «JM» (Instrument Sans 44 px). Badge píldora #E08A7A con «38» en la cabecera del chat. Titular en y1260–1480 (Archivo 112 %, 760, 84 px, máximo 2 líneas, x72–960). Sin reloj de esquina. Ni un píxel verde. En pantalla: 10 palabras.

**Movimiento.**

- f0: TODO ya visible, sin fundido: el fotograma 0 es el gancho y la miniatura. Las burbujas esqueleto empujan hacia arriba en cada corchea (cada 7–8 f, curva overlay) y el badge rueda de 12 a 38 (f0–f40). Vibración de ±4 px en f0 y f30.
- t.4 (f45): la burbuja de Javi se contornea en #E08A7A y se desprende hacia el centro (match cut con «dobles-reservas»). El titular se queda hasta f59.
- Audio: la pista ya suena desde f0 (ostinato, pings disonantes en corcheas y vibración).

### V02 · Dobles reservas — `dobles-reservas`

**c.2** · 1 compás · 0:02–0:04 · frames 60–119 · mismo componente que en 16:9, con la variante apilada: un solo módulo y dos filas de total

**Textos en pantalla**

- Dobles reservas.
- PISTA 1 | MAR | 19:00
- Javi + 3
- Pedro + 3

**Visual.** Fondo #14120F. Titular en y300–420 (Archivo 112 %, 760, 96 px). Un módulo marcador de 936 px de ancho (etiquetas mono de 22 px, valores en Archivo 800 de 96 px, tabulares) en y640–1180 con dos filas de total apiladas: «Javi + 3» y «Pedro + 3», el mismo hueco para dos grupos. Trama diagonal #E08A7A sobre las dos filas. Sin el chip «Ahora» (presupuesto de palabras). En pantalla: 12 palabras.

**Movimiento.**

- f0: la burbuja aterriza y se convierte en el módulo (overlay 7 f); sus valores ruedan (digit-roll).
- t.2 (f15): la segunda fila «Pedro + 3» entra de golpe desde abajo (overlay 7 f) en el mismo hueco.
- t.3 (f30): impacto, con temblor de ±8 px durante 6 f; el borde pasa a #E08A7A y aparece la trama.
- t.4 (f45): el módulo cae fuera de cuadro (ease-in 12 f). Titular de f0 a f52.
- Audio: golpe de error y «toc» metálico en f30.

### V03 · Competiciones en Excel — `competiciones-en-excel`

**c.3** · 1 compás · 0:04–0:06 · frames 120–179 · escena solo vertical: reutiliza la hoja de «gestion-fragmentada» y el contorno de «suena-familiar»

**Textos en pantalla**

- Competiciones en Excel.
- liga_otoño_BUENO (2).xlsx
- #¡REF!

**Visual.** Fondo #14120F. Hoja genérica a toda la anchura (x72–1008, y520–1180), rotada −2°: rejilla de 2 px #37322A con celdas esqueleto, salvo la columna PTS, donde aparece «#¡REF!» en #E08A7A. Titular en y300–420 (Archivo 112 %, 760, 96 px). Después, el contorno vacío del isotipo (320×224, rx 56, trazo de 24 px #F1EDE4) centrado en y≈850. En pantalla: 5 palabras.

**Movimiento.**

- f0: titular (stagger 4 f) y la hoja cae (overlay 7 f).
- f6–f30: los errores se propagan en semicorcheas.
- t.3 (f30): la hoja es succionada al centro (scale → 0, 12 f, ease-in exponencial) mientras se dibuja el contorno (10 f); el titular se queda hasta f33 y sale entre f34 y f40.
- t.4 (f45–f59): solo el contorno vacío, quieto.
- Audio: riser y reverse cymbal hasta t.3, un único «toc» en f45 y silencio en la última corchea.

### V04 · El interruptor (DROP) — `interruptor`

**c.4** · 1 compás · 0:06–0:08 · frames 180–239 · mismo componente que en 16:9; en vertical solo se usa su primer compás, el lockup, sin H1 ni pista

**Textos en pantalla**

- PadelClub OS (logotipo oficial)

**Visual.** El bloque verde #157A54 entra en el contorno y el fondo pasa a arena #F6F3ED con un barrido. Lockup horizontal oficial a 900 px de ancho, centrado en y≈860. Nada más: en vertical el drop es solo la marca.

**Movimiento.**

- f0, en el downbeat del drop: el bloque entra en su sitio (overlay 7 f, sin overshoot) junto con el barrido arena (clip-path, 7 f).
- f8–f24: el isotipo baja a su tamaño en el lockup, el wordmark se revela con máscara y el chip «OS» entra con press.
- f24–f52: quieto (1 s de recuerdo de marca).
- f52–f59: el lockup se reduce y sale con vista inversa.
- Audio: drop, «clack» de interruptor y «toc».

### V05 · Reserva desde el móvil, sin descargar nada — `reserva-movil`

**c.5–6** · 2 compases · 0:08–0:12 · frames 240–359 · mismo componente que en 16:9, maqueta vertical: solo la cara del jugador

**Textos en pantalla**

- Reservas 24/7 desde el móvil.
- Sin descargar nada.
- Portal: Jueves · 20:30
- Hoja: PISTA 2 | JUE | 20:30
- Confirmar reserva → Reserva confirmada

**Visual.** El Portal del Jugador a pantalla completa y sin marco (en vertical es su formato natural), x0–1080, y480–1520: cabecera con el avatar del club y el día «Jueves»; rejilla de franjas en 4 columnas (numeradas 1–4 en mono) donde lo ocupado es un bloque #DDD7CC sin texto y lo libre, borde discontinuo de 2 px #C9C2B4; solo la franja tocada muestra «20:30». Barra inferior solo con iconos (sin etiquetas), decorativa. La hoja inferior (y900–1480) lleva el módulo marcador PISTA 2 | JUE | 20:30 (valores de 96 px) y el botón verde «Confirmar reserva» de 760×110; cuando sube, un velo tinta al 40 % cubre la rejilla. Titulares en y280–440 (Archivo 112 %, 760, 88 px). Máximo en pantalla: 11 palabras.

**Movimiento.**

- c1.t1 (f0): el portal entra (vista 6 f) y el titular A por palabras (stagger 3 f), hasta f56.
- c1.t3 (f30): toque en la franja libre «20:30» de la columna 2 (press).
- c2.t1 (f60): sube la hoja (overlay 7 f) con el velo; el titular cambia a «Sin descargar nada.» (vista), hasta f119.
- c2.t2 (f75): toque en «Confirmar reserva» y celebrate de 400 ms: check dibujado, success #3D8B37, «Reserva confirmada».
- c2.t3–t4: reposo.
- Audio: clics en f30 y f75, celebrate en f75 y ping consonante en f87.

### V06 · Sin dobles reservas — `sin-solapamientos`

**c.7–8** · 2 compases · 0:12–0:16 · frames 360–479 · mismo componente que en 16:9, maqueta vertical

**Textos en pantalla**

- Sin dobles reservas.
- Dos partidos. Dos pistas.
- Módulo: PISTA 1 → 3 | MAR | 19:00
- Chip: Ocupada → Confirmada

**Visual.** Fondo arena #EFECE6. La reserva de Javi es una silueta: un bloque verde 600 sin texto, con tira verde, en y560–760. El módulo B en versión clara (tarjeta #F6F3ED, borde 2 px tinta, 936 px de ancho) en y820–1180, con el chip warning «Ocupada» debajo, que después pasa a chip success «Confirmada». Titulares en y280–440. Máximo en pantalla: 11 palabras.

**Movimiento.**

- f0: titular A «Sin dobles reservas.», hasta f56.
- t.2 (f15): B sube desde abajo hacia el hueco ocupado y se detiene en seco a 16 px (sin rebote); su borde pasa a warning (4 f) y en f20 aparece «Ocupada» (vista).
- c1.t4 (f45): toque en la celda PISTA (press).
- c2.t1 (f60): el valor PISTA rueda de 1 a 3 (digit-roll 6 f), B se asienta con check, el borde vuelve a tinta y el chip pasa a «Confirmada» con celebrate de 400 ms; el titular cambia a «Dos partidos. Dos pistas.», hasta f119.
- c2.t2–t4: reposo.
- Audio: golpe seco de madera en f15, aviso sordo en f20, clic en f45, ticks y celebrate en f60.

### V07 · Ligas en tiempo real — `ligas-en-directo`

**c.9–10** · 2 compases · 0:16–0:20 · frames 480–599 · mismo componente que en 16:9, maqueta vertical: tres filas y una sola pareja con nombre

**Textos en pantalla**

- Ligas en tiempo real.
- 6-4 6-3
- 1 · 2 · 3
- Gómez / Ferrer
- 7 → 9

**Visual.** Arena. Titular en y280–440. Módulo de resultado en y500–740: dos filas con pares de avatares (sin nombres) y celdas de set 6 | 6 y 4 | 3. Debajo (y800–1400), tres filas altas de clasificación: número de posición en mono de 56 px y pareja como dos círculos de avatar; solo la fila protagonista lleva nombre («Gómez / Ferrer») y puntos (Archivo 800 de 72 px, tabular); las demás son siluetas. Punto verde «en directo» sin texto. Máximo en pantalla: 12 palabras.

**Movimiento.**

- f0: titular (hasta f119) y tabla con vista.
- t.2 (f15): el módulo de resultado entra; los juegos se escriben con digit-roll en corcheas (f15, 22, 30, 37).
- t.4 (f45): toque en guardar (press).
- c2.t1 (f60): reordenación FLIP: Gómez / Ferrer sube de 3.º a 2.º (overlay 220 ms), sus puntos ruedan de 7 a 9 y el tinte verde se apaga en 400 ms.
- Desde c2.t2, el punto verde late en cada tiempo.
- Audio: rally de 4 «tocs», clic, whoosh y ping consonante.

### V08 · 23:47 — Tú descansas (BREAKDOWN) — `tu-descansas`

**c.11–12** · 2 compases · 0:20–0:24 · frames 600–719 · mismo componente que en 16:9, maqueta vertical sin el móvil

**Textos en pantalla**

- 23:47
- Confirmada automáticamente
- Pista 4 · Vie 19:00
- Ellos reservan. Tú descansas.

**Visual.** Rima exacta con el gancho: fondo #14120F y «23:47» en la misma posición y tamaño (y290–500), sin parpadeo. En el centro (y640–960), la tarjeta oscura del panel: la celda que se rellena sola, «Confirmada automáticamente» (Archivo 700, 48 px) y «Pista 4 · Vie 19:00» (Instrument Sans 36 px #C9C2B4). Titular en y1260–1480, el mismo sitio que el del gancho. En pantalla: 11 palabras.

**Movimiento.**

- f0–f14: todo quieto.
- c1.t2 (f15): la tarjeta aparece (vista); entre f22 y f34 la celda se rellena sola y se dibuja el check.
- c1.t3 (f30): el titular entra palabra a palabra (stagger 4 f) y se queda hasta f119.
- c2: quietud.
- Audio: sin pings; pad y piano del breakdown, tic de reloj a −30 dB, swell invertido en el último tiempo y silencio en la última corchea.

### V09 · Tu club no puede esperar más (GOLPE FINAL) — `cta`

**c.13–15** · 3 compases · 0:24–0:30 · frames 720–899 · mismo componente que en 16:9, maqueta vertical y versión de 3 compases

**Textos en pantalla**

- Tu club no puede esperar más.
- PadelClub OS (logotipo oficial)
- Prueba gratuita 14 días — sin tarjeta
- Solicitar demo
- padelclubos.com

**Visual.** c.1: fondo tinta #1C1A17 con el titular centrado en 3 líneas (Archivo 112 %, 800, 110 px, #F6F3ED) en y760–1120; su punto final es el bloque verde. Desde c.2 t.2, tarjeta final en arena: lockup oficial de 860 px de ancho en y360–470; badge píldora «Prueba gratuita 14 días — sin tarjeta» (borde 2 px #DDD7CC, Instrument Sans 600 de 40 px, tinta) en y600–690; botón #157A54 «Solicitar demo» de 760×120 (radio 10, Instrument Sans 600 de 48 px #F6F3ED) en y820–940; y la fila de total del módulo marcador, tinta, con «padelclubos.com» en JetBrains Mono de 56 px #F1EDE4, en y1040–1160. Todo entre y250 e y1520, con el texto en x ≤ 960. En pantalla: 11 palabras.

**Movimiento.**

- c1.t1 (f0): GOLPE. El titular entra por palabras en corcheas (press, scale 1,04 → 1) y se mantiene hasta f75.
- f45: el punto final aterriza como bloque verde.
- c2.t2 (f75): el bloque cruza la pantalla como barrido (8 f) y descubre la tarjeta final.
- f80: lockup (vista).
- f90: badge.
- f105: el botón hace press.
- f120–f150: la URL se escribe en la fila de total (2 f por carácter).
- f150–f179: completamente FIJO (último segundo limpio).
- Audio: golpe final en f0, «toc» en f45, «clack» del interruptor en f75, clic en f105, acorde final y «toc» de firma en f120 y cola que se apaga antes de f895.

## 6. Dirección musical

Música original generada por código (audio/generate.py + audio/synth.py; WAV 48 kHz/24 bit, con stems de música y SFX) a 120 BPM exactos en 4/4: 1 compás = 2 s = 60 f; 1 tiempo = 15 f. El arreglo es un dato (audio/arrangement.py) que lee out/timeline.json, generado con las mismas constantes BAR/BEAT que Remotion: cortes, golpes y SFX salen de una única fuente. Tonalidad: La menor en el problema y Do mayor (su relativo) desde el drop; misma raíz armónica, así que el motivo «se resuelve» en vez de cambiar de canción. Progresión desde el drop: | Do | Sol | Lam | Fa |, un acorde por compás; cada cambio de escena de producto cae en Do o en Lam.

16:9 (30 compases). c.1–6 TENSIÓN («mensajes-a-deshora», «dobles-reservas», «gestion-fragmentada»; energía 2→5): dron sub en La1, «tic» de reloj seco en negras (−24 dB) y pluck filtrado La–Do–Mi–Si en corcheas (LPF de 600 Hz que se abre hasta 3 kHz en c.6). Pings DISONANTES (La5+Si♭5) en cada mensaje. En c.3, bombo half-time (tiempos 1 y 3), pad de La menor con Si♭ encima (tensión de semitono) y bajo en corcheas; c.4 t.1, golpe de error. En c.5–6, ghost snares; riser desde c.6.

c.7 BUILD («suena-familiar»): riser y reverse cymbal culminan en t.3; t.4 es SILENCIO total salvo un «toc» seco.

c.8 DROP («interruptor», 0:14): Do mayor. Bombo 4/4 limpio (house ligero, no EDM agresivo), palmas en 2 y 4, shaker en semicorcheas, bajo sincopado y piano eléctrico FM; en el downbeat, «clack» doble de interruptor y «toc». El «toc» de pádel queda como percusión en el «y» del 4.

c.10–21 GROOVE de producto («reserva-movil» → «todo-en-uno»; energía 8→9). Desde c.10 el ping pasa a CONSONANTE (Do6+Sol6) y el celebrate es una quinta justa ascendente Do6→Sol6 de 400 ms, solo en confirmaciones de reserva o pago. En c.14 entra un motivo de marimba de 4 notas con el mismo contorno que el pluck del problema, ahora en mayor (Do–Mi–Sol–Si). En c.16–17, rally de «tocs» en corcheas con los juegos de la liga. En c.18–19, los cuatro clics de cobro afinados (Do–Re–Mi–Sol). En c.20–21, el pico: los clics de los interruptores, afinados en la pentatónica de Do, rematan el motivo; en c.21 t.3–t.4, barrido descendente del filtro.

c.22–23 BREAKDOWN («tu-descansas», 0:42; energía 3): fuera batería y bajo. Pad Fa maj7 → Sol sus4 y piano sostenido; tic de reloj a −30 dB (el motivo de las 23:47, ahora en mayor). Ningún ping. Swell invertido en c.23 t.4.

c.24–26 BUILD («configura-en-5-minutos»; energía 5→7): bombo en negras desde c.24, caja en corcheas en c.25 y en semicorcheas en c.26, barrido de filtro y riser; armonía Lam → Fa → Sol. La última corchea de c.26 va en silencio.

c.27 t.1 GOLPE FINAL («cta», 0:52): Do add9 completo, sub boom, crash filtrado y «toc». c.27–28: groove de cierre (bombo, piano y «toc» en el 4); c.28 t.2, whoosh + «clack» del interruptor (rima con el drop). c.29–30 OUTRO: c.29 t.1, acorde final sostenido; c.30 t.1, último «toc» de firma; fade de 12 f que termina antes de f1799.

9:16 (15 compases), mismo motor y otro arreglo (sin crossfades): c.1–2, tensión ya en marcha desde f0 (ostinato, pings disonantes y bombo half-time: no hay intro lenta porque es el gancho); c.3, build con riser, un «toc» en t.4 y silencio en la última corchea; c.4, DROP (0:06); c.5–10, groove (marimba desde c.7); c.11–12, breakdown (0:20), con silencio en la última corchea de c.12; c.13 t.1, golpe final (0:24); c.13–14, groove de cierre con whoosh + «clack» en c.14 t.2; c.15 t.1, acorde final + «toc» de firma y cola que se apaga antes de f895.

SFX (sintetizados en audio/synth.py, afinados a la tonalidad y de una misma familia; entre corchetes, el nombre en src/sfx.ts): «toc» de pala = seno de 1,1 kHz con caída a 650 Hz en 25 ms + transitorio de ruido de 3 ms, con variante metálica «valla» para errores [tock]; whoosh = ruido rosa con paso-banda de 300 Hz a 3 kHz, 250 ms [whoosh/whooshDown/swipe]; clic de UI = ruido de 2 ms + blip de 4 kHz [click]; ping disonante La5+Si♭5 / consonante Do6+Sol6, 150 ms [ping con n1/n2]; celebrate Do6→Sol6, 400 ms [success]; error = 70 Hz + clúster de 120 ms [buzz]; vibración = cuadrada de 150 Hz con AM a 25 Hz [nuevo]; «clack» de interruptor = doble clic mecánico, solo en el drop y en el CTA [click×2 o nuevo]; tic de reloj y contadores [tick]; tecleo [type]; riser [riser]; golpes [impact]. Máximo de ~3 SFX por segundo.

Mezcla: sidechain de pad y bajo al bombo; SFX 4–6 dB por debajo del bus de música salvo los golpes clave (drop, error, golpe final); en el acto del problema los SFX suben 2–3 dB (el ruido es el protagonista). Master a −14 LUFS integrados y −1 dBTP. Sin voces, sin samples de estadio, sin caja registradora.

### Arreglo por secciones · 16:9

| Sección | Compases | Segundo de inicio | Frame de inicio | `bar` en arrangement.py | Escenas |
|---|---|---|---|---|---|
| tension | c.1–6 | 0:00 | 0 | 0 (6) | mensajes-a-deshora · dobles-reservas · gestion-fragmentada |
| build | c.7 | 0:12 | 360 | 6 (1) | suena-familiar (silencio en t.4) |
| drop | c.8–9 | 0:14 | 420 | 7 (2) | interruptor |
| groove | c.10–21 | 0:18 | 540 | 9 (12) | reserva-movil → todo-en-uno (marimba desde c.14) |
| breakdown | c.22–23 | 0:42 | 1260 | 21 (2) | tu-descansas |
| build | c.24–26 | 0:46 | 1380 | 23 (3) | configura-en-5-minutos (silencio en la última corchea) |
| drop | c.27–28 | 0:52 | 1560 | 26 (2) | cta, golpe final y groove de cierre |
| outro | c.29–30 | 0:56 | 1680 | 28 (2) | cta, acorde final y «toc» de firma |

### Arreglo por secciones · 9:16

| Sección | Compases | Segundo de inicio | Frame de inicio | `bar` en arrangement.py | Escenas |
|---|---|---|---|---|---|
| tension | c.1–2 | 0:00 | 0 | 0 (2) | mensajes-a-deshora · dobles-reservas |
| build | c.3 | 0:04 | 120 | 2 (1) | competiciones-en-excel (silencio en la última corchea) |
| drop | c.4 | 0:06 | 180 | 3 (1) | interruptor |
| groove | c.5–10 | 0:08 | 240 | 4 (6) | reserva-movil · sin-solapamientos · ligas-en-directo (marimba desde c.7) |
| breakdown | c.11–12 | 0:20 | 600 | 10 (2) | tu-descansas |
| drop | c.13–14 | 0:24 | 720 | 12 (2) | cta, golpe final y groove de cierre |
| outro | c.15 | 0:28 | 840 | 14 (1) | cta, acorde final y «toc» de firma |

## 7. Control de legibilidad

Regla: cada texto que carga mensaje permanece al menos 0,35 s por palabra: `minFrames = ceil(palabras × 0,35 × 30)`. Ventana = desde la entrada de la primera palabra hasta el inicio de su salida (frames locales). Este cálculo se valida en build y hace fallar el render si algún texto no llega.

| Formato | Escena | Texto | Palabras | Mínimo (f) | Ventana (f) | Resultado |
|---|---|---|---|---|---|---|
| 16:9 | `mensajes-a-deshora` | LUNES · VALENCIA PÁDEL CLUB | 4 | 42 | 0–45 = 45 (1,50 s) | OK |
| 16:9 | `mensajes-a-deshora` | Mensajes a deshora. | 3 | 32 | 50–112 = 62 (2,07 s) | OK |
| 16:9 | `dobles-reservas` | Dobles reservas. | 2 | 21 | 0–112 = 112 (3,73 s) | OK |
| 16:9 | `dobles-reservas` | Dos partidos. Una pista. | 4 | 42 | 60–112 = 52 (1,73 s) | OK |
| 16:9 | `gestion-fragmentada` | Un Excel para socios, otro para pagos, WhatsApp para comunicar. | 10 | 105 | 0–110 = 110 (3,67 s) | OK |
| 16:9 | `suena-familiar` | ¿Suena familiar? | 2 | 21 | 0–30 = 30 (1,00 s) | OK |
| 16:9 | `interruptor` | Todas las herramientas para tu club. | 6 | 63 | 30–105 = 75 (2,50 s) | OK |
| 16:9 | `reserva-movil` | Reservas 24/7 online. | 3 | 32 | 6–112 = 106 (3,53 s) | OK |
| 16:9 | `reserva-movil` | Sin llamadas, sin errores, sin dramas. | 6 | 63 | 45–112 = 67 (2,23 s) | OK |
| 16:9 | `reserva-movil` | PORTAL DEL JUGADOR · SIN DESCARGAR NADA | 6 | 63 | 6–112 = 106 (3,53 s) | OK |
| 16:9 | `sin-solapamientos` | Detección de solapamientos. | 3 | 32 | 6–112 = 106 (3,53 s) | OK |
| 16:9 | `sin-solapamientos` | Pista 1 ocupada · 19:00–20:30 | 4 | 42 | 15–60 = 45 (1,50 s) | OK |
| 16:9 | `sin-solapamientos` | Dos partidos. Dos pistas. | 4 | 42 | 60–112 = 52 (1,73 s) | OK |
| 16:9 | `adios-al-excel` | Adiós al Excel. | 3 | 32 | 6–112 = 106 (3,53 s) | OK |
| 16:9 | `adios-al-excel` | 342 socios importados | 3 | 32 | 30–112 = 82 (2,73 s) | OK |
| 16:9 | `ligas-en-directo` | Ligas automáticas con clasificación en tiempo real. | 7 | 74 | 6–112 = 106 (3,53 s) | OK |
| 16:9 | `control-de-cobros` | Control de cobros. | 3 | 32 | 6–112 = 106 (3,53 s) | OK |
| 16:9 | `control-de-cobros` | INTEGRADOS CON VERIFACTU | 3 | 32 | 75–112 = 37 (1,23 s) | OK |
| 16:9 | `todo-en-uno` | Todo lo que tu club necesita. Nada que no necesite. | 9 | 95 | 4–112 = 108 (3,60 s) | OK |
| 16:9 | `todo-en-uno` | ACTIVA ÚNICAMENTE LO QUE UTILICES | 5 | 53 | 30–112 = 82 (2,73 s) | OK |
| 16:9 | `tu-descansas` | Confirmada automáticamente · Nuria Castillo · Pista 4 · Vie 19:00 | 8 | 84 | 22–120 = 98 (3,27 s) | OK |
| 16:9 | `tu-descansas` | Ellos reservan desde el móvil; tú descansas. | 7 | 74 | 30–120 = 90 (3,00 s) | OK |
| 16:9 | `configura-en-5-minutos` | Configura tu club en 5 minutos. | 6 | 63 | 0–68 = 68 (2,27 s) | OK |
| 16:9 | `configura-en-5-minutos` | Si sabes usar WhatsApp, sabes usar Padel Club OS. | 9 | 95 | 72–172 = 100 (3,33 s) | OK |
| 16:9 | `configura-en-5-minutos` | Ya podéis reservar: · Valencia Pádel Club · padelclubos.com | 7 | 74 | 90–180 = 90 (3,00 s) | OK |
| 16:9 | `cta` | Tu club no puede esperar más. | 6 | 63 | 0–75 = 75 (2,50 s) | OK |
| 16:9 | `cta` | Empieza hoy. Es gratis durante 14 días. | 7 | 74 | 90–240 = 150 (5,00 s) | OK |
| 16:9 | `cta` | Sin tarjeta de crédito · Sin permanencia · Configura en 5 minutos | 10 | 105 | 120–240 = 120 (4,00 s) | OK |
| 16:9 | `cta` | HECHO EN ESPAÑA · INTEGRADOS CON VERIFACTU | 6 | 63 | 150–240 = 90 (3,00 s) | OK |
| 9:16 | `mensajes-a-deshora` | ¿Otra reserva por WhatsApp? | 4 | 42 | 0–60 = 60 (2,00 s) | OK |
| 9:16 | `mensajes-a-deshora` | ¿Pista 1 mañana, 19:00? | 4 | 42 | 0–60 = 60 (2,00 s) | OK |
| 9:16 | `dobles-reservas` | Dobles reservas. | 2 | 21 | 0–52 = 52 (1,73 s) | OK |
| 9:16 | `competiciones-en-excel` | Competiciones en Excel. | 3 | 32 | 0–34 = 34 (1,13 s) | OK |
| 9:16 | `interruptor` | PadelClub OS | 2 | 21 | 8–52 = 44 (1,47 s) | OK |
| 9:16 | `reserva-movil` | Reservas 24/7 desde el móvil. | 5 | 53 | 0–56 = 56 (1,87 s) | OK |
| 9:16 | `reserva-movil` | Sin descargar nada. | 3 | 32 | 60–120 = 60 (2,00 s) | OK |
| 9:16 | `sin-solapamientos` | Sin dobles reservas. | 3 | 32 | 0–56 = 56 (1,87 s) | OK |
| 9:16 | `sin-solapamientos` | Dos partidos. Dos pistas. | 4 | 42 | 60–120 = 60 (2,00 s) | OK |
| 9:16 | `ligas-en-directo` | Ligas en tiempo real. | 4 | 42 | 0–120 = 120 (4,00 s) | OK |
| 9:16 | `tu-descansas` | Confirmada automáticamente · Pista 4 · Vie 19:00 | 6 | 63 | 22–120 = 98 (3,27 s) | OK |
| 9:16 | `tu-descansas` | Ellos reservan. Tú descansas. | 4 | 42 | 30–120 = 90 (3,00 s) | OK |
| 9:16 | `cta` | Tu club no puede esperar más. | 6 | 63 | 0–75 = 75 (2,50 s) | OK |
| 9:16 | `cta` | Prueba gratuita 14 días — sin tarjeta | 6 | 63 | 90–180 = 90 (3,00 s) | OK |
| 9:16 | `cta` | padelclubos.com | 1 | 11 | 150–180 = 30 (1,00 s) | OK |

### Palabras en pantalla del 9:16 (máximo 12)

| Escena | Momento más cargado | Recuento | Total |
|---|---|---|---|
| `mensajes-a-deshora` | f0–f59 | 23:47 (1) + titular (4) + burbuja (4) + badge (1) | 10 |
| `dobles-reservas` | f30 | titular (2) + módulo PISTA 1 · MAR · 19:00 con etiquetas (6) + «Javi + 3» (2) + «Pedro + 3» (2) | 12 |
| `competiciones-en-excel` | f6–f33 | titular (3) + nombre de archivo (1) + «#¡REF!» (1) | 5 |
| `interruptor` | f24–f52 | PadelClub OS (2) | 2 |
| `reserva-movil` | f60–f119 | titular B (3) + módulo (6) + botón (2); la rejilla queda bajo el velo | 11 |
| `sin-solapamientos` | f60–f119 | titular B (4) + módulo (6) + chip (1) | 11 |
| `ligas-en-directo` | f60–f119 | titular (4) + «6-4 6-3» (2) + posiciones 1·2·3 (3) + «Gómez / Ferrer» (2) + puntos (1) | 12 |
| `tu-descansas` | f30–f119 | 23:47 (1) + tarjeta (2 + 4) + titular (4) | 11 |
| `cta` | f150–f179 | PadelClub OS (2) + badge (6) + botón (2) + URL (1) | 11 |

## 8. Datos del club demo (coherentes en todas las escenas)

| Dato | Valor | Dónde aparece |
|---|---|---|
| Club | Valencia Pádel Club (una sede, 4 pistas) | todas |
| Día contado | Del lunes a las 23:47 al martes a las 23:47 (solo días de la semana, nunca fechas) | reloj de esquina 16:9 |
| Doble reserva | Pista 1 · martes 19:00: Javi Martínez + 3 y Pedro Sanz + 3 → Pedro pasa a la Pista 3 · 19:00 | mensajes-a-deshora, dobles-reservas, sin-solapamientos |
| Reserva desde el portal | Laura Gómez · Pista 2 · jueves 20:30 · 90 min · 4 jugadores | reserva-movil |
| Rejilla del jueves | P1 17:30 Clase · Iniciación; P1 19:00 Castillo ×4; P3 19:00 Moreno ×4; P4 20:30 Díaz ×4 | reserva-movil |
| Socios | 342 (importados desde socios_v3_FINAL.xlsx) | adios-al-excel, todo-en-uno |
| Liga | Liga de Otoño · 2.ª categoría · victoria 2, derrota 1 · Gómez / Ferrer 6-4 6-3 Moreno / Martínez | gestion-fragmentada, ligas-en-directo |
| Clasificación antes | 1 Navarro / Sanz 6 PJ 5 PG 11 · 2 Ruiz / Castillo 5-3-8 · 3 Gómez / Ferrer 5-2-7 · 4 Moreno / Martínez 4-1-5 · 5 Díaz / Romero 4-0-4 | ligas-en-directo |
| Clasificación después | 1 Navarro / Sanz 11 · 2 Gómez / Ferrer 6-3-9 ▲ · 3 Ruiz / Castillo 8 · 4 Moreno / Martínez 5-1-6 · 5 Díaz / Romero 4 | ligas-en-directo |
| Reservas del martes | 24 activas · 86 participantes | control-de-cobros, todo-en-uno |
| Cobros del martes | Cobrado hoy 532,00 € → 560,00 € · Pendiente 112,00 € → 84,00 € (Carlos Navarro + 3, Pista 4 · 20:30, 4 × 7,00 €) | control-de-cobros, todo-en-uno |
| Ocupación | 87 % (Pista 1 92 % · Pista 2 88 % · Pista 3 85 % · Pista 4 83 %) | todo-en-uno |
| Reserva nocturna | Nuria Castillo · Pista 4 · viernes 19:00 · confirmada automáticamente a las 23:47 | tu-descansas |

## 9. Por qué esta versión

Parto de «narrativa», ganadora para los dos jurados (40 y 40 puntos): es la única propuesta en la que un gerente de club de barrio reconoce su semana, y convierte cada función en la consecuencia de un día en lugar de un catálogo. Correcciones obligatorias aplicadas: (1) Ritmo: fundí el reloj con los mensajes y encadené la doble reserva por match cut; el problema dura 14 s y el drop cae en 0:14 (c.8); en vertical, a los 6 s. (2) «Dos partidos. Una pista.» / «Dos partidos. Dos pistas.» (Javi + 3 y Pedro + 3 son dos partidos). (3) El reloj de esquina pierde la celda PISTA: es un chip DÍA · HORA que se oculta cuando el módulo es protagonista y no existe en 9:16. (4) La reserva de Laura se ve en la vista «Reservas · Jueves», sin ningún KPI de «hoy» que cambie, y la rejilla del jueves no usa a Martínez ni a Sanz; 24 reservas y 342 socios se mantienen en todo el vídeo. (5) Todos los textos que cargan mensaje están validados a ≥0,35 s por palabra sobre sus frames reales (tabla de legibilidad de storyboard.md); los titulares viven en una HUD fija, así que ningún zoom los recorta. (6) Sin muelles con rebote, sin overshoot y sin rotateX: solo press, overlay, vista, celebrate y digit-roll. (7) Logotipo oficial importado de public/brand (el chip «OS» tal como es; en oscuro, la variante oficial con bloque #2FA075). (8) Ortografía: «Liga de Otoño · 2.ª categoría», «87 %» siempre con espacio, «TOTAL · 5 min»; importes con el patrón real de la Recepción («22,00 €»), todos por debajo de 1000 para que no haya duda de agrupación. (9) Nada caduca: sin precios, sin años ni fechas absolutas («pagos_FINAL (2).xlsx»), y sin teléfonos, dominios ni rutas inventadas (la tarjeta de enlace solo muestra padelclubos.com). (10) «SIN DESCARGAR NADA» aparece en «reserva-movil» en los dos formatos. (11) A las 23:47 finales el móvil del gerente no se enciende: la prueba es una tarjeta del panel con «Confirmada automáticamente» como línea principal. El producto confirma la reserva al jugador y no tiene un aviso de nueva reserva para el gerente, así que no lo inventamos, y el beneficio no puede leerse como «me siguen escribiendo a medianoche». (12) Carlos ya no reclama una deuda antigua: se cobra su reserva de hoy jugador a jugador, como hace la Recepción real (Tarjeta/Efectivo + «Cobrar»). (13) Solapamientos fieles al producto: detecta y bloquea («Este horario ya está ocupado en la pista seleccionada.») y la recolocación es manual, sin sugerencias inventadas. (14) Clasificación con el sistema de puntos real (victoria 2, derrota 1): derivable, el perdedor también suma PJ y no hay empates. (15) Celebrate afinado como quinta justa (Do6→Sol6). Injertos: de «precision», la regla de cero verde antes del drop, la HUD fija, el vuelo del módulo del móvil al panel («dos caras, mismos datos»), el cronómetro 00:00→04:52, «Si sabes usar WhatsApp, sabes usar Padel Club OS.» con la burbuja del enlace, el punto final como bloque verde, el badge literal en el CTA vertical y la firma «HECHO EN ESPAÑA · INTEGRADOS CON VERIFACTU». De «marcador», la pista que se dibuja y se convierte en la rejilla de reservas, el espejo sonoro disonante→consonante, la hoja «liga_otoño_BUENO (2).xlsx» que plantea el dolor de las competiciones, el chip VeriFactu en cobros, el tablero de módulos con datos vivos en lugar del ticker y el validador minFrames. El 9:16 no es un recorte: tiene 9 escenas, 8 de ellas con el mismo componente que en 16:9 y maqueta vertical; 3 funciones de 2 compases cada una (reservar, evitar solapamientos, ligas), que son justo el pago de los tres dolores del arranque; ≤12 palabras en pantalla; nada crítico fuera de y250–1520; gancho en f0 y marca a los 6 s.

## 10. Notas de producción

- `scripts/scaffold.py` genera `src/timeline.ts`, los registros y las carpetas de escena a partir de `docs/storyboard.json` (este mismo storyboard en datos).
- Validación en build: suma de compases (30 y 15), cortes en múltiplos de 15 f, `minFrames` de cada texto y máximo de 12 palabras en vertical. Antes del render final, versión de depuración con overlay de compases y tiempos.
- Cada escena resuelve su entrada y su salida dentro de su duración (guía de escenas, regla 9): el push del acto de producto se reparte en los últimos 8 f de la saliente y los primeros 7 f de la entrante; CameraMotionBlur solo en la capa de contenido, nunca en la HUD.
- Logotipo: usar los SVG oficiales de `public/brand` (`Logo`/`Isotipo` de `src/brand`). El chip «OS» de `Logo.tsx` entra hoy con un 8 % de overshoot: pasarlo al press de 120 ms sin rebote. El preset `springs.pop` (damping 14) no se usa.
- Formato: `fmt.pct` devuelve «87%»; debe devolver «87 %» con espacio de no separación. Los importes usan `fmt.eur2` (es-ES, dos decimales, espacio de no separación antes de «€») y todos quedan por debajo de 1000.
- Tipografía: Archivo con el eje wdth a 112 (font-stretch 112 %), Instrument Sans y JetBrains Mono con subset latin-ext (á é í ó ú ñ ¿ ¡ ª), cargadas antes de renderizar (delayRender). tabular-nums en todas las cifras. Titulares de 64–120 px en 16:9 y de 72–110 px en 9:16; UI nunca por debajo de 16 px efectivos.
- Compresión: líneas y bordes de 2 px como mínimo (nada de retículas de 1 px), colores planos. H.264 High, yuv420p, CRF 16; revisar el vertical en un móvil real al 50 % de brillo.
- Sonido: añadir a `audio/synth.py` la vibración y el «clack» de interruptor; el ping acepta dos notas (disonante La5+Si♭5 antes del drop, consonante Do6+Sol6 después). Exportar stems de música y SFX.
- Capturas reales (`public/reference/recepcion.png`, `portal-movil.png`) solo como referencia de fidelidad: toda la UI se recrea en vectores con los tokens de `src/brand/tokens.ts`.
