import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { projects, type Project } from "@/data/projects";

function ProjectBadge({ project, small }: { project: Project; small?: boolean }) {
  const size = small ? "px-[7px] py-[3px]" : "px-2 py-1";
  return project.concept ? (
    <span
      className={`border border-ink font-mono text-[10px] uppercase tracking-[0.14em] text-ink ${size}`}
    >
      Concepto
    </span>
  ) : (
    <span
      className={`bg-cobalt font-mono text-[10px] uppercase tracking-[0.14em] text-paper ${size}`}
    >
      Proyecto real
    </span>
  );
}

/** Marcas de registro en las esquinas del visual (gesto de marca). */
function CropMarks() {
  return (
    <>
      <span
        aria-hidden
        className="absolute -left-1 -top-1 h-2 w-2 border-b border-r border-ink"
      />
      <span
        aria-hidden
        className="absolute -bottom-1 -right-1 h-2 w-2 border-l border-t border-ink"
      />
    </>
  );
}

export function Work() {
  const software = projects.filter((p) => p.kind === "software");
  const webs = projects.filter((p) => p.kind === "web");

  return (
    <section id="proyectos" className="scroll-mt-20 border-b border-line">
      <div className="container-editorial py-16 lg:py-[110px]">
        <SectionHeading
          index="03"
          label="Proyectos"
          title="Trabajo hecho"
          note="Trabajo real del estudio, con capturas de producto. Cada proyecto sirve como ejemplo adaptable a otros negocios."
          className="mb-10 lg:mb-[60px]"
        />

        {/* Producto y software */}
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {software.map((project, i) => (
            <Reveal key={project.slug} delay={Math.min((i % 2) * 0.08, 0.16)}>
              <Link
                href={`/proyectos/${project.slug}`}
                className="group block text-ink transition-opacity duration-300 hover:opacity-[0.92]"
              >
                <div
                  className={
                    project.screenshot
                      ? "relative aspect-video overflow-hidden bg-ink"
                      : "relative aspect-[16/10] bg-ink p-6 lg:p-8"
                  }
                >
                  <CropMarks />
                  {project.screenshot ? (
                    <Image
                      src={project.screenshot}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <ProjectVisual variant={project.visual} />
                  )}
                </div>
                <div className="mt-[22px] flex flex-wrap items-baseline gap-3.5">
                  <ProjectBadge project={project} />
                  <span className="font-mono text-[11px] text-ink-faint">
                    {project.meta}
                  </span>
                </div>
                <p className="mt-3 max-w-[480px] text-[19px] font-semibold lg:text-[23px]">
                  {project.title}
                </p>
                <p className="mt-2 max-w-[480px] text-sm leading-relaxed text-ink-mute">
                  {project.summary}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Webs a medida */}
        <Reveal className="mt-16 border-t border-line pt-12 lg:mt-20 lg:pt-[50px]">
          <p className="mb-8 text-[19px] font-semibold text-ink lg:text-[22px]">
            También construimos webs a medida
          </p>
          <div className="grid gap-10 md:grid-cols-2">
            {webs.map((project) => (
              <Link
                key={project.slug}
                href={`/proyectos/${project.slug}`}
                className="flex flex-col gap-6 border border-line p-6 text-ink transition-colors duration-300 ease-editorial hover:border-ink sm:flex-row lg:p-7"
              >
                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-ink sm:aspect-auto sm:h-[110px] sm:w-[110px]">
                  {project.screenshot ? (
                    <Image
                      src={project.screenshot}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 110px, 100vw"
                      className="object-cover object-top sm:object-center"
                    />
                  ) : (
                    <ProjectVisual variant={project.visual} />
                  )}
                </div>
                <div>
                  <ProjectBadge project={project} small />
                  <p className="mt-3 text-lg font-semibold">{project.title}</p>
                  <p className="mt-2 text-sm leading-[1.55] text-ink-mute">
                    {project.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
