import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de BPM Tech.",
  // TODO: activar indexación cuando la página tenga los datos registrales reales.
  robots: { index: false },
};

export default function AvisoLegalPage() {
  return (
    <div className="container-editorial pb-24 pt-32 md:pt-40">
      <p className="label-mono mb-6 text-ink/45">Legal</p>
      <h1 className="text-display-lg font-medium text-ink">Aviso legal</h1>

      <div className="mt-10 max-w-2xl space-y-6 text-[15px] leading-relaxed text-ink/70">
        <p className="border-l-2 border-cobalt pl-4 text-sm text-ink/50">
          Página pendiente de completar con los datos registrales de BPM Tech
          (denominación social, NIF, domicilio y datos de inscripción). No se
          publican datos provisionales para evitar información incorrecta.
        </p>
        <h2 className="pt-4 text-display-sm font-medium text-ink">
          Titularidad del sitio web
        </h2>
        <p>
          Este sitio web es titularidad de BPM Tech. Los datos identificativos
          completos del titular se incorporarán en esta página antes de la
          puesta en producción del sitio.
        </p>
        <h2 className="pt-4 text-display-sm font-medium text-ink">
          Propiedad intelectual
        </h2>
        <p>
          Los contenidos de este sitio web — textos, diseño, código y elementos
          gráficos — son propiedad de BPM Tech, salvo indicación expresa en
          contrario, y no pueden reproducirse sin autorización.
        </p>
        <h2 className="pt-4 text-display-sm font-medium text-ink">
          Responsabilidad
        </h2>
        <p>
          BPM Tech trabaja para que la información publicada sea correcta y esté
          actualizada, pero no puede garantizar la ausencia de errores ni la
          disponibilidad ininterrumpida del sitio.
        </p>
      </div>
    </div>
  );
}
