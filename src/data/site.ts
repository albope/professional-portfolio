export const site = {
  name: "BPM Tech",
  descriptor: "Software y webs a medida",
  description:
    "Software a medida, automatización e integraciones y webs para pymes. BPM Tech, en Valencia y en remoto: de la necesidad a una solución que puedas usar.",
  /** Versión corta para compartir: WhatsApp y redes cortan a dos líneas. */
  share:
    "Software y webs que encajan en tu negocio. Gestión, automatización y desarrollo web a medida, en Valencia y en remoto.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bpmtechstudio.com",
  // El destino del formulario vive exclusivamente en el servidor.
  // El contacto legal autorizado se gestiona por separado en data/legal.ts.
  // (variable de entorno CONTACT_EMAIL, ver src/app/api/contact/route.ts).
  location: "Valencia, España",
} as const;

export const nav = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Proyectos", href: "/#proyectos" },
  { label: "Método", href: "/#metodo" },
  { label: "Sobre BPM Tech", href: "/#nosotros" },
] as const;

export const ctaLabel = "Cuéntanos qué necesitas resolver";
export const ctaHref = "/#contacto";
