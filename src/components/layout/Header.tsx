"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, ctaHref, ctaLabel, site } from "@/data/site";
import { copyEs, partirFlecha } from "@/data/copy";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

/** A partir de 768 px cabe la navegación completa; por debajo, el diálogo. */
const DESKTOP = "(min-width: 768px)";

const cta = partirFlecha(copyEs.nav.cta);

const navLink =
  "inline-flex min-h-11 items-center border-b border-transparent text-sm font-medium text-paper/72 transition-colors duration-300 ease-editorial hover:border-paper hover:text-paper wide:text-[15px]";

/** Native modal dialog supplies focus containment and makes the background inert. */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP);
    const closeOnDesktop = () => {
      if (desktop.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function openMenu() {
    dialogRef.current?.showModal();
    setOpen(true);
    closeRef.current?.focus();
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  function restoreFocus() {
    setOpen(false);
    if (window.matchMedia(DESKTOP).matches) {
      brandRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }

  /** La ficha de proyecto marca «Proyectos» como sección activa. */
  const isActive = (href: string) =>
    href === "/#proyectos" && pathname.startsWith("/proyectos");

  return (
    <>
      {/* Cabecera fija sobre tinta: abre la página en oscuro y enlaza sin
          salto con el menú móvil, que ya era de tinta. Va por encima del
          canvas de la portada (z-50 frente a z-1) y las páginas interiores
          reservan su alto con `.pagina-interior`. El anillo de foco lo
          resuelve la regla `.bg-ink :focus-visible` de globals.css. */}
      <header className="fixed inset-x-0 top-0 z-50 bg-ink text-paper">
        <div className="container-editorial mx-auto flex h-[60px] max-w-[1440px] items-center justify-between md:h-16 wide:h-[72px]">
          <Link
            ref={brandRef}
            href="/"
            aria-label="BPM Tech, inicio"
            className="inline-flex min-h-11 items-center"
          >
            <Wordmark tone="paper" size={16} className="wide:hidden" />
            <Wordmark tone="paper" size={19} className="hidden wide:inline-flex" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-6 md:flex wide:gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(navLink, isActive(item.href) && "border-paper text-paper")}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              data-track="cta_click"
              data-track-location="header"
              className="ml-2 inline-flex min-h-11 items-center gap-2.5 border border-transparent bg-paper px-4 text-sm font-semibold text-ink transition-colors duration-300 ease-editorial hover:bg-cobalt-bright wide:px-5 wide:text-[15px]"
            >
              {cta.texto}
              <span aria-hidden className="font-mono">{cta.flecha}</span>
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            {/* El contacto no espera al menú: también a mano en el móvil. */}
            <Link
              href={ctaHref}
              data-track="cta_click"
              data-track-location="header"
              className="inline-flex min-h-11 items-center gap-2 border border-transparent bg-paper px-3 text-sm font-semibold text-ink transition-colors duration-300 ease-editorial hover:bg-cobalt-bright min-[360px]:px-3.5"
            >
              {cta.texto}
              <span aria-hidden className="hidden font-mono min-[360px]:inline">{cta.flecha}</span>
            </Link>
            <button
              ref={triggerRef}
              type="button"
              className="js-menu-trigger -mr-1 flex min-h-11 min-w-11 items-center justify-end gap-3 pl-2 pr-1 text-sm font-medium text-paper min-[360px]:pl-3"
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-haspopup="dialog"
              onClick={openMenu}
            >
              <span className="sr-only min-[360px]:not-sr-only">{copyEs.nav.menu}</span>
              <span aria-hidden className="flex w-5 flex-col gap-1.5">
                <span className="w-full border-t border-paper" />
                <span className="w-full border-t border-paper" />
              </span>
            </button>
          </div>
        </div>

        <noscript>
          <style>{`.js-menu-trigger { display: none !important; } header { position: static !important; } .pagina-interior { margin-top: 0 !important; }`}</style>
          <nav aria-label="Principal móvil" className="flex gap-6 overflow-x-auto border-t border-line-dark px-4 md:hidden">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="inline-flex min-h-11 shrink-0 items-center text-sm text-paper">{item.label}</a>
            ))}
            <a href={ctaHref} className="inline-flex min-h-11 shrink-0 items-center text-sm text-paper">Contacto</a>
          </nav>
        </noscript>
      </header>

      <dialog
        ref={dialogRef}
        id="menu-movil"
        aria-labelledby="menu-movil-title"
        onClose={restoreFocus}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-ink p-0 text-paper backdrop:bg-ink"
      >
        <div className="flex min-h-full flex-col px-4 pb-6">
          <div className="flex h-[60px] shrink-0 items-center justify-between">
            <span id="menu-movil-title">
              <Wordmark tone="paper" size={16} />
              <span className="sr-only">Navegación de BPM Tech</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={closeMenu}
              className="-mr-1 flex min-h-11 items-center gap-2.5 pl-2 pr-1 text-sm"
            >
              Cerrar <span aria-hidden className="text-2xl leading-none">×</span>
            </button>
          </div>

          <nav aria-label="Principal móvil" className="flex flex-1 flex-col pt-6">
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-baseline justify-between gap-4 border-b border-paper/15 py-[18px] text-[28px] font-semibold leading-tight tracking-[-0.02em] text-paper transition-colors duration-300 ease-editorial hover:text-cobalt-bright"
              >
                {item.label}
                <span aria-hidden className="font-mono text-xs font-normal text-paper/60">
                  0{index + 1}
                </span>
              </Link>
            ))}

            <div className="mt-auto flex flex-col gap-5 pt-10">
              <p className="font-mono text-[11px] leading-relaxed tracking-[0.08em] text-paper/60">
                Valencia, presencial y en remoto
                <br />
                <span className="[overflow-wrap:anywhere]">{site.email}</span>
              </p>
              <Link
                href={ctaHref}
                onClick={closeMenu}
                data-track="cta_click"
                data-track-location="header"
                className="flex min-h-[52px] items-center justify-center border border-transparent bg-paper px-5 text-center text-[15px] font-semibold text-ink transition-colors duration-300 ease-editorial hover:bg-cobalt-bright"
              >
                {ctaLabel}
              </Link>
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}
