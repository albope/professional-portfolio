import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { copyEs, rellenar } from "@/data/copy";
import { contactHref, site } from "@/data/site";
import { ProjectDetailFigure, ProjectMainFigure } from "@/components/ui/ProjectFigure";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { BaseLink } from "@/components/ui/BaseLink";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { arrowLinkClasses, arrowLinkLabelClasses } from "@/components/ui/ArrowLink";
import { BookingLink } from "@/components/booking/BookingLink";
import { sinCortes } from "@/lib/sin-cortes";
import { cn } from "@/lib/utils";

const { ficha } = copyEs;

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
    alt: rellenar(ficha.og_alt, { nombre: project.name, tipo: project.kicker }),
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

/**
 * Bloque de lectura de la ficha: desde 980 px el titular va en una columna
 * izquierda de 4fr y el contenido en la de 8fr, siempre en la misma
 * vertical, con un filete arriba. Por debajo, apilados. Es la rejilla de
 * Preguntas en la portada, para que la ficha se lea igual que la home.
 */
function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-y-6 border-t border-line pt-8 980:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] 980:gap-x-16"
      data-reveal
    >
      <h2 id={id} className="max-w-[12em] text-feature-name">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/**
 * Ficha de proyecto con el sistema de la portada (especificación 5.6): tipo
 * frase, Schibsted Grotesk, papel, tinta y cobalto, capturas en escenarios
 * arena. Se lee de arriba abajo como un caso contado a un dueño de pyme:
 *
 * 1. Volver a proyectos, antetítulo, titular y entradilla. Solo Padel Club OS
 *    lleva su estado y el enlace a su web.
 * 2. La figura principal, con la misma composición que su tarjeta en la
 *    portada para que el proyecto se reconozca.
 * 3. Qué necesitaba resolver, qué se desarrolló (con sus funciones) y los
 *    detalles de interfaz que en la figura principal no se leen.
 * 4. Una decisión concreta, en la banda blanca.
 * 5. El cierre en la banda de tinta, con la consulta que llega al formulario
 *    con el proyecto de referencia (`/?proyecto=<slug>#contacto`) y la
 *    reserva de la llamada.
 *
 * Todo el texto sale de `projects.ts` (el caso) y de `copy.ficha` (los
 * rótulos comunes). Nada se anima en la parte alta: el titular y la figura
 * se pintan en su sitio. Los bloques de abajo aparecen al hacer scroll con
 * `data-reveal`.
 */
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { details } = project;
  const pair = details.length > 1;

  return (
    <article aria-labelledby="ficha-titulo">
      <header className="wrap pt-[clamp(24px,4vw,56px)]">
        {/* La flecha apunta hacia atrás y retrocede 3 px al pasar el ratón. */}
        <BaseLink href="/#proyectos" className={arrowLinkClasses({ className: "-ml-px text-small" })}>
          <ArrowIcon className="h-[15px] w-[15px] rotate-180 transition-transform duration-[250ms] ease-soft group-hover/arrow:-translate-x-[3px]" />
          <span className={arrowLinkLabelClasses}>{ficha.volver}</span>
        </BaseLink>

        <p className="mt-[clamp(24px,4vw,48px)] text-small text-ink-2">{project.kicker}</p>
        <h1 id="ficha-titulo" className="mt-2.5 max-w-[14em] text-h1">
          {project.name}
        </h1>
        <p className="mt-6 max-w-[38em] text-lead text-ink-2">{project.intro}</p>

        {(project.status || project.externalUrl) && (
          <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-1">
            {project.status && (
              <p className="py-2.5 text-small text-ink">
                {/* «Hecho» con el cuadrado macizo del glifo, como en la portada.
                    En línea con el texto, para que siga a la primera línea si
                    la frase se parte. */}
                <span aria-hidden="true" className="mr-2 inline-block h-[9px] w-[9px] bg-cobalt align-[1px]" />
                {project.status}
              </p>
            )}
            {project.externalUrl && project.externalLabel && (
              <TextLink href={project.externalUrl} external standalone className="text-small">
                {project.externalLabel}
              </TextLink>
            )}
          </div>
        )}
      </header>

      <div className="wrap mt-[clamp(36px,5vw,64px)]">
        <ProjectMainFigure figure={project.figure} />
      </div>

      <div className="wrap mt-[clamp(72px,9vw,128px)] grid gap-[clamp(56px,7vw,96px)]">
        <Block id="ficha-problema" title={ficha.problema.titulo}>
          <p className="max-w-[36em] text-lead text-ink-2">{project.problem}</p>
        </Block>

        <Block id="ficha-desarrollo" title={ficha.desarrollo.titulo}>
          <p className="max-w-[40em] text-body text-ink-2">{project.built.body}</p>
          <ul
            aria-label={ficha.desarrollo.funciones_aria}
            className="mt-7 grid border-t border-line 600:grid-cols-2 600:gap-x-8"
          >
            {project.built.features.map((feature) => (
              <li key={feature} className="border-b border-line py-3 text-small text-ink">
                {feature}
              </li>
            ))}
          </ul>
        </Block>

        {details.length > 0 && (
          <Block id="ficha-detalles" title={ficha.detalles.titulo}>
            <div className={cn("grid gap-10", pair && "700:grid-cols-2 700:gap-x-6 700:gap-y-0")}>
              {details.map((figure) => (
                <ProjectDetailFigure key={figure.label} figure={figure} pair={pair} />
              ))}
            </div>
          </Block>
        )}
      </div>

      <section
        aria-labelledby="ficha-decision"
        className="mt-[clamp(80px,10vw,136px)] border-y border-line bg-surface py-[clamp(56px,7vw,96px)]"
      >
        <div
          className="wrap grid gap-y-6 980:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] 980:gap-x-16"
          data-reveal
        >
          <h2 id="ficha-decision" className="max-w-[12em] text-feature-name">
            {ficha.decision.titulo}
          </h2>
          <div className="min-w-0">
            <p className="max-w-[36em] text-lead text-ink">{project.decision.body}</p>
            <p className="mt-7 max-w-[44em] border-t border-line pt-5 text-small text-ink-2">
              <strong className="font-semibold text-ink">{ficha.decision.nota}</strong> {project.decision.note}
            </p>
          </div>
        </div>
      </section>

      {/* Banda de tinta, como «Cómo trabajamos». El pie va justo debajo y es
          del mismo color: el filete inferior, dentro del contenedor, separa
          el cierre del pie. */}
      <section aria-labelledby="ficha-cierre" className="bg-dark text-on-dark">
        <div
          className="wrap section grid gap-9 border-b border-line-dark 980:grid-cols-[minmax(0,1fr)_auto] 980:items-end 980:gap-x-16"
          data-reveal
        >
          <div className="grid content-start gap-[18px]">
            <h2 id="ficha-cierre" className="max-w-[14em] text-h2">
              {ficha.cierre.titulo}
            </h2>
            <p className="max-w-[30em] text-lead text-on-dark-2">{project.nextStep}</p>
          </div>
          {/* Por debajo de 600 px, botón a todo el ancho y el enlace debajo. */}
          <div className="flex flex-wrap items-center gap-x-[26px] gap-y-3.5 max-[599px]:flex-col max-[599px]:items-stretch">
            <Button
              href={contactHref({ project: project.slug })}
              variant="light"
              arrow
              trackLocation="case"
              trackProject={project.slug}
            >
              {ficha.cierre.boton}
            </Button>
            <BookingLink
              location="case"
              project={project.slug}
              variant="link"
              on="dark"
              label={sinCortes(ficha.cierre.reserva)}
              className="max-[599px]:self-start"
            />
          </div>
        </div>
      </section>
    </article>
  );
}
