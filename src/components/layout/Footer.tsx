import Link from "next/link";
import { nav, ctaHref, ctaLabel, site } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";

const legalLinks = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Privacidad", href: "/privacidad" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-editorial flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between lg:py-[60px]">
        <Link href="/" aria-label="BPM Tech, inicio">
          <Wordmark size={18} />
        </Link>

        <div className="flex flex-wrap gap-x-[60px] gap-y-8">
          <nav aria-label="Índice" className="flex flex-col gap-2.5">
            <span className="label-mono text-[10px] tracking-[0.14em] text-ink-faint">
              Índice
            </span>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Legal" className="flex flex-col gap-2.5">
            <span className="label-mono text-[10px] tracking-[0.14em] text-ink-faint">
              Legal
            </span>
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5">
            <span className="label-mono text-[10px] tracking-[0.14em] text-ink-faint">
              Contacto
            </span>
            <Link
              href={ctaHref}
              className="text-[13px] text-ink-soft transition-colors hover:text-ink"
            >
              {ctaLabel}
            </Link>
            <span className="font-mono text-[11px] text-ink-faint">
              {site.location}
            </span>
          </div>
        </div>

        <span className="font-mono text-[11px] text-ink-faint">
          © {new Date().getFullYear()} BPM Tech · Valencia
        </span>
      </div>
    </footer>
  );
}
