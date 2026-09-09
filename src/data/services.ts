export interface Service {
  id: string;
  index: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    id: "software-a-medida",
    index: "S.01",
    title: "Software a medida",
    description:
      "Cuando el Excel se queda corto y el ERP no llega, construimos la pieza que falta. Plataformas de gestión y herramientas internas alrededor de tus procesos.",
  },
  {
    id: "aplicaciones-web",
    index: "S.02",
    title: "Aplicaciones web",
    description:
      "Del primer prototipo navegable a la plataforma en producción con la misma base de código. Portales de cliente, áreas privadas y paneles de operación.",
  },
  {
    id: "webs-a-medida",
    index: "S.03",
    title: "Webs a medida",
    description:
      "Webs corporativas, personales o de evento con diseño propio y sin plantillas. Rápidas, cuidadas y pensadas desde cero para cada proyecto.",
  },
  {
    id: "automatizacion",
    index: "S.04",
    title: "Automatización de procesos",
    description:
      "Si tu equipo copia datos de un sitio a otro, ahí hay un proceso que automatizar. Menos trabajo manual, menos errores y trazabilidad completa.",
  },
  {
    id: "inteligencia-artificial",
    index: "S.05",
    title: "Inteligencia artificial",
    description:
      "IA aplicada a casos concretos, como leer documentos o responder sobre tu conocimiento interno. Te decimos dónde aporta y también dónde no.",
  },
  {
    id: "integraciones",
    index: "S.06",
    title: "Integraciones y APIs",
    description:
      "Tus sistemas hablando entre sí. Conectamos ERPs, CRMs y plataformas externas con errores controlados y datos consistentes.",
  },
  {
    id: "consultoria",
    index: "S.07",
    title: "Consultoría tecnológica",
    description:
      "Decidir qué construir antes de escribir código. Analizamos el problema y trazamos una hoja de ruta realista por fases.",
  },
];

/** Las tres puertas de entrada a la oferta; sus IDs también contextualizan el contacto. */
export const serviceNeeds = [
  {
    id: "operativa",
    index: "01",
    problem: "Tu gestión necesita algo más",
    title: "Pon orden en tu operativa",
    description:
      "Cuando hojas de cálculo, mensajes y herramientas sueltas ya no bastan. Una aplicación que reúna lo que necesitas y encaje en cómo trabajas.",
    example: "Gestión de almacén, reservas, portales de cliente y paneles internos.",
    serviceIds: ["software-a-medida", "aplicaciones-web"],
    cta: "Hablemos de tu gestión",
  },
  {
    id: "automatizacion",
    index: "02",
    problem: "Repites tareas entre herramientas",
    title: "Conecta y automatiza",
    description:
      "Si copias datos o repites el mismo trabajo cada día, revisamos el proceso. Conectamos tus sistemas y aplicamos IA cuando ayuda a resolverlo.",
    example: "Conectar un CRM, procesar documentos o sincronizar información.",
    serviceIds: ["automatizacion", "integraciones", "inteligencia-artificial"],
    cta: "Hablemos de tus procesos",
  },
  {
    id: "web",
    index: "03",
    problem: "Tu web no explica lo que aportas",
    title: "Dale a tu negocio su web",
    description:
      "Una web con diseño propio, información clara y un siguiente paso fácil. Para que quien llegue entienda tu propuesta y pueda contactar contigo.",
    example: "Webs corporativas, proyectos personales y páginas de eventos.",
    serviceIds: ["webs-a-medida"],
    cta: "Hablemos de tu web",
  },
] as const;
