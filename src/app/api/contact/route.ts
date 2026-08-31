import { NextResponse } from "next/server";

// Envío del formulario de contacto vía Resend (REST, sin SDK).
// Configuración por variables de entorno:
// - RESEND_API_KEY  (obligatoria para que el envío funcione)
// - CONTACT_EMAIL   (destino; por defecto el buzón provisional del equipo)
// - CONTACT_FROM    (remitente verificado en Resend; por defecto onboarding@resend.dev,
//                    válido solo para enviar al propio email de la cuenta de Resend)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "albertobort@gmail.com";
const CONTACT_FROM = process.env.CONTACT_FROM || "BPM Tech <onboarding@resend.dev>";

interface ContactPayload {
  nombre?: string;
  empresa?: string;
  email?: string;
  telefono?: string;
  mensaje?: string;
  web?: string; // honeypot
}

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }

  // Honeypot: los bots rellenan el campo oculto; respondemos OK sin enviar nada.
  if (data.web) {
    return NextResponse.json({ ok: true });
  }

  const nombre = data.nombre?.trim();
  const empresa = data.empresa?.trim();
  const email = data.email?.trim();
  const telefono = data.telefono?.trim();
  const mensaje = data.mensaje?.trim();

  if (!nombre || !email || !mensaje) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios (nombre, email y mensaje)." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "El email no parece válido." }, { status: 400 });
  }
  if (
    nombre.length > 200 ||
    (empresa?.length ?? 0) > 200 ||
    (telefono?.length ?? 0) > 40 ||
    mensaje.length > 5000
  ) {
    return NextResponse.json({ error: "El mensaje es demasiado largo." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "El envío no está disponible en este momento. Inténtalo más tarde." },
      { status: 503 }
    );
  }

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
      to: [CONTACT_EMAIL],
      reply_to: email,
      subject: `Nuevo proyecto — ${empresa || nombre}`,
      text: body,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "No se ha podido enviar el mensaje. Inténtalo de nuevo en unos minutos." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
