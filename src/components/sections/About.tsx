import { Reveal } from "@/components/ui/Reveal";

const facts = [
  { label: "Base", value: "Valencia, España" },
  { label: "Alcance", value: "Presencial y en remoto" },
  { label: "Trato", value: "Directo con quien construye" },
];

export function About() {
  return (
    <section id="nosotros" className="scroll-mt-20 border-b border-line">
      <div className="container-editorial grid gap-x-20 gap-y-10 py-16 lg:grid-cols-[1fr_1.2fr] lg:py-[110px]">
        <Reveal>
          <p className="label-mono mb-6 text-ink-mute">06 — Nosotros</p>
          <h2 className="display text-display-sec text-ink">
            Socio tecnológico, no proveedor de horas
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="lg:pt-[60px]">
          <p className="text-base leading-[1.65] text-ink-soft lg:text-lg">
            Somos un estudio pequeño con base en Valencia y trabajamos con
            clientes de cualquier lugar. Nos implicamos en pocos proyectos a la
            vez para conocer cada negocio de verdad, decidir contigo y responder
            por lo que construimos.
          </p>
          <p className="mt-5 text-base leading-[1.65] text-ink-soft lg:text-lg">
            Trabajamos con pymes, con particulares que tienen un proyecto propio
            y con startups. No trabajamos para grandes corporaciones. Ese es
            nuestro sitio y preferimos hacerlo bien.
          </p>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7">
            {facts.map((fact) => (
              <div key={fact.label} className="font-mono text-xs leading-[1.8]">
                <dt className="text-ink-faint">{fact.label}</dt>
                <dd className="text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
