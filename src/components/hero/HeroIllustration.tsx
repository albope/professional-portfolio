"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Copy } from "@/data/copy";
import { cn } from "@/lib/utils";
import { REDUCED_MOTION, useReducedMotion } from "@/lib/useInView";
import styles from "./HeroIllustration.module.css";

/**
 * Estados de la figura (`data-state`), que lee `HeroIllustration.module.css`:
 * `idle` (caos quieto, a la espera de entrar en pantalla), `play` (del caos
 * al orden, 4 s), `live` (reposo con recordatorios), `paused` y `done`.
 */
type Fase = "idle" | "play" | "live" | "paused" | "done";

interface Vista {
  fase: Fase;
  /** Pieza que reaparece y vuelve a su fila (`data-reminder`). */
  recordatorio: number | null;
  /** Su fila destella (`data-flash`). */
  destello: boolean;
}

/** Tiempos de la especificación 4.1, en milisegundos. */
const TIEMPO = {
  /** De `play` a `live`: el último resalte ya se ha apagado. */
  reposo: 4000,
  /** Primer recordatorio tras el reposo. */
  primerRecordatorio: 2000,
  /** Un recordatorio cada 6 s, uno por pieza, y parada. */
  entreRecordatorios: 6000,
  /** La fila destella cuando la pieza llega a ella. */
  destello: 2650,
  /** Al volver a pantalla o a la pestaña, retoma el recordatorio pendiente. */
  alVolver: 1500,
  /** Al pulsar «Reanudar». */
  alReanudar: 800,
} as const;

/** Parte visible del SVG para arrancar (4.1): en la práctica, al cargar. */
const UMBRAL = 0.3;

const sinSuscripcion = () => () => {};

type Modo = "pausar" | "reanudar" | "repetir";

function IconoControl({ modo }: { modo: Modo }) {
  const props = { viewBox: "0 0 12 12", "aria-hidden": true, focusable: false, className: "h-3 w-3 shrink-0" } as const;
  if (modo === "pausar") {
    return (
      <svg {...props}>
        <rect x="2" y="1.5" width="2.6" height="9" fill="currentColor" />
        <rect x="7.4" y="1.5" width="2.6" height="9" fill="currentColor" />
      </svg>
    );
  }
  if (modo === "reanudar") {
    return (
      <svg {...props}>
        <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.8 4.4A4.3 4.3 0 1 0 10.3 7" />
      <path d="M10.4 1.4v3.4H7" />
    </svg>
  );
}

interface HeroIllustrationProps {
  /** Las dos composiciones (`HeroArt`), pintadas en el servidor. */
  children: ReactNode;
  /** Pie de la ilustración. */
  pie: string;
  /** Rótulos y nombres accesibles del control de la animación. */
  control: Copy["hero"]["ilustracion"]["control"];
  className?: string;
}

/**
 * Figura del hero con la máquina de estados de la animación (5.5):
 * `idle → play (4 s) → live → recordatorios (uno por pieza, cada 6 s) → done`,
 * con `paused` desde `play` o `live` y «Ver de nuevo» desde `done`.
 *
 * - Solo escribe `data-state`, `data-reminder` y `data-flash` en la figura:
 *   el SVG lo pinta el servidor y la CSS hace el resto.
 * - Nada corre fuera de pantalla ni con la pestaña oculta: al salir se
 *   limpian los temporizadores y el recordatorio en curso, y al volver se
 *   retoma el siguiente. También se limpia todo al desmontar.
 * - Con movimiento reducido no se arma: el control sigue oculto y la CSS deja
 *   el estado final.
 * - El control (WCAG 2.2.2) nace con `hidden` y solo aparece cuando la
 *   animación ha empezado. Actúa sobre la composición visible.
 */
export function HeroIllustration({ children, pie, control, className }: HeroIllustrationProps) {
  const figureRef = useRef<HTMLElement>(null);
  const pieId = useId();
  const accionRef = useRef<(() => void) | null>(null);
  const [vista, setVista] = useState<Vista>({ fase: "idle", recordatorio: null, destello: false });
  const reducido = useReducedMotion();
  // `false` en el servidor y al hidratar, `true` después: apaga la red de
  // seguridad de la CSS, que recoge el caos si el JS no llega a hidratar.
  const hidratado = useSyncExternalStore(sinSuscripcion, () => true, () => false);

  useEffect(() => {
    const figure = figureRef.current;
    if (
      reducido ||
      !figure ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia(REDUCED_MOTION).matches
    ) {
      return;
    }

    const artes = Array.from(figure.querySelectorAll<SVGSVGElement>("svg[data-hero-art]"));
    const enPantalla = new Set<Element>();
    let fase: Fase = "idle";
    let siguiente = 0;
    let visible = false;
    let temporizadores: number[] = [];

    const pintar = (recordatorio: number | null = null, destello = false) =>
      setVista({ fase, recordatorio, destello });
    const despues = (accion: () => void, ms: number) => {
      temporizadores.push(window.setTimeout(accion, ms));
    };
    const limpiar = () => {
      temporizadores.forEach((id) => window.clearTimeout(id));
      temporizadores = [];
    };
    // Cuatro piezas en escritorio y tres en móvil: cuenta las de la
    // composición que se ve ahora (la otra mide 0 por `display: none`).
    const piezas = () => {
      const arte = artes.find((svg) => svg.getBoundingClientRect().width > 0);
      return arte ? arte.querySelectorAll("[data-piece]").length : 0;
    };

    const recordar = () => {
      if (fase !== "live" || !visible) return;
      if (siguiente >= piezas()) {
        fase = "done";
        pintar();
        return;
      }
      const actual = siguiente++;
      pintar(actual);
      despues(() => pintar(actual, true), TIEMPO.destello);
      despues(recordar, TIEMPO.entreRecordatorios);
    };

    const reposar = () => {
      fase = "live";
      pintar();
      if (visible) despues(recordar, TIEMPO.primerRecordatorio);
    };

    const empezar = () => {
      limpiar();
      fase = "play";
      siguiente = 0;
      pintar();
      despues(reposar, TIEMPO.reposo);
    };

    // Solo actúa en los cambios: entra o sale de pantalla, o la pestaña se
    // oculta o vuelve.
    const actualizar = () => {
      const ahora = enPantalla.size > 0 && !document.hidden;
      if (ahora === visible) return;
      visible = ahora;
      if (visible && fase === "idle") {
        empezar();
      } else if (fase === "live") {
        limpiar();
        pintar();
        if (visible) despues(recordar, TIEMPO.alVolver);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Chrome ya da `isIntersecting` falso por debajo del umbral, pero la
          // especificación no: sin mirar la proporción, Firefox y Safari
          // arrancarían con la figura asomando apenas.
          if (entry.isIntersecting && entry.intersectionRatio >= UMBRAL - 0.01) enPantalla.add(entry.target);
          else enPantalla.delete(entry.target);
        }
        actualizar();
      },
      { threshold: UMBRAL },
    );
    artes.forEach((svg) => observer.observe(svg));
    document.addEventListener("visibilitychange", actualizar);

    accionRef.current = () => {
      if (fase === "done") {
        empezar();
      } else if (fase === "paused") {
        fase = "live";
        pintar();
        despues(recordar, TIEMPO.alReanudar);
      } else if (fase === "play" || fase === "live") {
        // Se detiene todo y queda el estado ordenado, sin resaltes.
        limpiar();
        fase = "paused";
        pintar();
      }
    };

    return () => {
      limpiar();
      observer.disconnect();
      document.removeEventListener("visibilitychange", actualizar);
      accionRef.current = null;
    };
  }, [reducido]);

  const modo: Modo = vista.fase === "paused" ? "reanudar" : vista.fase === "done" ? "repetir" : "pausar";
  const rotulo = { pausar: control.pausar, reanudar: control.reanudar, repetir: control.repetir }[modo];
  const nombre = { pausar: control.pausar_aria, reanudar: control.reanudar_aria, repetir: control.repetir_aria }[modo];

  return (
    <figure
      ref={figureRef}
      className={cn(styles.figure, className)}
      data-state={vista.fase}
      data-reminder={vista.recordatorio ?? undefined}
      data-flash={vista.destello ? "" : undefined}
      data-hydrated={hidratado ? "" : undefined}
      // El nombre de la figura es solo el pie: sin esto, el `figcaption` le
      // sumaría el del botón («… Pausar la animación»).
      aria-labelledby={pieId}
    >
      {children}
      <figcaption className="mt-4 flex items-start justify-between gap-x-5 gap-y-3 max-[767px]:mx-auto max-[767px]:max-w-[440px] 768:px-[6.875%]">
        <span id={pieId} className="max-w-[32em] text-caption leading-normal text-ink-2">
          {pie}
        </span>
        {/* 32 px de alto como pide 4.3; el `::before` amplía el área táctil a 40. */}
        <button
          type="button"
          hidden={reducido || vista.fase === "idle"}
          aria-label={nombre}
          onClick={() => accionRef.current?.()}
          className="relative inline-flex h-8 shrink-0 items-center gap-[7px] rounded-pill border border-line-2 bg-transparent pl-2.5 pr-3 text-micro font-semibold leading-none text-ink transition-[border-color] duration-200 before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] hover:border-ink"
        >
          <IconoControl modo={modo} />
          <span>{rotulo}</span>
        </button>
      </figcaption>
    </figure>
  );
}
