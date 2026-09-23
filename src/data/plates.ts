import { homeShots, type Shot } from "@/data/projects";

/**
 * Planos anotados: capturas reales con notas numeradas sobre las decisiones
 * que las hacen funcionar. Recortes y anclajes se escriben en píxeles de la
 * imagen original. El componente los convierte en porcentajes del recorte de
 * cada anchura, así que una nota se define una sola vez aunque el recorte
 * cambie entre móvil (por debajo de 1024 px) y escritorio.
 *
 * Convención de llamada de los planos: el anclaje es un punto en el borde del
 * elemento señalado y el cuadrado numerado se coloca a su lado (`side`), con
 * una línea de referencia, para no tapar el texto que prueba la nota.
 *
 * Las notas repiten hechos ya documentados en `projects.ts` y señalan algo que
 * se ve en el recorte. Ninguna afirma uso, clientes ni resultados.
 */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Ancho en pantalla de la caja del recorte, por tramo de anchura. */
export interface Box {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
}

export interface PlateView {
  shot: Shot;
  /** Texto alternativo del recorte, no de la imagen entera. */
  alt: string;
  /** Recorte por debajo de 1024 px. Sin él se usa el de escritorio. */
  mobile?: Rect;
  desktop: Rect;
  box: Box;
}

export type Side = "left" | "right" | "bottom" | "center";

export interface PlateNote {
  n: number;
  title: string;
  text: string;
  /** Vista sobre la que se coloca el marcador. */
  view: number;
  /** Anclaje en escritorio, en píxeles de la imagen original. */
  at: [number, number];
  /** Anclaje propio del recorte móvil, cuando el de escritorio no cae dentro. */
  mobileAt?: [number, number];
  /** Lado del anclaje en el que va el cuadrado. `center` solo sobre fondo vacío. */
  side: Side;
}

export interface TitleEntry {
  label: string;
  value: string;
  href?: string;
  /** Ocupa toda la fila del cajetín, por ejemplo un email. */
  wide?: boolean;
}

export interface Plate {
  num: string;
  slug: string;
  name: string;
  /** Color del propio producto: solo una muestra junto al rótulo. */
  scene: "padel" | "wms" | "radio" | "evento" | "papel";
  /** Qué datos enseña la captura. Cada proyecto dice lo suyo. */
  caption: string;
  /**
   * `overlay`: el móvil se apoya sobre la pantalla principal en escritorio.
   * `pair`: pantallas lado a lado, con vista partida si hay dos principales.
   * `single`: una sola pantalla.
   */
  layout: "overlay" | "pair" | "single";
  views: PlateView[];
  notes: PlateNote[];
  /** Cajetín: los datos del proyecto, como en el pie de un plano. */
  block: TitleEntry[];
}

const DEMO = "Captura real · Datos de demo";
const MOBILE = "calc(100vw - 52px)";
const FULL: Box = { mobile: MOBILE, tablet: "calc(100vw - 144px)", desktop: "calc(100vw - 160px)", wide: "1240px" };
const MAIN: Box = { mobile: MOBILE, tablet: "calc(76vw - 146px)", desktop: "calc(76vw - 146px)", wide: "920px" };
const SIDE: Box = { mobile: MOBILE, tablet: "calc(24vw - 46px)", desktop: "calc(24vw - 46px)", wide: "290px" };
const HALF: Box = { mobile: MOBILE, tablet: "calc(50vw - 100px)", desktop: "calc(50vw - 110px)", wide: "584px" };

export const padelPlate: Plate = {
  num: "01",
  slug: "plataforma-clubes-padel",
  name: "Padel Club OS",
  scene: "padel",
  caption: DEMO,
  layout: "overlay",
  views: [
    {
      shot: homeShots.padelRecepcion,
      alt: "Panel de Padel Club OS, recepción del día: tarjetas de reservas activas, participantes, cobrado hoy y pendiente, aviso de jornada cerrada y filtros por estado",
      desktop: { x: 0, y: 0, w: 1280, h: 596 },
      mobile: { x: 520, y: 300, w: 400, h: 236 },
      box: { mobile: MOBILE, tablet: "calc(66vw - 60px)", desktop: "calc(79vw - 100px)", wide: "660px" },
    },
    {
      shot: homeShots.padelPortal,
      alt: "Portal del jugador en el móvil: barra inferior con clases, inicio, reservar, jugadores y perfil",
      desktop: { x: 0, y: 0, w: 390, h: 884 },
      mobile: { x: 0, y: 740, w: 390, h: 144 },
      box: { mobile: MOBILE, tablet: "calc(34vw - 30px)", desktop: "calc(17vw - 20px)", wide: "140px" },
    },
  ],
  notes: [
    {
      n: 1,
      title: "El día en una pantalla",
      text: "Reservas, participantes y cobros de la jornada, con filtros por estado.",
      view: 0,
      at: [288, 381],
      mobileAt: [533, 381],
      side: "left",
    },
    {
      n: 2,
      title: "Cerrar no es definitivo",
      text: "La jornada se cierra desde recepción y puede reabrirse para corregir cobros o asistencias.",
      view: 0,
      at: [288, 491],
      mobileAt: [522, 491],
      side: "left",
    },
    {
      n: 3,
      title: "El portal, en el móvil",
      text: "Clases, reservas y perfil desde el navegador del móvil, sin instalar nada.",
      view: 1,
      at: [0, 822],
      side: "left",
    },
  ],
  block: [
    { label: "Proyecto", value: "Padel Club OS", href: "https://www.padelclubos.com" },
    { label: "Pantallas", value: "Recepción y portal del jugador" },
    { label: "Estado", value: "En producción" },
  ],
};

export const almacenPlate: Plate = {
  num: "02",
  slug: "wms-almacen",
  name: "Gestión de almacén",
  scene: "wms",
  caption: `${DEMO} · Marca difuminada`,
  layout: "pair",
  views: [
    {
      shot: homeShots.almacenMovimientos,
      alt: "Libro de movimientos del almacén: título, aviso de que las anulaciones generan movimientos que compensan y tabla con documento, tipo, fecha, usuario, motivo y estado",
      desktop: { x: 540, y: 190, w: 2660, h: 1353 },
      mobile: { x: 560, y: 352, w: 760, h: 700 },
      box: MAIN,
    },
    {
      shot: homeShots.almacenRf,
      alt: "Terminal RF en el móvil: destino, producto y cantidad, y la pantalla de escanear el producto",
      desktop: { x: 0, y: 130, w: 960, h: 1015 },
      mobile: { x: 0, y: 380, w: 960, h: 780 },
      box: SIDE,
    },
  ],
  notes: [
    {
      n: 1,
      title: "El stock no se toca a mano",
      text: "Se calcula con cada entrada y salida registrada. Si algo se anula, queda constancia y nada se borra.",
      view: 0,
      at: [594, 404],
      side: "left",
    },
    {
      n: 2,
      title: "Cada movimiento, con su documento",
      text: "Entradas, salidas, traspasos y ajustes quedan con número, fecha y usuario.",
      view: 0,
      at: [606, 793],
      side: "left",
    },
    {
      n: 3,
      title: "A pie de estantería",
      text: "Con la pistola lectora de códigos o con la cámara del móvil.",
      view: 1,
      at: [436, 752],
      side: "left",
    },
  ],
  block: [
    { label: "Proyecto", value: "Gestión de almacén" },
    { label: "Necesidad", value: "Saber qué hay, dónde está y quién lo ha movido." },
    { label: "Alcance", value: "Inventario, ubicaciones, movimientos y lectura de códigos. Cada persona ve solo lo que le toca." },
  ],
};

export const radioPlate: Plate = {
  num: "03",
  slug: "web-radio",
  name: "Web de radio",
  scene: "radio",
  caption: "Captura real · Marca y portada difuminadas",
  layout: "pair",
  /* Vista partida, como en un plano: la cabecera arriba y el reproductor
     abajo, sin la portada difuminada que queda en medio. */
  views: [
    {
      shot: homeShots.radioPortada,
      alt: "Cabecera de la web de radio: navegación, redes y botón En directo",
      desktop: { x: 380, y: 0, w: 916, h: 72 },
      mobile: { x: 936, y: 0, w: 360, h: 72 },
      box: MAIN,
    },
    {
      shot: homeShots.radioPortada,
      alt: "Reproductor fijo al pie de la web de radio: botón de reproducir y aviso para escuchar",
      desktop: { x: 0, y: 522, w: 916, h: 71 },
      mobile: { x: 0, y: 522, w: 360, h: 71 },
      box: MAIN,
    },
    {
      shot: homeShots.radioMovil,
      alt: "Tarjeta del reproductor en el móvil: reproducir, volumen y enlace a la emisora",
      desktop: { x: 30, y: 292, w: 455, h: 330 },
      box: SIDE,
    },
  ],
  notes: [
    {
      n: 1,
      title: "El directo, en la cabecera",
      text: "Un botón a la emisión en la navegación principal.",
      view: 0,
      at: [1165, 35],
      side: "right",
    },
    {
      n: 2,
      title: "La emisión no se corta",
      text: "El reproductor queda fijo abajo mientras se recorre la web.",
      view: 1,
      at: [600, 558],
      mobileAt: [310, 558],
      side: "center",
    },
    {
      n: 3,
      title: "El reproductor, en el móvil",
      text: "Reproducir y ajustar el volumen desde una tarjeta grande, a mano con el pulgar.",
      view: 2,
      at: [30, 450],
      side: "left",
    },
  ],
  block: [
    { label: "Proyecto", value: "Web de radio" },
    { label: "Necesidad", value: "Reunir el directo y los programas en un sitio propio." },
    { label: "Alcance", value: "Directo, archivo, galería histórica, reproductor que no se corta e instalación como app." },
  ],
};

export const eventoPlate: Plate = {
  num: "04",
  slug: "web-boda",
  name: "Web de evento",
  scene: "evento",
  caption: "Captura real · Monograma y fecha difuminados",
  layout: "single",
  views: [
    {
      shot: homeShots.eventoCuenta,
      alt: "Web del evento: navegación con selector de idioma ES y FR y botón Confirmar asistencia, y debajo la cuenta atrás",
      desktop: { x: 0, y: 0, w: 1120, h: 300 },
      mobile: { x: 540, y: 0, w: 580, h: 200 },
      box: FULL,
    },
  ],
  notes: [
    {
      n: 1,
      title: "Confirmar, siempre a mano",
      text: "El botón de confirmar asistencia acompaña al invitado en la cabecera de toda la página.",
      view: 0,
      at: [1036, 34],
      side: "bottom",
    },
    {
      n: 2,
      title: "En dos idiomas",
      text: "Español y francés, con el cambio de idioma en la misma cabecera.",
      view: 0,
      at: [945, 30],
      side: "bottom",
    },
  ],
  block: [
    { label: "Proyecto", value: "Web de evento" },
    { label: "Necesidad", value: "Reunir la información del evento y las respuestas de los invitados en un mismo sitio." },
    { label: "Alcance", value: "Confirmaciones, preferencias, avisos por email, peticiones musicales y panel privado." },
  ],
};

export const asistentePlate: Plate = {
  num: "05",
  slug: "asistente-ia-gestion-proyectos",
  name: "Asistente de IA",
  scene: "papel",
  caption: "Captura real · Conversaciones y nombres difuminados",
  layout: "single",
  views: [
    {
      shot: homeShots.asistente,
      alt: "Asistente de IA: barra lateral con el agente de gestión de proyectos y el de producto, traza de una respuesta con 49 pasos y sus fuentes, y aviso de solo lectura. El contenido aparece difuminado",
      desktop: { x: 0, y: 0, w: 1343, h: 638 },
      mobile: { x: 0, y: 40, w: 1040, h: 580 },
      box: FULL,
    },
  ],
  notes: [
    {
      n: 1,
      title: "Dos agentes",
      text: "Uno para la gestión de proyectos y otro para el conocimiento de producto.",
      view: 0,
      at: [193, 100],
      side: "right",
    },
    {
      n: 2,
      title: "Cada respuesta enseña su traza",
      text: "Los pasos y las fuentes consultadas: memoria, correo, mensajería y conocimiento.",
      view: 0,
      at: [500, 140],
      side: "left",
    },
    {
      n: 3,
      title: "Nada se envía sin confirmar",
      text: "El agente propone y explica. La decisión se queda en el equipo.",
      view: 0,
      at: [745, 597],
      side: "left",
    },
  ],
  block: [
    { label: "Proyecto", value: "Asistente de IA" },
    { label: "Necesidad", value: "Reunir contexto disperso para preparar seguimiento, decisiones y propuestas." },
    { label: "Alcance", value: "Dos agentes, adjuntos y traza de fuentes y herramientas, según configuración y permisos." },
  ],
};

/**
 * Evento y asistente en la portada: una franja de su interfaz con una sola
 * nota, en el mismo formato de lámina.
 */
export const strips: Plate[] = [
  {
    ...eventoPlate,
    views: [
      {
        ...eventoPlate.views[0],
        alt: "Cabecera de la web del evento: galería, selector de idioma ES y FR, botón Confirmar asistencia y el inicio de la cuenta atrás",
        desktop: { x: 540, y: 0, w: 580, h: 200 },
        mobile: { x: 540, y: 0, w: 580, h: 200 },
        box: HALF,
      },
    ],
    notes: [{ ...eventoPlate.notes[0], n: 1 }],
  },
  {
    ...asistentePlate,
    views: [
      {
        ...asistentePlate.views[0],
        alt: "Traza de una respuesta del asistente: 49 pasos, 488 segundos y las fuentes memoria, correo, mensajería y conocimiento. El resto aparece difuminado",
        desktop: { x: 470, y: 104, w: 600, h: 200 },
        mobile: { x: 470, y: 104, w: 600, h: 200 },
        box: HALF,
      },
    ],
    notes: [{ ...asistentePlate.notes[1], n: 1 }],
  },
];

const casePlates = [padelPlate, almacenPlate, radioPlate, eventoPlate, asistentePlate];

/** Láminas por caso: las fichas las usan como figura principal. */
export const platesBySlug: Record<string, Plate | undefined> = Object.fromEntries(
  casePlates.map((plate) => [plate.slug, plate])
);

export const allPlates = [...casePlates, ...strips];
