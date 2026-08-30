import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de BPM Tech.",
  // TODO: activar indexación cuando la política esté completada y revisada.
  robots: { index: false },
};

export default function PrivacidadPage() {
  return (
    <div className="container-editorial pb-24 pt-32 md:pt-40">
      <p className="label-mono mb-6 text-ink-mute">Legal</p>
      <h1 className="display text-display-sec text-ink">
        Política de privacidad
      </h1>

      <div className="mt-10 max-w-2xl space-y-6 text-[15px] leading-relaxed text-ink/70">
        <p className="border-l-2 border-cobalt pl-4 text-sm text-ink/50">
          Página pendiente de completar con los datos del responsable del
          tratamiento y revisar conforme al RGPD antes de la puesta en
          producción del sitio.
        </p>
        <h2 className="pt-4 text-xl font-semibold text-ink">
          Qué datos tratamos
        </h2>
        <p>
          Este sitio web no utiliza cookies de seguimiento ni herramientas de
          analítica que identifiquen al visitante. Los únicos datos personales
          que recibimos son los que tú decides enviarnos a través del formulario
          de contacto (nombre, empresa, dirección de correo y el contenido de tu
          mensaje).
        </p>
        <h2 className="pt-4 text-xl font-semibold text-ink">
          Para qué los usamos
        </h2>
        <p>
          Exclusivamente para responder a tu consulta y, si avanza, para
          preparar una propuesta. No cedemos tus datos a terceros ni los usamos
          para enviarte comunicaciones comerciales no solicitadas.
        </p>
        <h2 className="pt-4 text-xl font-semibold text-ink">
          Tus derechos
        </h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación y supresión
          escribiéndonos a través del formulario de contacto de esta web.
        </p>
      </div>
    </div>
  );
}
