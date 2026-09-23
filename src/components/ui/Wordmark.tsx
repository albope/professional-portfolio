import { cn } from "@/lib/utils";

interface WordmarkProps {
  tone?: "ink" | "paper";
  /** Cuerpo del wordmark: 19 header desktop · 17 footer · 16 móvil */
  size?: 19 | 17 | 16;
  className?: string;
}

/**
 * Lockup web de BPM Tech (opción 1b del handoff): BPMTECH en Fragment Mono
 * con TECH en cobalto, seguido del glifo de tres piezas (barra, cuadrado
 * hueco, cuadrado macizo cobalto). El lockup Archivo Black se reserva para
 * deck, papelería y OG image.
 *
 * Sobre tinta (tone="paper") el acento pasa a cobalto brillante: el cobalto
 * normal se hunde contra el fondo oscuro y desequilibra la lectura de BPMTECH.
 */
export function Wordmark({ tone = "ink", size = 19, className }: WordmarkProps) {
  const s = size === 19 ? 11 : size === 17 ? 10 : 9;
  const barHeight = s >= 10 ? 3 : 2.5;
  const glyphGap = s >= 10 ? 5 : 4;
  const onInk = tone === "paper";
  const base = onInk ? "var(--paper)" : "var(--ink)";
  const accent = onInk ? "var(--cobalt-bright)" : "var(--cobalt)";

  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap: size === 16 ? 8 : 10 }}
    >
      <span
        className="font-mono leading-none tracking-[0.06em]"
        style={{ fontSize: size, color: base }}
      >
        BPM
        <span style={{ color: accent }}>TECH</span>
      </span>
      <span aria-hidden className="flex items-center" style={{ gap: glyphGap }}>
        <span style={{ width: s, height: barHeight, background: base }} />
        <span
          className="box-border"
          style={{ width: s, height: s, border: `2px solid ${base}` }}
        />
        <span style={{ width: s, height: s, background: accent }} />
      </span>
    </span>
  );
}
