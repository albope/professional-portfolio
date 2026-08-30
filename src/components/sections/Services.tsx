import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-24 border-b border-line">
      <div className="container-editorial py-24 md:py-32">
        <SectionHeading
          index="02"
          eyebrow="Servicios"
          title="Qué construimos"
          intro="Distintas formas de resolver el mismo encargo: que la tecnología trabaje para tu negocio, y no tu equipo para la tecnología."
        />

        <ol className="mt-16 md:mt-20">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={Math.min(i * 0.05, 0.2)}>
              <li className="group grid gap-4 border-t border-line py-10 transition-colors duration-500 ease-editorial hover:bg-paper-2/70 md:py-12 lg:grid-cols-12 lg:gap-8">
                <p
                  className="label-mono pt-2 text-ink/30 transition-colors duration-300 group-hover:text-cobalt lg:col-span-1"
                  aria-hidden
                >
                  {service.index}
                </p>
                <h3 className="text-display-sm font-medium text-ink lg:col-span-4">
                  {service.title}
                </h3>
                <div className="lg:col-span-7">
                  <p className="max-w-xl text-[15px] leading-relaxed text-ink/60">
                    {service.description}
                  </p>
                  <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {service.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-sm text-ink/50"
                      >
                        <span
                          className="mt-[7px] h-[5px] w-[5px] shrink-0 bg-ink/25 transition-colors duration-300 group-hover:bg-cobalt"
                          aria-hidden
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
