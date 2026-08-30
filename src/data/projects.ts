// Proyectos de BPM Tech.
// - Los marcados `concept: false` son proyectos reales del equipo, descritos de
//   forma genérica y sin datos de cliente: funcionan como ejemplos adaptables.
// - Los marcados `concept: true` son conceptos que ilustran tipologías de
//   trabajo (IA y automatización) mientras no haya casos reales publicables.

export type ProjectVisualVariant =
  | "grid"
  | "documents"
  | "assistant"
  | "booking"
  | "editorial"
  | "radio";

export type ProjectKind = "software" | "web";

export interface CaseSection {
  title: string;
  body: string;
}

export interface Project {
  slug: string;
  concept: boolean;
  kind: ProjectKind;
  sector: string;
  type: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  stack: string[];
  visual: ProjectVisualVariant;
  caseSections: CaseSection[];
}

export const projects: Project[] = [
  {
    slug: "plataforma-clubes-padel",
    concept: false,
    kind: "software",
    sector: "Deporte y ocio",
    type: "Producto SaaS",
    title: "Plataforma de gestión para clubes de pádel",
    summary:
      "Un producto completo para operar un club: reservas, socios, pagos, competiciones y comunicación — con panel de gestión y portal del jugador sobre una misma base multi-club.",
    problem:
      "Los clubes gestionan reservas, socios, pagos y competiciones con una mezcla de teléfono, hojas de cálculo y aplicaciones que no hablan entre sí. La operativa diaria depende de demasiadas piezas sueltas.",
    solution:
      "Una plataforma completa: panel de operación para el club (reservas, pistas, socios, rankings y analíticas), portal para el jugador, pagos online y suscripciones, notificaciones push y por email — todo multi-club desde el primer día.",
    outcome:
      "Un único sistema para operar el club entero. Y un buen ejemplo de lo que significa producto completo: la misma base se adapta a cualquier negocio de reservas, socios y pagos.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    visual: "booking",
    caseSections: [
      {
        title: "El encargo",
        body: "Un club necesita bastante más que un calendario de pistas: socios con cuotas, pagos online, partidas abiertas, competiciones, comunicación con los jugadores y una foto clara de la ocupación y los ingresos. Cuando cada pieza vive en una herramienta distinta, el club trabaja para sus sistemas y no al revés.",
      },
      {
        title: "Qué construimos",
        body: "Dos productos sobre una misma base: un panel de operación para el club — reservas, pistas, socios, noticias, rankings y analíticas — y un portal para el jugador donde reservar, pagar, competir y seguir su actividad. Por debajo: pagos y suscripciones, reservas recurrentes con lista de espera, notificaciones push, email e in-app, y roles con permisos para el personal.",
      },
      {
        title: "Por qué es un buen ejemplo",
        body: "Es la tipología de proyecto que mejor nos representa: un producto real, multi-tenant y en evolución continua, donde negocio y software se diseñaron juntos. La misma arquitectura — reservas, miembros, pagos, comunicación — se adapta a gimnasios, academias, centros deportivos o cualquier negocio con recursos que reservar y una comunidad que gestionar.",
      },
    ],
  },
  {
    slug: "wms-almacen",
    concept: false,
    kind: "software",
    sector: "Industria y logística",
    type: "Herramienta interna",
    title: "Sistema de gestión de almacén (WMS) para una pyme",
    summary:
      "Un WMS web a medida para una empresa pequeña: inventario, ubicaciones, movimientos y usuarios con permisos por rol, construido por fases sobre una especificación acordada.",
    problem:
      "El control de almacén de una pyme vivía en hojas de cálculo: stock, ubicaciones y movimientos sin trazabilidad, sin roles y con la información dependiendo de quién la apuntaba.",
    solution:
      "Un WMS web a medida: inventario, ubicaciones y movimientos con permisos por rol y por almacén, implementado por fases con una especificación funcional acordada como única fuente de verdad.",
    outcome:
      "Trazabilidad completa de la operativa con una herramienta que crece por fases según las necesidades reales — sin pagar por módulos que la empresa no usa.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase"],
    visual: "grid",
    caseSections: [
      {
        title: "El encargo",
        body: "Los WMS comerciales estaban sobredimensionados para una empresa pequeña: módulos que nunca usaría, precios por usuario que no encajaban y flujos pensados para almacenes de otra escala. La alternativa real era seguir con hojas de cálculo — hasta que dejó de serlo.",
      },
      {
        title: "Qué construimos",
        body: "Un WMS web hecho a la medida exacta de su operativa: artículos, stock, ubicaciones y movimientos, con autorización por rol y por almacén, gestión de usuarios y una API para crecer. Nada más — y nada menos — de lo que el negocio necesita.",
      },
      {
        title: "Cómo lo abordamos",
        body: "Antes de escribir código, una especificación funcional acordada con el cliente: qué hace el sistema, qué no, y en qué orden se construye. El desarrollo avanza por fases cerradas — con migraciones, pruebas de integración y despliegue por cada fase — para que siempre haya una versión estable en uso. Este mismo enfoque se adapta a cualquier herramienta interna: producción, compras, calidad, logística.",
      },
    ],
  },
  {
    slug: "automatizacion-documental",
    concept: true,
    kind: "software",
    sector: "Administración y finanzas",
    type: "Automatización con IA",
    title: "Automatización documental con IA",
    summary:
      "Un pipeline que lee facturas y albaranes recibidos por email, extrae los datos con IA y los deja validados en el ERP.",
    problem:
      "Cientos de facturas y albaranes al mes llegando por email en formatos distintos, tecleados a mano en el ERP por el equipo de administración. Horas de trabajo mecánico y errores de transcripción difíciles de detectar.",
    solution:
      "Un pipeline automático: los documentos se capturan del buzón, un modelo de IA extrae los campos relevantes, las extracciones dudosas pasan por una cola de revisión humana y los datos validados se insertan en el ERP vía API.",
    outcome:
      "El trabajo del equipo pasa de teclear documentos a supervisar excepciones. Cada documento queda trazado de origen a asiento, con su extracción y quién la validó.",
    stack: ["Node.js", "Anthropic", "OpenAI", "PostgreSQL", "Integración ERP"],
    visual: "documents",
    caseSections: [
      {
        title: "El punto de partida",
        body: "El proceso era íntegramente manual: abrir el email, descargar el adjunto, interpretar el documento, teclearlo en el ERP y archivarlo. Un trabajo necesario, repetitivo y propenso a errores que consumía una parte importante de la jornada del equipo.",
      },
      {
        title: "Qué construimos",
        body: "Un pipeline en cuatro etapas: captura automática de documentos, extracción estructurada con LLMs, validación —automática cuando la confianza es alta, humana cuando no— e inserción en el ERP mediante su API. Un panel permite revisar la cola de excepciones y auditar cualquier documento procesado.",
      },
      {
        title: "El papel de la IA",
        body: "La IA resuelve la parte que el software tradicional no podía: interpretar documentos heterogéneos sin plantillas por proveedor. Pero el sistema no es \"IA sin red\": cada extracción lleva un nivel de confianza, y solo las seguras se procesan sin intervención humana.",
      },
    ],
  },
  {
    slug: "asistente-interno",
    concept: true,
    kind: "software",
    sector: "Organización y conocimiento",
    type: "Agente de IA",
    title: "Asistente interno sobre el conocimiento de la empresa",
    summary:
      "Un asistente que responde preguntas del equipo consultando la documentación interna, con respuestas citadas y control de permisos.",
    problem:
      "El conocimiento de la empresa estaba repartido entre manuales, wikis, carpetas compartidas y la cabeza de unas pocas personas. Las mismas preguntas se respondían una y otra vez, y la incorporación de gente nueva era lenta.",
    solution:
      "Un asistente basado en RAG conectado a las fuentes documentales de la empresa: responde en lenguaje natural, cita siempre el documento de origen y respeta los permisos de acceso de cada usuario.",
    outcome:
      "Las respuestas dejan de depender de la disponibilidad de las personas que más saben. La documentación existente cobra valor porque por fin es consultable, y las lagunas se hacen visibles.",
    stack: ["Next.js", "Anthropic", "RAG", "Supabase", "Microsoft Graph"],
    visual: "assistant",
    caseSections: [
      {
        title: "El punto de partida",
        body: "La documentación existía, pero encontrarla era otra historia: cada área guardaba lo suyo en su sitio, con su criterio. En la práctica, preguntar a un compañero era más rápido que buscar — y eso convertía a ciertas personas en cuellos de botella permanentes.",
      },
      {
        title: "Qué construimos",
        body: "Un asistente conversacional conectado a las fuentes reales de la empresa mediante RAG: indexa la documentación, recupera los fragmentos relevantes para cada pregunta y redacta una respuesta que siempre enlaza a los documentos de origen. Sin fuentes, no hay respuesta: preferimos un \"no lo sé\" a una invención.",
      },
      {
        title: "Permisos y confianza",
        body: "Un asistente interno solo funciona si se puede confiar en él. El sistema replica los permisos de las fuentes originales — nadie ve a través del asistente lo que no vería en la carpeta — y cada respuesta es auditable hasta el documento que la sustenta.",
      },
    ],
  },
  {
    slug: "web-evento-personal",
    concept: false,
    kind: "web",
    sector: "Personas y eventos",
    type: "Web a medida",
    title: "Web de boda con confirmación de invitados",
    summary:
      "Una web con identidad propia para un evento personal: invitación digital, confirmación de asistencia, galería colaborativa y panel privado de gestión.",
    problem:
      "Organizar una boda implica coordinar a decenas de invitados: confirmaciones, acompañantes, alergias, fotos, música e información práctica repartida entre mensajes, llamadas y hojas sueltas.",
    solution:
      "Una web a medida con diseño propio: invitación digital con la historia y la información del día, formulario de confirmación con aviso automático por email, galería donde los invitados suben sus fotos y un panel privado para gestionarlo todo.",
    outcome:
      "Los invitados lo tienen todo en un mismo sitio y los anfitriones gestionan confirmaciones y fotos sin perseguir a nadie. El mismo patrón sirve para cualquier evento o proyecto personal que merezca algo mejor que una plantilla.",
    stack: ["Next.js", "TypeScript", "Supabase", "Resend"],
    visual: "editorial",
    caseSections: [
      {
        title: "El encargo",
        body: "Una web de boda suele resolverse con una plantilla genérica. Aquí el objetivo era otro: una pieza con identidad visual propia que además trabajara — recoger confirmaciones con sus detalles, centralizar la información práctica del día y dar a los invitados un lugar donde compartir sus fotos.",
      },
      {
        title: "Qué construimos",
        body: "Una web completa con diseño a medida: invitación con cuenta atrás e historia en formato narrativo, confirmación de asistencia con validación y aviso por email, galería colaborativa con moderación, sección de detalles con horarios y ubicaciones, y un panel de administración con estadísticas de confirmaciones.",
      },
      {
        title: "Por qué es un buen ejemplo",
        body: "Porque demuestra el rango: el mismo cuidado de producto que ponemos en un software de gestión, aplicado a una web personal. Diseño propio, funcionalidad real y cero plantillas — para particulares, eventos, profesionales o pequeñas marcas.",
      },
    ],
  },
  {
    slug: "web-programa-radio",
    concept: false,
    kind: "web",
    sector: "Medios y comunidad",
    type: "Web a medida",
    title: "Web para un programa de radio con directo",
    summary:
      "La presencia digital de un programa de radio con casi dos décadas de historia: reproductor en directo, archivo histórico y comunidad, instalable como app.",
    problem:
      "Un programa de radio veterano, con una comunidad fiel, necesitaba una presencia digital a la altura: escuchar el directo, repasar su historia y apoyar el proyecto estaban repartidos entre plataformas de terceros.",
    solution:
      "Una web moderna y rápida con reproductor de radio en directo, galería histórica con decenas de imágenes, integración con la plataforma de mecenazgo del programa e instalación como aplicación (PWA).",
    outcome:
      "La comunidad escucha el directo y navega la historia del programa desde cualquier dispositivo, en un canal propio — no alquilado a plataformas de terceros.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PWA"],
    visual: "radio",
    caseSections: [
      {
        title: "El encargo",
        body: "Dos décadas de programa generan mucho más que audio: historia, imágenes, identidad y una comunidad que quiere participar. El reto era reunir todo eso en un sitio propio, moderno y muy rápido, sin perder la esencia del proyecto.",
      },
      {
        title: "Qué construimos",
        body: "Una web centrada en lo que la audiencia hace de verdad: darle al play. Reproductor de directo persistente mientras se navega, galería histórica, sección del equipo, integración con el mecenazgo y soporte PWA para instalarla como app en el móvil.",
      },
      {
        title: "Por qué es un buen ejemplo",
        body: "Porque una web a medida no es solo estética: aquí hay estado compartido (el reproductor no se corta al navegar), rendimiento cuidado y decisiones de producto tomadas con el propietario. El mismo planteamiento sirve para medios, podcasts, asociaciones o cualquier proyecto con comunidad.",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
