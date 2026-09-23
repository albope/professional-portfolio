import { copyEs } from "@/data/copy";

const { metodo } = copyEs;

export function Process() {
  return (
    <section id="metodo" aria-labelledby="process-title" data-tono="oscuro" className="bg-ink text-paper">
      <div className="container-editorial seccion">
        <div className="grid items-end gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="label-mono text-cobalt-bright">{metodo.kicker}</p>
            <h2 id="process-title" className="display mt-4 text-display-sec">{metodo.h2}</h2>
          </div>
          <p className="max-w-[490px] text-base leading-relaxed text-paper/78">{metodo.apoyo}</p>
        </div>
        <ol className="mt-12 grid gap-9 md:grid-cols-3 md:gap-8 wide:gap-14">
          {metodo.fases.map((fase) => (
            <li key={fase.num} className="border-t border-paper/28 pt-5">
              <span aria-hidden className="font-mono text-sm text-cobalt-bright">{fase.num}</span>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.025em]">{fase.nombre}</h3>
              <p className="mt-3 text-base leading-relaxed text-paper/78">{fase.texto}</p>
              <p className="mt-6 flex items-center gap-2 text-sm text-paper"><span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-cobalt-bright" />{fase.entregable}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}