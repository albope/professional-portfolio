"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, ctaHref, ctaLabel } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";

/** Native modal dialog supplies focus containment and makes the background inert. */
export function Header() {
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
    const desktop = window.matchMedia("(min-width: 1024px)");
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
    if (window.matchMedia("(min-width: 1024px)").matches) {
      brandRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-ink">
        <div className="container-editorial flex h-16 items-center justify-between lg:h-[78px]">
          <Link ref={brandRef} href="/" aria-label="BPMTECH, inicio" className="inline-flex min-h-11 items-center">
            <Wordmark tone="paper" size={16} className="lg:hidden" />
            <Wordmark tone="paper" size={19} className="hidden lg:inline-flex" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center text-sm text-paper/80 transition-colors hover:text-paper">
                {item.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              data-track="cta_click"
              data-track-location="header"
              className="inline-flex min-h-11 items-center bg-paper px-5 text-sm font-semibold text-ink transition-colors hover:bg-cobalt hover:text-paper"
            >
              Hablemos <span aria-hidden className="ml-3">↗</span>
            </Link>
          </nav>

          <button
            ref={triggerRef}
            type="button"
            className="js-menu-trigger flex min-h-11 items-center gap-3 px-2 text-sm text-paper lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-haspopup="dialog"
            onClick={openMenu}
          >
            Menú
            <span aria-hidden className="flex w-5 flex-col gap-1.5">
              <span className="h-px w-full bg-paper" />
              <span className="h-px w-full bg-paper" />
            </span>
          </button>
        </div>

        <noscript>
          <style>{`.js-menu-trigger { display: none !important; } @media (max-width: 1023px) { main { padding-top: 44px; } main section[id] { scroll-margin-top: 128px; } }`}</style>
          <nav aria-label="Principal móvil" className="flex gap-6 overflow-x-auto border-t border-line-dark px-5 lg:hidden">
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
        <div className="container-editorial flex min-h-full flex-col pb-8">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <p id="menu-movil-title" className="label-mono text-paper/75">Navegación</p>
            <button
              ref={closeRef}
              type="button"
              onClick={closeMenu}
              className="flex min-h-11 items-center gap-3 px-2 text-sm"
            >
              Cerrar <span aria-hidden className="text-2xl leading-none">×</span>
            </button>
          </div>

          <nav aria-label="Principal móvil" className="flex flex-1 flex-col pt-8">
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="display flex items-baseline justify-between gap-4 border-b border-line-dark py-5 text-[clamp(1.5rem,7vw,2.25rem)] text-paper"
              >
                {item.label}
                <span aria-hidden className="font-mono text-xs font-normal tracking-normal text-paper/70">0{index + 1}</span>
              </Link>
            ))}
            <div className="mt-auto pt-10">
              <Link
                href={ctaHref}
                onClick={closeMenu}
                data-track="cta_click"
                data-track-location="header"
                className="block bg-paper px-5 py-4 text-center text-[15px] font-semibold text-ink transition-colors hover:bg-cobalt-bright"
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
