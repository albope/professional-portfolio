// src/components/portfolio/PortfolioHeader.tsx
'use client';

import Link from 'next/link'; // Importa Link de Next.js
import { useTheme } from 'next-themes';
import { Moon, Sun, Home } from 'lucide-react'; // Añade el icono Home
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export default function PortfolioHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center gap-2 sticky top-0 z-50 
                 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md" // Ajustado dark:bg y backdrop-blur
    >
      {/* Botón para volver a la Splash Page (Izquierda) */}
      <Link href="/" aria-label="Volver a la página de inicio">
        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50">
          <Home className="h-5 w-5" />
        </Button>
      </Link>

      {/* Controles de Idioma y Tema (Derecha) */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Cambiar tema"
          className="text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </div>
    </header>
  );
}