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
  { label: "Email", value: site.email, href: `mailto:${site.email}`, wide: true },
];

/**
 * El retrato arranca en el filete de la primera columna y el texto sigue al
 * titular en la segunda. Desde 768 px ya van lado a lado.
 */
export function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className="bg-paper">
      <div className="container-editorial seccion">
        <div className="grid border-t-2 border-ink pt-5 md:grid-cols-[5fr_7fr] md:items-start md:gap-x-8 lg:grid-cols-[424fr_872fr] lg:gap-x-6 lg:pt-6">
          <p className="label-mono flex items-center gap-2.5 text-cobalt md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <span aria-hidden className="h-2 w-2 bg-cobalt" />
            {sobre.kicker}
          </p>
          <figure className="m-0 mt-6 w-2/3 sm:w-1/2 md:row-span-2 md:w-full lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            <Image
              src="/sobre/retrato-4x5.jpg"
              width={1072}
              height={1340}
              alt="Alberto Bort, responsable de BPM Tech, de pie ante una pared clara"
              sizes="(min-width: 1440px) 424px, (min-width: 1024px) 30vw, (min-width: 768px) 38vw, (min-width: 640px) 50vw, 66vw"
              className="aspect-[4/5] w-full object-cover"
            />
            <figcaption className="label-mono mt-3 flex items-center gap-2.5 text-[10.5px] text-ink-mute">
              <span aria-hidden className="h-2 w-2 bg-cobalt" />
              {sobre.nombre} · {sobre.rol}
            </figcaption>
          </figure>

          <div className="mt-8 md:mt-6 lg:col-start-2 lg:row-start-2 lg:mt-4">
            <h2 id="about-title" className="display max-w-[640px] text-display-sheet">{sobre.h2}</h2>
            {sobre.parrafos.map((parrafo) => (
              <p key={parrafo} className="mt-6 max-w-[600px] text-[17px] leading-relaxed text-ink-soft lg:text-lg">{parrafo}</p>
            ))}
            <TitleBlock entries={ficha} className="mt-8 max-w-[600px] grid-cols-2 border-b border-line-2" />
            <ArrowLink href="/#contacto" arrow={cta.flecha} className="mt-6" trackEvent="cta_click" trackLocation="about">
              {cta.texto}
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
