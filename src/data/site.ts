export const site = {
  name: "BPM Tech",
  descriptor: "Tecnología a medida para empresas",
  description:
    "Aplicaciones a medida, webs con identidad propia, automatización e inteligencia artificial aplicada a tu operativa. Te acompañamos desde la idea hasta el producto funcionando.",
  // TODO: sustituir por el dominio definitivo de BPM Tech cuando exista.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bpmtechstudio.com",
  // El email de contacto NO se publica en la web: vive en el servidor
  // (variable de entorno CONTACT_EMAIL, ver src/app/api/contact/route.ts).
  location: "Valencia, España",
} as const;

export const nav = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Proyectos", href: "/#proyectos" },
  { label: "Método", href: "/#metodo" },
  { label: "Nosotros", href: "/#nosotros" },
] as const;

export const ctaLabel = "Cuéntanos tu proyecto";
export const ctaHref = "/#contacto";
