import type { Metadata } from "next";
import "./globals.css";
import { archivo, archivoBlack, fragmentMono } from "@/lib/fonts";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "BPM Tech · Tecnología a medida para empresas",
    template: "%s · BPM Tech",
  },
  description: site.description,
  keywords: [
    "software a medida",
    "desarrollo de software",
    "webs a medida",
    "automatización de procesos",
    "inteligencia artificial",
    "integraciones",
    "consultoría tecnológica",
    "Valencia",
  ],
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon-180.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.name,
    title: "BPM Tech · Tecnología a medida para empresas",
    description: site.description,
    url: site.url,
    images: [
      {
        url: "/og-1200x630.png",
        width: 1200,
        height: 630,
        alt: "BPM Tech, tecnología a medida para empresas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BPM Tech · Tecnología a medida para empresas",
    description: site.description,
    images: ["/og-1200x630.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  description: site.description,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Valencia",
    addressCountry: "ES",
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
      className={`${archivo.variable} ${archivoBlack.variable} ${fragmentMono.variable} font-sans`}
    >
      <body className="min-h-screen bg-paper text-ink">
        {/* Sin JS, los wrappers de animación quedan en opacity 0: forzamos visibilidad */}
        <noscript>
          <style>{`[style*="opacity"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SmoothScroll>
          <a
            href="#contenido"
            className="sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          >
            Saltar al contenido
          </a>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
