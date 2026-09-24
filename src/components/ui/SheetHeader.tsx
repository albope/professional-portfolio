import { cn } from "@/lib/utils";

interface SheetHeaderProps {
  id: string;
  label: string;
  title: string;
  intro?: string;
  tone?: "paper" | "ink";
  className?: string;
}

function Label({ label, dark }: { label: string; dark: boolean }) {
  return (
    <p className={cn("label-mono flex items-center gap-2.5", dark ? "text-cobalt-bright" : "text-cobalt")}>
      <span aria-hidden className={cn("h-2 w-2", dark ? "bg-cobalt-bright" : "bg-cobalt")} />
      {label}
    </p>
  );
}

/**
 * Cabecera de hoja: filete de tinta a todo el ancho, el rótulo en la primera
 * columna de la rejilla y el titular con su apoyo en la segunda (424 / 872
 * con calle de 24 a 1440).
 */
export function SheetHeader({ id, label, title, intro, tone = "paper", className }: SheetHeaderProps) {
  const dark = tone === "ink";
  return (
    <div className={cn("rejilla-editorial border-t-2 pt-5 lg:pt-6", dark ? "border-paper" : "border-ink", className)}>
      <Label label={label} dark={dark} />
      <div className="mt-4 lg:mt-0">
        <h2 id={id} className="display max-w-[640px] text-display-sheet">{title}</h2>
        {intro && (
          <p className={cn("mt-4 max-w-[560px] text-base leading-relaxed", dark ? "text-paper/78" : "text-ink-soft")}>{intro}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Variante de columna: rótulo, titular y apoyo apilados en la primera
 * columna, fijos al desplazarse, mientras el contenido corre por la segunda.
 * La sección pone el filete y la rejilla.
 */
export function SheetSide({ id, label, title, intro, tone = "paper", className }: SheetHeaderProps) {
  const dark = tone === "ink";
  return (
    <div className={cn("lg:sticky lg:top-24 lg:pb-6", className)}>
      <Label label={label} dark={dark} />
      <h2 id={id} className="display mt-4 max-w-[640px] text-display-sheet lg:mt-5 lg:max-w-[400px]">{title}</h2>
      {intro && (
        <p className={cn("mt-4 max-w-[560px] text-base leading-relaxed lg:max-w-[380px]", dark ? "text-paper/78" : "text-ink-soft")}>{intro}</p>
      )}
    </div>
  );
}
