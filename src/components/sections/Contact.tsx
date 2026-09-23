import { ContactForm } from "@/components/sections/ContactForm";
import { BookingLink } from "@/components/booking/BookingLink";
import { SquareWord } from "@/components/ui/SquareWord";
import { copyEs, partirUltimaPalabra } from "@/data/copy";
import { site } from "@/data/site";

const { contacto } = copyEs;
/** El copy trae el email dentro de la frase. Se parte para enlazarlo. */
const [anteEmail] = contacto.email_directo.split(site.email);
/** La última palabra conserva el cuadrado de la marca. */
const titular = partirUltimaPalabra(contacto.h2);

/** Contacto directo por escrito o mediante una primera conversación. */
export function Contact() {
  return (
    <section id="contacto" data-tono="oscuro" aria-label="Contacto" className="relative bg-ink text-paper">
      <div className="container-editorial seccion">
        <p className="label-mono text-paper/78">{contacto.kicker}</p>
        <h2 className="display mt-5 max-w-[1050px] text-[clamp(28px,5.5vw,80px)] leading-[1.02] text-paper">
          {titular.antes}
          <SquareWord word={titular.ultima} tone="dark" />
        </h2>

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-x-[88px] gap-y-10 md:mt-14">
          <div className="flex max-w-[520px] flex-col gap-8">
            <p className="text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-paper/78">{contacto.apoyo}</p>

            <div className="border border-paper/28 p-7">
              <p className="label-mono text-[11px] text-cobalt-bright">{contacto.opcion_hablando}</p>
              <h3 className="mt-3.5 text-[clamp(19px,1.6vw,23px)] font-semibold leading-[1.2] tracking-[-0.015em] text-paper">
                {contacto.llamada.titulo}
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-paper/78">{contacto.llamada.texto}</p>
              <BookingLink location="contact" className="mt-5 w-full sm:w-auto" />
            </div>

            <div className="border-t border-paper/16 pt-6">
              <h3 className="text-[17px] font-semibold text-paper">{contacto.que_pasa_despues.titulo}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-paper/78">{contacto.que_pasa_despues.texto}</p>
            </div>

            <p className="text-[15px] leading-[1.6] text-paper/78">
              {anteEmail}
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-center text-paper underline underline-offset-4 transition-colors duration-300 ease-editorial hover:text-cobalt-bright lg:min-h-0"
              >
                <span className="[overflow-wrap:anywhere]">{site.email}</span>
              </a>
            </p>
          </div>

          <div className="min-w-0">
            <p className="label-mono text-[11px] text-cobalt-bright">{contacto.opcion_escrito}</p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
