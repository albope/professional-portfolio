import type { CSSProperties } from "react";
import type { PasoMetodo } from "@/data/copy";
import { sinCortes } from "@/lib/sin-cortes";
import { PlayOnView } from "@/components/ui/PlayOnView";
import s from "./ProcessLine.module.css";

/** Check de cada compromiso, en `cobalt-bright`. */
function Check() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-px size-[18px] flex-none text-cobalt-bright">
      <path
        d="M3.5 9.5l3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Los cuatro pasos de «Cómo trabajamos» sobre la línea del proceso
 * (especificación 3.5 y 4.8). Cada paso: marca cuadrada, título, qué pasa y
 * el compromiso que recibe el cliente, con check y filete encima.
 *
 * - Desde 980 px, cuatro columnas con la línea horizontal arriba y las marcas
 *   48 px por encima de cada título.
 * - Por debajo, una columna con la línea vertical a la izquierda (44 px de
 *   relleno) y 44 px entre pasos.
 *
 * La pista es de 2 px al 18 % y el relleno `cobalt-bright` se dibuja con
 * `scaleX` o `scaleY` en 2,2 s, mientras las marcas pasan de huecas a macizas
 * una tras otra. El marcado es el final (línea completa y marcas macizas):
 * sin JS o con movimiento reducido no se anima nada. Las marcas y la línea
 * son decoración (`aria-hidden`): el orden ya lo dice la lista numerada.
 */
export function ProcessLine({ pasos }: { pasos: readonly PasoMetodo[] }) {
  return (
    <PlayOnView className="relative pl-11 980:pl-0 980:pt-12">
      <span
        className="absolute bottom-1.5 left-2 top-1.5 w-0.5 bg-on-dark/[.18] 980:bottom-auto 980:left-0 980:right-0 980:top-2 980:h-0.5 980:w-auto"
        aria-hidden="true"
      >
        <i className={`${s.fill} absolute inset-0 origin-top bg-cobalt-bright 980:origin-left`} />
      </span>
      <ol className="grid gap-11 980:grid-cols-4 980:gap-9">
        {pasos.map((paso, i) => (
          <li key={paso.titulo} className="relative grid content-start gap-2.5" style={{ "--i": i } as CSSProperties}>
            <span
              className={`${s.mark} absolute -left-11 top-1 z-[1] size-[18px] border-2 border-cobalt-bright bg-cobalt-bright 980:-top-12 980:left-0`}
              aria-hidden="true"
            />
            <h3 className="text-h3">{paso.titulo}</h3>
            <p className="text-base leading-[1.6] text-on-dark-2">{paso.texto}</p>
            <p className="mt-2.5 flex items-start gap-2.5 border-t border-line-dark pt-3.5 text-small font-medium leading-[1.45]">
              <Check />
              {/* «24 h laborables» no se parte al final de una línea. */}
              <span>{sinCortes(paso.compromiso)}</span>
            </p>
          </li>
        ))}
      </ol>
    </PlayOnView>
  );
}
