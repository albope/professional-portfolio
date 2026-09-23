import { copyEs } from "@/data/copy";
import { AutoCarousel } from "@/components/ui/AutoCarousel";

const { ai_first: aiFirst } = copyEs;

/**
 * Banda de tinta entre el método y Sobre BPM Tech. Lleva `data-ink`: el
 * motor dibuja las celdas con la paleta de tinta dentro de su rectángulo.
 *
 * En móvil los tres pilares se recorren en horizontal con anclaje y avanzan
 * solos hasta que el visitante toma el control; las condiciones de ese
 * movimiento están en `AutoCarousel`. El carril sangra hasta el borde con
 * `-mx-4`, así que lleva `scroll-pl-4` a juego con su `px-4`.
 */
export function AiFirst() {
  return (
    <section data-ink="" data-tono="oscuro" aria-label="Cómo trabajamos" className="relative bg-ink text-paper">
      <div className="container-editorial relative z-[2] py-[clamp(80px,10vw,152px)]">
        <p className="label-mono text-cobalt-bright">{aiFirst.kicker}</p>
        <h2 className="display mt-6 max-w-[1200px] text-display-banda text-paper">{aiFirst.h2}</h2>
        <p className="mt-7 max-w-[640px] text-[clamp(16px,1.25vw,19px)] leading-[1.6] text-paper/78">
          {aiFirst.apoyo}
        </p>

        <div className="mt-[clamp(40px,5vw,72px)]">
          <AutoCarousel
            label="Cómo trabajamos"
            hint={
              <>
                Desliza <span aria-hidden>→</span>
              </>
            }
            className="-mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 pb-1 md:-mx-10 md:scroll-pl-10 md:px-10 lg:mx-0 lg:mt-0 lg:grid lg:grid-cols-3 lg:gap-x-[88px] lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {aiFirst.pilares.map((pilar) => (
              <li
                key={pilar.titulo}
                className="w-[268px] shrink-0 snap-start border-t-2 border-cobalt-bright pt-4 lg:w-auto lg:pt-5"
              >
                <h3 className="text-[17px] font-semibold leading-[1.25] tracking-[-0.01em] text-paper lg:text-[19px] wide:text-[21px]">
                  {pilar.titulo}
                </h3>
                <p className="mt-2.5 text-sm leading-[1.6] text-paper/78 lg:mt-3 lg:text-[15px]">
                  {pilar.texto}
                </p>
              </li>
            ))}
          </AutoCarousel>
        </div>
      </div>
    </section>
  );
}
