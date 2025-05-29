// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Asegúrate que esta ruta captura bien tus archivos en src/app/[lang]
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        // 'fade-in-down': 'fade-in-down 0.6s ease-out forwards', // Ya no la usamos directamente en este diseño
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
      keyframes: {
        // 'fade-in-down': {
        //   '0%': { opacity: '0', transform: 'translateY(-20px)' },
        //   '100%': { opacity: '1', transform: 'translateY(0)' },
        // },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;