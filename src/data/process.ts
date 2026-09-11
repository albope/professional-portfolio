export interface ProcessStep {
  index: string;
  title: string;
  description: string;
  deliverable: string;
}

/** Cinco pasos; cada uno termina con algo que el cliente puede revisar. */
export const processSteps: ProcessStep[] = [
  {
    index: "1.0",
    title: "Entendemos",
    description: "Nos cuentas qué necesitas y cómo lo resuelves hoy.",
    deliverable: "Necesidad y siguiente paso",
  },
  {
    index: "2.0",
    title: "Diseñamos",
    description: "Acordamos la primera versión, prioridades, presupuesto y forma de trabajo.",
    deliverable: "Alcance y propuesta por escrito",
  },
  {
    index: "3.0",
    title: "Construimos",
    description: "Revisamos avances contigo mientras la solución toma forma.",
    deliverable: "Versiones que puedes probar",
  },
  {
    index: "4.0",
    title: "Lanzamos",
    description: "Probamos los recorridos principales y preparamos la puesta en marcha.",
    deliverable: "Solución lista para su uso",
  },
  {
    index: "5.0",
    title: "Evolucionamos",
    description: "Soporte y mejoras según el uso, con su alcance definido.",
    deliverable: "Continuidad acordada contigo",
  },
];
