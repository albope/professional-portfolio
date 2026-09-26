"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { isOnScreen, REDUCED_MOTION, useInView, type InViewMode } from "@/lib/useInView";

interface PlayOnViewProps {
  /** El marcado animado, pintado en el servidor: no viaja en el JS del cliente. */
  children: ReactNode;
  /**
   * - `once` (por defecto): se reproduce una vez, al entrar. La agenda, la
   *   web, la propuesta y la línea del proceso.
   * - `each`: una pasada cada vez que entra. Entre pasada y pasada se queda
   *   quieta, no es un bucle. La conexión de datos.
   */
  mode?: InViewMode;
  /** Parte visible que dispara la reproducción: 0,35 por defecto, 0,5 la conexión. */
  threshold?: number;
  className?: string;
}

/**
 * Único trozo cliente de las ilustraciones de «Qué hacemos» (4.4 a 4.6) y de
 * la banda de tinta (4.7 y 4.8). Observa su entrada en pantalla y escribe
 * `data-state` en su propio nodo, que es de lo que cuelgan las reglas del CSS
 * Module de cada ilustración:
 *
 * - sin atributo: estado final. Es lo que pinta el servidor y lo que se queda
 *   sin JS, con movimiento reducido, sin `IntersectionObserver` y cuando una
 *   ilustración de una vez ya está a la vista al hidratar (así no se vacía
 *   ante los ojos del visitante para volver a llenarse).
 * - `idle`: armada, con los estados iniciales ocultos, a la espera de entrar.
 * - `play`: reproduciendo. Al terminar se queda en su último fotograma, que
 *   es el estado final (en la conexión, las tres filas de destino marcadas).
 * - `paused`: en modo `each`, sale de pantalla o se oculta la pestaña a
 *   mitad de pasada. Se congela y, al volver, empieza una pasada nueva.
 *
 * El atributo lo escribe este componente y no React, como `data-revealed` en
 * `RevealObserver`: ningún render lo pisa y el servidor nunca lo pinta. Los
 * estados ocultos, además, solo existen en CSS bajo `.js` y
 * `prefers-reduced-motion: no-preference`.
 *
 * El umbral baja si el bloque es muy alto para la pantalla: los cuatro pasos
 * del proceso apilados miden más de 1000 px a 320 de ancho y, con un móvil en
 * horizontal, el 35 % no llegaría a caber nunca y la línea se quedaría sin
 * dibujar.
 */
export function PlayOnView({ children, mode = "once", threshold = 0.35, className }: PlayOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  // `null` mientras no está armado: sin armar no hace falta observar nada.
  const [armed, setArmed] = useState<number | null>(null);
  const inView = useInView(ref, { mode, threshold: armed ?? threshold, enabled: armed !== null });

  // Armar antes de pintar lo hidratado. Si el JS no llega, no se arma nada.
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;
    if (mode === "once" && isOnScreen(node)) return;
    node.dataset.state = "idle";
    // El umbral depende del alto del bloque, que solo se conoce ya montado.
    const fits = (window.innerHeight * 0.6) / Math.max(node.offsetHeight, 1);
    setArmed(Math.min(threshold, fits));
  }, [mode, threshold]);

  useEffect(() => {
    const node = ref.current;
    if (!node?.dataset.state) return;
    if (inView) {
      // Quitar y volver a poner `play` con un reflujo en medio reinicia las
      // animaciones: así la conexión hace una pasada nueva en cada entrada.
      node.dataset.state = "idle";
      void node.getBoundingClientRect();
      node.dataset.state = "play";
    } else if (node.dataset.state === "play") {
      // Solo pasa en modo `each`: `once` no vuelve a `false`. Nada corre
      // fuera de pantalla ni con la pestaña oculta.
      node.dataset.state = "paused";
    }
  }, [inView]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
