"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, ctaHref, ctaLabel, site } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

/** A partir de 768 px cabe la navegación completa; por debajo, el diálogo. */
const DESKTOP = "(min-width: 768px)";

const navLink =
  "inline-flex min-h-11 items-center border-b border-transparent text-sm font-medium text-ink-soft transition-colors duration-300 ease-editorial hover:border-ink hover:text-ink wide:text-[15px]";

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
      <header className="border-b border-line bg-paper">
        <div className="container-editorial flex h-[60px] items-center justify-between md:h-16 wide:h-[72px]">
          <Link
            ref={brandRef}
            href="/"
            aria-label="BPM Tech, inicio"
            className="inline-flex min-h-11 items-center"
          >
            <Wordmark size={16} className="wide:hidden" />
            <Wordmark size={19} className="hidden wide:inline-flex" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-6 md:flex wide:gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(navLink, isActive(item.href) && "border-ink text-ink")}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              data-track="cta_click"
              data-track-location="header"
              className="ml-2 inline-flex min-h-11 items-center gap-2.5 bg-ink px-4 text-sm font-semibold text-paper transition-colors duration-300 ease-editorial hover:bg-cobalt wide:px-5 wide:text-[15px]"
            >
              Hablemos
              <span aria-hidden className="font-mono">↗</span>
            </Link>
          </nav>

          <button
            ref={triggerRef}
            type="button"
            className="js-menu-trigger -mr-1 flex min-h-11 items-center gap-3 pl-2 pr-1 text-sm font-medium text-ink md:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-haspopup="dialog"
            onClick={openMenu}
          >
            Menú
            <span aria-hidden className="flex w-5 flex-col gap-1.5">
              <span className="h-px w-full bg-ink" />
              <span className="h-px w-full bg-ink" />
            </span>
          </button>
        </div>

        <noscript>
          <style>{`.js-menu-trigger { display: none !important; } @media (max-width: 767px) { main section[id] { scroll-margin-top: 56px; } }`}</style>
          <nav aria-label="Principal móvil" className="flex gap-6 overflow-x-auto border-t border-line px-4 md:hidden">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="inline-flex min-h-11 shrink-0 items-center text-sm text-ink">{item.label}</a>
            ))}
            <a href={ctaHref} className="inline-flex min-h-11 shrink-0 items-center text-sm text-ink">Contacto</a>
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
                Valencia y en remoto
                <br />
                <span className="[overflow-wrap:anywhere]">{site.email}</span>
              </p>
              <Link
                href={ctaHref}
                onClick={closeMenu}
                data-track="cta_click"
                data-track-location="header"
                className="flex min-h-[52px] items-center justify-center bg-paper px-5 text-center text-[15px] font-semibold text-ink transition-colors duration-300 ease-editorial hover:bg-cobalt-bright"
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
