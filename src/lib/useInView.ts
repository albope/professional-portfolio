import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

/**
 * - `once`: pasa a `true` la primera vez que el elemento entra en pantalla con
 *   la pestaña visible y ya no vuelve a `false` (deja de observar). Para las
 *   ilustraciones que se reproducen una vez (agenda, web, propuesta, proceso).
 * - `each`: es `true` mientras el elemento está en pantalla y la pestaña
 *   visible, y vuelve a `false` al salir o al ocultar la pestaña. Para lo que
 *   se repite en cada entrada (conexión de datos). El hero no lo usa: lleva
 *   su propio observador en `HeroIllustration`.
 */
export type InViewMode = "once" | "each";

export interface InViewOptions {
  mode?: InViewMode;
  /** Parte visible necesaria: 0,35 las de una vez, 0,5 la conexión. */
  threshold?: number;
  rootMargin?: string;
  /** Con `false` no observa. Útil para no armar nada con movimiento reducido. */
  enabled?: boolean;
}

/**
 * Observa un elemento con `IntersectionObserver` y respeta `document.hidden`:
 * con la pestaña oculta el elemento cuenta como fuera de pantalla, así que
 * nada corre en segundo plano (especificación 4.0).
 *
 * ```tsx
 * const ref = useRef<SVGSVGElement>(null);
 * const reduced = useReducedMotion();
 * const inView = useInView(ref, { mode: "once", threshold: 0.35, enabled: !reduced });
 * return <svg ref={ref} data-state={inView ? "play" : "idle"}>…</svg>;
 * ```
 *
 * Sin `IntersectionObserver` devuelve siempre `false`: el componente se queda
 * en su estado final estático, que es el que pinta el servidor.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { mode = "once", threshold = 0, rootMargin = "0px", enabled = true }: InViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || typeof IntersectionObserver === "undefined") return;

    let intersecting = false;
    let latched = false;

    const update = () => {
      const visible = intersecting && !document.hidden;
      if (mode === "each") {
        setInView(visible);
        return;
      }
      if (visible && !latched) {
        latched = true;
        setInView(true);
        observer.disconnect();
        document.removeEventListener("visibilitychange", update);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        // Chrome da `isIntersecting` falso por debajo del umbral, pero la
        // especificación no: Firefox y Safari lo dan verdadero en cuanto el
        // elemento asoma. Mirar también la proporción iguala a todos.
        intersecting = entry.isIntersecting && entry.intersectionRatio >= threshold - 0.01;
        update();
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", update);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref, mode, threshold, rootMargin, enabled]);

  // En modo `each`, desactivar la observación equivale a estar fuera.
  return mode === "each" && !enabled ? false : inView;
}

/**
 * `true` si el elemento ya está a la vista: empieza por encima del 94 % del
 * alto de la ventana y no ha salido por arriba. Es el criterio de
 * `RevealObserver` (su margen inferior de -6 %) y el de las ilustraciones
 * para no vaciar ante los ojos del visitante lo que ya está viendo.
 */
export function isOnScreen(element: Element): boolean {
  const box = element.getBoundingClientRect();
  return box.top < window.innerHeight * 0.94 && box.bottom > 0;
}

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * `true` si el visitante pide movimiento reducido. En el servidor y durante
 * la hidratación vale `false`, pero da igual: los estados ocultos solo
 * existen en CSS bajo `prefers-reduced-motion: no-preference`. Sirve para no
 * arrancar temporizadores que no se van a ver.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}
