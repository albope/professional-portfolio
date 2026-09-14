import { copyEs } from "@/data/copy";

export const site = {
  name: "BPM Tech",
  descriptor: "Software y webs a medida",
  description:
    "Software a medida, automatización e integraciones y webs para pymes. BPM Tech, en Valencia y en remoto: de la necesidad a una solución que puedas usar.",
  /** Versión corta para compartir: WhatsApp y redes cortan a dos líneas. */
  share:
    "Software y webs que encajan en tu negocio. Gestión, automatización y desarrollo web a medida, en Valencia y en remoto.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bpmtechstudio.com",
  // Dirección pública autorizada para el contacto comercial y legal.
  email: "bpmtechstudio@gmail.com",
  // El destino del formulario se configura en el servidor mediante CONTACT_EMAIL.
  location: copyEs.pie.ubicacion,
} as const;

/**
 * El trabajo va primero: Proyectos abre la navegación y la portada. Los
 * rótulos salen del copy y el destino vive aquí, así que la cabecera, el
 * diálogo móvil y el índice del pie comparten una sola lista.
 */
const destinos = ["/#proyectos", "/#servicios", "/#metodo", "/#sobre"];

export const nav = copyEs.nav.enlaces.map((label, index) => ({
  label,
  href: destinos[index],
}));

export const legalLinks = copyEs.pie.legal.map((label, index) => ({
  label,
  href: ["/aviso-legal", "/privacidad"][index],
}));

export const ctaLabel = copyEs.hero.cta_primaria;
export const ctaHref = "/#contacto";
