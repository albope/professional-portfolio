import { cn } from "@/lib/utils";

interface SquareWordProps {
  word: string;
  /** "light" = cuadrado cobalto (sobre papel) · "dark" = cobalto claro (sobre tinta) */
  tone?: "light" | "dark";
}

/**
 * Gesto gráfico de la marca: la última palabra de un titular clave termina
 * en cuadrado cobalto. Palabra y cuadrado van envueltos en nowrap.
 * Máximo un titular con cuadrado por pantalla.
 */
export function SquareWord({ word, tone = "light" }: SquareWordProps) {
  return (
    <span className="whitespace-nowrap">
      {word}
      <span
        aria-hidden
        className={cn(
          "ml-[0.16em] inline-block h-[0.2em] w-[0.2em]",
          tone === "light" ? "bg-cobalt" : "bg-cobalt-bright"
        )}
      />
    </span>
  );
}
