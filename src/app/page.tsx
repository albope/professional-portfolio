// src/app/page.tsx (Splash Page - REFINADA CON FONDOS CLAROS)
import Link from 'next/link';
import { ChevronRight, Layers } from 'lucide-react'; 
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
                 bg-slate-100 text-slate-800 relative transition-colors duration-300" 
                 // FONDO: slate-100 (gris muy claro)
                 // TEXTO: slate-800 (oscuro)
    >
      {/* Efecto de grid sutil en el fondo */}
      <div className="absolute inset-0 z-0 opacity-50">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="subtleGridPattern" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" className="stroke-slate-300" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#subtleGridPattern)" />
        </svg>
      </div>
      
      <main 
        className="relative z-10 flex flex-col items-center justify-center text-center 
                   p-8 py-10 sm:p-12 md:p-16
                   bg-white // FONDO DEL RECUADRO: blanco sólido
                   border border-slate-200    
                   rounded-2xl shadow-xl        
                   max-w-lg w-full                
                   animate-fade-in-up" 
      >
        <div className="mb-8 transform transition-transform duration-500 hover:scale-110 animate-fade-in-up [animation-delay:0.2s]">
          <Layers className="w-12 h-12 text-blue-600 mx-auto" />
        </div>
        
        <div className="animate-fade-in-up [animation-delay:0.4s]">
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 mb-3 tracking-tight">
            Alberto Bort
          </h1>
        </div>

        <div className="animate-fade-in-up [animation-delay:0.6s]">
          <p className="text-lg sm:text-xl text-slate-600 mb-8 tracking-normal">
            Digital Solutions Architect & Itinerary Designer
          </p>
        </div>
        
        <div className="animate-fade-in-up [animation-delay:0.8s] min-h-[2.5em] flex items-center justify-center">
            <AnimatedTagline 
              lines={actionLines} 
              duration={4000}
              className="text-md text-slate-500 mb-10" // Texto gris medio para la tagline animada
            />
        </div>

        <div className="w-full space-y-4 max-w-xs mx-auto animate-fade-in-up [animation-delay:1s]">
          <Link href="/es" passHref className="block w-full">
            <button 
              className="w-full group relative flex items-center justify-center h-12 sm:h-14 px-6 
                         bg-blue-600 rounded-lg
                         text-sm sm:text-base font-medium text-white 
                         transition-all duration-300 ease-out
                         hover:bg-blue-700 hover:shadow-md focus:shadow-blue-500/50
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white
                         transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="mr-2 text-lg">🇪🇸</span>
              Portafolio & servicios
              <ChevronRight className="ml-auto h-5 w-5 text-slate-200 transition-transform duration-300 group-hover:text-white group-hover:translate-x-1" />
            </button>
          </Link>
          <Link href="/en" passHref className="block w-full">
            <button 
              // NUEVO COLOR PARA EL BOTÓN INGLÉS
              className="w-full group relative flex items-center justify-center h-12 sm:h-14 px-6
                         bg-slate-700 rounded-lg // Color base: gris oscuro (slate-700)
                         text-sm sm:text-base font-medium text-white 
                         transition-all duration-300 ease-out
                         hover:bg-slate-800 hover:shadow-md focus:shadow-slate-500/50 // Hover más oscuro
                         focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-white
                         transform hover:-translate-y-0.5 active:translate-y-0"
            >
               <span className="mr-2 text-lg">🇬🇧</span>
              Portfolio & services
              <ChevronRight className="ml-auto h-5 w-5 text-slate-200 transition-transform duration-300 group-hover:text-white group-hover:translate-x-1" />
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