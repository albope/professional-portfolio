import { copyEs } from "@/data/copy";
import type { ButtonSize } from "@/components/ui/Button";
import type { AnalyticsLocation } from "@/lib/analytics";
import {
  BookingDialogLink,
  type BookingSurface,
  type BookingVariant,
} from "@/components/booking/BookingDialogLink";

interface BookingLinkProps {
  /** Dónde está, para la medición (`cta_click` con destino `booking`). */
  location: AnalyticsLocation;
  /** Ficha desde la que se reserva (`data-track-project`). */
  project?: string;
  /**
   * - `link`: enlace de texto subrayado, «o reserva una llamada de 30 min»
   *   bajo el botón del hero (`on="light"`) y en la banda de tinta
   *   (`on="dark"`).
   * - `ghost`: botón fantasma con flecha, «Reservar una llamada» en la tarjeta
   *   lateral de Contacto. Admite `size`.
   * - `arrow`: enlace con flecha, «Reservar una llamada de 30 min» en Quiénes
   *   somos.
   */
  variant: BookingVariant;
  /** Fondo sobre el que va: cambia colores y anillo de foco. Por defecto `light`. */
  on?: BookingSurface;
  /** Tamaño del botón fantasma. */
  size?: ButtonSize;
  /** Rótulo desde el copy. Por defecto `copy.reserva.enlace`. */
  label?: string;
  className?: string;
}

/**
 * Reserva de la primera llamada con Cal.com (componente de servidor). Pone
 * los textos del copy y delega en `BookingDialogLink`, que conserva toda la
 * lógica: enlace normal que funciona sin JS, diálogo modal con la agenda
 * cargada solo al abrirlo, estados de carga lenta o fallida, foco devuelto
 * al cerrar y medición.
 *
 * ```tsx
 * <BookingLink location="hero" variant="link" label={copyEs.hero.reserva} />
 * <BookingLink location="method" variant="link" on="dark" label={copyEs.metodo.cierre.reserva} />
 * <BookingLink location="contact" variant="ghost" label={copyEs.contacto.lateral.llamada.boton} />
 * <BookingLink location="about" variant="arrow" label={copyEs.sobre.reserva} />
 * ```
 */
export function BookingLink({
  location,
  project,
  variant,
  on = "light",
  size,
  label = copyEs.reserva.enlace,
  className,
}: BookingLinkProps) {
  return (
    <BookingDialogLink
      location={location}
      project={project}
      variant={variant}
      on={on}
      size={size}
      label={label}
      texts={copyEs.reserva.dialogo}
      className={className}
    />
  );
}
