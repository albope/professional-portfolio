import { copyEs } from "@/data/copy";

/**
 * Única animación continua de la web. La última línea del titular del hero
 * recorre cinco frases apiladas en la misma celda de un `grid`, de forma que
 * el resto del titular nunca se reajusta.
 *
 * Solo la primera frase es accesible: las otras cuatro son la misma idea
 * repetida y viajan con `aria-hidden`. La altura del contenedor se reserva a
 * dos líneas, porque «herramientas que no encajan» envuelve. Con
 * `prefers-reduced-motion` la animación desaparece y queda la primera frase
 * (regla en globals.css).
 */
export function RotatingPhrase() {
  return (
    <span className="grid min-h-[2.04em] items-start text-[30px] leading-[1.02] text-cobalt lg:min-h-[1.92em] lg:text-[length:inherit] lg:leading-[0.96]">
      {copyEs.hero.h1_palabras.map((frase, index) => (
        <span
          key={frase}
          data-palabra={index + 1}
          aria-hidden={index > 0 ? true : undefined}
        >
          {frase}
        </span>
      ))}
    </span>
  );
}
