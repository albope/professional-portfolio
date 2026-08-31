export const CONTACT_LIMITS = {
  requestBytes: 16_384,
  nombre: 200,
  empresa: 200,
  email: 254,
  telefono: 40,
  mensaje: 5_000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactPayload {
  nombre?: unknown;
  empresa?: unknown;
  email?: unknown;
  telefono?: unknown;
  mensaje?: unknown;
  web?: unknown;
}

export interface ValidContact {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
}

type ValidationResult =
  | { ok: true; value: ValidContact }
  | { ok: false; error: string };

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function validateContactPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "Solicitud no válida." };
  }

  const data = payload as ContactPayload;
  const nombre = text(data.nombre);
  const empresa = text(data.empresa);
  const email = text(data.email).toLowerCase();
  const telefono = text(data.telefono);
  const mensaje = text(data.mensaje);

  if (!nombre || !email || !mensaje) {
    return {
      ok: false,
      error: "Faltan campos obligatorios (nombre, email y mensaje).",
    };
  }

  if (!EMAIL_RE.test(email) || email.length > CONTACT_LIMITS.email) {
    return { ok: false, error: "El email no parece válido." };
  }

  if (
    nombre.length > CONTACT_LIMITS.nombre ||
    empresa.length > CONTACT_LIMITS.empresa ||
    telefono.length > CONTACT_LIMITS.telefono ||
    mensaje.length > CONTACT_LIMITS.mensaje
  ) {
    return { ok: false, error: "Alguno de los campos es demasiado largo." };
  }

  return {
    ok: true,
    value: { nombre, empresa, email, telefono, mensaje },
  };
}

export function safeSubjectFragment(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, CONTACT_LIMITS.empresa);
}
