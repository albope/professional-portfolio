/**
 * Única animación continua de la web. La última palabra del titular del hero
 * recorre los sectores de los cinco proyectos. Las cinco palabras se apilan en
 * la misma celda de un `inline-grid`, así que el contenedor mide lo que la más
 * larga («almacén») y el titular nunca se reajusta.
 *
 * Solo la primera es accesible: el resto son la misma frase repetida. Con
 * `prefers-reduced-motion` la animación desaparece y queda «negocio»
 * (regla en globals.css).
 */
const words = ["negocio", "club", "almacén", "evento", "radio"] as const;

export function RotatingWord() {
  return (
    <span className="inline-grid align-baseline text-cobalt">
      {words.map((word, index) => (
        <span
          key={word}
          data-palabra={index + 1}
          aria-hidden={index > 0 ? true : undefined}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
