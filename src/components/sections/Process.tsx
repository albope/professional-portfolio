import { copyEs } from "@/data/copy";

const { metodo } = copyEs;

/**
 * Las tres piezas del glifo de la marca, en sus proporciones (11 · 3 y
 * borde de 2 sobre 11), marcan los tres pasos: una conversación, un alcance
 * cerrado por escrito y algo construido. Se dibujan con CSS y son
 * decorativas: el número y el nombre del paso llevan la información.
 */
const piezas = [
  <span key="barra" className="block h-3 w-11 bg-paper" />,
  <span key="marco" className="block h-11 w-11 border-[8px] border-paper" />,
  <span key="bloque" className="block h-11 w-11 bg-cobalt-bright" />,
];

export function Process() {
  return (
    <section id="metodo" aria-labelledby="process-title" data-tono="oscuro" className="bg-ink text-paper">
      <div className="container-editorial seccion">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div>
            <p className="label-mono text-cobalt-bright">{metodo.kicker}</p>
            <h2 id="process-title" className="display mt-4 text-display-sec">{metodo.h2}</h2>
          </div>
          <p className="max-w-[460px] text-base leading-relaxed text-paper/78 lg:pb-1">{metodo.apoyo}</p>
        </div>

        <ol className="mt-12 grid gap-y-12 md:grid-cols-3 md:gap-x-8 lg:mt-16 wide:gap-x-14">
          {metodo.fases.map((fase, index) => (
            <li key={fase.num} className="flex flex-col">
              <div aria-hidden className="flex h-11 items-end">{piezas[index]}</div>
              <p className="mt-8 border-t border-paper/28 pt-4 font-mono text-sm text-cobalt-bright">
                <span className="sr-only">Paso </span>
                {fase.num}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em]">{fase.nombre}</h3>
              <p className="mt-3 text-base leading-relaxed text-paper/78">{fase.texto}</p>
              <p className="mt-auto pt-6 text-sm text-paper">
                <span className="label-mono mb-1.5 block text-[10.5px] text-paper/62">{metodo.entregable_rotulo}</span>
                {fase.entregable}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
