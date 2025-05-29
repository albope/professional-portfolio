// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'aurora-spin': 'aurora-spin 20s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'subtle-pulse': 'subtle-pulse 2.5s ease-in-out infinite alternate', // Para el icono Monitor
        'button-callout-pulse': 'button-callout-pulse 2.5s infinite ease-in-out', // NUEVA animación para los botones
      },
      keyframes: {
        'aurora-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'subtle-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        'button-callout-pulse': { // NUEVOS keyframes para la animación de los botones
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' // Sombra base (ejemplo de shadow-lg)
          },
          '50%': {
            transform: 'scale(1.03)', // Aumenta tamaño un 3%
            boxShadow: '0 10px 20px -3px rgba(192, 132, 252, 0.3), 0 4px 12px -2px rgba(192, 132, 252, 0.2)' // Sombra más pronunciada y coloreada (ej. morado)
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;