import { ArrowLink } from "@/components/ui/ArrowLink";
import { copyEs, partirFlecha, servicioNeeds } from "@/data/copy";

const { servicios } = copyEs;

export function Services() {
  return (
    <section id="servicios" aria-labelledby="services-title" className="bg-paper-2">
      <div className="container-editorial seccion">
        <div className="grid items-end gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="label-mono text-cobalt">{servicios.kicker}</p>
            <h2 id="services-title" className="display mt-4 text-display-sec">{servicios.h2}</h2>
          </div>
          <p className="max-w-[520px] text-base leading-relaxed text-ink-soft">{servicios.apoyo}</p>
        </div>
        <div className="mt-10 grid border-t border-ink md:grid-cols-3">
          {servicios.items.map((item, index) => {
            const need = servicioNeeds[index];
            const cta = partirFlecha(item.cta);
            return (
              <article key={need} className="flex flex-col border-b border-line-2 py-7 md:border-b-0 md:border-r md:px-6 md:py-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0 wide:px-9">
                <p aria-hidden className="font-mono text-xs text-cobalt">0{index + 1}</p>
                <h3 className="mt-5 max-w-[330px] text-2xl font-semibold leading-[1.15] tracking-[-0.025em]">{item.titulo}</h3>
                <p className="mt-4 text-base leading-relaxed text-ink-soft">{item.que_construimos}</p>
                <p className="mt-5 border-t border-line-2 pt-4 text-sm leading-relaxed text-ink-mute">{item.ejemplos}</p>
                <div className="mt-auto pt-5">
                  <ArrowLink href={`/?necesidad=${need}#contacto`} arrow={cta.flecha} trackEvent="cta_click" trackLocation="service" trackNeed={need} trackDestination="contact">{cta.texto}</ArrowLink>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-8 max-w-[760px] text-sm leading-relaxed text-ink-mute">{servicios.nota}</p>
      </div>
    </section>
  );
}