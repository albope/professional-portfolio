import { cn } from "@/lib/utils";

interface WordmarkProps {
  tone?: "ink" | "paper";
  /** Cuerpo de BPM en píxeles. TECH se deriva al 55% y el cuadrado al 28%. */
  size?: number;
  withSquare?: boolean;
  className?: string;
}

/** Wordmark BPM TECH: BPM + TECH en cobalto al 55% + cuadrado como punto final. */
export function Wordmark({
  tone = "ink",
  size = 21,
  withSquare = true,
  className,
}: WordmarkProps) {
  const techSize = Math.round(size * 0.55);
  const square = Math.max(4, Math.round(size * 0.28));

  return (
    <span className={cn("inline-flex items-baseline gap-[0.33em]", className)}>
      <span
        className={cn(
          "font-display leading-none tracking-[-0.02em]",
          tone === "ink" ? "text-ink" : "text-paper"
        )}
        style={{ fontSize: size }}
      >
        BPM
      </span>
      <span
        className={cn(
          "font-display leading-none",
          tone === "ink" ? "text-cobalt" : "text-cobalt-bright"
        )}
        style={{ fontSize: techSize }}
      >
        TECH
      </span>
      {withSquare && (
        <span
          aria-hidden
          className={cn("inline-block", tone === "ink" ? "bg-ink" : "bg-paper")}
          style={{ width: square, height: square }}
        />
      )}
    </span>
  );
}
