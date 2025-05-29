// src/components/portfolio/PortfolioHeader.tsx
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher"; // Importa el selector

export default function PortfolioHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="container mx-auto p-4 flex justify-end items-center gap-2 sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <LanguageSwitcher /> {/* AÑADIDO AQUÍ */}
      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  );
}