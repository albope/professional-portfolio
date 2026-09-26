import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DetailFigure, MainFigure, Rect } from "@/data/projects";

/**
 * Figuras de las fichas de proyecto, con el mismo lenguaje que la portada:
 * escenario arena con radio, capturas con radio de 8 px y la sombra de la
 * especificación (2.4), móviles con marco de tinta. Sin rótulos sobre la
 * imagen, sin llamadas numeradas: lo que hay que leer va en el pie.
 */

/**
 * Anchos de pantalla que ocupa el escenario principal, que mide lo mismo que
 * el contenedor: 1200 px desde 1312 (1200 + 2 × 56 de margen) y un 90 % de
 * la ventana por debajo. `desktop` (desde 768 px) y `mobile` son la
 * fracción del escenario que ocupa la imagen en cada tramo (0,84 = el 84 %
 * de su ancho), para que el navegador pida los píxeles que va a pintar.
 */
function stageSizes(desktop: number, mobile: number) {
  return [
    `(min-width: 1312px) ${Math.round(1200 * desktop)}px`,
    `(min-width: 768px) ${Math.round(90 * desktop)}vw`,
    `${Math.round(90 * mobile)}vw`,
  ].join(", ");
}

/** Marco de una captura dentro del escenario: posición absoluta y fondo blanco mientras carga. */
function Shot({ className, style, children }: { className: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={cn("absolute block overflow-hidden rounded-shot bg-surface shadow-capture", className)} style={style}>
      {children}
    </div>
  );
}

/** La imagen ocupa el ancho de su marco y conserva su proporción. */
const IMG = "block h-auto w-full";

/**
 * Proporción del escenario por composición: 4:3 en móvil, como las tarjetas
 * de la portada, y más apaisado desde 768 px, donde el escenario ya mide lo
 * que el contenedor. Los móviles solos (evento y radio) caben enteros en
 * 16:9 desde 768 px.
 */
const stageAspect: Record<MainFigure["layout"], string> = {
  "con-movil": "aspect-[4/3] 768:aspect-[16/10]",
  "dos-moviles": "aspect-[4/3] 768:aspect-[16/9]",
  "movil-solo": "aspect-[4/3] 768:aspect-[16/9]",
  sola: "aspect-[4/3] 768:aspect-[16/9]",
};

/**
 * Figura principal (especificación 3.4, llevada a la ficha): la captura del
 * escritorio en su escenario y, según el proyecto, el móvil o el detalle
 * ampliado. En móvil la captura desborda a la derecha para ganar tamaño, y
 * el móvil la tapa por ese lado. Es la imagen grande de la parte alta de la
 * ficha, así que la del escritorio se pide con prioridad alta.
 */
export function ProjectMainFigure({ figure, className }: { figure: MainFigure; className?: string }) {
  return (
    <figure className={cn("m-0", className)}>
      <div className={cn("relative overflow-hidden rounded-feature bg-sand", stageAspect[figure.layout])}>
        <MainLayers figure={figure} />
      </div>
      <figcaption className="mt-3.5 max-w-[46em] text-caption text-ink-2">{figure.caption}</figcaption>
    </figure>
  );
}

function MainLayers({ figure }: { figure: MainFigure }) {
  const { shot } = figure;

  if (figure.layout === "movil-solo") {
    // Centrado con su marco de tinta. Desde 768 px mide un 26 % del
    // escenario y cabe entero (unos 580 px de alto en 675). Por debajo mide
    // un 44 % y asoma desde el borde inferior, con la portada a la vista.
    return (
      <Shot className="left-1/2 top-[9%] w-[44%] -translate-x-1/2 rounded-card shadow-phone 768:top-[8%] 768:w-[26%] 768:rounded-[18px] 768:shadow-phone-lg">
        <Image {...shot} alt={shot.alt} sizes={stageSizes(0.26, 0.44)} fetchPriority="high" loading="eager" className={IMG} />
      </Shot>
    );
  }

  if (figure.layout === "sola") {
    return (
      <Shot className="left-[6%] top-[10%] w-[120%] 768:top-[8%] 768:w-[88%]">
        <Image {...shot} alt={shot.alt} sizes={stageSizes(0.88, 1.2)} fetchPriority="high" loading="eager" className={IMG} />
      </Shot>
    );
  }

  const { phone } = figure;

  if (figure.layout === "dos-moviles") {
    // Dos pantallas del móvil lado a lado, enteras en los dos tramos: la
    // segunda baja un poco para que no se lean como un solo bloque. Con un
    // 34 % (22 % desde 768 px) de ancho, las dos caben con su reproductor
    // fijo de abajo a la vista.
    const movil = "rounded-card shadow-phone 768:rounded-[18px] 768:shadow-phone-lg";
    return (
      <>
        <Shot className={cn("left-[12%] top-[5%] w-[34%] 768:left-[26%] 768:top-[8%] 768:w-[22%]", movil)}>
          <Image {...shot} alt={shot.alt} sizes={stageSizes(0.22, 0.34)} fetchPriority="high" loading="eager" className={IMG} />
        </Shot>
        <Shot className={cn("right-[12%] top-[10%] w-[34%] 768:right-[26%] 768:top-[14%] 768:w-[22%]", movil)}>
          <Image {...phone} alt={phone.alt} sizes={stageSizes(0.22, 0.34)} className={IMG} />
        </Shot>
      </>
    );
  }

  return (
    <>
      <Shot className="left-[6%] top-[10%] w-[104%] 768:top-[8%] 768:w-[84%]">
        <Image {...shot} alt={shot.alt} sizes={stageSizes(0.84, 1.04)} fetchPriority="high" loading="eager" className={IMG} />
      </Shot>
      {/* Abajo a la derecha, asomando por el borde del escenario. */}
      <Shot className="-bottom-[24%] right-[5%] w-[30%] rounded-card shadow-phone 600:-bottom-[18%] 600:w-[22%] 600:rounded-[18px] 600:shadow-phone-lg">
        <Image {...phone} alt={phone.alt} sizes={stageSizes(0.22, 0.3)} className={IMG} />
      </Shot>
    </>
  );
}

/**
 * `sizes` de un recorte: el ancho del marco por el factor entre la imagen
 * entera y el recorte. El marco mide lo que la columna de contenido (8fr
 * desde 980 px, unos 660 px útiles con el contenedor a 1200, o la mitad si
 * comparte fila con otro detalle) sin pasar de `maxWidth`, y por debajo un
 * 80 % de la ventana (un 40 % en pareja desde 700 px).
 */
function cropSizes(crop: Rect, maxWidth: number, imageWidth: number, pair: boolean, pairDesktop: boolean) {
  const ratio = imageWidth / crop.w;
  const desktop = Math.min(maxWidth, pairDesktop ? 290 : 660);
  return [
    `(min-width: 980px) ${Math.round(desktop * ratio)}px`,
    pair ? `(min-width: 700px) ${Math.round(40 * ratio)}vw` : "",
    `${Math.round(80 * ratio)}vw`,
  ]
    .filter(Boolean)
    .join(", ");
}

/**
 * Detalle de interfaz: la parte que en la figura principal no se lee, en su
 * propio escenario y con un pie que empieza por su nombre en negrita.
 *
 * - `recorte`: la zona se pinta dentro de un marco con la proporción del
 *   recorte y nunca más ancho que el recorte en píxeles, así que la captura
 *   solo se reduce, nunca se amplía.
 * - `movil`: la pantalla entera con el marco de tinta de la especificación.
 *
 * `pair` indica que comparte fila con otro detalle desde 700 px. Entonces la
 * figura hereda las dos filas de la rejilla (`subgrid`): los dos escenarios
 * miden lo mismo y los pies empiezan a la misma altura aunque el contenido
 * sea distinto. El contenedor pone las dos columnas y quita su hueco
 * vertical en ese tramo.
 *
 * `pairEscritorio` dice si sigue en pareja desde 768 px, donde los detalles
 * `soloMovil` se ocultan. Un recorte que se queda solo no se estira a lo
 * ancho de la columna: el escenario mide lo que la imagen a su tamaño, sin
 * una franja de arena vacía a cada lado.
 */
export function ProjectDetailFigure({
  figure,
  pair = false,
  pairEscritorio = pair,
}: {
  figure: DetailFigure;
  pair?: boolean;
  pairEscritorio?: boolean;
}) {
  const ancho = figure.variant === "recorte" ? (figure.maxWidth ?? figure.crop.w) : 0;
  const ajustado = figure.variant === "recorte" && !pairEscritorio;
  return (
    <figure
      className={cn(
        "m-0 grid grid-rows-[1fr_auto] gap-y-3.5",
        pair && "700:row-span-2 700:grid-rows-subgrid",
        figure.soloMovil && "768:hidden",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-card bg-sand px-[clamp(20px,4vw,40px)] py-[clamp(28px,5vw,48px)]",
          ajustado && "768:w-fit 768:max-w-full",
        )}
      >
        {figure.variant === "recorte" ? (
          <div
            className={cn(
              "relative w-full max-w-[min(var(--ancho),100%)] overflow-hidden rounded-shot bg-surface shadow-capture",
              // Solo, el marco pide su ancho: con `w-full` dentro de un
              // escenario que se ajusta a su contenido mediría cero.
              ajustado && "768:w-[var(--ancho)]",
            )}
            style={{ "--ancho": `${ancho}px`, aspectRatio: `${figure.crop.w} / ${figure.crop.h}` } as CSSProperties}
          >
            <Image
              {...figure.shot}
              alt={figure.shot.alt}
              sizes={cropSizes(figure.crop, ancho, figure.shot.width, pair, pairEscritorio)}
              className="absolute block h-auto max-w-none"
              style={{
                width: `${(figure.shot.width / figure.crop.w) * 100}%`,
                left: `${(-figure.crop.x / figure.crop.w) * 100}%`,
                top: `${(-figure.crop.y / figure.crop.h) * 100}%`,
              }}
            />
          </div>
        ) : (
          <div className="w-[min(72%,240px)] overflow-hidden rounded-[18px] bg-surface shadow-phone-lg 768:w-[min(80%,280px)]">
            <Image {...figure.shot} alt={figure.shot.alt} sizes="(min-width: 768px) 280px, 240px" className={IMG} />
          </div>
        )}
      </div>
      <figcaption className="max-w-[40em] text-small text-ink-2">
        <strong className="font-semibold text-ink">{figure.label}</strong> {figure.caption}
      </figcaption>
    </figure>
  );
}
