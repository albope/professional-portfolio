/**
 * Espacio de no separación (U+00A0). Se escribe como escape para que se vea
 * en el código: a simple vista es idéntico a un espacio normal.
 */
const NBSP = "\u00a0";

/**
 * Une una cifra con su unidad de tiempo, y la unidad con la palabra que la
 * sigue, para que los compromisos no se partan al final de una línea: «24 h
 * laborables» nunca queda como «24» | «h laborables» ni «30 min» como «30» |
 * «min». Es lo que el prototipo hacía a mano con `<span class="nw">`.
 *
 * Solo cambia espacios por espacios de no separación, así que el texto sigue
 * siendo el del copy (la búsqueda en la página y los lectores de pantalla lo
 * leen igual). Módulo puro: sirve en componentes de servidor y de cliente.
 */
export function sinCortes(texto: string): string {
  return texto.replace(
    /(\d+) (h|min)(?!\p{L})( (?=\p{L}))?/gu,
    (_coincidencia, cifra: string, unidad: string, siguiente?: string) =>
      `${cifra}${NBSP}${unidad}${siguiente ? NBSP : ""}`,
  );
}
