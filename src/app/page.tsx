// src/app/page.tsx  <- REEMPLAZA EL CONTENIDO DE ESTE ARCHIVO

import Link from 'next/link';
// import Image from 'next/image'; // Ya no lo usamos si es un icono de Lucide
import { ChevronRight, Atom } from 'lucide-react'; // Importamos Atom
import { AnimatedTagline } from '@/components/ui/AnimatedTagline';

export default function SplashPage() {
  const actionLines = {
    es: "Accede a mi portafolio y explora mis servicios.",
    en: "Access my portfolio and explore my services."
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen flex-grow
                 overflow-hidden px-4
                 bg-slate-950 text-slate-100 relative isolate"
    >
      {/* FONDO DE AURORA MAXIMIZADO */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
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

      {/* Efecto de grid sutil (casi imperceptible o puedes quitarlo) */}
      <div className="absolute inset-0 -z-5 opacity-[0.02]">
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
                   animate-fade-in-up transform transition-all duration-300 hover:shadow-teal-400/15" // Glow del color del nuevo icono
      >
        <div className="mb-6 md:mb-8 transform transition-transform duration-500 hover:scale-110 animate-fade-in-up [animation-delay:0.2s]">
          {/* ICONO ATOM */}
          <Atom className="w-14 h-14 md:w-16 md:h-16 text-teal-300 mx-auto" strokeWidth={1.5} />
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

        <div className="w-full space-y-4 max-w-xs mx-auto animate-fade-in-up [animation-delay:1s]">
          <Link href="/es" passHref className="block w-full">
            <button
              className="w-full group relative flex items-center justify-center h-12 sm:h-14 px-6
                         bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 /* Gradiente ajustado */
                         hover:from-teal-400 hover:via-purple-400 hover:to-pink-400
                         rounded-lg text-sm sm:text-base font-semibold text-white
                         transition-all duration-300 ease-out
                         shadow-lg hover:shadow-purple-400/50 focus:shadow-purple-400/50
                         focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span className="mr-2 text-lg">🇪🇸</span> {/* Bandera Española */}
              Portafolio & servicios
              <ChevronRight className="ml-auto h-5 w-5 text-purple-200 transition-transform duration-300 group-hover:text-white group-hover:translate-x-1" />
            </button>
          </Link>
          <Link href="/en" passHref className="block w-full">
            <button
              className="w-full group relative flex items-center justify-center h-12 sm:h-14 px-6
                         bg-slate-700 hover:bg-slate-600
                         rounded-lg text-sm sm:text-base font-semibold text-white
                         transition-all duration-300 ease-out
                         shadow-lg hover:shadow-slate-500/40 focus:shadow-slate-500/50
                         focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
               <span className="mr-2 text-lg">🇬🇧</span> {/* Bandera Británica */}
              Portfolio & services
              <ChevronRight className="ml-auto h-5 w-5 text-slate-300 transition-transform duration-300 group-hover:text-white group-hover:translate-x-1" />
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