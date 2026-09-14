import Image from "next/image";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { StackBand } from "@/components/sections/StackBand";
import { copyEs, partirFlecha } from "@/data/copy";
import { site } from "@/data/site";

const { sobre } = copyEs;
const cta = partirFlecha(sobre.cta);
const retratoAlt = `${sobre.nombre}, ${sobre.rol.toLowerCase()} de ${site.name}`;
/** El 4x5 mide 1072×1340, así que a 536 de ancho cae en los 670 de alto. */
const retrato4x5 = { src: "/sobre/retrato-4x5.jpg", width: 1072, height: 1340 };
const retrato1x1 = { src: "/sobre/retrato-1x1.jpg", width: 716, height: 716 };

const dt = "font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute lg:text-[11px] lg:tracking-[0.1em]";

export function About() {
  return (
    <section id="sobre" aria-label="Sobre BPM Tech" className="scroll-mt-6">
      <div className="container-editorial pt-16 lg:pt-24 wide:pt-[120px]">
        <div className="rejilla-editorial">
          <h2 className="display text-[26px] leading-[1.02] lg:hidden">{sobre.h2}</h2>

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

          <div>
            <h2 className="display hidden text-[32px] leading-[1.02] lg:block wide:text-[40px]">
              {sobre.h2}
            </h2>

            <div className="mt-6 flex flex-col gap-1.5 border-t border-ink pt-4 lg:mt-8 lg:max-w-[600px] lg:flex-row lg:items-baseline lg:justify-between lg:gap-6 lg:pt-5">
              <p className="text-[19px] font-semibold tracking-[-0.01em] lg:text-[21px]">
                {sobre.nombre}
              </p>
              <p className={dt}>{sobre.rol}</p>
            </div>

            {sobre.parrafos.map((parrafo, index) => (
              <p
                key={parrafo.slice(0, 24)}
                className={`max-w-[600px] text-[15px] leading-[1.6] text-ink-soft lg:text-[17px] ${
                  index === 0 ? "mt-5 lg:mt-7" : "mt-4 lg:mt-[18px]"
                }`}
              >
                {parrafo}
              </p>
            ))}

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 lg:mt-8 lg:max-w-[600px] lg:grid-cols-3 lg:gap-x-6 lg:pt-5">
              {Object.entries(sobre.datos).map(([label, body]) => (
                <div key={label}>
                  <dt className={dt}>{label}</dt>
                  <dd className="mt-1 text-sm lg:mt-1.5 lg:text-[15px]">{body}</dd>
                </div>
              ))}
            </dl>

            <ArrowLink
              href="/#contacto"
              arrow={cta.flecha}
              className="mt-4 lg:mt-8"
              trackEvent="cta_click"
              trackLocation="about"
            >
              {cta.texto}
            </ArrowLink>
          </div>
        </div>

        <StackBand />
      </div>
    </section>
  );
}
