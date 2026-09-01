import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SquareWord } from "@/components/ui/SquareWord";
import { HeroDiagram } from "@/components/sections/HeroDiagram";
import { ctaHref, ctaLabel } from "@/data/site";

export function Hero() {
  return (
    <section className="border-b border-line pt-32 lg:pt-[184px]">
      <div className="container-editorial pb-14 lg:pb-[90px]">
        <Reveal>
          {/* Medido: a 11px la etiqueta completa ocupa 402px y parte la línea en
              móvil. Baja a 10px como el diseño móvil del handoff y reserva
              "· Valencia" para desktop, donde sobra sitio. En móvil la
              ubicación sigue estando en el pie. */}
          <p className="label-mono flex items-center gap-2.5 whitespace-nowrap text-[10px] tracking-[0.16em] text-ink-mute sm:gap-3 sm:text-[11px] sm:tracking-[0.18em]">
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 bg-cobalt sm:h-[7px] sm:w-[7px]"
              aria-hidden
            />
            <span>
              Tecnología a medida para empresas
              <span className="hidden sm:inline"> · Valencia</span>
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="display mt-7 max-w-[1100px] text-display-hero text-ink lg:mt-10">
            El software que te falta no se compra hecho. Se{" "}
            <SquareWord word="construye" />
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-[600px] text-[15px] leading-relaxed text-ink-mute lg:mt-9 lg:text-[19px]">
            Aplicaciones a medida, webs con identidad propia, automatización e
            inteligencia artificial aplicada a tu operativa. Te acompañamos
            desde la idea hasta el producto funcionando.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mt-11">
          <Button href={ctaHref} className="justify-center">
            {ctaLabel}
          </Button>
          <Button href="/#proyectos" variant="outline" className="justify-center">
            Ver proyectos
          </Button>
        </Reveal>

        <Reveal delay={0.32} className="mt-14 lg:mt-[110px]">
          <HeroDiagram />
        </Reveal>
      </div>
    </section>
  );
}
