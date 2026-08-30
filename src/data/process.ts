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
      "Analizamos el problema con las personas que lo viven cada día, no solo con quien lo encarga.",
    deliverable: "Mapa del problema y alcance propuesto",
  },
  {
    index: "2.0",
    title: "Diseñamos",
    description:
      "Definimos funcionalidades, experiencia y arquitectura. Decidimos qué entra en la primera versión.",
    deliverable: "Definición funcional y plan por fases",
  },
  {
    index: "3.0",
    title: "Construimos",
    description:
      "Ciclos cortos con entregas visibles. Cada pocas semanas hay algo nuevo que puedes probar.",
    deliverable: "Software funcionando en cada iteración",
  },
  {
    index: "4.0",
    title: "Lanzamos",
    description:
      "Pruebas, despliegue y puesta en producción. Acompañamos el arranque con formación y soporte.",
    deliverable: "Producto en producción y equipo usándolo",
  },
  {
    index: "5.0",
    title: "Evolucionamos",
    description:
      "El software útil no se termina, se ajusta. Seguimos mejorando según el uso real.",
    deliverable: "Hoja de ruta viva y mejora continua",
  },
];
