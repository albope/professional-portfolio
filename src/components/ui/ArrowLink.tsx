import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnalyticsProperties } from "@/lib/analytics";

/**
 * Enlace con flecha: 15/600 en azul, 44 px de alto táctil. Al pasar el ratón
 * cambia de color, se subraya y la flecha se separa 4 px más (gap 8 → 12).
 * Nada se escala ni se desplaza.
 */
interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  /** «→» para navegar dentro del sitio, «↗» para abrir contacto o un externo. */
  arrow?: "→" | "↗" | "↓";
  external?: boolean;
  className?: string;
  trackEvent?: "cta_click" | "case_open";
  trackLocation?: string;
  trackNeed?: string;
  trackProject?: string;
  trackDestination?: AnalyticsProperties["destination"];
}

export function ArrowLink({
  href,
  children,
  arrow = "→",
  external,
  className,
  trackEvent,
  trackLocation,
  trackNeed,
  trackProject,
  trackDestination,
}: ArrowLinkProps) {
  const classes = cn(
    "group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cobalt underline-offset-4 transition-colors duration-300 ease-editorial hover:gap-3 hover:text-cobalt-deep hover:underline",
    className
  );
  const content = (
    <>
      {children}
      <span aria-hidden className="font-mono">{arrow}</span>
      {external && <span className="sr-only"> (se abre en otra pestaña)</span>}
    </>
  );
  const tracking = {
    "data-track": trackEvent,
    "data-track-location": trackLocation,
    "data-track-need": trackNeed,
    "data-track-project": trackProject,
    "data-track-destination": trackDestination,
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...tracking}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...tracking}>
      {content}
    </Link>
  );
}
