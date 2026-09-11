import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { site } from "@/data/site";
import { SquareWord } from "@/components/ui/SquareWord";
import { ProjectFigure } from "@/components/ui/ProjectFigure";
import { Button } from "@/components/ui/Button";
import { BookingLink } from "@/components/booking/BookingLink";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Los escenarios sangran en móvil y recuperan el margen del lienzo arriba. */
const inset = "w-full md:px-10 wide:px-[60px]";
const dtClass = "font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute lg:text-[11px] lg:tracking-[0.1em]";
const titleClass = "text-xl font-semibold leading-[1.2] tracking-[-0.015em] lg:text-2xl lg:leading-[1.15]";
const pairClass = "lg:grid lg:grid-cols-[424fr_872fr] lg:gap-x-6";

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
  const [principal, ...detalles] = project.figures;

  return (
    <article>
      <header className="container-editorial pt-6 lg:pt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <Link
            href="/#proyectos"
            className="inline-flex min-h-8 items-center self-start font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute underline-offset-4 transition-colors duration-300 ease-editorial hover:text-ink hover:underline lg:text-xs"
          >
            ← Proyectos
          </Link>
          <p className="flex flex-wrap items-center gap-x-3.5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute md:flex-nowrap md:whitespace-nowrap lg:text-xs lg:tracking-[0.1em]">
            <span className="md:hidden">{project.metaShort}</span>
            {project.meta.map((item) => (
              <span key={item} className="hidden md:inline">{item}</span>
            ))}
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-6 items-center border-b border-ink normal-case tracking-[0.04em] text-ink"
              >
                {project.externalLabel} <span aria-hidden>↗</span>
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
            )}
          </p>
        </div>

        <h1 className="display mt-5 max-w-[1000px] text-[34px] leading-[0.98] text-ink lg:mt-10 lg:text-[56px]">
          {project.heroPre} <SquareWord word={project.heroWord} />
        </h1>

        <div className="mt-5 lg:mt-8 lg:grid lg:grid-cols-[760fr_472fr] lg:items-end lg:gap-x-[88px]">
          <p className="text-base leading-[1.55] text-ink-soft lg:text-[19px]">{project.intro}</p>
          {project.aside && (
            <p className="mt-4 border-l-2 border-cobalt pl-4 text-sm leading-[1.55] text-ink-mute lg:mt-0">
              {project.aside}
            </p>
          )}
        </div>
      </header>

      <ProjectFigure figure={principal} size="principal" className={`mt-6 lg:mt-12 ${inset}`} />

      <div className="container-editorial">
        <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-b-line border-t-ink pb-6 pt-5 lg:mt-12 lg:grid-cols-4 lg:gap-x-6 lg:pb-7 lg:pt-6">
          {project.ficha.map((entry) => (
            <div key={entry.label}>
              <dt className={dtClass}>{entry.label}</dt>
              <dd className="mt-1.5 text-sm leading-[1.5] text-ink-soft lg:mt-2.5 lg:text-[15px]">
                {entry.body}
              </dd>
            </div>
          ))}
        </dl>

        <section
          aria-label="Desarrollo del proyecto"
          className="flex flex-col gap-9 pt-12 lg:gap-16 lg:pt-24"
        >
          <div className={pairClass}>
            <h2 className={titleClass}>Qué necesitaba resolver</h2>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-soft lg:mt-0 lg:max-w-[680px] lg:text-[17px] lg:leading-[1.65]">
              {project.problem}
            </p>
          </div>

          <div className={pairClass}>
            <h2 className={titleClass}>Qué se desarrolló</h2>
            <div className="mt-2.5 lg:mt-0 lg:max-w-[680px]">
              <p className="text-[15px] leading-[1.6] text-ink-soft lg:text-[17px] lg:leading-[1.65]">
                {project.built.body}
              </p>
              <ul className="mt-4 grid gap-x-6 text-sm leading-[1.5] text-ink-soft lg:mt-6 lg:grid-cols-2 lg:text-[15px]">
                {project.built.features.map((feature, index, all) => (
                  <li
                    key={feature}
                    className={`border-t border-line py-2 lg:py-2.5 ${
                      index === all.length - 1 ? "border-b" : ""
                    } ${index === all.length - 2 && all.length % 2 === 0 ? "lg:border-b" : ""}`}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {detalles.length > 0 && (
        <section
          aria-label="Detalles de interfaz"
          className={`grid items-start gap-y-8 pt-12 lg:gap-x-6 lg:pt-24 ${inset} ${
            detalles.length > 1 ? "min-[900px]:grid-cols-[760fr_536fr]" : ""
          }`}
        >
          {detalles.map((figure) => (
            <ProjectFigure key={figure.captionLabel} figure={figure} />
          ))}
        </section>
      )}

      <section aria-label="Una decisión concreta" className={`mt-12 lg:mt-24 ${inset}`}>
        <div className={`bg-paper-2 px-4 pb-8 pt-7 lg:px-10 lg:pb-12 lg:pt-11 ${pairClass}`}>
          <h2 className={titleClass}>Una decisión concreta</h2>
          <div className="lg:max-w-[720px]">
            <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-soft lg:mt-0 lg:text-[17px] lg:leading-[1.65]">
              {project.decision.body}
            </p>
            <p className="mt-4 text-sm leading-[1.55] text-ink-mute lg:mt-5 lg:text-[15px]">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink lg:text-[11px]">
                Para otro negocio ·{" "}
              </span>
              {project.decision.note}
            </p>
          </div>
        </div>
      </section>

      <section
        id="contacto"
        aria-labelledby="ficha-cta"
        className="mt-12 scroll-mt-6 bg-ink text-paper lg:mt-[120px]"
      >
        <div className="container-editorial pb-16 pt-14 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-6 lg:pb-[104px] lg:pt-24">
          <div>
            <h2
              id="ficha-cta"
              className="font-display text-[28px] uppercase leading-none tracking-[-0.01em] text-paper lg:text-[40px]"
            >
              ¿Necesitas resolver algo parecido<span className="font-sans">?</span>
            </h2>
            <p className="mt-4 max-w-[560px] text-[15px] leading-[1.6] text-paper/78 lg:mt-6 lg:text-[17px]">
              {project.nextStep}
            </p>
          </div>
          <div className="mt-6 flex flex-col items-stretch gap-2.5 lg:mt-0 lg:items-start lg:gap-3 lg:pt-2">
            <Button
              href={contactHref}
              tone="paper"
              size="lg"
              trackLocation="case"
              trackProject={project.slug}
              className="lg:px-7"
            >
              Contar mi caso por escrito
            </Button>
            <BookingLink location="case" project={project.slug} className="min-h-[52px] lg:px-6" />
            <Link
              href="/#proyectos"
              className="mt-1.5 inline-flex min-h-11 items-center self-start text-sm text-paper underline underline-offset-4 transition-colors duration-300 ease-editorial hover:text-cobalt-bright lg:mt-3"
            >
              Ver otros proyectos
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
