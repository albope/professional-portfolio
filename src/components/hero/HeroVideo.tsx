"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getImageProps } from "next/image";
import type { Copy } from "@/data/copy";
import { cn } from "@/lib/utils";
import { REDUCED_MOTION, useReducedMotion } from "@/lib/useInView";
import styles from "./HeroVideo.module.css";

/**
 * Estados de la figura (`data-state`), que lee `HeroVideo.module.css`:
 * `idle` (póster del caos, a la espera de entrar en pantalla), `play`,
 * `paused` y `done` (el vídeo se queda en su último fotograma).
 */
type Fase = "idle" | "play" | "paused" | "done";

/** Parte visible de la figura para arrancar: en la práctica, al cargar. */
const UMBRAL = 0.3;

/** Momento en que la red de seguridad de la CSS enseña el fotograma final. */
const RED_DE_SEGURIDAD = 7000;

/** Corte de escritorio desde 768 px, como las dos composiciones del SVG. */
const ESCRITORIO = "(min-width: 768px)";

/**
 * Vídeos y pósters en `public/hero/`, generados en `video/hero-orden` con
 * /brag-slim. Mismas proporciones que el SVG anterior: 1280 × 1080 (64:54) y
 * 960 × 900 (320:300).
 */
const CORTES = {
  escritorio: { ancho: 1280, alto: 1080 },
  movil: { ancho: 960, alto: 900 },
} as const;
const ruta = (corte: keyof typeof CORTES, sufijo: string) => `/hero/hero-orden-${corte}${sufijo}`;

/** Ancho de la figura: 690 px desde 1180, 600 hasta 1179 y 440 en móvil. */
const SIZES = "(min-width: 1180px) 690px, (min-width: 768px) 600px, min(calc(100vw - 32px), 440px)";

/**
 * Póster con dirección de arte: el `srcSet` de escritorio va en `<source>` y
 * el de móvil en el `<img>`. `alt` vacío: el nombre accesible lo lleva el
 * escenario (`role="img"`). Los dos se cargan sin diferir: el final es el LCP
 * con movimiento reducido o sin JS, y el de inicio (prioridad alta) con
 * movimiento.
 */
function Poster({ fotograma, className, prioridad }: { fotograma: "inicio" | "final"; className: string; prioridad: boolean }) {
  const comun = { alt: "", sizes: SIZES, loading: "eager" as const };
  const {
    props: { srcSet: escritorio },
  } = getImageProps({ ...comun, width: CORTES.escritorio.ancho, height: CORTES.escritorio.alto, src: ruta("escritorio", `-${fotograma}.png`) });
  const {
    props: { srcSet: movil, ...img },
  } = getImageProps({ ...comun, width: CORTES.movil.ancho, height: CORTES.movil.alto, src: ruta("movil", `-${fotograma}.png`) });
  return (
    <picture className={className}>
      {/* Sin su propio `sizes`, el `<source>` vale 100vw y pide la de 1920. */}
      <source media={ESCRITORIO} srcSet={escritorio} sizes={SIZES} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- `img` sale de getImageProps con alt="" */}
      <img {...img} srcSet={movil} fetchPriority={prioridad ? "high" : undefined} />
    </picture>
  );
}

/** ¿La red de seguridad de la CSS ya ha enseñado el fotograma final? */
function redYaActuo(figure: HTMLElement) {
  if (typeof figure.getAnimations !== "function") return false;
  return figure.getAnimations({ subtree: true }).some(
    (animation) =>
      animation instanceof CSSAnimation &&
      animation.animationName.includes("red") &&
      Number(animation.currentTime ?? 0) >= RED_DE_SEGURIDAD,
  );
}

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

interface HeroVideoProps {
  /** Texto alternativo del vídeo. */
  titulo: string;
  /** Pie de la figura. */
  pie: string;
  /** Rótulos y nombres accesibles del control. */
  control: Copy["hero"]["ilustracion"]["control"];
  className?: string;
}

/**
 * Figura del hero con el vídeo del caos al orden: se reproduce una vez al
 * entrar en pantalla y se queda en su último fotograma, con «Ver de nuevo».
 *
 * - Sin JS o con movimiento reducido se ve el fotograma final, en imagen, y
 *   no hay control. Con JS y movimiento permitido (`.js`, que pone el layout
 *   antes de pintar) se ve el póster del caos hasta que el vídeo pinta su
 *   primer fotograma, que es el mismo. Si la hidratación no llega, la CSS
 *   enseña el final a los 7 s.
 * - Solo se descarga el corte visible (`<source media>`, `preload="none"`).
 * - Nada corre fuera de pantalla ni con la pestaña oculta: se pausa y al
 *   volver sigue. Esa pausa no cuenta como la del visitante.
 * - Si el navegador no deja reproducir (ahorro de batería), se queda en el
 *   final y «Ver de nuevo» lo intenta con el gesto del visitante.
 * - El control (WCAG 2.2.2) ocupa su sitio invisible (`inert`) hasta que el
 *   vídeo arranca, para que el pie no cambie de ancho al aparecer.
 */
export function HeroVideo({ titulo, pie, control, className }: HeroVideoProps) {
  const figureRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pieId = useId();
  const accionRef = useRef<(() => void) | null>(null);
  const [fase, setFase] = useState<Fase>("idle");
  const [pintando, setPintando] = useState(false);
  const [final, setFinal] = useState(false);
  const [hidratado, setHidratado] = useState(false);
  const reducido = useReducedMotion();

  useEffect(() => {
    const figure = figureRef.current;
    const video = videoRef.current;
    if (!figure || !video || reducido || typeof IntersectionObserver === "undefined" || window.matchMedia(REDUCED_MOTION).matches) {
      return;
    }

    let estado: Fase = "idle";
    let visible = false;
    let primera = true;
    const cambiar = (nueva: Fase) => {
      estado = nueva;
      setFase(nueva);
    };

    // Se queda en el fotograma final (imagen) y el control ofrece verlo.
    const quedarseEnElFinal = () => {
      video.pause();
      setFinal(true);
      setPintando(false);
      cambiar("done");
    };

    const reproducir = () => {
      video.play().catch((error: unknown) => {
        // `pause()` antes de que arranque rechaza la promesa: no es un fallo.
        if (error instanceof DOMException && error.name === "AbortError") return;
        quedarseEnElFinal();
      });
    };

    const escritorio = window.matchMedia(ESCRITORIO);
    const corteVisible = () => (escritorio.matches ? "escritorio" : "movil");

    const empezar = () => {
      setFinal(false);
      cambiar("play");
      // El `<source media>` se elige al cargar la página. Si desde entonces
      // se ha cruzado 768 px, se vuelve a elegir justo antes de reproducir:
      // `load()` descarga, así que solo se llama cuando se va a ver.
      if (!video.currentSrc.includes(`-${corteVisible()}.`)) {
        setPintando(false);
        video.load();
      } else if (video.currentTime > 0) {
        video.currentTime = 0;
      }
      reproducir();
    };

    const actualizar = () => {
      const ahora = visible && !document.hidden;
      if (estado === "idle" && ahora) empezar();
      else if (estado === "play" && !ahora) video.pause();
      else if (estado === "play" && ahora && video.paused) reproducir();
    };

    const alPintar = () => setPintando(true);
    const alTerminar = () => cambiar("done");

    // Si al hidratar la red de seguridad ya enseña el final, se queda ahí.
    if (redYaActuo(figure)) {
      setFinal(true);
      cambiar("done");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible = entry.isIntersecting && entry.intersectionRatio >= UMBRAL - 0.01;
        if (primera) {
          primera = false;
          setHidratado(true);
        }
        actualizar();
      },
      { threshold: UMBRAL },
    );
    observer.observe(figure);
    document.addEventListener("visibilitychange", actualizar);
    video.addEventListener("playing", alPintar);
    video.addEventListener("ended", alTerminar);

    // Al cruzar 768 px cambia el corte. Si el vídeo ya ha arrancado, se deja
    // el final del corte nuevo, sin repetirlo por sorpresa. En `idle` no hay
    // nada que hacer: `empezar()` elegirá la fuente buena.
    const alCambiarDeCorte = () => {
      if (estado !== "idle") quedarseEnElFinal();
    };
    escritorio.addEventListener("change", alCambiarDeCorte);

    accionRef.current = () => {
      if (estado === "done") empezar();
      else if (estado === "paused") {
        cambiar("play");
        reproducir();
      } else if (estado === "play") {
        video.pause();
        cambiar("paused");
      }
    };

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", actualizar);
      video.removeEventListener("playing", alPintar);
      video.removeEventListener("ended", alTerminar);
      escritorio.removeEventListener("change", alCambiarDeCorte);
      video.pause();
      accionRef.current = null;
    };
  }, [reducido]);

  const modo: Modo = fase === "paused" ? "reanudar" : fase === "done" ? "repetir" : "pausar";
  const esperando = fase === "idle";
  const rotulo = { pausar: control.pausar, reanudar: control.reanudar, repetir: control.repetir }[modo];
  const nombre = { pausar: control.pausar_aria, reanudar: control.reanudar_aria, repetir: control.repetir_aria }[modo];

  return (
    <figure
      ref={figureRef}
      className={cn(styles.figure, className)}
      data-state={fase}
      data-painting={pintando ? "" : undefined}
      data-final={final ? "" : undefined}
      data-hydrated={hidratado ? "" : undefined}
      // El nombre de la figura es solo el pie: sin esto, el `figcaption` le
      // sumaría el del botón («… Pausar la animación»).
      aria-labelledby={pieId}
    >
      <div role="img" aria-label={titulo} className={cn(styles.stage, "max-[767px]:mx-auto max-[767px]:max-w-[440px]")}>
        <video ref={videoRef} className={styles.video} muted playsInline preload="none" disablePictureInPicture aria-hidden="true" tabIndex={-1}>
          <source media={ESCRITORIO} src={ruta("escritorio", ".mp4")} type="video/mp4" />
          <source src={ruta("movil", ".mp4")} type="video/mp4" />
        </video>
        <Poster fotograma="inicio" className={styles.inicio} prioridad />
        <Poster fotograma="final" className={styles.final} prioridad={false} />
      </div>
      <figcaption className={cn(styles.caption, "mt-4 flex items-start justify-between gap-x-5 gap-y-3 max-[767px]:mx-auto max-[767px]:max-w-[440px] 768:px-[6.875%]")}>
        <span id={pieId} className="max-w-[32em] text-caption leading-normal text-ink-2">
          {pie}
        </span>
        {/* 32 px de alto; el `::before` amplía el área táctil a 40. Solo existe
            con JS y movimiento permitido: mientras espera en `idle` ocupa su
            sitio sin verse ni recibir foco. */}
        <button
          type="button"
          hidden={reducido}
          inert={esperando}
          aria-hidden={esperando || undefined}
          aria-label={nombre}
          onClick={() => accionRef.current?.()}
          className={cn(
            "relative hidden h-8 shrink-0 items-center gap-[7px] rounded-pill border border-line-2 bg-transparent pl-2.5 pr-3 text-micro font-semibold leading-none text-ink transition-[border-color] duration-200 before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] hover:border-ink motion-safe:[.js_&]:inline-flex",
            esperando && "invisible",
          )}
        >
          <IconoControl modo={modo} />
          <span>{rotulo}</span>
        </button>
      </figcaption>
    </figure>
  );
}
