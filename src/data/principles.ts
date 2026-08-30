export interface Principle {
  title: string;
  description: string;
}

export const principles: Principle[] = [
  {
    title: "El negocio primero",
    description:
      "La tecnología se elige después de entender el problema. Si una hoja de cálculo lo resuelve, te lo diremos.",
  },
  {
    title: "Iteraciones cortas",
    description:
      "Un producto que se puede probar pronto es un producto que se puede corregir barato.",
  },
  {
    title: "Mentalidad de producto",
    description:
      "Construimos herramientas que alguien usará cada día. La diferencia se nota en cada decisión pequeña.",
  },
  {
    title: "Ingeniería pragmática",
    description:
      "La solución más simple que resuelve bien el problema. Preparada para crecer, no sobredimensionada por si acaso.",
  },
  {
    title: "Tu código, tus datos",
    description:
      "Todo lo que construimos queda documentado y en tu propiedad. Sin dependencia de nosotros.",
  },
  {
    title: "Comunicación directa",
    description:
      "Hablas con quien diseña y construye tu producto. Sin gestores de cuentas ni sorpresas al final.",
  },
];

export interface CapabilityGroup {
  label: string;
  items: string;
}

export const capabilities: CapabilityGroup[] = [
  { label: "Frontend", items: "React · Next.js · TypeScript" },
  { label: "Backend", items: "Node.js · APIs REST · PostgreSQL" },
  { label: "Cloud y datos", items: "Supabase · Firebase · Vercel" },
  { label: "IA", items: "Anthropic · OpenAI · RAG · Agentes" },
  { label: "Integraciones", items: "Webhooks · Microsoft Graph · ERPs y CRMs" },
];
