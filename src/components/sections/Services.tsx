import { ArrowLink } from "@/components/ui/ArrowLink";
import { copyEs, partirFlecha, servicioNeeds } from "@/data/copy";

const { servicios } = copyEs;
const [situacion, construimos, ejemplos] = servicios.cabeceras;
const cierre = partirFlecha(servicios.cierre.cta);

/** Tres columnas a partir de 1100; debajo, los ejemplos pasan bajo el texto. */
const row = "md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-5 min-[1100px]:grid-cols-3";
const columnTitle = "font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute";

export function Services() {
  return (
    <section id="servicios" aria-label="Servicios" className="scroll-mt-6">
      <div className="container-editorial pt-16 lg:pt-24 wide:pt-[120px]">
        <div className="rejilla-editorial">
          <h2 className="display text-[26px] leading-[1.02] lg:text-[32px] wide:text-[40px]">
            {servicios.h2}
          </h2>
          <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-ink-mute lg:mt-0 lg:text-base wide:text-[17px] wide:leading-[1.6]">
            {servicios.apoyo}
          </p>
        </div>

        <div className={`mt-10 hidden border-b border-ink pb-3 lg:mt-14 ${row}`}>
          <span className={columnTitle}>{situacion}</span>
          <span className={columnTitle}>{construimos}</span>
          <span className={`hidden min-[1100px]:block ${columnTitle}`}>{ejemplos}</span>
        </div>

        <div className="mt-6 md:mt-0">
          {servicios.items.map((item, index) => {
            const cta = partirFlecha(item.cta);
            return (
              <div
                key={servicioNeeds[index]}
                className={`border-b border-line pb-6 pt-5 md:py-8 ${row} ${
                  index === 0 ? "border-t border-t-ink md:border-t-0" : ""
                }`}
              >
                <h3 className="text-lg font-semibold leading-[1.25] tracking-[-0.015em] md:col-start-1 md:row-start-1 md:max-w-[420px] md:text-[21px] md:leading-[1.2]">
                  {item.situacion}
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.55] text-ink-soft md:col-start-2 md:row-start-1 md:mt-0 md:text-base">
                  {item.que_construimos}
                </p>
                <div className="md:col-start-2 md:row-start-2 min-[1100px]:col-start-3 min-[1100px]:row-start-1 min-[1100px]:flex min-[1100px]:flex-col min-[1100px]:justify-between min-[1100px]:gap-5">
                  <p className="mt-2.5 text-[13px] leading-[1.5] text-ink-mute md:mt-0 md:text-sm">
                    {item.ejemplos}
                  </p>
                  <ArrowLink
                    href={`/?necesidad=${servicioNeeds[index]}#contacto`}
                    arrow={cta.flecha}
                    className="mt-1 md:mt-2 min-[1100px]:mt-0"
                    trackEvent="cta_click"
                    trackLocation="service"
                    trackNeed={servicioNeeds[index]}
                  >
                    {cta.texto}
                  </ArrowLink>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-start md:justify-between md:gap-10 md:pt-7">
          <p className="max-w-[720px] text-sm leading-[1.55] text-ink-mute md:text-[15px]">
            {servicios.cierre.texto}
          </p>
          <ArrowLink
            href="/#contacto"
            arrow={cierre.flecha}
            className="shrink-0"
            trackEvent="cta_click"
            trackLocation="service"
          >
            {cierre.texto}
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
