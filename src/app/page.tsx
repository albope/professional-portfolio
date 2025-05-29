// src/app/page.tsx

import Link from 'next/link';
import { ChevronRight, Monitor } from 'lucide-react';
import { AnimatedTagline } from '@/components/ui/AnimatedTagline';
import { SpanishFlagIcon, BritishFlagIcon } from '@/components/icons/FlagIcons';

export default function SplashPage() {
  const actionLines = {
    es: "Descubre mis proyectos y cómo puedo ayudarte.",
    en: "Discover my projects and how I can help you."
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen flex-grow
                 overflow-hidden px-4
                 bg-slate-950 text-slate-100 relative isolate"
    >
      {/* FONDO DE AURORA MAXIMIZADO */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[150rem] w-[150rem] -translate-x-1/2 -translate-y-1/2">
          <div
            className="absolute -top-1/3 left-[5%] h-[100rem] w-[100rem]
                       bg-gradient-radial from-purple-500/60 via-purple-600/10 to-transparent
                       animate-aurora-spin"
            style={{ animationDuration: '26s', animationDelay: '-4s' }}
          />
          <div
            className="absolute -bottom-1/3 right-[5%] h-[100rem] w-[100rem]
                       bg-gradient-radial from-sky-400/60 via-sky-500/10 to-transparent
                       animate-aurora-spin"
            style={{ animationDuration: '22s', animationDelay: '-2s' }}
          />
          <div
            className="absolute bottom-[15%] left-[15%] h-[80rem] w-[80rem]
                       bg-gradient-radial from-emerald-400/50 via-emerald-500/5 to-transparent
                       animate-aurora-spin"
            style={{ animationDuration: '30s', animationDelay: '-3s' }}
          />
        </div>
      </div>

      {/* Efecto de grid sutil */}
      <div className="absolute inset-0 -z-5 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="subtleGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" className="stroke-slate-700" strokeWidth="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#subtleGridPattern)" />
        </svg>
      </div>

      <main
        className="relative z-10 flex flex-col items-center justify-center text-center
                   p-8 py-10 sm:p-12 md:p-16
                   w-full max-w-md md:max-w-lg
                   rounded-2xl md:rounded-3xl
                   border border-slate-700/30
                   bg-slate-800/75 backdrop-blur-2xl
                   shadow-2xl shadow-black/50
                   animate-fade-in-up transform transition-all duration-300 hover:shadow-sky-400/15"
      >
        <div className="mb-6 md:mb-8 animate-fade-in-up [animation-delay:0.2s]">
          <Monitor className="w-14 h-14 md:w-16 md:h-16 text-sky-300 mx-auto animate-subtle-pulse" />
        </div>

        <div className="animate-fade-in-up [animation-delay:0.4s]">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-50 mb-3 tracking-tight">
            Alberto Bort
          </h1>
        </div>

        <div className="animate-fade-in-up [animation-delay:0.6s]">
          <p className="text-lg sm:text-xl text-slate-300 mb-8 tracking-normal">
            Digital Solutions Architect & Itinerary Designer
          </p>
        </div>

        <div className="animate-fade-in-up [animation-delay:0.8s] min-h-[2.5em] md:min-h-[3em] flex items-center justify-center">
            <AnimatedTagline
              lines={actionLines}
              duration={4000}
              className="text-md text-slate-400 mb-10"
            />
        </div>

        <div className="w-full space-y-4 max-w-xs sm:max-w-sm mx-auto animate-fade-in-up [animation-delay:1s]">
          <Link href="/es" passHref className="block w-full">
            <button
              className="w-full group relative flex items-center justify-center h-12 sm:h-14 px-4 sm:px-6
                         bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500
                         hover:from-sky-400 hover:via-purple-400 hover:to-pink-400
                         rounded-lg text-sm sm:text-base font-semibold text-white
                         transition-all duration-300 ease-out
                         shadow-lg hover:shadow-purple-400/50 focus:shadow-purple-400/50
                         focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:ring-offset-slate-900
                         transform hover:-translate-y-0.5 active:translate-y-0 
                         animate-button-callout-pulse" // <-- AÑADIDA LA ANIMACIÓN
            >
              <SpanishFlagIcon className="w-6 h-auto mr-2 flex-shrink-0" />
              Ver Portafolio y Servicios
              <ChevronRight className="ml-auto h-5 w-5 text-purple-200 opacity-75 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-1 flex-shrink-0" />
            </button>
          </Link>
          <Link href="/en" passHref className="block w-full">
            <button
              className="w-full group relative flex items-center justify-center h-12 sm:h-14 px-4 sm:px-6
                         bg-slate-700 hover:bg-slate-600
                         rounded-lg text-sm sm:text-base font-semibold text-white
                         transition-all duration-300 ease-out
                         shadow-lg hover:shadow-slate-500/40 focus:shadow-slate-500/50
                         focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900
                         transform hover:-translate-y-0.5 active:translate-y-0
                         animate-button-callout-pulse" // <-- AÑADIDA LA ANIMACIÓN
            >
              <BritishFlagIcon className="w-6 h-auto mr-2 flex-shrink-0" />
              View Portfolio & Services
              <ChevronRight className="ml-auto h-5 w-5 text-slate-300 opacity-75 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-1 flex-shrink-0" />
            </button>
          </Link>
        </div>
      </main>

      <footer className="relative z-10 text-center w-full text-slate-500 text-xs sm:text-sm py-10 animate-fade-in-up [animation-delay:1.2s]">
        © {new Date().getFullYear()} Alberto Bort
      </footer>
    </div>
  );
}