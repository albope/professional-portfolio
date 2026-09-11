import Image from "next/image";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { booking } from "@/data/booking";
import { site } from "@/data/site";

/** Nombre público confirmado con Alberto: el trato directo se firma. */
const nombre = "Alberto Bort";
const funcion = "Dirección de proyectos y tecnología";
const retratoAlt = `${nombre}, ${funcion.toLowerCase()} de ${site.name}`;
const retrato4x5 = { src: "/sobre/retrato-4x5.jpg", width: 1072, height: 1340 };
const retrato1x1 = { src: "/sobre/retrato-1x1.jpg", width: 716, height: 716 };

const facts = [
  { label: "Base", body: site.location },
  { label: "Trabajo", body: "Presencial y en remoto" },
  { label: "Primera conversación", body: `${booking.durationMinutes} minutos por videollamada` },
];

const dt = "font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute lg:text-[11px] lg:tracking-[0.1em]";

export function About() {
  return (
    <section id="sobre" aria-label="Sobre BPM Tech" className="scroll-mt-6">
      <div className="container-editorial pt-16 lg:grid lg:grid-cols-[536fr_696fr] lg:items-start lg:gap-x-[88px] lg:pb-24 lg:pt-24 wide:py-[120px]">
        <h2 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] lg:hidden">
          Trato directo con quien lo construye
        </h2>

        <div className="mt-6 bg-paper-2 lg:mt-0">
          <Image
            {...retrato1x1}
            alt={retratoAlt}
            sizes="92vw"
            className="h-auto w-full lg:hidden"
          />
          <Image
            {...retrato4x5}
            alt={retratoAlt}
            sizes="(min-width: 1440px) 536px, 42vw"
            className="hidden h-auto w-full lg:block"
          />
        </div>

        <div className="lg:pt-2">
          <h2 className="hidden max-w-[560px] text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] lg:block">
            Trato directo con quien lo construye
          </h2>

          <div className="mt-5 flex flex-col gap-1.5 border-t border-ink pt-4 lg:mt-9 lg:max-w-[600px] lg:flex-row lg:items-baseline lg:justify-between lg:gap-6 lg:pt-5">
            <p className="text-[19px] font-semibold tracking-[-0.01em] lg:text-[22px]">{nombre}</p>
            <p className={dt}>{funcion}</p>
          </div>

          <p className="mt-[18px] text-[15px] leading-[1.6] text-ink-soft lg:hidden">
            BPM Tech es un estudio de desarrollo con base en Valencia. Hablas directamente con la
            persona que entiende tu necesidad y construye la solución. El foco está en pymes;
            también acompañamos a startups y a particulares con un proyecto propio.
          </p>
          <p className="hidden max-w-[600px] text-[17px] leading-[1.6] text-ink-soft lg:mt-7 lg:block">
            BPM Tech es un estudio de desarrollo con base en Valencia. La dirección del proyecto y
            las decisiones técnicas están conectadas: hablas directamente con la persona que
            entiende tu necesidad y construye la solución.
          </p>
          <p className="hidden max-w-[600px] text-[17px] leading-[1.6] text-ink-soft lg:mt-[18px] lg:block">
            El foco está en pymes que quieren mejorar su forma de trabajar. También acompañamos a
            startups que necesitan desarrollar un producto y a particulares con un proyecto propio.
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 lg:mt-9 lg:max-w-[600px] lg:grid-cols-3 lg:gap-x-6 lg:pt-5">
            {facts.map((fact, index) => (
              <div key={fact.label} className={index === 2 ? "hidden lg:block" : undefined}>
                <dt className={dt}>{fact.label}</dt>
                <dd className="mt-1 text-sm lg:mt-1.5 lg:text-[15px]">{fact.body}</dd>
              </div>
            ))}
          </dl>

          <ArrowLink
            href="/#contacto"
            arrow="↗"
            className="mt-4 hidden lg:mt-9 lg:inline-flex"
            trackEvent="cta_click"
            trackLocation="about"
          >
            Hablemos de lo que necesitas
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
