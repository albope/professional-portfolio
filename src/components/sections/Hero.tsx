import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RotatingWord } from "@/components/ui/RotatingWord";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { homeShots, getProject } from "@/data/projects";
import { ctaHref, ctaLabel } from "@/data/site";

const padel = getProject("plataforma-clubes-padel")!;

export function Hero() {
  return (
    <section aria-label="Presentación">
      <div className="grid items-start lg:grid-cols-[464fr_496fr] lg:gap-x-6 lg:pl-10 lg:pt-14 wide:grid-cols-[648px_1fr] wide:pl-[60px]">
        <div className="px-4 pt-7 md:px-10 lg:px-0 lg:pt-6 wide:pt-10">
          <h1 className="font-display text-[40px] uppercase leading-[0.96] tracking-[-0.01em] text-ink lg:text-[clamp(2.5rem,4.15vw,3.75rem)] wide:text-[60px]">
            Software y
            <br className="lg:hidden" /> webs
            <br className="hidden lg:inline" /> que
            <br className="lg:hidden" /> encajan
            <br className="hidden lg:inline" /> en
            <br className="lg:hidden" /> tu <RotatingWord />
          </h1>

          <p className="mt-7 max-w-[520px] text-base leading-[1.55] text-ink-soft lg:mt-6 lg:text-[17px] wide:mt-8 wide:text-[19px]">
            Ayudamos a pymes a ordenar su gestión, conectar sus herramientas y
            presentar mejor su negocio. Software y webs a medida, desde la
            primera conversación hasta la puesta en marcha.
          </p>

          {/* Móvil: un solo botón a todo el ancho y el enlace al trabajo debajo. */}
          <div className="mt-6 flex flex-col lg:hidden">
            <Button href={ctaHref} size="lg" trackLocation="hero" className="w-full">
              {ctaLabel}
            </Button>
            <ArrowLink href="/#proyectos" arrow="↓" className="mt-1">
              Ver el trabajo
            </ArrowLink>
          </div>

          <div className="mt-7 hidden gap-3 lg:flex wide:mt-9">
            <Button href={ctaHref} trackLocation="hero">
              {ctaLabel}
            </Button>
            <Button
              href="/#proyectos"
              variant="outline"
              trackLocation="hero"
              trackDestination="projects"
              className="shrink-0"
            >
              Ver el trabajo <span aria-hidden className="font-mono">↓</span>
            </Button>
          </div>
        </div>

        {/* El escenario sangra hasta el borde derecho del lienzo. En móvil la
            misma captura abre «Trabajo reciente», para que el titular no
            compita con la imagen. */}
        <div
          data-tono="oscuro"
          className="relative hidden overflow-hidden bg-escena-padel lg:block lg:aspect-[708/660]"
        >
          <p className="absolute left-6 top-5 font-mono text-[11px] uppercase tracking-[0.1em] text-escena-padel-texto wide:left-7 wide:top-6 wide:text-xs">
            {padel.sceneLabel}
          </p>
          <a
            href={padel.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-6 top-4 inline-flex min-h-6 items-center border-b border-escena-padel-texto/50 font-mono text-[11px] tracking-[0.06em] text-escena-padel-texto transition-colors duration-300 ease-editorial hover:border-escena-padel-texto wide:right-7 wide:top-5 wide:text-xs"
          >
            {padel.externalLabel} <span aria-hidden className="ml-1">↗</span>
            <span className="sr-only"> (se abre en otra pestaña)</span>
          </a>

          <Image
            {...homeShots.padelAcademia}
            alt={homeShots.padelAcademia.alt}
            sizes="(min-width: 1440px) 600px, 45vw"
            className="absolute right-0 top-[12.73%] h-auto w-[84.75%] border border-escena-padel-borde/55 border-r-0"
          />
          <Image
            {...homeShots.padelPortal}
            alt={homeShots.padelPortal.alt}
            sizes="(min-width: 1440px) 196px, 15vw"
            className="absolute left-[3.955%] top-[26.67%] z-20 h-auto w-[27.68%] border border-escena-padel-borde/55"
          />

          <div className="absolute left-[36.16%] right-[3.955%] top-[68.48%]">
            <h2 className="text-[17px] font-semibold leading-[1.2] tracking-[-0.01em] text-escena-padel-texto wide:text-xl">
              {padel.title}
            </h2>
            <p className="mt-2 max-w-[400px] text-[13px] leading-[1.55] text-escena-padel-texto/85 wide:mt-2.5 wide:text-sm">
              {padel.summary}
            </p>
            <Link
              href={`/proyectos/${padel.slug}`}
              data-track="case_open"
              data-track-location="hero"
              data-track-project={padel.slug}
              className="mt-3 inline-flex min-h-8 items-center gap-2 border-b border-escena-padel-texto/50 text-[13px] font-semibold text-escena-padel-texto transition-all duration-300 ease-editorial hover:gap-3 hover:border-escena-padel-texto wide:mt-4 wide:text-sm"
            >
              Ver el proyecto <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
