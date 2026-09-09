import { SquareWord } from "@/components/ui/SquareWord";
import { ContactForm } from "@/components/sections/ContactForm";

export function Contact() {
  return (
    <section id="contacto" className="scroll-mt-24 bg-ink">
      <div className="container-editorial grid gap-x-20 gap-y-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="label-mono mb-6 text-paper/70">05 — Contacto</p>
          <h2 className="display text-display-sec text-paper">
            Cuéntanos qué necesitas <SquareWord word="resolver" tone="dark" />
          </h2>
          <p className="mt-6 max-w-[440px] text-base leading-[1.65] text-paper/75">
            No necesitas tener un proyecto definido. Puedes contarnos qué haces,
            qué te está dando trabajo o qué te gustaría poner en marcha.
          </p>

          <div className="mt-8 max-w-[440px] border-t border-line-dark pt-6">
            <h3 className="text-base font-semibold text-paper">¿Qué pasa después?</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              Revisamos tu mensaje y te contactamos para entender la necesidad.
              Si encaja, acordamos el siguiente paso; el alcance y el presupuesto
              se definen antes de empezar a construir.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
