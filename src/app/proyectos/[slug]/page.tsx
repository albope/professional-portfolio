import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { site } from "@/data/site";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { Reveal } from "@/components/ui/Reveal";
import { SquareWord } from "@/components/ui/SquareWord";
import { BookingLink } from "@/components/booking/BookingLink";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const path = `/proyectos/${project.slug}`;
  const image = {
    url: `${path}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: `${project.title} · ${site.name}`,
  };

  return {
    title: project.title,
    description: project.intro,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: site.name,
      title: project.title,
      description: project.intro,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.intro,
      images: [image],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const contactHref = `/?proyecto=${project.slug}#contacto`;

  return (
    <article className="pt-28 lg:pt-[170px]">
      <header className="container-editorial border-b border-line pb-10 lg:pb-14">
        <Reveal>
          <div className="mb-7 flex flex-wrap items-center gap-3 lg:mb-9">
            <Link
              href="/#proyectos"
              className="py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute underline-offset-4 hover:underline"
            >
              ← Proyectos
            </Link>
            <span className="border border-cobalt px-2.5 py-1 font-mono text-xs uppercase tracking-[0.1em] text-cobalt">
              {project.statusLabel}
            </span>
            <span className="font-mono text-xs text-ink-faint">{project.metaCase}</span>
          </div>
          <h1 className="display max-w-[1050px] text-display-case text-ink">
            {project.heroPre} <SquareWord word={project.heroWord} />
          </h1>
          <p className="mt-6 max-w-[700px] text-base leading-relaxed text-ink-mute lg:text-lg">
            {project.intro}
          </p>
          {project.credit && <p className="mt-5 max-w-[700px] border-l-2 border-cobalt pl-4 text-sm leading-relaxed text-ink-mute">{project.credit}</p>}
          <Link
            href={contactHref}
            data-track="cta_click"
            data-track-location="case"
            data-track-project={project.slug}
            className="mt-6 inline-flex min-h-11 items-center gap-3 py-2 text-sm font-semibold text-cobalt underline-offset-4 hover:underline"
          >
            Tengo una necesidad parecida <span aria-hidden="true">↗</span>
          </Link>
        </Reveal>
      </header>

      <section className="container-editorial border-b border-line" aria-label="Ficha del proyecto">
        <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {project.ficha.map((entry) => (
            <div key={entry.label} className="bg-paper py-5 pr-5 sm:px-5 lg:px-6 lg:py-7">
              <dt className="mb-2 font-mono text-xs uppercase tracking-[0.1em] text-ink-faint">
                {entry.label}
              </dt>
              <dd className="text-sm leading-relaxed text-ink-soft">{entry.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-ink py-10 lg:py-14" aria-label="Esquema del proyecto">
        <div className="container-editorial">
          <figure className="mx-auto max-w-[900px] border border-paper/25 p-5 sm:p-8 lg:p-10">
            <ProjectVisual variant={project.visual} context="case" />
            <figcaption className="mt-6 font-mono text-xs leading-relaxed text-paper/75">
              {project.visualCaption}
            </figcaption>
          </figure>
        </div>
      </section>

      {project.capabilities && (
        <section className="container-editorial border-b border-line py-12 lg:py-20" aria-labelledby="case-capabilities-title">
          <h2 id="case-capabilities-title" className="display max-w-[760px] text-[30px] leading-tight lg:text-[42px]">Qué permite preparar el asistente</h2>
          <dl className="mt-8 grid gap-x-9 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
            {project.capabilities.map((capability) => (
              <div key={capability.label} className="border-t border-line pt-5">
                <dt className="text-lg font-semibold text-ink">{capability.label}</dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-ink-soft">{capability.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="container-editorial border-b border-line py-12 lg:py-20" aria-label="Desarrollo del proyecto">
        <div className="mx-auto flex max-w-[820px] flex-col gap-10 lg:gap-14">
          {project.caseSections.map((section) => (
            <Reveal key={section.index}>
              <div className="grid gap-3 lg:grid-cols-[70px_1fr] lg:gap-8">
                <span aria-hidden="true" className="font-mono text-xs text-cobalt">{section.index}</span>
                <div>
                  <h2 className="text-xl font-semibold text-ink lg:text-[26px]">{section.title}</h2>
                  <p className="mt-3 text-base leading-[1.7] text-ink-soft">{section.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink py-12 text-center lg:py-20" aria-labelledby="case-contact-title">
        <div className="container-editorial">
          <h2 id="case-contact-title" className="display text-[30px] leading-tight text-paper lg:text-[48px]">
            ¿Necesitas resolver algo parecido<span className="font-sans">?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[580px] text-base leading-relaxed text-paper/75">
            {project.nextStep}
          </p>
          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={contactHref}
              data-track="cta_click"
              data-track-location="case"
              data-track-project={project.slug}
              className="inline-flex min-h-12 items-center justify-center bg-paper px-7 py-4 text-sm font-semibold text-ink transition-colors hover:bg-cobalt-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt-bright"
            >
              Contar mi caso por escrito
            </Link>
            <BookingLink location="case" project={project.slug} />
          </div>
          <p className="mt-4 text-sm text-paper/75">No necesitas tener definido el proyecto.</p>
          <Link href="/#proyectos" className="mt-6 inline-block py-2 text-sm text-paper underline underline-offset-4">
            Ver otros proyectos
          </Link>
        </div>
      </section>
    </article>
  );
}
