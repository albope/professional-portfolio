import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceNeeds, services } from "@/data/services";

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-24 border-b border-line">
      <div className="container-editorial py-16 lg:py-24">
        <SectionHeading
          index="01"
          label="En qué podemos ayudarte"
          title="Empecemos por lo que necesitas"
          className="mb-9 max-w-[820px] lg:mb-12"
        />

        <ol className="grid border-l border-t border-line lg:grid-cols-3">
          {serviceNeeds.map((need) => (
            <li key={need.id} className="flex flex-col border-b border-r border-line p-6 lg:p-7">
              <p className="label-mono flex items-start gap-3 leading-relaxed text-ink-mute">
                <span className="text-cobalt">{need.index}</span>
                {need.problem}
              </p>
              <h3 className="mt-6 max-w-[260px] text-[27px] font-semibold leading-[1.12] tracking-tight">
                {need.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                {need.description}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-mute">
                <span className="font-semibold text-ink">Por ejemplo: </span>
                {need.example}
              </p>
              <ul aria-label="Servicios relacionados" className="mb-7 mt-6 flex flex-wrap gap-2">
                {need.serviceIds.map((id) => (
                  <li key={id} className="bg-paper-2 px-2.5 py-1.5 text-xs leading-relaxed text-ink-soft">
                    {services.find((service) => service.id === id)?.title}
                  </li>
                ))}
              </ul>
              <Link
                href={`/?necesidad=${need.id}#contacto`}
                data-track="cta_click"
                data-track-location="service"
                data-track-need={need.id}
                className="group mt-auto flex min-h-11 items-center justify-between gap-3 border-t border-line pt-4 text-sm font-semibold text-cobalt transition-colors hover:text-cobalt-deep"
              >
                {need.cta}
                <span aria-hidden className="font-mono text-base transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-baseline sm:gap-10">
          <p className="max-w-[670px] text-sm leading-relaxed text-ink-mute">
            <strong className="font-semibold text-ink">¿Todavía no sabes qué solución necesitas?</strong>{" "}
            La consultoría tecnológica sirve para ordenar prioridades y decidir
            qué construir, qué conectar y qué puedes resolver con lo que ya existe.
          </p>
          <Link
            href="/#contacto"
            data-track="cta_click"
            data-track-location="service"
            className="link-underline inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-sm font-semibold text-cobalt"
          >
            Cuéntanos tu situación <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
