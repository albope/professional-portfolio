export type ProjectVisualVariant = "padel" | "wms" | "assistant" | "boda" | "radio";

export type ProjectKind = "software" | "web";

export interface CaseSection {
  index: string;
  title: string;
  body: string;
}

export interface FichaEntry {
  label: string;
  body: string;
}

export interface Project {
  slug: string;
  gallery: boolean;
  featured?: boolean;
  credit?: string;
  capabilities?: FichaEntry[];
  statusLabel: "Proyecto real";
  kind: ProjectKind;
  meta: string;
  metaCase: string;
  title: string;
  summary: string;
  heroPre: string;
  heroWord: string;
  intro: string;
  ficha: FichaEntry[];
  visual: ProjectVisualVariant;
  visualCaption: string;
  caseSections: CaseSection[];
  nextStep: string;
}

export const projects: Project[] = [
  {
    slug: "asistente-ia-gestion-proyectos",
    gallery: true,
    featured: true,
    statusLabel: "Proyecto real",
    kind: "software",
    meta: "IA aplicada · Gestión de proyectos",
    metaCase: "Asistentes de IA · Proyectos y conocimiento interno",
    title: "Asistente de IA para gestión de proyectos",
    summary:
      "Dos agentes especializados para consultar documentación, analizar el estado de un proyecto y preparar decisiones, estimaciones y borradores con contexto.",
    heroPre: "El contexto de tus proyectos, a mano para",
    heroWord: "decidir",
    intro:
      "Desarrollo de una aplicación de IA con un agente de gestión de proyectos y otro de conocimiento de producto. Reúne consultas, documentos y herramientas de trabajo en una interfaz que muestra las fuentes consultadas y los pasos de cada respuesta.",
    credit:
      "Experiencia profesional de la dirección de proyectos y tecnología: desarrollo realizado en un equipo interno, presentado de forma anónima.",
    ficha: [
      { label: "Necesidad", body: "Reunir contexto disperso para preparar seguimiento, decisiones y propuestas." },
      { label: "Trabajo realizado", body: "Aplicación, agentes especializados, tratamiento de adjuntos y conexión con fuentes de trabajo." },
      { label: "Estado", body: "Desarrollo funcional para un piloto interno, con conexiones según configuración y permisos." },
      { label: "Puede encajar en", body: "Equipos de proyectos, operaciones, soporte y preventa con información repartida." },
    ],
    visual: "assistant",
    visualCaption: "Del contexto a una propuesta revisable · Esquema funcional del desarrollo.",
    capabilities: [
      { label: "Consultar conocimiento interno", body: "Resolver dudas sobre un producto a partir de documentación preparada y fuentes de referencia, con instrucciones para citar su procedencia." },
      { label: "Preparar el seguimiento", body: "Modos de trabajo para elaborar un resumen diario, revisar el estado de un proyecto y plantear prioridades usando las fuentes disponibles." },
      { label: "Analizar una decisión", body: "Ordenar alternativas, supuestos e impacto en esfuerzo, plazo y riesgo como apoyo a la persona que decide." },
      { label: "Dar forma a una estimación", body: "Convertir notas o una petición inicial en un desglose de trabajo, supuestos, riesgos y preguntas pendientes antes de preparar una oferta." },
      { label: "Trabajar con documentos", body: "Adjuntar PDF, documentos de texto y hojas de cálculo. La aplicación extrae su contenido para incorporarlo a la consulta." },
      { label: "Revisar cómo se obtuvo la respuesta", body: "Ver las fuentes y herramientas consultadas, desplegar los pasos de ejecución y retomar conversaciones sin empezar de cero." },
    ],
    caseSections: [
      {
        index: "01",
        title: "El problema es reunir el contexto",
        body: "Preparar una reunión, explicar un retraso o valorar un cambio suele exigir revisar documentos, conversaciones, compromisos y tareas. El proyecto aborda ese trabajo previo: llevar el contexto pertinente a una consulta y estructurar una respuesta que la persona pueda revisar.",
      },
      {
        index: "02",
        title: "Dos agentes con responsabilidades distintas",
        body: "La aplicación separa la gestión de proyectos del conocimiento de producto. El primer agente tiene modos para seguimiento, prioridades, decisiones, tareas y borradores de correo. El segundo trabaja sobre documentación de referencia y métodos de estimación para resolver dudas y preparar material técnico o comercial. Cada uno recibe instrucciones, fuentes y herramientas acordes con su función.",
      },
      {
        index: "03",
        title: "Una aplicación alrededor del trabajo real",
        body: "El desarrollo incluye una interfaz de conversación con historial, adjuntos, respuesta progresiva, cancelación y reintento. Las conexiones permiten consultar documentación y herramientas del equipo según los permisos disponibles. Una traza muestra qué fuentes y herramientas se han utilizado; facilita revisar el recorrido, aunque no garantiza por sí sola la exactitud de cada afirmación.",
      },
      {
        index: "04",
        title: "Propuestas que revisa una persona",
        body: "Los modos de trabajo orientan al agente a explicar supuestos, señalar información pendiente y preparar borradores. Para las tareas se define un flujo de propuesta y confirmación. Esa forma de trabajar ayuda a mantener la decisión en manos del equipo; las instrucciones del agente deben acompañarse de permisos y controles adecuados en cada implantación.",
      },
      {
        index: "05",
        title: "Cómo empezar en otro equipo",
        body: "La primera versión puede centrarse en una tarea concreta: preparar el estado semanal de un proyecto, responder dudas internas o estructurar una estimación. El alcance debe definir qué fuentes se pueden consultar, qué salida espera la persona y cómo se revisa. El piloto permite comprobar la utilidad y ajustar las conexiones antes de ampliar su uso.",
      },
    ],
    nextStep: "Cuéntanos qué información necesita reunir tu equipo y qué respuesta o documento prepara con ella.",
  },
  {
    slug: "plataforma-clubes-padel",
    gallery: true,
    statusLabel: "Proyecto real",
    kind: "software",
    meta: "Software a medida · Reservas",
    metaCase: "Gestión deportiva · Reservas y socios",
    title: "Plataforma de gestión para clubes de pádel",
    summary:
      "Reservas, socios, pagos y competiciones, con un espacio para el club y otro para el jugador.",
    heroPre: "Reservas y gestión de pádel en una",
    heroWord: "plataforma",
    intro:
      "Desarrollo de una plataforma para conectar la reserva de pistas con la administración del club: socios, pagos y competiciones desde un mismo sistema.",
    ficha: [
      { label: "Necesidad", body: "Coordinar disponibilidad, reservas y gestión de socios." },
      { label: "Trabajo realizado", body: "Desarrollo de la aplicación y sus flujos de gestión." },
      { label: "Alcance", body: "Panel del club, portal del jugador, reservas, pagos y competiciones." },
      { label: "Puede encajar en", body: "Negocios con reservas, cuotas, espacios o actividades." },
    ],
    visual: "padel",
    visualCaption: "Flujo de reservas · Esquema funcional del proyecto.",
    caseSections: [
      {
        index: "01",
        title: "La necesidad que aborda",
        body: "Una reserva afecta a varias partes del negocio: la disponibilidad de una pista, los datos del jugador, el pago y la agenda del club. El reto del proyecto fue reunir esos procesos en una aplicación con dos perspectivas: quien reserva y quien administra.",
      },
      {
        index: "02",
        title: "Qué construimos",
        body: "Desarrollamos el portal del jugador y el panel de gestión del club. El alcance incluye la reserva de pistas, la gestión de socios, los pagos y la organización de competiciones. El trabajo conecta las acciones del jugador con la información que necesita administrar el club.",
      },
      {
        index: "03",
        title: "Cómo se organiza la solución",
        body: "El portal reúne las acciones del jugador y el panel concentra la operativa del club. Separar estos dos espacios permite presentar a cada persona las funciones que necesita, manteniendo reservas y gestión dentro de la misma plataforma.",
      },
      {
        index: "04",
        title: "Qué aprender para otro negocio",
        body: "Este proyecto aporta una base de trabajo para servicios que dependen de horarios, plazas o cuotas. En un nuevo encargo empezaríamos por revisar las reglas concretas de disponibilidad, cancelación y cobro antes de decidir qué conviene reutilizar y qué desarrollar a medida.",
      },
    ],
    nextStep: "Cuéntanos cómo gestionas hoy las reservas y qué parte te cuesta más coordinar.",
  },
  {
    slug: "wms-almacen",
    gallery: true,
    statusLabel: "Proyecto real",
    kind: "software",
    meta: "Herramienta interna · Almacén",
    metaCase: "Gestión de almacén · Inventario y movimientos",
    title: "Sistema de gestión de almacén",
    summary:
      "Inventario, ubicaciones y movimientos en una herramienta con acceso según el rol de cada persona.",
    heroPre: "Inventario y movimientos bajo el mismo",
    heroWord: "control",
    intro:
      "Desarrollo de un sistema de gestión de almacén para organizar referencias, ubicaciones y movimientos, con permisos por rol.",
    ficha: [
      { label: "Necesidad", body: "Relacionar lo que hay en el almacén con dónde está y cómo se mueve." },
      { label: "Trabajo realizado", body: "Desarrollo de una herramienta interna de gestión de almacén." },
      { label: "Alcance", body: "Inventario, ubicaciones, entradas, movimientos y permisos por rol." },
      { label: "Puede encajar en", body: "Operaciones con material, existencias o movimientos internos." },
    ],
    visual: "wms",
    visualCaption: "Flujo de almacén · Esquema funcional del proyecto.",
    caseSections: [
      {
        index: "01",
        title: "La necesidad que aborda",
        body: "Gestionar un almacén requiere conectar las referencias con sus ubicaciones y registrar los cambios de existencias. El proyecto aborda esa relación para que la información de inventario y los movimientos formen parte de una misma herramienta.",
      },
      {
        index: "02",
        title: "Qué construimos",
        body: "Desarrollamos un sistema de gestión de almacén con inventario, ubicaciones, entradas y movimientos. El acceso se organiza por roles para distinguir qué operaciones puede realizar cada persona dentro de la aplicación.",
      },
      {
        index: "03",
        title: "Cómo se organiza la solución",
        body: "Referencias, ubicaciones y movimientos son las piezas centrales. Mantenerlas relacionadas permite consultar el inventario en su contexto y registrar la operativa desde el mismo sistema. Los permisos acompañan esa estructura para delimitar el acceso a las funciones.",
      },
      {
        index: "04",
        title: "Qué aprender para otra operativa",
        body: "Antes de construir una herramienta interna conviene describir un recorrido concreto: qué entra, dónde se coloca, quién lo mueve y cómo se registra. Ese recorrido ayuda a definir una primera versión útil y las integraciones que realmente necesita el negocio.",
      },
    ],
    nextStep: "Cuéntanos qué necesitas localizar, registrar o coordinar en tu operativa.",
  },
  {
    slug: "web-boda",
    gallery: true,
    statusLabel: "Proyecto real",
    kind: "web",
    meta: "Web a medida · Evento",
    metaCase: "Web a medida · Gestión de invitados",
    title: "Web de evento con confirmación de invitados",
    summary:
      "Información del evento, confirmaciones, avisos por email y un panel privado de gestión.",
    heroPre: "Invitados y organización en una",
    heroWord: "web",
    intro:
      "Desarrollo de una web de boda con información para los invitados, confirmación de asistencia y un espacio privado de gestión.",
    ficha: [
      { label: "Necesidad", body: "Reunir información del evento y respuestas de invitados." },
      { label: "Trabajo realizado", body: "Desarrollo de la web, formularios y panel privado." },
      { label: "Alcance", body: "Confirmaciones, preferencias, avisos por email y galería colaborativa." },
      { label: "Puede encajar en", body: "Eventos, jornadas y actividades con inscripción." },
    ],
    visual: "boda",
    visualCaption: "Flujo de confirmación de invitados · Esquema funcional del proyecto.",
    caseSections: [
      { index: "01", title: "Una web con una función concreta", body: "La web combina la presentación del evento con una tarea: recoger las confirmaciones y preferencias de los invitados. El formulario permite indicar asistencia, menú y transporte desde el mismo lugar en el que se consulta la información." },
      { index: "02", title: "Qué construimos", body: "Desarrollamos la web de invitación, el flujo de confirmación con avisos por email, una galería colaborativa y un panel privado. La parte pública informa y recoge respuestas; el espacio privado permite gestionarlas." },
      { index: "03", title: "Qué puede trasladarse a otro evento", body: "El mismo planteamiento permite diseñar inscripciones para jornadas, cursos o encuentros. Cada caso necesita definir los datos imprescindibles, quién puede consultarlos y qué debe ocurrir después de cada respuesta." },
    ],
    nextStep: "Cuéntanos qué evento organizas y qué necesitas que puedan hacer sus participantes.",
  },
  {
    slug: "web-radio",
    gallery: true,
    statusLabel: "Proyecto real",
    kind: "web",
    meta: "Web a medida · Audio",
    metaCase: "Web a medida · Radio y contenidos",
    title: "Web para un programa de radio con directo",
    summary:
      "Emisión en directo, archivo de programas y navegación con reproductor persistente.",
    heroPre: "Directo y programas en una web",
    heroWord: "propia",
    intro:
      "Desarrollo de una web para un programa de radio con identidad propia, reproductor en directo y archivo de emisiones.",
    ficha: [
      { label: "Necesidad", body: "Reunir la escucha en directo y el contenido publicado." },
      { label: "Trabajo realizado", body: "Desarrollo de la web y de la experiencia de reproducción." },
      { label: "Alcance", body: "Directo, archivo de programas, reproductor persistente e instalación como app." },
      { label: "Puede encajar en", body: "Programas de radio, podcasts y proyectos de audio." },
    ],
    visual: "radio",
    visualCaption: "Recorrido de escucha y navegación · Esquema funcional del proyecto.",
    caseSections: [
      { index: "01", title: "Una experiencia alrededor de la escucha", body: "La necesidad era reunir la identidad del programa, la emisión en directo y los contenidos archivados en una web propia. El audio forma parte central del recorrido por el sitio." },
      { index: "02", title: "Qué construimos", body: "Desarrollamos la web con reproductor en directo, archivo histórico y soporte para instalarla como app. El reproductor permanece durante la navegación interna para permitir explorar el contenido mientras se escucha." },
      { index: "03", title: "Qué decisiones requiere otro proyecto de audio", body: "El origen de la emisión, la organización del archivo y el comportamiento del reproductor determinan buena parte del alcance. En un nuevo proyecto revisaríamos esas piezas junto con la experiencia móvil y la forma de publicar nuevos programas." },
    ],
    nextStep: "Cuéntanos qué publicas y cómo quieres que tu audiencia lo encuentre y lo escuche.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
