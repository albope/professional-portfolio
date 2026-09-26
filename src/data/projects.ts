import type { ContactProject } from "@/lib/contact";

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

/** Recorte en píxeles de la imagen original. */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Todas las capturas servidas en `public/proyectos`, con su tamaño real. Las
 * pruebas comprueban que no hay ningún archivo publicado fuera de esta lista,
 * así que un original sin anonimizar no puede quedarse servido por olvido.
 *
 * `recepcion` no sale en ninguna página: enseña la jornada con los contadores
 * a cero y la especificación la descarta como imagen de Padel Club OS. Sigue
 * declarada mientras el archivo exista en `public/`.
 */
export const capturas = {
  academia: {
    src: "/proyectos/padel/academia.png",
    width: 1280,
    height: 720,
    alt: "Panel de Padel Club OS: gestión de la academia con clases, grupos, profesores y asistencia",
  },
  recepcion: {
    src: "/proyectos/padel/recepcion.png",
    width: 1280,
    height: 720,
    alt: "Panel de administración: recepción del día con reservas activas, participantes, cobros y filtros por estado",
  },
  reservas: {
    src: "/proyectos/padel/reservas.png",
    width: 1280,
    height: 720,
    alt: "Parrilla de reservas: franjas horarias por pista con su estado, una reserva habitual con rayado y una clase de academia",
  },
  portalMovil: {
    src: "/proyectos/padel/portal-movil.png",
    width: 390,
    height: 884,
    alt: "Portal del jugador de Padel Club OS en el móvil: sus clases y asistencia, con la barra inferior de navegación",
  },
  movimientos: {
    src: "/proyectos/almacen/movimientos.png",
    width: 3200,
    height: 1800,
    alt: "Aplicación de almacén: libro de movimientos de entrada, salida y traspaso, con sus filtros. La marca del producto aparece difuminada",
  },
  rfEntrada: {
    src: "/proyectos/almacen/rf-entrada.png",
    width: 960,
    height: 1600,
    alt: "Pantalla del lector de códigos en el móvil para registrar la entrada de un producto escaneando su código",
  },
  eventoCuenta: {
    src: "/proyectos/evento/cuenta-anonima.jpg",
    width: 1120,
    height: 512,
    alt: "Web de un evento con menú, cuenta atrás, selector de idioma y botón para confirmar asistencia. El monograma y la fecha aparecen difuminados",
  },
  radioPortada: {
    src: "/proyectos/radio/portada-anonima.jpg",
    width: 1296,
    height: 593,
    alt: "Web de un programa de radio en el ordenador, con el botón En directo en el menú y el reproductor fijo en la parte inferior. Marca, titular y fotografía difuminados",
  },
  radioMovil: {
    src: "/proyectos/radio/movil.jpg",
    width: 514,
    height: 786,
    alt: "La misma web en el móvil, con la tarjeta del reproductor del directo. La marca aparece difuminada",
  },
  asistenteTraza: {
    src: "/proyectos/asistente/traza-sin-marcas.png",
    width: 1343,
    height: 638,
    alt: "Pantalla del asistente de gestión de proyectos con los pasos y las fuentes consultadas para una respuesta. Las conversaciones, los nombres y el contenido de la respuesta aparecen difuminados",
  },
} satisfies Record<string, Shot>;

/**
 * Figura principal de la ficha: la captura en su escenario arena, con la
 * misma composición que la tarjeta de la portada para que el proyecto se
 * reconozca al entrar.
 * - `con-movil`: escritorio y, delante, el móvil asomando abajo a la derecha
 *   (Padel Club OS y almacén).
 * - `movil-delante`: escritorio al fondo y el móvil delante, tapando la
 *   portada difuminada (radio).
 * - `franja`: solo la franja clara de la web y, superpuesto, un detalle
 *   ampliado del selector de idioma y del botón de confirmar (evento). El
 *   detalle repite lo que ya dice el `alt` de la franja: va `aria-hidden`.
 * - `sola`: una sola pantalla (asistente).
 */
export type MainFigure =
  | { layout: "con-movil" | "movil-delante"; shot: Shot; phone: Shot; caption: string }
  | {
      layout: "franja";
      shot: Shot;
      /** Alto de la franja en píxeles del original, desde arriba. */
      strip: number;
      /** Zona ampliada, en píxeles del original. */
      zoom: Rect;
      caption: string;
    }
  | { layout: "sola"; shot: Shot; caption: string };

/**
 * Detalle de interfaz: la parte que en la figura principal no se lee.
 * - `recorte`: una zona de la captura, sin ampliarla nunca por encima de su
 *   tamaño original.
 * - `movil`: la pantalla del móvil entera, con su marco.
 *
 * `soloMovil`: el detalle repite lo que la figura principal ya enseña legible
 * desde 768 px (el móvil entero, la cuenta atrás). Solo se muestra por
 * debajo, donde la figura principal se lee pequeña.
 */
export type DetailFigure = { label: string; caption: string; soloMovil?: boolean } & (
  | {
      variant: "recorte";
      shot: Shot;
      crop: Rect;
      /**
       * Ancho máximo en pantalla, en píxeles CSS. Por defecto, el del
       * recorte. Una captura tomada a 2x se limita a la mitad, su tamaño en
       * la pantalla original.
       */
      maxWidth?: number;
    }
  | { variant: "movil"; shot: Shot }
);

export interface Project {
  slug: ContactProject;
  /**
   * Qué tipo de trabajo es, sobre el titular. Es la etiqueta de su tarjeta en
   * la portada. Nunca indica el tipo de relación con el proyecto (producto
   * propio, proyecto personal, piloto interno): ese criterio es interno.
   */
  kicker: string;
  /** Titular de la ficha. Solo Padel Club OS lleva nombre propio. */
  name: string;
  /** Título para buscadores y para compartir. */
  title: string;
  intro: string;
  /** Estado publicable, con el cuadrado cobalto de «hecho». Solo Padel. */
  status?: string;
  /** Web pública del proyecto, solo cuando el cliente lo ha autorizado. */
  externalUrl?: string;
  externalLabel?: string;
  figure: MainFigure;
  details: DetailFigure[];
  problem: string;
  built: { body: string; features: string[] };
  decision: { body: string; note: string };
  /** Entradilla del cierre «¿Necesitas algo parecido?». Voz «nosotros». */
  nextStep: string;
}

export const projects: Project[] = [
  {
    slug: "plataforma-clubes-padel",
    kicker: "Plataforma de gestión para clubes de pádel",
    name: "Padel Club OS",
    title: "Padel Club OS, plataforma de gestión para clubes de pádel",
    intro:
      "Una plataforma que une la reserva de pistas con la administración del club: socios, cobros, academia y competiciones en un mismo sistema. Un panel para quien gestiona y un portal para quien juega.",
    status: "En producción. Funciona como servicio por suscripción para clubes.",
    externalUrl: "https://padelclubos.com",
    externalLabel: "padelclubos.com",
    figure: {
      layout: "con-movil",
      shot: capturas.academia,
      phone: capturas.portalMovil,
      caption:
        "El panel del club, en el módulo de academia, y el portal del jugador en el móvil. Capturas reales con datos de demostración.",
    },
    details: [
      {
        variant: "recorte",
        shot: capturas.reservas,
        // Los tres estados de una franja: libre, clase de academia y reserva
        // habitual con rayado. Se pinta a su tamaño (1:1): la captura es a 1x.
        crop: { x: 320, y: 248, w: 340, h: 200 },
        label: "Parrilla de reservas.",
        caption:
          "Cada franja muestra la hora y el estado de la pista. Las reservas habituales se distinguen con un rayado, no solo por el color.",
      },
      {
        variant: "movil",
        shot: capturas.portalMovil,
        soloMovil: true,
        label: "Portal del jugador.",
        caption:
          "Funciona en el navegador del móvil y, si el jugador quiere, se añade a la pantalla de inicio. Clases, reservas y perfil en la barra inferior.",
      },
    ],
    problem:
      "Una reserva afecta a varias partes del negocio: la disponibilidad de una pista, los datos del jugador, el pago y la agenda del club. Había que reunir esos procesos en una aplicación con dos vistas, la de quien reserva y la de quien administra.",
    built: {
      body:
        "El portal del jugador y el panel de gestión del club, conectados entre sí: lo que hace el jugador llega al instante a la información que administra el club.",
      features: [
        "Reservas online sin solapes",
        "Socios, con importación desde Excel",
        "Ligas y torneos con clasificación automática",
        "Cobros presenciales y reservas pendientes",
        "Portal del jugador en el móvil, sin descargar nada",
        "Estadísticas de ocupación e ingresos",
        "Noticias y blog del club",
        "Permisos para gerencia, personal y socios",
      ],
    },
    decision: {
      body:
        "Dos espacios separados sobre los mismos datos. El panel concentra la operativa del club: reservas, cobros, academia y socios. El portal muestra al jugador solo lo que necesita para reservar y apuntarse. Cada persona ve las funciones propias de su papel, y el club no tiene que explicar la herramienta a nadie.",
      note:
        "Sirve de base para servicios que dependen de horarios, plazas o cuotas. En un proyecto nuevo empezamos por las reglas de disponibilidad, cancelación y cobro, y después decidimos qué reutilizar y qué desarrollar a medida.",
    },
    nextStep: "Cuéntanos cómo gestionas hoy las reservas y qué parte te cuesta más coordinar.",
  },
  {
    slug: "wms-almacen",
    kicker: "Aplicación de gestión",
    name: "Gestión de almacén",
    title: "Aplicación de gestión de almacén",
    intro:
      "Inventario, ubicaciones y movimientos en una sola aplicación, con permisos según el puesto y un lector de códigos para trabajar a pie de estantería.",
    figure: {
      layout: "con-movil",
      shot: capturas.movimientos,
      phone: capturas.rfEntrada,
      caption:
        "El libro de movimientos y el lector de códigos en el móvil. Capturas reales con datos de demostración y la marca difuminada.",
    },
    details: [
      {
        variant: "recorte",
        shot: {
          ...capturas.movimientos,
          alt: "Detalle del libro de movimientos: número de documento y tipo de cada movimiento, traspaso, salida o entrada",
        },
        // Captura a 2x: 600 px del original son 300 en la pantalla de origen.
        crop: { x: 608, y: 752, w: 600, h: 1040 },
        maxWidth: 320,
        label: "Libro de movimientos.",
        caption:
          "Entradas, salidas, traspasos y ajustes en un único libro, cada uno con su número de documento. El stock de cada referencia sale de sumar esos movimientos.",
      },
      {
        variant: "movil",
        shot: capturas.rfEntrada,
        label: "Lector de códigos.",
        caption:
          "La misma operativa a pie de estantería, con la pistola lectora o con la cámara del móvil. Sin instalar una aplicación aparte.",
      },
    ],
    problem:
      "Gestionar un almacén exige relacionar cada referencia con su ubicación y registrar cada cambio de existencias. Había que unir esa información para que el inventario y los movimientos vivieran en una misma herramienta.",
    built: {
      body:
        "Una aplicación web con inventario, ubicaciones, entradas y movimientos, y un lector de códigos para trabajar en el propio almacén. Cada persona accede solo a lo que le toca.",
      features: [
        "Productos y referencias",
        "Ubicaciones del almacén",
        "Entradas y recepciones",
        "Movimientos, traspasos y ajustes",
        "Recuentos de inventario",
        "Órdenes e informes",
        "Lector de códigos con pistola o con el móvil",
        "Permisos según el puesto",
      ],
    },
    decision: {
      body:
        "El stock no se escribe a mano: sale de sumar cada entrada y salida registrada. Si algo se anula, se añade un movimiento que lo corrige y el original se queda, así que siempre se puede ver cómo se llegó a la cifra actual.",
      note:
        "Antes de construir una herramienta de gestión conviene describir un recorrido concreto: qué entra, dónde se coloca, quién lo mueve y cómo se registra. Ese recorrido define una primera versión útil y las integraciones que de verdad necesita el negocio.",
    },
    nextStep: "Cuéntanos qué necesitas localizar, registrar o coordinar en tu día a día.",
  },
  {
    slug: "web-boda",
    kicker: "Web con automatización",
    name: "Web para un evento",
    title: "Web para un evento con confirmación de invitados",
    intro:
      "La información del evento, la confirmación de asistencia con las preferencias de cada invitado y un espacio privado para gestionarlo todo. En dos idiomas, y cada confirmación llega por email.",
    figure: {
      layout: "franja",
      shot: capturas.eventoCuenta,
      strip: 276,
      zoom: { x: 897, y: 2, w: 222, h: 38 },
      caption:
        "La cabecera con el selector de idioma y el botón de confirmar, sobre la cuenta atrás. Captura real con el monograma y la fecha difuminados.",
    },
    details: [
      {
        variant: "recorte",
        shot: {
          ...capturas.eventoCuenta,
          alt: "Detalle de la cuenta atrás de la web: días, horas, minutos y segundos que faltan para el evento",
        },
        crop: { x: 330, y: 50, w: 460, h: 180 },
        soloMovil: true,
        label: "Cuenta atrás.",
        caption:
          "La portada recuerda cuánto falta para el evento. La navegación y el botón de confirmar acompañan al invitado durante todo el recorrido de la página.",
      },
    ],
    problem:
      "La web combina la presentación del evento con una tarea concreta: recoger las confirmaciones y las preferencias de los invitados. Había que resolver las dos cosas sin que una estorbase a la otra.",
    built: {
      body:
        "La web de invitación, el flujo de confirmación con avisos por email, una galería colaborativa y un panel privado. La parte pública informa y recoge respuestas, el espacio privado permite gestionarlas.",
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
    kicker: "Web a medida",
    name: "Web para un programa de radio",
    title: "Web para un programa de radio con directo",
    intro:
      "Emisión en directo, archivo de programas y un reproductor que sigue sonando mientras navegas por la web. Con identidad propia y instalable como app en el móvil.",
    figure: {
      layout: "movil-delante",
      shot: capturas.radioPortada,
      phone: capturas.radioMovil,
      caption:
        "La web en el ordenador, con el reproductor fijo abajo, y en el móvil. Capturas reales con la marca y la portada difuminadas.",
    },
    details: [
      {
        variant: "movil",
        shot: capturas.radioMovil,
        soloMovil: true,
        label: "En el móvil.",
        caption: "La misma escucha en el teléfono, instalable como app desde el propio navegador.",
      },
    ],
    problem:
      "Había que reunir la identidad del programa, la emisión en directo y los contenidos archivados en una web propia. El audio forma parte central del recorrido por el sitio, no es un añadido.",
    built: {
      body:
        "La web con reproductor en directo, archivo histórico y la opción de instalarla como app en el móvil. El reproductor sigue sonando mientras cambias de página.",
      features: [
        "Emisión en directo",
        "Archivo de programas",
        "Galería histórica",
        "Reproductor que no se corta al cambiar de página",
        "Instalación como app en el móvil",
        "Identidad propia del programa",
      ],
    },
    decision: {
      body:
        "El reproductor no se corta al cambiar de página: se puede explorar el archivo sin dejar de escuchar. Esa decisión condiciona cómo está construida la web entera, no solo el reproductor.",
      note:
        "El origen de la emisión, la organización del archivo y el comportamiento del reproductor determinan buena parte del alcance. En un proyecto nuevo revisamos esas piezas junto con la experiencia móvil y la forma de publicar nuevos programas.",
    },
    nextStep: "Cuéntanos qué publicas y cómo quieres que tu audiencia lo encuentre y lo escuche.",
  },
  {
    slug: "asistente-ia-gestion-proyectos",
    kicker: "Aplicación con inteligencia artificial",
    name: "Asistente para la gestión de proyectos",
    title: "Asistente con IA para la gestión de proyectos",
    intro:
      "Un asistente que responde preguntas sobre los proyectos a partir de la documentación, el correo y las herramientas de trabajo, y enseña de dónde sale cada respuesta.",
    figure: {
      layout: "sola",
      shot: capturas.asistenteTraza,
      caption:
        "El asistente de gestión de proyectos con el recorrido de una respuesta: pasos, memoria, correo, mensajería y base de conocimiento. Captura real con el contenido difuminado.",
    },
    details: [],
    problem:
      "Preparar una reunión, explicar un retraso o valorar un cambio suele exigir revisar documentos, conversaciones, compromisos y tareas. La aplicación se ocupa de ese trabajo previo: lleva a cada consulta el contexto que importa y ordena una respuesta que la persona pueda revisar.",
    built: {
      body:
        "Una aplicación de conversación con historial y adjuntos, con dos asistentes, uno para la gestión de proyectos y otro para las dudas sobre el producto. Cada uno recibe instrucciones, fuentes y herramientas acordes con su función.",
      features: [
        "Consultar el conocimiento interno",
        "Preparar el seguimiento de un proyecto",
        "Analizar alternativas de una decisión",
        "Dar forma a una estimación",
        "Trabajar con PDF, documentos y hojas de cálculo",
        "Revisar las fuentes y los pasos de cada respuesta",
      ],
    },
    decision: {
      body:
        "El asistente propone y una persona confirma: prepara el trabajo, explica sus supuestos y señala lo que falta, pero la decisión la toma siempre una persona. Ver los pasos y las fuentes de cada respuesta ayuda a revisarla, aunque no garantiza por sí solo la exactitud de cada afirmación.",
      note:
        "Una primera versión puede centrarse en una tarea concreta: preparar el estado semanal de un proyecto, responder dudas internas o estructurar una estimación. El alcance define qué fuentes se pueden consultar, qué resultado espera la persona y cómo se revisa.",
    },
    nextStep:
      "Cuéntanos qué información tienes que reunir y qué respuesta o documento preparas con ella.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
