# Revisión de la landing simplificada

23 de septiembre de 2026. Comprobaciones locales, sin despliegue.

## Cambio

- Titular fijo, explicación directa y contacto principal en la primera pantalla.
- Proyectos inmediatamente después del hero: pádel, almacén y radio. Evento y asistente conservan enlaces a sus fichas.
- Tres servicios con ejemplos cotidianos y contexto preseleccionado en el contacto.
- Método visible de tres pasos y presentación personal de Alberto.
- Asistente de ideas opcional, cerrado y con carga diferida. Conserva la idea al cerrarlo.
- Formulario con nombre, email y mensaje obligatorios. Empresa y teléfono quedan en un desplegable opcional.
- La home no monta el canvas, el titular rotatorio ni las secciones fijadas al scroll.

## Comprobaciones

- ESLint y TypeScript correctos.
- 81 pruebas correctas con Node 24.21.0. Se retiraron las tres comprobaciones de estructura ligadas a las animaciones eliminadas.
- Compilación de producción correcta, 16 páginas generadas.
- Navegador a 320, 390, 768, 1024 y 1440 px, sin desbordamiento horizontal en la portada. Se corrigió el titular a 320 px.
- Sin errores de ejecución ni overlay de Next.js en los recorridos comprobados.
- Menú móvil: apertura, cierre con Escape y devolución del foco.
- Servicio de automatización: navegación a contacto, ancla visible y necesidad preseleccionada.
- Formulario: errores de campos obligatorios y foco en el primer error. Una respuesta incompleta no confirma el envío y conserva el borrador. Una respuesta válida simulada muestra «Mensaje enviado».
- Asistente: no monta su formulario antes de abrirse. Ante respuesta simulada no disponible, identifica la plantilla y permite llevar el texto al contacto con la necesidad seleccionada.
- Navegación desde una captura de almacén a su ficha, sin errores.
- Retrato y capturas comprobados en navegador.
- Sin JavaScript: siete secciones principales disponibles, navegación alternativa y email. El formulario permanece deshabilitado y explica el requisito.
- Movimiento reducido: brillo desactivado, sin canvas ni contenido dependiente de animaciones.
- axe-core 4.12.1, reglas WCAG 2 A/AA y 2.1 AA: cero infracciones detectadas y 32 comprobaciones superadas. La revisión automática dejó elementos de contraste para revisión manual, principalmente el brillo de la marca y flechas decorativas. No equivale a una certificación de accesibilidad.

Los envíos de contacto y las respuestas del asistente se simularon durante las pruebas de interfaz. Las pruebas del servidor también sustituyen los proveedores. No se enviaron correos ni se crearon reservas. No se midieron conversiones ni rendimiento de usuarios reales.

## Revisión posterior: preguntas frecuentes

Alberto descarta el asistente de ideas. Se sustituye su montaje por `Faq`, un componente de servidor con cinco preguntas prácticas y desplegables nativos. La respuesta sobre presupuesto queda abierta inicialmente. El bloque funciona con teclado y no necesita JavaScript.

Comprobados lint, tipos, las 13 pruebas existentes de contenido y compilación. Revisión visual a 1440 y 390 px, sin desbordamiento a 320 px, apertura con Enter y ausencia del antiguo formulario en el DOM. Auditoría axe del bloque: cero infracciones detectadas en las reglas A/AA examinadas, con dos símbolos decorativos pendientes de clasificación automática de contraste.
