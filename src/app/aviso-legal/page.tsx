import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de BPM Tech.",
  alternates: { canonical: "/aviso-legal" },
  robots: { index: false, follow: true },
};

const h2 = "pt-4 text-xl font-semibold text-ink";

export default function AvisoLegalPage() {
  return (
    <div className="container-editorial pb-24 pt-32 md:pt-40">
      <p className="label-mono mb-6 text-ink-mute">Legal</p>
      <h1 className="display text-display-sec text-ink">Aviso legal</h1>

      <div className="mt-10 max-w-2xl space-y-6 text-[15px] leading-relaxed text-ink/70">
        <h2 className={h2}>Identificación del titular</h2>
        <p>
          BPM Tech es una marca comercial de BORT PEREZ MULTI GESTION SOCIEDAD
          LIMITADA, con NIF B98629470 y domicilio en Avenida Carlos Marx, 1, 12
          E, 46920 Mislata, Valencia, España. Sociedad inscrita en el Registro
          Mercantil de Valencia, tomo 9786, libro 7068, folio 52, sección 8,
          hoja V-159244.
        </p>
        <p>
          Puedes contactar con el titular a través del formulario de contacto de
          esta web.
        </p>

        <h2 className={h2}>Objeto</h2>
        <p>
          Este sitio web informa sobre los servicios del estudio (software a
          medida, aplicaciones y webs, automatización de procesos, inteligencia
          artificial aplicada, integraciones y consultoría tecnológica) y
          permite solicitar contacto para nuevos proyectos.
        </p>

        <h2 className={h2}>Acceso y uso</h2>
        <p>
          El acceso al sitio es gratuito. Al usarlo te comprometes a hacer un
          uso lícito de sus contenidos y a no realizar acciones que puedan dañar
          su funcionamiento, su seguridad o los derechos del titular o de
          terceros.
        </p>

        <h2 className={h2}>Propiedad intelectual</h2>
        <p>
          Los contenidos de este sitio web (textos, diseño, código, marca y
          elementos gráficos) son propiedad de BORT PEREZ MULTI GESTION SOCIEDAD
          LIMITADA o cuentan con autorización de sus titulares, salvo indicación
          expresa en contrario. No pueden reproducirse, distribuirse ni
          transformarse sin autorización previa.
        </p>

        <h2 className={h2}>Enlaces y disponibilidad</h2>
        <p>
          Los enlaces a sitios de terceros se ofrecen solo como referencia. El
          titular no controla esos sitios ni responde de sus contenidos.
          Aplicamos medidas razonables para mantener la web operativa, aunque no
          podemos garantizar la disponibilidad ininterrumpida del servicio.
        </p>

        <h2 className={h2}>Responsabilidad</h2>
        <p>
          El titular trabaja para que la información publicada sea correcta y
          esté actualizada, pero no puede garantizar la ausencia de errores. El
          contenido de esta web es informativo y no constituye una oferta
          contractual. Las condiciones de cada proyecto se acuerdan por escrito
          en su propuesta.
        </p>

        <h2 className={h2}>Legislación aplicable</h2>
        <p>
          Este aviso legal se rige por la legislación española. Para cualquier
          controversia serán competentes los juzgados y tribunales de Valencia,
          salvo que la normativa aplicable establezca otro fuero.
        </p>
      </div>
    </div>
  );
}
