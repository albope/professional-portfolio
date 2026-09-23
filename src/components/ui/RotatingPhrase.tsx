import { copyEs } from "@/data/copy";

/**
 * La última línea del titular del hero recorre cinco frases apiladas en la
 * misma celda de un `grid`, de forma que el resto del titular nunca se
 * reajusta. Hereda el cuerpo y el interlineado del titular.
 *
 * Solo la primera frase es accesible: las otras cuatro son la misma idea
 * repetida y viajan con `aria-hidden`. La celda mide lo que la frase más
 * larga, porque «herramientas que no encajan» envuelve. Con
 * `prefers-reduced-motion` la animación desaparece y queda la primera frase
 * (regla en globals.css). El motor del canvas lee `[data-palabra="1"]` para
 * saber qué frase está en pantalla.
 */
export function RotatingPhrase() {
  return (
    <span className="grid items-start text-cobalt">
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
