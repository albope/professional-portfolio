import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RotatingPhrase } from "@/components/ui/RotatingPhrase";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { homeShots, getProject } from "@/data/projects";
import { copyEs, lineasDelTitular, partirFlecha } from "@/data/copy";
import { ctaHref } from "@/data/site";

const { hero, destacado } = copyEs;
const padel = getProject("plataforma-clubes-padel")!;
const lineas = lineasDelTitular();
const secundaria = partirFlecha(hero.cta_secundaria);
const enlacePadel = partirFlecha(destacado.enlace_externo);
const ctaDestacado = partirFlecha(destacado.cta);

/**
 * El titular ocupa tres líneas fijas y una cuarta animada. A la derecha, el
 * escenario del producto sangra hasta el borde del lienzo.
 *
 * En móvil el escenario no acompaña al titular: la captura pasa a abrir
 * «Problemas reales», donde el destacado se lee como tarjeta. Así el titular
 * no compite con la imagen y ninguna captura desborda los 390 px.
 */
export function Hero() {
  return (
    <section aria-label="Presentación">
      {/* La columna del titular mide 680 px y no los 536 de la rejilla de
          sección: a 54 px «procesos manuales» pide 675 px de una línea y la
          frase larga necesita 537 para caer en dos. A 536 rompería a tres y la
          altura reservada de 1,92 em dejaría de cuadrar. */}
      <div className="grid items-start lg:grid-cols-[56fr_44fr] lg:gap-x-[88px] lg:pl-10 lg:pt-14 wide:grid-cols-[680px_1fr] wide:pl-[60px]">
        <div className="px-4 pt-8 md:px-10 lg:px-0 lg:pt-6 wide:pt-10">
          <h1 className="font-display text-[40px] uppercase leading-[0.96] tracking-[-0.01em] text-ink lg:text-[clamp(2.5rem,3.75vw,3.375rem)] wide:text-[54px]">
            {lineas.map((linea) => (
              <span key={linea} className="block">
                {linea}
              </span>
            ))}
            <RotatingPhrase />
          </h1>

          <p className="mt-6 max-w-[520px] text-base leading-[1.55] text-ink-soft lg:mt-6 lg:text-[17px] wide:mt-8 wide:text-[19px] wide:leading-[1.6]">
            {hero.entradilla}
          </p>

          {/* Móvil: el botón ocupa el ancho y el enlace baja debajo. */}
          <div className="mt-7 flex flex-col items-start gap-1 lg:mt-7 lg:flex-row lg:items-center lg:gap-7 wide:mt-9">
            <Button href={ctaHref} size="lg" trackLocation="hero" className="w-full lg:w-auto">
              {hero.cta_primaria}
            </Button>
            <ArrowLink
              href="/#proyectos"
              arrow={secundaria.flecha}
              trackEvent="cta_click"
              trackLocation="hero"
              trackDestination="projects"
              className="shrink-0"
            >
              {secundaria.texto}
            </ArrowLink>
          </div>
        </div>

        <div
          data-tono="oscuro"
          className="relative hidden overflow-hidden bg-escena-padel lg:block lg:aspect-[612/660]"
        >
          <p className="absolute left-6 top-5 font-mono text-[11px] uppercase tracking-[0.1em] text-escena-padel-texto wide:left-7 wide:top-6 wide:text-xs">
            {destacado.etiqueta}
          </p>
          <a
            href={padel.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-6 top-4 inline-flex min-h-6 items-center border-b border-escena-padel-texto/50 font-mono text-[11px] tracking-[0.06em] text-escena-padel-texto transition-colors duration-300 ease-editorial hover:border-escena-padel-texto wide:right-7 wide:top-5 wide:text-xs"
          >
            {enlacePadel.texto}
            <span aria-hidden className="ml-1">{enlacePadel.flecha}</span>
            <span className="sr-only"> (se abre en otra pestaña)</span>
          </a>

          <Image
            {...homeShots.padelAcademia}
            alt={homeShots.padelAcademia.alt}
            sizes="(min-width: 1440px) 600px, 45vw"
            priority
            className="absolute right-0 top-[12.73%] h-auto w-[84.75%] border border-escena-padel-borde/55 border-r-0"
          />
          <Image
            {...homeShots.padelPortal}
            alt={homeShots.padelPortal.alt}
            sizes="(min-width: 1440px) 196px, 15vw"
            priority
            className="absolute left-[3.955%] top-[26.67%] z-20 h-auto w-[27.68%] border border-escena-padel-borde/55"
          />

          <div className="absolute left-[36.16%] right-[3.955%] top-[66%]">
            <h2 className="text-[17px] font-semibold leading-[1.2] tracking-[-0.01em] text-escena-padel-texto wide:text-[21px]">
              {destacado.titulo}
            </h2>
            <p className="mt-2 max-w-[400px] text-[13px] leading-[1.55] text-escena-padel-texto/85 wide:mt-2.5 wide:text-sm">
              {destacado.texto}
            </p>
            <Link
              href={`/proyectos/${padel.slug}`}
              data-track="case_open"
              data-track-location="hero"
              data-track-project={padel.slug}
              className="mt-3 inline-flex min-h-8 items-center gap-2 border-b border-escena-padel-texto/50 text-[13px] font-semibold text-escena-padel-texto transition-all duration-300 ease-editorial hover:gap-3 hover:border-escena-padel-texto wide:mt-4 wide:text-sm"
            >
              {ctaDestacado.texto}
              <span aria-hidden>{ctaDestacado.flecha}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
