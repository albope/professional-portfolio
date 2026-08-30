import { Reveal } from "@/components/ui/Reveal";
import { SquareWord } from "@/components/ui/SquareWord";

const pillars = [
  {
    index: "1.0",
    title: "Entendemos el negocio",
    description:
      "Hablamos con las personas que viven el proceso cada día. Ahí está el problema real, no en el pliego.",
  },
  {
    index: "2.0",
    title: "Diseñamos la solución",
    description:
      "Definimos qué hace el software, qué no hace y en qué orden se construye. Por escrito y acordado contigo.",
  },
  {
    index: "3.0",
    title: "La llevamos a producción",
    description:
      "No entregamos maquetas. Entregamos software desplegado, con formación y soporte durante el arranque.",
  },
];

export function ValueProp() {
  return (
    <section className="bg-ink">
      <div className="container-editorial py-16 lg:py-[120px]">
        <Reveal>
          <p className="label-mono text-paper/45">01 — Propuesta</p>
          <h2 className="display mt-6 max-w-[900px] text-[clamp(1.875rem,4.2vw,3.75rem)] leading-[1] text-paper lg:mt-9">
            Primero tu negocio. Después el <SquareWord word="código" tone="dark" />
          </h2>
          <p className="mt-6 max-w-[560px] text-base leading-relaxed text-paper/60 lg:mt-7 lg:text-lg">
            Una herramienta solo funciona si encaja en cómo trabajas. Por eso
            empezamos por entender tu operativa y terminamos con software en
            producción.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px border border-line-dark bg-line-dark md:grid-cols-3 lg:mt-[70px]">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.index} delay={Math.min(i * 0.08, 0.24)} className="bg-ink">
              <div className="p-6 lg:px-8 lg:py-9">
                <p className="mb-3.5 font-mono text-xs text-cobalt-bright">
                  {pillar.index}
                </p>
                <p className="text-[19px] font-semibold text-paper">{pillar.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-paper/55">
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
