import type { Metadata } from "next";
import { legal } from "@/data/legal";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { TextLink } from "@/components/ui/TextLink";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de BPM Tech.",
  alternates: { canonical: "/aviso-legal" },
  robots: { index: false, follow: true },
};

/**
 * Aviso legal. El texto jurídico se conserva: solo cambia la piel
 * (`LegalLayout`), los enlaces pasan a `TextLink` y el objeto habla de BPM
 * Tech en lugar de «el estudio», como el resto de la web.
 */
export default function AvisoLegalPage() {
  return (
    <LegalLayout title="Aviso legal">
      <h2>Identificación del titular</h2>
      <p>
        BPM Tech es una marca comercial de {legal.name}, con NIF {legal.taxId}
        {" "}y domicilio en {legal.address}. Sociedad inscrita en el {legal.registry}.
      </p>
      <p>
        Para consultas legales puedes escribir a{" "}
        <TextLink href={`mailto:${legal.email}`}>{legal.email}</TextLink>.
        Para hablar de un proyecto, utiliza el{" "}
        <TextLink href="/#contacto">formulario de contacto</TextLink>.
      </p>

      <h2>Objeto</h2>
      <p>
        Este sitio web informa sobre los servicios de BPM Tech (software de
        gestión a medida, automatizaciones e integraciones, y webs y
        aplicaciones nuevas) y permite solicitar contacto para nuevos
        proyectos.
      </p>

      <h2>Acceso y uso</h2>
      <p>
        El acceso al sitio es gratuito. Al usarlo te comprometes a hacer un
        uso lícito de sus contenidos y a no realizar acciones que puedan dañar
        su funcionamiento, su seguridad o los derechos del titular o de
        terceros.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los contenidos de este sitio web (textos, diseño, código, marca y
        elementos gráficos) son propiedad de BORT PEREZ MULTI GESTION SOCIEDAD
        LIMITADA o cuentan con autorización de sus titulares, salvo indicación
        expresa en contrario. No pueden reproducirse, distribuirse ni
        transformarse sin autorización previa.
      </p>

      <h2>Enlaces y disponibilidad</h2>
      <p>
        Los enlaces a sitios de terceros se ofrecen solo como referencia. El
        titular no controla esos sitios ni responde de sus contenidos.
        Aplicamos medidas razonables para mantener la web operativa, aunque no
        podemos garantizar la disponibilidad ininterrumpida del servicio.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        El titular trabaja para que la información publicada sea correcta y
        esté actualizada, pero no puede garantizar la ausencia de errores. El
        contenido de esta web es informativo y no constituye una oferta
        contractual. Las condiciones de cada proyecto se acuerdan por escrito
        en su propuesta.
      </p>

      <h2>Legislación aplicable</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier
        controversia serán competentes los juzgados y tribunales de Valencia,
        salvo que la normativa aplicable establezca otro fuero.
      </p>
    </LegalLayout>
  );
}
