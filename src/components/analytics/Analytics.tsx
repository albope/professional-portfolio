"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { parseAnalyticsEvent, trackEvent } from "@/lib/analytics";

/** One delegated listener; server-rendered links remain ordinary links. */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/proyectos/")) return;
    const event = parseAnalyticsEvent({
      name: "case_view", properties: { project: pathname.split("/")[2] },
    });
    if (event) trackEvent(event.name, event.properties);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLElement>("[data-track]");
      if (!link) return;
      const properties: Record<string, string> = {};
      for (const key of ["location", "destination", "need", "project"] as const) {
        const value = link.getAttribute(`data-track-${key}`);
        if (value) properties[key] = value;
      }
      const parsed = parseAnalyticsEvent({ name: link.dataset.track, properties });
      if (parsed) trackEvent(parsed.name, parsed.properties);
    };
    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
