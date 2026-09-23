import { homeShots, type Shot } from "@/data/projects";

/**
 * Planos anotados: capturas reales con notas numeradas sobre las decisiones
 * que las hacen funcionar. Recortes, zonas y marcadores se escriben en
 * píxeles de la imagen original. El componente los convierte en porcentajes
 * del recorte de cada anchura, así que un marcador se define una sola vez
 * aunque el recorte cambie entre móvil y escritorio.
 *
 * Las notas repiten hechos ya documentados en `projects.ts`. Ninguna afirma
 * uso, clientes ni resultados.
 */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlateView {
  shot: Shot;
  /** Recorte por debajo de 1024 px. Sin él se usa el de escritorio. */
  mobile?: Rect;
  desktop: Rect;
  /** Ancho que ocupa el recorte en pantalla, para `sizes`. */
  sizes: string;
}

export interface PlateNote {
  n: number;
  title: string;
  text: string;
  /** Vista sobre la que se coloca el marcador. */
  view: number;
  /** Centro del marcador, en píxeles de la imagen original. */
  at: [number, number];
}

export interface TitleEntry {
  label: string;
  value: string;
  href?: string;
}

export interface Plate {
  num: string;
  slug: string;
  name: string;
  /** Color del propio producto: solo vive dentro de su escenario. */
  scene: "padel" | "wms" | "radio";
  /** `overlay`: el móvil se apoya sobre la pantalla principal. */
  layout?: "overlay" | "pair";
  views: PlateView[];
  notes: PlateNote[];
  /** Cajetín: los datos del proyecto, como en el pie de un plano. */
  block: TitleEntry[];
}

export const padelPlate: Plate = {
  num: "01",
  slug: "plataforma-clubes-padel",
  name: "Padel Club OS",
  scene: "padel",
  layout: "overlay",
  views: [
    {
      shot: homeShots.padelRecepcion,
      desktop: { x: 0, y: 0, w: 1280, h: 596 },
      mobile: { x: 262, y: 128, w: 540, h: 410 },
      sizes: "(min-width: 1440px) 820px, (min-width: 1280px) 57vw, (min-width: 1024px) 90vw, 240vw",
    },
    {
      shot: homeShots.padelPortal,
      desktop: { x: 0, y: 0, w: 390, h: 884 },
      mobile: { x: 0, y: 500, w: 390, h: 384 },
      sizes: "(min-width: 1024px) 150px, 100vw",
    },
  ],
  notes: [
    {
      n: 1,
      title: "El día en una pantalla",
      text: "Reservas, participantes y cobros de la jornada, con filtros por estado.",
      view: 0,
      at: [288, 323],
    },
    {
      n: 2,
      title: "Cerrar no es definitivo",
      text: "La jornada se cierra desde recepción y puede reabrirse para corregir cobros o asistencias.",
      view: 0,
      at: [288, 491],
    },
    {
      n: 3,
      title: "El jugador, en su móvil",
      text: "Reserva y consulta sus clases desde el navegador, sin instalar nada.",
      view: 1,
      at: [0, 806],
    },
  ],
  block: [
    { label: "Proyecto", value: "Padel Club OS", href: "https://www.padelclubos.com" },
    { label: "Pantallas", value: "Recepción y portal del jugador" },
    { label: "Estado", value: "En producción" },
    { label: "Datos", value: "Captura real, datos de demo" },
  ],
};

export const almacenPlate: Plate = {
  num: "02",
  slug: "wms-almacen",
  name: "Gestión de almacén",
  scene: "wms",
  views: [
    {
      shot: homeShots.almacenMovimientos,
      desktop: { x: 540, y: 190, w: 2660, h: 1400 },
      mobile: { x: 560, y: 190, w: 960, h: 900 },
      sizes: "(min-width: 1440px) 900px, (min-width: 1024px) 63vw, 150vw",
    },
    {
      shot: homeShots.almacenRf,
      desktop: { x: 0, y: 130, w: 960, h: 1230 },
      sizes: "(min-width: 1024px) 230px, 40vw",
    },
  ],
  notes: [
    {
      n: 1,
      title: "El stock sale del libro",
      text: "No se edita a mano: es el resultado de los apuntes. Anular genera un apunte que compensa el original.",
      view: 0,
      at: [596, 404],
    },
    {
      n: 2,
      title: "Cada apunte, con su documento",
      text: "Entradas, salidas, traspasos y ajustes quedan con número, fecha y usuario.",
      view: 0,
      at: [596, 760],
    },
    {
      n: 3,
      title: "A pie de estantería",
      text: "El terminal RF funciona con escáner o con la cámara del móvil.",
      view: 1,
      at: [300, 752],
    },
  ],
  block: [
    { label: "Proyecto", value: "Gestión de almacén" },
    { label: "Necesidad", value: "Saber qué hay, dónde está y quién lo ha movido." },
    { label: "Alcance", value: "Inventario, ubicaciones, movimientos, permisos por rol y terminal RF." },
    { label: "Datos", value: "Captura real, datos de demo, marca difuminada" },
  ],
};

export const radioPlate: Plate = {
  num: "03",
  slug: "web-radio",
  name: "Web de radio",
  scene: "radio",
  /* Vista partida, como en un plano: la cabecera arriba y el reproductor
     abajo, sin la portada difuminada que queda en medio. */
  views: [
    {
      shot: homeShots.radioPortada,
      desktop: { x: 380, y: 0, w: 916, h: 72 },
      mobile: { x: 700, y: 0, w: 596, h: 72 },
      sizes: "(min-width: 1440px) 900px, (min-width: 1024px) 63vw, 200vw",
    },
    {
      shot: homeShots.radioPortada,
      desktop: { x: 0, y: 522, w: 916, h: 71 },
      mobile: { x: 0, y: 522, w: 596, h: 71 },
      sizes: "(min-width: 1440px) 900px, (min-width: 1024px) 63vw, 200vw",
    },
    {
      shot: homeShots.radioMovil,
      desktop: { x: 0, y: 260, w: 514, h: 400 },
      sizes: "(min-width: 1024px) 280px, 45vw",
    },
  ],
  notes: [
    {
      n: 1,
      title: "El directo, en la cabecera",
      text: "Un acceso directo a la emisión en la navegación principal.",
      view: 0,
      at: [1182, 36],
    },
    {
      n: 2,
      title: "La emisión no se corta",
      text: "El reproductor queda fijo abajo mientras se recorre la web.",
      view: 1,
      at: [34, 558],
    },
    {
      n: 3,
      title: "Instalable como app",
      text: "En el móvil se añade a la pantalla de inicio desde el propio navegador.",
      view: 2,
      at: [70, 490],
    },
  ],
  block: [
    { label: "Proyecto", value: "Web de radio" },
    { label: "Necesidad", value: "Reunir el directo y los programas en un sitio propio." },
    { label: "Alcance", value: "Directo, archivo, galería histórica, reproductor persistente e instalación como app." },
    { label: "Datos", value: "Captura real, marca y portada difuminadas" },
  ],
};

/** Los dos trabajos que la portada presenta con una franja de su interfaz. */
export const strips = [
  {
    num: "04",
    slug: "web-boda",
    shot: homeShots.eventoCuenta,
    crop: { x: 330, y: 56, w: 460, h: 150 } satisfies Rect,
    note: "Confirmar asistencia está siempre en la navegación.",
  },
  {
    num: "05",
    slug: "asistente-ia-gestion-proyectos",
    shot: homeShots.asistente,
    crop: { x: 500, y: 121, w: 400, h: 36 } satisfies Rect,
    note: "Cada respuesta enseña sus pasos y las fuentes consultadas.",
  },
] as const;

/** Láminas por caso: las fichas las usan como figura principal. */
export const platesBySlug: Record<string, Plate | undefined> = Object.fromEntries(
  [padelPlate, almacenPlate, radioPlate].map((plate) => [plate.slug, plate])
);
