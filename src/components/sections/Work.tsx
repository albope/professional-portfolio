import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PlateNotes, TitleBlock } from "@/components/ui/Plate";
import { PlateStage } from "@/components/ui/PlateStage";
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
        "group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cobalt underline-offset-4 transition-colors duration-300 ease-editorial hover:gap-3 hover:text-cobalt-deep hover:underline",
        className
      )}
    >
      {ver.texto}
      <span aria-hidden className="font-mono">{ver.flecha}</span>
      <span className="sr-only">: {getProject(slug)?.title}</span>
    </Link>
  );
}

/**
 * Lámina a sangre del lienzo: escenario con el color del producto, notas y
 * cajetín debajo. `reverse` alterna el lado del cajetín para que dos láminas
 * seguidas no se lean como plantilla.
 */
function PlateSection({ plate, reverse }: { plate: Plate; reverse?: boolean }) {
  const titleId = `lamina-${plate.num}`;
  return (
    <article aria-labelledby={titleId} className="plate mt-16 lg:mt-24">
      <h3 id={titleId} className="sr-only">
        Proyecto {plate.num}: {plate.name}
      </h3>
      <PlateStage
        plate={plate}
        label={`Proyecto ${plate.num} · ${plate.name}`}
        caption={proyectos.captura}
        reverse={reverse}
      />
      <div
        className={cn(
          "container-editorial grid gap-x-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] wide:gap-x-14",
          reverse && "lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
        )}
      >
        <PlateNotes notes={plate.notes} className={cn("md:grid-cols-3 md:gap-x-6", reverse && "lg:order-2")} />
        <div className={cn("mt-4 lg:mt-0", reverse && "lg:order-1")}>
          <TitleBlock entries={plate.block.slice(1)} />
          <CaseLink slug={plate.slug} className="mt-2" />
        </div>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section id="proyectos" aria-labelledby="work-title" className="border-t border-line bg-paper pb-16 lg:pb-24 wide:pb-[120px]">
      <div className="container-editorial grid gap-10 pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-14 lg:pt-20 wide:pt-24">
        <div>
          <p className="label-mono text-cobalt">{proyectos.kicker}</p>
          <h2 id="work-title" className="display mt-4 text-display-sec">{proyectos.h2}</h2>
          <p className="mt-5 max-w-[460px] text-base leading-relaxed text-ink-soft">{proyectos.apoyo}</p>
        </div>

        <nav aria-label={proyectos.indice_rotulo} className="lg:pt-1">
          <p className="label-mono text-[10.5px] text-ink-mute">{proyectos.indice_rotulo}</p>
          <ol className="mt-3 divide-y divide-line-2 border-y border-ink">
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
                    className="group grid min-h-14 grid-cols-[2.25rem_minmax(0,1fr)_1.25rem] items-baseline gap-x-3 gap-y-0.5 py-3 transition-colors duration-300 ease-editorial hover:bg-paper-2 sm:grid-cols-[2.75rem_minmax(0,1fr)_minmax(0,1fr)_1.25rem] lg:px-2"
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
      <PlateSection plate={radioPlate} reverse />

      <div className="container-editorial mt-16 lg:mt-24">
        <p className="label-mono text-[10.5px] text-ink-mute">{proyectos.mas_rotulo}</p>
        <div className="mt-3 grid gap-y-10 border-t border-ink pt-6 md:grid-cols-2 md:gap-x-10 wide:gap-x-14">
          {strips.map((strip) => {
            const project = getProject(strip.slug)!;
            const index = proyectoSlugs.indexOf(strip.slug);
            const crop = strip.crop;
            return (
              <article key={strip.slug} aria-labelledby={`franja-${strip.num}`} className="flex flex-col">
                <p className="font-mono text-sm text-cobalt">{strip.num}</p>
                <h3 id={`franja-${strip.num}`} className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.02em]">
                  {project.sceneLabel}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-ink-soft">{proyectos.items[index].descriptor}.</p>
                <figure className="m-0 mt-5">
                  <div
                    className="plate-crop border border-line-2 bg-paper-2"
                    style={{ "--cx": crop.x, "--cy": crop.y, "--cw": crop.w, "--ch": crop.h, "--iw": strip.shot.width, maxWidth: Math.round(crop.w * 1.3) } as CSSProperties}
                  >
                    <Image src={strip.shot.src} width={strip.shot.width} height={strip.shot.height} alt={strip.shot.alt} sizes="(min-width: 1440px) 1600px, (min-width: 768px) 120vw, 250vw" />
                  </div>
                  <figcaption className="mt-3 flex gap-2.5 text-sm leading-relaxed text-ink-mute">
                    <span aria-hidden className="mt-[7px] h-2 w-2 shrink-0 bg-cobalt" />
                    {strip.note}
                  </figcaption>
                </figure>
                <CaseLink slug={strip.slug} className="mt-2" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
