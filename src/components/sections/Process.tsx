import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/process";

const commitments = [
  {
    title: "Decisiones con contexto",
    description: "Primero entendemos el problema. Si una herramienta existente encaja, la valoramos contigo.",
  },
  {
    title: "Alcance claro",
    description: "Qué incluye la entrega, qué queda fuera y cómo se acuerdan los cambios, antes de empezar.",
  },
  {
    title: "Una entrega que puedas gestionar",
    description: "Definimos los accesos, la documentación, la propiedad del desarrollo y el soporte en la propuesta.",
  },
];

export function Process() {
  return (
    <section id="metodo" className="scroll-mt-24 bg-ink text-paper">
      <div className="container-editorial py-16 lg:py-24">
        <SectionHeading
          tone="paper"
          index="03"
          label="Cómo trabajamos"
          title="Sabrás qué viene después"
          note="De la primera conversación a la entrega, cada fase tiene un siguiente paso concreto."
          className="mb-10 lg:mb-12"
        />

        <ol className="grid gap-x-7 gap-y-7 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step) => (
            <li key={step.index} className="flex flex-col border-t border-paper/25 pt-5">
              <span className="font-mono text-sm text-cobalt-bright">{step.index}</span>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mb-5 mt-3 flex-1 text-sm leading-relaxed text-paper/75">
                {step.description}
              </p>
              <p className="border-t border-line-dark pt-3 font-mono text-xs leading-relaxed text-paper/70">
                <span className="mr-1 text-cobalt-bright" aria-hidden>↳</span>
                {step.deliverable}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-x-10 gap-y-6 border-t border-line-dark pt-8 md:grid-cols-3 lg:mt-14">
          {commitments.map((commitment) => (
            <div key={commitment.title}>
              <h3 className="text-[15px] font-semibold">{commitment.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/70">{commitment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
