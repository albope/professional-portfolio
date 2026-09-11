"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { SquareWord } from "@/components/ui/SquareWord";
import { trackEvent, type AnalyticsProperties } from "@/lib/analytics";
import {
  CONTACT_LIMITS, CONTACT_NEEDS, CONTACT_PROJECTS, CONTACT_TIMEOUTS,
  getContactContext, isAcceptedContactResponse, validateContactPayload,
  type ContactContext, type ContactField, type ContactFieldErrors, type ContactNeed,
} from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error";
const fieldBase = "w-full min-h-12 bg-transparent px-4 py-3.5 text-base leading-[1.5] text-paper transition-colors duration-300 ease-editorial focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-cobalt-bright disabled:text-paper/35 sm:min-h-[52px] lg:min-h-12 lg:text-[15px]";
const fieldOk = "border border-paper/40 focus:border-cobalt-bright disabled:border-paper/20";
const fieldBad = "border border-error focus:border-error";
const labelClasses = "font-mono text-[11px] uppercase tracking-[0.12em] text-paper/78 [fieldset:disabled_&]:text-paper/50 lg:text-xs";
const fields: ContactField[] = ["nombre", "empresa", "email", "telefono", "mensaje"];
const subscribe = () => () => {};
const noContext: ContactContext = { necesidad: "", proyecto: "" };

function ContactFormContent({ context, forceDisabled = false }: { context: ContactContext; forceDisabled?: boolean }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [selectedNeed, setSelectedNeed] = useState<ContactNeed | "" | null>(null);
  const need = selectedNeed ?? context.necesidad;
  const retry = useRef<{ body: string; id: string } | null>(null);
  const started = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const disabled = forceDisabled || !hydrated || status === "sending";

  useEffect(() => () => activeRequest.current?.abort(), []);
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function analyticsContext(): AnalyticsProperties {
    return { location: "contact", ...(need ? { need } : {}), ...(context.proyecto ? { project: context.proyecto } : {}) };
  }

  function markStarted() {
    if (!started.current && hydrated && !forceDisabled) {
      started.current = true;
      trackEvent("form_start", analyticsContext());
    }
  }

  function clearError(field: ContactField) {
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function fieldProps(field: ContactField) {
    return {
      id: `contact-${field}`, name: field, maxLength: CONTACT_LIMITS[field],
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": [field === "mensaje" ? "contact-message-help" : "", errors[field] ? `contact-${field}-error` : ""].filter(Boolean).join(" ") || undefined,
      onChange: () => clearError(field),
      className: `${fieldBase} ${errors[field] ? fieldBad : fieldOk}`,
    };
  }

  function fieldError(field: ContactField) {
    return errors[field] ? <span id={`contact-${field}-error`} className="text-sm text-error-soft">{errors[field]}</span> : null;
  }

  function showError(message: string, code: AnalyticsProperties["code"]) {
    setServerError(message);
    setStatus("error");
    trackEvent("contact_error", { ...analyticsContext(), code });
    requestAnimationFrame(() => errorRef.current?.focus());
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled || activeRequest.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const validation = validateContactPayload({
      ...Object.fromEntries(fields.map((field) => [field, data.get(field) ?? ""])),
      necesidad: need, proyecto: context.proyecto,
    });
    setServerError("");
    if (!validation.ok) {
      setErrors(validation.fields);
      setStatus("idle");
      const first = fields.find((field) => validation.fields[field]);
      trackEvent("form_validation_error", { ...analyticsContext(), ...(first ? { field: first } : {}) });
      requestAnimationFrame(() => {
        const control = first ? form.elements.namedItem(first) : null;
        if (control instanceof HTMLElement) control.focus();
      });
      return;
    }
    setErrors({});
    const body = JSON.stringify({ ...validation.value, web: data.get("web") || "" });
    let attempt = retry.current;
    try {
      if (!attempt || attempt.body !== body) {
        attempt = { body, id: crypto.randomUUID() };
        retry.current = attempt;
      }
    } catch {
      showError("No se ha podido preparar el envío. Conserva tu mensaje y vuelve a intentarlo desde una conexión segura.", "invalid_request");
      return;
    }
    const controller = new AbortController();
    activeRequest.current = controller;
    const timer = setTimeout(() => controller.abort(), CONTACT_TIMEOUTS.client);
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.id },
        body: attempt.body,
      });
      const payload: unknown = await response.json().catch(() => null);
      if (controller.signal.aborted) throw new DOMException("Timed out", "AbortError");
      if (response.ok && isAcceptedContactResponse(payload, attempt.id)) {
        setStatus("success");
        return;
      }
      if (response.status === 429) {
        const seconds = Number(response.headers.get("Retry-After"));
        const delay = Number.isFinite(seconds) && seconds > 0 && seconds <= 900
          ? `Espera ${Math.ceil(seconds / 60)} min antes de reintentar.` : "Espera unos minutos antes de reintentar.";
        showError(`Has enviado varias solicitudes. ${delay} Tu mensaje sigue aquí.`, "rate_limited");
      } else if (response.status === 503) {
        showError("El envío no está disponible en este momento. Tu mensaje sigue aquí; puedes copiarlo y volver más tarde.", "unavailable");
      } else if (response.status === 408 || response.status === 504) {
        showError("La confirmación está tardando demasiado. Tu mensaje sigue aquí; puedes volver a enviarlo.", "timeout");
      } else if (response.status === 413) {
        showError("El mensaje es demasiado grande. Acórtalo y vuelve a enviarlo.", "too_large");
      } else {
        showError("No se ha podido confirmar el envío. Tu mensaje sigue aquí; puedes volver a intentarlo.", response.ok ? "unexpected" : "provider");
      }
    } catch {
      showError(controller.signal.aborted
        ? "La confirmación está tardando demasiado. Tu mensaje sigue aquí; puedes volver a enviarlo."
        : "No hemos podido conectar. Revisa tu conexión y vuelve a intentarlo; tu mensaje sigue aquí.",
      controller.signal.aborted ? "timeout" : "network");
    } finally {
      clearTimeout(timer);
      activeRequest.current = null;
    }
  };

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-cobalt-bright lg:pt-2">
        <span className="flex h-11 w-11 items-center justify-center border border-cobalt-bright">
          <Check className="h-5 w-5 text-cobalt-bright" strokeWidth={1.5} strokeLinecap="square" aria-hidden />
        </span>
        <h3 className="mt-6 font-display text-[26px] uppercase leading-none tracking-[-0.01em] text-paper lg:text-[30px]">
          Mensaje <SquareWord word="enviado" tone="dark" />
        </h3>
        <p className="mt-4 max-w-[520px] text-[15px] leading-[1.6] text-paper/78">
          Gracias por contarnos qué necesitas. El siguiente paso es revisarlo y responderte al
          email que has indicado.
        </p>
        <Link href="/" className="mt-6 inline-flex min-h-12 items-center border border-paper/45 px-[22px] text-sm font-semibold text-paper transition-colors duration-300 ease-editorial hover:border-cobalt-bright hover:text-cobalt-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt-bright">
          Volver a la portada
        </Link>
      </div>
    );
  }

  return (
    <form action="/api/contact" method="post" onSubmit={handleSubmit} onFocusCapture={markStarted} aria-busy={status === "sending"} className="flex flex-col gap-[18px] lg:gap-[22px]" noValidate>
      <noscript><p className="border border-paper/40 p-4 text-sm text-paper">Para enviar este formulario necesitas activar JavaScript. Los campos están deshabilitados y no se enviará ningún dato.</p></noscript>
      <fieldset disabled={disabled} className="flex min-w-0 flex-col gap-[18px] lg:gap-[22px]">
        <legend className="sr-only">Cuéntanos qué necesitas resolver</legend>
        <div className="grid gap-[18px] lg:grid-cols-2 lg:gap-[22px]">
          <label className="flex flex-col gap-2" htmlFor="contact-nombre">
            <span className={labelClasses}>Nombre</span>
            <input {...fieldProps("nombre")} type="text" required autoComplete="name" />
            {fieldError("nombre")}
          </label>
          {/* En móvil el formulario se reduce a lo imprescindible; estos campos
              siguen en el DOM y se envían vacíos, que es su valor por defecto. */}
          <label className="hidden flex-col gap-2 md:flex" htmlFor="contact-empresa">
            <span className={labelClasses}>Empresa (opcional)</span>
            <input {...fieldProps("empresa")} type="text" autoComplete="organization" />
            {fieldError("empresa")}
          </label>
        </div>
        <div className="grid gap-[18px] lg:grid-cols-2 lg:gap-[22px]">
          <label className="flex flex-col gap-2" htmlFor="contact-email">
            <span className={labelClasses}>Email</span>
            <input {...fieldProps("email")} type="email" required autoComplete="email" />
            {fieldError("email")}
          </label>
          <label className="hidden flex-col gap-2 md:flex" htmlFor="contact-telefono">
            <span className={labelClasses}>Teléfono (opcional)</span>
            <input {...fieldProps("telefono")} type="tel" inputMode="tel" autoComplete="tel" />
            {fieldError("telefono")}
          </label>
        </div>
        <label className="hidden flex-col gap-2 md:flex" htmlFor="contact-necesidad">
          <span className={labelClasses}>¿En qué podemos ayudarte? (opcional)</span>
          <select id="contact-necesidad" name="necesidad" value={need} onChange={(event) => setSelectedNeed(getContactContext(event.target.value, "").necesidad)} className={`campo-select bg-ink ${fieldBase} ${fieldOk}`}>
            <option value="" className="bg-ink">Todavía no lo tengo claro</option>
            {Object.entries(CONTACT_NEEDS).map(([value, label]) => <option key={value} value={value} className="bg-ink">{label}</option>)}
          </select>
        </label>
        {context.proyecto && <p className="text-sm leading-relaxed text-paper/72">Proyecto de referencia: <span className="text-paper">{CONTACT_PROJECTS[context.proyecto]}</span></p>}
        <label className="flex flex-col gap-2" htmlFor="contact-mensaje">
          <span className={labelClasses}>¿Qué necesitas resolver?</span>
          <span id="contact-message-help" className="sr-only text-sm leading-[1.5] text-paper/72 md:not-sr-only md:block">Cuéntanos qué haces y qué te gustaría mejorar. No necesitas tener definido el proyecto.</span>
          <textarea {...fieldProps("mensaje")} required rows={5} className={`${fieldBase} ${errors.mensaje ? fieldBad : fieldOk} min-h-[132px] resize-y lg:min-h-[140px]`} />
          {fieldError("mensaje")}
        </label>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-web">Web</label>
          <input id="contact-web" name="web" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>
      {Object.values(errors).some(Boolean) && <p role="alert" className="text-sm text-error-soft">Revisa los campos señalados antes de enviar.</p>}
      {status === "error" && <div ref={errorRef} tabIndex={-1} className="border border-error px-5 py-4 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-error" role="alert"><p className="text-sm leading-[1.5] text-paper">{serverError}</p></div>}
      <p className="text-xs leading-[1.55] text-paper/72 lg:text-[13px]">
        BPM Tech (BORT PEREZ MULTI GESTION SOCIEDAD LIMITADA) utilizará tus datos para responder a tu consulta y, si procede, preparar una propuesta. Cómo ejercer tus derechos y el resto de información, en la{" "}
        <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-paper underline underline-offset-4 transition-colors duration-300 hover:text-cobalt-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt-bright">política de privacidad <span className="text-paper/72">(se abre en otra pestaña)</span></a>.
      </p>
      <button type="submit" disabled={disabled} className="min-h-[52px] w-full bg-paper px-[30px] text-[15px] font-semibold text-ink transition-colors duration-300 ease-editorial hover:bg-cobalt-bright active:translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt-bright disabled:pointer-events-none disabled:opacity-60 md:w-auto md:self-start">
        {status === "sending" ? "Enviando…" : "Enviar consulta"}
      </button>
      <p role="status" aria-live="polite" className="sr-only">{status === "sending" ? "Enviando tu consulta. Espera unos segundos." : ""}</p>
    </form>
  );
}

function ContextualContactForm() {
  const searchParams = useSearchParams();
  const context = getContactContext(searchParams.get("necesidad"), searchParams.get("proyecto"));
  return <ContactFormContent context={context} />;
}

export function ContactForm() {
  return <Suspense fallback={<ContactFormContent context={noContext} forceDisabled />}><ContextualContactForm /></Suspense>;
}
