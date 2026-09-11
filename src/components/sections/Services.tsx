import { ArrowLink } from "@/components/ui/ArrowLink";
import { serviceNeeds } from "@/data/services";

/** Tres columnas a partir de 1100; debajo, los ejemplos pasan bajo el texto. */
const row = "md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-5 min-[1100px]:grid-cols-3";
const columnTitle = "font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute";

export function Services() {
  return (
    <section id="servicios" aria-label="Servicios" className="scroll-mt-6">
      <div className="container-editorial pt-16 lg:pt-24 wide:pt-[120px]">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-end md:justify-between md:gap-12">
          <h2 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[34px] md:leading-[1.08]">
            Empecemos por tu situación
          </h2>
          <p className="hidden max-w-[440px] text-[15px] leading-[1.5] text-ink-mute md:block">
            Tres puertas de entrada. Si todavía no sabes cuál es la tuya, la consultoría sirve
            para decidirlo.
          </p>
        </div>

        <div className={`mt-9 hidden border-b border-ink pb-3 ${row}`}>
          <span className={columnTitle}>Situación</span>
          <span className={columnTitle}>Qué construimos</span>
          <span className={`hidden min-[1100px]:block ${columnTitle}`}>Ejemplos</span>
        </div>

        <div className="mt-5 md:mt-0">
          {serviceNeeds.map((need, index) => (
            <div
              key={need.id}
              className={`border-b border-line pb-6 pt-5 md:py-8 ${row} ${
                index === 0 ? "border-t border-t-ink md:border-t-0" : ""
              }`}
            >
              <h3 className="text-lg font-semibold leading-[1.25] tracking-[-0.015em] md:col-start-1 md:row-start-1 md:max-w-[380px] md:text-[22px] md:leading-[1.2]">
                {need.situation}
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.55] text-ink-soft md:col-start-2 md:row-start-1 md:mt-0 md:text-base">
                <span className="md:hidden">{need.builtShort}</span>
                <span className="hidden md:inline">{need.built}</span>
              </p>
              <div className="md:col-start-2 md:row-start-2 min-[1100px]:col-start-3 min-[1100px]:row-start-1 min-[1100px]:flex min-[1100px]:flex-col min-[1100px]:justify-between min-[1100px]:gap-5">
                <p className="mt-2 text-[13px] leading-[1.5] text-ink-mute md:mt-0 md:text-sm">
                  <span className="md:hidden">{need.examplesShort}</span>
                  <span className="hidden md:inline">{need.examples}</span>
                </p>
                <ArrowLink
                  href={`/?necesidad=${need.id}#contacto`}
                  className="mt-1 md:mt-2 min-[1100px]:mt-0 min-[1100px]:min-h-8"
                  trackEvent="cta_click"
                  trackLocation="service"
                  trackNeed={need.id}
                >
                  {need.cta}
                </ArrowLink>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-5 md:flex-row md:items-baseline md:justify-between md:gap-10 md:pt-6">
          <p className="max-w-[720px] text-sm leading-[1.55] text-ink-mute md:text-[15px]">
            <strong className="font-semibold text-ink">¿Todavía no sabes qué necesitas?</strong>{" "}
            <span className="md:hidden">
              La consultoría sirve para decidir qué construir, qué conectar y qué resolver con lo
              que ya existe.
            </span>
            <span className="hidden md:inline">
              La consultoría sirve para ordenar prioridades y decidir qué construir, qué conectar
              y qué puedes resolver con lo que ya existe.
            </span>
          </p>
          <ArrowLink
            href="/#contacto"
            arrow="↗"
            className="hidden shrink-0 md:inline-flex md:min-h-8"
            trackEvent="cta_click"
            trackLocation="service"
          >
            Cuéntanos tu situación
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
