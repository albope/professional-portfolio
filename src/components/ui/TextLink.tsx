import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BaseLink } from "@/components/ui/BaseLink";
import type { TrackingProps } from "@/lib/tracking";

/** Fondo sobre el que va el enlace. */
export type TextLinkSurface = "light" | "dark";

const surfaces: Record<TextLinkSurface, string> = {
  light: "text-ink decoration-line-2 hover:text-cobalt hover:decoration-current",
  dark: "text-on-dark decoration-on-dark/40 hover:text-white hover:decoration-white focus-visible:outline-cobalt-bright",
};

/**
 * Clases del enlace de texto, para aplicarlas a otro elemento (el disparador
 * de `BookingLink`). `standalone` le da 40 px de alto táctil cuando el enlace
 * va suelto y no dentro de un párrafo.
 */
export function textLinkClasses({
  on = "light",
  standalone = false,
  className,
}: { on?: TextLinkSurface; standalone?: boolean; className?: string } = {}) {
  return cn(
    "underline decoration-1 underline-offset-4 transition-[color,text-decoration-color] duration-200",
    surfaces[on],
    standalone && "inline-flex min-h-10 items-center",
    className,
  );
}

interface TextLinkProps extends TrackingProps {
  href: string;
  children: ReactNode;
  on?: TextLinkSurface;
  /** Enlace suelto (no dentro de un párrafo): 40 px de alto táctil. */
  standalone?: boolean;
  external?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/**
 * Enlace de texto subrayado (4.9): subrayado fino `line-2` que pasa a
 * `currentColor` y texto que pasa a cobalto. Sobre la banda de tinta
 * (`on="dark"`) el subrayado es `on-dark` al 40 % y el hover, blanco.
 *
 * ```tsx
 * <TextLink href="#padel" standalone className="text-small">{item.caso}</TextLink>
 * <TextLink href="/privacidad">{enlace}</TextLink>
 * <TextLink href={proyectoDestacado.web} external standalone>padelclubos.com</TextLink>
 * ```
 */
export function TextLink({
  href,
  children,
  on = "light",
  standalone,
  external,
  className,
  onClick,
  ...tracking
}: TextLinkProps) {
  return (
    <BaseLink
      href={href}
      external={external}
      onClick={onClick}
      className={textLinkClasses({ on, standalone, className })}
      {...tracking}
    >
      {children}
    </BaseLink>
  );
}
