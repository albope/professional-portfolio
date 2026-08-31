"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, ctaHref, ctaLabel } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

/** Cabecera web (opción 1b del handoff): 78px sobre tinta sólida, sin hairline. */
export function Header() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

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
    <header className="fixed inset-x-0 top-0 z-50 bg-ink">
      <div className="container-editorial flex h-16 items-center justify-between lg:h-[78px]">
        <Link href="/" aria-label="BPM Tech, inicio" onClick={() => setOpen(false)}>
          <Wordmark tone="paper" size={16} overlay={open} className="lg:hidden" />
          <Wordmark tone="paper" size={19} className="hidden lg:inline-flex" />
        </Link>

        {/* Navegación desktop */}
        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#D8D6CC] transition-colors duration-300 hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={ctaHref}
            className="bg-paper px-5 py-[11px] text-[13px] font-semibold text-ink transition-colors duration-300 ease-editorial hover:bg-cobalt hover:text-paper active:translate-y-[1px]"
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
              "absolute h-[1.5px] w-5 bg-paper transition-transform duration-300 ease-editorial",
              open ? "rotate-45" : "-translate-y-[3.5px]"
            )}
          />
          <span
            className={cn(
              "absolute h-[1.5px] w-5 bg-paper transition-transform duration-300 ease-editorial",
              open ? "-rotate-45" : "translate-y-[3.5px]"
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
