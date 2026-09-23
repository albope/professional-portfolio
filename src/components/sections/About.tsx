import Image from "next/image";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TitleBlock } from "@/components/ui/Plate";
import { SheetHeader } from "@/components/ui/SheetHeader";
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
  { label: "Email", value: site.email, href: `mailto:${site.email}`, wide: true },
];

export function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className="bg-paper">
      <div className="container-editorial seccion">
        <SheetHeader id="about-title" label={sobre.kicker} title={sobre.h2} />

        <div className="rejilla-editorial mt-10 lg:mt-12 lg:!items-end">
          <figure className="m-0 w-2/3 sm:w-1/2 lg:w-full">
            <Image
              src="/sobre/retrato-4x5.jpg"
              width={1072}
              height={1340}
              alt="Alberto Bort, responsable de BPM Tech, de pie ante una pared clara"
              sizes="(min-width: 1440px) 536px, (min-width: 1024px) 38vw, (min-width: 640px) 50vw, 66vw"
              className="aspect-[4/5] w-full object-cover"
            />
            <figcaption className="label-mono mt-3 flex items-center gap-2.5 text-[10.5px] text-ink-mute">
              <span aria-hidden className="h-2 w-2 bg-cobalt" />
              {sobre.nombre} · {sobre.rol}
            </figcaption>
          </figure>

          <div className="mt-8 lg:mt-0">
            {sobre.parrafos.map((parrafo) => (
              <p key={parrafo} className="mb-5 max-w-[600px] text-[17px] leading-relaxed text-ink-soft lg:text-lg">{parrafo}</p>
            ))}
            <TitleBlock entries={ficha} className="mt-8 grid-cols-2 border-b border-line-2 sm:grid-cols-3" />
            <ArrowLink href="/#contacto" arrow={cta.flecha} className="mt-6" trackEvent="cta_click" trackLocation="about">
              {cta.texto}
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
