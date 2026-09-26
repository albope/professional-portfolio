import type { CSSProperties } from "react";
import { BookingLink } from "@/components/booking/BookingLink";
import { ContactForm } from "@/components/sections/ContactForm";
import { TextLink } from "@/components/ui/TextLink";
import { copyEs, partirEnlace } from "@/data/copy";
import { site } from "@/data/site";
import { sinCortes } from "@/lib/sin-cortes";
import { cn } from "@/lib/utils";

const { contacto } = copyEs;
const { lateral } = contacto;
/** «O escríbenos a …»: el email se enlaza dentro de la frase del copy. */
const email = partirEnlace(lateral.email, site.email);

/**
 * Contacto (especificación 3.8): el final de todos los caminos de la página.
 * Lo que hay que hacer (el formulario) y lo que pasará después, para que
 * escribir no sea un salto al vacío.
 *
 * Orden del DOM, que es el de móvil: cabecera, formulario y «Qué pasa
 * después». Quien llega desde un «Hacer una consulta» aterriza en el titular
 * y tiene el formulario justo debajo. Desde 1024 px, rejilla 5fr | 6fr con
 * la cabecera y el lateral apilados a la izquierda y la tarjeta del
 * formulario ocupando las dos filas a la derecha.
 *
 * El formulario es el único componente cliente: recibe sus textos por props
 * para no llevar `copy.json` al navegador.
 */
export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="section bg-bg">
      <div className="wrap grid gap-10 1024:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] 1024:grid-rows-[auto_1fr] 1024:items-start 1024:gap-x-[clamp(48px,6vw,96px)]">
        <header className="grid content-start gap-5 1024:col-start-1 1024:row-start-1" data-reveal>
          <h2 id="contacto-titulo" className="text-h2">
            {contacto.h2}
          </h2>
          <p className="text-lead text-ink-2">{contacto.entradilla}</p>
        </header>

        {/* Tarjeta del formulario: blanca, radio 18 y la sombra larga y
            suave de 2.4, lo único que se levanta del fondo en la sección. */}
        <div
          className="min-w-0 rounded-form border border-line bg-surface p-[clamp(22px,3.4vw,40px)] shadow-form 1024:col-start-2 1024:row-span-2 1024:row-start-1"
          data-reveal
          style={{ "--rd": 1 } as CSSProperties}
        >
          <ContactForm texts={contacto.formulario} email={site.email} />
        </div>

        <div className="grid content-start gap-6 1024:col-start-1 1024:row-start-2" data-reveal>
          <h3 className="-mb-2 text-[1.0625rem] font-semibold leading-[1.3] tracking-[-0.01em]">{lateral.titulo}</h3>
          {/* Los tres pasos con el vocabulario del glifo: cuadrados huecos
              para lo que viene y el último macizo en cobalto, la propuesta,
              que es lo que se lleva quien escribe. El número es decorativo:
              la lista ordenada ya lo anuncia. */}
          <ol className="border-t border-line">
            {lateral.pasos.map((paso, index) => {
              const ultimo = index === lateral.pasos.length - 1;
              return (
                <li
                  key={paso.destacado}
                  className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-b border-line py-[15px] text-base leading-normal text-ink-2"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "-mt-px grid h-[26px] w-[26px] place-items-center border-[1.5px] text-micro font-semibold",
                      ultimo ? "border-cobalt bg-cobalt text-white" : "border-ink text-ink",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span>
                    <strong className="font-semibold text-ink">{paso.destacado}</strong> {sinCortes(paso.resto)}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="grid gap-3.5 rounded-card border border-line-2 p-[22px]">
            <p className="text-small text-ink-2">
              <strong className="mb-0.5 block text-[1.0625rem] font-semibold leading-[1.4] text-ink">
                {lateral.llamada.titulo}
              </strong>
              {sinCortes(lateral.llamada.texto)}
            </p>
            {/* Por debajo de 360 px el botón ocupa el ancho y puede partir
                línea: sin partir, su ancho mínimo empuja la columna fuera del
                contenedor en las pantallas más estrechas. */}
            <BookingLink
              location="contact"
              variant="ghost"
              label={lateral.llamada.boton}
              className="justify-self-start max-[359px]:w-full max-[359px]:whitespace-normal"
            />
          </div>

          <p className="text-small text-ink-2">
            {email.antes}
            {email.enlace ? (
              <TextLink href={`mailto:${site.email}`} className="[overflow-wrap:anywhere]">
                {email.enlace}
              </TextLink>
            ) : null}
            {email.despues}
          </p>
        </div>
      </div>
    </section>
  );
}
