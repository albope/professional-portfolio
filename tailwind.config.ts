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
        'aurora-spin': 'aurora-spin 20s linear infinite', // Para el fondo aurora
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'subtle-pulse': 'subtle-pulse 2.5s ease-in-out infinite alternate', // NUEVA animación para el icono
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
        'subtle-pulse': { // NUEVOS keyframes para la animación del icono
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }, // Crece un 5%
          '100%': { transform: 'scale(1)' },
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