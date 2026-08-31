"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { SquareWord } from "@/components/ui/SquareWord";

type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  "w-full bg-transparent px-4 py-3.5 text-[15px] text-paper transition-colors duration-300 focus:outline-none";
const fieldOk = "border border-paper/25 focus:border-cobalt-bright";
const fieldBad = "border border-error focus:border-error";
const labelClasses =
  "font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50";

/**
 * Formulario de contacto: envía por POST a /api/contact (Resend en servidor).
 * El email de destino nunca se expone en el cliente. Los errores se anuncian
 * junto al campo, sin vaciar el formulario.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();

    if (!EMAIL_RE.test(email)) {
      setEmailError(true);
      setStatus("idle");
      return;
    }
    setEmailError(false);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          empresa: data.get("empresa"),
          email,
          telefono: data.get("telefono"),
          mensaje: data.get("mensaje"),
          web: data.get("web"),
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="lg:pt-2">
        <span className="mb-7 flex h-11 w-11 items-center justify-center border border-cobalt-bright">
          <Check
            className="h-5 w-5 text-cobalt-bright"
            strokeWidth={1.5}
            strokeLinecap="square"
            aria-hidden
          />
        </span>
        <h3 className="display text-[28px] text-paper lg:text-[34px]">
          Mensaje <SquareWord word="recibido" tone="dark" />
        </h3>
        <p className="mt-5 max-w-md text-[15px] leading-[1.65] text-paper/60">
          Gracias por escribirnos. Leemos todos los mensajes y te respondemos en
          uno o dos días laborables.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block border border-paper/35 px-6 py-[13px] text-sm font-semibold text-paper transition-colors duration-300 hover:border-cobalt-bright"
        >
          Volver a la portada
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]" noValidate>
      <div className="grid gap-[22px] sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClasses}>Nombre</span>
          <input
            name="nombre"
            type="text"
            required
            autoComplete="name"
            className={`${fieldBase} ${fieldOk}`}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClasses}>Empresa</span>
          <input
            name="empresa"
            type="text"
            autoComplete="organization"
            className={`${fieldBase} ${fieldOk}`}
          />
        </label>
      </div>

      <div className="grid gap-[22px] sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClasses}>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            onChange={() => setEmailError(false)}
            className={`${fieldBase} ${emailError ? fieldBad : fieldOk}`}
          />
          {emailError && (
            <span id="email-error" className="font-mono text-[11px] text-error">
              Revisa el email, parece incompleto.
            </span>
          )}
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClasses}>Teléfono (opcional)</span>
          <input
            name="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={`${fieldBase} ${fieldOk}`}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClasses}>¿Qué necesitas resolver?</span>
        <textarea
          name="mensaje"
          required
          rows={5}
          className={`${fieldBase} ${fieldOk} resize-y`}
        />
      </label>

      {/* Honeypot anti-spam: oculto para personas, tentador para bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="web">Web</label>
        <input id="web" name="web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <div className="border border-error px-5 py-4" role="alert">
          <p className="text-sm leading-relaxed text-paper">
            No hemos podido enviar el mensaje. Vuelve a intentarlo en un momento.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start bg-paper px-[30px] py-4 text-[15px] font-semibold text-ink transition-colors duration-300 ease-editorial hover:bg-cobalt-bright disabled:pointer-events-none disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
      <p className="font-mono text-[11px] text-paper/40">
        Solo usamos estos datos para responderte. Contacto únicamente por este
        formulario.
      </p>
    </form>
  );
}
