"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import type { Copy } from "@/data/copy";
import { booking } from "@/data/booking";
import { trackEvent, type AnalyticsProperties } from "@/lib/analytics";
import { partirEnlace, rellenar } from "@/lib/copy-helpers";
import { DIAGNOSTICO_EVENT } from "@/lib/diagnostico";
import { sinCortes } from "@/lib/sin-cortes";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import {
  CONTACT_LIMITS, CONTACT_NEEDS_LISTED, CONTACT_PROJECTS, CONTACT_TIMEOUTS,
  getContactContext, isAcceptedContactResponse, resolveContactNeed, validateContactPayload,
  type ContactContext, type ContactField, type ContactFieldErrors, type ContactNeedChoice,
} from "@/lib/contact";
import styles from "./ContactForm.module.css";

export type ContactFormTexts = Copy["contacto"]["formulario"];

interface ContactFormProps {
  /** `copyEs.contacto.formulario`, pasado por la sección (servidor). */
  texts: ContactFormTexts;
  /** Email público para el aviso sin JS (`site.email`). */
  email: string;
}

type Status = "idle" | "sending" | "success" | "error";
const fields: ContactField[] = ["nombre", "empresa", "email", "telefono", "mensaje"];

/*
 * Campos (especificación 5.2): fondo `bg`, borde `line-2`, radio 9, relleno
 * 13×14 y 16 px de letra (por debajo iOS hace zoom al enfocar). Al enfocar,
 * fondo blanco, borde cobalto y anillo `cobalt-100` en lugar del contorno
 * global. Los colores de borde y anillo van solo en `fieldOk` o en
 * `fieldBad`, nunca en los dos: dos utilidades del mismo tipo en una misma
 * clase las resuelve el orden del CSS generado, no el del atributo.
 */
const fieldBase =
  "w-full rounded-control border bg-bg px-3.5 py-[13px] text-base text-ink transition-[border-color,background-color,box-shadow] duration-200 ease-soft focus:bg-surface focus:outline-none disabled:opacity-60";
const fieldOk = "border-line-2 hover:border-ink-4 focus:border-cobalt focus:shadow-[0_0_0_3px_var(--cobalt-100)]";
/**
 * En error el borde se queda en `error` en todos los campos, así que el foco
 * no puede ser un halo claro: con varios campos en rojo no se distinguiría
 * cuál lo tiene. El campo enfocado suma 2 px macizos de `error` a su borde
 * (3 px en total, 6,5:1 sobre blanco) frente a 1 px en los demás.
 */
const fieldBad = "border-error focus:shadow-[0_0_0_2px_var(--error)]";
const labelClasses = "text-small font-semibold text-ink";
const FORM_TITLE_ID = "contact-form-title";

function subscribe() {
  return () => {};
}
const noContext: ContactContext = { necesidad: "", proyecto: "" };

/**
 * Enlaces de la propia portada al formulario con tema o proyecto
 * (`/?necesidad=web#contacto`, «Consultar sobre…» y «Hacer una consulta» de
 * Qué hacemos). Van con `next/link`, que cambia la URL pero no mueve el foco.
 */
const ENLACE_AL_FORMULARIO = /^\/\?[^#]*#contacto$/;

/**
 * Lleva la vista a Contacto y el foco al título de la tarjeta, así el
 * siguiente Tab cae en «Nombre» y el lector de pantalla anuncia dónde está.
 * No se enfoca el campo: en móvil abriría el teclado. Si Next ya ha hecho el
 * salto, `scrollIntoView` no se mueve. Si no lo ha hecho (la navegación sale
 * antes de terminar la precarga del enlace), lo garantiza. Va en el
 * siguiente fotograma, después del salto de Next, y solo si la URL sigue
 * apuntando al formulario con la búsqueda esperada.
 */
function irAlFormulario(search: string) {
  requestAnimationFrame(() => {
    if (window.location.hash !== "#contacto" || window.location.search !== search) return;
    document.getElementById("contacto")?.scrollIntoView();
    document.getElementById(FORM_TITLE_ID)?.focus({ preventScroll: true });
  });
}

function ContactFormContent({
  texts,
  email,
  context,
  forceDisabled = false,
}: ContactFormProps & { context: ContactContext; forceDisabled?: boolean }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [serverError, setServerError] = useState("");
  // La píldora que marca el visitante manda mientras el tema de la URL siga
  // siendo el mismo con el que la marcó (`resolveContactNeed`).
  const [choice, setChoice] = useState<ContactNeedChoice | null>(null);
  const urlNeed = context.necesidad;
  const need = resolveContactNeed(choice, urlNeed);
  /** Búsqueda (`?necesidad=…`) del enlace al formulario que acaba de pulsar el visitante. */
  const llegada = useRef<string | null>(null);
  const retry = useRef<{ body: string; id: string } | null>(null);
  const started = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const mensajeRef = useRef<HTMLTextAreaElement>(null);
  const disabled = forceDisabled || !hydrated || status === "sending";
  const { errores } = texts.estados;
  const aviso = partirEnlace(texts.aviso, texts.aviso_enlace);
  const sinJs = partirEnlace(texts.sin_js, email);
  const sinJsReserva = partirEnlace(sinJs.despues, texts.sin_js_reserva);
  const errorServidor = partirEnlace(serverError, email);

  useEffect(() => () => activeRequest.current?.abort(), []);

  // Clic en un enlace de la portada al formulario. Si la URL va a cambiar,
  // se anota y actúa el efecto de abajo cuando llega el tema nuevo. Si es la
  // misma (el visitante marcó otra píldora y vuelve a pulsar el mismo
  // «Consultar sobre…»), no cambia nada que React vea: se devuelve la
  // píldora del enlace y se va al formulario desde aquí.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || window.location.pathname !== "/" || !ENLACE_AL_FORMULARIO.test(link.getAttribute("href") ?? "")) return;
      const { search } = new URL(link.href);
      if (search === window.location.search) {
        setChoice(null);
        irAlFormulario(search);
      } else {
        llegada.current = search;
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Llega el tema o el proyecto del enlace pulsado. Solo tras un clic en la
  // portada: la primera carga la resuelve el ancla y el historial (Atrás)
  // restaura su propia posición.
  useEffect(() => {
    const search = llegada.current;
    if (search === null) return;
    llegada.current = null;
    irAlFormulario(search);
  }, [urlNeed, context.proyecto]);
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  // «Enviarlo por escrito» en el diagnóstico rellena el mensaje y preselecciona la necesidad.
  useEffect(() => {
    const onDiagnostico = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      const el = mensajeRef.current;
      if (typeof detail !== "string" || !el) return;
      el.value = detail.slice(0, CONTACT_LIMITS.mensaje);
      setErrors((previous) => ({ ...previous, mensaje: undefined }));
      setChoice({ need: "diagnostico", from: urlNeed });
      if (!started.current && hydrated && !forceDisabled) {
        started.current = true;
        trackEvent("form_start", { location: "contact", need: "diagnostico" });
      }
      requestAnimationFrame(() => el.focus({ preventScroll: true }));
    };
    window.addEventListener(DIAGNOSTICO_EVENT, onDiagnostico);
    return () => window.removeEventListener(DIAGNOSTICO_EVENT, onDiagnostico);
  }, [hydrated, forceDisabled, urlNeed]);

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
    return errors[field] ? <span id={`contact-${field}-error`} className="text-caption text-error">{errors[field]}</span> : null;
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
      showError(errores.preparar, "invalid_request");
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
          ? rellenar(errores.espera_minutos, { minutos: Math.ceil(seconds / 60) })
          : errores.espera;
        showError(rellenar(errores.limite, { espera: delay }), "rate_limited");
      } else if (response.status === 503) {
        showError(errores.no_disponible, "unavailable");
      } else if (response.status === 408 || response.status === 504) {
        showError(errores.tiempo, "timeout");
      } else if (response.status === 413) {
        showError(errores.demasiado_grande, "too_large");
      } else {
        showError(errores.confirmacion, response.ok ? "unexpected" : "provider");
      }
    } catch {
      showError(controller.signal.aborted ? errores.tiempo : errores.conexion,
        controller.signal.aborted ? "timeout" : "network");
    } finally {
      clearTimeout(timer);
      activeRequest.current = null;
    }
  };

  /*
   * Enviado (3.8): el bloque `cobalt-50` sustituye todo el contenido de la
   * tarjeta, título incluido, y recibe el foco para que el lector de
   * pantalla lo lea y el teclado siga desde ahí. El anillo se ve con
   * cualquier foco (no solo `:focus-visible`): tras enviar con el ratón
   * también señala dónde ha quedado.
   */
  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="grid gap-2.5 rounded-[12px] bg-cobalt-50 p-[18px] text-ink focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-cobalt">
        <strong className="font-semibold">{texts.exito.mensaje}</strong>
        <p className="text-ink-2">{sinCortes(texts.exito.detalle)}</p>
      </div>
    );
  }

  const hasFieldErrors = Object.values(errors).some(Boolean);

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        {/* Enfocable por programa: destino del foco al llegar desde un
            «Consultar sobre…» (`irAlFormulario`). */}
        <h3 id={FORM_TITLE_ID} tabIndex={-1} className="text-[1.25rem] font-semibold leading-[1.6] tracking-[-0.015em] focus:outline-none">{texts.titulo}</h3>
        <p className="text-caption leading-[1.6] text-ink-2">{texts.nota}</p>
      </div>
      <form action="/api/contact" method="post" onSubmit={handleSubmit} onFocusCapture={markStarted} aria-busy={status === "sending"} aria-labelledby={FORM_TITLE_ID} className="grid gap-5" noValidate>
        <noscript>
          <p className="rounded-control border border-line-2 bg-bg p-4 text-small text-ink">
            {sinJs.antes}
            {sinJs.enlace && <a href={`mailto:${email}`} className="underline underline-offset-4">{sinJs.enlace}</a>}
            {sinJsReserva.antes}
            {sinJsReserva.enlace && <a href={booking.url} className="underline underline-offset-4">{sinJsReserva.enlace}</a>}
            {sinJsReserva.despues}
          </p>
        </noscript>
        <fieldset disabled={disabled} className="grid min-w-0 gap-5">
          <legend className="sr-only">{texts.grupo}</legend>
          <div className="grid gap-5 min-[560px]:grid-cols-2">
            <div className="grid content-start gap-2">
              <label className={labelClasses} htmlFor="contact-nombre">{texts.campos.nombre}</label>
              <input {...fieldProps("nombre")} type="text" required autoComplete="name" />
              {fieldError("nombre")}
            </div>
            <div className="grid content-start gap-2">
              <label className={labelClasses} htmlFor="contact-email">{texts.campos.email}</label>
              <input {...fieldProps("email")} type="email" required autoComplete="email" />
              {fieldError("email")}
            </div>
          </div>
          {/* Tema: píldoras de elección única (radios nativos, 5.2). Llegan
              marcadas desde `?necesidad=` y, sin ninguna, se envía vacío. */}
          <fieldset className="min-w-0">
            <legend className={`${labelClasses} mb-2.5`}>
              {texts.tema.leyenda} <span className="font-normal text-ink-2">{texts.tema.opcional}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {CONTACT_NEEDS_LISTED.map((value, index) => {
                const label = texts.tema.opciones[index];
                return (
                  <label key={value} className={styles.pill}>
                    <input
                      type="radio"
                      name="necesidad"
                      value={value}
                      checked={need === value}
                      onChange={() => setChoice({ need: getContactContext(value, "").necesidad, from: urlNeed })}
                    />
                    <span className={styles.face} data-label={label}>{label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          {/* Desde una ficha de proyecto (`?proyecto=`), el proyecto de
              referencia se ve justo antes de escribir. */}
          {context.proyecto && (
            <p className="text-caption text-ink-2">
              {texts.proyecto_referencia} <span className="font-medium text-ink">{CONTACT_PROJECTS[context.proyecto]}</span>
            </p>
          )}
          <div className="grid gap-2">
            <label className={labelClasses} htmlFor="contact-mensaje">{texts.campos.mensaje}</label>
            <p id="contact-message-help" className="text-micro leading-[1.45] text-ink-2">{texts.mensaje_ayuda}</p>
            <textarea {...fieldProps("mensaje")} ref={mensajeRef} required rows={5} className={`${fieldBase} ${errors.mensaje ? fieldBad : fieldOk} min-h-[132px] resize-y leading-normal`} />
            {fieldError("mensaje")}
          </div>
          {/* Empresa y teléfono, plegados: el formulario pide lo mínimo. Se
              abre solo si alguno de los dos tiene error. */}
          <details className="group/extra border-y border-line" open={errors.empresa || errors.telefono ? true : undefined}>
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 py-3 text-small font-semibold transition-colors duration-200 hover:text-cobalt [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="relative h-3 w-3 flex-none forced-colors:before:bg-[CanvasText] forced-colors:after:bg-[CanvasText] before:absolute before:inset-x-0 before:top-[5px] before:h-0.5 before:bg-current after:absolute after:inset-x-0 after:top-[5px] after:h-0.5 after:rotate-90 after:bg-current after:transition-transform after:duration-300 after:ease-soft group-open/extra:after:rotate-0" />
              <span>{texts.extra.resumen} <span className="font-normal text-ink-2">{texts.extra.opcional}</span></span>
            </summary>
            <div className="grid gap-5 pb-5 pt-1 min-[560px]:grid-cols-2">
              <div className="grid content-start gap-2">
                <label className={labelClasses} htmlFor="contact-empresa">{texts.campos.empresa}</label>
                <input {...fieldProps("empresa")} type="text" autoComplete="organization" />
                {fieldError("empresa")}
              </div>
              <div className="grid content-start gap-2">
                <label className={labelClasses} htmlFor="contact-telefono">{texts.campos.telefono}</label>
                <input {...fieldProps("telefono")} type="tel" inputMode="tel" autoComplete="tel" />
                {fieldError("telefono")}
              </div>
            </div>
          </details>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-web">Web</label>
            <input id="contact-web" name="web" type="text" tabIndex={-1} autoComplete="off" />
          </div>
        </fieldset>
        <p className="text-micro text-ink-2">
          {aviso.antes}
          {/* En otra pestaña: quien la consulta antes de enviar no pierde lo
              que ya ha escrito al volver. */}
          {aviso.enlace && <TextLink href="/privacidad" external>{aviso.enlace}</TextLink>}
          {aviso.despues}
        </p>
        {/* Los avisos van justo encima del botón, donde está la mirada al
            enviar. El de campos acompaña al foco, que salta al primer campo
            con error. El del servidor recibe el foco él mismo. */}
        {hasFieldErrors && <p role="alert" className="text-caption font-medium text-error">{texts.estados.revisa}</p>}
        {status === "error" && (
          <div ref={errorRef} tabIndex={-1} role="alert" className="rounded-control border border-error bg-surface px-[18px] py-3.5 focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-error">
            {/* Todos los errores del servidor ofrecen el email como salida: si
                el envío falla, la consulta no se pierde. */}
            <p className="text-small text-ink">
              {errorServidor.antes}
              {errorServidor.enlace && <TextLink href={`mailto:${email}`} className="[overflow-wrap:anywhere]">{errorServidor.enlace}</TextLink>}
              {errorServidor.despues}
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button type="submit" size="lg" arrow disabled={disabled} className="max-[559px]:w-full">
            {status === "sending" ? texts.boton_enviando : texts.boton}
          </Button>
          <span className="text-caption text-ink-2">{sinCortes(texts.nota_envio)}</span>
        </div>
        <p role="status" aria-live="polite" className="sr-only">{status === "sending" ? texts.estados.enviando_aria : ""}</p>
      </form>
    </div>
  );
}

function ContextualContactForm(props: ContactFormProps) {
  const searchParams = useSearchParams();
  const context = getContactContext(searchParams.get("necesidad"), searchParams.get("proyecto"));
  return <ContactFormContent {...props} context={context} />;
}

/**
 * Formulario de contacto (especificación 3.8). Conserva la lógica del
 * anterior: validación compartida con el servidor (`validateContactPayload`),
 * `POST /api/contact` con `Idempotency-Key` y reintento con el mismo id,
 * límites y tiempos de `CONTACT_LIMITS` y `CONTACT_TIMEOUTS`, foco al primer
 * error, al error del servidor y al mensaje de enviado, y eventos de
 * analítica. Lee `?necesidad=` y `?proyecto=` para preseleccionar tema y
 * proyecto. Sin JS los campos quedan deshabilitados y se ofrece el email.
 */
export function ContactForm(props: ContactFormProps) {
  return (
    <Suspense fallback={<ContactFormContent {...props} context={noContext} forceDisabled />}>
      <ContextualContactForm {...props} />
    </Suspense>
  );
}
