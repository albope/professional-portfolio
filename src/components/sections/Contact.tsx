import { SquareWord } from "@/components/ui/SquareWord";
import { ContactForm } from "@/components/sections/ContactForm";
import { BookingLink } from "@/components/booking/BookingLink";
import { booking } from "@/data/booking";
import { site } from "@/data/site";

export function Contact() {
  return (
    <section id="contacto" className="scroll-mt-24 bg-ink">
      <div className="container-editorial grid gap-x-20 gap-y-10 py-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:py-24">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="label-mono mb-6 text-paper/70">05 — Contacto</p>
          <h2 className="display text-display-sec text-paper">
            Cuéntanos qué necesitas <SquareWord word="resolver" tone="dark" />
          </h2>
          <p className="mt-6 max-w-[440px] text-base leading-[1.65] text-paper/75">
            No necesitas tener un proyecto definido. Puedes contarnos qué haces,
            qué te está dando trabajo o qué te gustaría poner en marcha.
          </p>
        </div>

        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ContactForm />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <div className="max-w-[440px] border-t border-line-dark pt-6">
            <h3 className="text-base font-semibold text-paper">¿Qué pasa después?</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              Revisamos tu mensaje y te contactamos para entender la necesidad.
              Si encaja, acordamos el siguiente paso; el alcance y el presupuesto
              se definen antes de empezar a construir.
            </p>
          </div>

          <div className="mt-8 max-w-[440px] border border-paper/25 p-5 sm:p-6">
            <h3 className="text-xl font-semibold text-paper">¿Prefieres una llamada?</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/75">
              Una videollamada de {booking.durationMinutes} minutos para conocernos,
              entender qué necesitas y valorar el siguiente paso. Sin compromiso.
            </p>
            <BookingLink location="contact" className="mt-5 w-full sm:w-auto" />
          </div>

          <p className="mt-6 max-w-[440px] text-sm leading-relaxed text-paper/75">
            También puedes escribirnos directamente:
            <a
              href={`mailto:${site.email}`}
              className="flex min-h-11 items-center text-paper underline underline-offset-4 hover:text-cobalt-bright"
            >
              <span className="[overflow-wrap:anywhere]">{site.email}</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
