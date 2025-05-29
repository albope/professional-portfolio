// src/app/[lang]/layout.tsx (Layout para las páginas /es y /en)
import type { Metadata } from "next";
import { i18n } from "../../../i18n-config"; // Ajusta la ruta si es necesario

// Metadatos dinámicos para cada idioma
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const isSpanish = params.lang === 'es';
  const title = isSpanish ? "Alberto Bort | Portafolio Profesional" : "Alberto Bort | Professional Portfolio";
  const description = isSpanish 
    ? "Portafolio de Alberto Bort: Desarrollador Web y Planificador de Viajes. Descubre soluciones digitales e itinerarios a medida." 
    : "Alberto Bort's Portfolio: Web Developer & Travel Planner. Discover digital solutions and custom-tailored travel itineraries.";
  
  return {
    title: title,
    description: description,
    // 'icons' se hereda del RootLayout, no es necesario repetirlo aquí
  };
}

// Necesario para generar las rutas estáticas para cada idioma
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function LangLayout({
  children,
  params, 
}: {
  children: React.ReactNode;
  params: { lang: string }; 
}) {
  // El ThemeProvider ahora está en el RootLayout (src/app/layout.tsx).
  // Este LangLayout principalmente ayuda a Next.js a manejar los metadatos
  // y parámetros de idioma para las páginas anidadas.
  // También podrías usar params.lang aquí para pasar el idioma a los children si fuera necesario
  // a través de un Context, pero las páginas ya lo reciben en sus props.
  return <>{children}</>;
}