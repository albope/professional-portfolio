import { copyEs } from "@/data/copy";
import { herramientas } from "@/data/stack";

const { como_trabajamos: como } = copyEs;

/**
 * Banda a fondo tinta al pie de «Quien decide, construye». Vive dentro de esa
 * sección, así que su titular es un h3 y cuelga del h2 de la sección.
 *
 * Sangra hasta los bordes del lienzo: la sección la envuelve con el margen del
 * contenedor y la banda lo recupera con márgenes negativos.
 *
 * En móvil los tres pilares se recorren en horizontal con anclaje obligatorio.
 * La fila es un `ul` con `tabindex`, para que quien navegue con teclado pueda
 * desplazarla sin ratón.
 */
export function StackBand() {
  return (
    <div className="-mx-4 mt-16 bg-ink text-paper md:-mx-10 lg:mt-24 wide:-mx-[60px]">
      <div className="px-4 py-12 md:px-10 lg:py-16 wide:px-[60px] wide:py-20">
        <div className="lg:grid lg:grid-cols-[536fr_696fr] lg:items-start lg:gap-x-[88px]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/62 lg:text-xs lg:tracking-[0.1em]">
              {como.kicker}
            </p>
            <h3 className="display mt-4 text-[22px] leading-[1.02] text-paper lg:mt-5 lg:text-[26px] wide:text-[30px]">
              {como.h3}
            </h3>
          </div>
          <p className="mt-4 max-w-[520px] text-[15px] leading-[1.6] text-paper/78 lg:mt-0 lg:text-base wide:text-[17px]">
            {como.apoyo}
          </p>
        </div>

        {/* Móvil: tres tarjetas de 268 px que se recorren en horizontal. */}
        <p className="mt-9 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/62 lg:hidden">
          Desliza <span aria-hidden>→</span>
        </p>
        <ul
          tabIndex={0}
          aria-label="Cómo trabajamos"
          className="-mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 md:-mx-10 md:px-10 lg:mx-0 lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-x-[88px] lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {como.pilares.map((pilar) => (
            <li
              key={pilar.titulo}
              className="w-[268px] shrink-0 snap-start border-t-2 border-cobalt-bright pt-4 lg:w-auto lg:pt-5"
            >
              <h4 className="text-[17px] font-semibold leading-[1.25] tracking-[-0.01em] text-paper lg:text-[19px] wide:text-[21px]">
                {pilar.titulo}
              </h4>
              <p className="mt-2.5 text-sm leading-[1.6] text-paper/78 lg:mt-3 lg:text-[15px]">
                {pilar.texto}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-11 border-t border-paper/16 pt-6 lg:mt-16 lg:pt-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/62 lg:text-xs lg:tracking-[0.1em]">
            {como.stack.kicker}
          </p>
          <ul className="mt-4 grid grid-cols-4 items-center gap-x-4 gap-y-4 lg:mt-6 lg:flex lg:justify-between lg:gap-x-8">
            {herramientas.map((item) => (
              <li key={item.nombre} className="flex items-center">
                {item.logo ? (
                  <span
                    role="img"
                    aria-label={item.nombre}
                    style={{
                      height: item.alto,
                      maskImage: `url(${item.logo})`,
                      WebkitMaskImage: `url(${item.logo})`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "left center",
                      WebkitMaskPosition: "left center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                    className="block w-full bg-paper"
                  />
                ) : (
                  <span className="font-mono text-[11px] tracking-[0.06em] text-paper lg:text-[13px]">
                    {item.nombre}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
