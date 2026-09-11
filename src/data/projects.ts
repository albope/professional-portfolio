/**
 * Capturas reales, ya recortadas y anonimizadas donde el permiso del cliente
 * no alcanza. El `alt` describe la pantalla que se ve, nunca el nombre del
 * proyecto. Publicar el original de una captura anonimizada requiere la
 * autorización del cliente; ver docs/contexto-actual.md.
 *
 * Viven en `public/` y declaran su tamaño real: así el módulo de datos no
 * depende del empaquetador y las pruebas pueden importarlo.
 */
export interface Shot {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const files = {
  academia: { src: "/proyectos/padel/academia.png", width: 1280, height: 720 },
  recepcion: { src: "/proyectos/padel/recepcion.png", width: 1280, height: 720 },
  reservas: { src: "/proyectos/padel/reservas.png", width: 1280, height: 720 },
  portalMovil: { src: "/proyectos/padel/portal-movil.png", width: 390, height: 884 },
  movimientos: { src: "/proyectos/almacen/movimientos.png", width: 3200, height: 1800 },
  rfEntrada: { src: "/proyectos/almacen/rf-entrada.png", width: 960, height: 1600 },
  eventoPortada: { src: "/proyectos/evento/portada.jpg", width: 1120, height: 512 },
  eventoCuenta: { src: "/proyectos/evento/cuenta.jpg", width: 1120, height: 512 },
  radioPortada: { src: "/proyectos/radio/portada.jpg", width: 1296, height: 593 },
  radioMovil: { src: "/proyectos/radio/movil.jpg", width: 514, height: 786 },
  asistentePanel: { src: "/proyectos/asistente/panel.png", width: 1343, height: 638 },
  asistentePanelMovil: { src: "/proyectos/asistente/panel-movil.png", width: 833, height: 510 },
} as const;

/** Color del propio producto. Solo vive dentro de su escenario. */
export type SceneTone = "padel" | "wms" | "evento" | "radio" | "parrilla" | "papel";

export interface FichaEntry {
  label: string;
  body: string;
}

export interface ProjectFigure {
  shot: Shot;
  scene: SceneTone;
  legend: string;
  legendRight?: string;
  captionLabel: string;
  caption: string;
  /** `ancha` captura de escritorio · `movil` pantalla de teléfono · `recorte` detalle ampliado */
  variant: "ancha" | "movil" | "recorte";
}

export interface Project {
  slug: string;
  /**
   * Leyenda del escenario. Lleva solo el nombre del trabajo: la web pública
   * nunca indica el tipo de relación con el proyecto (producto propio,
   * encargo, proyecto personal o piloto interno). Ese criterio es interno.
   */
  sceneLabel: string;
  /** Web pública del proyecto, solo cuando el cliente lo ha autorizado. */
  externalUrl?: string;
  externalLabel?: string;
  title: string;
  summary: string;
  /** Versión corta para el móvil, donde el texto convive con la captura. */
  summaryShort?: string;
  /** Metadatos mono de la cabecera de la ficha. */
  meta: string[];
  metaShort: string;
  heroPre: string;
  heroWord: string;
  intro: string;
  /** Apunte al margen del titular de la ficha. */
  aside?: string;
  ficha: FichaEntry[];
  figures: ProjectFigure[];
  problem: string;
  built: { body: string; features: string[] };
  decision: { body: string; note: string };
  nextStep: string;
}

export const projects: Project[] = [
  {
    slug: "plataforma-clubes-padel",
    sceneLabel: "Padel Club OS · En producción",
    externalUrl: "https://www.padelclubos.com",
    externalLabel: "padelclubos.com",
    title: "Plataforma de gestión para clubes de pádel",
    summary:
      "Reservas, socios, pagos y competiciones. Un panel para el club y un portal para el jugador, que reserva desde el móvil sin instalar nada.",
    summaryShort: "Reservas, socios, pagos y competiciones.",
    meta: ["Software · Reservas y gestión", "En producción"],
    metaShort: "Software · En producción",
    heroPre: "Reservas y gestión de pádel en una",
    heroWord: "plataforma",
    intro:
      "Desarrollo de una plataforma para conectar la reserva de pistas con la administración del club: socios, pagos y competiciones desde un mismo sistema. Un panel para quien gestiona y un portal para quien juega.",
    aside:
      "Diseñamos, desarrollamos y operamos la plataforma, que hoy funciona como servicio por suscripción para clubes.",
    ficha: [
      { label: "Necesidad", body: "Coordinar disponibilidad, reservas y gestión de socios sin WhatsApp, Excel ni papel." },
      { label: "Trabajo realizado", body: "Desarrollo completo de la aplicación y sus flujos de gestión, pagos y comunicación." },
      { label: "Alcance", body: "Panel del club, portal del jugador, reservas, socios, cobros, competiciones y academia." },
      { label: "Puede encajar en", body: "Negocios con reservas, cuotas, espacios o actividades." },
    ],
    figures: [
      {
        shot: {
          ...files.recepcion,
          alt: "Panel de administración: recepción del día con reservas activas, participantes, cobros y filtros por estado",
        },
        scene: "padel",
        legend: "Panel del club · Recepción del día",
        legendRight: "Captura real · Datos de demo",
        captionLabel: "Recepción del día",
        caption:
          "Reservas activas, participantes, cobros y filtros por estado. La jornada se cierra desde aquí y puede reabrirse para corregir cobros o asistencias.",
        variant: "ancha",
      },
      {
        shot: {
          ...files.reservas,
          alt: "Parrilla de reservas: franjas horarias por pista con estado y titular de cada reserva",
        },
        scene: "parrilla",
        legend: "Parrilla de reservas",
        captionLabel: "Parrilla de reservas",
        caption:
          "Cada franja muestra hora, estado y titular. Las reservas habituales se distinguen con una trama, no solo con color.",
        variant: "recorte",
      },
      {
        shot: {
          ...files.portalMovil,
          alt: "Portal del jugador en el móvil: pantalla de clases con la barra inferior de navegación",
        },
        scene: "padel",
        legend: "Portal del jugador",
        captionLabel: "Portal del jugador",
        caption:
          "Funciona en el navegador del móvil e instalable como app. Clases, reservas y perfil en la barra inferior.",
        variant: "movil",
      },
    ],
    problem:
      "Una reserva afecta a varias partes del negocio: la disponibilidad de una pista, los datos del jugador, el pago y la agenda del club. El reto fue reunir esos procesos en una aplicación con dos perspectivas: quien reserva y quien administra.",
    built: {
      body:
        "El portal del jugador y el panel de gestión del club. El trabajo conecta las acciones del jugador con la información que necesita administrar el club.",
      features: [
        "Reservas online con detección de solapamientos",
        "Socios, con importación desde Excel",
        "Ligas y torneos con clasificación automática",
        "Cobros presenciales y reservas pendientes",
        "Portal móvil del jugador, sin instalar app",
        "Analíticas de ocupación e ingresos",
        "Noticias y blog del club",
        "Roles y permisos para admins, staff y socios",
      ],
    },
    decision: {
      body:
        "Dos espacios separados sobre los mismos datos. El panel concentra la operativa del club: reservas, cobros, academia y socios. El portal muestra al jugador solo lo que necesita para reservar y apuntarse. Cada persona ve las funciones propias de su papel, y el club no tiene que explicar la herramienta a nadie.",
      note:
        "Este proyecto es una base para servicios que dependen de horarios, plazas o cuotas. En un nuevo encargo empezaríamos por las reglas de disponibilidad, cancelación y cobro antes de decidir qué reutilizar y qué desarrollar a medida.",
    },
    nextStep:
      "Cuéntanos cómo gestionas hoy las reservas y qué parte te cuesta más coordinar. No necesitas tener definido el proyecto.",
  },
  {
    slug: "wms-almacen",
    sceneLabel: "Gestión de almacén",
    title: "Sistema de gestión de almacén",
    summary:
      "Inventario, ubicaciones y movimientos en una herramienta con permisos por rol, más un terminal RF para operar con escáner o con la cámara del móvil.",
    summaryShort:
      "Inventario, ubicaciones y movimientos con permisos por rol, más un terminal RF para operar con escáner o con la cámara del móvil.",
    meta: ["Software · Inventario y movimientos", "Web + terminal RF"],
    metaShort: "Software · Web + terminal RF",
    heroPre: "Inventario y movimientos bajo el mismo",
    heroWord: "control",
    intro:
      "Desarrollo de un sistema de gestión de almacén para organizar referencias, ubicaciones y movimientos, con permisos por rol y un terminal RF para operar a pie de estantería.",
    ficha: [
      { label: "Necesidad", body: "Relacionar lo que hay en el almacén con dónde está y cómo se mueve." },
      { label: "Trabajo realizado", body: "Aplicación web completa: productos, ubicaciones, stock, movimientos, recuentos, órdenes e informes." },
      { label: "Alcance", body: "Inventario, ubicaciones, entradas, movimientos, permisos por rol y terminal RF." },
      { label: "Puede encajar en", body: "Operaciones con material, existencias o movimientos internos." },
    ],
    figures: [
      {
        shot: {
          ...files.movimientos,
          alt: "Pantalla de movimientos: libro de entradas, salidas, traspasos y ajustes con sus filtros; la marca del producto aparece difuminada",
        },
        scene: "wms",
        legend: "Libro de movimientos",
        legendRight: "Captura real · Datos de demo",
        captionLabel: "Movimientos",
        caption:
          "Entradas, salidas, traspasos y ajustes en un único libro. El stock de cada referencia se lee como el resultado de esos apuntes.",
        variant: "ancha",
      },
      {
        shot: {
          ...files.rfEntrada,
          alt: "Terminal RF en el móvil: entrada de producto con lectura por escáner y confirmación de ubicación",
        },
        scene: "wms",
        legend: "Terminal RF",
        captionLabel: "Terminal RF",
        caption:
          "La misma operativa a pie de estantería, con escáner o con la cámara del móvil. Sin instalar una aplicación aparte.",
        variant: "movil",
      },
    ],
    problem:
      "Gestionar un almacén requiere conectar las referencias con sus ubicaciones y registrar los cambios de existencias. El proyecto aborda esa relación para que la información de inventario y los movimientos formen parte de una misma herramienta.",
    built: {
      body:
        "Una aplicación web de gestión con inventario, ubicaciones, entradas y movimientos, más un terminal RF para trabajar en el propio almacén. El acceso se organiza por roles.",
      features: [
        "Productos y referencias",
        "Ubicaciones del almacén",
        "Entradas y recepciones",
        "Movimientos, traspasos y ajustes",
        "Recuentos de inventario",
        "Órdenes e informes",
        "Terminal RF con escáner o cámara",
        "Permisos por rol",
      ],
    },
    decision: {
      body:
        "El stock no se edita a mano: es la proyección de un libro de movimientos inmutable. Anular una operación genera un movimiento compensatorio en lugar de borrar el apunte original, así que siempre se puede reconstruir cómo se llegó a la cifra actual.",
      note:
        "Antes de construir una herramienta interna conviene describir un recorrido concreto: qué entra, dónde se coloca, quién lo mueve y cómo se registra. Ese recorrido define una primera versión útil y las integraciones que realmente necesita el negocio.",
    },
    nextStep: "Cuéntanos qué necesitas localizar, registrar o coordinar en tu operativa.",
  },
  {
    slug: "web-boda",
    sceneLabel: "Web de evento",
    title: "Web de evento con confirmación de invitados",
    summary:
      "Información del evento, confirmación con preferencias, avisos por email, peticiones musicales y un panel privado de gestión. En dos idiomas.",
    meta: ["Web a medida · Gestión de invitados"],
    metaShort: "Web a medida",
    heroPre: "Invitados y organización en una",
    heroWord: "web",
    intro:
      "Desarrollo de una web de evento con la información para los invitados, la confirmación de asistencia con sus preferencias y un espacio privado de gestión. En dos idiomas.",
    ficha: [
      { label: "Necesidad", body: "Reunir la información del evento y las respuestas de los invitados en un mismo sitio." },
      { label: "Trabajo realizado", body: "Desarrollo de la web, los formularios y el panel privado." },
      { label: "Alcance", body: "Confirmaciones, preferencias, avisos por email, peticiones musicales y galería colaborativa." },
      { label: "Puede encajar en", body: "Eventos, jornadas y actividades con inscripción." },
    ],
    figures: [
      {
        shot: {
          ...files.eventoPortada,
          alt: "Portada de la web: monograma, nombres, fecha y botón de confirmar asistencia sobre una fotografía en sepia",
        },
        scene: "evento",
        legend: "Portada",
        captionLabel: "Portada",
        caption:
          "La invitación y la acción principal comparten pantalla: quien llega ve la fecha y puede confirmar sin buscar dónde hacerlo.",
        variant: "ancha",
      },
      {
        shot: {
          ...files.eventoCuenta,
          alt: "Sección de cuenta atrás de la web, con la navegación superior y el botón de confirmar asistencia",
        },
        scene: "evento",
        legend: "Cuenta atrás",
        captionLabel: "Cuenta atrás",
        caption:
          "La navegación y el botón de confirmar acompañan al invitado durante todo el recorrido de la página.",
        variant: "ancha",
      },
    ],
    problem:
      "La web combina la presentación del evento con una tarea concreta: recoger las confirmaciones y las preferencias de los invitados. Había que resolver las dos cosas sin que una estorbase a la otra.",
    built: {
      body:
        "La web de invitación, el flujo de confirmación con avisos por email, una galería colaborativa y un panel privado. La parte pública informa y recoge respuestas; el espacio privado permite gestionarlas.",
      features: [
        "Información del evento y horario",
        "Confirmación de asistencia",
        "Preferencias de menú y transporte",
        "Avisos por email",
        "Peticiones musicales",
        "Galería colaborativa",
        "Panel privado de gestión",
        "Dos idiomas",
      ],
    },
    decision: {
      body:
        "Consultar el horario y responder ocurre en la misma página, sin cambiar de sitio. El invitado no pierde el contexto de lo que estaba leyendo para rellenar un formulario en otra pantalla.",
      note:
        "El mismo planteamiento sirve para inscripciones de jornadas, cursos o encuentros. Cada caso necesita definir los datos imprescindibles, quién puede consultarlos y qué debe ocurrir después de cada respuesta.",
    },
    nextStep: "Cuéntanos qué evento organizas y qué necesitas que puedan hacer sus participantes.",
  },
  {
    slug: "web-radio",
    sceneLabel: "Web de radio",
    title: "Web para un programa de radio con directo",
    summary:
      "Emisión en directo, archivo de programas, galería histórica e instalación como app en el móvil.",
    meta: ["Web a medida · Radio y contenidos"],
    metaShort: "Web a medida",
    heroPre: "Directo y programas en una web",
    heroWord: "propia",
    intro:
      "Desarrollo de una web para un programa de radio con identidad propia, reproductor en directo y archivo de emisiones que se puede explorar sin cortar la escucha.",
    ficha: [
      { label: "Necesidad", body: "Reunir la escucha en directo y el contenido publicado en un sitio propio." },
      { label: "Trabajo realizado", body: "Desarrollo de la web y de la experiencia de reproducción." },
      { label: "Alcance", body: "Directo, archivo de programas, galería histórica, reproductor persistente e instalación como app." },
      { label: "Puede encajar en", body: "Programas de radio, podcasts y proyectos de audio." },
    ],
    figures: [
      {
        shot: {
          ...files.radioPortada,
          alt: "Portada de la web: cabecera con navegación y botón En directo, titular grande sobre la fotografía del equipo y reproductor fijo en la parte inferior; la marca aparece difuminada",
        },
        scene: "radio",
        legend: "Portada y directo",
        captionLabel: "Portada",
        caption:
          "El reproductor queda fijo en la parte inferior: se puede recorrer la web entera sin detener la emisión.",
        variant: "ancha",
      },
      {
        shot: {
          ...files.radioMovil,
          alt: "Versión móvil de la web: cabecera, titular de la emisión en directo y tarjeta del reproductor; la marca aparece difuminada",
        },
        scene: "radio",
        legend: "En el móvil",
        captionLabel: "En el móvil",
        caption:
          "La misma escucha en el teléfono, instalable como app desde el propio navegador.",
        variant: "movil",
      },
    ],
    problem:
      "La necesidad era reunir la identidad del programa, la emisión en directo y los contenidos archivados en una web propia. El audio forma parte central del recorrido por el sitio, no es un añadido.",
    built: {
      body:
        "La web con reproductor en directo, archivo histórico y soporte para instalarla como app. El reproductor permanece durante la navegación interna.",
      features: [
        "Emisión en directo",
        "Archivo de programas",
        "Galería histórica",
        "Reproductor persistente",
        "Instalación como app en el móvil",
        "Identidad propia del programa",
      ],
    },
    decision: {
      body:
        "El reproductor permanece mientras se navega: se puede explorar el archivo sin cortar la escucha. Esa decisión condiciona cómo se cargan las páginas internas y dónde vive el estado del audio.",
      note:
        "El origen de la emisión, la organización del archivo y el comportamiento del reproductor determinan buena parte del alcance. En un nuevo proyecto revisaríamos esas piezas junto con la experiencia móvil y la forma de publicar nuevos programas.",
    },
    nextStep: "Cuéntanos qué publicas y cómo quieres que tu audiencia lo encuentre y lo escuche.",
  },
  {
    slug: "asistente-ia-gestion-proyectos",
    sceneLabel: "Asistente de IA",
    title: "Asistente de IA para gestión de proyectos",
    summary:
      "Dos agentes especializados para consultar documentación, analizar el estado de un proyecto y preparar decisiones, estimaciones y borradores con contexto.",
    summaryShort:
      "Dos agentes para consultar documentación, analizar el estado de un proyecto y preparar decisiones y estimaciones con contexto.",
    meta: ["IA aplicada · Proyectos y conocimiento interno"],
    metaShort: "IA aplicada",
    heroPre: "El contexto de tus proyectos, a mano para",
    heroWord: "decidir",
    intro:
      "Desarrollo de una aplicación de IA con un agente de gestión de proyectos y otro de conocimiento de producto. Reúne consultas, documentos y herramientas de trabajo en una interfaz que muestra las fuentes consultadas y los pasos de cada respuesta.",
    ficha: [
      { label: "Necesidad", body: "Reunir contexto disperso para preparar seguimiento, decisiones y propuestas." },
      { label: "Trabajo realizado", body: "Aplicación, agentes especializados, tratamiento de adjuntos y conexión con fuentes de trabajo." },
      { label: "Alcance", body: "Dos agentes, adjuntos, traza de fuentes y herramientas, según configuración y permisos." },
      { label: "Puede encajar en", body: "Equipos de proyectos, operaciones, soporte y preventa con información repartida." },
    ],
    figures: [
      {
        shot: {
          ...files.asistentePanel,
          alt: "Pantalla del asistente: el agente de gestión de proyectos resume correo y mensajería en un informe con hechos y la traza de fuentes consultadas",
        },
        scene: "papel",
        legend: "Agente de gestión de proyectos",
        captionLabel: "Resumen con traza",
        caption:
          "49 pasos con memoria, correo, mensajería y base de conocimiento. La traza permite revisar qué fuentes y herramientas se han utilizado.",
        variant: "ancha",
      },
    ],
    problem:
      "Preparar una reunión, explicar un retraso o valorar un cambio suele exigir revisar documentos, conversaciones, compromisos y tareas. El proyecto aborda ese trabajo previo: llevar el contexto pertinente a una consulta y estructurar una respuesta que la persona pueda revisar.",
    built: {
      body:
        "Una aplicación de conversación con historial, adjuntos, respuesta progresiva, cancelación y reintento, sobre dos agentes con responsabilidades distintas: gestión de proyectos y conocimiento de producto. Cada uno recibe instrucciones, fuentes y herramientas acordes con su función.",
      features: [
        "Consultar conocimiento interno",
        "Preparar el seguimiento de un proyecto",
        "Analizar alternativas de una decisión",
        "Dar forma a una estimación",
        "Trabajar con PDF, documentos y hojas de cálculo",
        "Revisar fuentes y pasos de cada respuesta",
      ],
    },
    decision: {
      body:
        "Las tareas siguen un flujo de propuesta y confirmación: el agente prepara, explica sus supuestos y señala lo que falta, pero la decisión se queda en el equipo. La traza de fuentes ayuda a revisar el recorrido, aunque no garantiza por sí sola la exactitud de cada afirmación.",
      note:
        "Una primera versión puede centrarse en una tarea concreta: preparar el estado semanal de un proyecto, responder dudas internas o estructurar una estimación. El alcance define qué fuentes se pueden consultar, qué salida espera la persona y cómo se revisa.",
    },
    nextStep:
      "Cuéntanos qué información necesita reunir tu equipo y qué respuesta o documento prepara con ella.",
  },
];

/** Capturas que solo usa la portada, con su recorte propio para móvil. */
export const homeShots = {
  padelAcademia: {
    ...files.academia,
    alt: "Panel de administración: módulo de academia con clases, asistencia y cuotas",
  },
  padelPortal: {
    ...files.portalMovil,
    alt: "Portal del jugador en el móvil: pantalla de clases",
  },
  almacenMovimientos: {
    ...files.movimientos,
    alt: "Pantalla de movimientos: libro de entradas, salidas, traspasos y ajustes; la marca del producto aparece difuminada",
  },
  almacenRf: {
    ...files.rfEntrada,
    alt: "Terminal RF en el móvil: entrada de producto por escáner",
  },
  eventoPortada: {
    ...files.eventoPortada,
    alt: "Portada de la web del evento: monograma, nombres, fecha y botón de confirmar asistencia sobre una fotografía en sepia",
  },
  eventoCuenta: {
    ...files.eventoCuenta,
    alt: "Sección de cuenta atrás de la web del evento, con navegación superior y botón de confirmar asistencia",
  },
  radioPortada: {
    ...files.radioPortada,
    alt: "Portada de la web de radio: cabecera con navegación y botón En directo, titular grande sobre la fotografía del equipo y reproductor fijo inferior; la marca aparece difuminada",
  },
  radioMovil: {
    ...files.radioMovil,
    alt: "Versión móvil de la web de radio: cabecera, titular de la emisión en directo y tarjeta del reproductor; la marca aparece difuminada",
  },
  asistente: {
    ...files.asistentePanel,
    alt: "Pantalla del asistente de IA: el agente de gestión de proyectos resume correo y mensajería en un informe con hechos y traza",
  },
  asistenteMovil: {
    ...files.asistentePanelMovil,
    alt: "Pantalla del asistente de IA en formato reducido: resumen del agente de gestión de proyectos",
  },
} satisfies Record<string, Shot>;

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
