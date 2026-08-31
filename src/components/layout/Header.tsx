"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, ctaHref, ctaLabel } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ease-editorial",
        open
          ? "border-line-dark bg-ink"
          : scrolled
            ? "border-line bg-paper/95 backdrop-blur-sm"
            : "border-transparent bg-transparent"
      )}
    >
      <div className="container-editorial flex h-16 items-center justify-between lg:h-20">
        <Link href="/" aria-label="BPM Tech, inicio" onClick={() => setOpen(false)}>
          <Wordmark tone={open ? "paper" : "ink"} size={19} className="lg:hidden" />
          <Wordmark tone="ink" size={21} className="hidden lg:inline-flex" />
        </Link>

        {/* Navegación desktop */}
        <nav aria-label="Principal" className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={ctaHref}
            className="bg-ink px-[22px] py-3 text-sm font-semibold text-paper transition-colors duration-300 ease-editorial hover:bg-cobalt active:translate-y-[1px]"
          >
            {ctaLabel}
          </Link>
        </nav>

        {/* Botón menú móvil */}
        <button
          type="button"
          className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={cn(
              "absolute h-[1.5px] w-5 transition-transform duration-300 ease-editorial",
              open ? "rotate-45 bg-paper" : "-translate-y-[3.5px] bg-ink"
            )}
          />
          <span
            className={cn(
              "absolute h-[1.5px] w-5 transition-transform duration-300 ease-editorial",
              open ? "-rotate-45 bg-paper" : "translate-y-[3.5px] bg-ink"
            )}
          />
        </button>
      </div>
    </header>

    {/* Menú móvil: overlay tinta a pantalla completa, fuera del <header> */}
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-movil"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-ink px-5 pb-8 pt-10 lg:hidden"
        >
          <nav aria-label="Principal móvil" className="flex flex-1 flex-col">
            {nav.map((item, i) => (
              <motion.div
                key={item.href}
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display flex items-baseline justify-between border-b border-line-dark py-3.5 text-[34px] text-paper"
                >
                  {item.label}
                  <span className="font-mono text-[11px] normal-case tracking-normal text-paper/40">
                    0{i + 1}
                  </span>
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mt-auto pt-10"
            >
              <Link
                href={ctaHref}
                onClick={() => setOpen(false)}
                className="block bg-paper px-6 py-[17px] text-center text-[15px] font-semibold text-ink transition-colors duration-300 hover:bg-cobalt-bright active:translate-y-[1px]"
              >
                {ctaLabel}
              </Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
