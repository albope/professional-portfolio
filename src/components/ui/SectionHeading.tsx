import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: React.ReactNode;
  /** Nota contextual visible en todos los tamaños. */
  note?: string;
  tone?: "ink" | "paper";
  className?: string;
}

/** Cabecera de sección: etiqueta "01 — Nombre" + titular Archivo Black. */
export function SectionHeading({
  index,
  label,
  title,
  note,
  tone = "ink",
  className,
}: SectionHeadingProps) {
  const onPaper = tone === "ink";

  return (
    <Reveal className={cn("flex flex-wrap items-end justify-between gap-x-12 gap-y-6", className)}>
      <div className="max-w-4xl">
        <p
          className={cn(
            "label-mono mb-6",
            onPaper ? "text-ink-mute" : "text-paper/70"
          )}
        >
          {index} — {label}
        </p>
        <h2
          className={cn(
            "display text-display-sec",
            onPaper ? "text-ink" : "text-paper"
          )}
        >
          {title}
        </h2>
      </div>
      {note && (
        <p className={cn("max-w-[400px] text-[15px] leading-relaxed", onPaper ? "text-ink-mute" : "text-paper/75")}>
          {note}
        </p>
      )}
    </Reveal>
  );
}
