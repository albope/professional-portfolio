'use client';

import Link from 'next/link';
import { motion, Variants, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Users, CheckCircle, ChevronRight, MapPin, Globe } from 'lucide-react';
import { MouseEvent } from 'react';

export default function SplashPage() {
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const textVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-slate-200 overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-100">
      
      {/* Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay"></div>
      
      {/* Grid Layout */}
      <main className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-12">
        
        {/* --- COLUMNA IZQUIERDA: IDENTIDAD --- */}
        <motion.div 
          className="flex flex-col justify-center border-b border-white/[0.08] lg:col-span-7 lg:border-b-0 lg:border-r p-6 py-24 sm:p-12 lg:p-24 relative min-h-[60vh] lg:min-h-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top Line */}
          <motion.div variants={textVariants} className="absolute top-8 sm:top-12 left-6 sm:left-8 lg:left-24 flex flex-wrap items-center justify-start w-[calc(100%-3rem)] lg:w-auto gap-6">
             <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs text-indigo-400/80 tracking-widest">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>SYSTEM ONLINE</span>
                <span className="text-slate-600">|</span>
                <span>EST. 2025</span>
             </div>
          </motion.div>

          {/* Main Title Block */}
          <div className="relative z-10 mt-4 lg:mt-0">
            <motion.h1 variants={textVariants} className="font-serif text-6xl sm:text-9xl lg:text-[10rem] xl:text-[11rem] tracking-tighter text-white leading-[0.85]">
              Alberto <br />
              <span className="italic text-slate-400 font-light">Bort</span>
            </motion.h1>
            
            <motion.div variants={textVariants} className="mt-8 sm:mt-12 flex flex-col gap-8 sm:gap-10 max-w-xl">
              <p className="text-lg sm:text-2xl lg:text-3xl text-slate-400 font-light leading-snug">
                Arquitectura de Soluciones Digitales & <br className="hidden sm:block"/>
                Diseño de Experiencias <span className="text-white font-normal">Premium</span>.
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                 <div className="flex -space-x-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030303] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#030303] bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] font-mono">
                       50+
                    </div>
                 </div>
                 <div className="flex flex-col font-mono">
                    <span className="text-xs text-indigo-300 uppercase tracking-widest flex items-center gap-2 mb-1">
                      CLIENTS SATISFIED
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">GLOBAL OPERATIONS</span>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Info */}
          <motion.div variants={textVariants} className="absolute bottom-8 lg:bottom-12 left-6 sm:left-8 lg:left-24 text-[10px] text-indigo-400/60 font-mono tracking-widest uppercase flex flex-col sm:flex-row gap-2 sm:gap-6">
            <span className="flex items-center gap-2">
              [ LOCATION: VALENCIA ]
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>STATUS: OPEN FOR COMMISSIONS</span>
          </motion.div>
        </motion.div>


        {/* --- COLUMNA DERECHA: NAVEGACIÓN --- */}
        <motion.div 
          className="flex flex-col justify-center bg-white/[0.01] lg:col-span-5 p-6 sm:p-12 lg:p-24 min-h-[40vh] lg:min-h-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.5 }}
        >
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            
            {/* Header de Selección */}
            <div className="mb-10 sm:mb-12">
                <h2 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">✦</span>
                  <span>COMENZAR / START</span>
                  <span className="w-2 h-4 bg-indigo-500 animate-pulse ml-1"></span>
                </h2>
                
                <p className="text-sm text-slate-400 font-light leading-relaxed max-w-sm border-l border-white/10 pl-4 py-1">
                  Por favor, selecciona tu ubicación para personalizar el contenido y ver los servicios disponibles en tu región.
                </p>
            </div>
            
            <div className="flex flex-col gap-6"> 
              
              <ServiceLink 
                href="/es" 
                index="01"
                title="Spain & Latam" 
                subtitle="Versión en Español · Consultoría & Desarrollo"
                icon={MapPin}
              />

              <ServiceLink 
                href="/en" 
                index="02"
                title="International" 
                subtitle="English Version · Digital Services"
                icon={Globe}
              />
              
            </div>
          </div>

          {/* Footer Derecho */}
          <div className="mt-16 sm:mt-20 text-xs text-indigo-400/60 leading-relaxed font-mono max-w-xs">
            <p className="flex flex-col gap-1">
              <span className="text-slate-500">// Portfolio 2025</span>
              <span>Desarrollo web de alto rendimiento y diseño estratégico.</span>
            </p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}

// --- COMPONENTE CRYSTAL GLASS (Estilo Apple Vision / Linear) ---
function ServiceLink({ href, title, subtitle, icon: Icon, index }: { href: string, title: string, subtitle: string, icon: any, index: string }) {
  
  // Variables para el efecto Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Link href={href} className="group relative block w-full outline-none">
      
      <div 
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-colors duration-500 hover:bg-white/[0.04]"
        onMouseMove={handleMouseMove}
      >
        {/* Spotlight Effect: Luz que sigue al ratón */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.1),
                transparent 80%
              )
            `,
          }}
        />

        <div className="relative flex items-center justify-between py-6 px-6 sm:py-8 sm:px-8">
          
          <div className="flex items-center gap-6">
             {/* Icono Flotante: Sin caja, solo cristal puro */}
             <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 shadow-inner ring-1 ring-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                <Icon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
             </div>

             <div className="flex flex-col gap-1.5">
                <h3 className="text-2xl sm:text-3xl font-serif text-slate-200 group-hover:text-white transition-colors duration-300 tracking-tight">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 group-hover:text-indigo-200 transition-colors duration-300 font-light">
                  {subtitle}
                </p>
             </div>
          </div>

          {/* Indicador sutil a la derecha */}
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-mono text-white/20 group-hover:text-white/40 transition-colors">
               0{index}
             </span>
             <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300">
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
             </div>
          </div>

        </div>
      </div>
    </Link>
  );
}