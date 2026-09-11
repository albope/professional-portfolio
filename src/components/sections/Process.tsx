import { processSteps } from "@/data/process";

export function Process() {
  return (
    <section id="metodo" aria-label="Cómo trabajamos" className="mt-14 scroll-mt-6 bg-paper-2 lg:mt-[120px]">
      <div className="container-editorial pb-11 pt-10 lg:grid lg:grid-cols-[424fr_872fr] lg:gap-x-6 lg:pb-20 lg:pt-[72px]">
        <div>
          <h2 className="text-2xl font-semibold leading-[1.1] tracking-[-0.02em] lg:text-[34px] lg:leading-[1.08]">
            Sabrás qué viene después
          </h2>
          <p className="mt-2.5 max-w-[360px] text-sm leading-[1.55] text-ink-mute lg:mt-4 lg:text-[15px]">
            Cada fase termina con algo que puedes revisar.{" "}
            <span className="lg:hidden">
              Alcance, propiedad del desarrollo, documentación y soporte quedan por escrito en la
              propuesta.
            </span>
            <span className="hidden lg:inline">
              El alcance, la propiedad del desarrollo, la documentación y el soporte quedan por
              escrito en la propuesta.
            </span>
          </p>
        </div>

        <ol className="mt-6 lg:mt-0 lg:grid lg:grid-cols-5 lg:gap-x-6">
          {processSteps.map((step, index) => (
            <li
              key={step.index}
              className={`grid grid-cols-[40px_1fr] gap-x-3 border-t py-3.5 lg:block lg:border-t-ink lg:py-0 lg:pt-4 ${
                index === 0 ? "border-t-ink" : "border-t-line-2"
              } ${index === processSteps.length - 1 ? "border-b border-b-line-2 lg:border-b-0" : ""}`}
            >
              <span className="pt-[3px] font-mono text-xs text-cobalt lg:pt-0">{step.index}</span>
              <div>
                <h3 className="text-base font-semibold tracking-[-0.01em] lg:mt-3 lg:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 hidden text-sm leading-[1.5] text-ink-soft lg:block">
                  {step.description}
                </p>
                <p className="mt-1 font-mono text-[11px] leading-[1.5] text-ink-mute lg:mt-3.5 lg:text-xs">
                  <span aria-hidden>↳ </span>
                  {step.deliverable}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
