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
 *
 * Rejilla: en móvil, entradilla, lámina y firma. Entre 768 y 1279 la firma
 * acompaña a la entradilla en su fila y la lámina va debajo a todo el ancho.
 * Desde 1280, entradilla y firma en la primera columna (424) y la lámina en
 * la segunda (872, desde x 508 a 1440).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pagina-interior bg-paper">
      <div className="container-editorial pb-10 pt-7 md:pb-14 md:pt-10 lg:pb-20 wide:pt-9">
        <p className="label-mono text-[10.5px] leading-relaxed text-ink-mute sm:text-xs">
          <span aria-hidden className="mr-3 inline-block h-2 w-2 bg-cobalt" />
          <span className="sm:hidden">{hero.etiqueta_corta}</span>
          <span className="hidden sm:inline">{hero.etiqueta}</span>
          <span aria-hidden className="mx-3 hidden text-line-2 sm:inline">/</span>
          <span className="sr-only">. </span>
          <span className="block sm:inline">{hero.lugar}</span>
        </p>

        <h1 id="hero-title" className="display mt-5 text-display-hero text-ink md:mt-6">
          {titular.antes}
          <SquareWord word={titular.ultima} />
        </h1>

        <div className="mt-8 grid gap-y-8 md:mt-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-x-10 md:gap-y-10 xl:grid-cols-[424fr_872fr] xl:grid-rows-[auto_1fr] xl:items-start xl:gap-x-6 xl:gap-y-8">
          <div className="flex flex-col items-start md:col-start-1 md:row-start-1">
            <p className="text-[17px] leading-[1.6] text-ink-soft md:text-lg xl:text-[17px] wide:text-lg">{hero.entradilla}</p>
            <div className="mt-7 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-start">
              <Button href={ctaHref} size="lg" trackLocation="hero" className="w-full sm:w-auto">
                {hero.cta_primaria} <span aria-hidden>↓</span>
              </Button>
              <BookingLink location="hero" tone="paper" />
            </div>
            <p className="mt-3 text-sm text-ink-mute">{hero.nota}</p>
          </div>

          {/* En móvil la firma va detrás de la lámina, para que la prueba
              entre antes en pantalla. */}
          <div className="order-last flex w-full items-center gap-4 border-t border-line-2 pt-4 md:order-none md:col-start-2 md:row-start-1 xl:col-start-1 xl:row-start-2">
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

          <figure
            aria-labelledby="lamina-01"
            className="plate m-0 -mx-4 min-w-0 md:col-span-2 md:mx-0 md:row-start-2 xl:col-span-1 xl:col-start-2 xl:row-span-2 xl:row-start-1"
          >
            <PlateStage plate={padelPlate} labelId="lamina-01" labelAs="h2" eager className="border-x-0 md:border-x" />
            <div className="px-4 md:px-0">
              <PlateNotes notes={padelPlate.notes} className="mt-4 hidden lg:grid lg:grid-cols-3 lg:gap-x-6" />
              <TitleBlock
                entries={padelPlate.block}
                className="mt-2 grid-cols-2 md:grid-cols-3 [&>div:first-child]:col-span-2 md:[&>div:first-child]:col-span-1"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
