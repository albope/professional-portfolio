import Image from "next/image";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { copyEs, partirFlecha } from "@/data/copy";

const { sobre } = copyEs;
const cta = partirFlecha(sobre.cta);

export function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className="bg-paper">
      <div className="container-editorial seccion grid items-center gap-9 md:grid-cols-[0.7fr_1fr] md:gap-14 wide:gap-24">
        <figure className="relative m-0 max-w-[420px]">
          <Image src="/sobre/retrato-4x5.jpg" width={1072} height={1340} alt="Alberto Bort, consultoría y desarrollo en BPM Tech" sizes="(min-width: 1024px) 420px, (min-width: 768px) 35vw, 100vw" className="aspect-[4/5] w-full object-cover" />
          <figcaption className="absolute bottom-4 left-4 right-4 border border-line bg-paper px-4 py-3">
            <p className="text-base font-semibold">{sobre.nombre}</p>
            <p className="mt-1 text-xs text-ink-mute">{sobre.rol}</p>
          </figcaption>
        </figure>
        <div>
          <p className="label-mono text-cobalt">{sobre.kicker}</p>
          <h2 id="about-title" className="display mt-4 max-w-[620px] text-display-sec">{sobre.h2}</h2>
          {sobre.parrafos.map((parrafo) => (
            <p key={parrafo} className="mt-5 max-w-[580px] text-[17px] leading-relaxed text-ink-soft">{parrafo}</p>
          ))}
          <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-5 border-t border-line pt-5">
            {Object.entries(sobre.datos).map(([label, body]) => (
              <div key={label}>
                <dt className="label-mono text-[10px] text-ink-mute">{label}</dt>
                <dd className="mt-2 text-sm">{body}</dd>
              </div>
            ))}
          </dl>
          <ArrowLink href="/#contacto" arrow={cta.flecha} className="mt-6" trackEvent="cta_click" trackLocation="about">{cta.texto}</ArrowLink>
        </div>
      </div>
    </section>
  );
}
