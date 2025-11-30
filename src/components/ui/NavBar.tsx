'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Github, Linkedin, Twitter, Mail, 
  Sun, Moon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- CONFIGURACIÓN DE NAVEGACIÓN ---
const navItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Github', icon: Github, href: 'https://github.com/albope', external: true },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/albertobort/', external: true },
  { name: 'Twitter', icon: Twitter, href: 'https://x.com/albertobort23', external: true },
  { name: 'Contact', icon: Mail, href: 'mailto:albertobort@gmail.com', external: true },
];

export const NavBar: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Evitar hidratación incorrecta
  useEffect(() => setMounted(true), []);

  // Lógica de cambio de idioma
  const toggleLanguage = () => {
    if (!pathname) return;
    const currentLang = pathname.split('/')[1];
    const newLang = currentLang === 'es' ? 'en' : 'es';
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  if (!mounted) return null;

  // Variantes de animación
  const islandVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  // Obtenemos el idioma actual para mostrarlo
  const currentLangCode = pathname?.split('/')[1] === 'es' ? 'ES' : 'EN';

  return (
    <>
      {/* --- ISLA 1: NAVEGACIÓN PRINCIPAL (CENTRADA) --- */}
      <motion.nav 
        variants={islandVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 px-2 py-2 rounded-full border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl shadow-lg dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/5"
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isHovered = hoveredIndex === index;
          
          return (
            <a
              key={item.name}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "relative flex items-center justify-center p-3 rounded-full transition-all duration-300",
                "text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
              )}
            >
              {/* Fondo Hover Magnético */}
              {isHovered && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <span className="relative z-10">
                <Icon className="w-5 h-5" />
              </span>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 18, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    className="absolute top-full mt-2 px-3 py-1 bg-black border border-white/20 text-white text-[10px] font-mono tracking-widest uppercase rounded shadow-xl whitespace-nowrap z-20"
                  >
                    {item.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </a>
          );
        })}
      </motion.nav>

      {/* --- ISLA 2: UTILIDADES (EXTREMO DERECHO) --- */}
      <motion.div 
        variants={islandVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="fixed top-6 right-6 z-[100] flex items-center gap-1 px-2 py-2 rounded-full border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl shadow-lg dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/5"
      >
        {/* Toggle Tema */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="relative group p-3 rounded-full text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          aria-label="Toggle Theme"
        >
          <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
          <Moon className="w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="w-5 h-5 block opacity-0">.</span> 
        </button>

        <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1" />

        {/* Toggle Idioma - Diseño Tipográfico Limpio */}
        <button
          onClick={toggleLanguage}
          className="group p-3 rounded-full text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          aria-label="Switch Language"
        >
          <span className="font-mono text-xs font-bold tracking-wider">
            {currentLangCode}
          </span>
        </button>

      </motion.div>
    </>
  );
};