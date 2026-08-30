export interface Service {
  id: string;
  index: string;
  title: string;
  description: string;
  bullets: string[];
}

export const services: Service[] = [
  {
    id: "software-a-medida",
    index: "01",
    title: "Software a medida",
    description:
      "Aplicaciones y plataformas construidas alrededor de los procesos de tu empresa, no de las limitaciones de una herramienta estándar. Cuando el Excel se queda corto y el ERP no llega, construimos la pieza que falta.",
    bullets: [
      "Análisis de procesos y definición funcional",
      "Plataformas de gestión y back-office",
      "Herramientas internas para equipos",
      "Evolución y mantenimiento continuo",
    ],
  },
  {
    id: "aplicaciones-web",
    index: "02",
    title: "Aplicaciones web",
    description:
      "Productos digitales rápidos, escalables y preparados para crecer. Del primer prototipo navegable a la plataforma en producción, con la misma base de código.",
    bullets: [
      "Productos digitales y MVPs",
      "Portales de cliente y áreas privadas",
      "Dashboards y paneles operacionales",
      "Rendimiento y experiencia cuidados",
    ],
  },
  {
    id: "webs-a-medida",
    index: "03",
    title: "Webs a medida",
    description:
      "No solo software: también diseñamos y construimos webs con identidad propia. Corporativas, personales, de evento o de producto — pensadas desde cero para cada proyecto, sin plantillas.",
    bullets: [
      "Webs corporativas para pymes",
      "Webs personales, de evento y de marca",
      "Diseño propio + desarrollo, sin plantillas",
      "SEO, rendimiento y analítica",
    ],
  },
  {
    id: "automatizacion",
    index: "04",
    title: "Automatización de procesos",
    description:
      "Menos trabajo manual y menos errores: software e integraciones que eliminan tareas repetitivas. Si tu equipo copia datos de un sitio a otro, ahí hay un proceso que automatizar.",
    bullets: [
      "Mapeo y digitalización de procesos",
      "Flujos automáticos entre sistemas",
      "Procesamiento de documentos y datos",
      "Alertas, informes y trazabilidad",
    ],
  },
  {
    id: "inteligencia-artificial",
    index: "05",
    title: "Inteligencia Artificial",
    description:
      "IA aplicada a casos de negocio concretos, no experimentos. Agentes, asistentes y procesamiento documental que se integran en tu operativa y devuelven tiempo a tu equipo.",
    bullets: [
      "Agentes y asistentes sobre tu conocimiento",
      "Procesamiento documental inteligente",
      "Automatizaciones con LLMs y RAG",
      "Evaluación honesta de dónde aporta (y dónde no)",
    ],
  },
  {
    id: "integraciones",
    index: "06",
    title: "Integraciones y APIs",
    description:
      "Tus sistemas hablando entre sí: ERPs, CRMs, APIs de terceros y plataformas externas conectadas de forma fiable, con errores controlados y datos consistentes.",
    bullets: [
      "Conexión de ERPs, CRMs y sistemas corporativos",
      "APIs propias y consumo de APIs de terceros",
      "Webhooks y sincronización de datos",
      "Microsoft Graph y plataformas cloud",
    ],
  },
  {
    id: "consultoria",
    index: "07",
    title: "Consultoría tecnológica",
    description:
      "Decidir qué construir antes de escribir una línea de código. Analizamos el problema, definimos el producto y trazamos una hoja de ruta tecnológica realista.",
    bullets: [
      "Análisis del problema y del proceso",
      "Definición de producto y alcance",
      "Arquitectura y elección de tecnología",
      "Hoja de ruta por fases",
    ],
  },
];
