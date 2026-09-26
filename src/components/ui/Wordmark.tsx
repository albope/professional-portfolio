import { cn } from "@/lib/utils";

interface WordmarkProps {
  /** Fondo sobre el que va: `light` (por defecto) o `dark` (el pie). */
  on?: "light" | "dark";
  /** Cuerpo: 19 por defecto · 17 · 16 en la cabecera por debajo de 480 px. */
  size?: 19 | 17 | 16;
  className?: string;
}

/**
 * Lockup web de BPM Tech, lo único intocable de la identidad: BPMTECH en
 * Fragment Mono con TECH en cobalto, seguido del glifo de tres piezas (barra,
 * cuadrado hueco y cuadrado macizo cobalto) con 5 px entre piezas.
 *
 * Sobre claro: `#101013` + `#2743E0`. Sobre oscuro: `#F7F6F2` + `#6B83FF`,
 * porque el cobalto normal se hunde contra la tinta. Es decorativo: el enlace
 * que lo envuelve lleva su propio `aria-label`.
 */
export function Wordmark({ on = "light", size = 19, className }: WordmarkProps) {
  const s = size === 19 ? 11 : size === 17 ? 10 : 9;
  const barHeight = s >= 10 ? 3 : 2.5;
  const glyphGap = s >= 10 ? 5 : 4;
  const onDark = on === "dark";
  const base = onDark ? "var(--on-dark)" : "var(--ink)";
  const accent = onDark ? "var(--cobalt-bright)" : "var(--cobalt)";

  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap: size === 16 ? 8 : 10 }}
    >
      <span
        className="font-mono font-normal leading-none tracking-[0.06em]"
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
