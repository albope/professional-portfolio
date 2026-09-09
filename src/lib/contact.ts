export const CONTACT_LIMITS = {
  // Covers every field at its maximum, including JSON's six-byte escapes.
  requestBytes: 40_960,
  nombre: 200,
  empresa: 200,
  email: 254,
  telefono: 40,
  mensaje: 5_000,
} as const;

export const CONTACT_TIMEOUTS = { body: 5_000, provider: 10_000, client: 20_000 } as const;
export const CONTACT_NEEDS = {
  operativa: "Organizar la operativa de mi negocio",
  automatizacion: "Automatizar tareas y conectar herramientas",
  web: "Crear o mejorar una web o producto digital",
} as const;
export const CONTACT_PROJECTS = {
  "asistente-ia-gestion-proyectos": "Asistente de IA para gestión de proyectos",
  "plataforma-clubes-padel": "Plataforma de gestión para clubes de pádel",
  "wms-almacen": "Sistema de gestión de almacén",
  "web-boda": "Web de evento",
  "web-radio": "Web para un programa de radio",
} as const;
export type ContactNeed = keyof typeof CONTACT_NEEDS;
export type ContactProject = keyof typeof CONTACT_PROJECTS;
export type ContactField = "nombre" | "empresa" | "email" | "telefono" | "mensaje";
export type ContactFieldErrors = Partial<Record<ContactField, string>>;
export type ContactContext = { necesidad: ContactNeed | ""; proyecto: ContactProject | "" };
export interface ValidContact extends ContactContext {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
}
type ValidationResult =
  | { ok: true; value: ValidContact }
  | { ok: false; error: string; fields: ContactFieldErrors };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
export function isContactRequestId(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}
export function getContactContext(need: unknown, project: unknown): ContactContext {
  return {
    necesidad: typeof need === "string" && Object.hasOwn(CONTACT_NEEDS, need) ? need as ContactNeed : "",
    proyecto: typeof project === "string" && Object.hasOwn(CONTACT_PROJECTS, project) ? project as ContactProject : "",
  };
}
export function validateContactPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "Solicitud no válida.", fields: {} };
  }
  const data = payload as Record<string, unknown>;
  const value: ValidContact = {
    nombre: text(data.nombre), empresa: text(data.empresa), email: text(data.email).toLowerCase(),
    telefono: text(data.telefono), mensaje: text(data.mensaje),
    ...getContactContext(data.necesidad, data.proyecto),
  };
  const fields: ContactFieldErrors = {};
  const labels: Record<ContactField, string> = {
    nombre: "El nombre", empresa: "La empresa", email: "El email",
    telefono: "El teléfono", mensaje: "El mensaje",
  };
  for (const field of Object.keys(labels) as ContactField[]) {
    if (data[field] !== undefined && typeof data[field] !== "string") {
      fields[field] = `${labels[field]} debe ser texto.`;
    } else if (value[field].length > CONTACT_LIMITS[field]) {
      fields[field] = `${labels[field]} admite hasta ${CONTACT_LIMITS[field]} caracteres.`;
    }
  }
  if (!value.nombre) fields.nombre = "Indica tu nombre.";
  if (!value.email) fields.email = "Indica un email para poder responderte.";
  else if (!EMAIL_RE.test(value.email)) fields.email = "Revisa el email, parece incompleto.";
  if (!value.mensaje) fields.mensaje = "Cuéntanos brevemente qué necesitas resolver.";
  if (Object.keys(fields).length) {
    return { ok: false, error: "Revisa los campos señalados antes de enviar.", fields };
  }
  return { ok: true, value };
}
export function isAcceptedContactResponse(payload: unknown, requestId: string): boolean {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Record<string, unknown>;
  return data.ok === true && data.status === "accepted" &&
    isContactRequestId(data.requestId) && data.requestId === requestId;
}
export function safeSubjectFragment(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, CONTACT_LIMITS.empresa);
}
