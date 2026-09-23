import Link from "next/link";
import { PlateNotes, TitleBlock } from "@/components/ui/Plate";
import { PlateStage } from "@/components/ui/PlateStage";
import { SheetHeader } from "@/components/ui/SheetHeader";
import { copyEs, partirFlecha, proyectoSlugs } from "@/data/copy";
import { almacenPlate, radioPlate, strips, type Plate } from "@/data/plates";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/utils";

const { proyectos } = copyEs;
const ver = partirFlecha(proyectos.ver);

function CaseLink({ slug, className }: { slug: string; className?: string }) {
  return (
    <Link
      href={`/proyectos/${slug}`}
      data-track="case_open"
      data-track-location="projects"
      data-track-project={slug}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cobalt underline-offset-4 transition-colors duration-300 ease-editorial hover:gap-3 hover:text-cobalt-deep",
        className
      )}
    >
      <span className="group-hover:underline">{ver.texto}</span>
      <span aria-hidden className="font-mono">{ver.flecha}</span>
      <span className="sr-only">: {getProject(slug)?.title}</span>
    </Link>
  );
}

/**
 * Lámina de un proyecto: la hoja con sus capturas y, debajo, las notas en
 * tres columnas y el cajetín como banda: necesidad, alcance y enlace a la
 * ficha. Las dos láminas se leen igual; varía la composición de las capturas.
 */
function PlateSection({ plate }: { plate: Plate }) {
  const labelId = `lamina-${plate.num}`;
  return (
    <article aria-labelledby={labelId} className="plate container-editorial mt-14 lg:mt-20">
      <PlateStage plate={plate} labelId={labelId} labelAs="h3" className="-mx-4 border-x-0 md:mx-0 md:border-x" />
      <PlateNotes notes={plate.notes} className="mt-4 hidden md:grid md:grid-cols-3 md:gap-x-6" />
      <TitleBlock entries={plate.block.slice(1)} className="mt-2 md:grid-cols-3">
        <CaseLink slug={plate.slug} />
      </TitleBlock>
    </article>
  );
}

export function Work() {
  return (
    <section id="proyectos" aria-labelledby="work-title" className="bg-paper pb-16 lg:pb-24 wide:pb-[120px]">
      <div className="container-editorial pt-14 lg:pt-20 wide:pt-24">
        <SheetHeader id="work-title" label={proyectos.kicker} title={proyectos.h2} intro={proyectos.apoyo} />

        <nav aria-label={proyectos.indice_rotulo} className="rejilla-editorial mt-10 lg:mt-12">
          <p className="label-mono text-[10.5px] text-ink-mute lg:pt-4">{proyectos.indice_rotulo}</p>
          <ol className="mt-3 divide-y divide-line-2 border-y border-ink lg:mt-0">
            {proyectoSlugs.map((slug, index) => {
              const project = getProject(slug)!;
              const item = proyectos.items[index];
              return (
                <li key={slug}>
                  <Link
                    href={`/proyectos/${slug}`}
                    data-track="case_open"
                    data-track-location="projects"
                    data-track-project={slug}
                    className="group grid min-h-14 grid-cols-[2.25rem_minmax(0,1fr)_1.25rem] items-baseline gap-x-3 gap-y-0.5 py-3 transition-colors duration-300 ease-editorial hover:bg-paper-2 sm:grid-cols-[2.75rem_minmax(0,0.85fr)_minmax(0,1.35fr)_1.25rem] lg:px-2"
                  >
                    <span className="col-start-1 row-start-1 font-mono text-sm text-cobalt">{String(index + 1).padStart(2, "0")}</span>
                    <span className="col-start-2 row-start-1 text-lg font-semibold leading-snug tracking-[-0.015em] text-ink group-hover:text-cobalt">
                      {project.sceneLabel.split(" · ")[0]}
                    </span>
                    <span className="col-start-2 row-start-2 text-sm leading-snug text-ink-mute sm:col-start-3 sm:row-start-1">{item.descriptor}</span>
                    <span aria-hidden className="col-start-3 row-start-1 text-right font-mono text-ink-faint transition-transform duration-300 ease-editorial group-hover:translate-x-1 group-hover:text-cobalt sm:col-start-4">→</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <PlateSection plate={almacenPlate} />
      <PlateSection plate={radioPlate} />

      <div className="container-editorial mt-14 lg:mt-20">
        <p className="label-mono text-[10.5px] text-ink-mute">{proyectos.mas_rotulo}</p>
        <div className="mt-3 grid gap-y-12 md:grid-cols-2 md:gap-x-10 wide:gap-x-14">
          {strips.map((strip) => {
            const labelId = `franja-${strip.num}`;
            return (
              <article key={strip.slug} aria-labelledby={labelId} className="plate flex flex-col">
                <PlateStage plate={strip} labelId={labelId} labelAs="h3" className="-mx-4 border-x-0 md:mx-0 md:border-x" />
                <PlateNotes notes={strip.notes} className="mt-4 hidden md:grid" />
                <CaseLink slug={strip.slug} className="mt-1" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
