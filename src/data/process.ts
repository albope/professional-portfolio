export interface ProcessStep {
  index: string;
  title: string;
  description: string;
  deliverable: string;
}

export const processSteps: ProcessStep[] = [
  {
    index: "1.0",
    title: "Entendemos",
    description:
      "Analizamos el problema, los procesos y el objetivo de negocio. Hablamos con las personas que viven el proceso cada día, no solo con quien lo encarga.",
    deliverable: "Mapa del problema y alcance propuesto",
  },
  {
    index: "2.0",
    title: "Diseñamos",
    description:
      "Definimos funcionalidades, experiencia de uso, arquitectura y alcance. Decidimos qué entra en la primera versión y qué puede esperar.",
    deliverable: "Definición funcional y plan por fases",
  },
  {
    index: "3.0",
    title: "Construimos",
    description:
      "Desarrollamos el producto en ciclos cortos con entregas visibles. Cada pocas semanas hay algo nuevo que puedes probar y corregir a tiempo.",
    deliverable: "Software funcionando en cada iteración",
  },
  {
    index: "4.0",
    title: "Lanzamos",
    description:
      "Testing, despliegue, monitorización y puesta en producción. Acompañamos el arranque real: formación, ajustes y soporte cercano.",
    deliverable: "Producto en producción y equipo usándolo",
  },
  {
    index: "5.0",
    title: "Evolucionamos",
    description:
      "El software útil no se termina: se ajusta. Seguimos mejorando el producto según el uso real y las nuevas necesidades del negocio.",
    deliverable: "Roadmap vivo y mejora continua",
  },
];
