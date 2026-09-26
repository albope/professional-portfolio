"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { booking } from "@/data/booking";
import type { Copy } from "@/data/copy";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { BaseLink, NEW_TAB_NOTE_ID, trackingAttributes } from "@/components/ui/BaseLink";
import { ButtonArrow, buttonClasses, type ButtonSize } from "@/components/ui/Button";
import { ArrowLinkIcon, arrowLinkClasses, arrowLinkLabelClasses } from "@/components/ui/ArrowLink";
import { textLinkClasses } from "@/components/ui/TextLink";
import type { AnalyticsLocation } from "@/lib/analytics";

type CalEmbed = typeof import("@calcom/embed-react").default;
type CalApi = Awaited<ReturnType<typeof import("@calcom/embed-react").getCalApi>>;
type LoadStatus = "loading" | "ready" | "slow" | "failed";

const embedConfig = {
  theme: "light",
  layout: "month_view",
  "ui.color-scheme": "light",
  useSlotsViewOnSmallScreen: "true",
} as const;

// The dialog already explains the call. Keep the booking calendar compact, with
// its timezone selector visible (supported by the hosted embed's public API).
const calendarUi = {
  theme: "light",
  layout: "month_view",
  hideEventTypeDetails: true,
  showTimezoneWhenEventDetailsHidden: true,
  cssVarsPerTheme: {
    light: { "cal-brand": "#2743e0", "cal-brand-emphasis": "#1d33b3", "cal-brand-text": "#ffffff" },
    dark: { "cal-brand": "#6b83ff", "cal-brand-emphasis": "#6b83ff", "cal-brand-text": "#101013" },
  },
} as const;

const sinSuscripcion = () => () => {};

export type BookingVariant = "link" | "ghost" | "arrow";
export type BookingSurface = "light" | "dark";

export interface BookingDialogLinkProps {
  location: AnalyticsLocation;
  project?: string;
  variant: BookingVariant;
  on: BookingSurface;
  size?: ButtonSize;
  label: string;
  texts: Copy["reserva"]["dialogo"];
  className?: string;
}

/**
 * Parte cliente de `BookingLink`: el disparador y el diálogo con la agenda de
 * Cal.com. Recibe los textos por props para no meter `copy.json` en el JS del
 * navegador. Úsalo a través de `BookingLink`.
 *
 * El enlace es un enlace normal a Cal.com: funciona antes de hidratar, sin JS
 * o abierto en otra pestaña. Con JS, un clic normal abre el diálogo y carga
 * el embed solo entonces. Por eso se anuncia distinto antes y después de
 * hidratar: en el HTML del servidor es un enlace que se abre en otra pestaña
 * (con el aviso, como los demás externos) y, con JS, un disparador de
 * diálogo (`aria-haspopup`, `aria-expanded`).
 */
export function BookingDialogLink({
  location,
  project,
  variant,
  on,
  size = "md",
  label,
  texts,
  className,
}: BookingDialogLinkProps) {
  const id = useId();
  const namespace = `bpm-booking-${id.replace(/[^a-zA-Z0-9-]/g, "")}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [Embed, setEmbed] = useState<CalEmbed | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const hidratado = useSyncExternalStore(sinSuscripcion, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    let active = true;
    let api: CalApi | undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      if (active) setStatus((current) => current === "loading" ? "slow" : current);
    }, 12_000);
    const ready = () => {
      if (!active) return;
      window.clearTimeout(timer);
      const frame = embedRef.current?.querySelector("iframe");
      if (frame) frame.title = texts.agenda_titulo;
      setStatus("ready");
    };
    const failed = () => {
      if (!active) return;
      window.clearTimeout(timer);
      setStatus("failed");
    };

    // No SDK, script, iframe, or calendar request until the visitor opens the dialog.
    void import("@calcom/embed-react").then(async ({ default: Cal, getCalApi }) => {
      if (!active) return;
      const cal = await getCalApi({ namespace });
      if (!active) return;
      api = cal;
      cal("on", { action: "linkReady", callback: ready });
      cal("on", { action: "linkFailed", callback: failed });
      cal("ui", calendarUi);
      setEmbed(() => Cal);
    }).catch(failed);

    return () => {
      active = false;
      window.clearTimeout(timer);
      api?.("off", { action: "linkReady", callback: ready });
      api?.("off", { action: "linkFailed", callback: failed });
      document.body.style.overflow = previousOverflow;
    };
  }, [open, namespace, texts.agenda_titulo]);

  function openBooking(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== "function") return;
    dialog.showModal();
    event.preventDefault();
    setStatus("loading");
    setEmbed(null);
    setOpen(true);
  }

  function finishClose() {
    setOpen(false);
    setEmbed(null);
    triggerRef.current?.focus({ preventScroll: true });
  }

  const dark = on === "dark";
  const trigger =
    variant === "ghost"
      ? { className: buttonClasses({ variant: "ghost", on, size, className }), content: <>{label}<ButtonArrow /></> }
      : variant === "arrow"
        ? {
            className: arrowLinkClasses({ tone: dark ? "on-dark" : "ink", className }),
            content: <><span className={arrowLinkLabelClasses}>{label}</span><ArrowLinkIcon /></>,
          }
        : { className: textLinkClasses({ on, standalone: true, className }), content: label };

  return (
    <>
      <a
        ref={triggerRef}
        href={booking.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup={hidratado ? "dialog" : undefined}
        aria-expanded={hidratado ? open : undefined}
        aria-describedby={hidratado ? undefined : NEW_TAB_NOTE_ID}
        onClick={openBooking}
        {...trackingAttributes({ trackLocation: location, trackDestination: "booking", trackProject: project })}
        className={trigger.className}
      >
        {trigger.content}
      </a>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onClose={finishClose}
        onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
        className="m-auto h-[min(900px,calc(100dvh-24px))] max-h-none w-[calc(100%-24px)] max-w-[1160px] overflow-hidden rounded-form border border-line bg-bg p-0 text-left text-ink shadow-form backdrop:bg-ink/60 600:w-[calc(100%-48px)]"
      >
        <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 600:px-7 600:py-5">
            <div className="min-w-0">
              <h2 id={`${id}-title`} className="text-h3">{texts.titulo}</h2>
              <p id={`${id}-description`} className="mt-1 text-small text-ink-2">{texts.descripcion}</p>
            </div>
            <button
              type="button"
              aria-label={texts.cerrar}
              onClick={() => dialogRef.current?.close()}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line-2 text-ink transition-colors duration-200 hover:border-ink"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="h-4 w-4">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Región con nombre: mientras carga (o si falla) el contenedor ya
              tiene scroll y Chrome lo vuelve una parada de tabulación. Así
              esa parada dice qué es en lugar de ser un bloque sin rol. */}
          <div
            ref={embedRef}
            role="region"
            aria-label={texts.agenda_titulo}
            className="relative min-h-0 overflow-y-auto overscroll-contain bg-surface p-1 600:p-3"
            aria-busy={status === "loading"}
          >
            {status !== "ready" && (
              <p role="status" className="px-4 py-6 text-center text-small text-ink-2">
                {status === "loading" ? texts.cargando : status === "slow" ? texts.lento : texts.fallo}
              </p>
            )}
            {open && Embed && status !== "failed" && (
              <Embed
                namespace={namespace}
                calLink={booking.calLink}
                calOrigin="https://cal.com"
                config={embedConfig}
                style={{ width: "100%", height: "100%", minHeight: 460, overflow: "auto" }}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line px-5 py-1.5 600:px-7">
            <p className="text-micro text-ink-2">{texts.gestion}</p>
            <BaseLink
              href={booking.url}
              external
              className={cn(textLinkClasses({ standalone: true }), "gap-1.5 text-small font-semibold")}
            >
              {texts.abrir}
              <ArrowIcon direction="up-right" className="h-3.5 w-3.5" />
            </BaseLink>
          </div>
        </div>
      </dialog>
    </>
  );
}
