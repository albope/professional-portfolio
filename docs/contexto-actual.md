# Contexto vigente de la web BPM Tech

Actualizado: 11 de septiembre de 2026, tras aplicar el rediseño del handoff «Evolución de la web de BPM Tech Studio». Este documento describe el árbol de trabajo revisado en esta fecha. No acredita un despliegue, la entrega de correo ni resultados comerciales. Los resultados concretos de las comprobaciones deben consultarse en la entrega de implementación correspondiente.

## Dirección comercial

BPM Tech presenta software y webs a medida para pymes, con startups y proyectos particulares como perfiles complementarios. El titular es «Software y webs que encajan en tu negocio». La entrada al contacto es «Cuéntanos qué necesitas resolver» y admite necesidades todavía poco definidas.

La oferta se organiza por tres necesidades: ordenar la operativa, conectar y automatizar herramientas, y crear o mejorar una web. La consultoría permite definir prioridades. La IA sigue formando parte de la oferta cuando aporta valor al problema concreto.

La home contiene Hero, Trabajo reciente, Servicios, Método, Sobre BPM Tech y Contacto, en ese orden: el trabajo va antes que el discurso. El hero cede su mitad derecha a una captura real de Padel Club OS que sangra hasta el borde del lienzo; en móvil esa misma captura abre Trabajo reciente. No hay un bloque de stack protagonista ni un diagrama en el hero.

## Evidencia y persona responsable

La galería contiene cinco proyectos reales: plataforma de pádel, gestión de almacén, web de evento, web de radio y asistente de IA para gestión de proyectos. Padel Club OS abre la sección. Las fichas exponen lo desarrollado y su alcance, sin atribuir resultados comerciales ni uso por clientes sin evidencia.

**La web pública no indica el tipo de relación con cada proyecto** (producto propio, encargo, proyecto personal o piloto interno). Las leyendas llevan solo el nombre del trabajo; esa clasificación es criterio interno y vive en el tablero de la propuesta de diseño. Una prueba de `src/lib/projects.test.ts` vigila que esos rótulos no vuelvan al copy público.

Los visuales son capturas reales de los productos con datos de demo, servidas desde `public/proyectos/`. Sus condiciones de publicación, revisadas en septiembre de 2026:

- **Padel Club OS**: se puede mostrar con marca y enlace a `padelclubos.com`. Pendiente rehacer las capturas a 1440 px; las actuales son de 1280.
- **Gestión de almacén**: nombre del producto difuminado. Publicar las originales requiere autorización del cliente.
- **Web de evento**: sin nombre ni enlace.
- **Web de radio**: marca difuminada, sin nombre ni enlace hasta tener permiso del cliente.
- **Asistente de IA**: captura sin la marca del producto ni avatar. Revisar nombres de clientes y personas visibles antes de cada publicación.

La sección Sobre BPM Tech publica el retrato y el nombre **Alberto Bort** junto al rol «Dirección de proyectos y tecnología», confirmado por él en septiembre de 2026. No se inventa tamaño de equipo, capacidad ni disponibilidad. Propiedad, documentación, presupuesto y soporte se acuerdan en cada propuesta.

## Estado técnico

- Node 24.x, Next.js 16.3.3, React 19.2.8, TypeScript y Tailwind CSS 3.
- Identidad conservada: papel, tinta y cobalto; Archivo Black, Archivo y Fragment Mono.
- `ink-faint` actualizado a `#6a685d`; etiquetas legibles y contraste revisado en las combinaciones utilizadas.
- Lienzo de 1440 px centrado; márgenes 16 / 40 / 60 con punto de ruptura propio `wide` en 1440. Esquinas rectas y sin sombras salvo en las capturas de evento y radio.
- Cabecera estática sobre papel: 60 px en móvil, 64 entre 768 y 1439, 72 a partir de 1440. La navegación completa aparece desde 768 px.
- Una sola animación continua en toda la web: la última palabra del titular del hero recorre negocio, club, almacén, evento y radio. Con `prefers-reduced-motion` se queda en «negocio».
- Contenido servido visible, sin depender de la hidratación para aparecer. Framer Motion y Lenis retirados.
- Scroll nativo (sin `scroll-behavior: smooth`), movimiento reducido y árbol estable para preservar el formulario.
- Menú móvil mediante diálogo nativo: fondo inerte, foco contenido, cierre con Escape, devolución del foco y cierre al ampliar a escritorio. Navegación alternativa cuando JavaScript está desactivado.
- Método con hijos `li` directos dentro de `ol`.
- Imágenes Open Graph generadas para home y casos, metadatos propios y sitemap sin fechas ficticias.

## Contacto, datos y medición

El contacto público autorizado es `bpmtechstudio@gmail.com`, centralizado en `site.email` y compartido por Contacto, el pie y las páginas legales. El formulario utiliza Resend y su destinatario se configura por separado mediante `CONTACT_EMAIL` en el servidor, con esa misma dirección. Gmail recibe las consultas; Cloudflare gestiona el dominio y DNS. El remitente técnico de Resend debe conservar un dominio verificado y `Reply-To` apunta al visitante.

El nuevo destinatario está configurado en desarrollo local. No se han añadido credenciales de Resend, actualizado variables remotas ni acreditado entrega real de correo.

Cal.com está integrado en Contacto y como CTA secundario al final de cada caso. La primera conversación dura **30 minutos**, se realiza por Cal Video y utiliza `https://cal.com/bpmtechstudio/30min`. La configuración pública se centraliza en `src/data/booking.ts`. El diálogo carga la agenda al solicitarla y ofrece acceso directo a Cal.com; la disponibilidad y los campos se administran en la cuenta del proveedor. La integración permanece en revisión local y no acredita un despliegue remoto ni la creación de citas de prueba.

El formulario evita envíos GET, utiliza reglas compartidas y muestra errores por campo. Permanece deshabilitado antes de la hidratación y sin JavaScript. Los fallos conservan los valores, permiten reintento y no se presentan como éxito. Timeout de lectura del cuerpo de 5 segundos, del proveedor de 10 segundos y del cliente de 20 segundos, claves de idempotencia y límite sobre los bytes reales del cuerpo. La memoria de los limitadores está acotada; su alcance es por proceso.

Los eventos de interacción utilizan categorías limitadas y se escriben en los logs del alojamiento, sin valores del formulario, IP, URL completa ni identificadores de visitante en esos mensajes. La medición del navegador respeta DNT y GPC. Las aceptaciones del correo se registran aparte y se deduplican por identificador del proveedor al consultarlas. Los registros de infraestructura y sus plazos de retención deben revisarse por separado.

La aceptación del proveedor no prueba entrega, lectura o cierre. La operación comercial debe mantener separados recepción, cualificación, propuesta y cliente ganado.

La apertura de la agenda se mide como `cta_click` con `destination: "booking"`, ubicación y referencia de caso permitida. No registra datos introducidos en Cal.com ni equivale a una reserva confirmada. Las citas efectivas se comprueban en Cal.com y se incorporan al seguimiento comercial por separado. La política de privacidad incorpora la reserva y la videollamada como servicios externos.

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
