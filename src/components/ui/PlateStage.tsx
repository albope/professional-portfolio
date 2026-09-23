import { PlateNotes, PlateShot } from "@/components/ui/Plate";
import type { Plate } from "@/data/plates";
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

/**
 * Hoja de BPM: papel 2 con marco de tinta, rótulo de la hoja y las capturas
 * con sus llamadas. El color del producto se queda dentro de la captura.
 *
 * - `overlay`: el móvil se apoya sobre la pantalla principal en escritorio y
 *   se apila debajo, recortado a escala legible, en pantallas pequeñas.
 * - `pair`: pantalla principal y móvil lado a lado. Con dos vistas
 *   principales se dibuja una vista partida con línea de rotura.
 * - `single`: una sola pantalla.
 *
 * Por debajo de 768 px cada vista lleva sus notas justo debajo; desde 768 la
 * lista completa va fuera de la hoja (`notesOutside`).
 */
export function PlateStage({
  plate,
  labelId,
  labelAs: Label = "p",
  eager,
  className,
}: {
  plate: Plate;
  /** Id del rótulo, para que el artículo o la figura se nombren con él. */
  labelId?: string;
  labelAs?: "h2" | "h3" | "p";
  eager?: boolean;
  className?: string;
}) {
  const { views, layout } = plate;
  const hasPhone = layout !== "single";
  const phoneIndex = views.length - 1;
  const main = hasPhone ? views.slice(0, -1) : views;
  const on = (view: number) => plate.notes.filter((note) => note.view === view);
  const inline = (view: number) => <PlateNotes notes={on(view)} className="mt-2 md:hidden" />;

  return (
    <div className={cn("border border-ink bg-paper-2", className)}>
      <div className="label-mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink/15 py-3 pl-9 pr-4 text-[10.5px] md:px-8 lg:px-10 sm:text-xs">
        <Label id={labelId} className="flex items-center gap-2.5 font-normal text-ink">
          <span aria-hidden className={cn("h-2.5 w-2.5 shrink-0", swatch[plate.scene])} />
          Proyecto {plate.num} · {plate.name}
        </Label>
        <p className="text-ink-mute">{plate.caption}</p>
      </div>

      {layout === "overlay" ? (
        <div className="relative pb-6 pl-9 pr-4 pt-6 md:grid md:grid-cols-[minmax(0,1fr)_34%] md:items-end md:gap-6 md:px-8 lg:block lg:px-10 lg:pb-10 lg:pr-[22%] lg:pt-8">
          <div>
            <PlateShot view={views[0]} notes={on(0)} eager={eager} cropClassName={frame} />
            {inline(0)}
          </div>
          <div className="mt-4 md:mt-0 lg:absolute lg:bottom-10 lg:right-10 lg:w-[16%]">
            <PlateShot view={views[phoneIndex]} notes={on(phoneIndex)} cropClassName={frame} />
            {inline(phoneIndex)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-6 pl-9 pr-4 pt-6 md:flex-row md:items-center md:gap-8 md:px-8 lg:px-10 lg:pb-10 lg:pt-8">
          <div className={cn("w-full min-w-0", hasPhone ? "md:flex-[3.2]" : "md:flex-1")}>
            {main.map((view, index) => (
              <div key={index}>
                {index > 0 && <BreakLine />}
                <PlateShot view={view} notes={on(index)} eager={eager && index === 0} cropClassName={frame} />
                {inline(index)}
              </div>
            ))}
          </div>
          {hasPhone && (
            <div className="min-w-0 md:flex-1">
              <PlateShot view={views[phoneIndex]} notes={on(phoneIndex)} cropClassName={frame} />
              {inline(phoneIndex)}
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
function BreakLine() {
  return (
    <svg aria-hidden viewBox="0 0 100 18" preserveAspectRatio="none" className="-mx-3 my-5 block h-[18px] w-[calc(100%+24px)] text-ink lg:my-7">
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
