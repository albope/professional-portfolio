# Captación y seguimiento de oportunidades

La web ayuda a explicar el trabajo y facilita el contacto. Para conseguir encargos hace falta llevar personas con una necesidad pertinente a un caso concreto, entender su situación y acordar un siguiente paso. Esta guía organiza ese trabajo con el correo y las herramientas disponibles; no presupone un volumen de consultas ni un resultado comercial.

## Preparar la distribución

Antes de compartir la nueva versión, comprobar que está publicada la versión revisada, que el formulario permite completar el recorrido y que existe una persona responsable de revisar el buzón. La aceptación técnica del envío y la recepción efectiva se comprueban por separado.

Preparar estos cuatro elementos:

1. **Una necesidad de entrada.** Elegir inicialmente aquella para la que se puedan mantener conversaciones útiles: organizar una operativa, conectar tareas entre herramientas o construir una web funcional. No hace falta presentar todos los servicios en cada conversación.
2. **Un caso pertinente.** Compartir la página que mejor explica el trabajo relacionado con esa necesidad. El caso debe conservar su contexto, alcance y leyenda visual. Describir funciones construidas; cualquier resultado de negocio necesita una evidencia propia.
3. **Un destino sencillo.** Usar la URL pública del caso o una entrada de contacto contextual. Revisar el enlace desde el móvil y comprobar título e imagen al compartir.
4. **Un registro privado.** Copiar la [plantilla de oportunidades](templates/oportunidades.csv) a una ubicación protegida fuera del repositorio. El archivo versionado permanece vacío; los datos reales de conversaciones no deben entrar en Git, `public/` ni logs de analítica.

| Necesidad que expresa la persona | Material que puede ayudar | Enlace público |
|---|---|---|
| Reunir contexto para seguimiento, decisiones o estimaciones | Asistente de IA para gestión de proyectos, en fase de piloto interno | `/proyectos/asistente-ia-gestion-proyectos` |
| Coordinar horarios, plazas o cuotas | Plataforma de reservas y gestión de pádel | `/proyectos/plataforma-clubes-padel` |
| Localizar material y registrar movimientos | Sistema de gestión de almacén | `/proyectos/wms-almacen` |
| Informar y recoger inscripciones | Web de evento con confirmación | `/proyectos/web-boda` |
| Publicar audio y facilitar la escucha | Web de radio con directo y archivo | `/proyectos/web-radio` |
| Conectar herramientas o automatizar un proceso | Explicación de la necesidad y conversación sobre el proceso actual | `/?necesidad=automatizacion#contacto` |

Al compartir el caso de IA, conservar su crédito como experiencia profesional de la dirección de proyectos y tecnología en un equipo interno, presentada de forma anónima, y su estado de piloto; las capacidades descritas no acreditan resultados comerciales ni sustituyen la revisión humana.

Las rutas de contacto también admiten un proyecto conocido, por ejemplo `/?proyecto=wms-almacen#contacto`. Estos parámetros dan contexto al formulario; no identifican una campaña ni acreditan de dónde procede una persona. No introducir nombres, correos ni información de un negocio en enlaces de difusión.

## Primer ciclo de trabajo

El objetivo inicial es aprender qué necesidades generan conversaciones concretas y qué impide avanzar. Ajustar la dedicación a la capacidad de respuesta y ejecución disponible.

| Momento | Acción | Entregable comprobable |
|---|---|---|
| Preparación | Elegir una necesidad y su caso; revisar el destino; designar quién responde. | Un enlace y una explicación de dos frases. |
| Distribución | Actualizar perfiles profesionales propios y preparar una publicación sobre el caso. Compartirlo en conversaciones donde se haya pedido información o con contactos que acepten recibirla. | Registro privado de canal, fecha y material compartido. |
| Conversaciones | Responder a las consultas con una pregunta concreta; completar progresivamente el guion de cualificación. | Necesidad resumida y siguiente paso acordado. |
| Revisión | Revisar consultas abiertas, entregas de correo, errores técnicos y motivos para avanzar o descartar. | Una mejora priorizada de mensaje, caso, proceso o producto. |

Comenzar con los canales que ya se puedan atender: perfiles propios, conversaciones profesionales existentes y recomendaciones solicitadas. La preparación de textos no implica publicarlos ni enviarlos automáticamente. Evitar listas compradas, envíos masivos y secuencias que continúen después de un rechazo.

Un texto inicial para una publicación propia:

> Una reserva conecta varias tareas: disponibilidad, datos del jugador, pago y agenda. En este proyecto desarrollamos una plataforma con un espacio para el jugador y otro para gestionar el club. Aquí explicamos su alcance y cómo se organiza: [enlace al caso]. Si estás intentando coordinar reservas o cuotas, puedes contarnos qué parte te cuesta más gestionar.

Adaptar el texto al caso que realmente se comparte. No añadir porcentajes, nombres, testimonios, urgencia comercial ni promesas de ahorro que no estén acreditados.

Para una persona que haya pedido información:

> Por lo que comentas sobre [necesidad], este proyecto puede ayudarte a ver cómo abordamos un problema parecido: [enlace]. ¿Cómo lo gestionáis ahora y en qué paso aparece la principal dificultad?

No deducir el origen de una consulta a partir del caso que trae el formulario. Preguntar durante la conversación «¿Cómo has llegado a nosotros?» y registrar la respuesta como origen declarado, dejando `desconocido` cuando no se sepa.

## Responder y cualificar

El primer contacto busca entender la necesidad y comprobar si tiene sentido seguir. El análisis detallado, una especificación y el diseño de la solución forman parte de un alcance que debe acordarse; no prometer una auditoría completa con cada consulta.

Respuesta inicial adaptable:

> Gracias por contarnos lo que necesitas. Entiendo que quieres [objetivo expresado por la persona] y que ahora [situación descrita]. Para orientarte, me ayudaría saber [una o dos preguntas relevantes]. Con eso podremos concretar si encaja y qué siguiente paso tendría sentido.

Usar el guion como apoyo, no como un cuestionario que haya que contestar entero para recibir respuesta:

| Tema | Pregunta útil | Qué registrar |
|---|---|---|
| Proceso actual | ¿Cómo resolvéis hoy esta tarea, desde que empieza hasta que termina? | Recorrido breve y herramientas utilizadas. |
| Dificultad | ¿En qué paso se pierde tiempo, falta información o hay errores? | Problema concreto, sin convertir estimaciones en datos medidos. |
| Personas | ¿Quién lo utiliza y quién se ve afectado? | Roles y necesidades de uso. |
| Objetivo | ¿Qué tendría que poder hacerse para considerar útil una primera versión? | Criterio de aceptación observable. |
| Límites | ¿Hay sistemas que mantener, datos restringidos o integraciones imprescindibles? | Dependencias, accesos y restricciones. |
| Decisión | ¿Quién participa en decidir el alcance y aprobar el encargo? | Roles de decisión y pasos internos. |
| Momento e inversión | ¿Hay una fecha que lo condicione o un marco de inversión que debamos considerar? | Condiciones declaradas; `por definir` es una respuesta válida. |
| Próximo paso | ¿Qué información falta y cómo preferís continuar? | Acción, responsable y fecha acordada si la hay. |

Marcar una oportunidad como **cualificada** cuando hay una necesidad entendida, encaje técnico y de capacidad razonable, interlocución suficiente para avanzar y un siguiente paso aceptado. Un formulario largo, una empresa conocida o un presupuesto mencionado no bastan por sí solos. Si falta información, mantener `en_revision`.

Si una herramienta existente resuelve el problema con menos esfuerzo, explicarlo. Si el encargo no encaja, indicar el motivo con claridad y cerrar el seguimiento. Si el alcance aún es incierto, proponer un primer trabajo acotado con sus entregables y condiciones, sin fijar precio o plazo antes de valorar la información necesaria.

## Del interés a una propuesta revisable

Una propuesta debe permitir a la persona decidir qué contrata. Incluir:

- Problema y objetivo acordados, descritos con ejemplos de su operativa.
- Entregables de la primera fase y criterios para aceptarlos.
- Exclusiones, dependencias y aportaciones que necesita hacer el cliente.
- Precio, calendario y condiciones que realmente se puedan sostener.
- Tratamiento de cambios, mantenimiento, accesos y entrega del trabajo.
- Acción concreta para aceptar, resolver dudas o descartar.

Registrar como `ganada` cuando exista aceptación verificable del alcance y sus condiciones. Una respuesta amable, una reunión o una solicitud de presupuesto no equivalen a un encargo. La facturación y el cobro se controlan aparte en las herramientas administrativas existentes.

## Seguimiento respetuoso

Cada oportunidad abierta debe tener una acción siguiente o una razón explícita para esperar. Reservar momentos de revisión compatibles con la capacidad real; no convertir esa organización interna en un plazo de respuesta publicado.

Cuando se acuerde una fecha, retomarla en ese momento. Si no hay fecha ni respuesta, puede prepararse un recordatorio breve que aporte contexto y permita cerrar la conversación. No programar insistencia indefinida ni abrir nuevos canales sin acuerdo.

> Retomo lo que hablamos sobre [necesidad]. Para avanzar quedaba pendiente [punto concreto]. Si sigue siendo prioritario, podemos concretar [siguiente paso]. Si lo habéis aplazado o ya está resuelto, podemos dejarlo aquí.

Ante un rechazo, cerrar. Si la persona pide retomar más adelante, anotar su fecha preferida. Si no responde después del recordatorio, cerrar como `sin_respuesta` y reabrir solo cuando haya nueva información o petición. No atribuir falta de respuesta al precio, al diseño o a la competencia sin una señal que lo sostenga.

## Registro privado mínimo

La plantilla CSV contiene únicamente cabeceras. Una copia privada puede importarse en una hoja de cálculo ya disponible. Mantener los detalles de contacto en el hilo de correo original y utilizar una referencia interna para localizarlo; evitar duplicarlos en cada tabla.

| Campo | Uso |
|---|---|
| `oportunidad_id` | Identificador interno sin datos personales. Una misma necesidad conserva el ID si vuelve a escribir. |
| `fecha_entrada`, `origen_declarado`, `necesidad`, `caso_referencia` | Cuándo llegó, cómo dice haber llegado y qué necesita. El caso de referencia es opcional. |
| `resumen`, `encaje`, `restricciones` | Información mínima para entender y decidir el siguiente paso. |
| `estado`, `responsable` | Situación y persona que mantiene el seguimiento. |
| `proxima_accion`, `fecha_proxima_accion`, `fecha_ultimo_contacto` | Qué toca hacer y cuándo, si se ha acordado. |
| `fecha_cualificacion`, `fecha_resultado`, `motivo_resultado` | Hitos y motivo conocido del cierre; permiten revisar cohortes sin mezclar periodos. |
| `referencia_conversacion` | Referencia privada al hilo; nunca una URL pública con datos personales. |

Estados sugeridos: `nueva`, `en_revision`, `cualificada`, `propuesta`, `en_espera`, `ganada`, `perdida`, `sin_encaje`, `sin_respuesta`. Conservar la fecha de cualificación cuando una oportunidad pase a propuesta o cierre.

Restringir el acceso a quienes atienden las consultas y revisar periódicamente qué información sigue siendo necesaria. Las copias con datos reales no se adjuntan a incidencias técnicas ni se suben al repositorio.

## Medir lo que realmente registra la web

El código recoge eventos operativos en los logs del alojamiento. No hay un panel comercial, identificación de visitantes, seguimiento de sesiones ni atribución de campañas implementados. No añadirlos para completar una tabla de métricas.

| Señal | Fuente actual | Qué permite observar | Qué no acredita |
|---|---|---|---|
| `cta_click` | `stream: bpm-events` | Activaciones del CTA por ubicación y, si se transmite, necesidad o caso; en el hero, `destination: contact` distingue contacto de `destination: projects`, que abre la galería. | Personas únicas o intención de compra. |
| `case_open` | `bpm-events` | Clics registrados en los enlaces a casos. | Que la página haya terminado de cargar. |
| `case_view` | `bpm-events` | Visualizaciones instrumentadas de un caso. | Lectura completa, usuario único o clic previo desde la home. |
| `form_start` | `bpm-events` | Inicio de interacción instrumentado con el formulario. | Una solicitud enviada. |
| `form_validation_error` | `bpm-events` | Primer campo con error que impide enviar el formulario. | Contenido de lo escrito ni número de personas afectadas. |
| `contact_error` | `bpm-events` | Fallos observados por el cliente, agrupados por código. | Ausencia definitiva de aceptación: un corte de red puede impedir recibir la confirmación. |
| `provider_accepted` | `stream: bpm-contact` | El proveedor devolvió un identificador válido de aceptación. | Entrega al buzón, lectura, oportunidad o venta. |
| Consulta recibida | Buzón y revisión humana | Un mensaje disponible para atender. | Que exista encaje comercial. |
| Cualificada / ganada | Registro privado | Decisión comercial y aceptación del encargo documentadas. | Resultado económico cobrado. |

Para contar aceptaciones técnicas, filtrar `stream = bpm-contact` y `event = provider_accepted` y contar **identificadores `providerId` distintos**. Un reintento puede producir varias líneas para la misma aceptación, incluso entre instancias. El honeypot no emite esa aceptación. Un nuevo envío de la misma persona puede tener otro ID: la deduplicación comercial se realiza al revisar la necesidad en el registro privado.

El identificador del proveedor sirve para contrastar un envío en su panel. Mantener esa revisión en el ámbito operativo autorizado; no convertirlo en un identificador público ni mezclar el contenido del correo con analítica. La consulta a Resend permite revisar el estado del envío; encontrar una aceptación en logs no sustituye esa comprobación ni la del buzón.

Los eventos del navegador pueden faltar por preferencias de privacidad, límites, bloqueadores, conexión o cierre de la página. Pueden existir repeticiones. Los logs tienen la disponibilidad y conservación del plan de alojamiento vigente. Anotar esos límites al recopilar los datos y conservar solo los agregados necesarios en el resumen comercial.

## Revisión semanal y decisiones

Usar siempre el mismo periodo y zona horaria. Separar producción de desarrollo, vistas previas y pruebas. Durante las pruebas controladas, anotar su intervalo para excluirlo del informe; no enviar correos reales solo para aumentar un contador.

Preparar una hoja de agregados con periodo, clics por ubicación, aperturas y vistas por caso, inicios, errores por código, aceptaciones únicas, consultas revisadas, nuevas cualificadas, propuestas y cierres. La hoja puede comenzar vacía. Con poco volumen, mostrar recuentos y preguntas abiertas antes que porcentajes.

Para calcular una tasa comercial, usar una **cohorte de oportunidades**: por ejemplo, las entradas de un mismo mes y su estado en una fecha de corte. `Cualificadas / consultas reales revisadas` expresa encaje de esa cohorte. `Ganadas / cualificadas` debe usar la misma cohorte y mostrar cuántas siguen abiertas. Si el denominador es cero, indicar «sin datos». No dividir cierres de esta semana entre formularios de esta semana: pueden corresponder a oportunidades diferentes.

Los cocientes entre clics, vistas, inicios y aceptaciones son señales agregadas con coberturas distintas, no tasas verificadas de conversión de personas. Un visitante puede abrir varios casos o activar varios CTAs; una aceptación puede registrarse aunque sus eventos de navegador no se reciban.

| Observación | Comprobación siguiente |
|---|---|
| Hay errores técnicos repetidos | Reproducir el código de error y revisar proveedor, respuesta y recuperación del formulario. |
| Hay aceptaciones y faltan consultas en el buzón | Contrastar IDs con los estados del proveedor y revisar recepción; no dar por recibido el mensaje. |
| Los casos se consultan pero faltan conversaciones | Preguntar a lectores pertinentes qué entendieron, qué prueba les faltó y qué siguiente paso vieron. |
| Llegan consultas con poco encaje | Revisar origen declarado, explicación de la oferta y expectativas de la distribución. |
| Hay oportunidades cualificadas que no avanzan | Revisar alcance, inversión, dependencias, capacidad y siguiente paso acordado. |
| Las mismas dudas se repiten | Mejorar el texto o caso que debería resolverlas antes de añadir nuevas herramientas. |

Elegir una mejora por ciclo y registrar qué señal motivó el cambio. La prioridad es entender y atender mejor oportunidades reales; ningún ajuste de copy o diseño garantiza por sí solo clientes.

Referencias de implementación: [vocabulario y emisión de eventos](../src/lib/analytics.ts), [receptor de eventos](../src/app/api/events/route.ts), [aceptación de contacto](../src/app/api/contact/route.ts) y [lógica del proveedor](../src/lib/contact-server.ts).
