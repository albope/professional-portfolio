// src/lib/fonts.ts
import localFont from "next/font/local";

export const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff", // Ajusta la ruta si es necesario desde /lib
  variable: "--font-geist-sans",
  weight: "100 900" // Opcional, para fuentes variables
});

export const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff", // Ajusta la ruta si es necesario desde /lib
  variable: "--font-geist-mono",
  weight: "100 900" // Opcional
});