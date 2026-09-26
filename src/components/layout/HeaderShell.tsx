"use client";

import { useSyncExternalStore, type ReactNode } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/**
 * Carcasa de la cabecera: `sticky` sobre `bg` y un filete `line` que aparece
 * al pasar de 8 px de scroll (transición de 250 ms). Solo re-renderiza cuando
 * cambia ese sí o no, no en cada evento de scroll. Sin JS la cabecera se
 * queda fija y sin filete, que también se lee bien.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribe, () => window.scrollY > 8, () => false);
  return (
    <header
      data-scrolled={scrolled ? "" : undefined}
      className="sticky top-0 z-40 border-b border-transparent bg-bg transition-[border-color] duration-[250ms] data-[scrolled]:border-line"
    >
      {children}
    </header>
  );
}
