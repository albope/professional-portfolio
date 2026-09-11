/**
 * Las tres puertas de entrada a la oferta. Los identificadores coinciden con
 * `CONTACT_NEEDS`: el enlace de cada fila llega al formulario con la necesidad
 * ya seleccionada.
 */
export interface ServiceNeed {
  id: "operativa" | "automatizacion" | "web";
  /** Situación del visitante, no el nombre del servicio. */
  situation: string;
  built: string;
  builtShort: string;
  examples: string;
  examplesShort: string;
  cta: string;
}

export const serviceNeeds: ServiceNeed[] = [
  {
    id: "operativa",
    situation: "Tu gestión vive en hojas de cálculo, mensajes y herramientas sueltas.",
    built:
      "Una aplicación que reúna lo que necesitas y encaje en cómo trabajas: gestión, reservas, portales de cliente o paneles internos.",
    builtShort: "Una aplicación que reúna lo que necesitas y encaje en cómo trabajas.",
    examples: "Gestión de almacén · Plataforma de reservas · Portal de socios",
    examplesShort: "Gestión de almacén · Reservas · Portales de socios",
    cta: "Hablemos de tu gestión",
  },
  {
    id: "automatizacion",
    situation: "Copias datos de un sitio a otro y repites el mismo trabajo cada día.",
    built:
      "Revisamos el proceso, conectamos tus sistemas y aplicamos IA cuando ayuda a resolverlo. Te decimos dónde aporta y también dónde no.",
    builtShort:
      "Revisamos el proceso, conectamos tus sistemas y aplicamos IA cuando ayuda. Te decimos dónde aporta y dónde no.",
    examples: "Conectar un CRM · Procesar documentos · Sincronizar información entre sistemas",
    examplesShort: "Conectar un CRM · Procesar documentos · Sincronizar información",
    cta: "Hablemos de tus procesos",
  },
  {
    id: "web",
    situation: "Tu web no explica lo que aportas ni facilita el siguiente paso.",
    built:
      "Una web con diseño propio, información clara y un contacto fácil, para que quien llegue entienda tu propuesta y pueda escribirte.",
    builtShort: "Una web con diseño propio, información clara y un contacto fácil.",
    examples: "Webs corporativas · Proyectos personales · Páginas de evento",
    examplesShort: "Webs corporativas · Proyectos personales · Páginas de evento",
    cta: "Hablemos de tu web",
  },
];
