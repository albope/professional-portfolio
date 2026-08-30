import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  tone?: "ink" | "paper";
  className?: string;
}

/** Cabecera de sección: coordenada mono + titular display + intro opcional. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  tone = "ink",
  className,
}: SectionHeadingProps) {
  const onPaper = tone === "ink";

  return (
    <Reveal className={cn("max-w-3xl", className)}>
      <p
        className={cn(
          "label-mono mb-6 flex items-center gap-3",
          onPaper ? "text-ink/50" : "text-paper/50"
        )}
      >
        <span className={onPaper ? "text-cobalt" : "text-cobalt-bright"} aria-hidden>
          §{index}
        </span>
        <span className={cn("h-px w-8", onPaper ? "bg-ink/20" : "bg-paper/20")} aria-hidden />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "text-display-lg font-medium",
          onPaper ? "text-ink" : "text-paper"
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-6 text-lead",
            onPaper ? "text-ink/60" : "text-paper/60"
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
