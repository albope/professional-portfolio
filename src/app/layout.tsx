// src/app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// La carga de fuentes locales se mantiene, es la mejor opción para el rendimiento.
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Alberto Bort | Web Developer & Travel Consultant", // MEJORA: Título actualizado
  // MEJORA: Descripción optimizada para SEO, incluyendo el nuevo servicio.
  description: "Professional portfolio of Alberto Bort, a web developer creating intuitive digital solutions and personalized travel itineraries.", 
  icons: {
    icon: "/Images/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // MEJORA: Añadida la clase 'scroll-smooth' para una navegación más fluida con los anclas.
    <html lang="en" suppressHydrationWarning className="scroll-smooth"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}