import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/data/process";

export function Process() {
  return (
    <section id="metodo" className="scroll-mt-24 border-b border-line">
      <div className="container-editorial grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              index="04"
              eyebrow="Método"
              title="Cómo trabajamos"
              intro="De una idea poco definida a software funcionando. Sin cajas negras: en cada fase sabes qué está pasando, qué recibes y qué decidimos juntos."
            />
          </div>
        </div>

        <ol className="lg:col-span-7">
          {processSteps.map((step, i) => (
            <Reveal key={step.index} delay={Math.min(i * 0.05, 0.15)}>
              <li className="group grid grid-cols-[auto_1fr] gap-x-6 border-t border-line py-9 last:border-b md:gap-x-10 md:py-10">
                <p
                  className="font-mono text-sm text-ink/30 transition-colors duration-300 group-hover:text-cobalt"
                  aria-hidden
                >
                  {step.index}
                </p>
                <div>
                  <h3 className="text-display-sm font-medium text-ink">{step.title}</h3>
                  <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink/60">
                    {step.description}
                  </p>
                  <p className="label-mono mt-5 flex items-center gap-3 text-ink/40">
                    <span className="inline-block h-[5px] w-[5px] bg-cobalt" aria-hidden />
                    Entregable — {step.deliverable}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
