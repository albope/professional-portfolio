import type { Metadata } from "next";
import "./globals.css";
import { geistSans, geistMono, instrumentSerif } from "@/lib/fonts";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "BPM Tech — Software a medida, automatización e IA",
    template: "%s — BPM Tech",
  },
  description: site.description,
  keywords: [
    "software a medida",
    "desarrollo de software",
    "automatización de procesos",
    "inteligencia artificial",
    "integraciones",
    "consultoría tecnológica",
    "Valencia",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.name,
    title: "BPM Tech — Software a medida, automatización e IA",
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: "BPM Tech — Software a medida, automatización e IA",
    description: site.description,
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans`}
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
