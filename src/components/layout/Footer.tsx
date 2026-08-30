import Link from "next/link";
import { nav, site } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";

const legalLinks = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Privacidad", href: "/privacidad" },
];

export function Footer() {
  return (
    <footer className="border-t border-line-dark bg-ink text-paper">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Link href="/" aria-label="BPM Tech — Inicio">
            <Wordmark tone="paper" className="text-2xl" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/55">
            Estudio de software: aplicaciones a medida, automatización,
            integraciones e inteligencia artificial aplicada a negocio.
          </p>
          <p className="label-mono mt-6 text-paper/35">{site.location}</p>
        </div>

        <nav aria-label="Índice" className="md:col-span-3">
          <p className="label-mono mb-5 text-paper/40">Índice</p>
          <ul className="flex flex-col gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-underline text-sm text-paper/75 transition-colors hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contacto"
                className="link-underline text-sm text-paper/75 transition-colors hover:text-paper"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal" className="md:col-span-2">
          <p className="label-mono mb-5 text-paper/40">Legal</p>
          <ul className="flex flex-col gap-3">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-underline text-sm text-paper/75 transition-colors hover:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="label-mono mb-5 text-paper/40">Contacto</p>
          <Link
            href="/#contacto"
            className="link-underline text-sm text-paper/75 transition-colors hover:text-paper"
          >
            Cuéntanos tu proyecto
          </Link>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-editorial flex flex-col gap-2 py-6 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </p>
          <p className="font-mono uppercase tracking-[0.18em] text-[10px]">
            Software · Automatización · IA
          </p>
        </div>
      </div>
    </footer>
  );
}
