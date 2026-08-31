import Link from "next/link";
import { nav, ctaHref, site } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";

const columns = [
  {
    label: "Índice",
    links: nav.map((item) => ({ ...item, external: false })),
  },
  {
    label: "Contacto",
    links: [{ label: "Formulario", href: ctaHref, external: false }],
  },
  {
    label: "Legal",
    links: [
      { label: "Aviso legal", href: "/aviso-legal", external: false },
      { label: "Privacidad", href: "/privacidad", external: false },
    ],
  },
];

/** Pie web (opción 1b del handoff): papel, marca + tres columnas + masthead. */
export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-editorial flex flex-col gap-11 pb-[34px] pt-14">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start lg:gap-[60px]">
          <div className="flex max-w-[320px] flex-col gap-3.5">
            <Link href="/" aria-label="BPM Tech, inicio">
              <Wordmark size={17} />
            </Link>
            <p className="text-sm leading-relaxed text-ink-mute">
              Aplicaciones, webs y soluciones digitales a medida. Valencia, 2026.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-8">
            {columns.map((column) => (
              <nav key={column.label} aria-label={column.label} className="flex flex-col gap-[11px]">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                  {column.label}
                </span>
                {column.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ink transition-colors duration-300 hover:text-cobalt"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-ink transition-colors duration-300 hover:text-cobalt"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 border-t border-[#D8D6CC] pt-5">
          <span className="font-mono text-[11px] text-ink-faint">
            © {new Date().getFullYear()} BPM Tech
          </span>
          <span className="flex items-center gap-5">
            <span className="font-mono text-[11px] text-ink-faint">{site.location}</span>
            <a
              href="#top"
              aria-label="Volver arriba"
              className="group flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors duration-300 ease-editorial hover:border-ink active:translate-y-[1px]"
            >
              <span
                aria-hidden
                className="font-mono text-[13px] transition-transform duration-300 ease-editorial group-hover:-translate-y-0.5"
              >
                ↑
              </span>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
