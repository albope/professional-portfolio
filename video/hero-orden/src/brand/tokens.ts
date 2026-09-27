import type {CSSProperties} from "react";

/**
 * Identidad «Orden» de bpmtechstudio.com. Los valores salen de
 * `src/lib/palette.ts` y `src/app/globals.css` de la web; los grises de dibujo
 * (celda, barra, papel, renglón) son los de la ilustración SVG que sustituyó
 * este vídeo (`git show 639331e:src/components/hero/HeroArt.tsx`).
 */
export const color = {
  bg: "#F7F6F2",
  surface: "#FFFFFF",
  ink: "#101013",
  ink2: "#4A4A52",
  ink3: "#66666E",
  ink4: "#8C8C93",
  cobalt: "#2743E0",
  cobalt600: "#1D33B3",
  cobalt50: "#ECEFFD",
  cobalt100: "#D8DEFA",
  line: "#E3DFD5",
  line2: "#CEC9BD",
  postit: "#F3E8C5",
  postit2: "#EADDB2",
  pastilla: "#F2F0EA",
  celda: "#DAD5CA",
  barra: "#D9D5CB",
  papel: "#FCFBF7",
  renglon: "#E6E1D6",
} as const;

export const font = {
  sans: "'Schibsted Grotesk Variable', 'Schibsted Grotesk', system-ui, sans-serif",
  mono: "'Fragment Mono', ui-monospace, monospace",
} as const;

export const radius = {window: 14, row: 10, pill: 999, button: 8} as const;

/** Sombras muy suaves, como las de la ilustración de la web. */
export const shadow = {
  window: "0 20px 40px rgba(16,16,19,0.09)",
  piece: "0 8px 14px rgba(16,16,19,0.10)",
} as const;

/** Titulares: Schibsted a 560, tracking ligeramente negativo. */
export const displayStyle = (size: number, weight = 560): CSSProperties => ({
  fontFamily: font.sans,
  fontSize: size,
  fontWeight: weight,
  letterSpacing: "-0.02em",
  lineHeight: 1.08,
  color: color.ink,
  fontVariantNumeric: "tabular-nums",
});

/** Texto de interfaz. */
export const textStyle = (size: number, weight = 400, c: string = color.ink): CSSProperties => ({
  fontFamily: font.sans,
  fontSize: size,
  fontWeight: weight,
  letterSpacing: "-0.005em",
  lineHeight: 1.25,
  color: c,
  fontVariantNumeric: "tabular-nums",
});

/** Lo manuscrito (notas y pósits): la cursiva de Schibsted. */
export const handStyle = (size: number, weight = 450, c: string = color.ink): CSSProperties => ({
  ...textStyle(size, weight, c),
  fontStyle: "italic",
});

/** Etiquetas y numeración. */
export const monoStyle = (size: number, c: string = color.ink3): CSSProperties => ({
  fontFamily: font.mono,
  fontSize: size,
  fontWeight: 400,
  letterSpacing: "0.02em",
  lineHeight: 1.2,
  color: c,
});
