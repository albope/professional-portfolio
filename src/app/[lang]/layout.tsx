import type { Metadata } from "next";
import { i18n } from "../../../i18n-config";
import { NavBar } from "@/components/ui/NavBar";

// Metadatos dinámicos (Mantengo tu lógica original intacta)
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const isSpanish = params.lang === 'es';
  const title = isSpanish ? "Alberto Bort | Portafolio Profesional" : "Alberto Bort | Professional Portfolio";
  const description = isSpanish
    ? "Portafolio de Alberto Bort: Desarrollador Web y Planificador de Viajes. Descubre soluciones digitales e itinerarios a medida."
    : "Alberto Bort's Portfolio: Web Developer & Travel Planner. Discover digital solutions and custom-tailored travel itineraries.";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const imageUrl = `${siteUrl}/Images/profile.jpg`;

  return {
    title: title,
    description: description,
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
      siteName: 'Alberto Bort',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
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
    },
  };
}

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
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      {/* NAVBAR PERSISTENTE 
        Se mantiene fija mientras navegas entre secciones.
      */}
      <NavBar />
      
      {/* Contenido de la página */}
      <div className="pt-24 sm:pt-32 px-4 md:px-8 max-w-[1600px] mx-auto">
        {children}
      </div>
    </div>
  );
}