// tailwind.config.js

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Usar modo oscuro basado en clases
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Puedes agregar extensiones al tema aquí si lo necesitas
    },
  },
  plugins: [],
};

export default config;