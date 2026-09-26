import type { Metadata } from "next";
import { copyEs } from "@/data/copy";
import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";

const { no_encontrada: texto } = copyEs;

/**
 * Título propio de la pestaña («Página no encontrada · BPM Tech», con la
 * plantilla del layout). Sin él heredaba el de la portada, y quien llega
 * desde un enlace roto con lector de pantalla no sabía que la página no
 * existe hasta leer el titular. Next lee `metadata` del módulo `not-found`
 * como último elemento de la cadena de metadatos.
 */
export const metadata: Metadata = { title: texto.pestana };

/**
 * Ventana de aplicación con el vocabulario del glifo: la fila que falta es un
 * hueco punteado con la casilla vacía, entre dos filas hechas. Decorativa: el
 * titular ya dice lo que pasa.
 */
function EmptySlot() {
  const rows = [64, 124, 184];
  return (
    <svg viewBox="0 0 360 260" aria-hidden="true" focusable="false" className="block h-auto w-full">
      <rect x="8.5" y="8.5" width="343" height="243" rx="14" className="fill-surface stroke-line-2" />
      <line x1="9" y1="44.5" x2="351" y2="44.5" className="stroke-line" />
      {/* Controles de la ventana: barra, cuadrado hueco y cuadrado macizo. */}
      <rect x="26" y="25" width="11" height="3" className="fill-ink" />
      <rect x="43" y="21" width="9" height="9" strokeWidth="2" className="fill-none stroke-ink" />
      <rect x="58" y="20" width="11" height="11" className="fill-cobalt" />
      <rect x="92" y="18.5" width="150" height="15" rx="7.5" className="fill-bg stroke-line" />
      {rows.map((y, index) =>
        index === 1 ? (
          <g key={y}>
            <rect x="24.5" y={y + 0.5} width="311" height="47" rx="8" strokeDasharray="5 5" className="fill-none stroke-ink-4" />
            <rect x="305" y={y + 19} width="9" height="9" strokeWidth="2" className="fill-none stroke-ink-4" />
          </g>
        ) : (
          <g key={y}>
            <rect x="24.5" y={y + 0.5} width="311" height="47" rx="8" className="fill-surface stroke-line" />
            <rect x="42" y={y + 14} width={index === 0 ? 132 : 104} height="8" rx="4" className="fill-sand-2" />
            <rect x="42" y={y + 28} width={index === 0 ? 86 : 118} height="6" rx="3" className="fill-line" />
            <rect x="304" y={y + 18} width="11" height="11" className="fill-cobalt" />
          </g>
        ),
      )}
    </svg>
  );
}

/**
 * Página no encontrada, con la piel de la portada: titular en tipo frase,
 * entradilla, la acción principal hacia la portada y un enlace a los
 * proyectos. Desde 980 px, texto 7fr | ventana 5fr.
 */
export default function NotFound() {
  return (
    <section aria-labelledby="no-encontrada-titulo" className="wrap section">
      <div className="grid items-center gap-12 980:min-h-[min(56vh,560px)] 980:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] 980:gap-x-16">
        <div className="grid content-start justify-items-start gap-6">
          <h1 id="no-encontrada-titulo" className="max-w-[12em] text-h1">
            {texto.titulo}
          </h1>
          <p className="max-w-[32em] text-lead text-ink-2">{texto.texto}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-3 max-[599px]:w-full max-[599px]:flex-col max-[599px]:items-stretch">
            <Button href="/" size="lg" arrow>
              {texto.boton}
            </Button>
            <ArrowLink href="/#proyectos" className="max-[599px]:self-start">
              {texto.enlace}
            </ArrowLink>
          </div>
        </div>
        <div className="w-full max-w-[300px] 980:max-w-[400px] 980:justify-self-end">
          <EmptySlot />
        </div>
      </div>
    </section>
  );
}
