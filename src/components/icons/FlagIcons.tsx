// src/components/icons/FlagIcons.tsx
import React from 'react';

// La interfaz FlagProps se elimina ya que no añade nuevos miembros a React.SVGProps<SVGSVGElement>

export const SpanishFlagIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 75 50" // Proporción 3:2 de la bandera de España
    className={className}
    aria-hidden="true" // Buena práctica para SVGs decorativos si el texto del botón ya describe la acción
    {...props}
  >
    <rect width="75" height="50" fill="#C60B1E" /> {/* Rojo */}
    <rect width="75" height="25" y="12.5" fill="#FFC400" /> {/* Amarillo (franja central) */}
  </svg>
);

export const BritishFlagIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  // Esta es una representación simplificada de la Union Jack para un icono.
  // Para una versión perfecta, considera usar una librería de iconos de banderas o un SVG más detallado.
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 30" // Proporción 5:3 de la Union Jack
    className={className}
    aria-hidden="true" // Buena práctica para SVGs decorativos
    {...props}
  >
    <defs>
      <clipPath id="uk-flag-clip">
        <rect width="50" height="30" />
      </clipPath>
    </defs>
    <g clipPath="url(#uk-flag-clip)">
      {/* Fondo azul */}
      <rect width="50" height="30" fill="#012169" />
      {/* Saltire de San Andrés (blanco) */}
      <path d="M0,0 L50,30 M50,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      {/* Saltire de San Patricio (rojo, más fino, encima del blanco para el efecto de fimbriación) */}
      <path d="M0,0 L50,30 M50,0 L0,30" stroke="#C8102E" strokeWidth="3.6" />
      {/* Cruz de San Jorge (blanco más ancho, luego rojo más fino) */}
      <path d="M25,0 V30 M0,15 H50" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M25,0 V30 M0,15 H50" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);