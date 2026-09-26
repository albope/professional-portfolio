/**
 * Paleta de la especificación (2.1) en hexadecimal, para lo que no puede leer
 * las variables CSS de `globals.css`: los atributos de presentación de los
 * SVG (`fill`, `stroke`), que no las resuelven en todos los navegadores, y
 * las imágenes para compartir, que pinta Satori fuera del navegador.
 *
 * Son los mismos valores que `tailwind.config.ts` y `globals.css`: si cambia
 * un color, cambia en los tres sitios. Los tonos que solo existen dentro de
 * un dibujo (papel, renglones, celdas) no son token y viven en su
 * ilustración.
 */
export const color = {
  bg: "#F7F6F2",
  surface: "#FFFFFF",
  sand: "#EDE8DC",
  sand2: "#E2DBCB",
  ink: "#101013",
  ink2: "#4A4A52",
  ink3: "#66666E",
  /* Solo decoración: nunca texto con significado. */
  ink4: "#8C8C93",
  line: "#E3DFD5",
  line2: "#CEC9BD",
  cobalt: "#2743E0",
  cobalt600: "#1D33B3",
  cobalt50: "#ECEFFD",
  cobalt100: "#D8DEFA",
  cobaltBright: "#6B83FF",
  postit: "#F3E8C5",
  postit2: "#EADDB2",
  dark: "#101013",
  dark2: "#19191E",
  onDark: "#F7F6F2",
  onDark2: "#B9B9BF",
  onDark3: "#9C9CA3",
  error: "#B3261E",
} as const;

/**
 * Tonos de papel de las ilustraciones que no son token: la píldora vacía de
 * la barra de dirección (la comparten el hero y la web de «Qué hacemos») y la
 * arena oscura de las barras de texto simulado y de la conexión punteada.
 */
export const dibujo = {
  pastilla: "#F2F0EA",
  trazo: "#B8B2A5",
} as const;
