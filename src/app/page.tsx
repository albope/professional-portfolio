'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, Users, CheckCircle, Github } from 'lucide-react';

export default function SplashPage() {
  
  // Variantes de animación más lentas y fluidas (Cinemáticas)
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
          // AJUSTE MOBILE: p-6 en lugar de p-8 para más espacio lateral. py-24 para evitar solapamiento vertical.
          className="flex flex-col justify-center border-b border-white/[0.08] lg:col-span-7 lg:border-b-0 lg:border-r p-6 py-24 sm:p-12 lg:p-24 relative min-h-[60vh] lg:min-h-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top Line */}
          <motion.div variants={textVariants} className="absolute top-8 sm:top-12 left-6 sm:left-8 lg:left-24 flex flex-wrap items-center justify-start w-[calc(100%-3rem)] lg:w-auto gap-6">
             <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-indigo-500/50"></div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-mono font-medium">Est. 2025</span>
             </div>
          </motion.div>

          {/* Main Title Block */}
          <div className="relative z-10 mt-4 lg:mt-0">
            {/* AJUSTE MOBILE: text-6xl base para evitar cortes en pantallas pequeñas */}
            <motion.h1 variants={textVariants} className="font-serif text-6xl sm:text-9xl lg:text-[10rem] xl:text-[11rem] tracking-tighter text-white leading-[0.85]">
              Alberto <br />
              <span className="italic text-slate-300 font-light">Bort</span>
            </motion.h1>
            
            <motion.div variants={textVariants} className="mt-8 sm:mt-12 flex flex-col gap-8 sm:gap-10 max-w-xl">
              {/* Descripción */}
              <p className="text-lg sm:text-2xl lg:text-3xl text-slate-400 font-light leading-snug">
                Arquitectura de Soluciones Digitales & <br className="hidden sm:block"/>
                Diseño de Experiencias <span className="text-white font-normal">Premium</span>.
              </p>

              {/* Social Proof (+50 Clientes) */}
              <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                 <div className="flex -space-x-4">
                    {/* Avatares abstractos */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030303] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#030303] bg-indigo-500 flex items-center justify-center text-white font-bold text-[10px]">
                       +50
                    </div>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm text-white font-medium tracking-wide flex items-center gap-2">
                      Satisfied Clients
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Across Europe & Latam</span>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Info */}
          <motion.div variants={textVariants} className="absolute bottom-8 lg:bottom-12 left-6 sm:left-8 lg:left-24 text-[10px] text-indigo-400 font-mono tracking-widest uppercase flex flex-col sm:flex-row gap-2 sm:gap-4">
            <span>Based in Valencia, Spain</span>
            <span className="hidden sm:inline text-indigo-400/50">|</span>
            <span>Available for Select Commissions</span>
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
            <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.25em] mb-8 sm:mb-10 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Select Scope
            </h2>
            
            <div className="flex flex-col border-t border-white/[0.1]">
              
              {/* Opción ES */}
              <ServiceLink 
                href="/es" 
                index="01"
                title="Spain & Latam" 
                subtitle="Consultoría Estratégica & Desarrollo"
              />

              {/* Opción EN */}
              <ServiceLink 
                href="/en" 
                index="02"
                title="International" 
                subtitle="Global Architecture & Engineering"
              />
              
            </div>
            <div className="w-full h-px bg-white/[0.1]"></div>
          </div>

          {/* Footer Derecho */}
          <div className="mt-12 sm:mt-16 text-xs text-indigo-400 leading-relaxed font-mono max-w-xs">
            <p>
              // SPECIALIZED IN HIGH-PERFORMANCE WEB APPLICATIONS. DELIVERING THE HIGHEST STANDARD IN DIGITAL ENGINEERING.
            </p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}

// --- COMPONENTE DE ENLACE ---
function ServiceLink({ href, title, subtitle, index }: { href: string, title: string, subtitle: string, index: string }) {
  return (
    <Link href={href} className="group relative block w-full outline-none">
      <div className="relative flex items-baseline justify-between py-8 sm:py-12 px-2 sm:px-4 transition-all duration-500 hover:bg-white/[0.04] cursor-pointer overflow-hidden">
        
        {/* Opción 1: Highlight lateral que "respira" */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/40 animate-pulse group-hover:opacity-100 group-hover:animate-none group-hover:bg-indigo-500 transition-all duration-300"></div>

        <div className="flex flex-col gap-2 z-10 w-full">
          <div className="flex items-center gap-4 sm:gap-6">
             <span className="text-xs font-mono text-slate-600 group-hover:text-indigo-400 transition-colors font-bold flex-shrink-0">
              {index}
            </span>
            {/* AJUSTE MOBILE: Tamaño de texto reactivo */}
            <h3 className="text-3xl sm:text-5xl font-serif text-slate-200 group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-500 pl-8 sm:pl-10 group-hover:text-slate-300 transition-colors duration-300 font-light tracking-wide">
            {subtitle}
          </p>
        </div>
        
        {/* Flecha Animada */}
        <div className="relative flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/[0.05] group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all duration-300 ml-2">
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
        </div>

      </div>
      {/* Línea divisoria */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/[0.08] group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
    </Link>
  );
}