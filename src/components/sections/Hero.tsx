import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { BookingLink } from "@/components/booking/BookingLink";
import { PlateNotes, TitleBlock } from "@/components/ui/Plate";
import { PlateStage } from "@/components/ui/PlateStage";
import { SquareWord } from "@/components/ui/SquareWord";
import { copyEs, partirUltimaPalabra } from "@/data/copy";
import { padelPlate } from "@/data/plates";
import { ctaHref } from "@/data/site";

const { hero } = copyEs;
/** El cuadrado cobalto hace de punto final del titular. */
const titular = partirUltimaPalabra(hero.h1.replace(/\.$/, ""));

/**
 * El primer pantallazo es un plano: la oferta a todo el ancho y, debajo, una
 * pantalla real de Padel Club OS con tres notas sobre sus decisiones. La
 * prueba y el contacto se ven sin animación ni interacción.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pagina-interior bg-paper">
      <div className="container-editorial pb-14 pt-7 md:pt-10 lg:pb-20 wide:pt-9">
        <p className="label-mono text-[10.5px] leading-relaxed text-ink-mute sm:text-xs">
          <span aria-hidden className="mr-3 inline-block h-2 w-2 bg-cobalt" />
          {hero.etiqueta}
          <span aria-hidden className="mx-3 hidden text-line-2 lg:inline">/</span>
          <span className="block lg:inline">{hero.lugar}</span>
        </p>

        <h1 id="hero-title" className="display mt-5 text-display-hero text-ink md:mt-6">
          {titular.antes}
          <SquareWord word={titular.ultima} />
        </h1>

        <div className="mt-8 grid gap-10 md:mt-10 xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] xl:gap-x-10 wide:gap-x-14">
          <div className="flex flex-col items-start md:max-w-[640px] xl:max-w-none">
            <p className="text-[17px] leading-[1.6] text-ink-soft md:text-lg xl:text-[17px] wide:text-lg">{hero.entradilla}</p>
            <div className="mt-7 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-start">
              <Button href={ctaHref} size="lg" trackLocation="hero" className="w-full sm:w-auto">
                {hero.cta_primaria} <span aria-hidden>↗</span>
              </Button>
              <BookingLink location="hero" tone="paper" />
            </div>
            <p className="mt-3 text-sm text-ink-mute">{hero.nota}</p>

            <div className="mt-8 flex w-full items-center gap-4 border-t border-line pt-5">
              <Image
                src="/sobre/retrato-1x1.jpg"
                width={716}
                height={716}
                alt="Retrato de Alberto Bort"
                sizes="64px"
                className="h-16 w-16 shrink-0 object-cover"
              />
              <p className="text-sm leading-snug text-ink-soft">
                <span className="block text-base font-semibold text-ink">{hero.firma.nombre}</span>
                {hero.firma.rol}
              </p>
            </div>
          </div>

          <figure className="plate m-0 min-w-0 -mx-4 md:mx-0">
            <figcaption className="sr-only">
              {hero.lamina}. {hero.lamina_pie}.
            </figcaption>
            <PlateStage
              plate={padelPlate}
              label={hero.lamina}
              caption={copyEs.proyectos.captura}
              layout={padelPlate.layout}
              eager
              padClassName="px-4 lg:px-6"
              phoneClassName="lg:right-6"
            />
            <div className="px-4 md:px-0">
              <PlateNotes notes={padelPlate.notes} className="mt-2 md:grid-cols-3 md:gap-x-6" />
              <TitleBlock entries={padelPlate.block} className="grid-cols-2 gap-x-6 md:grid-cols-4" />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
