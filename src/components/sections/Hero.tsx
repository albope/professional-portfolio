import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroDiagram } from "@/components/sections/HeroDiagram";
import { ctaHref, ctaLabel, site } from "@/data/site";

export function Hero() {
  return (
    <section className="border-b border-line pt-32 md:pt-44">
      <div className="container-editorial">
        <Reveal>
          <p className="label-mono flex items-center gap-3 text-ink/50">
            <span className="inline-block h-[7px] w-[7px] bg-cobalt" aria-hidden />
            Estudio de software — {site.location}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-8 max-w-5xl text-display-xl font-medium text-ink">
            El software que tu negocio necesita{" "}
            <em className="font-display text-[1.06em] font-normal italic">
              no existe todavía.
            </em>{" "}
            Nosotros lo construimos.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-8 max-w-2xl text-lead text-ink/60">
            Diseñamos y desarrollamos software a medida, webs, automatización e
            inteligencia artificial aplicada: herramientas construidas alrededor
            de tus procesos, desde la primera conversación hasta producción.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-10 flex flex-wrap gap-4">
          <Button href={ctaHref}>{ctaLabel}</Button>
          <Button href="/#proyectos" variant="outline">
            Ver proyectos
          </Button>
        </Reveal>

        <Reveal delay={0.32} className="mt-20 pb-14 md:mt-28 md:pb-20">
          <HeroDiagram />
        </Reveal>
      </div>
    </section>
  );
}
