"use client";

import { usePathname } from "next/navigation";
import type { MouseEventHandler, ReactNode } from "react";
import { BaseLink } from "@/components/ui/BaseLink";
import type { TrackingProps } from "@/lib/tracking";
import type { SectionId } from "@/data/site";

interface SectionLinkProps extends TrackingProps {
  /** Ancla de la portada: `que-hacemos`, `proyectos`, `contacto`, `top`... */
  id: SectionId;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
  /**
   * Prefijo de ruta en el que este enlace es la sección actual: la cabecera
   * marca «Proyectos» con `aria-current` dentro de `/proyectos/...`. Es
   * `"true"` y no `"page"`: el enlace lleva a `/#proyectos`, que no es la
   * página en la que está el visitante.
   */
  currentWhen?: string;
}

/**
 * Enlace a una sección de la portada desde piezas compartidas (cabecera,
 * pie). En la portada es un ancla nativa (`#id`): el navegador hace el salto
 * suave y la URL conserva `?necesidad=` si el visitante llegó desde un
 * servicio. Desde las fichas y las páginas legales es `/#id` con `next/link`.
 * Dentro de una sección de la portada basta con `href="#id"` en `Button`,
 * `ArrowLink` o `TextLink`.
 */
export function SectionLink({ id, children, currentWhen, ...rest }: SectionLinkProps) {
  const pathname = usePathname();
  const current = currentWhen && pathname.startsWith(currentWhen) ? "true" : undefined;
  return (
    <BaseLink href={pathname === "/" ? `#${id}` : `/#${id}`} aria-current={current} {...rest}>
      {children}
    </BaseLink>
  );
}
