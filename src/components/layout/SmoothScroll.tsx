"use client";

import { useSyncExternalStore } from "react";
import { ReactLenis } from "lenis/react";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll suavizado con Lenis. Se desactiva con prefers-reduced-motion. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 1.05,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
