import { SquareWord } from "@/components/ui/SquareWord";
import { ContactForm } from "@/components/sections/ContactForm";
import { BookingLink } from "@/components/booking/BookingLink";
import { booking } from "@/data/booking";
import { site } from "@/data/site";

export function Contact() {
  return (
    <section id="contacto" className="mt-16 scroll-mt-6 bg-ink text-paper lg:mt-0">
      <div className="container-editorial grid gap-y-8 pb-16 pt-14 lg:grid-cols-[536fr_696fr] lg:gap-y-0 lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-[88px] lg:pb-[112px] lg:pt-[104px]">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 className="font-display text-[32px] uppercase leading-none tracking-[-0.01em] text-paper lg:text-[40px]">
            Cuéntanos
            <br className="md:hidden" /> qué necesitas
            <br className="md:hidden" /> <SquareWord word="resolver" tone="dark" />
          </h2>
          <p className="mt-[18px] max-w-[440px] text-[15px] leading-[1.6] text-paper/78 lg:mt-6 lg:text-base">
            <span className="md:hidden">
              No necesitas tener un proyecto definido. Cuéntanos qué haces y qué te gustaría
              mejorar.
            </span>
            <span className="hidden md:inline">
              No necesitas tener un proyecto definido. Puedes contarnos qué haces, qué te está
              dando trabajo o qué te gustaría poner en marcha.
            </span>
          </p>
        </div>

        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ContactForm />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <div className="hidden max-w-[440px] border-t border-paper/15 pt-6 lg:block lg:mt-10">
            <h3 className="text-base font-semibold text-paper">¿Qué pasa después?</h3>
            <p className="mt-2.5 text-sm leading-[1.55] text-paper/72">
              Revisamos tu mensaje y te contactamos para entender la necesidad. Si encaja,
              acordamos el siguiente paso. El alcance y el presupuesto se definen antes de empezar
              a construir.
            </p>
          </div>

          <div className="max-w-[440px] border border-paper/28 p-5 lg:mt-8 lg:p-6">
            <h3 className="text-[17px] font-semibold text-paper lg:text-lg">
              ¿Prefieres una llamada?
            </h3>
            <p className="mt-1.5 text-sm leading-[1.55] text-paper/76 lg:mt-2">
              <span className="lg:hidden">
                Videollamada de {booking.durationMinutes} minutos para conocernos y valorar el
                siguiente paso. Sin compromiso.
              </span>
              <span className="hidden lg:inline">
                Una videollamada de {booking.durationMinutes} minutos para conocernos, entender
                qué necesitas y valorar el siguiente paso. Sin compromiso.
              </span>
            </p>
            <BookingLink location="contact" className="mt-3.5 w-full lg:mt-[18px] lg:w-auto" />
          </div>

          <p className="mt-6 max-w-[440px] text-sm leading-[1.55] text-paper/76 lg:mt-7">
            <span className="lg:hidden">O escríbenos: </span>
            <span className="hidden lg:inline">O escríbenos directamente: </span>
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
