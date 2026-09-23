import { cn } from "@/lib/utils";

/**
 * Cabecera de hoja: filete de tinta a todo el ancho, el rótulo en la primera
 * columna de la rejilla y el titular con su apoyo en la segunda. Todas las
 * secciones entre el hero y el contacto abren igual, sobre la misma rejilla
 * que las fichas (536 / 696 con calle de 88 a 1440).
 */
export function SheetHeader({
  id,
  label,
  title,
  intro,
  tone = "paper",
  className,
}: {
  id: string;
  label: string;
  title: string;
  intro?: string;
  tone?: "paper" | "ink";
  className?: string;
}) {
  const dark = tone === "ink";
  return (
    <div className={cn("rejilla-editorial border-t-2 pt-5 lg:pt-6", dark ? "border-paper" : "border-ink", className)}>
      <p className={cn("label-mono flex items-center gap-2.5", dark ? "text-cobalt-bright" : "text-cobalt")}>
        <span aria-hidden className={cn("h-2 w-2", dark ? "bg-cobalt-bright" : "bg-cobalt")} />
        {label}
      </p>
      <div className="mt-4 lg:mt-0">
        <h2 id={id} className="display max-w-[640px] text-display-sheet">{title}</h2>
        {intro && (
          <p className={cn("mt-4 max-w-[560px] text-base leading-relaxed", dark ? "text-paper/78" : "text-ink-soft")}>{intro}</p>
        )}
      </div>
    </div>
  );
}
