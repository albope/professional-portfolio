import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProjectFigure as Figure, SceneTone } from "@/data/projects";

/** El escenario toma el color del propio producto, nunca la paleta BPM. */
const scene: Record<SceneTone, string> = {
  padel: "bg-escena-padel",
  wms: "bg-escena-wms",
  evento: "bg-escena-evento border border-shot",
  radio: "bg-escena-radio",
  parrilla: "bg-escena-parrilla border-y border-escena-parrilla-borde lg:border",
  papel: "bg-paper-2",
};

const legendTone: Record<SceneTone, string> = {
  padel: "text-escena-padel-texto",
  wms: "text-escena-wms-texto",
  evento: "text-escena-evento-texto",
  radio: "text-escena-radio-texto",
  parrilla: "text-ink-mute",
  papel: "text-ink-mute",
};

/** Solo las capturas de evento y radio llevan sombra; el resto, borde de 1 px. */
const shotTone: Record<SceneTone, string> = {
  padel: "border border-escena-padel-borde/55",
  wms: "border border-escena-wms-borde",
  evento:
    "border border-escena-evento-texto/20 shadow-[0_10px_28px_rgba(88,3,1,0.18)] lg:shadow-[0_16px_40px_rgba(88,3,1,0.18)]",
  radio: "shadow-[0_10px_28px_rgba(0,0,0,0.3)] lg:shadow-[0_16px_40px_rgba(0,0,0,0.3)]",
  parrilla: "",
  papel: "border border-shot",
};

const darkScenes: SceneTone[] = ["padel", "wms", "radio"];

const legendClass =
  "absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.12em] lg:left-7 lg:top-6 lg:text-xs lg:tracking-[0.1em]";

/**
 * Captura dentro de su escenario. `principal` abre la ficha a sangre; los
 * detalles se reparten debajo. Las posiciones van en porcentaje del escenario
 * para que ninguna imagen sobresalga al reducir el ancho.
 */
export function ProjectFigure({
  figure,
  size = "detalle",
  className,
}: {
  figure: Figure;
  size?: "principal" | "detalle";
  className?: string;
}) {
  const principal = size === "principal";
  const dark = darkScenes.includes(figure.scene);

  return (
    <figure className={cn("m-0", className)}>
      <div
        data-tono={dark ? "oscuro" : undefined}
        className={cn(
          "relative overflow-hidden",
          scene[figure.scene],
          principal ? "h-[300px] lg:h-[640px]" : "h-[260px] lg:h-[520px]",
          figure.variant === "movil" && "h-[380px] lg:h-[520px]"
        )}
      >
        <p className={cn(legendClass, legendTone[figure.scene])}>{figure.legend}</p>
        {figure.legendRight && (
          <p
            className={cn(
              legendClass,
              legendTone[figure.scene],
              "hidden lg:left-auto lg:right-7 lg:block"
            )}
          >
            {figure.legendRight}
          </p>
        )}

        {figure.variant === "ancha" && (
          <Image
            {...figure.shot}
            alt={figure.shot.alt}
            sizes={principal ? "(min-width: 1440px) 1080px, 92vw" : "(min-width: 900px) 46vw, 92vw"}
            className={cn(
              shotTone[figure.scene],
              "absolute right-0 top-12 h-auto w-[74%] border-r-0",
              "lg:left-[9.09%] lg:right-auto lg:top-[11.25%] lg:w-[81.8%] lg:border-r"
            )}
          />
        )}

        {figure.variant === "movil" && (
          <Image
            {...figure.shot}
            alt={figure.shot.alt}
            sizes="(min-width: 1440px) 228px, 220px"
            className={cn(
              shotTone[figure.scene],
              "absolute left-1/2 top-7 h-auto w-[46%] max-w-[200px] -translate-x-1/2",
              "lg:top-10 lg:w-[42.5%] lg:max-w-[228px]"
            )}
          />
        )}

        {/* Detalle ampliado: la captura desborda el escenario a propósito. */}
        {figure.variant === "recorte" && (
          <Image
            {...figure.shot}
            alt={figure.shot.alt}
            sizes="(min-width: 900px) 1120px, 185vw"
            className="absolute left-[-38.5%] top-[-11.5%] h-auto w-[185%] max-w-none lg:left-[-5.26%] lg:top-[-10.8%] lg:w-[147%]"
          />
        )}
      </div>

      <figcaption className="mt-3 px-4 text-[13px] leading-[1.55] text-ink-mute md:px-0 lg:mt-3.5 lg:max-w-[600px] lg:text-sm">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink lg:text-[11px]">
          {figure.captionLabel} ·{" "}
        </span>
        {figure.caption}
      </figcaption>
    </figure>
  );
}
