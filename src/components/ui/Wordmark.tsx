import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  tone?: "ink" | "paper";
}

/** Logotipo tipográfico provisional de BPM Tech: BPM + Tech en serif + punto cobalto. */
export function Wordmark({ className, tone = "ink" }: WordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.3em] text-xl leading-none",
        tone === "ink" ? "text-ink" : "text-paper",
        className
      )}
    >
      <span className="font-semibold tracking-[-0.04em]">BPM</span>
      <span className="font-display italic tracking-[-0.01em]">Tech</span>
      <span
        className="inline-block h-[0.32em] w-[0.32em] translate-y-[-0.05em] bg-cobalt"
        aria-hidden
      />
    </span>
  );
}
