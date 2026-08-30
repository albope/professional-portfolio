"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Formulario de contacto: envía por POST a /api/contact (Resend en servidor).
 * El email de destino nunca se expone en el cliente.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          empresa: data.get("empresa"),
          email: data.get("email"),
          mensaje: data.get("mensaje"),
          web: data.get("web"),
        }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const payload = await res.json().catch(() => null);
        setErrorMessage(
          payload?.error || "No se ha podido enviar el mensaje. Inténtalo de nuevo."
        );
        setStatus("error");
      }
    } catch {
      setErrorMessage("No se ha podido enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.");
      setStatus("error");
    }
  };

  const fieldClasses =
    "w-full border-b border-paper/25 bg-transparent py-3 text-paper placeholder:text-paper/30 transition-colors duration-300 focus:border-cobalt focus:outline-none";
  const labelClasses = "label-mono text-paper/50";

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-5 border-t border-line-dark pt-8" role="status">
        <span className="flex h-11 w-11 items-center justify-center bg-cobalt">
          <Check className="h-5 w-5 text-paper" aria-hidden />
        </span>
        <p className="text-display-sm font-medium text-paper">Mensaje enviado.</p>
        <p className="max-w-md text-sm leading-relaxed text-paper/60">
          Gracias por contarnos tu proyecto. Lo leeremos con calma y te
          responderemos lo antes posible al email que nos has dejado.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-underline text-sm text-paper/70 transition-colors hover:text-paper"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="nombre" className={labelClasses}>
            Nombre *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            className={fieldClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="empresa" className={labelClasses}>
            Empresa
          </label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            autoComplete="organization"
            placeholder="Tu empresa (si aplica)"
            className={fieldClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClasses}>
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="nombre@empresa.com"
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="mensaje" className={labelClasses}>
          ¿Qué problema quieres resolver? *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={4}
          placeholder="Cuéntanoslo con tus palabras: qué pasa hoy y qué te gustaría que pasara."
          className={`${fieldClasses} resize-none`}
        />
      </div>

      {/* Honeypot anti-spam: oculto para personas, tentador para bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="web">Web</label>
        <input id="web" name="web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          tone="paper"
          disabled={status === "sending"}
          className="w-full sm:w-auto"
        >
          {status === "sending" ? "Enviando…" : "Enviar mensaje"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p
          className={status === "error" ? "text-xs text-red-300" : "text-xs text-paper/40"}
          role="status"
          aria-live="polite"
        >
          {status === "error"
            ? errorMessage
            : "Tu mensaje nos llega directamente. Sin listas de correo ni spam."}
        </p>
      </div>
    </form>
  );
}
