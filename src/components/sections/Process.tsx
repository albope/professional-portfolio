import { copyEs } from "@/data/copy";

const { metodo } = copyEs;

export function Process() {
  return (
    <section
      id="metodo"
      aria-label="Cómo trabajamos"
      className="mt-16 scroll-mt-6 bg-paper-2 lg:mt-24 wide:mt-[120px]"
    >
      <div className="container-editorial rejilla-editorial pb-12 pt-11 lg:pb-20 lg:pt-[72px] wide:pb-24 wide:pt-20">
        <div>
          <h2 className="display text-[26px] leading-[1.02] lg:text-[32px] wide:text-[40px]">
            {metodo.h2}
          </h2>
          <p className="mt-3 max-w-[440px] text-[15px] leading-[1.55] text-ink-mute lg:mt-4 lg:text-base wide:text-[17px] wide:leading-[1.6]">
            {metodo.apoyo}
          </p>
        </div>

        <ol className="mt-7 lg:mt-0 lg:grid lg:grid-cols-5 lg:gap-x-6">
          {metodo.fases.map((fase, index) => (
            <li
              key={fase.num}
              className={`grid grid-cols-[40px_1fr] gap-x-3 border-t py-4 lg:block lg:border-t-ink lg:py-0 lg:pt-4 ${
                index === 0 ? "border-t-ink" : "border-t-line-2"
              } ${index === metodo.fases.length - 1 ? "border-b border-b-line-2 lg:border-b-0" : ""}`}
            >
              <span className="pt-[3px] font-mono text-xs text-cobalt lg:pt-0">{fase.num}</span>
              <div>
                <h3 className="text-base font-semibold tracking-[-0.01em] lg:mt-3 lg:text-lg">
                  {fase.nombre}
                </h3>
                <p className="mt-1.5 text-sm leading-[1.5] text-ink-soft lg:mt-2">{fase.texto}</p>
                <p className="mt-2 font-mono text-[11px] leading-[1.5] text-ink-mute lg:mt-3.5 lg:text-xs">
                  <span aria-hidden>↳ </span>
                  {fase.entregable}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
