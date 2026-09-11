import Link from "next/link";
import { nav, ctaHref, site } from "@/data/site";
import { booking } from "@/data/booking";
import { Wordmark } from "@/components/ui/Wordmark";

const legalLinks = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Privacidad", href: "/privacidad" },
];

const columnTitle =
  "mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute";
const columnLink =
  "inline-flex min-h-9 items-center text-sm text-ink transition-colors duration-300 ease-editorial hover:text-cobalt";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-editorial pb-5 pt-9 md:pb-7 md:pt-12">
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-3 wide:grid-cols-[424px_1fr_1fr_1fr]">
          <div className="md:col-span-3 wide:col-span-1">
            <Link href="/" aria-label="BPM Tech, inicio" className="inline-flex min-h-11 items-center">
              <Wordmark size={16} className="wide:hidden" />
              <Wordmark size={17} className="hidden wide:inline-flex" />
            </Link>
            <p className="mt-2 max-w-[330px] text-[13px] leading-[1.55] text-ink-mute md:text-sm">
              Software y webs que encajan en tu negocio. Gestión, automatización
              y desarrollo web a medida.
            </p>
          </div>

          {/* Móvil: un único índice de dos columnas, sin títulos ni repetir el contacto. */}
          <nav aria-label="Pie" className="mt-3 grid grid-cols-2 gap-x-4 md:hidden">
            {[...nav, ...legalLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Índice" className="hidden min-w-0 flex-col md:flex">
            <span className={columnTitle}>Índice</span>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={columnLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Contacto" className="hidden min-w-0 flex-col md:flex">
            <span className={columnTitle}>Contacto</span>
            <Link
              href={ctaHref}
              data-track="cta_click"
              data-track-location="footer"
              className={columnLink}
            >
              Hablemos
            </Link>
            <a href={`mailto:${site.email}`} className={`${columnLink} underline underline-offset-4`}>
              <span className="[overflow-wrap:anywhere]">{site.email}</span>
            </a>
            <a
              href={booking.url}
              target="_blank"
              rel="noopener noreferrer"
              data-track="cta_click"
              data-track-location="footer"
              data-track-destination="booking"
              className={columnLink}
            >
              Reservar una llamada <span aria-hidden>↗</span>
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </nav>

          <nav aria-label="Legal" className="hidden min-w-0 flex-col md:flex">
            <span className={columnTitle}>Legal</span>
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className={columnLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4 font-mono text-[11px] text-ink-mute md:mt-10 md:pt-5 md:text-xs">
          <span className="md:hidden">© {new Date().getFullYear()} BPM Tech · Valencia</span>
          <span className="hidden md:inline">© {new Date().getFullYear()} BPM Tech</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">{site.location}</span>
            <a
              href="#top"
              aria-label="Volver arriba"
              className="flex h-11 w-11 items-center justify-center border border-line text-base text-ink transition-colors duration-300 ease-editorial hover:border-ink"
            >
              <span aria-hidden>↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
