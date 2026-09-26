import type { CSSProperties } from "react";
import { TextLink } from "@/components/ui/TextLink";
import { copyEs, partirEnlace } from "@/data/copy";
import { sinCortes } from "@/lib/sin-cortes";

const { preguntas } = copyEs;
/** «Escríbenos» lleva al formulario, dentro de la nota tal cual la trae el copy. */
const nota = partirEnlace(preguntas.nota, preguntas.nota_enlace);

/**
 * Icono más que pasa a menos (4.9): dos barras de 2 px y la vertical gira
 * 90° en 0,3 s al abrir. Hereda el color, así que se vuelve cobalto con el
 * hover de la pregunta.
 */
const masMenos =
  "relative h-3.5 w-3.5 flex-none before:absolute before:inset-x-0 before:top-1.5 before:h-0.5 before:bg-current after:absolute after:inset-x-0 after:top-1.5 after:h-0.5 after:rotate-90 after:bg-current after:transition-transform after:duration-300 after:ease-soft group-open:after:rotate-0";

/**
 * Preguntas (especificación 3.7): las objeciones del dueño de una pyme
 * (precio, herramientas, mantenimiento, empezar pequeño) respondidas antes
 * de que tenga que escribir.
 *
 * Acordeón con `<details>` nativo: se abre y se cierra sin JS, con teclado y
 * con la búsqueda del navegador. La primera pregunta, la del precio, va
 * abierta. Desde 980 px la cabecera se queda fija a la izquierda mientras se
 * leen las respuestas (`self-start` hace falta para que un elemento de
 * rejilla pueda ser `sticky`: estirado a lo alto de la fila no tendría
 * recorrido).
 */
export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-titulo" className="section border-y border-line bg-surface">
      <div className="wrap grid gap-9 980:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] 980:gap-20">
        <div className="grid content-start gap-[18px] 980:sticky 980:top-[calc(var(--head-h)+32px)] 980:self-start" data-reveal>
          <h2 id="preguntas-titulo" className="text-h2">
            {preguntas.h2}
          </h2>
          <p className="text-lead text-ink-2">{preguntas.entradilla}</p>
          <p className="text-small text-ink-2">
            {nota.antes}
            {nota.enlace && <TextLink href="#contacto">{nota.enlace}</TextLink>}
            {sinCortes(nota.despues)}
          </p>
        </div>
        <div className="min-w-0" data-reveal style={{ "--rd": 1 } as CSSProperties}>
          {preguntas.items.map((item, index) => (
            <details key={item.pregunta} open={index === 0} className="group border-b border-line first:border-t">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-[22px] text-[1.125rem] font-semibold leading-[1.35] tracking-[-0.01em] transition-colors duration-200 hover:text-cobalt [&::-webkit-details-marker]:hidden">
                {item.pregunta}
                <span aria-hidden="true" className={masMenos} />
              </summary>
              <p className="max-w-[40em] pb-6 pr-10 text-ink-2">{item.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
