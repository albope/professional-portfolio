"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { booking } from "@/data/booking";
import { cn } from "@/lib/utils";

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
    light: { "cal-brand": "#2743e0", "cal-brand-emphasis": "#1e35b8", "cal-brand-text": "#ffffff" },
    dark: { "cal-brand": "#6b83ff", "cal-brand-emphasis": "#6b83ff", "cal-brand-text": "#101013" },
  },
} as const;

interface BookingLinkProps {
  location: "contact" | "case";
  project?: string;
  className?: string;
}

/** The ordinary link also works before hydration, without JS, or in another tab. */
export function BookingLink({ location, project, className }: BookingLinkProps) {
  const id = useId();
  const namespace = `bpm-booking-${id.replace(/[^a-zA-Z0-9-]/g, "")}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [Embed, setEmbed] = useState<CalEmbed | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");

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
      if (frame) frame.title = `Agenda de BPM Tech: llamada de ${booking.durationMinutes} minutos`;
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
  }, [open, namespace]);

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

  return (
    <>
      <a
        ref={triggerRef}
        href={booking.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openBooking}
        data-track="cta_click"
        data-track-location={location}
        data-track-destination="booking"
        data-track-project={project}
        className={cn("inline-flex min-h-12 items-center justify-center gap-3 border border-paper/40 px-5 py-4 text-center text-sm font-semibold leading-snug text-paper transition-colors hover:border-cobalt-bright hover:text-cobalt-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt-bright", className)}
      >
        {booking.ctaLabel} <span aria-hidden="true">↗</span>
      </a>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onClose={finishClose}
        onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
        className="m-auto h-[min(900px,calc(100dvh-24px))] max-h-none w-[calc(100%-24px)] max-w-[1160px] overflow-hidden border border-line bg-paper p-0 text-left text-ink shadow-2xl backdrop:bg-ink/70 sm:w-[calc(100%-48px)]"
      >
        <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
          <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-4 sm:px-6">
            <div>
              <p className="label-mono mb-2 text-cobalt">BPM Tech · Hablemos</p>
              <h2 id={`${id}-title`} className="text-xl font-semibold sm:text-2xl">Elige día y hora</h2>
              <p id={`${id}-description`} className="mt-2 text-sm leading-relaxed text-ink-mute">
                {booking.durationMinutes} minutos · Videollamada sin compromiso
              </p>
            </div>
            <button
              type="button"
              aria-label="Cerrar agenda"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center border border-line text-xl transition-colors hover:border-ink"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div ref={embedRef} className="relative min-h-0 overflow-y-auto overscroll-contain bg-white p-1 sm:p-3" aria-busy={status === "loading"}>
            {status !== "ready" && (
              <p role="status" className="px-4 py-6 text-center text-sm leading-relaxed text-ink-mute">
                {status === "loading" ? "Cargando los horarios disponibles…" : status === "slow"
                  ? "La agenda está tardando en cargar. Puedes abrirla directamente en Cal.com con el enlace de abajo."
                  : "No se ha podido cargar la agenda aquí. Puedes abrirla directamente en Cal.com con el enlace de abajo."}
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

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line px-4 py-2 sm:px-6">
            <p className="text-xs text-ink-mute">Reservas gestionadas por Cal.com</p>
            <a href={booking.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cobalt underline underline-offset-4">
              Abrir en Cal.com <span aria-hidden="true">↗</span><span className="sr-only"> (nueva pestaña)</span>
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
