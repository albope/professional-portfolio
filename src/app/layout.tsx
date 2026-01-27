import type { Metadata } from 'next';
import './globals.css';
import { geistSans, geistMono, playfair } from '@/lib/fonts';
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: 'Alberto Bort | Web Developer & PWA Architect',
  description: 'Desarrollo aplicaciones web modernas y Progressive Web Apps que cargan rapido, funcionan offline y convierten visitantes en clientes.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://albertobort.com'),
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
      lang="es"
      className={`h-full ${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen sm:min-h-[100dvh] bg-background text-foreground antialiased relative selection:bg-primary selection:text-primary-foreground"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="portfolio-theme"
        >
          {children}

          {/* Capa de Ruido Global */}
          <div className="bg-noise mix-blend-overlay opacity-30 dark:opacity-15 pointer-events-none fixed inset-0 z-[9999]" />
        </ThemeProvider>
      </body>
    </html>
  );
}
