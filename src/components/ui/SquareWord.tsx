import { cn } from "@/lib/utils";

interface SquareWordProps {
  word: string;
  /** "light" = cuadrado cobalto (sobre papel) · "dark" = cobalto claro (sobre tinta) */
  tone?: "light" | "dark";
  /**
   * Cuadrado de cierre de la portada: lleva `data-punto-final` y es donde
   * aterrizan las celdas del canvas. El motor lo oculta hasta que llegan.
   */
  final?: boolean;
}

/**
 * Gesto gráfico de la marca: la última palabra de un titular clave termina
 * en cuadrado cobalto. Palabra y cuadrado van envueltos en nowrap.
 * Máximo un titular con cuadrado por pantalla.
 */
export function SquareWord({ word, tone = "light", final }: SquareWordProps) {
  return (
    <span className="whitespace-nowrap">
      {word}
      <span
        aria-hidden
        data-punto-final={final ? "" : undefined}
        className={cn(
          "ml-[0.16em] inline-block h-[0.2em] w-[0.2em]",
          tone === "light" ? "bg-cobalt" : "bg-cobalt-bright"
        )}
      />
    </span>
  );
}
