'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Configuramos la perspectiva para el efecto 3D
      style={{ perspective: 1000 }} 
      
      // ESTADO INICIAL:
      // - Invisible (opacity: 0)
      // - Desplazado abajo (y: 80)
      // - Más pequeño (scale: 0.92)
      // - Inclinado hacia atrás (rotateX: 10deg)
      // - Muy desenfocado (blur: 20px)
      initial={{ 
        opacity: 0, 
        y: 80, 
        scale: 0.92,
        rotateX: 10, 
        filter: 'blur(20px)' 
      }}
      
      // ESTADO FINAL (Visible y plano):
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        rotateX: 0, 
        filter: 'blur(0px)' 
      }}
      
      // SALIDA (Al irse):
      exit={{ 
        opacity: 0, 
        y: -40, 
        scale: 0.95, 
        filter: 'blur(10px)',
        transition: { duration: 0.4, ease: "easeIn" }
      }}
      
      // FÍSICA:
      // Usamos "spring" (muelle) con masa extra para que se sienta "pesado" y premium.
      // stiffness bajo + damping ajustado = movimiento majestuoso y lento al final.
      transition={{ 
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 1.2 
      }}
      
      className="w-full origin-top" // El punto de pivote es la parte superior
    >
      {children}
    </motion.div>
  );
}