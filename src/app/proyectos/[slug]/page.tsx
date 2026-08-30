import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { Reveal } from "@/components/ui/Reveal";
import { SquareWord } from "@/components/ui/SquareWord";
import { ctaHref, ctaLabel } from "@/data/site";
import { cn } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.intro,
    alternates: { canonical: `/proyectos/${project.slug}` },
  };
}

const fichaCols: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export default function ProjectPage({ params }: PageProps) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const hasVisualBand = project.kind === "software";

  return (
    <article className="pt-28 lg:pt-[190px]">
      {/* Cabecera */}
      <header className="container-editorial border-b border-line pb-12 lg:pb-20">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-center gap-3.5 lg:mb-9">
            <Link
              href="/#proyectos"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
            >
              ← Proyectos
            </Link>
            {project.concept ? (
              <span className="border border-[#B9B6A9] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                Concepto
              </span>
            ) : (
              <span className="border border-cobalt px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cobalt">
                Proyecto real
              </span>
            )}
            <span className="font-mono text-[11px] text-ink-faint">
              {project.metaCase}
            </span>
          </div>
          <h1 className="display max-w-[1050px] text-display-case text-ink">
            {project.heroPre} <SquareWord word={project.heroWord} />
          </h1>
          <p className="mt-6 max-w-[640px] text-base leading-relaxed text-ink-mute lg:mt-8 lg:text-[19px]">
            {project.intro}
          </p>
        </Reveal>
      </header>

      {/* Ficha */}
      <Reveal>
        <section className="container-editorial border-b border-line py-0">
          <div
            className={cn(
              "grid gap-px bg-line sm:grid-cols-2",
              fichaCols[project.ficha.length] ?? "lg:grid-cols-4"
            )}
          >
            {project.ficha.map((entry) => (
              <div key={entry.label} className="bg-paper py-6 pr-6 sm:px-6 lg:px-10 lg:py-8">
                <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  {entry.label}
                </p>
                {entry.mono ? (
                  <p className="whitespace-pre-line font-mono text-xs leading-[1.8] text-ink-soft">
                    {entry.body}
                  </p>
                ) : (
                  <p className="text-sm leading-[1.55] text-ink-soft">{entry.body}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Visual abstracto */}
      {hasVisualBand && (
        <section className="bg-ink py-14 lg:py-20">
          <Reveal className="container-editorial">
            <div className="relative mx-auto max-w-[900px] border border-[#F7F6F2]/[0.14] p-6 sm:p-8 lg:p-12">
              <span
                aria-hidden
                className="absolute -left-1 -top-1 h-2 w-2 border-b border-r border-[#F7F6F2]/40"
              />
              <span
                aria-hidden
                className="absolute -bottom-1 -right-1 h-2 w-2 border-l border-t border-[#F7F6F2]/40"
              />
              <ProjectVisual variant={project.visual} context="case" />
              {project.visualCaption && (
                <p className="mt-6 font-mono text-[11px] text-[#F7F6F2]/50">
                  {project.visualCaption}
                </p>
              )}
            </div>
          </Reveal>
        </section>
      )}

      {/* Narrativa */}
      {project.caseSections && (
        <section className="container-editorial border-b border-line py-16 lg:py-[100px]">
          <div className="mx-auto flex max-w-[820px] flex-col gap-14 lg:gap-20">
            {project.caseSections.map((section, i) => (
              <Reveal key={section.index} delay={Math.min(i * 0.05, 0.1)}>
                <div className="grid gap-4 lg:grid-cols-[120px_1fr] lg:gap-10">
                  <span className="font-mono text-xs text-cobalt">{section.index}</span>
                  <div>
                    <h2 className="text-[22px] font-semibold text-ink lg:text-[28px]">
                      {section.title}
                    </h2>
                    <p className="mt-3.5 text-base leading-[1.7] text-ink-soft">
                      {section.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="bg-ink py-16 text-center lg:py-[100px]">
        <Reveal className="container-editorial">
          <h2 className="display text-[26px] text-paper lg:text-[52px] lg:leading-[1]">
            ¿Tu negocio necesita algo así<span className="font-sans">?</span>
          </h2>
          <p className="mt-6 text-[15px] text-paper/60 lg:text-[17px]">
            Cuéntanos el problema. Te decimos qué construiríamos y por dónde
            empezar.
          </p>
          <Link
            href={ctaHref}
            className="mt-8 inline-block bg-paper px-8 py-4 text-[15px] font-semibold text-ink transition-colors duration-300 ease-editorial hover:bg-cobalt-bright lg:mt-10"
          >
            {ctaLabel}
          </Link>
        </Reveal>
      </section>
    </article>
  );
}
