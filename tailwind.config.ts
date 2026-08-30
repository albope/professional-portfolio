import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* Colores en formato rgb(... / <alpha-value>) para que funcionen los
         modificadores de opacidad (text-paper/60, bg-cobalt-bright/35...).
         Valores canónicos documentados en globals.css. */
      colors: {
        paper: {
          DEFAULT: "rgb(247 246 242 / <alpha-value>)",
          2: "rgb(239 237 230 / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(16 16 19 / <alpha-value>)",
          2: "rgb(24 24 28 / <alpha-value>)",
          soft: "rgb(61 60 53 / <alpha-value>)",
          mute: "rgb(90 89 79 / <alpha-value>)",
          faint: "rgb(138 136 125 / <alpha-value>)",
        },
        cobalt: {
          DEFAULT: "rgb(39 67 224 / <alpha-value>)",
          deep: "rgb(30 53 184 / <alpha-value>)",
          bright: "rgb(107 131 255 / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(226 224 216 / <alpha-value>)",
          dark: "rgba(247, 246, 242, 0.12)",
        },
        error: "rgb(212 103 74 / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        display: ["var(--font-archivo-black)", "system-ui", "sans-serif"],
        mono: ["var(--font-fragment-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        /* Escala display (Archivo Black, caja alta) */
        "display-hero": [
          "clamp(2.5rem, 6.2vw, 5.5rem)",
          { lineHeight: "0.96", letterSpacing: "-0.01em" },
        ],
        "display-case": [
          "clamp(2.125rem, 5vw, 4.5rem)",
          { lineHeight: "0.98", letterSpacing: "-0.01em" },
        ],
        "display-sec": [
          "clamp(1.875rem, 3.9vw, 3.375rem)",
          { lineHeight: "1.02", letterSpacing: "-0.01em" },
        ],
        lead: ["clamp(1rem, 1.35vw, 1.1875rem)", { lineHeight: "1.6" }],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
