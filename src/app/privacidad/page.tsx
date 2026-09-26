import type { Metadata } from "next";
import { legal } from "@/data/legal";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { TextLink } from "@/components/ui/TextLink";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo trata BPM Tech los datos de contacto y los datos técnicos de esta web.",
  alternates: { canonical: "/privacidad" },
  robots: { index: false, follow: true },
};

/**
 * Política de privacidad. El texto es jurídico y se conserva tal cual: solo
 * cambia la piel (`LegalLayout`) y los enlaces pasan a `TextLink`, con los de
 * terceros en otra pestaña y anunciados.
 */
export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de privacidad">
      <h2>Responsable del tratamiento</h2>
      <p>
        {legal.name} (marca comercial BPM Tech), con NIF {legal.taxId} y domicilio
        en {legal.address}. Puedes contactar con el responsable en{" "}
        <TextLink href={`mailto:${legal.email}`}>{legal.email}</TextLink>.
      </p>

      <h2>Datos de tu consulta</h2>
      <p>
        Recibimos el nombre, email y mensaje que envías en el formulario. La
        empresa, el teléfono y el tipo de necesidad son opcionales. Si llegas
        desde un proyecto o servicio, el formulario puede incluir esa referencia
        para entender el contexto. No incluyas contraseñas, datos sensibles ni
        información confidencial de terceros en el primer mensaje.
      </p>
      <p>
        Usamos estos datos para atender tu petición y, si procede, preparar una
        propuesta. Las consultas sobre una contratación se atienden sobre la base
        de medidas precontractuales solicitadas por ti (artículo 6.1.b del RGPD).
        Para otras comunicaciones, la base es nuestro interés legítimo en
        responderlas (artículo 6.1.f), sin perjuicio de tu derecho de oposición.
        No añadimos tus datos a listas publicitarias ni los vendemos.
      </p>

      <h2>Reserva de llamadas</h2>
      <p>
        Cuando eliges reservar una llamada, cargamos la agenda de Cal.com. Este
        servicio recibe los datos técnicos necesarios para mostrarla. Al completar
        una reserva, trata el nombre, email y demás información que introduzcas,
        junto con la fecha y hora elegidas, para organizar la conversación y sus
        comunicaciones. Usamos esos datos para atender tu solicitud, sobre las
        bases indicadas para las consultas. La videollamada se realiza a través
        de Cal Video, fuera de esta web.
      </p>
      <p>
        Cal.com gestiona la reserva y, cuando corresponde, la comunica al
        calendario vinculado. Puedes consultar sus condiciones de tratamiento,
        datos técnicos y cookies en la{" "}
        <TextLink href="https://cal.com/privacy" external>
          política de privacidad de Cal.com
        </TextLink>.
      </p>

      <h2>Funcionamiento y seguridad de la web</h2>
      <p>
        La conexión transmite datos técnicos, como dirección IP y características
        de la solicitud, necesarios para servir la página y protegerla frente al
        abuso. El formulario utiliza un contador temporal de solicitudes y una
        referencia técnica para evitar envíos duplicados. El alojamiento y el
        proveedor de correo pueden generar registros de funcionamiento y entrega.
        Su finalidad es mantener el servicio y detectar incidencias, basada en
        nuestro interés legítimo en su seguridad.
      </p>

      <h2>Medición de interacciones</h2>
      <p>
        Contamos acciones como abrir un proyecto, pulsar un enlace de contacto
        o de reserva, comenzar el formulario o encontrar un error. Abrir la
        agenda no se cuenta como una reserva confirmada. Esos eventos utilizan
        categorías predefinidas. No incluyen tu nombre, email, teléfono, empresa,
        mensaje, dirección IP ni la dirección completa de la página. No creamos
        identificadores de visitante ni perfiles entre visitas, y no usamos
        cookies o almacenamiento del navegador para esta medición.
      </p>
      <p>
        Esta información permite comprobar si la web se entiende y si el contacto
        funciona. La medición del navegador respeta las señales de privacidad
        Do Not Track y Global Privacy Control. Los registros técnicos necesarios
        para atender una solicitud o proteger el servicio se gestionan por
        separado.
      </p>

      <h2>Conservación</h2>
      <p>
        Conservamos las consultas y los datos de las reservas mientras sea
        necesario para atenderlas o gestionar la relación profesional que pueda
        derivarse. Una vez finalizada
        esa finalidad, solo se conserva la información necesaria para cumplir
        obligaciones legales o atender responsabilidades durante sus plazos
        aplicables. Puedes solicitar la supresión cuando corresponda.
      </p>
      <p>
        Los contadores de protección son temporales y tienen un tamaño limitado.
        Los registros de operación y entrega están sujetos a los periodos de
        conservación del servicio de alojamiento o correo utilizado. Puedes
        solicitar información sobre los criterios aplicables a tu consulta.
      </p>

      <h2>Proveedores y destinatarios</h2>
      <p>
        Para prestar el servicio utilizamos proveedores de alojamiento (Vercel),
        envío de mensajes (Resend), recepción y gestión del correo (Gmail, de Google)
        y reserva y realización de videollamadas (Cal.com).
        La gestión del dominio y DNS utiliza servicios de Cloudflare. La
        información de una consulta se comunica solo a los servicios necesarios
        para recibirla y responderla, además de los supuestos exigidos por ley.
      </p>
      <p>
        La prestación de estos servicios puede implicar tratamiento fuera del
        Espacio Económico Europeo. Puedes solicitar al responsable información
        sobre los proveedores, transferencias y garantías aplicables al
        tratamiento de tus datos a través del contacto indicado en esta página.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes solicitar acceso, rectificación, supresión, oposición, limitación
        y portabilidad, cuando sean aplicables, escribiendo a{" "}
        <TextLink href={`mailto:${legal.email}`}>{legal.email}</TextLink> o mediante el{" "}
        <TextLink href="/#contacto">formulario de contacto</TextLink>.
        Indica que se trata de una solicitud de derechos. No necesitas tener un
        proyecto ni contratar un servicio para ejercerlos.
      </p>
      <p>
        El plazo general de respuesta es de un mes, con las ampliaciones y
        condiciones previstas en la normativa. También puedes presentar una
        reclamación ante la{" "}
        <TextLink href="https://www.aepd.es/" external>Agencia Española de Protección de Datos</TextLink>.
      </p>
    </LegalLayout>
  );
}
