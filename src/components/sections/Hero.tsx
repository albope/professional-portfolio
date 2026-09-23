import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { copyEs, partirFlecha } from "@/data/copy";
import { homeShots } from "@/data/projects";
import { ctaHref } from "@/data/site";

const { hero } = copyEs;
const secundaria = partirFlecha(hero.cta_secundaria);

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pagina-interior bg-paper">
      <div className="container-editorial pb-8 pt-10 md:pb-10 md:pt-14 wide:pt-16">
        <p className="label-mono max-w-[500px] text-[10px] leading-relaxed text-ink-mute sm:text-xs">
          {hero.etiqueta}
        </p>
        <div className="mt-7 grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-10 wide:gap-16">
          <div className="min-w-0">
            <h1 id="hero-title" className="display text-[clamp(24px,7.7vw,48px)] leading-[1.04] tracking-[-0.035em] lg:text-[clamp(40px,4.25vw,62px)]">
              {hero.h1_fijo}{" "}
              <span className="text-cobalt">{hero.h1_final}</span>
            </h1>
            <p className="mt-6 max-w-[570px] text-[17px] leading-[1.65] text-ink-soft md:text-lg">{hero.entradilla}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
              <Button href={ctaHref} size="lg" trackLocation="hero" className="w-full sm:w-auto">
                {hero.cta_primaria} <span aria-hidden>↗</span>
              </Button>
              <ArrowLink href="/#proyectos" arrow={secundaria.flecha} trackEvent="cta_click" trackLocation="hero" trackDestination="projects">
                {secundaria.texto}
              </ArrowLink>
            </div>
            <p className="mt-3 text-sm text-ink-mute">{hero.nota}</p>
          </div>
          <figure className="relative m-0 hidden border border-line bg-paper-2 lg:block">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="label-mono text-[10px] text-ink-mute">{hero.visual.rotulo}</span>
              <span aria-hidden className="flex items-end gap-1.5 text-cobalt">
                <span className="h-1 w-5 bg-current" /><span className="h-4 w-4 border-2 border-current" /><span className="h-4 w-4 bg-current" />
              </span>
            </div>
            <div className="relative overflow-hidden bg-escena-padel px-6 pb-12 pt-10 xl:px-8">
              <Image {...homeShots.padelRecepcion} alt={homeShots.padelRecepcion.alt} sizes="(min-width: 1440px) 465px, 38vw" className="h-auto w-full border border-white/20 shadow-xl" />
              <div className="absolute bottom-5 right-4 border border-line bg-paper px-4 py-3 shadow-lg">
                <p className="flex items-center gap-2 text-[13px] font-semibold"><span aria-hidden className="h-2 w-2 bg-cobalt" />{hero.visual.detalle}</p>
              </div>
            </div>
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-semibold">{hero.visual.nombre}</p>
                <p className="mt-1 text-xs text-ink-mute">{hero.visual.descripcion}</p>
              </div>
              <ArrowLink href="/proyectos/plataforma-clubes-padel" trackEvent="case_open" trackLocation="hero" trackProject="plataforma-clubes-padel" className="shrink-0 text-sm">{hero.visual.cta}</ArrowLink>
            </figcaption>
          </figure>
        </div>
        <ul className="mt-10 grid gap-3 border-t border-line pt-5 text-sm text-ink-soft sm:grid-cols-3 md:mt-14 md:gap-6">
          {hero.confianza.map((item) => (
            <li key={item} className="flex items-center gap-3"><span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-cobalt" />{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
