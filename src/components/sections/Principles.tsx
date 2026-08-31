import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { principles, capabilities } from "@/data/principles";

export function Principles() {
  return (
    <section className="bg-ink">
      <div className="container-editorial py-16 lg:py-[110px]">
        <SectionHeading
          tone="paper"
          index="05"
          label="Cómo trabajamos"
          title="Seis principios y un stack corto"
          className="mb-10 lg:mb-16"
        />

        <Reveal>
          <div className="grid gap-px border border-line-dark bg-line-dark sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle) => (
              <div key={principle.title} className="bg-ink p-6 lg:px-[30px] lg:py-8">
                <p className="mb-2.5 text-[17px] font-semibold text-paper">
                  {principle.title}
                </p>
                <p className="text-sm leading-relaxed text-paper/55">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14 lg:mt-[70px]">
          <p className="label-mono mb-5 text-paper/45">Tecnologías</p>
          <dl className="border-t border-line-dark">
            {capabilities.map((group) => (
              <div
                key={group.label}
                className="grid grid-cols-[110px_1fr] gap-4 border-b border-line-dark py-4 sm:grid-cols-[220px_1fr] sm:gap-6"
              >
                <dt className="font-mono text-xs text-cobalt-bright">{group.label}</dt>
                <dd className="flex flex-wrap gap-x-7 gap-y-1.5 font-mono text-xs leading-relaxed text-paper/65">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
