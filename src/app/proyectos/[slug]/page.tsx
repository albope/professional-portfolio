import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects, getProject } from "@/data/projects";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ctaHref, ctaLabel } from "@/data/site";

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
    description: project.summary,
    alternates: { canonical: `/proyectos/${project.slug}` },
  };
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pt-28 md:pt-36">
      {/* Cabecera */}
      <header className="container-editorial border-b border-line pb-14 md:pb-20">
        <Reveal>
          <Link
            href="/#proyectos"
            className="group inline-flex items-center gap-2 text-sm text-ink/50 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-editorial group-hover:-translate-x-1" />
            Todos los proyectos
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <p className="label-mono text-ink/55">
              {project.sector} · {project.type}
            </p>
            <span className="label-mono border border-ink/20 px-2 py-1 text-ink/55">
              {project.concept ? "Concepto" : "Proyecto real"}
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl text-display-lg font-medium text-ink">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-ink/60">{project.summary}</p>
        </Reveal>
      </header>

      {/* Visual */}
      <Reveal className="container-editorial mt-14 md:mt-20">
        <div className="relative aspect-[4/3] bg-ink-2 sm:aspect-[21/10]">
          <div className="absolute inset-0 p-6 md:p-10">
            <ProjectVisual variant={project.visual} />
          </div>
          <span className="label-mono absolute left-4 top-4 text-paper/30" aria-hidden>
            +
          </span>
          <span className="label-mono absolute bottom-4 right-4 text-paper/30" aria-hidden>
            +
          </span>
        </div>
      </Reveal>

      {/* Problema / Solución / Resultado */}
      <div className="container-editorial mt-14 md:mt-20">
        <Reveal className="grid gap-10 border-b border-line pb-14 md:grid-cols-3 md:gap-8 md:pb-20">
          {[
            { label: "Problema", body: project.problem },
            { label: "Solución", body: project.solution },
            { label: "Resultado", body: project.outcome },
          ].map((block) => (
            <div key={block.label} className="border-t border-line pt-6">
              <p className="label-mono mb-4 text-cobalt">{block.label}</p>
              <p className="text-[15px] leading-relaxed text-ink/70">{block.body}</p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Narrativa del caso */}
      <div className="container-editorial mt-14 grid gap-12 md:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="label-mono mb-5 text-ink/40">Tecnologías</p>
            <ul className="flex flex-col gap-2.5">
              {project.stack.map((tech) => (
                <li key={tech} className="flex items-center gap-3 font-mono text-sm text-ink/70">
                  <span className="inline-block h-[5px] w-[5px] bg-cobalt" aria-hidden />
                  {tech}
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-xs border-l-2 border-cobalt pl-4 text-xs leading-relaxed text-ink/50">
              {project.concept
                ? "Este caso es conceptual: describe una tipología de proyecto que BPM Tech desarrolla, no un encargo de un cliente real."
                : "Proyecto real desarrollado por BPM Tech, mostrado sin datos de cliente. Lo importante no es este caso concreto: es que el mismo enfoque se adapta a tu proyecto."}
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {project.caseSections.map((section, i) => (
            <Reveal key={section.title} delay={Math.min(i * 0.05, 0.15)}>
              <section className="border-t border-line py-10 first:border-t-0 first:pt-0 md:py-12">
                <h2 className="text-display-sm font-medium text-ink">{section.title}</h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">
                  {section.body}
                </p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA + siguiente proyecto */}
      <div className="mt-20 border-t border-line bg-ink text-paper md:mt-28">
        <div className="container-editorial flex flex-col gap-10 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <p className="label-mono mb-4 text-paper/40">¿Un problema parecido?</p>
            <p className="max-w-lg text-display-sm font-medium">
              Cuéntanos qué pasa en tu negocio y te diremos cómo lo abordaríamos.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href={ctaHref} tone="paper">
              {ctaLabel}
            </Button>
            <Button
              href={`/proyectos/${next.slug}`}
              tone="paper"
              variant="outline"
            >
              Siguiente proyecto
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
