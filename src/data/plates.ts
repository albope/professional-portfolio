import { homeShots, type Shot } from "@/data/projects";

/**
 * Planos anotados: capturas reales con notas numeradas sobre las decisiones
 * que las hacen funcionar. Recortes y anclajes se escriben en píxeles de la
 * imagen original. El componente los convierte en porcentajes del recorte de
 * cada anchura, así que una nota se define una sola vez aunque el recorte
 * cambie entre móvil (por debajo de 1024 px) y escritorio.
 *
 * Convención de llamada de los planos: el anclaje es un punto en el borde del
 * elemento señalado y el cuadrado numerado vive en el margen de la hoja, del
 * lado que indica `side`, con una línea de referencia hasta el anclaje. Así
 * no tapa el texto que prueba la nota.
 *
 * Por debajo de 1024 px la hoja se apila y cada nota puede cambiar de vista,
 * de anclaje y de lado (`mobileView`, `mobileAt`, `mobileSide`, a la
 * izquierda por defecto). Una vista con `only` se ve en una sola composición.
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
  /** Recorte por debajo de 768 px. Sin él se usa el de escritorio. */
  mobile?: Rect;
  /**
   * Recorte de 768 a 1023 px, en la hoja apilada. Sin él se usa el móvil.
   * Debe contener los anclajes del móvil.
   */
  tablet?: Rect;
  desktop: Rect;
  box: Box;
  /** Vista de una sola composición: la apilada (`mobile`) o la de escritorio. */
  only?: "mobile" | "desktop";
  /** Ancho máximo en px, para no ampliar capturas tomadas a 1x. */
  max?: number;
  /** Ancho máximo en px por debajo de 768. */
  mobileMax?: number;
  /** Ancho máximo en px de 768 a 1023. */
  tabletMax?: number;
}

export type Side = "left" | "right" | "top" | "bottom";

export interface PlateNote {
  n: number;
  title: string;
  text: string;
  /** Vista sobre la que se coloca el marcador. */
  view: number;
  /** Anclaje en escritorio, en píxeles de la imagen original. */
  at: [number, number];
  /** Margen de la hoja en el que va el cuadrado. */
  side: Side;
  /** Vista de la composición apilada, si no es la misma. */
  mobileView?: number;
  /** Anclaje propio del recorte móvil, cuando el de escritorio no cae dentro. */
  mobileAt?: [number, number];
  /** Lado en la composición apilada. Por defecto, la izquierda. */
  mobileSide?: Side;
  /** `false` cuando el recorte apilado no alcanza lo que señala la nota. */
  mobileMarker?: false;
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
   * `overlay`: el móvil se apoya en una esquina vacía de la pantalla principal.
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
/* Ancho interior de la hoja por tramo: en móvil va a sangre con 40 + 16 px de
   margen; en tablet y escritorio, dentro del lienzo con 40 px por lado. */
const MOBILE = "calc(100vw - 56px)";
const STACKED = "calc(100vw - 162px)";
const FULL: Box = { mobile: MOBILE, tablet: STACKED, desktop: STACKED, wide: "1238px" };
const MAIN: Box = { mobile: MOBILE, tablet: STACKED, desktop: "calc((100vw - 202px) * 0.762)", wide: "913px" };
const SIDE: Box = { mobile: MOBILE, tablet: "360px", desktop: "calc((100vw - 202px) * 0.238)", wide: "285px" };
const HALF: Box = { mobile: MOBILE, tablet: STACKED, desktop: "calc(50vw - 134px)", wide: "566px" };

export const padelPlate: Plate = {
  num: "01",
  slug: "plataforma-clubes-padel",
  name: "Padel Club OS",
  scene: "padel",
  caption: DEMO,
  layout: "overlay",
  /* La academia enseña actividad (una clase, su alumna, la asistencia) y el
     portal del móvil repite esa misma clase. En móvil solo va el portal, a
     escala casi 1:1. */
  views: [
    {
      shot: homeShots.padelAcademia,
      alt: "Panel de Padel Club OS, módulo de academia: pestañas de clases y asistencia, grupos y matrículas, profesores, cuotas y recuperaciones, y una clase programada con su profesora, su alumna y el botón Pasar asistencia",
      desktop: { x: 200, y: 250, w: 1080, h: 470 },
      box: { mobile: MOBILE, tablet: STACKED, desktop: STACKED, wide: "1080px" },
      only: "desktop",
      max: 1080,
    },
    {
      shot: homeShots.padelPortal,
      alt: "Portal de Padel Club OS en el móvil: pestañas de la academia, una clase programada con su alumna y el botón Pasar asistencia, y la barra inferior con clases, inicio, reservar, jugadores y perfil",
      desktop: { x: 0, y: 500, w: 390, h: 384 },
      mobile: { x: 0, y: 330, w: 390, h: 554 },
      box: { mobile: MOBILE, tablet: "360px", desktop: "180px", wide: "200px" },
      mobileMax: 390,
    },
  ],
  notes: [
    {
      n: 1,
      title: "Toda la academia en un módulo",
      text: "Clases y asistencia, grupos y matrículas, cuotas y recuperaciones en el mismo sitio.",
      view: 0,
      at: [288, 283],
      side: "left",
      mobileView: 1,
      mobileAt: [20, 356],
    },
    {
      n: 2,
      title: "La asistencia, desde la clase",
      text: "Cada clase con su horario, pista y profesora. La asistencia se pasa desde la misma ficha.",
      view: 0,
      at: [288, 543],
      side: "left",
      mobileView: 1,
      mobileAt: [16, 553],
    },
    {
      n: 3,
      title: "El portal, en el móvil",
      text: "Clases, reservas y perfil desde el navegador del móvil, sin instalar nada.",
      view: 1,
      at: [390, 832],
      side: "right",
      mobileAt: [4, 832],
    },
  ],
  block: [
    { label: "Proyecto", value: "Padel Club OS", href: "https://www.padelclubos.com" },
    { label: "Pantallas", value: "Academia y portal en el móvil" },
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
      alt: "Libro de movimientos del almacén: tabla con documento, tipo, fecha, usuario, motivo, líneas y estado Contabilizado en cada fila",
      desktop: { x: 540, y: 190, w: 2660, h: 1353 },
      mobile: { x: 600, y: 740, w: 640, h: 540 },
      tablet: { x: 560, y: 190, w: 1560, h: 1090 },
      box: MAIN,
    },
    {
      shot: homeShots.almacenRf,
      alt: "Terminal de lectura en el móvil: destino, producto y cantidad, y la pantalla de escanear el producto",
      desktop: { x: 0, y: 130, w: 960, h: 1015 },
      mobile: { x: 0, y: 380, w: 960, h: 780 },
      box: SIDE,
    },
  ],
  notes: [
    {
      n: 1,
      title: "Cada movimiento, con su documento",
      text: "Entradas, salidas, traspasos y ajustes quedan con número, fecha y usuario.",
      view: 0,
      at: [646, 794],
      side: "left",
    },
    {
      n: 2,
      title: "El stock no se escribe a mano",
      text: "Sale de sumar cada entrada y salida. Si algo se anula, se añade un movimiento que lo corrige y el original se queda.",
      view: 0,
      at: [3052, 1012],
      side: "right",
      /* El recorte apilado se queda en documento y tipo: la columna Estado
         no cabe a una escala legible. La nota sigue en la lista. */
      mobileMarker: false,
    },
    {
      n: 3,
      title: "A pie de estantería",
      text: "Con la pistola lectora de códigos o con la cámara del móvil.",
      view: 1,
      at: [520, 752],
      side: "right",
      mobileAt: [440, 752],
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
      mobile: { x: 1000, y: 0, w: 296, h: 72 },
      tablet: { x: 740, y: 0, w: 556, h: 72 },
      box: MAIN,
      tabletMax: 556,
    },
    {
      shot: homeShots.radioPortada,
      alt: "Reproductor fijo al pie de la web de radio: botón de reproducir, aviso para escuchar y, en escritorio, volumen",
      desktop: { x: 0, y: 522, w: 916, h: 71 },
      mobile: { x: 0, y: 522, w: 296, h: 71 },
      tablet: { x: 0, y: 522, w: 556, h: 71 },
      box: MAIN,
      tabletMax: 556,
    },
    {
      shot: homeShots.radioMovil,
      alt: "Tarjeta del reproductor en el móvil: botón grande de reproducir, volumen y enlace a la emisora",
      desktop: { x: 30, y: 292, w: 455, h: 330 },
      box: SIDE,
    },
  ],
  notes: [
    {
      n: 1,
      title: "El directo, en la cabecera",
      text: "El botón En directo, en el menú, lleva a la emisión.",
      view: 0,
      at: [1166, 35],
      side: "right",
      mobileAt: [1047, 46],
    },
    {
      n: 2,
      title: "La emisión no se corta",
      text: "El reproductor queda fijo abajo mientras se recorre la web.",
      view: 1,
      at: [2, 561],
      side: "left",
    },
    {
      n: 3,
      title: "El reproductor, en el móvil",
      text: "Reproducir y ajustar el volumen desde una tarjeta con botones grandes.",
      view: 2,
      at: [485, 457],
      side: "right",
      mobileAt: [30, 490],
    },
  ],
  block: [
    { label: "Proyecto", value: "Web de radio" },
    { label: "Necesidad", value: "Reunir el directo y los programas en un sitio propio." },
    { label: "Alcance", value: "Directo, archivo, galería histórica, reproductor que no se corta e instalación como app." },
  ],
};

const eventoNotes: PlateNote[] = [
  {
    n: 1,
    title: "Confirmar, siempre a la vista",
    text: "El botón de confirmar asistencia acompaña al invitado en la cabecera de toda la página.",
    view: 0,
    at: [1096, 22],
    side: "right",
    mobileAt: [1037, 33],
    mobileSide: "bottom",
  },
  {
    n: 2,
    title: "En dos idiomas",
    text: "Español y francés, con el cambio de idioma en la misma cabecera.",
    view: 0,
    at: [944, 12],
    side: "top",
    mobileAt: [921, 22],
  },
];

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
      alt: "Web del evento: navegación con selector de idioma ES y FR y botón Confirmar asistencia, y debajo la cuenta atrás. En móvil, solo la parte derecha de la navegación",
      desktop: { x: 0, y: 0, w: 1120, h: 240 },
      mobile: { x: 860, y: 0, w: 260, h: 46 },
      tablet: { x: 452, y: 0, w: 668, h: 200 },
      box: FULL,
      max: 1120,
      mobileMax: 260,
      tabletMax: 668,
    },
  ],
  notes: eventoNotes,
  block: [
    { label: "Proyecto", value: "Web de evento" },
    { label: "Necesidad", value: "Reunir la información del evento y las respuestas de los invitados en un mismo sitio." },
    { label: "Alcance", value: "Confirmaciones, preferencias, avisos por email, peticiones musicales y panel privado." },
  ],
};

/* En escritorio, la pantalla entera. En la hoja apilada, tres detalles a
   escala casi 1:1 unidos por líneas de rotura: agentes, traza y confirmación. */
export const asistentePlate: Plate = {
  num: "05",
  slug: "asistente-ia-gestion-proyectos",
  name: "Asistente de IA",
  scene: "papel",
  caption: "Captura real · Conversaciones, nombres y herramientas difuminados",
  layout: "single",
  views: [
    {
      shot: homeShots.asistente,
      alt: "Asistente de IA: barra lateral con el agente de gestión de proyectos y el de producto, traza de una respuesta con 49 pasos y sus fuentes, y aviso de que nada se envía sin confirmación. El contenido aparece difuminado",
      desktop: { x: 0, y: 0, w: 1343, h: 638 },
      box: FULL,
      only: "desktop",
    },
    {
      shot: homeShots.asistente,
      alt: "Barra lateral del asistente: agente de gestión de proyectos y agente de producto",
      desktop: { x: 10, y: 46, w: 185, h: 90 },
      box: FULL,
      only: "mobile",
      mobileMax: 185,
      tabletMax: 185,
    },
    {
      shot: homeShots.asistente,
      alt: "Traza de una respuesta: 49 pasos, 488 segundos y las fuentes consultadas",
      desktop: { x: 530, y: 124, w: 300, h: 30 },
      tablet: { x: 528, y: 118, w: 502, h: 40 },
      box: FULL,
      only: "mobile",
      mobileMax: 300,
      tabletMax: 502,
    },
    {
      shot: homeShots.asistente,
      alt: "Pie del chat: nada se envía sin tu confirmación, junto al botón de enviar",
      desktop: { x: 740, y: 582, w: 285, h: 32 },
      tablet: { x: 528, y: 560, w: 502, h: 60 },
      box: FULL,
      only: "mobile",
      mobileMax: 285,
      tabletMax: 502,
    },
  ],
  notes: [
    {
      n: 1,
      title: "Dos agentes",
      text: "Uno para la gestión de proyectos y otro para el conocimiento de producto.",
      view: 0,
      at: [20, 85],
      side: "left",
      mobileView: 1,
    },
    {
      n: 2,
      title: "Cada respuesta dice de dónde sale",
      text: "Los pasos y las fuentes de cada respuesta: memoria, correo, mensajería y conocimiento.",
      view: 0,
      at: [1022, 138],
      side: "right",
      mobileView: 2,
      mobileAt: [536, 138],
    },
    {
      n: 3,
      title: "Nada se envía sin confirmar",
      text: "El agente propone y explica. La decisión se queda en el equipo.",
      view: 0,
      at: [1020, 597],
      side: "right",
      mobileView: 3,
      mobileAt: [746, 597],
    },
  ],
  block: [
    { label: "Proyecto", value: "Asistente de IA" },
    { label: "Necesidad", value: "Reunir contexto disperso para preparar seguimiento, decisiones y propuestas." },
    { label: "Alcance", value: "Dos agentes, adjuntos y los pasos y las fuentes de cada respuesta." },
  ],
};

/**
 * Evento y asistente en la portada: una franja de su interfaz en el mismo
 * formato de hoja, desde 768 px. En el móvil quedan el rótulo y la nota.
 */
export const strips: Plate[] = [
  {
    ...eventoPlate,
    caption: "Captura real",
    views: [
      {
        shot: homeShots.eventoCuenta,
        alt: "Cabecera de la web del evento: navegación, selector de idioma ES y FR, botón Confirmar asistencia y el inicio de la cuenta atrás",
        desktop: { x: 452, y: 0, w: 668, h: 200 },
        box: HALF,
        max: 668,
      },
    ],
    notes: [{ ...eventoNotes[0], mobileAt: undefined, mobileSide: "right" }],
  },
  {
    ...asistentePlate,
    caption: "Captura real · Respuesta difuminada",
    /* Sin el avatar oscuro de la respuesta, que junto al marcador se leía
       como un segundo cuadrado. */
    views: [
      {
        shot: homeShots.asistente,
        alt: "Traza de una respuesta del asistente: 49 pasos, 488 segundos y las fuentes consultadas",
        desktop: { x: 528, y: 118, w: 502, h: 40 },
        box: HALF,
        max: 502,
      },
      {
        shot: homeShots.asistente,
        alt: "Pie del chat del asistente: nada se envía sin tu confirmación, junto al botón de enviar",
        desktop: { x: 528, y: 560, w: 502, h: 60 },
        box: HALF,
        max: 502,
      },
    ],
    notes: [
      { n: 1, title: "Cada respuesta dice de dónde sale", text: "Los pasos y las fuentes de cada respuesta.", view: 0, at: [536, 138], side: "left" },
      { n: 2, title: "Nada se envía sin confirmar", text: "El agente propone. La decisión se queda en el equipo.", view: 1, at: [1020, 597], side: "right", mobileSide: "right" },
    ],
  },
];

const casePlates = [padelPlate, almacenPlate, radioPlate, eventoPlate, asistentePlate];

/** Láminas por caso: las fichas las usan como figura principal. */
export const platesBySlug: Record<string, Plate | undefined> = Object.fromEntries(
  casePlates.map((plate) => [plate.slug, plate])
);

export const allPlates = [...casePlates, ...strips];
