import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SheetSide } from "@/components/ui/SheetHeader";
import { copyEs, partirFlecha, proyectoSlugs, servicioNeeds } from "@/data/copy";
import { getProject } from "@/data/projects";

const { servicios } = copyEs;

/** «01» → caso del índice de proyectos. */
const caso = (num: string) => {
  const slug = proyectoSlugs[Number(num) - 1];
  return { slug, name: getProject(slug)!.sceneLabel.split(" · ")[0] };
};

/**
 * El titular se queda en la primera columna mientras las tres necesidades
 * corren por la segunda. Cada fila dice qué resuelve, pone ejemplos rotulados
 * como tales y enlaza, como el índice de proyectos, los casos donde se ve.
 * La llamada lleva su necesidad preseleccionada al formulario.
 */
export function Services() {
  return (
    <section id="servicios" aria-labelledby="services-title" className="bg-paper-2">
      <div className="container-editorial seccion">
        <div className="rejilla-editorial border-t-2 border-ink pt-5 lg:pt-6">
          <SheetSide id="services-title" label={servicios.kicker} title={servicios.h2} intro={servicios.apoyo} />

          <ol className="mt-10 lg:mt-0">
            {servicios.items.map((item, index) => {
              const need = servicioNeeds[index];
              const cta = partirFlecha(item.cta);
              return (
                <li key={need} className="border-t border-line-2 py-8 first:border-ink lg:py-10 lg:first:border-t-0 lg:first:pt-0 last:pb-0">
                  <div className="flex items-baseline gap-4">
                    <p aria-hidden className="w-6 shrink-0 font-mono text-sm text-cobalt">0{index + 1}</p>
                    <h3 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] [text-wrap:balance] lg:text-[28px]">{item.titulo}</h3>
                  </div>
                  <div className="mt-4 grid gap-x-8 gap-y-6 pl-10 md:grid-cols-2">
                    <div>
                      <p className="text-base leading-relaxed text-ink-soft">{item.que_construimos}</p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-mute">
                        <span className="label-mono mr-2 text-[10.5px] text-ink-faint">{servicios.ejemplos_rotulo}</span>
                        <span className="sr-only">: </span>
                        {item.ejemplos}
                      </p>
                    </div>
                    <div>
                      <p className="label-mono text-[10.5px] text-ink-mute">{servicios.prueba_rotulo}</p>
                      <ul className="mt-2 divide-y divide-line-2 border-y border-line-2">
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
                                className="group grid min-h-11 grid-cols-[1.75rem_minmax(0,1fr)_1rem] items-baseline gap-x-2 py-2.5 text-sm leading-snug text-ink transition-colors duration-300 ease-editorial hover:bg-paper hover:text-cobalt"
                              >
                                <span className="font-mono text-xs text-cobalt">{prueba.num}</span>
                                <span>
                                  <span className="font-semibold">{name}</span>
                                  <span className="text-ink-mute"> · {prueba.que}</span>
                                </span>
                                <span aria-hidden className="text-right font-mono text-ink-faint transition-transform duration-300 ease-editorial group-hover:translate-x-0.5 group-hover:text-cobalt">→</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <ArrowLink
                        href={`/?necesidad=${need}#contacto`}
                        arrow={cta.flecha}
                        className="mt-4"
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
      </div>
    </section>
  );
}
