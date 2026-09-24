# Rediseño «Planos anotados»

23 y 24 de septiembre de 2026, rama `claude/bpm-tech-studio-redesign-jazb0q`. Comprobaciones locales, sin despliegue. El estado vigente de la web está en [contexto-actual.md](../contexto-actual.md). Este documento explica cómo se llegó a él.

## Punto de partida

- La política de red del entorno de trabajo bloquea la navegación a bpmtechstudio.com. La línea base es el árbol local de `2c5878a`, que es la landing simplificada anterior, capturado a 320, 360, 390, 768, 1440 y 1920 px.
- En esa línea base pasaban los 26 recorridos funcionales: anclas, menú móvil, formulario con errores, 503 recuperable, éxito simulado, reserva, sin JavaScript y movimiento reducido.
- Diagnóstico:
  - El titular enumeraba servicios («Software, automatizaciones y webs para tu negocio»).
  - La prueba del primer pantallazo era una captura en miniatura sobre verde, con un rótulo encima.
  - Las secciones se leían como una plantilla editorial.

## Referencias

La navegación directa estaba bloqueada. Las referencias se contrastaron por búsqueda web y con conocimiento previo de los sitios, que puede no reflejar su estado actual.

| Referencia | URL | Decisión para BPM |
|---|---|---|
| Linear | https://linear.app | El producto es la demostración: una pantalla real, grande y legible bajo el titular, sin maquetas de dispositivo. |
| Basecamp · Before & After | https://basecamp.com/before-and-after | El problema con las palabras del cliente: «reservas por WhatsApp», «stock en hojas de cálculo que no cuadran». |
| Pentagram · Work | https://www.pentagram.com/work | El trabajo manda: los proyectos van justo después del hero y el texto hace de pie. |
| Herzog & de Meuron · Complete Works | https://www.herzogdemeuron.com/index/projects/complete-works.html | El número como identidad y el índice como navegación: cinco proyectos del 01 al 05. |
| Teenage Engineering · guía del OP-1 | https://teenage.engineering/guides/op-1 | Llamadas numeradas sobre la pieza real, con rótulos secos. |
| SBB · Müller-Brockmann | https://peoplesgdarchive.org/item/17132/swiss-federal-railways-sbb-visual-information-system | Un sistema de símbolos funcional sobre retícula: el glifo de BPM marca notas y pasos, nunca decora. |

## Tres direcciones

Cada prototipo cubre el hero y el arranque de la sección siguiente, a 1440, 390 y 320 px. Los HTML están en `prototipos/` y enlazan los recursos del repositorio: se abren sirviendo la raíz del repo, por ejemplo con `python3 -m http.server`, en `/docs/rediseno/prototipos/b.html`. No se sirven en la web: Next.js solo publica `public/`. Las comparativas están en `capturas/direcciones-1440.jpg` y `capturas/direcciones-390.jpg`.

- **A · Trazo, marco, bloque.** El glifo ampliado a 338 px es el método: la barra es lo que hoy se hace a mano, el marco la propuesta por escrito y el bloque el software en uso.
- **B · Planos anotados.** Pantallas reales con notas numeradas sobre sus decisiones y un cajetín de datos, como un plano técnico.
- **C · Índice de problemas.** La portada es un índice de cinco necesidades dichas como las diría el cliente, y cada una lleva a su proyecto.

Tres jueces independientes puntuaron cada dirección con criterios propios:

| Juez | Criterios | A | B | C | Gana |
|---|---|---|---|---|---|
| Arte | personalidad, composición, marca, momento propio, fuerza estática | 41 | 37 | 32 | A |
| Comercial | comprensión en 5 s, confianza, fuerza de las pruebas, fricción del contacto | 21 | 30 | 27 | B |
| Móvil y técnica | móvil diseñado, sin depender del hover, accesibilidad, rendimiento, viabilidad | 38 | 37 | 40 | C |
| **Suma** | | 100 | **104** | 99 | |

**Se eligió B.** Estos son los argumentos observables:

- Fue la única dirección con una pantalla real legible en el primer pantallazo: la recepción medía unos 820 px, con tres notas en lenguaje de negocio.
- Enseñaba una cara, hablaba en primera persona y marcaba «En producción» con enlace verificable a padelclubos.com.
- El juez comercial la puso primera con 30 puntos frente a 27 y 21. Ese juez mide lo que frena a una pyme que no conoce a nadie en el oficio: creer que detrás hay una persona que ya ha hecho algo parecido.

**Injertos de las otras dos direcciones:**

- De A, el titular «Software a medida para lo que hoy haces a mano», el más concreto de los tres, y el glifo como figura del método.
- De C, el lenguaje de problemas en la entradilla y el recorte dirigido en móvil.

Estas son las objeciones a B y cómo se resolvieron:

- «Esqueleto de hero SaaS y el plano técnico es un género, no BPM». La hoja con marco, las llamadas en el margen, la vista partida y el glifo como marcador y como método dan a BPM un lenguaje propio.
- «LCP de imagen». Se precarga solo en escritorio y en móvil el LCP es texto.
- «Coordenadas caras de mantener». Recortes y anclajes van en píxeles de la imagen original, con pruebas automáticas.

## Qué se implementó

- **Hoja de BPM.** Cada proyecto es una hoja en papel 2 con marco de tinta y un rótulo «Proyecto 0N · Nombre». Cada hoja declara qué enseña: datos de demo, o marca, nombres u herramientas difuminados. El color del producto se queda en una muestra de 10 px.
- **Llamadas en el margen.** El número es el cuadrado macizo cobalto del glifo y vive siempre fuera de la captura, en una columna común del margen. Una línea de 1 px viaja hasta el punto señalado, así la llamada nunca tapa lo que prueba. Pasar por una nota señala su marcador y al revés, solo con puntero fino. Es el momento propio de BPM.
- **Vista partida.** La radio y la franja del asistente omiten un tramo de la página con la doble línea de rotura de los planos.
- **Método.** Las tres piezas del glifo (barra, marco y bloque) se ensartan en una línea de proceso.
- **Rejilla única.** Dos columnas de 424 y 872 px con calle de 24 a 1440 px. La columna 2 empieza siempre en x 508, y la siguen el hero, las cabeceras, servicios, sobre mí, preguntas, contacto, el pie y las fichas.
- **Tres composiciones de la hoja:**
  - Móvil, por debajo de 768 px: capturas a escala casi 1:1 con recortes propios.
  - Tablet, de 768 a 1023: hoja apilada con recortes propios y el móvil con sus notas al lado.
  - Escritorio, desde 1024: compuesta.
- **Contenido.** Proyectos después del hero y un índice numerado de los cinco. Servicios con el proyecto donde se ve cada uno, método, Alberto con su cajetín, preguntas y contacto.
- **Sin movimiento autónomo.** No hay carrusel, canvas ni frase rotatoria.

**Stack.** Se mantiene Next.js 16 con Tailwind 3 y no se añade ninguna dependencia. La web ya se sirve como HTML estático y conserva el formulario, la API, las imágenes OG, el sitemap y los metadatos. Migrar no resolvía ningún problema del encargo.

## Dos pasadas de crítica

Cada pasada usó cuatro lentes independientes: arte, copy comercial, móvil, y accesibilidad con rendimiento. Los informes completos no se versionan.

**Pasada 1**

- Qué señaló:
  - Captions de «datos de demo» en capturas que no los tienen.
  - Llamadas que tapaban texto.
  - Hojas sin rótulo propio.
  - Jerga de diseñador («lámina», «cajetín») en el texto visible.
  - Portal de radio con portada difuminada gigante.
  - Tablet sin composición.
- Qué se corrigió:
  - Caption y rótulo por hoja.
  - Vista partida en la radio.
  - Detalle 1:1 de la parrilla.
  - «A mano» sin partir.
  - Voz en primera persona.

**Pasada 2**

- Qué señaló:
  - La lámina del hero era la más pequeña y enseñaba un día a cero.
  - Las llamadas tapaban interfaz o señalaban vacío.
  - Convivían seis rejillas.
  - Las cabeceras eran idénticas.
  - Las franjas eran ilegibles en móvil.
  - Faltaban «pymes» y problemas concretos en el hero.
  - Quedaba jerga en las fichas.
  - Había una violación de axe (`definition-list`).
  - Faltaba composición de tablet.
- Qué se corrigió:
  - El hero pasa a la academia, con clase, alumna y «Pasar asistencia», a 0,73 en vez de 0,48. El portal del móvil va encima, en una zona vacía.
  - Las llamadas van al margen con lado por composición.
  - Una sola rejilla.
  - Servicios y preguntas con el titular fijo en la columna 1.
  - Retrato desde el filete.
  - Recortes de tablet y franjas desde 768 px.
  - Copy de pymes y pruebas del servicio 2 respaldadas por los proyectos.
  - `dl` válido.
  - Pie del formulario sin JavaScript con email y reserva.
  - Los nombres de herramientas de terceros del asistente, difuminados.

## Verificación

Todo en local, con Node 24.21.0, datos sintéticos y el proveedor de correo simulado.

| Comprobación | Resultado |
|---|---|
| `npm run check`: ESLint, `tsc --noEmit`, 87 pruebas y `next build` | Correcto |
| 26 recorridos funcionales contra `next start`, con `/api/contact` interceptado y Cal.com bloqueado | 26 de 26 |
| axe-core 4.10.3 (WCAG 2.2 AA y buenas prácticas): portada, cinco fichas, aviso legal, privacidad y 404, a 1440 y 390 | 0 violaciones |
| Anchuras 320, 360, 390, 768, 1024, 1440 y 1920: portada y fichas | Sin desbordamiento horizontal ni errores de consola |
| Rendimiento (latencia 150 ms, 1,6 Mbps, CPU ×4, sin caché, tres pasadas) | LCP 1440 de 1,25 a 1,27 s (captura del hero, precargada). LCP 390 de 1,0 a 1,08 s (entradilla). CLS ≤ 0,001 |

**Pruebas modificadas, porque fijaban visuales o copy sustituidos:**

- `projects.test.ts`:
  - La prueba de llamadas pasa de un anclaje por nota a uno por composición, con vistas propias. Sigue exigiendo un marcador dentro del recorte que se ve, y solo admite ausencias declaradas.
  - Nueva prueba: ningún ancho máximo amplía una captura tomada a 1x.
  - Nueva prueba: todo archivo de `public/proyectos` debe estar declarado.
- `copy.test.ts`:
  - El selector del formulario lista los temas con el nombre de cada servicio. «diagnostico» ya no se ofrece porque duplicaba «Todavía no lo tengo claro», pero la API lo sigue aceptando.
  - La pasada 1 añadió la prueba del índice de proyectos y de las pruebas de cada servicio.

**Capturas antes y después** (antes = árbol de `2c5878a`, después = esta rama, ambas con `next start`):

- `capturas/antes-despues-1440.jpg`
- `capturas/antes-despues-390.jpg`
- `capturas/antes-home-1440-completa.jpg`
- `capturas/despues-home-1440-completa.jpg`
- `capturas/antes-home-390-completa.jpg`
- `capturas/despues-home-390-completa.jpg`
- `capturas/despues-ficha-padel-1440-completa.jpg`

**Rutas para revisar:**

- `/`
- `/proyectos/plataforma-clubes-padel`
- `/proyectos/wms-almacen`
- `/proyectos/web-radio`
- `/proyectos/web-boda`
- `/proyectos/asistente-ia-gestion-proyectos`
- `/aviso-legal`
- `/privacidad`
- una ruta inexistente, para la 404

## No verificado

- La web publicada y las referencias no se navegaron: la red del entorno las bloquea.
- No se envió ningún correo real ni se reservó ninguna cita.
- No se pasó Lighthouse.
- No hubo lector de pantalla real (NVDA o VoiceOver) ni dispositivos físicos. Solo Chromium con emulación, sin Safari ni Firefox.
- No se pudo recapturar Padel Club OS con un día de demo con actividad.

## Pendiente antes de publicar

- **Capturas:**
  - Recapturar Padel Club OS a 1440 px con un día de demo con reservas.
  - Recapturar radio, evento y asistente a 2x para que no dependan de anchos máximos.
- **Revisión de Alberto:**
  - Revisar la captura del asistente, que ahora difumina también los nombres de herramientas de terceros.
  - Decidir si se purgan del historial de git y de los despliegues anteriores los originales sin anonimizar.
- **Contenido pendiente:**
  - Confirmar si las propuestas incluyen plazo. Si es así, añadirlo al paso 02 del método y a una pregunta nueva.
  - Decidir si `POST /api/diagnostico` debe seguir desplegado, porque ya no se monta en la portada.
- **Configuración y verificación en producción:**
  - Revisar en Vercel las variables del correo (`CONTACT_EMAIL` y el remitente verificado), sin cambiarlas por conveniencia.
  - Verificar en la versión publicada un envío real y una reserva real, con autorización.
- **Rendimiento:**
  - Valorar recortes previos para el móvil del almacén: hoy descarga la captura original de 3200 px, 143 KB.
  - Valorar separar el copy que usan los componentes de cliente, unos 4 KB comprimidos.
