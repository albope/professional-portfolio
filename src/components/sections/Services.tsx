import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SheetHeader } from "@/components/ui/SheetHeader";
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
 * como tales y los proyectos reales donde se puede ver, cada uno con lo que
 * demuestra. Cada fila lleva su necesidad preseleccionada al formulario.
 */
export function Services() {
  return (
    <section id="servicios" aria-labelledby="services-title" className="bg-paper-2">
      <div className="container-editorial seccion">
        <SheetHeader id="services-title" label={servicios.kicker} title={servicios.h2} intro={servicios.apoyo} />

        <ol className="mt-10 border-b border-line-2 lg:mt-14">
          {servicios.items.map((item, index) => {
            const need = servicioNeeds[index];
            const cta = partirFlecha(item.cta);
            return (
              <li key={need} className="rejilla-editorial border-t border-line-2 py-8 first:border-ink lg:py-10">
                <div className="flex items-baseline gap-4 lg:gap-6">
                  <p aria-hidden className="w-6 shrink-0 font-mono text-sm text-cobalt">0{index + 1}</p>
                  <h3 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] [text-wrap:balance] lg:text-[28px]">{item.titulo}</h3>
                </div>
                <div className="mt-4 grid gap-x-10 gap-y-5 pl-10 sm:grid-cols-2 lg:mt-0 lg:pl-0">
                  <div>
                    <p className="text-base leading-relaxed text-ink-soft">{item.que_construimos}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-mute">
                      <span className="label-mono mr-2 text-[10.5px] text-ink-faint">{servicios.ejemplos_rotulo}</span>
                      <span className="sr-only">: </span>
                      {item.ejemplos}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <div>
                      <p className="label-mono text-[10.5px] text-ink-mute">{servicios.prueba_rotulo}</p>
                      <ul className="mt-1">
                        {item.pruebas.map((prueba) => {
                          const { slug, name } = caso(prueba.num);
                          return (
                            <li key={prueba.num}>
                              <Link
                                href={`/proyectos/${slug}`}
                                data-track="case_open"
                                data-track-location="service"
                                data-track-need={need}
                                data-track-project={slug}
                                className="group inline-flex min-h-11 items-baseline gap-2 py-2 text-sm leading-snug text-ink transition-colors duration-300 ease-editorial hover:text-cobalt"
                              >
                                <span className="font-mono text-xs text-cobalt">{prueba.num}</span>
                                <span>
                                  <span className="underline decoration-line-2 underline-offset-4 group-hover:decoration-cobalt">{name}</span>
                                  <span className="text-ink-mute"> · {prueba.que}</span>
                                </span>
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
      </div>
    </section>
  );
}
