import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de BPM Tech.",
  alternates: { canonical: "/privacidad" },
};

const h2 = "pt-4 text-xl font-semibold text-ink";

export default function PrivacidadPage() {
  return (
    <div className="container-editorial pb-24 pt-32 md:pt-40">
      <p className="label-mono mb-6 text-ink-mute">Legal</p>
      <h1 className="display text-display-sec text-ink">
        Política de privacidad
      </h1>

      <div className="mt-10 max-w-2xl space-y-6 text-[15px] leading-relaxed text-ink/70">
        <h2 className={h2}>Responsable del tratamiento</h2>
        <p>
          BORT PEREZ MULTI GESTION SOCIEDAD LIMITADA (marca comercial BPM Tech),
          con NIF B98629470 y domicilio en Avenida Carlos Marx, 1, 12 E, 46920
          Mislata, Valencia, España. Puedes contactar con el responsable a
          través del formulario de contacto de esta web.
        </p>

        <h2 className={h2}>Qué datos tratamos</h2>
        <p>
          Este sitio web no utiliza cookies de seguimiento ni herramientas de
          analítica que identifiquen al visitante. Los únicos datos personales
          que recibimos son los que tú decides enviarnos a través del formulario
          de contacto: nombre, empresa, dirección de correo, teléfono si decides
          indicarlo y el contenido de tu mensaje.
        </p>

        <h2 className={h2}>Finalidad y base legal</h2>
        <p>
          Usamos esos datos exclusivamente para responder a tu consulta y, si la
          conversación avanza, para preparar una propuesta. La base legal es la
          aplicación de medidas precontractuales a petición tuya (artículo
          6.1.b del RGPD) y el interés legítimo en atender las comunicaciones
          recibidas (artículo 6.1.f). No usamos tus datos para enviarte
          comunicaciones comerciales no solicitadas.
        </p>

        <h2 className={h2}>Conservación</h2>
        <p>
          Conservamos los datos mientras dure la conversación o la relación
          profesional que derive de ella, y después solo durante los plazos
          exigidos por la normativa aplicable.
        </p>

        <h2 className={h2}>Destinatarios</h2>
        <p>
          No vendemos ni cedemos tus datos a terceros. Solo acceden a ellos los
          proveedores tecnológicos necesarios para operar esta web y su
          formulario (alojamiento y envío de email), que actúan como encargados
          del tratamiento con las garantías del RGPD. Si alguno de esos
          proveedores trata datos fuera del Espacio Económico Europeo, la
          transferencia se protege mediante los mecanismos previstos en el
          RGPD, como las cláusulas contractuales tipo.
        </p>

        <h2 className={h2}>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión,
          oposición, limitación y portabilidad escribiéndonos a través del
          formulario de contacto de esta web. Respondemos en el plazo máximo de
          un mes. Si consideras que no hemos tratado tus datos correctamente,
          puedes reclamar ante la Agencia Española de Protección de Datos
          (aepd.es).
        </p>

        <h2 className={h2}>Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger
          los datos que nos envías, como conexiones cifradas y acceso
          restringido a la información.
        </p>
      </div>
    </div>
  );
}
