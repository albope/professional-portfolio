import type { ReactNode } from "react";
import type { InViewMode } from "@/lib/useInView";
import { PlayOnView } from "@/components/ui/PlayOnView";
import { cn } from "@/lib/utils";

interface ArtStageProps {
  /** El SVG, pintado en el servidor: su marcado no viaja en el JS del cliente. */
  children: ReactNode;
  /**
   * - `once`: la agenda y la web. Se reproducen una vez, al entrar al 35 %.
   * - `each`: la conexión de datos. Una pasada de 4,5 s cada vez que entra al
   *   50 %.
   */
  mode?: InViewMode;
  className?: string;
}

/**
 * Escenario arena 3:2 de cada servicio (especificación 3.3). La reproducción
 * de su ilustración (4.4 a 4.6) la lleva `PlayOnView`, que escribe
 * `data-state` en este mismo nodo: de ahí cuelgan las reglas del CSS Module
 * de cada dibujo.
 */
export function ArtStage({ children, mode = "once", className }: ArtStageProps) {
  return (
    <PlayOnView
      mode={mode}
      threshold={mode === "each" ? 0.5 : 0.35}
      className={cn("grid aspect-[3/2] place-items-center overflow-hidden rounded-card bg-sand", className)}
    >
      {children}
    </PlayOnView>
  );
}
