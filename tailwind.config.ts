import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--paper)",
          2: "var(--paper-2)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
        },
        cobalt: {
          DEFAULT: "var(--cobalt)",
          deep: "var(--cobalt-deep)",
          bright: "var(--cobalt-bright)",
        },
        line: {
          DEFAULT: "var(--line)",
          dark: "var(--line-dark)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.65rem, 6.5vw, 5.5rem)",
          { lineHeight: "1.03", letterSpacing: "-0.035em" },
        ],
        "display-lg": [
          "clamp(2.15rem, 5vw, 4rem)",
          { lineHeight: "1.06", letterSpacing: "-0.03em" },
        ],
        "display-md": [
          "clamp(1.7rem, 3.5vw, 2.65rem)",
          { lineHeight: "1.12", letterSpacing: "-0.022em" },
        ],
        "display-sm": [
          "clamp(1.3rem, 2.4vw, 1.7rem)",
          { lineHeight: "1.22", letterSpacing: "-0.015em" },
        ],
        lead: ["clamp(1.0625rem, 1.4vw, 1.1875rem)", { lineHeight: "1.65" }],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
