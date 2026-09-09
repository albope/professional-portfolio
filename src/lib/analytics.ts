/** Fixed vocabulary only. Form values, URLs and visitor identifiers never belong here. */
export const ANALYTICS_EVENTS = [
  "cta_click", "case_open", "case_view", "form_start", "form_validation_error", "contact_error",
] as const;
export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

const values = {
  location: ["header", "hero", "service", "projects", "case", "about", "contact", "footer"],
  destination: ["contact", "projects"],
  need: ["operativa", "automatizacion", "web"],
  project: ["asistente-ia-gestion-proyectos", "plataforma-clubes-padel", "wms-almacen", "web-boda", "web-radio"],
  field: ["nombre", "empresa", "email", "telefono", "mensaje", "requestId"],
  code: ["required", "invalid", "too_long", "network", "timeout", "rate_limited", "unavailable", "provider", "unexpected", "invalid_request", "too_large"],
} as const;

export type AnalyticsProperties = {
  [K in keyof typeof values]?: (typeof values)[K][number];
};
export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties: AnalyticsProperties;
}

export function parseAnalyticsEvent(input: unknown): AnalyticsEvent | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const record = input as Record<string, unknown>;
  if (Object.keys(record).some((key) => key !== "name" && key !== "properties")) return null;
  if (!ANALYTICS_EVENTS.includes(record.name as AnalyticsEventName)) return null;
  const properties = record.properties ?? {};
  if (!properties || typeof properties !== "object" || Array.isArray(properties)) return null;
  const safe: AnalyticsProperties = {};
  for (const [key, value] of Object.entries(properties)) {
    if (!Object.prototype.hasOwnProperty.call(values, key) || typeof value !== "string") return null;
    const allowed = values[key as keyof typeof values] as readonly string[];
    if (!allowed.includes(value)) return null;
    Object.assign(safe, { [key]: value });
  }
  return { name: record.name as AnalyticsEventName, properties: safe };
}

let pageEventCount = 0;

export function trackEvent(name: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined" || pageEventCount >= 40) return;
  if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
  const event = parseAnalyticsEvent({ name, properties });
  if (!event) return;
  pageEventCount += 1;
  // No cookies, storage, identifiers, referrer, or dependency on a third party.
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    credentials: "omit",
    referrerPolicy: "no-referrer",
    keepalive: true,
  }).catch(() => undefined);
}
