# Contexto vigente de la web BPM Tech

Actualizado: 26 de septiembre de 2026, con el rediseño «Orden» tras su revisión crítica (commits `2375ced` y `4e83a8f` de la rama `claude/bpmtech-landing-redesign-3f0fb0`). El proceso, las direcciones descartadas, la verificación y lo pendiente están en [rediseno-orden/README.md](rediseno-orden/README.md). El rediseño anterior, «Planos anotados», queda como histórico en [rediseno/README.md](rediseno/README.md). Este documento describe el árbol local. No acredita despliegue, entrega de correo ni resultados comerciales.

## Frases validadas por Alberto

El 26 de septiembre de 2026 Alberto confirmó las frases que la especificación del rediseño «Orden» (apartado 6.4) dejaba pendientes. Se publican así:

- Padel Club OS: «Los socios se cargan desde el Excel que ya tenía el club.»
- Almacén: «Las entradas se registran leyendo el código de barras con una pistola lectora o con el móvil, para que el stock del sistema sea el mismo que el de la estantería.»
- Evento: «… cada confirmación llega por email. Nadie tiene que revisar una lista a mano.»
- «Te enseñamos los avances durante el desarrollo para que los revises y podamos ajustar a tiempo.» (Cómo trabajamos, tercer paso)
- «Con empresas de otras ciudades trabajamos en remoto, por videollamada.» (Preguntas)
- «Si prefieres una inversión menor, definimos juntos una primera versión más pequeña.» (Preguntas, respuesta sobre el precio)
- «Su fundador, Alberto Bort, es el responsable de cada proyecto.» (Quiénes somos)
- La reserva presentada como videollamada de 30 min «gratuita y sin compromiso» (Contacto y diálogo de reserva)

**Aviso legal.** A petición de Alberto, el apartado «Objeto» de `src/app/aviso-legal/page.tsx` enumera ahora los tres servicios de la portada: software de gestión a medida, automatizaciones e integraciones, y webs y aplicaciones nuevas.

## Dirección comercial y de arte

BPM Tech presenta software de gestión a medida, automatizaciones e integraciones, y webs y aplicaciones nuevas para pymes. Habla como empresa, en primera persona del plural, y trata de tú al visitante. Alberto Bort aparece como fundador y responsable de cada proyecto. No se inventan tamaño de equipo, capacidad, disponibilidad ni resultados.

- **Titular:** «Software a medida para ordenar la gestión de tu pyme». La entradilla nombra problemas reconocibles: reservas por WhatsApp, cobros en una hoja de cálculo, pedidos apuntados en papel.
- **Una sola acción principal**, «Hacer una consulta». En el hero es «Hacer una consulta gratuita», en la cabecera por debajo de 400 px es «Consulta» y en el formulario, «Enviar consulta». La alternativa discreta es «o reserva una llamada de 30 min».
- **Cuatro compromisos** confirmados por Alberto, bajo el hero y otra vez en «Cómo trabajamos»: respuesta en 24 h laborables, presupuesto cerrado por escrito antes de empezar, plazo de entrega comprometido en la propuesta y soporte tras la entrega. La primera conversación es gratuita y sin compromiso, por videollamada o en persona en Valencia.
- **IA discreta.** Aparece en el ejemplo del servicio de automatización («Usamos IA solo cuando ahorra una tarea concreta»), en la pregunta «¿Usáis inteligencia artificial?» y en la mención del asistente. No es un servicio ni tiene estética propia.

**Concepto: del caos al orden.** Lo que hoy vive repartido entre WhatsApp, hojas de cálculo, papeles y pósits se convierte en una aplicación donde cada cosa tiene su fila y su estado. El glifo del logo es el sistema: barra, cuadrado hueco y cuadrado macizo son los controles de las ventanas dibujadas, el hueco significa pendiente y el macizo cobalto, hecho. El cobalto se reserva para acción y orden. Titulares en tipo frase y sin punto final. Sin microetiquetas en monoespaciada, sin secciones numeradas, sin gradientes y sin cifras inventadas.

La portada sigue este orden:

1. **Hero.** Titular, entradilla, botón, reserva y nota, con la ilustración del caos al orden al lado desde 1180 px y debajo en pantallas menores. Cierra con la franja de los cuatro compromisos.
2. **Qué hacemos.** Tres servicios, cada uno con su ilustración animada, «Para cuando…», qué hacemos, un ejemplo, «Consultar sobre…» con el tema del formulario preseleccionado (`/?necesidad=<clave>#contacto`) y un enlace al proyecto de la portada que lo demuestra. Cierra con «Hacer una consulta» y el tema «Todavía no lo tengo claro».
3. **Proyectos que hemos desarrollado.** Padel Club OS destacado («Para el club», «Para el jugador» y «Hoy», enlace a su ficha y a padelclubos.com), tres tarjetas (almacén, radio y evento) y la mención «También:» del asistente.
4. **Cómo trabajamos.** Banda de tinta con «Antes de empezar sabrás qué haremos, cuánto costará y cuándo estará listo», la hoja «Propuesta» y los cuatro pasos (Hablamos, Te enviamos una propuesta, Lo desarrollamos contigo y Lo ponemos en marcha), cada uno con su compromiso. Cierra con consulta y reserva.
5. **Quiénes somos.** «Siempre sabrás quién responde de tu proyecto»: sociedad con sede en Valencia, Alberto como fundador y responsable, retrato, ficha y reserva.
6. **Preguntas.** Siete desplegables nativos con la del precio abierta: precio, herramientas actuales, empezar por una mejora, qué pasa tras la entrega, no saber qué se necesita, trabajo fuera de Valencia e IA.
7. **Contacto.** «Cuéntanos qué te gustaría mejorar», formulario corto, «Qué pasa después de escribirnos» en tres pasos, reserva de llamada y email.

El pie lleva la descripción, «Hacer una consulta» (oculto en las fichas, que ya cierran con esa acción), las columnas «La web», «Contacto» y «Legal», y la razón social.

## Evidencia y persona responsable

La web enseña cinco proyectos reales: plataforma de pádel, gestión de almacén, web de radio, web de evento y asistente para la gestión de proyectos. En la portada, Padel Club OS va destacado, el almacén, la radio y el evento van en tarjetas y el asistente es una mención de texto con enlace a su ficha. Las fichas exponen qué había que resolver, qué se desarrolló y por qué, sin atribuir resultados comerciales ni uso por clientes sin evidencia.

**La web pública no indica el tipo de relación con cada proyecto** (producto propio, encargo, proyecto personal o piloto interno). Pruebas de `src/lib/copy.test.ts` y `src/lib/projects.test.ts` vigilan que esos rótulos no vuelvan al copy ni a las fichas.

Los visuales son capturas reales con datos de demo, servidas desde `public/proyectos/` y declaradas con su tamaño real en `capturas` (`src/data/projects.ts`). Una prueba exige que todo archivo de esa carpeta esté declarado, para que ningún original quede descargable por olvido. Las ilustraciones SVG son esquemas propios y no se presentan como capturas de ningún proyecto. Condiciones de publicación:

- **Padel Club OS**: se puede mostrar con marca y enlace a `padelclubos.com`. Es el único proyecto con nombre, enlace externo y estado publicado («En producción. Funciona como servicio por suscripción para clubes.»). Se enseña la academia con el portal del móvil delante y, en la ficha, un recorte de la parrilla de reservas a tamaño real. `recepcion.png` sigue declarada pero no sale en ninguna página porque enseña los contadores a cero. Pendiente recapturar con un día con actividad y a más resolución: las actuales son de 1280 px.
- **Gestión de almacén**: nombre del producto difuminado. Publicar las originales requiere autorización del cliente.
- **Web de evento**: sin nombre ni enlace. `evento/cuenta-anonima.jpg` difumina monograma y fecha. Se enseña solo la franja clara de la web, sin el bloque granate, con un detalle ampliado de «ES / FR» y «Confirmar asistencia» que no pasa de 266 px porque la captura mide 1120. La portada original, con nombres, fecha, lugar y fotografía, se retiró del árbol servido el 23 de septiembre de 2026.
- **Web de radio**: sin nombre ni enlace hasta tener permiso del cliente. `radio/portada-anonima.jpg` difumina marca, titular, subtítulo y fotografía de los presentadores. La web de escritorio va al fondo, para que se vean el menú y el reproductor fijo, y el móvil delante tapa la zona difuminada.
- **Asistente de IA**: `asistente/traza-sin-marcas.png` difumina conversaciones, nombres de personas y empresas, el contenido de la respuesta, el usuario y los nombres de herramientas de terceros (correo, mensajería, suite ofimática y modelo). En la portada es solo una mención de texto. Revisar cualquier captura nueva antes de publicarla.

Los originales retirados siguen en el historial de git de un repositorio público y en despliegues anteriores. Retirarlos de ahí es una decisión pendiente de Alberto.

La fila de logos de herramientas se retiró con la landing «El punto». Los SVG siguen en `public/logos/` sin uso. Si volviera, recordar que Python, OpenAI y AWS piden autorización para recolorear su marca o reservan su wordmark.

«Quiénes somos» lleva el retrato 4:5 de Alberto (recortado a 4:3 y después del texto en móvil) y una ficha con responsable de los proyectos, sede, forma de trabajo y razón social. La razón social también aparece en el aviso del formulario y en el pie. El hero ya no lleva firma ni retrato, así que `public/sobre/retrato-1x1.jpg` queda sin uso.

## Estado técnico

- Node 24.x, Next.js 16.3.3, React 19.2.8, TypeScript y Tailwind CSS 3. El rediseño no añadió dependencias y retiró `lucide-react`. La portada, las cinco fichas, las páginas legales y sus imágenes OG se generan como estáticas en el build.
- **Identidad.** El logo no cambia: `Wordmark`, en Fragment Mono a 19 px (16 px por debajo de 480), con `BPM` en tinta, `TECH` en cobalto y el glifo de tres piezas. Todo el texto usa Schibsted Grotesk, variable de 400 a 900, con los titulares a 560. Archivo y Archivo Black se retiraron, también el TTF de Archivo Black que usaban las imágenes OG.
- **Tokens en tres sitios** que deben coincidir: `tailwind.config.ts`, las variables CSS de `src/app/globals.css` (para los CSS Modules y las reglas con variables por elemento) y `src/lib/palette.ts` (hexadecimal para los atributos de los SVG y las imágenes OG). Paleta: papel `#F7F6F2`, blanco, arena `#EDE8DC` para los escenarios, tinta `#101013` con tres grises (`ink-4` solo para decoración), filetes, cobalto `#2743E0` (el del logo) con su tono de hover y sus fondos claros, `cobalt-bright` `#6B83FF` sobre oscuro, el pósit y el rojo de error. Sin gradientes ni sombras de color.
- **Escala y rejilla.** Tamaños `h1` (34 a 60 px), `h2` (30 a 50 px), `h3`, `lead`, `body`, `small`, `caption` y `micro` en `tailwind.config.ts`, con el peso del titular incluido. Contenedor de 1200 px como máximo con margen lateral de 20 a 56 px, secciones con 80 a 136 px de relleno y cabecera de 60, 64 o 72 px. Puntos de corte escritos con su número en píxeles: 400, 480, 600, 700, 768, 800, 980, 1024, 1180 y 1280 (este último está declarado, pero ninguna clase lo usa). Radios de 8 a 18 px en capturas, botones, campos y tarjetas, y cuadrados sin radio para marcas y casillas. Las opacidades que no están en la escala de Tailwind se escriben con valor arbitrario, como `bg-on-dark/[.18]`.
- **Componentes.** `src/components/hero/` (dibujo del hero y su máquina de estados), `services/` (escenario arena e ilustraciones de agenda, conexión y web), `method/` (propuesta y línea del proceso), `sections/` (secciones de la portada y formulario), `layout/` (cabecera, menú, pie y maqueta legal) y `ui/` (botones, enlaces, figuras de proyecto, `PlayOnView` y `RevealObserver`). El texto visible sale de `src/data/copy.json` y `src/data/projects.ts` y se pinta en el servidor. Los componentes cliente reciben sus textos por props, así que `copy.json` no viaja al navegador.
- **Movimiento.**
  - El marcado que pinta el servidor es siempre el estado final. Los estados ocultos solo existen con la clase `.js` en `<html>`, que pone un script en línea antes del primer pintado, y dentro de `@media screen and (prefers-reduced-motion: no-preference)`. Sin JavaScript, con movimiento reducido o al imprimir se ve todo, completo y quieto.
  - **Hero.** Pasa de `idle` (caos quieto) a `play` (del caos al orden, 4 s) y a `live`, con un recordatorio por pieza cada 6 s, y se para en `done`. Control «Pausar», «Reanudar» y «Ver de nuevo» (WCAG 2.2.2). Se detiene fuera de pantalla y con la pestaña oculta. Si el JavaScript no llega a hidratar, una red de seguridad en CSS ordena el caos a los 7 s, y si hidrata tarde la ilustración no vuelve al caos. Composición móvil propia hasta 767 px, la de escritorio a 600 px desde 768 y en dos columnas desde 1180. El H1 y la entradilla no se animan porque son el LCP.
  - **Qué hacemos y Cómo trabajamos.** `PlayOnView` escribe `data-state` al entrar en pantalla. La agenda, la web, la propuesta y la línea del proceso se reproducen una vez. La conexión de datos hace una pasada de 4,5 s cada vez que entra, sin bucle.
  - **Aparición al hacer scroll** con `data-reveal` y un único `RevealObserver`: 16 px y opacidad en 0,8 s. Nunca en el hero.
  - Las animaciones solo mueven `transform` y `opacity`. Las marcas del proceso, el filete de la cabecera y los controles cambian además de color. El desplazamiento suave de las anclas se activa después de la carga, así que un enlace compartido a `/#contacto` salta sin recorrer la página. Con movimiento reducido, una regla global deja duraciones y retardos a cero.
- **Hero en portátiles bajos.** Desde 1180 px de ancho y hasta 880 de alto, el hero compacta sus huecos y la ilustración se limita al alto disponible, sin bajar de 500 px para que su texto se lea. La franja de compromisos cabe entera a 1280 × 712, 1440 × 789, 1536 × 730, 1280 × 800 y desde 1440 × 900. A 1366 × 657 quedan fuera 48 px y a 1180 × 700, 17 px.
- **Cabecera** fija, con filete al hacer scroll. «Hacer una consulta» siempre visible. Navegación desde 1180 px, con «Proyectos» marcado dentro de las fichas. Por debajo, menú con un `<details>` nativo que abre y cierra sin JavaScript. Con JavaScript se cierra al elegir un enlace, con Escape (y devuelve el foco al botón), con un clic fuera, cuando el foco sale del panel y al ampliar a 1180 px. Sin JavaScript sigue abierto después de elegir un enlace. En colores forzados se ven sus barras.
- **Foco y teclado.** Anillo cobalto de 3 px a 3 px de distancia, cobalto claro sobre oscuro. Los campos del formulario marcan el foco con borde cobalto y halo claro, y con error, con un anillo rojo de 2 px. «Saltar al contenido» lleva a un elemento propio al principio de `main`. `main` ya no es enfocable, así que un clic en un texto no devuelve el siguiente Tab al hero. Los enlaces «Consultar sobre…» llevan la vista y el foco al título del formulario.
- **Fichas** (`/proyectos/[slug]`). Volver a proyectos, tipo de proyecto, titular, entradilla, estado y enlace externo (solo Padel Club OS) y la figura con la misma composición que su tarjeta. Después, «Qué había que resolver», «Qué desarrollamos», «De cerca» y «Por qué lo hicimos así» con una nota «Para otro negocio», y un cierre en tinta, «¿Necesitas algo parecido?», con consulta y reserva. Los detalles marcados `soloMovil` solo aparecen por debajo de 768 px, donde la figura principal se lee pequeña. Por eso el evento y la radio no tienen «De cerca» desde 768. Con `dynamicParams = false`, un slug inventado da 404 sin renderizarse ni escribirse en la caché.
- **Imágenes.** `next/image` con un `sizes` calculado sobre el escenario de cada captura. La del almacén mide 3200 px de origen y se pide al ancho que se pinta.
- **Fuentes.** La redonda se precarga. La itálica solo sirve para la letra «a mano» de las notas del hero. Va en una instancia sin precarga y solo se aplica, y por tanto se descarga, con JavaScript y movimiento permitido. Fragment Mono se precarga para el logo. Las imágenes OG usan TTF propios de `src/assets/fonts/` (Schibsted a 400 y 560 y Fragment Mono), porque Satori no lee fuentes variables ni WOFF2.
- **Páginas legales y 404.** `LegalLayout` les da la piel común y el texto jurídico se conserva. La 404 tiene título propio, «Página no encontrada · BPM Tech».
- Imágenes Open Graph generadas para la portada y las fichas, metadatos propios y sitemap sin fechas ficticias.
- Retirados en este rediseño: las láminas anotadas (`Plate`, `PlateStage` y `src/data/plates.ts`), `Process`, `SheetHeader` y `SquareWord`. Siguen retirados de antes el canvas «El punto», la frase rotatoria, la banda AI-first y el carrusel. El asistente de ideas (`Diagnostico`, `DiagnosticoForm`) y `POST /api/diagnostico` se conservan sin montarse en la portada.
- **Pruebas.** `npm test` ejecuta 107. Vigilan las reglas del copy (sin punto y coma ni rayas, sin primera persona del singular ni «nuestro equipo», sin tipo de relación con los proyectos, solo las cifras autorizadas, sin punto final en titulares y botones, un solo nombre para la acción principal), las capturas (tamaño real declarado, recortes dentro de la imagen, ningún archivo público sin declarar), el contacto, el endpoint, los eventos y el diagnóstico.

## Contacto, datos y medición

El contacto público autorizado es `bpmtechstudio@gmail.com`, centralizado en `site.email` y compartido por Contacto, el formulario, el pie y las páginas legales. Las frases de `copy.json` que lo nombran lo escriben tal cual y una prueba comprueba que coincide con `site.email`. Alberto lo confirmó al empezar el rediseño y descartó un buzón del dominio. El formulario utiliza Resend y su destinatario se configura por separado mediante `CONTACT_EMAIL` en el servidor, con esa misma dirección. Gmail recibe las consultas. Cloudflare gestiona el dominio y DNS. El remitente técnico de Resend debe conservar un dominio verificado y `Reply-To` apunta al visitante.

El nuevo destinatario está configurado en desarrollo local. No se han añadido credenciales de Resend, actualizado variables remotas ni acreditado entrega real de correo.

El formulario pide nombre, email y mensaje. La ayuda del mensaje va como texto encima del campo. El tema es opcional: cuatro píldoras (radios nativos) bajo «¿Qué te gustaría conseguir?», que son «Todavía no lo tengo claro» (`diagnostico`), «Organizar la gestión» (`operativa`), «Quitar trabajo repetido» (`automatizacion`) y «Una web o una aplicación nueva» (`web`). Se preselecciona con `?necesidad=` al llegar desde un servicio, sin perder lo ya escrito. Empresa y teléfono van en el desplegable «Añadir empresa o teléfono». Desde una ficha, `?proyecto=` añade el proyecto de referencia. La política de privacidad se abre en otra pestaña para no perder lo escrito.

El formulario evita envíos GET, utiliza reglas compartidas y muestra errores por campo, con el foco en el primero. Permanece deshabilitado antes de la hidratación y sin JavaScript. Sin JavaScript explica el requisito y ofrece el email y la reserva. Los fallos del envío conservan los valores, permiten reintento, ofrecen el email como alternativa y no se presentan como éxito. El mensaje de enviado recibe el foco. Timeout de lectura del cuerpo de 5 segundos, del proveedor de 10 segundos y del cliente de 20 segundos, claves de idempotencia y límite sobre los bytes reales del cuerpo. La memoria de los limitadores está acotada y su alcance es por proceso. El email interno de aviso no lleva rayas y una prueba lo vigila.

Cal.com ofrece la primera conversación: **30 minutos** por Cal Video en `https://cal.com/bpmtechstudio/30min`. La configuración pública se centraliza en `src/data/booking.ts`. Se abre en un diálogo desde el hero, «Cómo trabajamos», «Quiénes somos», Contacto y el cierre de cada ficha. El diálogo carga la agenda al solicitarla y ofrece acceso directo a Cal.com. El menú móvil y el pie enlazan directamente a Cal.com en otra pestaña. Sin JavaScript, los disparadores del diálogo se anuncian como enlaces que abren otra pestaña. La disponibilidad y los campos se administran en la cuenta del proveedor. La integración permanece en revisión local y no acredita un despliegue remoto ni la creación de citas de prueba.

Los eventos de interacción utilizan categorías limitadas y se escriben en los logs del alojamiento, sin valores del formulario, IP, URL completa ni identificadores de visitante en esos mensajes. La medición del navegador respeta DNT y GPC. Las aceptaciones del correo se registran aparte y se deduplican por identificador del proveedor al consultarlas. Los registros de infraestructura y sus plazos de retención deben revisarse por separado.

La aceptación del proveedor no prueba entrega, lectura o cierre. La operación comercial debe mantener separados recepción, cualificación, propuesta y cliente ganado.

La apertura de la agenda se mide como `cta_click` con `destination: "booking"`, su ubicación (`hero`, `method`, `about`, `contact`, `case`, `header` o `footer`) y la referencia de caso permitida. El enlace «Abrir en Cal.com» del diálogo no se mide, para no contar dos veces la misma intención. El enlace «Escríbenos» de Preguntas se mide con la ubicación `faq`. La medición no registra datos introducidos en Cal.com ni equivale a una reserva confirmada. Las citas efectivas se comprueban en Cal.com y se incorporan al seguimiento comercial por separado. La política de privacidad incorpora la reserva y la videollamada como servicios externos.

## Verificación y siguientes pasos

Los comandos y variables están en [README.md](../README.md). Ejecutar `npm run check` con Node 24 y verificar los recorridos en navegador. Usar datos sintéticos y proveedor simulado para las pruebas de desarrollo.

Estado del rediseño «Orden», verificado en local el 26 de septiembre de 2026: `npm run check` en verde (lint, tipos, 107 pruebas y build) con Node 22.22.2, el del entorno de trabajo. Recorridos de Playwright contra `next start`, axe-core sin violaciones reales, ningún desbordamiento horizontal de 300 a 1940 px y comprobación sin JavaScript y con movimiento reducido. Todo en Chromium. El detalle, las capturas y los límites están en [rediseno-orden/README.md](rediseno-orden/README.md).

No verificado: Safari, Firefox, dispositivos reales, lector de pantalla real, la web publicada, un envío real de correo y una reserva real. En Chromium Linux el texto de Schibsted servido por `next/font` mide un 2 o 3 % más ancho que en el prototipo, así que conviene revisar los cortes de línea en macOS o Windows.

Comprobar especialmente móvil, teclado, menú, anclas, formularios con errores, red lenta, respuestas inesperadas, idempotencia, movimiento reducido, JavaScript desactivado, colores forzados e impresión. Revisar metadatos y accesos directos a archivos, no solo las páginas visibles.

Siguientes pasos, pendientes de Alberto:

- Recapturar Padel Club OS con un día con actividad y a más resolución, y la web del evento a 2x.
- Revisar la web en un navegador real y en un móvil real.
- Desplegar y verificar en la versión publicada un envío real y una reserva real, con autorización. Revisar antes en Vercel `CONTACT_EMAIL` y el remitente verificado, sin cambiarlos por conveniencia.
- Decidir si se purgan del historial de git y de los despliegues anteriores los originales sin anonimizar, y si `POST /api/diagnostico` debe seguir desplegado.

Antes de dar por resuelta la operación pública, verificar la versión desplegada, la configuración efectiva de correo y el seguimiento de consultas. Revalidar datos legales, bases, proveedores y criterios de conservación con el responsable. La implementación técnica no equivale a una revisión jurídica completa.

La [guía de captación y seguimiento](captacion-y-seguimiento.md) describe la operación comercial y su registro de oportunidades. La siguiente mejora comercial debe basarse en consultas y oportunidades observadas. Nuevas páginas por necesidad, integraciones de captación o infraestructura adicional requieren contenido útil y un problema concreto que resolver.

## Documentación histórica

[rediseno/README.md](rediseno/README.md) documenta el rediseño «Planos anotados» del 23 y 24 de septiembre de 2026. Sus láminas, la voz en primera persona del singular, Archivo y el índice numerado de proyectos ya no son vigentes. Sus capturas completas sirven de «antes» del rediseño «Orden».

Los informes [verificacion-2026-09-09.md](verificacion-2026-09-09.md), [verificacion-caso-ia.md](verificacion-caso-ia.md), [verificacion-reservas-2026-09-09.md](verificacion-reservas-2026-09-09.md) y [verificacion-landing-2026-09-23.md](verificacion-landing-2026-09-23.md) recogen iteraciones anteriores. Sus resultados no describen la web actual.

`docs/prompt-claude-design.md` conserva el encargo inicial. Sus indicaciones sobre identidad provisional, proyectos conceptuales, email oculto en todas las pantallas, Framer Motion o arquitectura de secciones no son instrucciones vigentes.

Los HTML de `brand/` y las plantillas de `templates/presentation/` son materiales independientes. No deben utilizarse como inventario actualizado de la web ni como prueba de sus resultados o de su estado de publicación.
