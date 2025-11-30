import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // Importante: Array para mejor compatibilidad
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // --- NUEVA CONFIGURACIÓN DE FUENTES ---
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],       // Conecta font-serif con Playfair Display
        sans: ["var(--font-geist-sans)", "sans-serif"], // Conecta font-sans con Geist Sans
        mono: ["var(--font-geist-mono)", "monospace"],  // Conecta font-mono con Geist Mono
      },
      // --------------------------------------
      colors: {
        // AQUÍ CONECTAMOS LAS VARIABLES CSS DE GLOBALS.CSS
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // TUS ANIMACIONES ANTERIORES (Las mantengo intactas)
      animation: {
        'aurora-spin': 'aurora-spin 20s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'subtle-pulse': 'subtle-pulse 2.5s ease-in-out infinite alternate',
        'button-callout-pulse': 'button-callout-pulse 2.5s infinite ease-in-out',
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
        'button-callout-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          },
          '50%': {
            transform: 'scale(1.03)',
            boxShadow: '0 10px 20px -3px rgba(192, 132, 252, 0.3), 0 4px 12px -2px rgba(192, 132, 252, 0.2)'
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