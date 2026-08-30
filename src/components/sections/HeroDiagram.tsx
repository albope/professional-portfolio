const stages = [
  { n: "01", label: "Necesidad", sub: "Un problema de negocio" },
  { n: "02", label: "Diseño", sub: "Producto y arquitectura" },
  { n: "03", label: "Construcción", sub: "Iteraciones cortas" },
  { n: "04", label: "Producción", sub: "Software funcionando" },
];

/**
 * Diagrama de la línea de trabajo: de la necesidad al software en producción.
 * Un pulso cobalto recorre la línea (desactivado con prefers-reduced-motion).
 */
export function HeroDiagram() {
  return (
    <div aria-label="De la necesidad al software en producción">
      {/* Horizontal — tablet y desktop */}
      <div className="relative hidden md:block">
        <div className="absolute left-[7px] right-[7px] top-[7px] h-px bg-ink/15" aria-hidden />
        <div
          className="absolute top-[4px] h-[7px] w-[7px] rounded-full bg-cobalt animate-travel-x motion-reduce:hidden"
          aria-hidden
        />
        <ol className="relative grid grid-cols-4">
          {stages.map((stage, i) => (
            <li key={stage.n} className="flex flex-col gap-4">
              <span
                aria-hidden
                className={
                  i === stages.length - 1
                    ? "h-[15px] w-[15px] border border-cobalt bg-cobalt"
                    : "h-[15px] w-[15px] border border-ink/40 bg-paper"
                }
              />
              <div>
                <p className="label-mono text-ink/80">
                  <span className="mr-2 text-cobalt">{stage.n}</span>
                  {stage.label}
                </p>
                <p className="mt-1.5 text-xs text-ink/45">{stage.sub}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Vertical — móvil */}
      <ol className="relative flex flex-col gap-7 md:hidden">
        <div className="absolute bottom-[7px] left-[7px] top-[7px] w-px bg-ink/15" aria-hidden />
        {stages.map((stage, i) => (
          <li key={stage.n} className="relative flex items-start gap-4">
            <span
              aria-hidden
              className={
                i === stages.length - 1
                  ? "mt-[2px] h-[15px] w-[15px] shrink-0 border border-cobalt bg-cobalt"
                  : "mt-[2px] h-[15px] w-[15px] shrink-0 border border-ink/40 bg-paper"
              }
            />
            <div>
              <p className="label-mono text-ink/80">
                <span className="mr-2 text-cobalt">{stage.n}</span>
                {stage.label}
              </p>
              <p className="mt-1 text-xs text-ink/45">{stage.sub}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
