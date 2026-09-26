import { copyEs, rellenar } from "@/data/copy";
import { legalLinks, nav, site } from "@/data/site";
import { booking } from "@/data/booking";
import { Wordmark } from "@/components/ui/Wordmark";
import { BaseLink } from "@/components/ui/BaseLink";
import { SectionLink } from "@/components/ui/SectionLink";
import { buttonClasses } from "@/components/ui/Button";

const { pie } = copyEs;

/**
 * Títulos de columna: `h2` de 14 px peso 600, para no colgar del H2 de
 * Contacto. El margen es corto porque cada enlace ya trae 40 px de alto.
 */
const columnTitle = "mb-1.5 text-caption font-semibold text-on-dark";
/** 15 px `on-dark-2` con 40 px de alto táctil. El email puede partirse. */
const columnLink =
  "inline-flex min-h-10 items-center text-small text-on-dark-2 underline-offset-4 transition-colors duration-200 [overflow-wrap:anywhere] hover:text-white hover:underline";

/**
 * Pie compartido (especificación 3.9), sobre tinta. Rejilla: una columna en
 * móvil, desde 700 px la marca a todo el ancho y tres columnas debajo, y
 * desde 1180 px cuatro columnas `4fr 2fr 3fr 2fr`. Todas con `minmax(0, …)`
 * para que el email no invada la columna vecina. El año se calcula al
 * generar la página, así el pie no envejece solo.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-surface="dark" className="bg-dark pb-8 pt-[72px] text-on-dark">
      <div className="wrap">
        <div className="grid gap-10 700:grid-cols-3 700:gap-x-8 1180:grid-cols-[minmax(0,4fr)_minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)] 1180:gap-x-10">
          <div className="grid max-w-[24em] content-start justify-items-start gap-[18px] 700:col-span-3 1180:col-span-1">
            {/* Margen negativo: 40 px de alto táctil sin bajar el logo respecto
                a los títulos de columna. */}
            <SectionLink id="top" aria-label={copyEs.cabecera.logo_aria} className="-my-2.5 inline-flex min-h-10 items-center">
              <Wordmark on="dark" />
            </SectionLink>
            <p className="text-small text-on-dark-2">{pie.descripcion}</p>
            <SectionLink
              id="contacto"
              className={buttonClasses({ size: "sm", on: "dark", className: "mt-1.5" })}
              trackLocation="footer"
              trackDestination="contact"
            >
              {pie.cta}
            </SectionLink>
          </div>

          <nav aria-labelledby="pie-web" className="min-w-0">
            <h2 id="pie-web" className={columnTitle}>{pie.columnas.web}</h2>
            <ul className="grid">
              {nav.map((item) => (
                <li key={item.id}>
                  <SectionLink id={item.id} className={columnLink}>
                    {item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <h2 className={columnTitle}>{pie.columnas.contacto}</h2>
            <ul className="grid">
              <li>
                <a href={`mailto:${site.email}`} className={columnLink}>
                  {site.email}
                </a>
              </li>
              <li>
                <BaseLink
                  href={booking.url}
                  external
                  className={columnLink}
                  trackLocation="footer"
                  trackDestination="booking"
                >
                  {pie.reserva}
                </BaseLink>
              </li>
              <li className="flex min-h-10 items-center text-small text-on-dark-2">{pie.ubicacion}</li>
            </ul>
          </div>

          <nav aria-labelledby="pie-legal" className="min-w-0">
            <h2 id="pie-legal" className={columnTitle}>{pie.columnas.legal}</h2>
            <ul className="grid">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <BaseLink href={link.href} className={columnLink}>
                    {link.label}
                  </BaseLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-wrap justify-between gap-x-6 gap-y-2.5 border-t border-[#2a2a30] pt-[22px] text-micro text-on-dark-3">
          <p>{rellenar(pie.copyright, { anio: year })}</p>
          <p>{pie.ubicacion}</p>
        </div>
      </div>
    </footer>
  );
}
