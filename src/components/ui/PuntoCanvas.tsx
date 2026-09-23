"use client";

import { useEffect, useRef } from "react";
import { start, type PuntoMotion } from "@/lib/punto-engine";

interface PuntoCanvasProps {
  /** `contenido` deja la coreografía sin stagger, arcos, modos del hero ni parallax. */
  motion?: PuntoMotion;
  /** Selección y barra de fórmulas al pasar el cursor por la hoja. */
  cursor?: boolean;
}

/**
 * Lienzo fijo de la portada, entre los fondos de sección y su contenido.
 *
 * Capas: el canvas va en `z-index: 1`; los fondos de sección no llevan
 * z-index, así que quedan debajo, y el contenido va en envoltorios con
 * `position: relative; z-index: 2`, encima. Las celdas se ven en los huecos
 * y pasan por detrás del texto.
 *
 * El motor arranca al montar y se destruye al desmontar, devolviendo los
 * nodos que ha tocado a como los sirvió el servidor. Es decorativo: va con
 * `aria-hidden` y no recibe punteros.
 */
export function PuntoCanvas({ motion = "completo", cursor = true }: PuntoCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const engine = start({ canvas: ref.current, motion, cursor });
    return () => engine.destroy();
  }, [motion, cursor]);

  return (
    <canvas
      ref={ref}
      data-punto-canvas=""
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] block h-full w-full"
    />
  );
}
