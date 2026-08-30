"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, ctaHref, ctaLabel, site } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
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
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ease-editorial",
        scrolled || open
          ? "border-line bg-paper/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container-editorial flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="BPM Tech — Inicio" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        {/* Navegación desktop */}
        <nav aria-label="Principal" className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline text-sm tracking-tight text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Button href={ctaHref} className="h-10 px-5">
            {ctaLabel}
          </Button>
        </nav>

        {/* Botón menú móvil */}
        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </header>

    {/* Menú móvil fuera del <header>: su backdrop-filter lo convertiría en
        containing block y el overlay fixed quedaría cortado al hacer scroll */}
    <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col justify-between overflow-y-auto bg-paper px-5 pb-10 pt-10 sm:px-8 md:top-20 lg:hidden"
          >
            <nav aria-label="Principal móvil" className="flex flex-col">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-5 text-display-sm font-medium text-ink"
                  >
                    <span className="label-mono text-cobalt">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-10 flex flex-col gap-6"
            >
              <Button href={ctaHref} onClick={() => setOpen(false)} className="w-full">
                {ctaLabel}
              </Button>
              <p className="label-mono text-ink/40">{site.location}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
