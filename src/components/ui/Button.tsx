import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { BaseLink } from "@/components/ui/BaseLink";
import { trackingAttributes, type TrackingProps } from "@/lib/tracking";

/**
 * Variantes de la especificación 5.1:
 * - `primary`: cobalto con texto blanco, hover `cobalt-600`. La acción
 *   principal («Hacer una consulta», «Enviar consulta»).
 * - `ghost`: transparente con borde `line-2`, hover borde `ink`. Sobre oscuro
 *   (`on="dark"`) el borde y el texto pasan a claro.
 * - `light`: fondo `on-dark` y texto `ink` sobre la banda de tinta, hover
 *   blanco.
 */
export type ButtonVariant = "primary" | "ghost" | "light";
/** Alturas: 40, 48 y 56 px, con 16, 20 y 26 px de relleno lateral. */
export type ButtonSize = "sm" | "md" | "lg";
/** Fondo sobre el que va el botón: decide el anillo de foco y el fantasma. */
export type ButtonSurface = "light" | "dark";

const base =
  "group/btn inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-control border border-transparent text-center transition-[background-color,border-color,color,transform] duration-200 ease-soft active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-button-sm",
  md: "min-h-12 px-5 text-button",
  lg: "min-h-14 px-[26px] text-button-lg",
};

const variants: Record<ButtonVariant, Record<ButtonSurface, string>> = {
  primary: {
    light: "bg-cobalt text-white hover:bg-cobalt-600",
    dark: "bg-cobalt text-white hover:bg-cobalt-600",
  },
  ghost: {
    light: "border-line-2 bg-transparent text-ink hover:border-ink",
    dark: "border-on-dark-3 bg-transparent text-on-dark hover:border-on-dark",
  },
  light: {
    light: "bg-on-dark text-ink hover:bg-white",
    dark: "bg-on-dark text-ink hover:bg-white",
  },
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Por defecto `light`. El botón `light` va siempre sobre la banda de tinta. */
  on?: ButtonSurface;
  className?: string;
}

/**
 * Clases de botón para cualquier elemento: úsalas cuando el botón tenga que
 * ser otro componente (un `SectionLink`, el disparador de `BookingLink`...).
 * Sobre oscuro el anillo de foco pasa a `cobalt-bright`.
 */
export function buttonClasses({ variant = "primary", size = "md", on, className }: ButtonStyleOptions = {}) {
  const surface: ButtonSurface = on ?? (variant === "light" ? "dark" : "light");
  return cn(
    base,
    sizes[size],
    variants[variant][surface],
    surface === "dark" && "focus-visible:outline-cobalt-bright",
    className,
  );
}

/** Flecha de los botones: avanza 3 px al pasar el ratón (0,25 s). */
export function ButtonArrow() {
  return (
    <ArrowIcon className="transition-transform duration-[250ms] ease-soft group-hover/btn:translate-x-[3px]" />
  );
}

interface ButtonProps extends ButtonStyleOptions, TrackingProps {
  /** Con `href` es un enlace (ver `BaseLink`); sin él, un `<button>`. */
  href?: string;
  /** Abre en otra pestaña y lo anuncia a los lectores de pantalla. */
  external?: boolean;
  /** Flecha al final que avanza 3 px en hover. */
  arrow?: boolean;
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/**
 * Botón de la web (especificación 5.1): radio 9, peso 600, sin sombras, sin
 * partir línea (el grande del hero la parte por debajo de 400 px con
 * `className`), `:active` baja 1 px y el fondo cambia en 0,2 s.
 *
 * ```tsx
 * <Button href="#contacto" size="lg" arrow trackLocation="hero">
 *   {copyEs.hero.cta}
 * </Button>
 * <Button href={contactHref({ need: "diagnostico" })} variant="ghost" arrow trackLocation="service" trackNeed="diagnostico">…</Button>
 * <Button href="#contacto" variant="light" arrow trackLocation="method">…</Button>
 * <Button type="submit" size="lg" arrow disabled={sending}>…</Button>
 * ```
 *
 * Con `trackLocation` mide `cta_click` con destino `contact` salvo que se
 * indique otro `trackDestination`.
 */
export function Button({
  href,
  external,
  arrow,
  children,
  type = "button",
  onClick,
  disabled,
  trackEvent,
  trackLocation,
  trackDestination,
  trackNeed,
  trackProject,
  variant,
  size,
  on,
  className,
  ...aria
}: ButtonProps) {
  const classes = buttonClasses({ variant, size, on, className });
  const tracking: TrackingProps = {
    trackEvent,
    trackLocation,
    trackDestination: trackLocation ? (trackDestination ?? "contact") : trackDestination,
    trackNeed,
    trackProject,
  };
  const content = (
    <>
      {children}
      {arrow && <ButtonArrow />}
    </>
  );

  if (href) {
    return (
      <BaseLink href={href} external={external} className={classes} onClick={onClick} {...tracking} {...aria}>
        {content}
      </BaseLink>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...trackingAttributes(tracking)}
      {...aria}
    >
      {content}
    </button>
  );
}
