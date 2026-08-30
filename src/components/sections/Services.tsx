import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-20 border-b border-line">
      <div className="container-editorial py-16 lg:py-[110px]">
        <SectionHeading
          index="02"
          label="Servicios"
          title="Lo que hacemos"
          note="Siete formas de resolver el mismo encargo: que tu empresa funcione mejor con software hecho para ella."
          className="mb-10 lg:mb-[60px]"
        />

        <Reveal>
          <ol className="border-t border-line">
            {services.map((service) => (
              <li
                key={service.id}
                className="group grid items-baseline gap-x-8 gap-y-1 border-b border-line py-[18px] transition-colors duration-300 ease-editorial hover:bg-paper-2 lg:grid-cols-[90px_340px_1fr_auto] lg:py-[30px]"
              >
                <span className="hidden font-mono text-xs text-cobalt lg:block">
                  {service.index}
                </span>
                <p className="flex items-baseline justify-between gap-3 text-[17px] font-semibold text-ink lg:block lg:text-2xl">
                  <span>
                    <span className="mr-3 font-mono text-[11px] font-normal text-cobalt lg:hidden">
                      {service.index}
                    </span>
                    {service.title}
                  </span>
                  <span
                    className="font-mono text-[13px] font-normal transition-transform duration-300 ease-editorial group-hover:translate-x-1 lg:hidden"
                    aria-hidden
                  >
                    →
                  </span>
                </p>
                <p className="hidden text-[15px] leading-relaxed text-ink-mute md:block">
                  {service.description}
                </p>
                <span
                  className="hidden font-mono text-[13px] text-ink transition-transform duration-300 ease-editorial group-hover:translate-x-1 lg:block"
                  aria-hidden
                >
                  →
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
