import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

function ProjectBadge({ project }: { project: Project }) {
  return (
    <span className="label-mono border border-ink/20 px-2 py-1 text-ink/55">
      {project.concept ? "Concepto" : "Proyecto real"}
    </span>
  );
}

export function Work() {
  const software = projects.filter((p) => p.kind === "software");
  const webs = projects.filter((p) => p.kind === "web");

  return (
    <section id="proyectos" className="scroll-mt-24 border-b border-line bg-paper-2">
      <div className="container-editorial py-24 md:py-32">
        <SectionHeading
          index="03"
          eyebrow="Proyectos"
          title="Proyectos seleccionados"
          intro="Una selección de lo que construimos. Los proyectos reales se muestran sin datos de cliente; los marcados como concepto ilustran tipologías que desarrollamos. Todos tienen algo en común: son ejemplos de un enfoque que se adapta a cualquier negocio."
        />

        {/* Producto y software */}
        <div className="mt-16 flex flex-col gap-10 md:mt-20 md:gap-14">
          {software.map((project, i) => (
            <Reveal key={project.slug}>
              <Link
                href={`/proyectos/${project.slug}`}
                className="group grid overflow-hidden border border-line bg-paper transition-colors duration-500 ease-editorial hover:border-ink/25 lg:grid-cols-12"
              >
                {/* Visual */}
                <div
                  className={cn(
                    "relative aspect-[4/3] bg-ink-2 sm:aspect-[16/10] lg:aspect-auto lg:min-h-[380px]",
                    "lg:col-span-5",
                    i % 2 === 1 && "lg:order-last"
                  )}
                >
                  <div className="absolute inset-0 p-6 transition-transform duration-700 ease-editorial group-hover:scale-[1.02]">
                    <ProjectVisual variant={project.visual} />
                  </div>
                  <span className="label-mono absolute left-4 top-4 text-paper/30" aria-hidden>
                    +
                  </span>
                  <span className="label-mono absolute bottom-4 right-4 text-paper/30" aria-hidden>
                    +
                  </span>
                </div>

                {/* Contenido */}
                <div className="flex flex-col justify-between gap-8 p-7 md:p-10 lg:col-span-7">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="label-mono text-ink/55">
                        {project.sector} · {project.type}
                      </p>
                      <ProjectBadge project={project} />
                    </div>
                    <h3 className="mt-5 max-w-xl text-display-md font-medium text-ink">
                      {project.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/60">
                      {project.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-6">
                    <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Tecnologías">
                      {project.stack.map((tech) => (
                        <li key={tech} className="label-mono text-ink/55">
                          {tech}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-cobalt">
                      Ver caso
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Webs a medida */}
        <Reveal className="mt-20 border-t border-line pt-14 md:mt-24 md:pt-16">
          <div className="max-w-2xl">
            <p className="label-mono mb-5 flex items-center gap-3 text-ink/50">
              <span className="inline-block h-[5px] w-[5px] bg-cobalt" aria-hidden />
              Y también
            </p>
            <h3 className="text-display-md font-medium text-ink">
              Webs a medida, con el mismo cuidado
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/60">
              No solo software de gestión: diseñamos y construimos webs con
              identidad propia para pymes, particulares y startups. Sin
              plantillas — cada una pensada desde cero para su proyecto.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
          {webs.map((project) => (
            <Reveal key={project.slug}>
              <Link
                href={`/proyectos/${project.slug}`}
                className="group flex h-full flex-col overflow-hidden border border-line bg-paper transition-colors duration-500 ease-editorial hover:border-ink/25"
              >
                <div className="relative aspect-[16/10] bg-ink-2">
                  <div className="absolute inset-0 p-5 transition-transform duration-700 ease-editorial group-hover:scale-[1.02]">
                    <ProjectVisual variant={project.visual} />
                  </div>
                  <span className="label-mono absolute left-4 top-4 text-paper/30" aria-hidden>
                    +
                  </span>
                  <span className="label-mono absolute bottom-4 right-4 text-paper/30" aria-hidden>
                    +
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 p-7">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="label-mono text-ink/55">{project.sector}</p>
                      <ProjectBadge project={project} />
                    </div>
                    <h4 className="mt-4 text-display-sm font-medium text-ink">
                      {project.title}
                    </h4>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink/60">
                      {project.summary}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-cobalt">
                    Ver caso
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* CTA conversacional */}
        <Reveal className="mt-16 border-t border-line pt-10 md:mt-20">
          <Link
            href="/#contacto"
            className="group inline-flex flex-wrap items-baseline gap-x-3 text-display-sm font-medium text-ink"
          >
            ¿Te suena alguno de estos problemas?
            <span className="inline-flex items-center gap-2 text-cobalt">
              Cuéntanos el tuyo
              <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-editorial group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
