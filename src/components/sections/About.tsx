import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const facts = [
  "Valencia, España",
  "Producto + ingeniería + negocio",
  "De la idea a producción",
];

export function About() {
  return (
    <section id="nosotros" className="scroll-mt-24 border-b border-line">
      <div className="container-editorial grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            index="06"
            eyebrow="Nosotros"
            title={
              <>
                Un partner tecnológico, no un{" "}
                <em className="font-display text-[1.06em] font-normal italic">
                  proveedor de horas.
                </em>
              </>
            }
          />
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <p className="text-display-sm font-normal leading-snug text-ink/80">
              BPM Tech nace de una convicción: la mayoría de las empresas no
              necesita más tecnología — necesita la tecnología adecuada.
            </p>
            <p className="mt-8 max-w-2xl text-lead text-ink/60">
              Trabajamos en la intersección entre negocio, producto e
              ingeniería: primero entendemos cómo funciona tu empresa, y después
              construimos el software que encaja en ella. Por eso no cerramos
              tickets ni facturamos horas sueltas: asumimos problemas y
              respondemos de la solución, desde la primera conversación hasta
              que el producto está en producción y evoluciona con tu negocio.
            </p>
            <p className="mt-6 max-w-2xl text-lead text-ink/60">
              Trabajamos con pymes, particulares y startups: proyectos donde
              hablas directamente con quien diseña y construye. Si buscas una
              gran consultora para un programa corporativo de tres años, no
              somos tu partner — y te lo diremos en la primera llamada.
            </p>
            <ul className="mt-12 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:flex-wrap sm:gap-x-10">
              {facts.map((fact) => (
                <li key={fact} className="label-mono flex items-center gap-3 text-ink/45">
                  <span className="inline-block h-[5px] w-[5px] bg-cobalt" aria-hidden />
                  {fact}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
