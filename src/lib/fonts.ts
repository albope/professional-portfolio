import { Fragment_Mono, Schibsted_Grotesk } from "next/font/google";

/**
 * Tipografía de la web (especificación 2.2): dos familias, las dos servidas
 * por `next/font/google`, así que el navegador nunca pide nada a Google.
 *
 * Schibsted Grotesk es variable (400 a 900), por eso no se fijan pesos: los
 * titulares usan 560 y el resto 400, 500 y 600 sin descargar un archivo por
 * peso. Es la única familia de texto de la web, también en las fichas de
 * proyecto y en las páginas legales.
 */
export const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * La itálica solo aparece en la «letra a mano» de las notas dibujadas en el
 * hero (clase `.t-hand`). Va en una instancia aparte para no precargarla:
 * así no compite con la redonda, que pinta el H1 (el LCP). Si llega tarde,
 * `display: swap` la cambia sin mover nada, porque vive dentro de un SVG.
 */
export const sansItalic = Schibsted_Grotesk({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-sans-italic",
  display: "swap",
  preload: false,
});

/** Fragment Mono se reserva al logo (`Wordmark`): nada más la usa. */
export const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

/** Clases de las tres variables para el `<html>` del layout raíz. */
export const fontVariables = `${sans.variable} ${sansItalic.variable} ${mono.variable}`;
