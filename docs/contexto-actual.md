# Contexto vigente de la web BPM Tech

Actualizado: 9 de septiembre de 2026. Este documento describe el árbol de trabajo revisado en esta fecha. No acredita un despliegue, la entrega de correo ni resultados comerciales. Los resultados concretos de las comprobaciones deben consultarse en la entrega de implementación correspondiente.

## Dirección comercial

BPM Tech presenta software y webs a medida para pymes, con startups y proyectos particulares como perfiles complementarios. El titular es «Software y webs que encajan en tu negocio». La entrada al contacto es «Cuéntanos qué necesitas resolver» y admite necesidades todavía poco definidas.

La oferta se organiza por tres necesidades: ordenar la operativa, conectar y automatizar herramientas, y crear o mejorar una web. La consultoría permite definir prioridades. La IA sigue formando parte de la oferta cuando aporta valor al problema concreto.

La home contiene Hero, Servicios, Proyectos, Método, Sobre BPM Tech y Contacto. El método incorpora los compromisos útiles de los antiguos bloques de propuesta y principios. No hay un bloque de stack protagonista ni un diagrama repetido en el hero.

## Evidencia y persona responsable

La galería contiene cinco proyectos reales: asistente de IA para gestión de proyectos, plataforma de pádel, gestión de almacén, web de evento y web de radio. Son tres casos de software y dos webs; el asistente de IA ocupa el bloque destacado. Las fichas exponen lo desarrollado y su alcance, sin atribuir resultados comerciales ni uso por clientes sin evidencia.

El caso de IA acredita experiencia profesional de la dirección de proyectos y tecnología en un equipo interno, de forma anónima. Su estado es desarrollo funcional para un piloto interno, con dos agentes especializados, documentos y herramientas para preparar seguimiento, decisiones y estimaciones. Las conexiones dependen de configuración y permisos y las propuestas requieren revisión humana.

Los visuales públicos son esquemas funcionales etiquetados. Los archivos originales de capturas se han retirado del directorio público. Incorporar fotografías, capturas, testimonios, nombres o resultados requiere revisar el material y la autorización correspondiente. No se sustituyen proyectos reales por historias inventadas.

La sección Sobre BPM Tech ofrece trato directo y el rol «Dirección de proyectos y tecnología», sin publicar un nombre ni inventar tamaño de equipo, capacidad o disponibilidad. Propiedad, documentación, presupuesto y soporte se acuerdan en cada propuesta.

## Estado técnico

- Node 24.x, Next.js 16.3.3, React 19.2.8, TypeScript y Tailwind CSS 3.
- Identidad conservada: papel, tinta y cobalto; Archivo Black, Archivo y Fragment Mono.
- `ink-faint` actualizado a `#6a685d`; etiquetas legibles y contraste revisado en las combinaciones utilizadas.
- Contenido servido visible, sin depender de la hidratación para aparecer. Framer Motion y Lenis retirados.
- Scroll nativo, movimiento reducido y árbol estable para preservar el formulario.
- Menú móvil mediante diálogo nativo: fondo inerte, foco contenido, cierre con Escape, devolución del foco y cierre al ampliar a escritorio. Navegación alternativa cuando JavaScript está desactivado.
- Método con hijos `li` directos dentro de `ol`.
- Imágenes Open Graph generadas para home y casos, metadatos propios y sitemap sin fechas ficticias.

## Contacto, datos y medición

El contacto comercial utiliza el formulario y Resend. `CONTACT_EMAIL` sigue siendo una variable privada del servidor. El email legal está autorizado para las páginas legales y se gestiona en `src/data/legal.ts`, separado del buzón privado de destino.

El formulario evita envíos GET, utiliza reglas compartidas y muestra errores por campo. Permanece deshabilitado antes de la hidratación y sin JavaScript. Los fallos conservan los valores, permiten reintento y no se presentan como éxito. Timeout de lectura del cuerpo de 5 segundos, del proveedor de 10 segundos y del cliente de 20 segundos, claves de idempotencia y límite sobre los bytes reales del cuerpo. La memoria de los limitadores está acotada; su alcance es por proceso.

Los eventos de interacción utilizan categorías limitadas y se escriben en los logs del alojamiento, sin valores del formulario, IP, URL completa ni identificadores de visitante en esos mensajes. La medición del navegador respeta DNT y GPC. Las aceptaciones del correo se registran aparte y se deduplican por identificador del proveedor al consultarlas. Los registros de infraestructura y sus plazos de retención deben revisarse por separado.

La aceptación del proveedor no prueba entrega, lectura o cierre. La operación comercial debe mantener separados recepción, cualificación, propuesta y cliente ganado.

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
