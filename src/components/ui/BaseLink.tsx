import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackingAttributes, type TrackingProps } from "@/lib/tracking";

export type { TrackingProps } from "@/lib/tracking";
export { trackingAttributes } from "@/lib/tracking";

/**
 * `id` del aviso «(se abre en otra pestaña)». El layout lo pinta una sola vez
 * (`NewTabNote`) y cada enlace externo lo referencia con `aria-describedby`.
 * Así estas primitivas no importan `copy.json` y se pueden usar en
 * componentes cliente sin meter el copy entero en el JS del navegador.
 */
export const NEW_TAB_NOTE_ID = "aviso-nueva-pestana";

export interface BaseLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel">,
    TrackingProps {
  href: string;
  /** Abre en otra pestaña con `rel="noopener noreferrer"` y lo anuncia. */
  external?: boolean;
  children: ReactNode;
}

/**
 * Elige el elemento correcto para cada destino, para que ningún componente
 * tenga que pensarlo:
 * - externo → `<a target="_blank">` descrito por el aviso de nueva pestaña,
 * - ancla de la misma página (`#contacto`), `mailto:` o `tel:` → `<a>` nativo:
 *   el salto lo hace el navegador (suave por CSS) y no pierde `?necesidad=`,
 * - el resto (`/proyectos/...`, `/?necesidad=web#contacto`) → `next/link`.
 *
 * Es la base de `Button`, `ArrowLink`, `TextLink` y `SectionLink`. Sirve en
 * servidor y en cliente.
 */
export function BaseLink({
  href,
  external,
  children,
  trackEvent,
  trackLocation,
  trackDestination,
  trackNeed,
  trackProject,
  ...rest
}: BaseLinkProps) {
  const tracking = trackingAttributes({ trackEvent, trackLocation, trackDestination, trackNeed, trackProject });

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...tracking}
        {...rest}
        aria-describedby={[rest["aria-describedby"], NEW_TAB_NOTE_ID].filter(Boolean).join(" ")}
      >
        {children}
      </a>
    );
  }

  if (/^(#|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} {...tracking} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...tracking} {...rest}>
      {children}
    </Link>
  );
}
