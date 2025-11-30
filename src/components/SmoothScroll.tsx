'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  
  // Configuración física "High-End" (Efecto Mantequilla)
  const lenisOptions = {
    lerp: 0.07,         // Inercia (Más bajo = más peso/suavidad). Default es 0.1.
    duration: 1.2,      // Duración del deslizamiento.
    smoothWheel: true,
    wheelMultiplier: 1.1, // Un poco más rápido para que no se sienta "pegajoso" con el lerp bajo.
    touchMultiplier: 2,   // Sensibilidad táctil.
    orientation: 'vertical' as const, // FIX: 'as const' le dice a TS que esto SIEMPRE será 'vertical'
    gestureOrientation: 'vertical' as const, // FIX: Igual aquí
    smoothTouch: false,   // En móviles, el scroll nativo suele sentirse mejor. Cambiar a true si quieres forzarlo.
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}