import Link from "next/link";
import { ctaHref } from "@/data/site";

const facts = [
  { label: "Base", value: "Valencia, España" },
  { label: "Trabajo", value: "Presencial y en remoto" },
  { label: "Responsabilidad", value: "Dirección de proyectos y tecnología" },
];

export function About() {
  return (
    <section id="nosotros" className="scroll-mt-24 border-b border-line">
      <div className="container-editorial grid gap-x-20 gap-y-9 py-16 lg:grid-cols-[1fr_1.15fr] lg:py-24">
        <div>
          <p className="label-mono mb-6 text-ink-mute">04 — Sobre BPM Tech</p>
          <h2 className="display text-display-sec text-ink">
            Trato directo con quien lo construye
          </h2>
        </div>

        <div className="lg:pt-12">
          <p className="text-base leading-[1.65] text-ink-soft lg:text-lg">
            BPM Tech es una iniciativa de desarrollo tecnológico con base en
            Valencia. La dirección del proyecto y las decisiones técnicas están
            conectadas: hablas directamente con la persona que entiende tu
            necesidad y construye la solución.
          </p>
          <p className="mt-5 text-base leading-[1.65] text-ink-soft">
            El foco está en las pymes que quieren mejorar su forma de trabajar.
            También acompañamos a startups que necesitan desarrollar un producto
            y a particulares con un proyecto propio.
          </p>
          <dl className="mt-8 grid gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-2 sm:gap-x-6">
            {facts.map((fact) => (
              <div key={fact.label} className={fact.label === "Responsabilidad" ? "sm:col-span-2" : undefined}>
                <dt className="mb-1 font-mono text-xs text-ink-mute">{fact.label}</dt>
                <dd className="text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={ctaHref}
            data-track="cta_click"
            data-track-location="about"
            className="link-underline mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-cobalt"
          >
            Hablemos de lo que necesitas <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
