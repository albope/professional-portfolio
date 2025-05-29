// src/app/layout.tsx (Layout Raíz ÚNICO - Con Configuración de Tema Dinámica Restaurada)
import type { Metadata } from 'next';
import './globals.css'; 
import { geistSans, geistMono } from '@/lib/fonts';
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: 'Alberto Bort | Web Developer & Travel Planner',
  description: 'Portfolio of Alberto Bort. Explore digital solutions and custom travel itineraries.',
  icons: {
    icon: "/Images/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${geistSans.variable} ${geistMono.variable} font-sans scroll-smooth`} suppressHydrationWarning> 
      <body 
        className="min-h-screen sm:min-h-[100dvh] 
                   bg-slate-50 text-slate-900  // ESTILOS BASE CLAROS POR DEFECTO
                   dark:bg-slate-950 dark:text-slate-50 // Estilos oscuros
                   transition-colors duration-300 antialiased" 
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system" // Volvemos a "system"
          enableSystem         // Habilitamos que detecte el sistema
          disableTransitionOnChange
          storageKey="portfolio-theme" // <-- ¡NUEVO Y RECOMENDADO!
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}