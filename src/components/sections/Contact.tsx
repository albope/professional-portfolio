import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/data/site";

const clientProfiles = [
  "Pymes que quieren digitalizar su operativa",
  "Personas con un proyecto propio entre manos",
  "Startups construyendo su producto",
];

export function Contact() {
  return (
    <section id="contacto" className="scroll-mt-24 bg-ink text-paper">
      <div className="container-editorial grid gap-16 py-24 md:py-32 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <SectionHeading
            tone="paper"
            index="07"
            eyebrow="Contacto"
            title={
              <>
                ¿Tienes un problema que el software{" "}
                <em className="font-display text-[1.06em] font-normal italic">
                  podría resolver?
                </em>
              </>
            }
            intro="Cuéntanoslo sin compromiso y sin jerga: explícanos qué pasa en tu negocio y te diremos, con honestidad, cómo lo abordaríamos — o si no hace falta software para resolverlo."
          />

          <Reveal delay={0.15} className="mt-12">
            <p className="label-mono mb-5 text-paper/40">Trabajamos con</p>
            <ul className="flex flex-col gap-3">
              {clientProfiles.map((profile) => (
                <li key={profile} className="flex items-start gap-3 text-sm text-paper/70">
                  <span className="mt-[7px] inline-block h-[5px] w-[5px] shrink-0 bg-cobalt-bright" aria-hidden />
                  {profile}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/45">
              Tu mensaje llega directamente a quien va a estudiar tu proyecto,
              no a un buzón comercial.
            </p>
            <p className="label-mono mt-8 text-paper/35">{site.location}</p>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
