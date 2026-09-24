import { ContactForm } from "@/components/sections/ContactForm";
import { BookingLink } from "@/components/booking/BookingLink";
import { SquareWord } from "@/components/ui/SquareWord";
import { copyEs, partirUltimaPalabra } from "@/data/copy";
import { site } from "@/data/site";

const { contacto } = copyEs;
/** El copy trae el email dentro de la frase. Se parte para enlazarlo. */
const [anteEmail] = contacto.email_directo.split(site.email);
/** El cuadrado de la marca hace de punto final, como en el titular del hero. */
const titular = partirUltimaPalabra(contacto.h2.replace(/\.$/, ""));

/**
 * Contacto directo por escrito o mediante una primera conversación. En móvil
 * el formulario va justo después del apoyo: quien llega desde «Cuéntame qué
 * necesitas» aterriza donde se escribe. En escritorio ocupa la segunda columna
 * de la rejilla (desde x 508 a 1440) y la llamada, la primera.
 */
export function Contact() {
  return (
    <section id="contacto" data-tono="oscuro" aria-labelledby="contact-title" className="relative bg-ink text-paper">
      <div className="container-editorial seccion">
        <p className="label-mono flex items-center gap-2.5 text-cobalt-bright">
          <span aria-hidden className="h-2 w-2 bg-cobalt-bright" />
          {contacto.kicker}
        </p>
        <h2 id="contact-title" className="display mt-5 max-w-[960px] text-[clamp(30px,4.45vw,64px)] leading-[1.02] text-paper">
          {titular.antes}
          <SquareWord word={titular.ultima} tone="dark" />
        </h2>

        {/* Orden del documento: apoyo, formulario, qué pasa después, llamada y
            email. En móvil se lee así; desde 1024 el formulario ocupa la
            segunda columna y lo demás se apila en la primera. */}
        <div className="mt-8 flex flex-col gap-8 md:mt-12 lg:grid lg:grid-cols-[424fr_872fr] lg:grid-rows-[auto_auto_auto_1fr] lg:items-start lg:gap-x-6 lg:gap-y-8">
          <p className="max-w-[520px] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-paper/78 lg:col-start-1 lg:row-start-1">{contacto.apoyo}</p>

          <div className="min-w-0 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:max-w-[760px]">
            <p className="label-mono text-[11px] text-cobalt-bright">{contacto.opcion_escrito}</p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>

          <div className="border-t border-paper/16 pt-6 lg:col-start-1 lg:row-start-3">
            <h3 className="text-[17px] font-semibold text-paper">{contacto.que_pasa_despues.titulo}</h3>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-paper/78">{contacto.que_pasa_despues.texto}</p>
          </div>

          <div className="border border-paper/28 p-6 sm:p-7 lg:col-start-1 lg:row-start-2">
            <p className="label-mono text-[11px] text-cobalt-bright">{contacto.opcion_hablando}</p>
            <h3 className="mt-3.5 text-[clamp(19px,1.6vw,23px)] font-semibold leading-[1.2] tracking-[-0.015em] text-paper">
              {contacto.llamada.titulo}
            </h3>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-paper/78">{contacto.llamada.texto}</p>
            <BookingLink location="contact" className="mt-5 w-full sm:w-auto" />
          </div>

          <p className="text-[15px] leading-[1.6] text-paper/78 lg:col-start-1 lg:row-start-4">
            {anteEmail}
            <a
              href={`mailto:${site.email}`}
              className="-my-3 inline-flex items-center py-3 text-paper underline underline-offset-4 transition-colors duration-300 ease-editorial hover:text-cobalt-bright"
            >
              <span className="[overflow-wrap:anywhere]">{site.email}</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
