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

  // Obtener la URL base del entorno o usar un valor por defecto
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const imageUrl = `${siteUrl}/Images/profile.jpg`; // O una imagen específica para previews sociales

  return {
    title: title,
    description: description,
    // 'icons' se hereda del RootLayout, no es necesario repetirlo aquí si está definido allí.
    // Si quieres ser explícito o diferente por idioma:
    // icons: {
    //   icon: "/Images/favicon.ico", // O la ruta que uses en tu RootLayout
    // },
    alternates: {
      canonical: `${siteUrl}/${params.lang}`,
      languages: {
        'es-ES': `${siteUrl}/es`,
        'en-US': `${siteUrl}/en`,
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: `${siteUrl}/${params.lang}`,
      siteName: 'Alberto Bort', // O el nombre que prefieras
      images: [
        {
          url: imageUrl,
          width: 1200, // Ajusta según tu imagen
          height: 630, // Ajusta según tu imagen
          alt: `Portfolio of Alberto Bort - ${params.lang === 'es' ? 'Español' : 'English'}`,
        },
      ],
      locale: params.lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
      // creator: '@tuUsuarioDeTwitter', // Si tienes y quieres añadirlo
    },
  };
}

// Necesario para generar las rutas estáticas para cada idioma
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function LangLayout({
  children,
  params: _params, // CORRECCIÓN: 'params' ahora es '_params' para indicar que no se usa directamente en el cuerpo.
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return <>{children}</>;
}