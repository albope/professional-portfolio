import Image from "next/image";
import type { CSSProperties } from "react";
import { BookingLink } from "@/components/booking/BookingLink";
import { copyEs } from "@/data/copy";
import { sinCortes } from "@/lib/sin-cortes";

const { sobre } = copyEs;

/**
 * Ancho del retrato por tramos, con el contenedor de 2.3: desde 800 px ocupa
 * la columna de 5fr (unos 510 px con el contenedor a 1200, un 39 % del ancho
 * por debajo) y en una columna llega a 520 px como máximo con un 5 % de
 * margen a cada lado.
 */
const RETRATO_SIZES = "(min-width: 1312px) 510px, (min-width: 800px) 39vw, (min-width: 578px) 520px, 90vw";

/**
 * Quiénes somos (especificación 3.6). Responde a «¿quién está detrás?» con
 * lo que hace real a una empresa: una sociedad con sede, un responsable con
 * nombre y cara, y la razón social a la vista.
 *
 * En el DOM y en móvil va primero el texto y después el retrato: el
 * argumento se lee antes que la foto y, en un móvil, la foto no empuja el
 * titular fuera de la pantalla. Allí el retrato es 4:3 y recorta alto
 * (`object-position` 50 % 22 %) para que la cara quede en el tercio superior.
 * Desde 800 px pasa a la izquierda en 4:5, con el texto en la columna de
 * 6fr, las dos centradas en vertical.
 */
export function About() {
  return (
    <section id="quienes-somos" aria-labelledby="quienes-somos-titulo" className="section bg-bg">
      <div className="wrap grid gap-9 800:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] 800:items-center 800:gap-[clamp(40px,6vw,96px)]">
        <div className="grid content-center gap-[22px] 800:col-start-2 800:row-start-1" data-reveal>
          <h2 id="quienes-somos-titulo" className="text-h2">
            {sobre.h2}
          </h2>
          <p className="text-lead text-ink">{sobre.entradilla}</p>
          <p className="text-ink-2">{sobre.parrafo}</p>
          {/* Ficha: término a la izquierda (14em) y dato a la derecha. Por
              debajo de 600 px el término va encima. `overflow-wrap` evita que
              la razón social desborde a 320 px. */}
          <dl className="mt-2.5 border-t border-line">
            {sobre.ficha.map(({ termino, definicion }) => (
              <div
                key={termino}
                className="grid gap-0.5 border-b border-line py-[13px] text-small 600:grid-cols-[14em_minmax(0,1fr)] 600:gap-4"
              >
                <dt className="text-ink-2">{termino}</dt>
                <dd className="font-medium [overflow-wrap:anywhere]">{definicion}</dd>
              </div>
            ))}
          </dl>
          {/* Por debajo de 360 px el enlace baja a 15 px: a 17 px, rótulo y
              flecha no caben en 280 px y la flecha se iría al otro extremo. */}
          <div>
            <BookingLink location="about" variant="arrow" label={sinCortes(sobre.reserva)} className="max-[359px]:text-small" />
          </div>
        </div>
        <figure
          className="m-0 grid gap-3 max-[799px]:max-w-[520px] 800:col-start-1 800:row-start-1"
          data-reveal
          style={{ "--rd": 1 } as CSSProperties}
        >
          <Image
            src="/sobre/retrato-4x5.jpg"
            width={1072}
            height={1340}
            alt={sobre.retrato.alt}
            sizes={RETRATO_SIZES}
            className="aspect-[4/3] w-full rounded-portrait bg-sand object-cover object-[50%_22%] 800:aspect-[4/5] 800:object-center"
          />
          <figcaption className="text-caption text-ink-2">{sobre.retrato.pie}</figcaption>
        </figure>
      </div>
    </section>
  );
}
