import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { principles, capabilities } from "@/data/principles";

export function Principles() {
  return (
    <section className="bg-ink text-paper">
      <div className="container-editorial py-24 md:py-32">
        <SectionHeading
          tone="paper"
          index="05"
          eyebrow="Principios"
          title="Nuestra forma de construir"
          intro="Nada de marketing: criterios concretos que aplicamos en cada proyecto, también cuando nadie mira."
        />

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {principles.map((principle, i) => (
            <Reveal key={principle.title} delay={Math.min(i * 0.05, 0.2)}>
              <div className="border-t border-line-dark pt-6">
                <h3 className="text-lg font-medium tracking-tight">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/55">
                  {principle.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Capacidades técnicas */}
        <Reveal className="mt-24 md:mt-28">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="label-mono text-paper/50">Con qué trabajamos</p>
            <p className="max-w-md text-sm text-paper/45">
              Las tecnologías son herramientas, no la propuesta de valor.
              Elegimos la adecuada para cada problema. Estas son las nuestras:
            </p>
          </div>
          <dl className="mt-8">
            {capabilities.map((group) => (
              <div
                key={group.label}
                className="grid gap-2 border-t border-line-dark py-5 sm:grid-cols-12 sm:gap-6"
              >
                <dt className="label-mono pt-1 text-paper/40 sm:col-span-3">
                  {group.label}
                </dt>
                <dd className="sm:col-span-9">
                  <ul className="flex flex-wrap gap-x-2 gap-y-2">
                    {group.items.map((item, i) => (
                      <li key={item} className="flex items-center gap-2 font-mono text-sm text-paper/75">
                        {item}
                        {i < group.items.length - 1 && (
                          <span className="text-paper/25" aria-hidden>
                            ·
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
