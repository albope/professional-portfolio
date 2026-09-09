import { Button } from "@/components/ui/Button";
import { SquareWord } from "@/components/ui/SquareWord";
import { ctaHref, ctaLabel } from "@/data/site";

export function Hero() {
  return (
    <section className="border-b border-line pt-32 lg:pt-[156px]">
      <div className="container-editorial pb-14 lg:pb-20">
        <p className="label-mono flex items-center gap-3 text-ink-mute">
          <span className="h-[7px] w-[7px] shrink-0 bg-cobalt" aria-hidden />
          BPM Tech · Valencia y en remoto
        </p>

        <h1 className="display mt-7 max-w-[1120px] text-display-hero text-ink lg:mt-9">
          Software y webs que encajan en tu <SquareWord word="negocio" />
        </h1>

        <div className="mt-7 grid items-end gap-x-16 gap-y-7 lg:mt-10 lg:grid-cols-[1.15fr_1fr]">
          <p className="max-w-[610px] text-base leading-[1.65] text-ink-soft lg:text-lg">
            Ayudamos a pymes a ordenar su gestión, conectar sus herramientas y
            presentar mejor su negocio. Diseñamos y desarrollamos software y
            webs a medida, desde la primera conversación hasta la puesta en marcha.
          </p>
          <p className="max-w-[350px] text-sm leading-relaxed text-ink-mute lg:justify-self-end">
            Puedes venir con una idea, una tarea que se repite o una web que
            necesita mejorar. No hace falta tener un proyecto definido.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mt-9">
          <Button href={ctaHref} trackLocation="hero">
            {ctaLabel}
          </Button>
          <Button href="/#proyectos" variant="outline" trackLocation="hero" trackDestination="projects">
            Ver proyectos reales
          </Button>
        </div>
      </div>
    </section>
  );
}
