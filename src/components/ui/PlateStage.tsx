import { PlateShot } from "@/components/ui/Plate";
import type { Plate } from "@/data/plates";
import { cn } from "@/lib/utils";

const scene: Record<Plate["scene"], string> = {
  padel: "bg-escena-padel",
  wms: "bg-escena-wms",
  radio: "bg-escena-radio",
};

const frame: Record<Plate["scene"], string> = {
  padel: "outline-escena-padel-borde/55",
  wms: "outline-escena-wms-borde",
  radio: "outline-paper/20",
};

/**
 * Escenario de una lámina: el color del producto, su rótulo y las capturas
 * con sus marcadores. La última vista es siempre la del móvil.
 *
 * - `overlay`: el móvil se apoya sobre la pantalla principal (escritorio) y
 *   se apila debajo, recortado a escala legible, en pantallas pequeñas.
 * - `pair`: pantalla principal y móvil lado a lado; con dos vistas
 *   principales se dibuja una vista partida con línea de rotura.
 */
export function PlateStage({
  plate,
  label,
  caption,
  layout = "pair",
  reverse,
  eager,
  className,
  padClassName = "px-4 md:px-10 wide:px-[60px]",
  phoneClassName = "lg:right-10 wide:right-[60px]",
}: {
  plate: Plate;
  label: string;
  caption: string;
  layout?: "overlay" | "pair";
  reverse?: boolean;
  eager?: boolean;
  className?: string;
  /** Márgenes interiores del escenario: a sangre del lienzo por defecto. */
  padClassName?: string;
  /** Posición del móvil en `overlay`, alineada con esos márgenes. */
  phoneClassName?: string;
}) {
  const views = plate.views;
  const phoneIndex = views.length - 1;
  const main = views.slice(0, -1);
  const on = (view: number) => plate.notes.filter((note) => note.view === view);
  const outline = cn("outline outline-1 -outline-offset-1", frame[plate.scene]);
  const lifted = "shadow-[0_18px_40px_rgba(0,0,0,0.35)]";

  return (
    <div data-tono="oscuro" className={cn("text-paper", scene[plate.scene], className)}>
      <div className={cn("label-mono flex items-baseline justify-between gap-4 pt-3 text-[10.5px] sm:text-xs lg:pt-4", padClassName)}>
        <p className="text-paper/82">{label}</p>
        <p className="hidden text-paper/72 sm:block">{caption}</p>
      </div>

      {layout === "overlay" ? (
        <div
          className={cn(
            "relative flex flex-col gap-3 pb-5 pt-3 sm:grid sm:grid-cols-[minmax(0,1fr)_34%] sm:items-end sm:pb-6 lg:block lg:pb-9",
            padClassName,
            // Después de los márgenes: tailwind-merge conserva la última clase.
            "lg:pr-[21%] wide:pr-[21%]"
          )}
        >
          <PlateShot view={views[0]} notes={on(0)} eager={eager} cropClassName={outline} />
          <PlateShot
            view={views[phoneIndex]}
            notes={on(phoneIndex)}
            className={cn("lg:absolute lg:bottom-[-22px] lg:w-[17%]", phoneClassName)}
            cropClassName={cn(outline, lifted)}
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-6 pb-8 pt-5 md:flex-row md:gap-8 lg:pb-12 lg:pt-8",
            main.length > 1 ? "md:items-center" : "md:items-end",
            reverse && "md:flex-row-reverse",
            padClassName
          )}
        >
          <div className="min-w-0 md:flex-[3.2]">
            {main.map((view, index) => (
              <div key={index}>
                {index > 0 && <BreakLine />}
                <PlateShot view={view} notes={on(index)} eager={eager && index === 0} cropClassName={outline} />
              </div>
            ))}
          </div>
          <PlateShot
            view={views[phoneIndex]}
            notes={on(phoneIndex)}
            className="w-3/5 min-w-0 self-end md:w-auto md:flex-1 md:self-auto"
            cropClassName={cn(outline, lifted)}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Línea de rotura de los planos técnicos: la pieza sigue, pero se omite un
 * tramo. Separa dos zonas de la misma página.
 */
function BreakLine() {
  return (
    <svg aria-hidden viewBox="0 0 100 12" preserveAspectRatio="none" className="my-4 block h-3 w-full text-paper/45 lg:my-6">
      <path d="M0 6 H46 L48 1 L50 11 L52 6 H100" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
