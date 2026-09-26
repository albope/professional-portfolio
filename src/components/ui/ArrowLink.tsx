import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowIcon, type ArrowDirection } from "@/components/ui/ArrowIcon";
import { BaseLink } from "@/components/ui/BaseLink";
import type { TrackingProps } from "@/lib/tracking";

/**
 * Color del enlace con flecha:
 * - `ink` (por defecto): tinta y cobalto al pasar el ratón («Ver el caso»).
 * - `cobalt`: los enlaces de consulta («Consultar sobre gestión»), hover
 *   `cobalt-600`.
 * - `on-dark`: sobre la banda de tinta, hover blanco.
 */
export type ArrowLinkTone = "ink" | "cobalt" | "on-dark";

const tones: Record<ArrowLinkTone, string> = {
  ink: "text-ink hover:text-cobalt",
  cobalt: "text-cobalt hover:text-cobalt-600",
  "on-dark": "text-on-dark hover:text-white focus-visible:outline-cobalt-bright",
};

/** Las flechas del copy antiguo (`partirFlecha`) siguen valiendo como dirección. */
const directions: Record<"→" | "↗" | "↓", ArrowDirection> = { "→": "right", "↗": "up-right", "↓": "down" };

const hoverShift: Record<ArrowDirection, string> = {
  right: "group-hover/arrow:translate-x-[3px]",
  "up-right": "group-hover/arrow:translate-x-[2px] group-hover/arrow:-translate-y-[2px]",
  down: "group-hover/arrow:translate-y-[3px]",
};

/**
 * Clases del enlace con flecha, para aplicarlas a otro elemento (el
 * disparador de `BookingLink`). El texto va en un `<span>` con
 * `arrowLinkLabelClasses` para que el subrayado crezca solo bajo él.
 */
export function arrowLinkClasses({ tone = "ink", className }: { tone?: ArrowLinkTone; className?: string } = {}) {
  return cn(
    "group/arrow inline-flex min-h-10 items-center gap-2 font-semibold transition-colors duration-200 ease-soft",
    tones[tone],
    className,
  );
}

/** Subrayado de 1 px que crece de 0 a 100 % en 0,3 s. */
export const arrowLinkLabelClasses =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-300 ease-soft group-hover/arrow:bg-[length:100%_1px] group-focus-visible/arrow:bg-[length:100%_1px]";

/** Flecha de 15 px que avanza 3 px en hover (0,25 s). */
export function ArrowLinkIcon({ direction = "right" }: { direction?: ArrowDirection }) {
  return (
    <ArrowIcon
      direction={direction}
      className={cn("h-[15px] w-[15px] transition-transform duration-[250ms] ease-soft", hoverShift[direction])}
    />
  );
}

interface ArrowLinkProps extends TrackingProps {
  href: string;
  children: ReactNode;
  tone?: ArrowLinkTone;
  /** Dirección de la flecha. «→» navega, «↗» sale del sitio, «↓» baja. */
  arrow?: "→" | "↗" | "↓";
  external?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/**
 * Enlace con flecha (4.9): peso 600, subrayado que crece de izquierda a
 * derecha y flecha que avanza 3 px. 40 px de alto táctil. El tamaño de letra
 * lo hereda: añade `text-small` donde la especificación pide 15 px.
 *
 * ```tsx
 * <ArrowLink href={contactHref({ need: "operativa" })} tone="cobalt" className="text-small"
 *   trackLocation="service" trackNeed="operativa">{item.consulta}</ArrowLink>
 * <ArrowLink href="/proyectos/wms-almacen" trackEvent="case_open" trackLocation="projects"
 *   trackProject="wms-almacen">{tarjeta.caso}</ArrowLink>
 * ```
 */
export function ArrowLink({
  href,
  children,
  tone = "ink",
  arrow = "→",
  external,
  className,
  onClick,
  ...tracking
}: ArrowLinkProps) {
  return (
    <BaseLink
      href={href}
      external={external}
      onClick={onClick}
      className={arrowLinkClasses({ tone, className })}
      {...tracking}
    >
      <span className={arrowLinkLabelClasses}>{children}</span>
      <ArrowLinkIcon direction={directions[arrow]} />
    </BaseLink>
  );
}
