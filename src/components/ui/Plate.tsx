import Image, { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { cn } from "@/lib/utils";
import type { PlateNote, PlateView, Rect, Side, TitleEntry } from "@/data/plates";

const inside = (rect: Rect, [x, y]: [number, number]) =>
  x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;

const factor = (view: PlateView, rect: Rect) => Math.round((view.shot.width / rect.w) * 1000) / 1000;

/** Vista y lado de cada nota en la composición apilada (por debajo de 1024). */
export const mobileViewOf = (note: PlateNote) => note.mobileView ?? note.view;
const mobileSideOf = (note: PlateNote): Side => note.mobileSide ?? "left";

/** Clase que muestra algo solo en una de las dos composiciones. */
export const onlyClass = (only: PlateView["only"]) =>
  only === "desktop" ? "hidden lg:block" : only === "mobile" ? "lg:hidden" : undefined;

/**
 * `sizes` del ancho realmente pintado: la imagen se dibuja a (ancho original
 * / ancho del recorte) veces la caja, así que se multiplica cada tramo por
 * ese factor. Sin esto el navegador baja una variante pequeña y la captura
 * se ve blanda.
 */
function sizesFor(view: PlateView) {
  const mobile = factor(view, view.mobile ?? view.desktop);
  const tablet = factor(view, view.tablet ?? view.mobile ?? view.desktop);
  const desktop = factor(view, view.desktop);
  const { box } = view;
  return [
    `(min-width: 1440px) calc(${box.wide} * ${desktop})`,
    `(min-width: 1024px) calc(${box.desktop} * ${desktop})`,
    `(min-width: 768px) calc(${box.tablet} * ${tablet})`,
    `calc(${box.mobile} * ${mobile})`,
  ].join(", ");
}

interface Marker {
  n: number;
  at: [number, number];
  side: Side;
  /** Composición en la que se ve. */
  on: "mobile" | "desktop";
  /** En la hoja apilada, si el anclaje también cae en el recorte de tablet. */
  onTablet?: boolean;
}

/**
 * Captura recortada con sus llamadas. El recorte cambia a 768 y a 1024 px y cada
 * nota tiene un marcador por composición: su vista, su anclaje y su lado
 * pueden cambiar entre la hoja apilada y la de escritorio. Un anclaje fuera
 * del recorte no se dibuja. Las llamadas son decorativas: la lista de notas
 * lleva la información.
 */
export function PlateShot({
  view,
  index,
  notes,
  eager,
  className,
  cropClassName,
}: {
  view: PlateView;
  /** Posición de la vista en la lámina, para casar cada nota con su vista. */
  index: number;
  notes: PlateNote[];
  /** Solo la lámina del primer pantallazo: carga prioritaria. */
  eager?: boolean;
  className?: string;
  cropClassName?: string;
}) {
  const mobile = view.mobile ?? view.desktop;
  const tablet = view.tablet ?? mobile;
  const { desktop } = view;
  const tabletMax = view.tabletMax ?? (view.tablet ? undefined : view.mobileMax);
  const vars = {
    "--iw": view.shot.width,
    "--m-cx": mobile.x,
    "--m-cy": mobile.y,
    "--m-cw": mobile.w,
    "--m-ch": mobile.h,
    "--t-cx": tablet.x,
    "--t-cy": tablet.y,
    "--t-cw": tablet.w,
    "--t-ch": tablet.h,
    "--d-cx": desktop.x,
    "--d-cy": desktop.y,
    "--d-cw": desktop.w,
    "--d-ch": desktop.h,
    ...(view.max && { "--max": `${view.max}px` }),
    ...(view.mobileMax && { "--max-m": `${view.mobileMax}px` }),
    ...(tabletMax && { "--max-t": `${tabletMax}px` }),
  } as CSSProperties;

  const markers: Marker[] = [];
  for (const note of notes) {
    if (view.only !== "mobile" && note.view === index && inside(desktop, note.at)) {
      markers.push({ n: note.n, at: note.at, side: note.side, on: "desktop" });
    }
    const at = note.mobileAt ?? note.at;
    if (note.mobileMarker !== false && view.only !== "desktop" && mobileViewOf(note) === index && inside(mobile, at)) {
      markers.push({ n: note.n, at, side: mobileSideOf(note), on: "mobile", onTablet: inside(tablet, at) });
    }
  }

  // Aire para los cuadrados que van encima o debajo de la captura.
  const has = (on: Marker["on"], side: Side) => markers.some((m) => m.on === on && m.side === side);
  // Clases escritas enteras para que Tailwind las encuentre.
  const room = (side: "top" | "bottom", classes: { all: string; desktop: string; mobile: string }) => {
    const m = has("mobile", side);
    const d = has("desktop", side);
    return m && d ? classes.all : d ? classes.desktop : m ? classes.mobile : undefined;
  };

  // Una vista solo de escritorio no se descarga en móvil: la imagen queda
  // diferida y, en el primer pantallazo, se precarga solo desde 1024 px.
  const loading = eager && !view.only ? "eager" : "lazy";
  const sizes = sizesFor(view);
  if (eager && view.only === "desktop") {
    const { props } = getImageProps({ src: view.shot.src, width: view.shot.width, height: view.shot.height, alt: "", sizes });
    preload(props.src, {
      as: "image",
      imageSrcSet: props.srcSet,
      imageSizes: props.sizes,
      fetchPriority: "high",
      media: "(min-width: 1024px)",
    });
  }

  return (
    <div
      className={cn(
        "plate-shot",
        onlyClass(view.only),
        room("top", { all: "mt-8", desktop: "lg:mt-8", mobile: "mt-8 lg:mt-0" }),
        room("bottom", { all: "mb-8", desktop: "lg:mb-8", mobile: "mb-8 lg:mb-0" }),
        className
      )}
      style={vars}
    >
      <div className={cn("plate-crop", cropClassName)}>
        <Image
          src={view.shot.src}
          width={view.shot.width}
          height={view.shot.height}
          alt={view.alt}
          sizes={sizes}
          loading={loading}
          fetchPriority={eager ? "high" : undefined}
        />
      </div>
      {markers.map((marker) => (
        <span
          key={`${marker.on}-${marker.n}`}
          aria-hidden
          data-marker={marker.n}
          data-side={marker.side}
          className={cn("plate-marker", marker.on === "desktop" ? "hidden lg:block" : marker.onTablet ? "lg:hidden" : "md:hidden")}
          style={{ "--x": marker.at[0], "--y": marker.at[1] } as CSSProperties}
        >
          <span className="plate-marker-num">
            <span>{marker.n}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

/** Leyenda numerada. En escritorio se reparte en columnas bajo la captura. */
export function PlateNotes({ notes, className }: { notes: PlateNote[]; className?: string }) {
  return (
    <ol className={cn("grid", className)}>
      {notes.map((note) => (
        <li
          key={note.n}
          data-note={note.n}
          className="flex gap-3.5 border-t border-line-2 py-4 pr-2 transition-shadow duration-200 ease-editorial"
        >
          <span aria-hidden className="plate-note-num">{note.n}</span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink">
              <span className="sr-only">Nota {note.n}. </span>
              {note.title}
            </p>
            <p className="mt-1 text-[14.5px] leading-[1.5] text-ink-soft">{note.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Enlace del cajetín: área táctil de 44 px sin descolocar la línea de texto. */
const blockLink = "-my-3.5 inline-flex items-center gap-1.5 py-3.5 transition-colors duration-300 ease-editorial hover:text-cobalt";

/**
 * Cajetín: los datos del proyecto como en el pie de un plano. Etiquetas en
 * mono, valores legibles. El enlace externo solo existe donde está autorizado.
 */
export function TitleBlock({
  entries,
  className,
  children,
  childrenLabel = "Ficha",
}: {
  entries: TitleEntry[];
  className?: string;
  /** Celda final opcional, por ejemplo el enlace a la ficha. */
  children?: React.ReactNode;
  /** Término de esa celda para lectores de pantalla. */
  childrenLabel?: string;
}) {
  return (
    <dl className={cn("grid gap-x-6", className)}>
      {entries.map((entry) => (
        <div key={entry.label} className={cn("min-w-0 border-t border-line-2 py-3", entry.wide && "col-span-full")}>
          <dt className="label-mono text-[10.5px] text-ink-mute">{entry.label}</dt>
          <dd className="mt-1.5 text-[14px] leading-snug text-ink">
            {entry.href?.startsWith("http") ? (
              <a href={entry.href} target="_blank" rel="noopener noreferrer" className={blockLink}>
                <span className="underline underline-offset-4">{entry.value}</span>
                <span aria-hidden>↗</span>
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
            ) : entry.href ? (
              <a href={entry.href} className={cn(blockLink, "underline underline-offset-4 [overflow-wrap:anywhere]")}>
                {entry.value}
              </a>
            ) : (
              entry.value
            )}
          </dd>
        </div>
      ))}
      {children && (
        <div className="min-w-0 border-t border-line-2 py-3">
          <dt className="sr-only">{childrenLabel}</dt>
          <dd>{children}</dd>
        </div>
      )}
    </dl>
  );
}
