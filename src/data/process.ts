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
      "Nos cuentas qué necesitas y cómo lo resuelves hoy. Valoramos si tiene sentido construir algo a medida.",
    deliverable: "Necesidad y siguiente paso",
  },
  {
    index: "2.0",
    title: "Diseñamos",
    description:
      "Acordamos qué incluye la primera versión, prioridades, presupuesto y forma de trabajo.",
    deliverable: "Alcance y propuesta por escrito",
  },
  {
    index: "3.0",
    title: "Construimos",
    description:
      "Revisamos avances contigo para ajustar la solución mientras toma forma.",
    deliverable: "Versiones que puedes probar",
  },
  {
    index: "4.0",
    title: "Lanzamos",
    description:
      "Probamos los recorridos principales y preparamos contigo la puesta en marcha y la entrega.",
    deliverable: "Solución lista para su uso",
  },
  {
    index: "5.0",
    title: "Evolucionamos",
    description:
      "Acordamos el soporte y las mejoras que necesites según el uso, con su alcance definido.",
    deliverable: "Continuidad acordada contigo",
  },
];
