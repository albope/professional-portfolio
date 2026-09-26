import type { AnalyticsEventName, AnalyticsLocation, AnalyticsProperties } from "@/lib/analytics";

/**
 * Medición por atributos: `Analytics` escucha un solo `click` delegado y lee
 * `data-track` y `data-track-*` del enlace pulsado. Estas props son la única
 * vía para ponerlos, así el vocabulario queda tipado contra `analytics.ts`.
 * Módulo puro: lo pueden importar componentes de servidor y de cliente.
 */
export interface TrackingProps {
  /** Evento. Por defecto `cta_click` en cuanto hay `trackLocation`. */
  trackEvent?: Extract<AnalyticsEventName, "cta_click" | "case_open">;
  trackLocation?: AnalyticsLocation;
  trackDestination?: AnalyticsProperties["destination"];
  trackNeed?: AnalyticsProperties["need"];
  /**
   * Slug del proyecto. Admite `string` porque las fichas lo sacan de
   * `projects.ts`: un valor fuera del vocabulario hace que `Analytics`
   * descarte el evento, nunca que se envíe.
   */
  trackProject?: AnalyticsProperties["project"] | (string & {});
}

/** Convierte las props de medición en atributos `data-track-*`. */
export function trackingAttributes({
  trackEvent,
  trackLocation,
  trackDestination,
  trackNeed,
  trackProject,
}: TrackingProps) {
  const event = trackEvent ?? (trackLocation ? "cta_click" : undefined);
  if (!event) return {};
  return {
    "data-track": event,
    "data-track-location": trackLocation,
    "data-track-destination": trackDestination,
    "data-track-need": trackNeed,
    "data-track-project": trackProject,
  };
}
