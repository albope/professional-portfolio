"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/** Por debajo de 1024 px el carril se desliza; a partir de ahí es una rejilla. */
const RAIL = "(max-width: 1023.98px)";
const REDUCED = "(prefers-reduced-motion: reduce)";
const STEP_MS = 4000;

/**
 * Índice de la tarjeta que ocupa el borde izquierdo del carril.
 *
 * Se deduce del scroll real, no de un contador aparte: así el punto activo
 * es correcto tanto si el carril avanza solo como si lo desliza el visitante.
 * `offsetLeft` no cambia con el scroll, de modo que la distancia entre dos
 * hermanos es exactamente el `scrollLeft` que hace falta para pasar de una a
 * otra, sin depender del padding del carril ni del gap.
 */
function currentIndex(rail: HTMLElement) {
  const cards = Array.from(rail.children) as HTMLElement[];
  if (!cards.length) return { cards, index: 0 };
  const origin = cards[0].offsetLeft;
  let index = 0;
  let closest = Infinity;
  cards.forEach((card, i) => {
    const distance = Math.abs(card.offsetLeft - origin - rail.scrollLeft);
    if (distance < closest) {
      closest = distance;
      index = i;
    }
  });
  return { cards, index };
}

type Props = {
  /** Nombre del carril para quien navega con lector de pantalla. */
  label: string;
  /** Pista de deslizamiento que acompaña a los puntos de posición. */
  hint: ReactNode;
  /** Clases del carril; las tarjetas las pone quien lo usa. */
  className: string;
  children: ReactNode;
};

/**
 * Carril horizontal que avanza solo, pensado para la vista móvil.
 *
 * El contenido se sirve desde el servidor y se ve sin esperar a la
 * hidratación: este componente solo añade el movimiento y los puntos.
 *
 * El avance se detiene —para siempre, no unos segundos— en cuanto el
 * visitante toca, teclea o enfoca el carril: a partir de ahí manda él. Solo
 * corre mientras la sección está en pantalla y la pestaña visible, nunca por
 * encima de 1024 px y nunca con `prefers-reduced-motion`.
 *
 * Si el carril tiene relleno propio, quien lo usa debe darle un
 * `scroll-padding` a juego: el anclaje se mide contra la caja de relleno y
 * sin él las tarjetas ancladas se salen de la columna de la sección.
 */
export function AutoCarousel({ label, hint, className, children }: Props) {
  const rail = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [taken, setTaken] = useState(false);
  const total = Children.count(children);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      setIndex(currentIndex(el).index);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // El visitante toma el control: el carril deja de moverse por su cuenta.
  useEffect(() => {
    const el = rail.current;
    if (!el || taken) return;
    const handOver = () => setTaken(true);
    el.addEventListener("pointerdown", handOver);
    el.addEventListener("keydown", handOver);
    el.addEventListener("focusin", handOver);
    el.addEventListener("wheel", handOver, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", handOver);
      el.removeEventListener("keydown", handOver);
      el.removeEventListener("focusin", handOver);
      el.removeEventListener("wheel", handOver);
    };
  }, [taken]);

  useEffect(() => {
    const el = rail.current;
    if (!el || taken) return;

    const narrow = window.matchMedia(RAIL);
    const reduced = window.matchMedia(REDUCED);
    let onScreen = false;
    let timer: number | undefined;

    const advance = () => {
      const { cards, index: at } = currentIndex(el);
      if (cards.length < 2) return;
      const next = (at + 1) % cards.length;
      el.scrollTo({
        left: cards[next].offsetLeft - cards[0].offsetLeft,
        behavior: "smooth",
      });
    };

    const review = () => {
      const shouldRun =
        narrow.matches && !reduced.matches && onScreen && !document.hidden;
      if (shouldRun && timer === undefined) {
        timer = window.setInterval(advance, STEP_MS);
      } else if (!shouldRun && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const watcher = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        review();
      },
      { threshold: 0.5 },
    );
    watcher.observe(el);
    narrow.addEventListener("change", review);
    reduced.addEventListener("change", review);
    document.addEventListener("visibilitychange", review);

    return () => {
      watcher.disconnect();
      narrow.removeEventListener("change", review);
      reduced.removeEventListener("change", review);
      document.removeEventListener("visibilitychange", review);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [taken]);

  return (
    <>
      <div className="mt-9 flex items-center justify-between gap-4 lg:hidden">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/62">
          {hint}
        </p>
        {/* Los puntos solo repiten la posición dentro del carril, que ya es
            recorrible con teclado: sobran para un lector de pantalla. */}
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-0.5 w-6 transition-colors duration-500 ease-editorial",
                i === index ? "bg-cobalt-bright" : "bg-paper/24",
              )}
            />
          ))}
        </span>
      </div>
      <ul ref={rail} tabIndex={0} aria-label={label} className={className}>
        {children}
      </ul>
    </>
  );
}
