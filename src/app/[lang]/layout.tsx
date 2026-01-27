import type { Metadata } from "next";
import { i18n } from "../../../i18n-config";
import { NavBar } from "@/components/ui/NavBar";
import SmoothScroll from "@/components/SmoothScroll";
import { playfair } from '@/lib/fonts';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const isSpanish = params.lang === 'es';
  const title = isSpanish
    ? "Alberto Bort | Desarrollador Web & Arquitecto PWA"
    : "Alberto Bort | Web Developer & PWA Architect";
  const description = isSpanish
    ? "Desarrollo aplicaciones web modernas y Progressive Web Apps (PWAs) que cargan rapido, funcionan offline y convierten visitantes en clientes. Especialista en React, Next.js y TypeScript."
    : "I build modern web applications and Progressive Web Apps (PWAs) that load fast, work offline, and convert visitors into customers. Specialist in React, Next.js and TypeScript.";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://albertobort.com';
  const imageUrl = `${siteUrl}/Images/og-image.jpg`;

  return {
    title: title,
    description: description,
    keywords: isSpanish
      ? ['desarrollador web', 'PWA', 'Progressive Web App', 'React', 'Next.js', 'TypeScript', 'freelance', 'Valencia', 'España']
      : ['web developer', 'PWA', 'Progressive Web App', 'React', 'Next.js', 'TypeScript', 'freelance', 'Spain'],
    authors: [{ name: 'Alberto Bort', url: siteUrl }],
    creator: 'Alberto Bort',
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
      siteName: 'Alberto Bort - Web Developer',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: isSpanish ? 'Alberto Bort - Desarrollador Web y Arquitecto PWA' : 'Alberto Bort - Web Developer & PWA Architect',
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
      creator: '@albertobort23',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <div className={`relative min-h-screen bg-background text-foreground selection:bg-indigo-500/30 ${playfair.variable}`}>
      <SmoothScroll>
        <NavBar />
        <div className="pt-20 sm:pt-24">
          {children}
        </div>
      </SmoothScroll>
    </div>
  );
}
