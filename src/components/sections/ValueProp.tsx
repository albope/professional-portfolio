import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  {
    index: "A",
    title: "Entendemos el negocio",
    description:
      "Antes de hablar de tecnología, entendemos cómo funciona tu empresa: qué procesos duelen, dónde se pierde tiempo y qué merece la pena resolver primero.",
  },
  {
    index: "B",
    title: "Diseñamos la solución",
    description:
      "Definimos qué construir, qué no, y en qué orden. Un alcance bien elegido vale más que cien funcionalidades: el software correcto suele ser más pequeño de lo que parece.",
  },
  {
    index: "C",
    title: "Lo llevamos a producción",
    description:
      "Un producto no está terminado hasta que tu equipo lo usa cada día. Desarrollamos, desplegamos, medimos y seguimos evolucionando la herramienta con tu negocio.",
  },
];

export function ValueProp() {
  return (
    <section className="bg-ink text-paper">
      <div className="container-editorial py-24 md:py-32">
        <SectionHeading
          tone="paper"
          index="01"
          eyebrow="Propuesta"
          title={
            <>
              Software construido{" "}
              <em className="font-display text-[1.06em] font-normal italic">
                alrededor
              </em>{" "}
              de tu negocio. No al revés.
            </>
          }
          intro="No vendemos horas de programación. Entendemos el problema, diseñamos la solución, la construimos y la ponemos a funcionar — diseño, ingeniería y negocio trabajando juntos."
        />

        <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.index} delay={i * 0.08}>
              <div className="border-t border-line-dark pt-6">
                <p className="label-mono mb-5 text-cobalt-bright">/{pillar.index}</p>
                <h3 className="text-display-sm font-medium">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-paper/55">
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
