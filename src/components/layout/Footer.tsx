import Link from "next/link";
import { nav, ctaHref, site } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";

const columns = [
  { label: "Índice", links: nav },
  { label: "Contacto", links: [{ label: "Hablemos", href: ctaHref }] },
  {
    label: "Legal",
    links: [
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Privacidad", href: "/privacidad" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-editorial flex flex-col gap-10 pb-7 pt-12">
        <div className="flex flex-col justify-between gap-9 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex max-w-[330px] flex-col gap-3">
            <Link href="/" aria-label="BPMTECH, inicio" className="inline-flex min-h-11 items-center self-start">
              <Wordmark size={17} />
            </Link>
            <p className="text-sm leading-relaxed text-ink-mute">
              Software y webs que encajan en tu negocio. Gestión, automatización
              y desarrollo web a medida.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3 lg:gap-x-12">
            {columns.map((column) => (
              <nav key={column.label} aria-label={column.label} className="flex flex-col">
                <span className="label-mono mb-2 text-ink-mute">{column.label}</span>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    data-track={link.href === ctaHref ? "cta_click" : undefined}
                    data-track-location={link.href === ctaHref ? "footer" : undefined}
                    className="inline-flex min-h-11 items-center text-sm text-ink transition-colors hover:text-cobalt"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
          <span className="font-mono text-xs text-ink-mute">
            © {new Date().getFullYear()} BPM Tech
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-ink-mute">{site.location}</span>
            <a
              href="#top"
              aria-label="Volver arriba"
              className="group flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
            >
              <span aria-hidden className="font-mono text-base transition-transform group-hover:-translate-y-0.5 motion-reduce:transform-none">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
