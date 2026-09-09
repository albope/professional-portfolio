# Comprobación del caso de IA

9 de septiembre de 2026. Ampliación de la [verificación inicial](verificacion-2026-09-09.md).

## Contenido

Se incorpora `/proyectos/asistente-ia-gestion-proyectos` y se destaca en la galería.
El conjunto contiene cinco proyectos: tres de software y dos webs. El nuevo caso
se presenta como experiencia profesional de la dirección de proyectos y tecnología,
realizada en un equipo interno y descrita de forma anónima. Su estado es desarrollo
funcional para un piloto; no se atribuye un encargo comercial a BPM Tech.

El contenido se apoya en una inspección estática del desarrollo facilitado:
definición de los dos agentes y sus modos de trabajo, tratamiento de adjuntos,
ejecución progresiva, continuidad de conversaciones y visualización de fuentes y
herramientas. No se ha ejecutado ese sistema ni accedido a sus conexiones activas.

Las seis capacidades descritas son consulta documental, seguimiento de proyectos,
apoyo a decisiones, preparación de estimaciones, tratamiento de documentos y
revisión del recorrido de una respuesta. La ficha distingue conexiones configurables,
instrucciones del agente y controles que cada implantación necesita. No promete
exactitud garantizada, autonomía sin revisión, funcionamiento exclusivamente local
ni despliegue multiusuario. No se publican cifras de ahorro, costes o resultados.

El portfolio no incorpora código, documentos, capturas, marcas, identificadores o
enlaces del sistema de referencia. El gráfico y la imagen OG son composiciones de
la web y se identifican como esquema funcional y experiencia técnica.

## Pruebas

- ESLint y compilación de producción con chequeo TypeScript: correctos en Node 24.
- 40 pruebas pasan. Una comprobación adicional exige que todos los proyectos de
  galería sean aceptados como referencia por contacto y medición.
- Home y ficha a 360, 390, 768 y 1440 píxeles: sin desbordamiento horizontal.
- Cinco casos visibles, atribución presente y seis capacidades en la ficha.
- Recorrido galería → ficha → contacto: referencia del asistente conservada en la
  URL, interfaz y cuerpo de la petición. Éxito probado con proveedor simulado.
- Canonical e imagen OG propios. PNG de 1200 × 630 servido correctamente.
- Sitemap con home y cinco casos. Los dos casos ficticios anteriores continúan
  devolviendo 404; el nuevo utiliza una ruta propia.
- Sin JavaScript: ficha y capacidades legibles.
- axe 4.12.1: cero infracciones detectadas en las reglas activadas de la ficha;
  símbolos decorativos señalados para revisión manual. Comprobación visual realizada.
- Revisión de confidencialidad del contenido y de la documentación: sin nombres,
  dominios o identificadores del sistema de referencia.

La evidencia local se guarda en `%TEMP%\bpm-verification-20260909`:
`ai-case-results.json`, capturas `case-ai-*` y `gallery-ai-*`, y `og-ai.png`.
No se ha repetido Lighthouse por este cambio de contenido: los resultados del
informe inicial corresponden a la versión de cuatro casos.

El build y estas pruebas no acreditan entrega real de correo ni estado de publicación;
ambos se verifican en sus servicios correspondientes. No se envían correos reales
como parte de esta comprobación.
