import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* 1440 es el lienzo de referencia del diseño: por encima cambian los
         márgenes (40 → 60) y la retícula del hero. */
      screens: {
        wide: "1440px",
      },
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
          faint: "rgb(106 104 93 / <alpha-value>)",
        },
        cobalt: {
          DEFAULT: "rgb(39 67 224 / <alpha-value>)",
          deep: "rgb(30 53 184 / <alpha-value>)",
          bright: "rgb(107 131 255 / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(226 224 216 / <alpha-value>)",
          2: "rgb(216 214 204 / <alpha-value>)",
          dark: "rgba(247, 246, 242, 0.12)",
        },
        /* Borde de las capturas apoyadas sobre papel */
        shot: "rgb(210 210 194 / <alpha-value>)",
        error: {
          DEFAULT: "rgb(212 103 74 / <alpha-value>)",
          soft: "rgb(229 139 115 / <alpha-value>)",
        },
        /* Color propio de cada producto: solo dentro de su escenario */
        escena: {
          padel: "rgb(14 92 63 / <alpha-value>)",
          "padel-borde": "rgb(11 36 26 / <alpha-value>)",
          "padel-texto": "rgb(246 243 237 / <alpha-value>)",
          wms: "rgb(10 12 24 / <alpha-value>)",
          "wms-borde": "rgb(38 43 74 / <alpha-value>)",
          "wms-texto": "rgb(163 168 199 / <alpha-value>)",
          evento: "rgb(233 233 225 / <alpha-value>)",
          "evento-texto": "rgb(88 3 1 / <alpha-value>)",
          radio: "rgb(0 77 152 / <alpha-value>)",
          "radio-texto": "rgb(250 250 248 / <alpha-value>)",
          parrilla: "rgb(246 243 237 / <alpha-value>)",
          "parrilla-borde": "rgb(221 215 204 / <alpha-value>)",
        },
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
