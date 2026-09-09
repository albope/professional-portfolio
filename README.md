# BPM Tech — Web corporativa

Web en español de BPM Tech para presentar servicios de software y desarrollo web a medida y recibir consultas comerciales. El foco está en pymes, con espacio para startups y proyectos particulares.

El estado funcional del repositorio se resume en [docs/contexto-actual.md](docs/contexto-actual.md). Los cambios locales y las pruebas no acreditan por sí solos que una versión esté publicada o que un correo haya llegado a su destinatario.

## Stack y desarrollo

- Node.js **24.x**, Next.js **16.3.3** con App Router, React **19.2.8** y TypeScript estricto.
- Tailwind CSS 3. Los tokens de la web están en `src/app/globals.css` y `tailwind.config.ts`.
- Archivo Black para titulares, Archivo para texto y Fragment Mono para etiquetas, cargadas con `next/font`.
- Renderizado del contenido en servidor y navegación mediante enlaces normales. El menú móvil utiliza un diálogo nativo.
- Scroll nativo y respeto a `prefers-reduced-motion`. No se utilizan Framer Motion ni Lenis. El contenido permanece visible sin JavaScript.

Con Node 24 activo:

```sh
npm ci
npm run dev
```

La web se abre en `http://localhost:3000`. Para configurar un entorno local, copia `.env.example` a `.env.local` y completa las variables necesarias. El desarrollo visual funciona sin credenciales de correo; en ese caso el envío devuelve un error controlado.

| Comando | Comprobación |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emitir archivos |
| `npm test` | Reglas de contacto, endpoint y eventos con dependencias simuladas |
| `npm run build` | Compilación de producción y generación de rutas |
| `npm run check` | Lint, tipos, tests y build, en ese orden |
| `npm run start` | Servir la compilación de producción |

Los tests de correo sustituyen al proveedor y no envían mensajes reales. El build puede necesitar acceso a Google Fonts si las fuentes no están en caché. La comprobación visual se hace además en navegador, con teclado, móvil, movimiento reducido y JavaScript desactivado.

## Contenido y estructura

La home sigue este recorrido: propuesta, tres necesidades, proyectos reales, método, responsable del trabajo y contacto. Las necesidades son **ordenar la operativa**, **conectar y automatizar** y **crear o mejorar una web**. La consultoría ayuda a decidir el siguiente paso cuando todavía no hay una solución definida.

```text
src/
  app/                         home, casos, legales, 404, sitemap, robots y OG
    api/contact/               recepción de consultas
    api/events/                eventos operativos con categorías limitadas
  components/
    analytics/                 medición de enlaces y visitas a casos
    booking/                   acceso a la agenda y diálogo de reserva
    layout/                    cabecera, pie y wrapper estable de contenido
    sections/                  secciones de la home y formulario
    ui/                        primitivas visuales y esquemas de proyectos
  data/                        site, services, projects, process, legal y booking
  lib/                         contacto, eventos, tests, fuentes y generación OG
```

Los datos de servicios, proyectos, fases e identidad se editan en `src/data/`. El copy de las secciones y la estructura visual también viven en sus componentes. `Reveal` conserva un wrapper de contenido visible en servidor; su nombre no implica una animación.

### Proyectos publicados por el código

| Ruta | Proyecto |
|---|---|
| `/proyectos/asistente-ia-gestion-proyectos` | Asistente de IA para gestión de proyectos, destacado |
| `/proyectos/plataforma-clubes-padel` | Plataforma de gestión para clubes de pádel |
| `/proyectos/wms-almacen` | Sistema de gestión de almacén |
| `/proyectos/web-boda` | Web de evento con confirmación de invitados |
| `/proyectos/web-radio` | Web para un programa de radio con directo |

Los cinco se presentan como **proyectos reales**: tres de software, con el asistente de IA destacado, y dos webs. Las fichas explican necesidad, trabajo realizado, alcance y decisiones. Los visuales son esquemas funcionales identificados como tales. No se publican métricas, testimonios, nombres de terceros o resultados comerciales sin evidencia y autorización.

El asistente de IA se acredita como experiencia profesional de la dirección de proyectos y tecnología, desarrollada en un equipo interno y presentada de forma anónima. Es un desarrollo funcional para un piloto interno: dos agentes para conocimiento y gestión de proyectos, documentos, seguimiento, decisiones y estimaciones revisables. Sus conexiones dependen de configuración y permisos; el caso no acredita una implantación generalizada ni resultados de negocio.

Los originales de `public/screenshots/` se han retirado del árbol servido. Una futura captura debe revisarse como archivo completo antes de publicarse; un recorte mediante CSS no protege su original. La actualización local no elimina copias de despliegues anteriores ni contenidos ya compartidos.

Cada caso tiene su título, canonical e imagen Open Graph. Las OG actuales se generan desde `src/app/opengraph-image.tsx` y `src/app/proyectos/[slug]/opengraph-image.tsx`, con utilidades en `src/lib/og.tsx`. El sitemap no asigna fechas de modificación inventadas.

## Contacto y configuración

El contacto público de BPM Tech es `bpmtechstudio@gmail.com`, centralizado en `site.email` (`src/data/site.ts`). Contacto, el pie de página y las páginas legales utilizan esa misma dirección. Las consultas del formulario se envían mediante `POST /api/contact` y Resend desde el servidor; configurar `CONTACT_EMAIL` con ese buzón en cada entorno. Esta variable sigue siendo configuración del servidor y no determina el contenido público.

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica pública, sin barra final. Por defecto: `https://www.bpmtechstudio.com`. |
| `RESEND_API_KEY` | Credencial del proveedor de correo. Necesaria para enviar. |
| `CONTACT_EMAIL` | Destino del formulario: `bpmtechstudio@gmail.com`. Necesario para enviar. |
| `CONTACT_FROM` | Remitente autorizado. Sin valor usa `BPM Tech <onboarding@resend.dev>`; para producción debe configurarse y verificarse el remitente apropiado. |

Las credenciales se mantienen en el entorno del servidor. No copies sus valores a documentación, logs, capturas o variables con prefijo `NEXT_PUBLIC_`.

Gmail recibe las consultas y permite responderlas. El remitente técnico de Resend (`CONTACT_FROM`) debe pertenecer a un dominio verificado; no sustituirlo por la dirección `@gmail.com`. `onboarding@resend.dev` solo permite pruebas dirigidas al correo de la cuenta de Resend. El `Reply-To` conserva el email validado del visitante para responder a la persona que ha enviado la consulta. Ver [dominios y remitentes](https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend) y [restricciones del dominio de pruebas](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

La configuración local incluye el nuevo destinatario, pero no incorpora credenciales de Resend. Antes de publicar, actualizar las variables del entorno de despliegue y verificar la entrega; cambiar el contenido público o `.env.example` no actualiza Vercel.

### Reserva de llamadas

La alternativa al formulario está integrada en Contacto y al final de los cinco casos: **Primera conversación · BPM Tech**, una videollamada de **30 minutos** por Cal Video. La URL es `https://cal.com/bpmtechstudio/30min`; el enlace, duración y textos comunes se centralizan en `src/data/booking.ts`.

La agenda se carga solo al solicitarla. El componente `BookingLink` abre un diálogo dentro de la web y conserva un enlace directo a Cal.com para continuar allí. La disponibilidad, los datos solicitados y las notificaciones de la reserva se gestionan en Cal.com. Revisar allí cualquier cambio de duración o URL y mantenerlo sincronizado con `booking.ts`.

La integración está preparada para revisión local; estos cambios no actualizan el despliegue remoto. Las pruebas de apertura de agenda no crean citas ni acreditan entrega de sus notificaciones. La política de privacidad describe el proveedor de reserva y videollamada por separado de la medición propia de la web.

### Formulario

El formulario permanece deshabilitado antes de hidratarse y explica el requisito si JavaScript está desactivado. Tiene un destino y método POST defensivos; los datos personales no se envían en la URL. Nombre, email y mensaje son obligatorios; empresa, teléfono y tipo de necesidad son opcionales. Los errores identifican el campo y conservan el borrador mientras la página siga abierta. La política de privacidad se abre sin sustituir la página del formulario.

Los enlaces de servicios y casos pueden aportar exclusivamente los identificadores permitidos mediante `necesidad` y `proyecto`. El formulario y el servidor descartan referencias no reconocidas. No incluyas datos del interesado en enlaces de campaña.

El contrato de éxito exige una aceptación válida del proveedor y una respuesta JSON con `ok: true`, `status: "accepted"` y el mismo identificador del intento. Una respuesta HTML 200 o un JSON inesperado nunca acreditan el envío. **Aceptación del proveedor, entrega del correo, respuesta humana y oportunidad comercial son estados diferentes.**

### Recuperación y límites

- Timeout de lectura del cuerpo: 5 segundos. Del proveedor: 10 segundos. Del cliente: 20 segundos.
- La clave de idempotencia es aleatoria, sin datos del formulario. Un reintento del mismo contenido reutiliza la clave; cambiarlo genera otra. La deduplicación del proveedor tiene una ventana limitada de 24 horas.
- Máximos compartidos: nombre y empresa 200 caracteres, email 254, teléfono 40 y mensaje 5.000. El cuerpo se limita a 40.960 bytes realmente leídos, compatible con los límites y su codificación JSON.
- Protección local del contacto: cinco solicitudes por ventana de 15 minutos y un máximo de 2.000 entradas. La IP se transforma con un hash y una sal del proceso antes de usarla como clave.
- El honeypot no confirma una aceptación. La falta de configuración, validación, exceso de tamaño, limitación y fallos del proveedor producen errores recuperables.

Los contadores están en memoria de cada proceso. No constituyen protección distribuida entre instancias y pueden reiniciarse con el proceso. Cualquier ampliación de infraestructura debe partir del volumen o de incidencias observadas.

## Medición y operación

La medición propia registra eventos en los logs del alojamiento existente. No incorpora SDK de analítica, cookies, almacenamiento local ni identificadores de visitante. La agenda de Cal.com es un servicio externo que se carga al solicitar una reserva y tiene su propia política de privacidad.

| Registro | Contenido y lectura |
|---|---|
| `stream: "bpm-events"` | `cta_click`, `case_open`, `case_view`, `form_start`, `form_validation_error` y `contact_error`, con categorías previamente permitidas. |
| `stream: "bpm-contact"` | `event: "provider_accepted"`, identificador técnico de aceptación, necesidad y proyecto permitidos. Contar identificadores de proveedor distintos para evitar duplicar reintentos. |

En los CTA del hero, `destination: "contact"` o `"projects"` distingue la apertura del contacto de la navegación a la galería, aunque ambos compartan `location: "hero"`.

En Contacto y los casos, `cta_click` con `destination: "booking"` registra la apertura de la agenda y conserva únicamente la ubicación y el identificador de caso permitido, cuando existe. **Un clic de reserva no acredita una cita confirmada.** La web no recibe ni registra los campos completados en Cal.com; las reservas efectivas se revisan en la agenda y se siguen por separado en el registro comercial.

Los mensajes de log propios no incluyen nombre, email, empresa, teléfono, texto de la consulta, URL completa ni IP. El proveedor de alojamiento puede conservar otros registros técnicos de las solicitudes según su configuración. La API de eventos utiliza temporalmente la IP para limitar solicitudes y no la añade al evento escrito.

La medición del navegador respeta Do Not Track y Global Privacy Control. Hay un presupuesto de 40 eventos por carga de la aplicación; el endpoint limita tamaño, categorías y frecuencia. Estas cuentas sirven para detectar recorridos y problemas. No identifican visitantes únicos, no son una atribución comercial completa y no demuestran ventas.

Para revisar el contacto:

1. Consultar los errores y aceptaciones en los logs del alojamiento.
2. Comprobar entrega o rebote en Resend y recepción en el buzón cuando corresponda.
3. Registrar por separado la respuesta al interesado, oportunidad cualificada, propuesta y cierre en el sistema de trabajo autorizado.
4. Revisar de forma periódica los plazos reales de retención de correo y logs y la información de privacidad.

El procedimiento comercial y la plantilla para registrar oportunidades están en
[Captación y seguimiento](docs/captacion-y-seguimiento.md). Los resultados de
las pruebas de esta iteración se recogen en
[Verificación del 9 de septiembre de 2026](docs/verificacion-2026-09-09.md).
El asistente de IA tiene una [comprobación complementaria](docs/verificacion-caso-ia.md).

## Publicación y documentación de referencia

El código utiliza Vercel como alojamiento previsto y Resend para el envío. La configuración efectiva de variables, dominio, DNS, recepción de correo y protección de plataforma debe verificarse en el entorno correspondiente. Este README no certifica su estado actual ni sustituye una prueba de entrega autorizada.

Los originales de marca y las plantillas de presentación tienen ciclos de actualización propios. El [prompt inicial de diseño](docs/prompt-claude-design.md) es una referencia histórica: no modifica las decisiones comerciales, de accesibilidad o de privacidad vigentes. La fuente operativa actual es este README, el [contexto vigente](docs/contexto-actual.md) y el código.
