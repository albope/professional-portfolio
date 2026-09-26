import { copyEs } from "@/data/copy";
import { nav } from "@/data/site";
import { booking } from "@/data/booking";
import { Wordmark } from "@/components/ui/Wordmark";
import { SectionLink } from "@/components/ui/SectionLink";
import { Button, buttonClasses } from "@/components/ui/Button";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { MobileMenu } from "@/components/layout/MobileMenu";

const { cabecera } = copyEs;

/** 15 px `ink-2`, subrayado que crece desde la izquierda. 40 px de alto táctil. */
const navLink =
  "relative inline-flex min-h-10 items-center text-small text-ink-2 transition-colors duration-200 hover:text-ink after:absolute after:inset-x-0 after:bottom-[3px] after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-soft hover:after:scale-x-100 aria-[current=page]:text-ink aria-[current=page]:after:scale-x-100";

/** 18 px, peso 500, filete entre enlaces. */
const menuLink =
  "flex min-h-[52px] items-center border-b border-line text-[1.125rem] font-medium text-ink transition-colors duration-200 hover:text-cobalt";

/**
 * Cabecera compartida por todas las páginas (especificación 3.1). Es de
 * servidor: el copy no viaja al navegador. Las piezas con estado son islas
 * cliente pequeñas: `HeaderShell` (filete al hacer scroll), `MobileMenu`
 * (`<details>` con Escape y clic fuera) y `SectionLink` (ancla nativa en la
 * portada, `/#id` desde las fichas).
 *
 * - Logo: enlace a `#top`, 16 px por debajo de 480 y 19 px desde ahí.
 * - Navegación desde 1180 px. «Proyectos» se marca como actual dentro de
 *   `/proyectos/...`.
 * - «Hacer una consulta» siempre visible, «Consulta» por debajo de 400 px.
 * - Menú por debajo de 1180 px con los cinco enlaces y la reserva de llamada.
 */
export function Header() {
  return (
    <HeaderShell>
      {/* Por debajo de 360 px se estrechan el hueco y el botón para que la
          fila quepa entera hasta en 310 px. */}
      <div className="wrap flex h-header items-center justify-between gap-5 max-[359px]:gap-3">
        <SectionLink id="top" aria-label={cabecera.logo_aria} className="inline-flex min-h-11 flex-none items-center">
          <Wordmark size={16} className="480:hidden" />
          <Wordmark size={19} className="hidden 480:inline-flex" />
        </SectionLink>

        <nav aria-label={cabecera.nav_aria} className="ml-auto mr-2 hidden items-center gap-[30px] 1180:flex">
          {nav.map((item) => (
            <SectionLink
              key={item.id}
              id={item.id}
              className={navLink}
              currentWhen={item.id === "proyectos" ? "/proyectos" : undefined}
            >
              {item.label}
            </SectionLink>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-2">
          <SectionLink
            id="contacto"
            className={buttonClasses({ size: "sm", className: "max-[359px]:px-3" })}
            trackLocation="header"
            trackDestination="contact"
          >
            <span className="max-[399px]:hidden">{cabecera.cta}</span>
            <span className="400:hidden">{cabecera.cta_corto}</span>
          </SectionLink>

          <MobileMenu label={cabecera.menu_abrir} className="1180:hidden">
            <nav aria-label={cabecera.menu_aria}>
              {nav.map((item) => (
                <SectionLink key={item.id} id={item.id} className={menuLink}>
                  {item.label}
                </SectionLink>
              ))}
            </nav>
            <Button
              href={booking.url}
              external
              variant="ghost"
              className="mt-[18px] w-full"
              trackLocation="header"
              trackDestination="booking"
            >
              {cabecera.menu_reserva}
            </Button>
          </MobileMenu>
        </div>
      </div>
    </HeaderShell>
  );
}
