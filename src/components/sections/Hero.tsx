import { copyEs } from "@/data/copy";
import { Button } from "@/components/ui/Button";
import { BookingLink } from "@/components/booking/BookingLink";
import { HeroArt } from "@/components/hero/HeroArt";
import { HeroIllustration } from "@/components/hero/HeroIllustration";
import { sinCortes } from "@/lib/sin-cortes";

const { hero } = copyEs;

/**
 * Hero (especificación 3.2). Orden en el DOM, que es también el visual en
 * móvil: H1 → cuerpo (entradilla, botones, nota) → figura → compromisos.
 *
 * - Hasta 1179 px, una columna: la ilustración móvil (hasta 767 px, 440 px
 *   como máximo) o la de escritorio centrada a 600 px.
 * - Desde 1180 px, dos columnas `11fr / 12fr` (`10fr / 13fr` hasta 1279)
 *   con áreas `"title art" / "body art"`: H1 abajo en su celda,
 *   cuerpo arriba e ilustración centrada y desbordando a la derecha. El hero
 *   ocupa `min(100svh - cabecera, 900px)` con los compromisos abajo.
 * - En portátiles bajos (hasta 880 px de alto: un MacBook Air con Chrome
 *   deja 789) los huecos verticales se compactan y la ilustración se limita
 *   al alto que queda (`HeroIllustration.module.css`), para que los
 *   compromisos quepan en el primer pantallazo. El H1 no cambia: es el LCP.
 *   La variante va anidada en `1180:` (`1180:[@media(max-height:880px)]:`)
 *   para que Tailwind la escriba después de las de `1180:` y les gane.
 *
 * El H1 va a 45 px de 1180 a 1279 y a 54 px desde 1280, por debajo de los
 * 60 del token: «gestión de tu negocio» no cabe a 60 en la columna de texto
 * (unos 540 px) y el titular se partía en cuatro líneas con «Software a» sola
 * arriba. Así quedan tres: «Software a medida / para ordenar la / gestión de
 * tu negocio».
 *
 * El H1 y la entradilla no se animan: son el LCP. La ilustración es la única
 * parte cliente (`HeroIllustration`) y el SVG lo pinta el servidor.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-titulo"
      className="bg-bg pb-[clamp(56px,7vw,80px)] pt-[clamp(24px,4.5vw,64px)] 1180:grid 1180:min-h-[min(calc(100svh_-_var(--head-h)),900px)] 1180:grid-rows-[1fr_auto] 1180:items-center 1180:gap-y-10 1180:pb-10 1180:pt-[clamp(24px,3vw,48px)] 1180:[@media(max-height:880px)]:gap-y-6 1180:[@media(max-height:880px)]:pb-7 1180:[@media(max-height:880px)]:pt-3"
    >
      <div className="wrap grid gap-y-[22px] 1180:grid-cols-[minmax(0,11fr)_minmax(0,12fr)] 1180:gap-x-[clamp(40px,4.5vw,72px)] 1180:gap-y-[30px] 1180:[grid-template-areas:'title_art'_'body_art'] 1180:max-[1279px]:grid-cols-[minmax(0,10fr)_minmax(0,13fr)] 1180:[@media(max-height:880px)]:gap-y-[18px]">
        <h1
          id="hero-titulo"
          className="max-w-[12em] text-h1 1180:self-end 1180:[grid-area:title] 1180:max-[1279px]:text-[2.8125rem] 1280:text-[3.375rem]"
        >
          {hero.h1}
        </h1>

        <div className="grid max-w-[34em] gap-5 600:gap-6 1180:self-start 1180:[grid-area:body] 1180:[@media(max-height:880px)]:gap-[18px]">
          <p className="text-lead text-ink-2">{hero.entradilla}</p>
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-3.5">
            <Button
              href="#contacto"
              size="lg"
              arrow
              trackLocation="hero"
              className="max-[599px]:w-full max-[399px]:whitespace-normal max-[399px]:px-3.5 max-[399px]:text-button max-[399px]:leading-[1.2]"
            >
              {hero.cta}
            </Button>
            <BookingLink location="hero" variant="link" label={sinCortes(hero.reserva)} />
          </div>
          <p className="text-small text-ink-2">{hero.nota}</p>
        </div>

        <HeroIllustration
          pie={hero.ilustracion.pie}
          control={hero.ilustracion.control}
          className="mt-3 600:mx-auto 600:mt-6 600:w-full 600:max-w-[600px] 1180:m-0 1180:-mr-[clamp(0px,3.4vw,48px)] 1180:w-auto 1180:max-w-none 1180:self-center 1180:[grid-area:art]"
        >
          <HeroArt ilustracion={hero.ilustracion} />
        </HeroIllustration>
      </div>

      <ul
        aria-label={hero.compromisos.aria}
        className="wrap mt-12 grid grid-cols-2 gap-x-5 gap-y-[22px] max-[359px]:grid-cols-1 1024:grid-cols-4 1024:gap-x-8 1024:gap-y-1 1180:mt-0"
      >
        {/* Desde 1024 px, en una fila de cuatro, cada compromiso ocupa dos filas
            de la lista (`subgrid`): si un título parte en dos líneas, las
            descripciones siguen empezando a la misma altura. */}
        {hero.compromisos.items.map((item) => (
          <li
            key={item.titulo}
            className="grid content-start gap-1 border-t border-line-2 pt-4 1024:row-span-2 1024:grid-rows-subgrid 1180:[@media(max-height:880px)]:pt-3"
          >
            <strong className="text-small font-semibold leading-[1.35] tracking-[-0.005em]">
              {sinCortes(item.titulo)}
            </strong>
            <span className="text-caption text-ink-2">{item.texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
