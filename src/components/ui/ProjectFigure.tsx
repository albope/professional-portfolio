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
 * que el contenedor. La franja del evento es baja y pide un escenario más
 * ancho que alto.
 */
const stageAspect: Record<MainFigure["layout"], string> = {
  "con-movil": "aspect-[4/3] 768:aspect-[16/10]",
  // La web del ordenador es más apaisada que la del almacén: a 16:10 dejaba
  // un tercio del escenario vacío bajo el móvil.
  "movil-delante": "aspect-[4/3] 768:aspect-[16/9]",
  franja: "aspect-[4/3] 768:aspect-[12/5]",
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

  if (figure.layout === "franja") {
    const { strip, zoom } = figure;
    // Las dos capas piden la misma URL (el mismo `sizes`), así que la captura
    // se descarga una sola vez: el detalle es la imagen entera a unas 3,6
    // veces el escenario en móvil y 1,6 veces desde 768 px.
    const scale = shot.width / zoom.w;
    const sizes = stageSizes(0.32 * scale, 0.72 * scale);
    return (
      <>
        {/* Solo la franja clara de arriba, sin el bloque inferior. */}
        <Shot
          className="left-[7%] top-[11%] w-[128%] 768:left-[6%] 768:top-[8%] 768:w-[88%]"
          style={{ aspectRatio: `${shot.width} / ${strip}` }}
        >
          <Image {...shot} alt={shot.alt} sizes={sizes} fetchPriority="high" loading="eager" className={IMG} />
        </Shot>
        {/* Detalle ampliado del selector de idioma y del botón de confirmar.
            El fondo es el de la propia web, para que no parpadee en blanco
            mientras carga. Repite lo que dice el `alt` de la franja. Desde
            768 px la franja ya se lee casi a tamaño real y el detalle se
            queda en un 32 %. En ningún ancho pasa de 266 px, 1,2 veces el
            recorte: la captura es de 1120 px y más ampliada se ve borrosa. */}
        <div
          aria-hidden="true"
          className="absolute right-[6%] top-[60%] w-[72%] max-w-[266px] overflow-hidden rounded-[6px] bg-[#E9E9E1] shadow-[0_0_0_1px_rgba(16,16,19,.08),0_24px_40px_-18px_rgba(16,16,19,.45)] 768:top-[64%] 768:w-[32%]"
          style={{ aspectRatio: `${zoom.w} / ${zoom.h}` }}
        >
          <Image
            src={shot.src}
            width={shot.width}
            height={shot.height}
            alt=""
            sizes={sizes}
            className="block h-auto max-w-none"
            style={{
              width: `${scale * 100}%`,
              // Los márgenes en porcentaje se miden sobre el ancho del marco.
              marginLeft: `${(-zoom.x / zoom.w) * 100}%`,
              marginTop: `${(-zoom.y / zoom.w) * 100}%`,
            }}
          />
        </div>
      </>
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
  const front = figure.layout === "movil-delante";
  return (
    <>
      <Shot
        className={
          front
            ? "left-[6%] top-[11%] w-[104%] 768:top-[8%] 768:w-[88%]"
            : "left-[6%] top-[10%] w-[104%] 768:top-[8%] 768:w-[84%]"
        }
      >
        <Image
          {...shot}
          alt={shot.alt}
          sizes={stageSizes(front ? 0.88 : 0.84, 1.04)}
          fetchPriority="high"
          loading="eager"
          className={IMG}
        />
      </Shot>
      <Shot
        className={
          front
            ? // Delante y en el centro, tapando la portada difuminada.
              "left-[34%] top-[18%] w-[36%] rounded-card shadow-phone 768:left-[40%] 768:top-[14%] 768:w-[25%] 768:rounded-[18px] 768:shadow-phone-lg"
            : // Abajo a la derecha, asomando por el borde del escenario.
              "-bottom-[24%] right-[5%] w-[30%] rounded-card shadow-phone 600:-bottom-[18%] 600:w-[22%] 600:rounded-[18px] 600:shadow-phone-lg"
        }
      >
        <Image {...phone} alt={phone.alt} sizes={stageSizes(front ? 0.25 : 0.22, front ? 0.36 : 0.3)} className={IMG} />
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
