import { copyEs } from "@/data/copy";
import type { ContactNeed, ContactProject } from "@/lib/contact";

export const site = {
  name: "BPM Tech",
  /** Meta description de la portada y descripción del JSON-LD. */
  description: copyEs.meta.descripcion,
  /** Versión corta para compartir: WhatsApp y redes cortan a dos líneas. */
  share: copyEs.meta.compartir,
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bpmtechstudio.com",
  // Dirección pública autorizada para el contacto comercial y legal.
  email: "bpmtechstudio@gmail.com",
  // El destino del formulario se configura en el servidor mediante CONTACT_EMAIL.
  location: copyEs.pie.ubicacion,
} as const;

/**
 * Las cinco secciones de la portada, en el orden de la página. Los rótulos
 * salen del copy y el destino vive aquí, así que la cabecera, el menú móvil y
 * el pie comparten una sola lista. `id` es el ancla de la sección: en la
 * portada se enlaza como `#id` (salto nativo que conserva `?necesidad=`) y
 * desde las demás páginas como `/#id`. `SectionLink` elige por ti.
 */
const sectionIds = ["que-hacemos", "proyectos", "como-trabajamos", "quienes-somos", "preguntas"] as const;
export type SectionId = (typeof sectionIds)[number] | "top" | "contacto";

export const nav = copyEs.cabecera.enlaces.map((label, index) => ({
  label,
  id: sectionIds[index],
}));

export const legalLinks = copyEs.pie.legal.map((label, index) => ({
  label,
  href: ["/aviso-legal", "/privacidad"][index],
}));

/**
 * Enlace al formulario con el tema o el proyecto preseleccionados. Úsalo con
 * `next/link`: el formulario lee `necesidad` y `proyecto` con
 * `useSearchParams` y marca la píldora correspondiente.
 */
export function contactHref(context: { need?: ContactNeed; project?: ContactProject } = {}): string {
  const params = new URLSearchParams();
  if (context.need) params.set("necesidad", context.need);
  if (context.project) params.set("proyecto", context.project);
  const query = params.toString();
  return query ? `/?${query}#contacto` : "/#contacto";
}
