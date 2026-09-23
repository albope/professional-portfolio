import { SheetHeader } from "@/components/ui/SheetHeader";
import { copyEs } from "@/data/copy";

const { preguntas } = copyEs;

/** Preguntas nativas: legibles y desplegables también sin JavaScript. */
export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="faq-title" className="bg-paper-2">
      <div className="container-editorial seccion">
        <SheetHeader id="faq-title" label={preguntas.kicker} title={preguntas.h2} intro={preguntas.apoyo} />

        <div className="rejilla-editorial mt-8 lg:mt-12">
          <span aria-hidden className="hidden lg:block" />
          <div className="min-w-0 border-t border-ink">
            {preguntas.items.map((item, index) => (
              <details key={item.pregunta} open={index === 0} className="group border-b border-line-2">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 marker:content-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg font-semibold leading-snug tracking-[-0.015em] md:text-xl">{item.pregunta}</h3>
                  <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center border border-line-2 font-mono text-lg text-cobalt group-open:border-cobalt group-open:bg-cobalt group-open:text-paper">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <p className="max-w-[600px] pb-6 pr-2 text-base leading-relaxed text-ink-soft md:pr-12">{item.respuesta}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
