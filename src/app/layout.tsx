import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { copyEs } from "@/data/copy";
import { legal } from "@/data/legal";
import { site } from "@/data/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/analytics/Analytics";
import { InlineScript } from "@/components/ui/InlineScript";
import { NewTabNote } from "@/components/ui/NewTabNote";
import { RevealObserver } from "@/components/ui/RevealObserver";

const { meta } = copyEs;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: meta.titulo,
    template: meta.titulo_plantilla,
  },
  description: site.description,
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
    title: meta.titulo,
    description: site.share,
    url: site.url,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: meta.og_alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.titulo,
    description: site.share,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      legalName: legal.name,
      description: site.description,
      url: site.url,
      email: site.email,
      logo: `${site.url}/avatar-512.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Valencia",
        addressCountry: "ES",
      },
      areaServed: { "@type": "Country", name: "España" },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      description: site.description,
      url: site.url,
      inLanguage: "es-ES",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

/**
 * `.js` en `<html>` antes del primer pintado. Los estados iniciales ocultos de
 * las animaciones solo existen con esta clase y con movimiento permitido: sin
 * JS se ve el estado final.
 *
 * `data-smooth` activa el desplazamiento suave de las anclas (`globals.css`)
 * solo después de la carga: con un enlace compartido a `/#contacto`, el salto
 * inicial es inmediato y no recorre la página entera revelando bloques.
 *
 * `suppressHydrationWarning` acepta que el `<html>` del navegador lleve una
 * clase y un atributo que el servidor no pintó.
 */
const MARK_JS =
  "(function(d){d.classList.add('js');" +
  "addEventListener('load',function(){requestAnimationFrame(function(){d.setAttribute('data-smooth','')})})" +
  "})(document.documentElement)";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <InlineScript html={MARK_JS} />
      </head>
      <body className="min-h-screen">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-control focus:bg-ink focus:px-3.5 focus:py-2.5 focus:text-small focus:font-semibold focus:text-white"
        >
          {copyEs.comun.saltar}
        </a>
        <Header />
        <main>
          {/* Destino de «Saltar al contenido». Va dentro de `main` pero no es
              `main`: un ancestro enfocable recoge el foco de cualquier clic en
              texto, y el siguiente Tab devolvería al visitante al hero. */}
          <span id="contenido" tabIndex={-1} className="block focus:outline-none" />
          {children}
        </main>
        <Footer />
        <NewTabNote />
        <RevealObserver />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
