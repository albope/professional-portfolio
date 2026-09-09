import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { projects } from "@/data/projects";

const linkFocus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt";

export function Work() {
  const featured = projects.find((project) => project.gallery && project.featured);
  const software = projects.filter((project) => project.gallery && !project.featured && project.kind === "software");
  const webs = projects.filter((project) => project.gallery && project.kind === "web");

  return (
    <section id="proyectos" className="scroll-mt-20 border-b border-line" aria-label="Proyectos de software y web">
      <div className="container-editorial py-16 lg:py-[100px]">
        <SectionHeading
          index="02"
          label="Proyectos"
          title="Trabajo hecho"
          note="Proyectos reales de software, IA y web. Alcance, decisiones y funciones desarrolladas para resolver necesidades concretas."
          className="mb-10 lg:mb-12"
        />
        {featured && (
          <Link
            href={`/proyectos/${featured.slug}`}
            data-track="case_open"
            data-track-location="projects"
            data-track-project={featured.slug}
            className={`group mb-10 grid gap-8 border border-ink bg-ink p-6 text-paper transition-colors hover:border-cobalt-bright md:grid-cols-2 lg:gap-12 lg:p-9 ${linkFocus}`}
          >
            <div className="flex flex-col items-start">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-cobalt-bright px-2 py-1 font-mono text-xs uppercase tracking-[0.1em] text-ink">{featured.statusLabel}</span>
                <span className="font-mono text-xs text-paper/75">{featured.meta}</span>
              </div>
              <h3 className="mt-5 max-w-[480px] text-2xl font-semibold leading-tight lg:text-[30px]">{featured.title}</h3>
              <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-paper/80">{featured.summary}</p>
              <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-paper/70">{featured.credit}</p>
              <p className="mt-6 text-sm font-semibold text-cobalt-bright">Ver el desarrollo <span aria-hidden="true">↗</span></p>
            </div>
            <div className="flex flex-col justify-center border-t border-paper/25 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <ProjectVisual variant={featured.visual} />
              <p className="mt-4 font-mono text-xs leading-relaxed text-paper/70">Esquema funcional · Piloto interno</p>
            </div>
          </Link>
        )}
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
          {software.map((project, index) => (
            <Reveal key={project.slug} delay={(index % 2) * 0.08}>
              <Link
                href={`/proyectos/${project.slug}`}
                data-track="case_open"
                data-track-location="projects"
                data-track-project={project.slug}
                className={`group block h-full text-ink ${linkFocus}`}
              >
                <div className="relative bg-ink p-5 transition-colors duration-300 group-hover:bg-ink-soft lg:p-7">
                  <ProjectVisual variant={project.visual} />
                </div>
                <p className="mt-2 font-mono text-xs text-ink-faint">Esquema funcional del proyecto</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="bg-cobalt px-2 py-1 font-mono text-xs uppercase tracking-[0.1em] text-paper">
                    {project.statusLabel}
                  </span>
                  <span className="font-mono text-xs text-ink-faint">{project.meta}</span>
                </div>
                <h3 className="mt-3 max-w-[480px] text-xl font-semibold lg:text-[23px]">
                  {project.title}
                </h3>
                <p className="mt-2 max-w-[480px] text-sm leading-relaxed text-ink-mute">
                  {project.summary}
                </p>
                <p className="mt-4 text-sm font-semibold text-cobalt">
                  Ver el proyecto <span aria-hidden="true">↗</span>
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 border-t border-line pt-8 lg:mt-14 lg:pt-10">
          <h3 className="mb-6 text-xl font-semibold text-ink">Webs que permiten hacer algo más</h3>
          <div className="grid gap-5 md:grid-cols-2">
            {webs.map((project) => (
              <Link
                key={project.slug}
                href={`/proyectos/${project.slug}`}
                data-track="case_open"
                data-track-location="projects"
                data-track-project={project.slug}
                className={`group border border-line p-5 text-ink transition-colors hover:border-ink lg:p-6 ${linkFocus}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-cobalt">{project.statusLabel}</span>
                  <span className="font-mono text-xs text-ink-faint">{project.meta}</span>
                </div>
                <h4 className="mt-3 text-lg font-semibold">{project.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-mute">{project.summary}</p>
                <p className="mt-4 text-sm font-semibold text-cobalt">
                  Ver el proyecto <span aria-hidden="true">↗</span>
                </p>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
