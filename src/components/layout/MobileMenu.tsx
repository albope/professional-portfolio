"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const DESKTOP = "(min-width: 1180px)";

interface MobileMenuProps {
  /** `aria-label` del botón: «Abrir el menú». */
  label: string;
  /** Enlaces y acciones del panel, pintados por el servidor. */
  children: ReactNode;
  className?: string;
}

/**
 * Menú por debajo de 1180 px (especificación 3.1). Es un `<details>`, así
 * que abre y cierra sin JS. Con JS, además:
 * - se cierra al elegir un enlace del panel,
 * - Escape lo cierra y devuelve el foco al botón,
 * - un clic fuera lo cierra,
 * - si la ventana crece hasta 1180 px se cierra (allí manda la navegación).
 * El botón es de 44 × 44 y sus dos barras giran a aspa en 0,25 s.
 */
export function MobileMenu({ label, children, className }: MobileMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const details = detailsRef.current;
    if (!open || !details) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      details.open = false;
      summaryRef.current?.focus();
    };
    const onClick = (event: globalThis.MouseEvent) => {
      if (event.target instanceof Node && !details.contains(event.target)) details.open = false;
    };
    const desktop = window.matchMedia(DESKTOP);
    const onDesktop = () => {
      if (desktop.matches) details.open = false;
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  /** Delegación: cualquier enlace del panel cierra el menú al pulsarlo. */
  function closeOnLink(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest("a") && detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  return (
    <details
      ref={detailsRef}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className={cn("group/menu", className)}
    >
      <summary
        ref={summaryRef}
        aria-label={label}
        className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-control border border-line-2 transition-colors duration-200 hover:border-ink [&::-webkit-details-marker]:hidden"
      >
        <span
          aria-hidden="true"
          className="relative h-3 w-[18px] before:absolute before:inset-x-0 before:top-0.5 before:h-0.5 before:bg-ink before:transition-[transform,top] before:duration-[250ms] before:ease-soft after:absolute after:inset-x-0 after:top-2 after:h-0.5 after:bg-ink after:transition-[transform,top] after:duration-[250ms] after:ease-soft group-open/menu:before:top-[5px] group-open/menu:before:rotate-45 group-open/menu:after:top-[5px] group-open/menu:after:-rotate-45"
        />
      </summary>
      <div
        onClick={closeOnLink}
        className="fixed inset-x-0 top-header max-h-[calc(100dvh-var(--head-h))] overflow-y-auto border-y border-line bg-bg px-gutter pb-6 pt-3 shadow-menu"
      >
        {children}
      </div>
    </details>
  );
}
