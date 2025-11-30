import type { Metadata } from 'next';
import './globals.css';
// 1. AQUI IMPORTAMOS LA NUEVA FUENTE
import { geistSans, geistMono, playfair } from '@/lib/fonts'; 
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: 'Alberto Bort | Digital Services',
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
    <html 
      lang="en" 
      // 2. AQUI AÑADIMOS LA VARIABLE playfair.variable
      className={`h-full ${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans scroll-smooth`} 
      suppressHydrationWarning
    > 
      <body 
        className="min-h-screen sm:min-h-[100dvh] bg-background text-foreground antialiased relative selection:bg-primary selection:text-primary-foreground" 
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="portfolio-theme"
        >
          {children}
          
          {/* Capa de Ruido Global */}
          <div className="bg-noise mix-blend-overlay opacity-40 dark:opacity-20 pointer-events-none fixed inset-0 z-[9999]" />
        </ThemeProvider>
      </body>
    </html>
  );
}