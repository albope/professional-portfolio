// src/components/ui/AnimatedTagline.tsx
'use client';

import { useState, useEffect } from 'react';

interface AnimatedTaglineProps {
  lines: {
    es: string;
    en: string;
  };
  langOrder?: ('es' | 'en')[];
  duration?: number; // Tiempo que cada frase es visible
  className?: string;
}

const FADE_DURATION = 500; // Duración de la transición de opacidad en ms

export const AnimatedTagline: React.FC<AnimatedTaglineProps> = ({ 
  lines, 
  langOrder = ['es', 'en'], 
  duration = 3500, // Tiempo total visible de una frase
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState(lines[langOrder[0]]);
  const [isVisible, setIsVisible] = useState(false); // Inicia invisible para hacer fade-in

  useEffect(() => {
    // Fade-in inicial
    const initialFadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Pequeño delay para el primer fade-in

    const intervalId = setInterval(() => {
      setIsVisible(false); // 1. Empieza a desvanecer

      setTimeout(() => { // 2. Espera a que termine el desvanecimiento
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % langOrder.length;
          setCurrentText(lines[langOrder[nextIndex]]);
          return nextIndex;
        });
        setIsVisible(true); // 3. Empieza a aparecer la nueva frase
      }, FADE_DURATION); 
    }, duration + FADE_DURATION); // El ciclo completo es: visible (duration) + invisible (FADE_DURATION)

    return () => {
      clearTimeout(initialFadeInTimer);
      clearInterval(intervalId);
    };
  }, [duration, lines, langOrder]);

  return (
    <p 
      className={`transition-opacity ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${FADE_DURATION}ms` }} // Aplica la duración del fade aquí
    >
      {currentText.split('<br/>').map((line, index, arr) => (
        <span key={index}>
          {line}
          {index < arr.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
};