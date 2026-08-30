import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/data/process";

export function Process() {
  return (
    <section id="metodo" className="scroll-mt-20 border-b border-line">
      <div className="container-editorial py-16 lg:py-[110px]">
        <SectionHeading
          index="04"
          label="Método"
          title="Cinco fases, un entregable cada una"
          className="mb-10 lg:mb-[60px]"
        />

        <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, i) => (
            <Reveal key={step.index} delay={Math.min(i * 0.08, 0.32)} className="bg-paper">
              <li className="flex h-full min-h-[220px] flex-col gap-4 p-6 lg:min-h-[260px] lg:px-[26px] lg:py-8">
                <span className="font-mono text-xl text-cobalt">{step.index}</span>
                <p className="text-[19px] font-semibold text-ink">{step.title}</p>
                <p className="flex-1 text-[13px] leading-relaxed text-ink-mute">
                  {step.description}
                </p>
                <p className="border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-ink-faint">
                  → {step.deliverable}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
