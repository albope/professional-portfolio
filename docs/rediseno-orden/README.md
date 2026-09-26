# Rediseño «Orden»

25 y 26 de septiembre de 2026, rama `claude/bpmtech-landing-redesign-3f0fb0`, commits `2375ced` (rediseño) y `4e83a8f` (revisión crítica). Comprobaciones locales contra `next start`, sin despliegue. El estado vigente de la web está en [contexto-actual.md](../contexto-actual.md). Este documento explica cómo se llegó a él. El proceso anterior, «Planos anotados», queda como histórico en [rediseno/README.md](../rediseno/README.md).

## Encargo

Alberto pidió rehacer la landing con estas condiciones:

- Se conserva solo el logo de BPM Tech. Paleta, tipografía, maquetación, copy y estructura quedan libres.
- Huir de que parezca hecha con IA.
- Clara, fácil y sencilla de explicar. La anterior se veía compleja de entender.
- Que el visitante, como mínimo, haga una consulta, y que la web le convenza de trabajar con BPM Tech.
- Profesionalidad de empresa estructurada. Se puede mencionar a Alberto, pero sin la imagen de «un friki en casa jugando con la IA a ser una empresa».
- Simpleza, claridad y un diseño superlativo.
- Animaciones y gráficos SVG propios, a criterio, cuando sumen claridad y no como adorno.

## Punto de partida

La línea base es el árbol de `e9bff8c`, la rama principal con «Planos anotados». Sus capturas completas sirven de «antes» y no se duplican aquí:

- [Portada a 1440, completa](../rediseno/capturas/despues-home-1440-completa.jpg)
- [Portada a 390, completa](../rediseno/capturas/despues-home-390-completa.jpg)

Diagnóstico:

- **Compleja.** La portada pedía aprender un sistema antes de entender la oferta: láminas con marco, llamadas numeradas en el margen, cajetín, vista partida e índice de proyectos del 01 al 05. El propio brief la señala como ejemplo de «exceso de metáforas y anotaciones».
- **Tics de IA.** Rótulos en monoespaciada mayúscula sobre cada sección («Servicios», «Proyectos», «Cómo trabajo», «Sobre mí»), titulares en Archivo Black en caja alta, numeración por todas partes y aforismos con punto final («Trabajo real, explicado.», «Sabes qué viene después.», «Lo que conviene tener claro.»).
- **Primera persona del singular.** «Cuéntame qué necesitas», «Soy Alberto. Hablas con quien lo construye.», «Hablas directamente conmigo». Con la firma y el retrato en el hero, la web hablaba de una persona sola, lo contrario de la empresa estructurada que pedía Alberto.
- **Email en Gmail.** El contacto público es `bpmtechstudio@gmail.com`. Se propuso mostrar la dirección del dominio y Alberto decidió mantener esta (ver decisiones).

## Decisiones de Alberto

Se le preguntaron antes de empezar:

- **Voz «nosotros».** BPM Tech habla como empresa (es una sociedad limitada). Alberto aparece como fundador y responsable de los proyectos. Nunca se menciona tamaño de equipo ni se insinúa una plantilla que no existe.
- **Email público.** Se mantiene `bpmtechstudio@gmail.com`. Se le propuso `contacto@bpmtechstudio.com` y lo descartó.
- **IA discreta.** Una herramienta más dentro de las automatizaciones, nunca un servicio protagonista ni una estética «IA».
- **Compromisos publicables**, confirmados como reales:
  - Respuesta a cada consulta en 24 h laborables.
  - Presupuesto cerrado por escrito antes de empezar (alcance y precio).
  - Plazo de entrega comprometido en la propuesta.
  - Soporte y mantenimiento tras la entrega.
  - Ya existía: primera conversación gratuita y sin compromiso, videollamada de 30 min por Cal.com.

Con esto se escribió un brief con los hechos de la empresa que se pueden usar, las reglas duras que vigilan las pruebas (sin punto y coma ni rayas, sin tipo de relación con los proyectos, sin cifras inventadas, solo Padel Club OS con nombre y enlace), las señales de «hecho con IA» que había que evitar y las de empresa estructurada que se buscaban.

## Tres direcciones

Cada dirección se prototipó como página completa en HTML estático, con el copy, las ilustraciones y sus animaciones. Los prototipos, la especificación de diseño, los informes del jurado y los de la revisión se quedaron en el directorio de trabajo y no se versionan. Aquí están sus primeros pantallazos:

| Dirección | 1440 × 900 | 390 × 844 |
|---|---|---|
| **Orden** · «Del caos al orden» | [direccion-orden-1440.jpg](capturas/direccion-orden-1440.jpg) | [direccion-orden-390.jpg](capturas/direccion-orden-390.jpg) |
| **Estructura** · «Ingeniería con método» | [direccion-estructura-1440.jpg](capturas/direccion-estructura-1440.jpg) | [direccion-estructura-390.jpg](capturas/direccion-estructura-390.jpg) |
| **Confianza** · «Cercanía experta» | [direccion-confianza-1440.jpg](capturas/direccion-confianza-1440.jpg) | [direccion-confianza-390.jpg](capturas/direccion-confianza-390.jpg) |

- **Orden.** Titular «Software a medida para ordenar la gestión de tu pyme». Una ilustración SVG en la que un mensaje de WhatsApp, una hoja de cálculo, una nota en papel y un pósit vuelan a una ventana con el glifo del logo y se convierten en filas con su estado. Schibsted Grotesk.
- **Estructura.** Titular «Software a medida para poner orden en la gestión de tu empresa.». Un diagrama que une hojas de cálculo, WhatsApp y papel con «Tu aplicación», y una banda oscura en azul noche con una propuesta por escrito. Schibsted Grotesk.
- **Confianza.** Titular en serifa (Newsreader) «Software a medida para pymes que ya no caben en una hoja de cálculo.», texto en Libre Franklin, un panel de gestión sobre escenario arena y pestañas con las capturas de Padel Club OS.

El juez de arte advirtió que las tres compartían casi la misma estructura (compromisos bajo el hero, tres servicios, Padel Club OS con el móvil delante, tres tarjetas, mención del asistente, cuatro pasos, retrato con ficha, preguntas y formulario). Las diferencias reales estaban en el hero, la tipografía y el momento visual de cada una.

Cuatro jueces independientes puntuaron cada dirección con sus propios criterios, hicieron capturas y mediciones propias y eligieron una:

| Juez | Qué miraba | Orden | Estructura | Confianza | Elige |
|---|---|---|---|---|---|
| Arte | dirección de arte y oficio, animación, contraste, fidelidad al logo | 40,5 | 37,5 | 33,5 | Orden |
| Dueño de pyme | un dueño escéptico de una empresa de 5 a 50 personas, no técnico, que llega por curiosidad | 43,5 | 38,5 | 39 | Orden |
| Copy | claridad, voz «nosotros», fidelidad a los hechos del brief y reglas duras | 44 | 40,5 | 36,5 | Orden |
| Técnica | móvil, accesibilidad, rendimiento y viabilidad en Next.js | 40 | 30 | 38 | Orden |
| **Suma** | | **168** | 146,5 | 147 | |

Ninguna de las tres rompía las reglas duras: en el texto visible, sin punto y coma ni rayas, sin términos de relación con los proyectos y sin cifras inventadas, y en la maqueta, sin desbordamiento horizontal.

## Por qué gana Orden

Los cuatro jueces la eligieron por separado. Estos son los argumentos:

- Es la única cuyo hero se entiende sin leer el texto. El dueño de una pyme reconoce su propio desorden («¿Tenéis hueco el jueves a las 19?», una celda «¿?», «Pedido pendiente, ¿quién lo pidió?», un pósit «Avisar al cliente ¡hoy!») y lo ve convertido en filas con estado.
- Usa el glifo del logo como sistema: el cuadrado hueco significa pendiente y el macizo cobalto, hecho.
- Es la página más corta, con el formulario más ligero y con menos señales de «hecho con IA».
- Es la más fácil de llevar a Next.js: un solo SVG, keyframes en CSS y un `IntersectionObserver`.

Antes de implementarla se corrigieron sus debilidades en un prototipo de referencia:

- **Móvil.** El hero de escritorio encogido dejaba textos de 6 a 8 px. Ahora tiene composición propia hasta 767 px, con tres filas y al menos 11 px de texto a 320 de ancho. El botón de consulta entra en el primer pantallazo a 320 × 568.
- **El «antes» en estado estático.** Cada fila dice de dónde venía («Antes, por WhatsApp») y hay un pie bajo la ilustración.
- **Solapes.** La pieza de WhatsApp ya no tapa el glifo de la ventana.
- **Bucles.** El hero hace un recordatorio por pieza y se detiene, con control «Pausar», «Reanudar» y «Ver de nuevo» (WCAG 2.2.2). La animación de automatización es una pasada de 4,5 s por entrada en pantalla.
- **Monotonía tras el hero.** Banda de tinta con la hoja «Propuesta».
- **Tarjetas de radio y evento** reencuadradas, con un detalle ampliado de «ES / FR» y «Confirmar asistencia» en el evento.
- **Una sola acción principal**, «Hacer una consulta» («… gratuita» en el hero y «Enviar consulta» en el formulario).
- **Copy** sin ampliaciones que no respaldan los hechos y **formulario** conectado a `/api/contact` con su lógica real.

El prototipo de referencia se comprobó en 14 anchos, de 310 a 1920 px, sin desbordamiento horizontal, con movimiento reducido y sin JavaScript.

## Injertos y descartes

**De Estructura:**

- La banda de tinta «Cómo trabajamos», con el titular «Antes de empezar sabrás qué haremos, cuánto costará y cuándo estará listo» y la hoja «Propuesta», cuyas casillas pasan de huecas a macizas.
- La composición móvil propia del hero y el pie de la ilustración.
- El detalle ampliado de la web del evento.
- Titulares a peso 560, con tracking de -0,03 em en el H1 y -0,026 em en los H2, y sin punto final.
- La línea «Para cuando…» de cada servicio y su enlace de consulta que preselecciona el tema del formulario.
- La ayuda del mensaje como texto encima del campo y la séptima pregunta, «¿Trabajáis solo en Valencia?».

**De Confianza:**

- «gratuita» en el botón del hero.
- Padel Club OS contado como «Para el club / Para el jugador / Hoy».
- La respuesta sobre el precio («por eso no publicamos tarifas») y la pregunta «No sé exactamente qué necesito. ¿Puedo escribiros igualmente?».
- Dos frases de beneficio en las tarjetas del almacén y del evento. La revisión crítica las suavizó después, junto con la de los socios cargados desde el Excel del club, porque Alberto aún no las había validado.
- En móvil, el texto de «Quiénes somos» antes que el retrato, con la foto recortada a 4:3.
- Escape y clic fuera cierran el menú, el foco pasa al mensaje de enviado y el anillo de foco mide 3 px.

**Descartes, con motivo:**

- **Pestañas Recepción, Reservas y Academia en Padel Club OS.** Recepción enseña contadores a cero y Reservas está casi vacía, y las pestañas añadían autoplay y otro control. Se queda Academia con el portal del móvil. Se pueden recuperar como pestañas manuales si Alberto aporta una captura de Reservas con un día lleno.
- **Azul noche para la banda oscura.** Se usa la tinta del logo, `#101013`: menos colores y la misma variante oscura del logo.
- **Nombre de sección en una columna a la izquierda.** Se lee como microetiqueta de plantilla.
- **Parallax y marco de navegador.** Movimiento sin información y solapes en móvil.

## Qué se implementó

Se escribió una especificación de diseño con los tokens, el copy definitivo, las animaciones con sus tiempos y las reglas de accesibilidad. No está en el repositorio: las frases de su apartado 6.4, pendientes de Alberto, están copiadas en [contexto-actual.md](../contexto-actual.md). Después se construyó una base común (tokens, fuentes, cabecera, pie y piezas de interfaz) y cinco agentes trabajaron en paralelo: hero, «Qué hacemos», «Proyectos» con «Cómo trabajamos», «Quiénes somos» con «Preguntas» y «Contacto», y las páginas interiores (fichas, legales, 404 e imágenes OG). Una integración final lo unió y lo verificó.

- **Portada.** Hero con la ilustración del caos al orden y la franja de cuatro compromisos, «Qué hacemos», «Proyectos», «Cómo trabajamos», «Quiénes somos», «Preguntas» y «Contacto». El detalle de cada sección está en [contexto-actual.md](../contexto-actual.md).
- **Sistema.** Papel, tinta y cobalto con un neutro arena para escenarios. Schibsted Grotesk en tipo frase para todo el texto y Fragment Mono solo para el logo, que no cambia. Radios suaves en botones, campos y tarjetas, y cuadrados sin radio para las marcas de estado.
- **Ilustraciones SVG propias** que se animan al entrar en pantalla: el hero, la agenda que se llena, los datos que pasan solos de una hoja de cálculo a una aplicación, una web que se construye, la propuesta que se marca y la línea del proceso. El marcado del servidor es siempre el estado final.
- **Fichas, páginas legales, 404 e imágenes OG** con el mismo sistema. Las fichas abren con la misma composición de capturas que su tarjeta en la portada.
- **Retirado.** Las láminas anotadas (`Plate`, `PlateStage`, `plates.ts`), Archivo y Archivo Black, la primera persona del singular y la dependencia `lucide-react`.
- **Stack.** Se mantiene Next.js 16 con Tailwind 3 y no se añade ninguna dependencia.
- **Pruebas.** Las del copy se reescriben para la nueva estructura y se amplían para vigilar también la primera persona del singular, «nuestro equipo», las píldoras del formulario y un solo nombre para la acción principal.

## Revisión crítica

Sobre `2375ced`, cinco lentes independientes revisaron la implementación: arte, conversión y copy, accesibilidad, código, y móvil con rendimiento. Cada hallazgo pasó después por una verificación escéptica que intentaba reproducirlo.

| Lente | Confirmados |
|---|---|
| Arte | 11 |
| Conversión y copy | 10 |
| Accesibilidad | 12 |
| Código | 8 |
| Móvil y rendimiento | 9 |
| **Total** | **50** |

Hubo 74 hallazgos: 50 confirmados (4 graves, 22 menores y 24 de detalle) y 24 refutados. Se actuó sobre 48. Seis de ellos quedaron corregidos solo en parte y uno se resolvió de otra forma que la propuesta. Dos se dejaron como estaban, con motivo.

Los cuatro graves, y cómo se corrigieron:

- **El formulario perdía lo escrito.** El enlace a la política de privacidad se abría en la misma pestaña y al volver el formulario estaba vacío. Vuelve a abrirse en otra pestaña.
- **Foco perdido camino del formulario.** Los enlaces «Consultar sobre…» bajaban la vista a Contacto pero dejaban el foco arriba. Ahora llevan la vista y el foco al título del formulario, también al repetir el mismo enlace.
- **`main` robaba el foco.** Era enfocable, así que un clic en cualquier texto mandaba el siguiente Tab al hero. «Saltar al contenido» apunta ahora a un elemento propio dentro de `main`.
- **Compromisos cortados en portátiles.** La franja quedaba partida en el pliegue a 1440 × 789 y a 1280 × 800. Desde 1180 px de ancho y hasta 880 px de alto, el hero compacta sus huecos y limita la ilustración al alto disponible, sin tocar el H1. Corregido solo en parte: a 1366 × 657 y a 1180 × 700 la franja sigue sin caber (ver más abajo).

Otras correcciones:

- **Hero.** Los fundidos se adelantan para que ninguna pieza pase por encima del texto de una fila. Si la hidratación llega tarde, la ilustración ya ordenada no vuelve al caos. Nada sigue animándose fuera de pantalla. La itálica «a mano» solo se descarga con JavaScript y movimiento permitido.
- **Accesibilidad.** El menú móvil se cierra cuando el foco sale de él y se ve en colores forzados, igual que los más y menos de las preguntas y la píldora marcada. Los campos con error tienen un foco visible. La 404 tiene título propio. Los cuatro «Ver el caso» llevan nombre accesible distinto. Al imprimir se ve todo el contenido.
- **Conversión y copy.** Los errores de envío ofrecen el email como alternativa. Las fichas pasan a la voz «nosotros», con rótulos nuevos y sin la jerga que señaló la revisión («dos agentes», «traza», «reproductor persistente», «terminal»). El email interno de aviso deja de llevar rayas y una prueba lo vigila.
- **Arte.** Líneas base comunes en los compromisos del hero y los enlaces de servicios y tarjetas desde 1024 px, y en los pasos del proceso desde 980. En la ficha de «Quiénes somos», donde la columna es estrecha, el término va encima del dato en lugar de partir cada celda en dos líneas. Los detalles de las fichas dejan de repetir capturas que ya se ven en la figura principal. Un enlace compartido con ancla salta sin recorrer la página entera.
- **Móvil y rendimiento.** El texto de las ilustraciones de servicios no baja de 10,1 px. El detalle ampliado del evento no pasa de 266 px. Un slug inventado bajo `/proyectos` da 404 sin escribirse en la caché, y las imágenes OG de las fichas se generan en el build.

Lo que quedó parcial o sin tocar:

- **Métrica de la fuente.** En Chromium Linux, Schibsted servida por `next/font` mide un 2 o 3 % más ancha que en el prototipo, porque su archivo no trae la tabla `prep`. De ahí salen cortes de línea que el prototipo no tenía, como «Te enviamos una propuesta» en dos líneas a 1440. No se tocó: hay que mirar antes en macOS o Windows.
- **Portátiles bajos.** A 1366 × 657 faltan 48 px para ver la franja de compromisos entera y a 1180 × 700 faltan 17. Ver los ajustes del coordinador.
- **Detalle del evento.** Sin una captura de mayor resolución se limita a 266 px. Las capturas principales de las fichas no se reexportaron a más resolución.
- **Sin JavaScript,** el menú sigue abierto después de elegir un enlace. Se acepta.
- **Medición.** El enlace «Abrir en Cal.com» del diálogo de reserva no se mide para no contar dos veces la misma intención.
- **Alineación por debajo de 1024 px.** Con los compromisos en dos columnas, sus textos no comparten línea.
- **Tokens sin uso.** Se borraron las fuentes de Archivo Black, pero siguen declarados el punto de corte 1280, que está en la especificación y ninguna clase usa, y los tokens `font-title` (solo lo usa el diagnóstico sin montar), `ease-io` y `ease-snap`.
- **Detalle de la radio en móvil.** Se resolvió con otro criterio que el propuesto: el móvil del detalle se oculta desde 768 px pero se mantiene por debajo, donde el teléfono de la figura principal mide unos 126 px.
- **Logo.** Fragment Mono se sigue precargando (15 KB) para las siete letras del logo. Convertirlo en trazados cambiaría el activo de marca.

## Ajustes del coordinador

Después de la revisión se deshicieron o matizaron dos cambios:

- **Objeto del aviso legal.** La revisión lo había cambiado para enumerar los tres servicios de la portada. Se deshizo porque el texto legal lo decide Alberto. El apartado sigue enumerando software a medida, aplicaciones y webs, automatización de procesos, inteligencia artificial aplicada, integraciones y consultoría tecnológica. Desde `2375ced` habla de «BPM Tech» en lugar de «el estudio», sin más cambios.
- **Ilustración del hero en portátiles bajos.** La fórmula que la ajusta al alto disponible la dejaba en unos 385 px a 1366 × 657 y el texto de sus filas no se leía. Ahora nunca baja de 500 px. A esa altura la franja de compromisos queda bajo el pliegue. Los mismos compromisos se repiten en «Cómo trabajamos».

## Verificación

Todo en local, contra `next start` en el puerto 3100 con Chromium de Playwright, con el proveedor de correo simulado y sin enviar nada real.

| Comprobación | Resultado |
|---|---|
| `npm run check` tras la revisión: ESLint, `tsc --noEmit`, 107 pruebas y `next build` | Correcto. Con Node 22.22.2, el del entorno de trabajo. El proyecto declara Node 24.x y `npm ci` avisa de la diferencia |
| `npm test`, repetido al escribir esta documentación | 107 de 107 |
| Recorridos tras las correcciones | Foco en el formulario desde «Consultar sobre…» en 24 de 24, 12 de 12 y 12 de 12 intentos, y en 9 de 9 con 400 ms de latencia (antes fallaban 10 de 24 y 6 de 9). Clic en texto y Tab. Menú y foco. Privacidad en otra pestaña conservando nombre, email, mensaje y tema. Error 503 con el email. Hidratación tardía sin volver al caos. Hero fuera de pantalla. Fotogramas del hero sin texto encima de texto. 404 con título propio. Slug inventado con 404. Colores forzados. Impresión, con 0 de 21 bloques ocultos |
| axe-core 4.10.3 (WCAG 2.2 AA y buenas prácticas): portada, cinco fichas, aviso legal, privacidad y 404, a 1440 y 390, con y sin movimiento reducido | 0 violaciones reales en la revisión: su único `target-size` era el mismo efecto de la cabecera fija que se describe a continuación. Repetido sobre el build final al escribir esta documentación: solo aparece `target-size` en el botón del pie a 390 (portada, legales y 404), cuando la cabecera fija lo tapa en la posición de scroll de la prueba. Con el botón a la vista mide 178 × 40 px y la regla pasa. Quedan avisos de contraste que axe no puede decidir (texto dentro de los SVG y enlaces subrayados con un degradado). La lente de accesibilidad midió el texto SVG visible y el mínimo es 5,69:1 |
| Desbordamiento horizontal | 0 en las 9 rutas por 32 anchos, de 300 a 1940 px, en la revisión. 0 en 45 combinaciones de ruta y ancho tras las correcciones. Repetido sobre el build final al revisar esta documentación: 0 en las 9 rutas por 32 anchos, de 300 a 1940 px |
| Sin JavaScript y con movimiento reducido | Contenido completo y hero en su estado final ordenado. Sin JavaScript, el formulario sale deshabilitado con el email y la reserva a mano. Con movimiento reducido, ningún pantallazo cambia en 3,5 s. Repetido al documentar en la portada a 390 y 1440: filas del hero con su estado y sin desborde |
| Primer pantallazo en portátiles, medido al documentar | Franja de compromisos entera a 1280 × 712, 1440 × 789, 1536 × 730, 1280 × 800, 1440 × 900 y 1920 × 1080. Faltan 48 px a 1366 × 657 y 17 px a 1180 × 700 |
| Rendimiento en la revisión, sobre `2375ced`: 390 × 844 a DPR 3, 150 ms de latencia, 1,6 Mbps y CPU ×4 | LCP 1,09 s en la portada (la entradilla) y de 0,71 a 1,09 s en fichas y legales. CLS 0 salvo en la 404 (0,026). INP por debajo de 90 ms en menú, píldoras, preguntas y enlace de servicio. La portada pesa unos 600 KB en 39 peticiones. Tras la secuencia, el hero en reposo gasta 2 o 3 ms por segundo. No se repitió tras las correcciones |

**Capturas del resultado** (`4e83a8f`, `next start`, Chromium a densidad 1, con movimiento). Las completas a 1440 se reducen a 900 px de ancho, como en el proceso anterior:

- [Portada, primer pantallazo a 1440 × 900](capturas/resultado-home-1440x900.jpg)
- [Portada, primer pantallazo a 390 × 844](capturas/resultado-home-390x844.jpg)
- [Portada completa a 1440](capturas/resultado-home-1440-completa.jpg)
- [Portada completa a 390](capturas/resultado-home-390-completa.jpg)
- [Ficha de Padel Club OS completa a 1440](capturas/resultado-ficha-padel-1440-completa.jpg)

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
- `/?necesidad=web#contacto`, para la preselección del tema

## No verificado

- Safari, Firefox y dispositivos reales. Solo Chromium con emulación.
- Lector de pantalla real (NVDA o VoiceOver).
- La web publicada. Nada de esto se ha desplegado.
- Un envío real de correo y una reserva real en Cal.com.
- Los cortes de línea en macOS o Windows. Las capturas salen de Chromium Linux, donde el texto mide un 2 o 3 % más ancho.
- Las comprobaciones con Node 24, la versión que declara el proyecto.
- El rendimiento tras las correcciones.

## Pendiente

- **Revisión de Alberto:**
  - Validar las ocho frases del apartado 6.4 de la especificación: tres se publican suavizadas y cinco tal cual. La lista está al principio de [contexto-actual.md](../contexto-actual.md).
  - Decidir si el «Objeto» del aviso legal se alinea con los tres servicios de la portada.
- **Capturas:**
  - Recapturar Padel Club OS con un día de demo con actividad y a más resolución. Las actuales son de 1280 px.
  - Recapturar la web del evento a 2x. Hoy su detalle ampliado se limita a 266 px.
  - Opcional: una captura de escritorio de la radio sin marca que se pueda publicar, y una de Reservas con un día lleno para recuperar las pestañas de Padel Club OS.
- **Revisión en real:**
  - Navegador real y móvil real, con atención a los cortes de línea.
  - Desplegar y verificar en la versión publicada un envío real y una reserva real, con autorización.
- **Siguen abiertos del rediseño anterior:** purgar del historial de git los originales sin anonimizar, decidir si `POST /api/diagnostico` sigue desplegado y revisar en Vercel las variables del correo.
