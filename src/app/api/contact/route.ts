import { NextResponse } from "next/server";
import {
  CONTACT_LIMITS,
  safeSubjectFragment,
  validateContactPayload,
} from "@/lib/contact";

// Envío del formulario de contacto vía Resend (REST, sin SDK).
// Configuración por variables de entorno:
// - RESEND_API_KEY  (obligatoria para que el envío funcione)
// - CONTACT_EMAIL   (destino; obligatorio)
// - CONTACT_FROM    (remitente verificado en Resend; por defecto onboarding@resend.dev,
//                    válido solo para enviar al propio email de la cuenta de Resend)
const CONTACT_FROM = process.env.CONTACT_FROM || "BPM Tech <onboarding@resend.dev>";

const RATE_WINDOW_MS = 15 * 60 * 1_000;
const RATE_LIMIT = 5;
const requestsByIp = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestsByIp.get(ip) || []).filter(
    (timestamp) => timestamp > now - RATE_WINDOW_MS
  );
  recent.push(now);
  requestsByIp.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "El formato de la solicitud no es válido." },
      { status: 415, headers: noStoreHeaders }
    );
  }

  const declaredLength = Number(request.headers.get("content-length") || "0");
  if (declaredLength > CONTACT_LIMITS.requestBytes) {
    return NextResponse.json(
      { error: "La solicitud es demasiado grande." },
      { status: 413, headers: noStoreHeaders }
    );
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Solicitud no válida." },
      { status: 400, headers: noStoreHeaders }
    );
  }

  // Honeypot: los bots rellenan el campo oculto; respondemos OK sin enviar nada.
  if (
    typeof data === "object" &&
    data !== null &&
    "web" in data &&
    Boolean(data.web)
  ) {
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
  }

  const validation = validateContactPayload(data);
  if (!validation.ok) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400, headers: noStoreHeaders }
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Has enviado demasiadas solicitudes. Inténtalo más tarde." },
      { status: 429, headers: noStoreHeaders }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;
  if (!apiKey || !contactEmail) {
    return NextResponse.json(
      { error: "El envío no está disponible en este momento. Inténtalo más tarde." },
      { status: 503, headers: noStoreHeaders }
    );
  }

  const { nombre, empresa, email, telefono, mensaje } = validation.value;

  const body = [
    `Nombre: ${nombre}`,
    `Empresa: ${empresa || "—"}`,
    `Email: ${email}`,
    `Teléfono: ${telefono || "—"}`,
    "",
    mensaje,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [contactEmail],
      reply_to: email,
      subject: `Nuevo proyecto — ${safeSubjectFragment(empresa || nombre)}`,
      text: body,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "No se ha podido enviar el mensaje. Inténtalo de nuevo en unos minutos." },
      { status: 502, headers: noStoreHeaders }
    );
  }

  return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
}
