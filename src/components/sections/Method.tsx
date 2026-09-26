import { BookingLink } from "@/components/booking/BookingLink";
import { PlayOnView } from "@/components/ui/PlayOnView";
import { ProcessLine } from "@/components/method/ProcessLine";
import { ProposalArt } from "@/components/method/ProposalArt";
import { Button } from "@/components/ui/Button";
import { copyEs } from "@/data/copy";
import { sinCortes } from "@/lib/sin-cortes";

const { metodo } = copyEs;

/**
 * Cómo trabajamos (especificación 3.5): la banda de tinta, segundo momento
 * visual de la página después del hero. Responde a «¿cómo sé qué voy a
 * pagar y cuándo?» con tres piezas:
 *
 * - Cabecera con la hoja «Propuesta» (4.7), que se marca punto por punto.
 *   Desde 980 px, texto 7fr | hoja 5fr con la hoja alineada a la derecha. En
 *   móvil, apiladas.
 * - Los cuatro pasos sobre la línea del proceso (4.8), cada uno con el
 *   compromiso que recibe el cliente. Solo los confirmados por BPM Tech.
 * - Cierre con el botón claro hacia el formulario y la reserva de la llamada.
 *
 * `bg-dark` basta para que el anillo de foco pase a `cobalt-bright` en toda
 * la banda (lo resuelve `globals.css`).
 */
export function Method() {
  return (
    <section id="como-trabajamos" aria-labelledby="como-trabajamos-titulo" className="section bg-dark text-on-dark">
      <div className="wrap">
        <div className="mb-[clamp(56px,7vw,96px)] grid gap-10 980:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] 980:items-center 980:gap-x-16">
          <header className="grid content-start gap-[22px]" data-reveal>
            <h2 id="como-trabajamos-titulo" className="max-w-[15em] text-h2">
              {metodo.h2}
            </h2>
            <p className="max-w-[30em] text-lead text-on-dark-2">{metodo.entradilla}</p>
          </header>
          <PlayOnView className="w-full max-w-[420px] 980:justify-self-end">
            <ProposalArt {...metodo.propuesta} />
          </PlayOnView>
        </div>

        <ProcessLine pasos={metodo.pasos} />

        <div
          className="mt-[clamp(56px,7vw,88px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t border-line-dark pt-7"
          data-reveal
        >
          <p className="max-w-[28em] text-[clamp(1.125rem,1rem+0.4vw,1.3125rem)] leading-[1.45]">{metodo.cierre.texto}</p>
          {/* Por debajo de 600 px, botón a todo el ancho y el enlace debajo. */}
          <div className="flex flex-wrap items-center gap-x-[26px] gap-y-3.5 max-[599px]:w-full max-[599px]:flex-col max-[599px]:items-stretch">
            <Button href="#contacto" variant="light" arrow trackLocation="method">
              {metodo.cierre.boton}
            </Button>
            <BookingLink
              location="method"
              variant="link"
              on="dark"
              label={sinCortes(metodo.cierre.reserva)}
              className="max-[599px]:self-start"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
