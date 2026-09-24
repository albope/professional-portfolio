import { PlateNotes, PlateShot, mobileViewOf } from "@/components/ui/Plate";
import type { Plate, PlateView } from "@/data/plates";
import { cn } from "@/lib/utils";

/** Muestra del color del producto: lo único de su paleta fuera de la captura. */
const swatch: Record<Plate["scene"], string> = {
  padel: "bg-escena-padel",
  wms: "bg-escena-wms",
  radio: "bg-escena-radio",
  evento: "bg-escena-evento-texto",
  papel: "bg-ink-faint",
};

const frame = "outline outline-1 -outline-offset-1 outline-ink/60";

/** Composiciones en las que se ve una vista. */
const shows = (view: PlateView) => ({ mobile: view.only !== "desktop", desktop: view.only !== "mobile" });

/**
 * Hoja de BPM: papel 2 con marco de tinta, rótulo de la hoja y las capturas
 * con sus llamadas en el margen. El color del producto se queda dentro de la
 * captura.
 *
 * Por debajo de 1024 px la hoja se apila: cada captura a lo ancho con su
 * recorte legible y sus notas debajo (en tablet, el móvil con sus notas al
 * lado). Desde 1024 se compone:
 *
 * - `overlay`: el móvil se apoya en la esquina superior derecha de la
 *   pantalla principal, sobre una zona sin contenido.
 * - `pair`: pantalla principal y móvil lado a lado. Con dos vistas
 *   principales se dibuja una vista partida con línea de rotura.
 * - `single`: una sola pantalla.
 *
 * `inlineNotes={false}` deja la lista de notas fuera de la hoja en todas las
 * anchuras, y `shotsFrom="md"` oculta las capturas en el móvil.
 */
export function PlateStage({
  plate,
  labelId,
  labelAs: Label = "p",
  eager,
  inlineNotes = true,
  shotsFrom,
  className,
}: {
  plate: Plate;
  /** Id del rótulo, para que el artículo o la figura se nombren con él. */
  labelId?: string;
  labelAs?: "h2" | "h3" | "p";
  eager?: boolean;
  inlineNotes?: boolean;
  shotsFrom?: "md";
  className?: string;
}) {
  const { views, layout } = plate;
  const hasPhone = layout !== "single";
  const phoneIndex = views.length - 1;
  const mainCount = hasPhone ? views.length - 1 : views.length;
  const main = views.slice(0, mainCount);
  const mainOnMobile = main.some((view) => shows(view).mobile);

  // Notas de la composición apilada, justo debajo de sus capturas.
  const stacked = (from: number, to: number, className = "mt-3") => {
    if (!inlineNotes) return null;
    const notes = plate.notes.filter((note) => mobileViewOf(note) >= from && mobileViewOf(note) <= to);
    return notes.length > 0 ? <PlateNotes notes={notes} className={cn(className, "lg:hidden")} /> : null;
  };
  // En tablet el móvil ocupa 360 px y sus notas van a su lado.
  const phoneTablet = "md:grid md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:items-start md:gap-8";

  const shot = (view: PlateView, index: number) => (
    <PlateShot view={view} index={index} notes={plate.notes} eager={eager} cropClassName={frame} />
  );

  const mainViews = main.map((view, index) => {
    const prev = main[index - 1];
    // La línea de rotura solo une dos recortes que se ven en la misma composición.
    const both = prev && { mobile: shows(prev).mobile && shows(view).mobile, desktop: shows(prev).desktop && shows(view).desktop };
    const breakClass = !both ? null : both.mobile && both.desktop ? "" : both.mobile ? "lg:hidden" : both.desktop ? "hidden lg:block" : null;
    return (
      <div key={index}>
        {breakClass !== null && <BreakLine className={breakClass} />}
        {shot(view, index)}
      </div>
    );
  });

  return (
    <div className={cn("border border-ink bg-paper-2", className)}>
      <div className="label-mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink/15 py-3 pl-10 pr-4 text-[10.5px] sm:text-xs md:px-10">
        <Label id={labelId} className="flex items-center gap-2.5 whitespace-nowrap font-normal text-ink">
          <span aria-hidden className={cn("h-2.5 w-2.5 shrink-0", swatch[plate.scene])} />
          Proyecto {plate.num} · {plate.name}
        </Label>
        <p className="text-ink-mute">{plate.caption}</p>
      </div>

      {layout === "overlay" ? (
        <div className={cn("relative pb-6 pl-10 pr-4 pt-6 md:px-10 lg:pb-10 lg:pt-10", shotsFrom && "hidden md:block")}>
          {mainViews}
          {stacked(0, mainCount - 1)}
          {/* El anillo de papel (p-1.5) separa el móvil de la pantalla que pisa. */}
          <div
            className={cn(
              phoneTablet,
              "lg:absolute lg:right-[34px] lg:top-[34px] lg:mt-0 lg:block lg:w-[192px] lg:bg-paper-2 lg:p-1.5 wide:w-[212px]",
              mainOnMobile && "mt-6"
            )}
          >
            {shot(views[phoneIndex], phoneIndex)}
            {stacked(phoneIndex, phoneIndex, "mt-3 md:mt-0")}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-8 pb-6 pl-10 pr-4 pt-6 md:px-10 lg:flex-row lg:items-end lg:gap-10 lg:pb-10 lg:pt-10",
            shotsFrom && "hidden md:flex"
          )}
        >
          <div className={cn("w-full min-w-0", hasPhone ? "lg:flex-[3.2]" : "lg:flex-1")}>
            {mainViews}
            {stacked(0, mainCount - 1)}
          </div>
          {hasPhone && (
            <div className={cn("min-w-0 lg:block lg:flex-1", phoneTablet)}>
              {shot(views[phoneIndex], phoneIndex)}
              {stacked(phoneIndex, phoneIndex, "mt-3 md:mt-0")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Línea de rotura de los planos técnicos: dos trazos paralelos en zigzag que
 * cruzan la pieza y sobresalen por los lados. Indica que se omite un tramo de
 * la misma página.
 */
function BreakLine({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 18"
      preserveAspectRatio="none"
      className={cn("my-5 block h-[18px] w-full text-ink md:-mx-3 md:w-[calc(100%+24px)] lg:my-7", className)}
    >
      {[4, 13].map((y) => (
        <path
          key={y}
          d={`M0 ${y} H45 L47 ${y - 4} L49.5 ${y + 4} L52 ${y - 4} L54 ${y} H100`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
