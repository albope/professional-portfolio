// Proyectos de BPM Tech. Copy definitivo del handoff de diseño.
// - `concept: false` = proyecto real, mostrado sin datos de cliente.
// - `concept: true`  = concepto que ilustra una tipología de trabajo.

export type ProjectVisualVariant =
  | "padel"
  | "wms"
  | "docs"
  | "assistant"
  | "boda"
  | "radio";

export type ProjectKind = "software" | "web";

export interface CaseSection {
  index: string;
  title: string;
  body: string;
}

export interface FichaEntry {
  label: string;
  body: string;
  mono?: boolean;
}

export interface Project {
  slug: string;
  concept: boolean;
  kind: ProjectKind;
  /** Meta de la tarjeta en home, p. ej. "SaaS · Deporte y ocio" */
  meta: string;
  /** Meta del case study, p. ej. "SaaS · Gestión deportiva" */
  metaCase: string;
  /** Título de la tarjeta en home */
  title: string;
  /** Descripción de la tarjeta en home */
  summary: string;
  /** H1 del case study: texto previo + palabra final que lleva el cuadrado */
  heroPre: string;
  heroWord: string;
  /** Entradilla del case study */
  intro: string;
  ficha: FichaEntry[];
  visual: ProjectVisualVariant;
  visualCaption?: string;
  /** Captura real del producto (ruta en public/) */
  screenshot?: string;
  screenshotAlt?: string;
  caseSections?: CaseSection[];
}

export const projects: Project[] = [
  {
    slug: "plataforma-clubes-padel",
    concept: false,
    kind: "software",
    meta: "SaaS · Deporte y ocio",
    metaCase: "SaaS · Gestión deportiva",
    title: "Plataforma de gestión para clubes de pádel",
    summary:
      "Reservas, socios, pagos y competiciones en un solo sistema, con panel para el club y portal para el jugador.",
    heroPre: "Un club de pádel que se gestiona",
    heroWord: "solo",
    intro:
      "Plataforma de reservas, socios, pagos y competiciones para clubes de pádel. Un caso adaptable a cualquier negocio con reservas y cuotas.",
    ficha: [
      {
        label: "Problema",
        body: "Reservas por teléfono y WhatsApp, cobros a mano y listas de socios en hojas de cálculo.",
      },
      {
        label: "Solución",
        body: "Una plataforma donde el socio reserva y paga, y el club administra pistas, cuotas y torneos.",
      },
      {
        label: "Resultado",
        body: "El club opera reservas, pagos y competiciones desde un único panel, en producción por fases.",
      },
      {
        label: "Tecnologías",
        body: "Next.js · TypeScript\nPostgreSQL · Supabase\nPagos online",
        mono: true,
      },
    ],
    visual: "padel",
    visualCaption: "fig. 01 · captura real del producto",
    screenshot: "/screenshots/padel.png",
    screenshotAlt: "Captura de la plataforma de gestión para clubes de pádel",
    caseSections: [
      {
        index: "B.01",
        title: "El punto de partida",
        body: "El club gestionaba todo a mano. Cada reserva era una llamada, cada cobro un recordatorio y cada torneo una hoja de cálculo nueva. El tiempo de administración crecía con cada socio nuevo.",
      },
      {
        index: "B.02",
        title: "Qué construimos",
        body: "Empezamos por las reservas, el dolor más caro. Después llegaron los pagos, los socios y las competiciones, en fases cortas que el club validaba usando el sistema. Cada fase entró en producción por separado.",
      },
      {
        index: "B.03",
        title: "Qué puede significar para ti",
        body: "Si tu negocio vive de reservas, cuotas o turnos, este mismo esquema se adapta: un sistema donde tus clientes se atienden solos y tú ves todo desde un panel.",
      },
    ],
  },
  {
    slug: "wms-almacen",
    concept: false,
    kind: "software",
    meta: "Herramienta interna · Logística",
    metaCase: "WMS · Logística interna",
    title: "Sistema de gestión de almacén para una pyme",
    summary:
      "Inventario, ubicaciones y movimientos con permisos por rol, construido por fases sobre una especificación acordada.",
    heroPre: "Un almacén donde nada se",
    heroWord: "pierde",
    intro:
      "Sistema de gestión de almacén para una pyme industrial, construido por fases. Entradas, ubicaciones, picking e inventario en una sola herramienta.",
    ficha: [
      {
        label: "Problema",
        body: "El stock vivía en papel y en la memoria del encargado. Encontrar una referencia costaba paseos.",
      },
      {
        label: "Solución",
        body: "Un WMS a la medida del almacén real: sus estanterías, sus rutas y su forma de trabajar.",
      },
      {
        label: "Resultado",
        body: "Cada referencia tiene ubicación y cada movimiento queda registrado. El inventario deja de ser un misterio.",
      },
      {
        label: "Tecnologías",
        body: "Next.js · TypeScript\nNode.js · PostgreSQL\nLectura de códigos",
        mono: true,
      },
    ],
    visual: "wms",
    visualCaption: "fig. 01 · captura real del acceso al sistema",
    screenshot: "/screenshots/wms.png",
    screenshotAlt: "Captura del acceso al sistema de gestión de almacén",
    caseSections: [
      {
        index: "B.01",
        title: "El punto de partida",
        body: "La empresa crecía y el almacén no. Los pedidos salían tarde porque encontrar el material dependía de dos personas concretas.",
      },
      {
        index: "B.02",
        title: "Qué construimos",
        body: "Primera fase: ubicaciones y entradas. Segunda: picking con lectura de códigos. Tercera: inventario continuo. Cada fase se usó en el almacén real antes de pasar a la siguiente.",
      },
      {
        index: "B.03",
        title: "Qué puede significar para ti",
        body: "Si tu operativa depende de saber dónde está cada cosa, piezas, expedientes, pedidos, este enfoque por fases funciona igual.",
      },
    ],
  },
  {
    slug: "automatizacion-documental",
    concept: false,
    kind: "software",
    meta: "Automatización con IA · Administración",
    metaCase: "IA · Documentos",
    title: "Automatización documental con IA",
    summary:
      "Facturas y albaranes que llegan por email, se extraen con IA y acaban validados en el ERP con trazabilidad completa.",
    heroPre: "Los papeles se leen",
    heroWord: "solos",
    intro:
      "Automatización documental con IA. Facturas, albaranes y contratos entran, y los datos salen ya colocados en tu sistema.",
    ficha: [
      {
        label: "Problema",
        body: "Horas de picar datos de PDF a mano, con errores incluidos.",
      },
      {
        label: "Solución",
        body: "La IA extrae los campos, una persona valida y el sistema archiva.",
      },
      {
        label: "Tecnologías",
        body: "Anthropic · OCR · Next.js · PostgreSQL",
        mono: true,
      },
    ],
    visual: "docs",
    visualCaption: "fig. 01 · del papel al dato",
  },
  {
    slug: "asistente-interno",
    concept: false,
    kind: "software",
    meta: "Agente de IA · Conocimiento interno",
    metaCase: "IA · Conocimiento",
    title: "Asistente interno sobre el conocimiento de la empresa",
    summary:
      "Responde a las preguntas del equipo citando siempre el documento de origen y respetando los permisos de cada persona.",
    heroPre: "Tu empresa, con",
    heroWord: "respuestas",
    intro:
      "Un asistente que responde con los documentos, manuales y procedimientos de tu empresa. La respuesta cita de dónde sale.",
    ficha: [
      {
        label: "Problema",
        body: "El conocimiento vive en carpetas y en la cabeza de los veteranos.",
      },
      {
        label: "Solución",
        body: "Un buscador que entiende preguntas y responde citando la fuente.",
      },
      {
        label: "Tecnologías",
        body: "Anthropic · RAG · Supabase · Next.js",
        mono: true,
      },
    ],
    visual: "assistant",
    visualCaption: "fig. 01 · pregunta y respuesta con fuente",
  },
  {
    slug: "web-boda",
    concept: false,
    kind: "web",
    meta: "Web a medida · Evento",
    metaCase: "Web a medida · Evento",
    title: "Web de boda con confirmación de invitados",
    summary:
      "Invitación digital, confirmaciones con aviso por email, galería colaborativa y panel privado de gestión.",
    heroPre: "Una boda sin lista en",
    heroWord: "papel",
    intro:
      "Web de boda con confirmación de invitados. Cada invitado confirma su asistencia, su menú y su autobús desde el móvil.",
    ficha: [
      {
        label: "Problema",
        body: "Confirmaciones por WhatsApp, llamadas y una hoja que nunca cuadra.",
      },
      {
        label: "Solución",
        body: "Un formulario propio con la lista siempre al día para los novios.",
      },
      {
        label: "Tecnologías",
        body: "Next.js · Supabase · Vercel",
        mono: true,
      },
      {
        label: "Se adapta a",
        body: "Cualquier evento con inscripción: jornadas, cursos, comidas de empresa.",
      },
    ],
    visual: "boda",
    visualCaption: "fig. 01 · captura real de la web",
    screenshot: "/screenshots/boda.jpg",
    screenshotAlt: "Captura de la web de boda",
  },
  {
    slug: "web-radio",
    concept: false,
    kind: "web",
    meta: "Web a medida · Medios",
    metaCase: "Web a medida · Medios",
    title: "Web para un programa de radio con directo",
    summary:
      "Reproductor en directo que no se corta al navegar, archivo histórico y soporte para instalarla como app.",
    heroPre: "Una radio que suena en su propia",
    heroWord: "casa",
    intro:
      "Web para un programa de radio con emisión en directo, programas archivados e identidad propia.",
    ficha: [
      {
        label: "Problema",
        body: "El programa dependía de plataformas de terceros para sonar y archivar.",
      },
      {
        label: "Solución",
        body: "Web propia con reproductor en directo y archivo de emisiones.",
      },
      {
        label: "Tecnologías",
        body: "Next.js · streaming de audio · Vercel",
        mono: true,
      },
      {
        label: "Se adapta a",
        body: "Podcasts, emisoras locales y cualquier proyecto con contenido en directo.",
      },
    ],
    visual: "radio",
    visualCaption: "fig. 01 · captura real de la web",
    screenshot: "/screenshots/radio.jpg",
    screenshotAlt: "Captura de la web del programa de radio",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
