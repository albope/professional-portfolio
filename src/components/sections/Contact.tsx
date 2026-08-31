import { Reveal } from "@/components/ui/Reveal";
import { SquareWord } from "@/components/ui/SquareWord";
import { ContactForm } from "@/components/sections/ContactForm";

const clientProfiles = [
  "Pymes que necesitan una herramienta a su medida",
  "Particulares con un proyecto propio",
  "Startups que quieren construir su producto",
];

export function Contact() {
  return (
    <section id="contacto" className="scroll-mt-20 bg-ink">
      <div className="container-editorial grid gap-x-20 gap-y-14 py-16 lg:grid-cols-2 lg:py-[110px]">
        <div>
          <Reveal>
            <p className="label-mono mb-6 text-paper/45">07 — Contacto</p>
            <h2 className="display text-display-sec text-paper">
              ¿Qué parte de tu negocio sigue funcionando a{" "}
              <SquareWord word="mano?" tone="dark" />
            </h2>
            <p className="mt-7 max-w-[440px] text-base leading-[1.65] text-paper/60">
              Cuéntanoslo en cuatro líneas. Te respondemos con una lectura
              honesta de si el proyecto tiene sentido y cómo lo abordaríamos.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-11 border-t border-line-dark pt-6">
            <p className="label-mono mb-4 text-paper/45">Trabajamos con</p>
            <ul className="flex flex-col gap-2.5">
              {clientProfiles.map((profile) => (
                <li
                  key={profile}
                  className="flex items-center gap-3 text-[15px] text-paper"
                >
                  <span
                    className="inline-block h-1.5 w-1.5 shrink-0 bg-cobalt-bright"
                    aria-hidden
                  />
                  {profile}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
