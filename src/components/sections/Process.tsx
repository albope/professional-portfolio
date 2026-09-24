import { SheetHeader } from "@/components/ui/SheetHeader";
import { copyEs } from "@/data/copy";

const { metodo } = copyEs;

/**
 * Las tres piezas del glifo de la marca, en sus proporciones (11 · 3 y borde
 * de 2 sobre 11), son la figura del método: una conversación, un alcance
 * cerrado por escrito y algo construido. Se ensartan en una misma línea de
 * proceso, que pasa por su centro y no cruza el hueco del marco. Se dibujan
 * con bordes para que sigan visibles en alto contraste. Son decorativas: el
 * número y el nombre del paso llevan la información.
 */
const grandes = [
  <span key="barra" className="block h-[26px] w-24 border-[13px] border-paper" />,
  <span key="marco" className="block h-24 w-24 border-[17px] border-paper bg-ink" />,
  <span key="bloque" className="block h-24 w-24 border-[48px] border-cobalt-bright" />,
];

const pequenas = [
  <span key="barra" className="block h-2 w-7 border-4 border-paper" />,
  <span key="marco" className="block h-7 w-7 border-[5px] border-paper" />,
  <span key="bloque" className="block h-7 w-7 border-[14px] border-cobalt-bright" />,
];

export function Process() {
  return (
    <section id="metodo" aria-labelledby="process-title" data-tono="oscuro" className="bg-ink text-paper">
      <div className="container-editorial seccion">
        <SheetHeader id="process-title" label={metodo.kicker} title={metodo.h2} intro={metodo.apoyo} tone="ink" />

        <ol className="relative mt-12 grid gap-y-10 md:grid-cols-3 md:gap-x-6 lg:mt-16">
          <span aria-hidden className="absolute inset-x-0 top-12 hidden border-t border-paper/45 md:block" />
          {metodo.fases.map((fase, index) => (
            <li key={fase.num} className="flex flex-col">
              <div aria-hidden className="relative hidden h-24 items-center md:flex">{grandes[index]}</div>
              <div className="flex items-end gap-4 md:mt-6">
                <span aria-hidden className="flex h-7 items-end md:hidden">{pequenas[index]}</span>
                <p className="font-mono text-sm leading-none text-cobalt-bright">
                  <span className="sr-only">Paso </span>
                  {fase.num}
                </p>
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.025em]">{fase.nombre}</h3>
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
