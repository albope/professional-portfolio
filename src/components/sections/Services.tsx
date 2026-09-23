import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { copyEs, partirFlecha, proyectoSlugs, servicioNeeds } from "@/data/copy";
import { getProject } from "@/data/projects";

const { servicios } = copyEs;

/** «01» → caso del índice de proyectos. */
const caso = (num: string) => {
  const slug = proyectoSlugs[Number(num) - 1];
  return { slug, name: getProject(slug)!.sceneLabel.split(" · ")[0] };
};

/**
 * Tres necesidades en filas, no en tarjetas: qué resuelve, ejemplos rotulados
 * como tales y el proyecto real donde se puede ver. Cada fila lleva su
 * necesidad preseleccionada al formulario.
 */
export function Services() {
  return (
    <section id="servicios" aria-labelledby="services-title" className="bg-paper-2">
      <div className="container-editorial seccion">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div>
            <p className="label-mono text-cobalt">{servicios.kicker}</p>
            <h2 id="services-title" className="display mt-4 max-w-[760px] text-display-sec">{servicios.h2}</h2>
          </div>
          <p className="max-w-[460px] text-base leading-relaxed text-ink-soft lg:pb-1">{servicios.apoyo}</p>
        </div>

        <ol className="mt-10 border-b border-line-2 lg:mt-14">
          {servicios.items.map((item, index) => {
            const need = servicioNeeds[index];
            const cta = partirFlecha(item.cta);
            return (
              <li
                key={need}
                className="grid gap-x-10 gap-y-4 border-t border-line-2 py-8 first:border-ink lg:grid-cols-[minmax(0,1fr)_minmax(0,11fr)] lg:py-10 wide:gap-x-14"
              >
                <p aria-hidden className="font-mono text-sm text-cobalt lg:pt-2">0{index + 1}</p>
                <div className="grid gap-x-10 gap-y-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,3fr)] wide:gap-x-14">
                  <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.025em] lg:text-[30px]">{item.titulo}</h3>
                  <div>
                    <p className="text-base leading-relaxed text-ink-soft">{item.que_construimos}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-mute">
                      <span className="label-mono mr-2 text-[10.5px] text-ink-faint">{servicios.ejemplos_rotulo}</span>
                      {item.ejemplos}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <div>
                      <p className="label-mono text-[10.5px] text-ink-mute">{servicios.prueba_rotulo}</p>
                      <ul className="mt-1.5 flex flex-wrap gap-x-4">
                        {item.pruebas.map((num) => {
                          const { slug, name } = caso(num);
                          return (
                            <li key={num}>
                              <Link
                                href={`/proyectos/${slug}`}
                                data-track="case_open"
                                data-track-location="service"
                                data-track-need={need}
                                data-track-project={slug}
                                className="inline-flex min-h-11 items-center gap-2 text-sm text-ink underline decoration-line-2 underline-offset-4 transition-colors duration-300 ease-editorial hover:text-cobalt hover:decoration-cobalt"
                              >
                                <span className="font-mono text-xs text-cobalt">{num}</span>
                                {name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <ArrowLink
                      href={`/?necesidad=${need}#contacto`}
                      arrow={cta.flecha}
                      trackEvent="cta_click"
                      trackLocation="service"
                      trackNeed={need}
                      trackDestination="contact"
                    >
                      {cta.texto}
                    </ArrowLink>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 max-w-[760px] text-sm leading-relaxed text-ink-mute">{servicios.nota}</p>
      </div>
    </section>
  );
}
