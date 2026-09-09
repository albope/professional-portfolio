# Verificación de la mejora comercial y técnica

Este informe recoge la iteración inicial de cuatro casos. La incorporación posterior
del asistente de IA y sus comprobaciones están en [verificacion-caso-ia.md](verificacion-caso-ia.md).

Fecha: 9 de septiembre de 2026. Trabajo local sobre `main`, partiendo de
`b6f3c47914b9f23b8a3286ac437bfa47c917fb05`. Este informe describe el árbol de trabajo
revisado; no acredita un despliegue. No se han creado commits, PR ni publicaciones.

## Resultado

La web presenta tres necesidades de entrada, cuatro proyectos reales y un siguiente
paso contextual. El formulario valida y conserva el borrador ante errores, evita
envíos por GET y exige una aceptación válida antes de confirmar. La medición registra
categorías permitidas en los logs existentes. El contenido y la navegación siguen
disponibles sin JavaScript; el envío requiere JavaScript y lo indica expresamente.

| Área | Cambio comprobado |
|---|---|
| Propuesta y servicios | Oferta organizada por operativa, automatización y web; descripciones visibles en móvil y CTAs utilizables sin un proyecto definido. |
| Proyectos | Cuatro fichas con necesidad, trabajo realizado, alcance, decisiones y contacto contextual. Dos casos de software destacados y dos webs. |
| Prueba visual | Esquemas funcionales identificados como tales. Originales retirados del directorio público y conservados en una copia local verificada. |
| Confianza | Método consolidado y responsabilidad de dirección de proyectos y tecnología, sin publicar un nombre personal. Sin métricas o testimonios inventados. |
| Contacto | Reglas compartidas, errores por campo, foco, borrador recuperable, timeouts, contrato de aceptación e idempotencia. |
| Accesibilidad | Diálogo móvil nativo, teclado, retorno de foco, contraste de textos secundarios, listas semánticas y contenido visible en servidor. |
| SEO | Canonical y OG propios de los casos, cinco imágenes generadas de 1200 × 630, sitemap sin fechas ficticias y datos estructurados Organization. |
| Medición | Eventos de interacción con vocabulario limitado, sin valores del formulario; aceptación técnica del proveedor en un registro separado. DNT/GPC respetados. |
| Operación | README y contexto actualizados; guía de captación, cualificación y seguimiento y CSV vacío para una copia privada. |
| Dependencias | Eliminadas Framer Motion y Lenis al sustituir sus usos; actualización dirigida de `postcss-selector-parser`. |

Los casos retirados no aparecen en galería ni sitemap y devuelven 404. Las seis
rutas de los originales de `public/screenshots/` también devuelven 404 en la
compilación local. Esto no elimina copias de despliegues anteriores ni del historial.

## Comprobaciones técnicas

Entorno: Windows, Node **24.20.0**, Next **16.3.3**, Edge sin interfaz gráfica y
compilación de producción en `http://127.0.0.1:3017`.

| Comprobación | Resultado |
|---|---|
| ESLint del repositorio | Pasa. Repetidos los archivos afectados por el último ajuste de eventos. |
| TypeScript | Pasa, incluido el chequeo de la última compilación. |
| Tests | 39 pruebas pasan. Tras los últimos ajustes, repetidas las pruebas de analítica y endpoint de eventos. |
| Build de producción | Pasa; home, cuatro casos, legales, 404, sitemap, robots y rutas OG/API generadas. |
| Auditoría de dependencias | 0 vulnerabilidades conocidas comunicadas por npm al actualizar el árbol instalado. |
| `git diff --check` | Pasa. |

Las pruebas del proveedor utilizan dependencias simuladas. Cubren JSON/campos
inválidos, máximos y Unicode, límite real de bytes, cuerpo detenido o abortado,
idempotencia, honeypot, rate limit, ausencia de configuración, errores de red,
timeout, HTML 200 y respuestas del proveedor sin una aceptación válida. No se han
enviado correos reales.

## Recorridos en navegador

- Home a 360, 390, 768 y 1440 píxeles: sin desbordamiento horizontal; títulos,
  servicios y CTAs visibles.
- Casos, aviso legal y privacidad: carga correcta y sin desbordamiento a 390 píxeles.
- Formulario: vacíos/espacios/email inválido, error por campo y foco en el primero;
  fallos de red, 400/413/429/502/503/504, HTML 200 y timeout de cliente de 20 segundos.
  El botón vuelve a estar disponible y el mensaje permanece.
- Mismo contenido tras un fallo: misma clave de idempotencia. Contenido cambiado:
  nueva clave. Respuesta de éxito simulada: contrato correcto y foco en confirmación.
- Cambio de preferencia de movimiento: conserva el borrador. Privacidad se abre
  en otra pestaña con `noopener noreferrer`.
- Menú móvil: navegación con Tab contenida en el diálogo, Escape, retorno de foco,
  cierre al pasar a escritorio y liberación del bloqueo de scroll.
- Enlace de servicios desde el menú: sección a 96 píxeles de la parte superior,
  por debajo de la cabecera de 64 píxeles.
- Sin JavaScript: navegación alternativa visible, método POST defensivo, todos los
  campos y el botón deshabilitados y explicación legible. El intento de pulsar el
  botón no añade datos a la URL. Ancla situada a 128 píxeles, cabecera de 109 píxeles.
- Recorrido real home → proyectos → WMS → contacto: conserva `proyecto=wms-almacen`
  y muestra la referencia. Un contexto desconocido no se incorpora al formulario.
- Medición de ese recorrido: `cta_click`, `case_open`, `case_view`, CTA del caso y
  `form_start` recibidos con HTTP 204 y comprobados en stdout del servidor. Los dos
  CTAs del hero distinguen `destination: contact` y `destination: projects`.
- DNT y GPC: cada señal evita emitir los eventos de interacción del navegador.
- Endpoint real de contacto local, sin credenciales: 503 recuperable, sin llamada
  de entrega. La aceptación y entrega reales necesitan su comprobación en el
  entorno configurado.

La integración detectó y corrigió una comparación de Origin con la URL interna de
Next. El receptor usa la autoridad de la solicitud y el protocolo del proxy;
las pruebas verifican una petición legítima y el rechazo de orígenes ajenos.

Los escaneos axe 4.12.1 en home, caso WMS, privacidad y menú no detectaron
infracciones en sus reglas activadas. Se revisaron los elementos señalados como
incompletos: símbolos decorativos, subrayado y la relación con el diálogo cerrado.
Lighthouse detectó además una diferencia entre el texto del logotipo y su nombre
accesible; se corrigió y la segunda ejecución confirma esa regla. Esto no equivale
a una auditoría WCAG completa ni a una prueba humana con lector de pantalla.

## Rendimiento de laboratorio

Lighthouse **13.4.1**, perfil móvil de 412 × 823, CPU simulada ×4, RTT de 150 ms y
ancho de banda simulado de 1638,4 Kbps, contra el servidor local de producción.
Dos ejecuciones válidas, sin error del motor ni advertencias de ejecución:

| Métrica | Primera | Segunda |
|---|---:|---:|
| Rendimiento | 91/100 | 87/100 |
| Accesibilidad | 100/100 | 100/100 |
| Buenas prácticas | 100/100 | 100/100 |
| SEO | 100/100 | 100/100 |
| First Contentful Paint | 1,2 s | 1,2 s |
| Largest Contentful Paint | 2,8 s | 2,7 s |
| Total Blocking Time | 240 ms | 390 ms |
| Cumulative Layout Shift | 0 | 0 |

La segunda ejecución incluye la corrección del nombre accesible y la distinción
de destino del hero. El último ajuste posterior afecta al receptor de eventos,
no al código visual medido; se validó con build, tests y recorrido HTTP completo.

La variación de TBT muestra por qué no debe elegirse únicamente la mejor nota.
LCP y bloqueo de hilo principal siguen siendo puntos que observar. No hay una
comparativa móvil válida anterior, datos de usuarios reales, INP de campo ni una
medición de CDN/latencia de producción. No se afirma una mejora porcentual.

## Cobertura de la auditoría y pendientes

B01–B05, B07 y B12 quedan implementados y comprobados en el entorno local. B06
incluye información inmediata, canal legal separado y una política que describe
la operación; datos jurídicos, contratos, garantías de transferencias y retención
efectiva necesitan validación del responsable. No se certifica conformidad legal.

B08–B10 se concretan en fichas, posicionamiento, método y rol profesional. La
validación de comprensión con posibles compradores y cualquier nueva prueba
visual requieren personas/evidencia adicionales. No hay métricas comerciales
inventadas ni relaciones contractuales inferidas de los proyectos.

B11 deja instrumentación y procedimiento preparados. Faltan las consultas reales,
su atención y el registro de resultados comerciales. La aplicación no verifica
entrega, lectura o venta a partir de una aceptación del proveedor.

B14 incluye medición móvil reproducible, dependencias y documentación. B13
(páginas adicionales por demanda validada) y B15 (protección distribuida y
automatización de entregas según volumen) permanecen condicionados a evidencia
operativa. No se han añadido proveedores o infraestructura para anticiparla.

Antes de distribuir la versión pública: autorizar y realizar la publicación,
verificar el entorno de correo y su entrega de forma controlada, y designar la
atención y seguimiento de consultas. El limitador en memoria es por proceso y
no sustituye una política distribuida del alojamiento.

## Evidencia local

Artefactos fuera del repositorio en `%TEMP%\bpm-verification-20260909`:
`browser-results.json`, `routes-results.json`, `journey-results.json`, capturas de
home/caso/contacto/sin JS, cinco imágenes OG y los dos informes Lighthouse HTML/JSON.
Los scripts usan datos sintéticos y no deben apuntarse a producción con los mocks
retirados. La guía de operación está en
[captacion-y-seguimiento.md](captacion-y-seguimiento.md).
