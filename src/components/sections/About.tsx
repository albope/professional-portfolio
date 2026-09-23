import Image from "next/image";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TitleBlock } from "@/components/ui/Plate";
import { copyEs, partirFlecha } from "@/data/copy";
import { site } from "@/data/site";

const { sobre } = copyEs;
const cta = partirFlecha(sobre.cta);

/**
 * La persona responsable, con el mismo cajetín que las láminas: quién firma
 * el trabajo, desde dónde y cómo se le escribe. Sin cifras ni equipo.
 */
const ficha = [
  { label: "Responsable", value: sobre.nombre },
  ...Object.entries(sobre.datos).map(([label, value]) => ({ label, value })),
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
];

export function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className="bg-paper">
      <div className="container-editorial seccion grid items-end gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 wide:gap-20">
        <figure className="m-0">
          <Image
            src="/sobre/retrato-4x5.jpg"
            width={1072}
            height={1340}
            alt="Alberto Bort, responsable de BPM Tech, de pie ante una pared clara"
            sizes="(min-width: 1440px) 520px, (min-width: 768px) 38vw, 100vw"
            className="aspect-[4/5] w-full object-cover"
          />
          <figcaption className="label-mono mt-3 flex items-center gap-2.5 text-[10.5px] text-ink-mute">
            <span aria-hidden className="h-2 w-2 bg-cobalt" />
            {sobre.nombre} · {sobre.rol}
          </figcaption>
        </figure>

        <div className="md:pb-2">
          <p className="label-mono text-cobalt">{sobre.kicker}</p>
          <h2 id="about-title" className="display mt-4 max-w-[640px] text-display-sec">{sobre.h2}</h2>
          {sobre.parrafos.map((parrafo) => (
            <p key={parrafo} className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-ink-soft">{parrafo}</p>
          ))}
          <TitleBlock entries={ficha} className="mt-8 grid-cols-2 gap-x-6 border-b border-line-2" />
          <ArrowLink href="/#contacto" arrow={cta.flecha} className="mt-6" trackEvent="cta_click" trackLocation="about">
            {cta.texto}
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
