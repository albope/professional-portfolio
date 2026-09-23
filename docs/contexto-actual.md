# Contexto vigente de la web BPM Tech

Actualizado: 23 de septiembre de 2026, con el rediseño «Planos anotados». Este documento describe el árbol local. No acredita despliegue, entrega de correo ni resultados comerciales.

## Dirección comercial y de arte

BPM Tech presenta software a medida, automatizaciones e integraciones, y webs para negocios. El titular es «Software a medida para lo que hoy haces a mano.» y la acción principal, «Cuéntame qué necesitas». La alternativa discreta es la llamada de 30 minutos. La primera conversación se ofrece sin compromiso. El copy habla en primera persona del singular: detrás está Alberto.

**Concepto: planos anotados.** La web enseña el trabajo en lugar de describirlo. Las capturas reales llevan notas numeradas sobre las decisiones que las hacen funcionar y un cajetín con los datos del proyecto, como un plano técnico. El marcador numerado es el cuadrado macizo del glifo de la marca. El método usa las tres piezas del glifo (barra, cuadrado hueco y cuadrado macizo) para sus tres pasos. No hay animaciones automáticas: el único gesto es que, con ratón, pasar por una nota señala su marcador y al revés.

La home sigue este orden: hero con la lámina de Padel Club OS, Proyectos (índice numerado de los cinco, láminas del almacén y de la radio y franjas de interfaz del evento y del asistente), Servicios (tres filas con el proyecto donde se puede ver cada uno), Método, Sobre mí, Preguntas frecuentes y Contacto.

Referencias usadas para decidir y sus principios (contrastadas por búsqueda, sin navegación directa desde el entorno de trabajo): Linear (el producto real como demostración), Basecamp «Before & After» (lenguaje llano), Pentagram (el trabajo manda), índice de obras de Herzog & de Meuron (número e índice como navegación), guías de Teenage Engineering (llamadas numeradas) y sistema de información de SBB de Müller-Brockmann (símbolos funcionales sobre retícula).

## Evidencia y persona responsable

La galería contiene cinco proyectos reales: plataforma de pádel, gestión de almacén, web de radio, web de evento y asistente de IA para gestión de proyectos, numerados del 01 al 05. Las fichas exponen lo desarrollado y su alcance, sin atribuir resultados comerciales ni uso por clientes sin evidencia.

**La web pública no indica el tipo de relación con cada proyecto** (producto propio, encargo, proyecto personal o piloto interno). Las leyendas llevan solo el nombre del trabajo. Pruebas de `src/lib/copy.test.ts` y `src/lib/projects.test.ts` vigilan que esos rótulos no vuelvan al copy, a las fichas ni a las notas de las láminas.

Los visuales son capturas reales con datos de demo, servidas desde `public/proyectos/`. Una prueba exige que todo archivo de esa carpeta esté declarado en los datos, para que ningún original quede descargable por olvido. Condiciones de publicación:

- **Padel Club OS**: se puede mostrar con marca y enlace a `padelclubos.com`. Es el único proyecto con enlace externo. Pendiente rehacer las capturas a 1440 px; las actuales son de 1280.
- **Gestión de almacén**: nombre del producto difuminado. Publicar las originales requiere autorización del cliente.
- **Web de evento**: sin nombre ni enlace. `evento/cuenta-anonima.jpg` difumina monograma y fecha. La portada, con nombres, fecha, lugar y fotografía, se retiró del árbol servido el 23 de septiembre de 2026.
- **Web de radio**: sin nombre ni enlace hasta tener permiso del cliente. `radio/portada-anonima.jpg` difumina marca, titular, subtítulo y fotografía de los presentadores. La portada solo se enseña en vista partida: cabecera y reproductor.
- **Asistente de IA**: `asistente/traza.png` difumina conversaciones, nombres de personas y empresas, el contenido de la respuesta y el usuario. Revisar cualquier captura nueva antes de publicarla.

Los originales retirados siguen en el historial de git de un repositorio público y en despliegues anteriores. Retirarlos de ahí es una decisión pendiente de Alberto.

La fila de logos de herramientas se retiró con la landing «El punto». Los SVG siguen en `public/logos/` sin uso. Si volviera, recordar que Python, OpenAI y AWS piden autorización para recolorear su marca o reservan su wordmark.

El hero lleva la firma de Alberto Bort con el retrato cuadrado y la sección «Sobre mí» el retrato 4:5 con un cajetín: responsable, base, forma de trabajo y email. No se inventan tamaño de equipo, capacidad, disponibilidad ni resultados.

## Estado técnico

- Node 24.x, Next.js 16.3.3, React 19.2.8, TypeScript y Tailwind CSS 3. Se mantiene Next.js: sirve la home y las fichas como HTML estático, conserva formulario, API, OG y sitemap, y no había ninguna ventaja que justificara migrar.
- Identidad conservada: papel, tinta y cobalto; Archivo Black, Archivo y Fragment Mono; esquinas rectas.
- Láminas: `src/data/plates.ts` define recortes y marcadores en píxeles de la imagen original, con un recorte por debajo de 1024 px y otro por encima. `src/components/ui/Plate.tsx` y `PlateStage.tsx` los convierten a porcentajes con variables CSS (`.plate-shot`, `.plate-crop` y `.plate-marker` en `globals.css`). La caja reserva la proporción del recorte, así que la carga no provoca saltos. Las pruebas comprueban que cada recorte cae dentro de su imagen y que cada nota tiene marcador visible en ambos recortes.
- Solo la captura del hero se carga con prioridad. Las demás son diferidas y `next/image` sirve el tamaño que pide cada recorte.
- Lienzo de 1440 px centrado, márgenes 16 / 40 / 60. El hero pone texto y lámina en dos columnas desde 1280 px; por debajo se apilan. Comprobado de 320 a 1920 px.
- Cabecera fija sobre tinta. En móvil, «Hablemos» queda visible junto al menú desde 360 px. El brillo en bucle del wordmark se retiró: el encargo de rediseño evita bucles decorativos constantes.
- La escala de opacidad de Tailwind va de cinco en cinco. Los valores del diseño que no encajan —16, 24, 28, 62, 72, 78 y 82— están declarados en `tailwind.config.ts`. Sin esa declaración la utilidad no genera regla y desaparece en silencio.
- Retirados del código el canvas «El punto» (`PuntoCanvas`, `punto-engine`), la frase rotatoria, la banda AI-first y el carrusel automático. El asistente de ideas y `POST /api/diagnostico` se conservan, sin montarse en la portada.
- El contenido principal se sirve visible y funciona sin JavaScript. Las cinco preguntas usan `details` y `summary` nativos, con la primera respuesta abierta.
- Scroll nativo, `prefers-reduced-motion` respetado y árbol estable para preservar el formulario.
- Menú móvil mediante diálogo nativo: fondo inerte, foco contenido, cierre con Escape, devolución del foco y cierre al ampliar a escritorio. Navegación alternativa cuando JavaScript está desactivado.
- Imágenes Open Graph generadas para home y casos, metadatos propios y sitemap sin fechas ficticias.

## Contacto, datos y medición

El contacto público autorizado es `bpmtechstudio@gmail.com`, centralizado en `site.email` y compartido por Contacto, el pie y las páginas legales. El formulario utiliza Resend y su destinatario se configura por separado mediante `CONTACT_EMAIL` en el servidor, con esa misma dirección. Gmail recibe las consultas; Cloudflare gestiona el dominio y DNS. El remitente técnico de Resend debe conservar un dominio verificado y `Reply-To` apunta al visitante.

El nuevo destinatario está configurado en desarrollo local. No se han añadido credenciales de Resend, actualizado variables remotas ni acreditado entrega real de correo.

El asistente de ideas ya no se monta en la portada. Sus componentes y `POST /api/diagnostico` se conservan como implementación anterior. El formulario mantiene la opción «Necesito ayuda para definir mi proyecto» (`diagnostico`) como necesidad comercial válida, independiente del asistente.

Cal.com está integrado en el hero, en Contacto y como CTA secundario al final de cada caso. La primera conversación dura **30 minutos**, se realiza por Cal Video y utiliza `https://cal.com/bpmtechstudio/30min`. La configuración pública se centraliza en `src/data/booking.ts`. El diálogo carga la agenda al solicitarla y ofrece acceso directo a Cal.com; la disponibilidad y los campos se administran en la cuenta del proveedor. La integración permanece en revisión local y no acredita un despliegue remoto ni la creación de citas de prueba.

El formulario evita envíos GET, utiliza reglas compartidas y muestra errores por campo. Permanece deshabilitado antes de la hidratación y sin JavaScript. Los fallos conservan los valores, permiten reintento y no se presentan como éxito. Timeout de lectura del cuerpo de 5 segundos, del proveedor de 10 segundos y del cliente de 20 segundos, claves de idempotencia y límite sobre los bytes reales del cuerpo. La memoria de los limitadores está acotada; su alcance es por proceso.

Los eventos de interacción utilizan categorías limitadas y se escriben en los logs del alojamiento, sin valores del formulario, IP, URL completa ni identificadores de visitante en esos mensajes. La medición del navegador respeta DNT y GPC. Las aceptaciones del correo se registran aparte y se deduplican por identificador del proveedor al consultarlas. Los registros de infraestructura y sus plazos de retención deben revisarse por separado.

La aceptación del proveedor no prueba entrega, lectura o cierre. La operación comercial debe mantener separados recepción, cualificación, propuesta y cliente ganado.

La apertura de la agenda se mide como `cta_click` con `destination: "booking"`, ubicación (`hero`, `contact` o `case`) y referencia de caso permitida. No registra datos introducidos en Cal.com ni equivale a una reserva confirmada. Las citas efectivas se comprueban en Cal.com y se incorporan al seguimiento comercial por separado. La política de privacidad incorpora la reserva y la videollamada como servicios externos.

## Verificación y siguientes pasos

Los comandos y variables están en [README.md](../README.md). Ejecutar `npm run check` con Node 24 y verificar los recorridos en navegador. Usar datos sintéticos y proveedor simulado para las pruebas de desarrollo.

Consultar el [informe de verificación](verificacion-2026-09-09.md) para conocer
resultados y límites de esta iteración. La [guía de captación y seguimiento](captacion-y-seguimiento.md)
describe la operación comercial y su registro de oportunidades.

Comprobar especialmente móvil, teclado, menú, anclas, formularios con errores, red lenta, respuestas inesperadas, idempotencia, movimiento reducido y JavaScript desactivado. Revisar metadatos y accesos directos a archivos, no solo las páginas visibles.

Antes de dar por resuelta la operación pública, verificar la versión desplegada, la configuración efectiva de correo y el seguimiento de consultas. Revalidar datos legales, bases, proveedores y criterios de conservación con el responsable. La implementación técnica no equivale a una revisión jurídica completa.

La siguiente mejora comercial debe basarse en consultas y oportunidades observadas. Nuevas páginas por necesidad, integraciones de captación o infraestructura adicional requieren contenido útil y un problema concreto que resolver.

## Documentación histórica

`docs/prompt-claude-design.md` conserva el encargo inicial. Sus indicaciones sobre identidad provisional, proyectos conceptuales, email oculto en todas las pantallas, Framer Motion o arquitectura de secciones no son instrucciones vigentes.

Los HTML de `brand/` y las plantillas de `templates/presentation/` son materiales independientes. No deben utilizarse como inventario actualizado de la web ni como prueba de sus resultados o de su estado de publicación.
