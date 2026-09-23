import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { PlateNote, PlateView, Rect, TitleEntry } from "@/data/plates";

const inside = (rect: Rect, [x, y]: [number, number]) =>
  x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;

/**
 * Captura recortada con sus marcadores. El recorte cambia a 1024 px y cada
 * marcador que quede fuera del recorte de una anchura se oculta en ella.
 * Los marcadores son decorativos: la lista de notas lleva la información.
 */
export function PlateShot({
  view,
  notes,
  eager,
  className,
  cropClassName,
}: {
  view: PlateView;
  notes: PlateNote[];
  /** Solo la captura del primer pantallazo: carga prioritaria. */
  eager?: boolean;
  className?: string;
  cropClassName?: string;
}) {
  const mobile = view.mobile ?? view.desktop;
  const { desktop } = view;
  const vars = {
    "--iw": view.shot.width,
    "--m-cx": mobile.x,
    "--m-cy": mobile.y,
    "--m-cw": mobile.w,
    "--m-ch": mobile.h,
    "--d-cx": desktop.x,
    "--d-cy": desktop.y,
    "--d-cw": desktop.w,
    "--d-ch": desktop.h,
  } as CSSProperties;

  return (
    <div className={cn("plate-shot", className)} style={vars}>
      <div className={cn("plate-crop", cropClassName)}>
        <Image
          src={view.shot.src}
          width={view.shot.width}
          height={view.shot.height}
          alt={view.shot.alt}
          sizes={view.sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
        />
      </div>
      {notes.map((note) => {
        const onMobile = inside(mobile, note.at);
        const onDesktop = inside(desktop, note.at);
        return (
          <span
            key={note.n}
            aria-hidden
            data-marker={note.n}
            className={cn(
              "plate-marker",
              !onMobile && "hidden lg:grid",
              !onDesktop && "lg:hidden"
            )}
            style={{ "--x": note.at[0], "--y": note.at[1] } as CSSProperties}
          >
            {note.n}
          </span>
        );
      })}
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

/**
 * Cajetín: los datos del proyecto como en el pie de un plano. Etiquetas en
 * mono, valores legibles. El enlace externo solo existe donde está autorizado.
 */
export function TitleBlock({
  entries,
  tone = "paper",
  className,
}: {
  entries: TitleEntry[];
  tone?: "paper" | "ink";
  className?: string;
}) {
  const dark = tone === "ink";
  return (
    <dl className={cn("grid", className)}>
      {entries.map((entry) => (
        <div
          key={entry.label}
          className={cn("min-w-0 border-t py-3", dark ? "border-paper/28" : "border-line-2")}
        >
          <dt className={cn("label-mono text-[10.5px]", dark ? "text-paper/72" : "text-ink-mute")}>
            {entry.label}
          </dt>
          <dd className={cn("mt-1.5 text-[14px] leading-snug [overflow-wrap:anywhere]", dark ? "text-paper" : "text-ink")}>
            {entry.href?.startsWith("http") ? (
              <a
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 underline underline-offset-4 transition-colors duration-300 ease-editorial hover:text-cobalt lg:min-h-0"
              >
                {entry.value} <span aria-hidden>↗</span>
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
            ) : entry.href ? (
              <a
                href={entry.href}
                className="inline-flex min-h-11 items-center underline underline-offset-4 transition-colors duration-300 ease-editorial hover:text-cobalt lg:min-h-0"
              >
                {entry.value}
              </a>
            ) : (
              entry.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
