import { ContactForm } from "@/components/sections/ContactForm";
import { BookingLink } from "@/components/booking/BookingLink";
import { copyEs } from "@/data/copy";
import { site } from "@/data/site";

const { contacto } = copyEs;
/** El copy trae el email dentro de la frase. Se parte para enlazarlo. */
const [anteEmail] = contacto.email_directo.split(site.email);

export function Contact() {
  return (
    <section id="contacto" className="mt-16 scroll-mt-6 bg-ink text-paper lg:mt-24 wide:mt-[120px]">
      <div className="container-editorial grid gap-y-9 pb-16 pt-14 lg:grid-cols-[536fr_696fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-[88px] lg:gap-y-0 lg:pb-[112px] lg:pt-[104px]">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 className="display text-[28px] leading-[1.02] text-paper lg:text-[32px] wide:text-[40px]">
            {contacto.h2}
          </h2>
          <p className="mt-4 max-w-[440px] text-[15px] leading-[1.6] text-paper/78 lg:mt-6 lg:text-base wide:text-[17px]">
            {contacto.apoyo}
          </p>
        </div>

        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ContactForm />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <div className="max-w-[440px] border-t border-paper/16 pt-6 lg:mt-10">
            <h3 className="text-base font-semibold text-paper lg:text-[17px]">
              {contacto.que_pasa_despues.titulo}
            </h3>
            <p className="mt-2.5 text-sm leading-[1.6] text-paper/78">
              {contacto.que_pasa_despues.texto}
            </p>
          </div>

          <div className="mt-6 max-w-[440px] border border-paper/28 p-5 lg:mt-8 lg:p-6">
            <h3 className="text-[17px] font-semibold text-paper lg:text-lg">
              {contacto.llamada.titulo}
            </h3>
            <p className="mt-2 text-sm leading-[1.6] text-paper/78">{contacto.llamada.texto}</p>
            <BookingLink location="contact" className="mt-4 w-full lg:mt-[18px] lg:w-auto" />
          </div>

          <p className="mt-6 max-w-[440px] text-sm leading-[1.6] text-paper/78 lg:mt-7">
            {anteEmail}
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-11 items-center text-paper underline underline-offset-4 transition-colors duration-300 ease-editorial hover:text-cobalt-bright lg:min-h-0"
            >
              <span className="[overflow-wrap:anywhere]">{site.email}</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
