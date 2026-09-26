import type { Config } from "tailwindcss";

/**
 * Tokens de la landing «Orden» (especificación de diseño, apartado 2).
 *
 * Los colores van en formato rgb(... / <alpha-value>) para que funcionen los
 * modificadores de opacidad (`bg-ink/70`, `border-on-dark/40`...). Los mismos
 * valores viven como variables CSS en `globals.css` (para los CSS Modules y
 * las reglas que dependen de variables por elemento) y en hexadecimal en
 * `src/lib/palette.ts` (para los atributos de los SVG y las imágenes OG).
 * Si cambia un color, cambia en los tres sitios.
 */
const config: Config = {
  /* En táctil, `hover:` no se queda pegado tras un toque. */
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    /* Puntos de corte de la especificación (2.3) con su número en píxeles,
       para transcribirlos tal cual: `980:grid-cols-2`, `1180:flex`. Tailwind
       ordena las consultas por valor, así que el orden de las claves no
       altera la cascada. Para cortes puntuales (360, 560) usa `max-[359px]:`
       o `min-[560px]:`. */
    screens: {
      "400": "400px",
      "480": "480px",
      "600": "600px",
      "700": "700px",
      "768": "768px",
      "800": "800px",
      "980": "980px",
      "1024": "1024px",
      "1180": "1180px",
      "1280": "1280px",
    },
    extend: {
      colors: {
        /* Fondo general: hero, Qué hacemos, Quiénes somos, Contacto y campos. */
        bg: "rgb(247 246 242 / <alpha-value>)",
        /* Bandas de Proyectos y Preguntas, tarjeta del formulario, ventanas. */
        surface: "rgb(255 255 255 / <alpha-value>)",
        /* Escenario de ilustraciones y capturas (`sand`) y bloques neutros
           dentro de las ilustraciones (`sand-2`). */
        sand: {
          DEFAULT: "rgb(237 232 220 / <alpha-value>)",
          2: "rgb(226 219 203 / <alpha-value>)",
        },
        ink: {
          /* Titulares, texto fuerte e iconos de trazo. */
          DEFAULT: "rgb(16 16 19 / <alpha-value>)",
          /* Texto secundario y entradillas: 8,1:1 sobre `bg`. */
          2: "rgb(74 74 82 / <alpha-value>)",
          /* Texto pequeño con significado dentro de los SVG: 5,7:1 sobre blanco. */
          3: "rgb(102 102 110 / <alpha-value>)",
          /* Solo decoración o letras de columna dibujadas. Nunca texto con
             significado: 3,3:1. */
          4: "rgb(140 140 147 / <alpha-value>)",
        },
        line: {
          /* Filetes y bordes de filas. */
          DEFAULT: "rgb(227 223 213 / <alpha-value>)",
          /* Bordes de botón fantasma, campos y ventana de los SVG. */
          2: "rgb(206 201 189 / <alpha-value>)",
          /* Filetes sobre oscuro. Opacidad fija: no admite modificador. */
          dark: "rgba(247, 246, 242, 0.14)",
        },
        cobalt: {
          /* El del logo: acción, orden, estados «hecho» y foco. */
          DEFAULT: "rgb(39 67 224 / <alpha-value>)",
          /* Hover del botón principal y de los enlaces cobalto. */
          600: "rgb(29 51 179 / <alpha-value>)",
          /* Resaltado de fila y fondo del mensaje de enviado. */
          50: "rgb(236 239 253 / <alpha-value>)",
          /* Anillo de foco de campos y `::selection`. */
          100: "rgb(216 222 250 / <alpha-value>)",
          /* Cobalto del logo sobre oscuro: marcas, casillas, checks y foco. */
          bright: "rgb(107 131 255 / <alpha-value>)",
        },
        /* Solo el pósit del hero. */
        postit: {
          DEFAULT: "rgb(243 232 197 / <alpha-value>)",
          2: "rgb(234 221 178 / <alpha-value>)",
        },
        /* Banda «Cómo trabajamos» y pie (`dark`), hoja «Propuesta» (`dark-2`). */
        dark: {
          DEFAULT: "rgb(16 16 19 / <alpha-value>)",
          2: "rgb(25 25 30 / <alpha-value>)",
        },
        /* Texto sobre oscuro: principal, secundario (9,7:1) y pie legal (7,0:1). */
        "on-dark": {
          DEFAULT: "rgb(247 246 242 / <alpha-value>)",
          2: "rgb(185 185 191 / <alpha-value>)",
          3: "rgb(156 156 163 / <alpha-value>)",
        },
        /* Borde y mensajes de error del formulario: 6,5:1 sobre blanco. */
        error: "rgb(179 38 30 / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        /* Solo el logo. */
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      /* Escala tipográfica (2.2). Los titulares llevan su peso (560) dentro
         del tamaño, así que `text-h2` ya es un titular completo. Tipo frase y
         sin punto final. Entre 1180 y 1279 px el H1 del hero se fija en 3rem:
         `1180:max-[1279px]:text-[3rem]`. */
      fontSize: {
        h1: [
          "clamp(2.125rem, 1.25rem + 3.3vw, 3.75rem)",
          { lineHeight: "1.03", letterSpacing: "-0.03em", fontWeight: "560" },
        ],
        h2: [
          "clamp(1.875rem, 1.25rem + 2.2vw, 3.125rem)",
          { lineHeight: "1.06", letterSpacing: "-0.026em", fontWeight: "560" },
        ],
        "feature-name": [
          "clamp(1.75rem, 1.4rem + 1.2vw, 2.375rem)",
          { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "560" },
        ],
        h3: ["1.3125rem", { lineHeight: "1.25", letterSpacing: "-0.014em", fontWeight: "600" }],
        /* Entradillas: acompañar de `text-ink-2 text-pretty`. */
        lead: ["clamp(1.0625rem, 0.99rem + 0.33vw, 1.25rem)", { lineHeight: "1.55" }],
        body: ["1.0625rem", { lineHeight: "1.6" }],
        small: ["0.9375rem", { lineHeight: "1.5" }],
        caption: ["0.875rem", { lineHeight: "1.45" }],
        micro: ["0.8125rem", { lineHeight: "1.5" }],
        /* Botones: los aplica `Button`, no hace falta usarlos a mano. */
        "button-sm": ["0.9375rem", { lineHeight: "1", letterSpacing: "-0.005em", fontWeight: "600" }],
        button: ["1rem", { lineHeight: "1", letterSpacing: "-0.005em", fontWeight: "600" }],
        "button-lg": ["1.0625rem", { lineHeight: "1", letterSpacing: "-0.005em", fontWeight: "600" }],
      },
      /* Peso de los titulares, por si hace falta fuera de `text-h1/h2`. */
      fontWeight: {
        title: "560",
      },
      /* Ritmo (2.3). Las variables se definen en `globals.css`. */
      spacing: {
        /* Margen lateral del contenedor: 20 px a 390, 56 px desde 1120. */
        gutter: "var(--pad)",
        /* Alto de la cabecera: 60 · 64 desde 600 · 72 desde 1180. */
        header: "var(--head-h)",
        /* Relleno vertical de sección: 80 a 136 px. */
        section: "var(--section-y)",
        /* Arranque de «Qué hacemos», que viene tras la franja de compromisos. */
        "section-tight": "var(--section-y-tight)",
        /* Cabecera de sección → contenido: 40 a 72 px. */
        "sec-head": "var(--sec-head-gap)",
      },
      /* Radios (2.4). Marcas, casillas y cuadrados de estado van sin radio. */
      borderRadius: {
        /* Botones y campos. */
        control: "9px",
        /* Capturas dentro de su escenario y hoja «Propuesta». */
        shot: "8px",
        /* Retrato. */
        portrait: "12px",
        /* Tarjetas de ilustración y de captura, tarjeta de llamada. */
        card: "14px",
        /* Escenario de Padel Club OS. */
        feature: "16px",
        /* Tarjeta del formulario. */
        form: "18px",
        /* Chips, píldoras y el control de pausa. */
        pill: "999px",
      },
      /* Sombras neutras, nunca de color (2.4). */
      boxShadow: {
        capture:
          "0 1px 0 rgba(16,16,19,.04), 0 18px 40px -18px rgba(16,16,19,.28), 0 0 0 1px rgba(16,16,19,.07)",
        phone: "0 0 0 4px #101013, 0 22px 40px -14px rgba(16,16,19,.45)",
        "phone-lg": "0 0 0 5px #101013, 0 24px 44px -16px rgba(16,16,19,.4)",
        form: "0 30px 60px -40px rgba(16,16,19,.25)",
        menu: "0 24px 40px -24px rgba(16,16,19,.18)",
      },
      /* Curvas de 4.0: entradas, vuelos y rebote de encaje. */
      transitionTimingFunction: {
        soft: "cubic-bezier(.2,.75,.2,1)",
        io: "cubic-bezier(.65,0,.25,1)",
        snap: "cubic-bezier(.3,1.35,.55,1)",
      },
    },
  },
  plugins: [],
};

export default config;
