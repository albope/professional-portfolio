import Link from 'next/link';
import { ChevronRight, Spline } from 'lucide-react'; 
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
                 bg-slate-900 text-slate-200 relative isolate" 
    >
      {/* FONDO DE AURORA */}
      <div className="absolute inset-0 -z-10 overflow-hidden"> {/* z-index inferior para que esté detrás de todo */}
        <div className="absolute left-1/2 top-1/2 h-[120rem] w-[120rem] -translate-x-1/2 -translate-y-1/2"> {/* Contenedor grande para la aurora */}
          <div
            className="absolute -top-1/4 left-[10%] h-[80rem] w-[80rem]
                       bg-gradient-radial from-purple-600/30 via-transparent to-transparent  /* Opacidad reducida a /30 */
                       animate-aurora-spin"
            style={{ animationDuration: '28s', animationDelay: '-3s' }} // Duraciones y delays diferentes
          />
          <div
            className="absolute -bottom-1/4 right-[10%] h-[70rem] w-[70rem]
                       bg-gradient-radial from-sky-500/30 via-transparent to-transparent /* Opacidad reducida a /30 */
                       animate-aurora-spin"
            style={{ animationDuration: '24s', animationDelay: '-1s' }} // Duraciones y delays diferentes
          />
           {/* Tercera luz para más profundidad (opcional) */}
          <div
            className="absolute -bottom-1/3 left-[20%] h-[60rem] w-[60rem]
                       bg-gradient-radial from-emerald-500/20 via-transparent to-transparent /* Opacidad muy baja */
                       animate-aurora-spin"
            style={{ animationDuration: '30s', animationDelay: '-2s' }}
          />
        </div>
      </div>

      {/* Efecto de grid sutil sobre la aurora pero detrás del contenido principal */}
      <div className="absolute inset-0 -z-5 opacity-5 md:opacity-[0.03]"> {/* Aún más sutil */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="subtleGridPattern" width="35" height="35" patternUnits="userSpaceOnUse"> {/* Patrón más grande */}
              <path d="M 35 0 L 0 0 0 35" fill="none" className="stroke-slate-700/50" strokeWidth="0.3"/> {/* Líneas más tenues */}
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
                   border border-slate-700/40  /* Borde más sutil */
                   bg-slate-800/70 backdrop-blur-xl /* Blur más intenso, un poco más opaco el fondo */
                   shadow-2xl shadow-black/40 /* Sombra más oscura y genérica para el fondo */
                   animate-fade-in-up transform transition-all duration-300 hover:shadow-purple-500/20" // Sutil glow en hover
      >
        <div className="mb-6 md:mb-8 transform transition-transform duration-500 hover:scale-110 animate-fade-in-up [animation-delay:0.2s]">
          {/* ICONO SPLINE */}
          <Spline className="w-14 h-14 md:w-16 md:h-16 text-sky-300 mx-auto" strokeWidth={1.25} />
        </div>

        <div className="animate-fade-in-up [animation-delay:0.4s]">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-50 mb-3 tracking-tight">
            Alberto Bort
          </h1>
        </div>

        <div className="animate-fade-in-up [animation-delay:0.6s]">
          <p className="text-lg sm:text-xl text-slate-400 mb-8 tracking-normal">
            Digital Solutions Architect & Itinerary Designer
          </p>
        </div>

        <div className="animate-fade-in-up [animation-delay:0.8s] min-h-[2.5em] md:min-h-[3em] flex items-center justify-center">
            <AnimatedTagline
              lines={actionLines}
              duration={4000}
              className="text-md text-slate-400/80 mb-10"
            />
        </div>

        <div className="w-full space-y-4 max-w-xs mx-auto animate-fade-in-up [animation-delay:1s]">
          <Link href="/es" passHref className="block w-full">
            <button
              className="w-full group relative flex items-center justify-center h-12 sm:h-14 px-6
                         bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500
                         rounded-lg text-sm sm:text-base font-semibold text-white
                         transition-all duration-300 ease-out
                         shadow-lg hover:shadow-purple-500/40 focus:shadow-purple-500/50
                         focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800
                         transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="mr-2 text-lg">🇪🇸</span>
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
                         focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800
                         transform hover:-translate-y-0.5 active:translate-y-0"
            >
               <span className="mr-2 text-lg">🇬🇧</span>
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