/**
 * Utilidades puras para pintar el copy de `copy.json` sin reescribirlo. No
 * importan el JSON, así que sirven también en componentes cliente (a los que
 * el texto les llega por props desde la sección de servidor).
 */

export type Flecha = "→" | "↗" | "↓";

/**
 * El copy del diagnóstico trae la flecha pegada al texto. La separamos para
 * que el componente la pinte aparte, en `aria-hidden`. El copy nuevo ya no
 * lleva flechas: las dibujan `Button` y `ArrowLink`.
 */
export function partirFlecha(label: string): { texto: string; flecha?: Flecha } {
  const match = label.match(/ ([→↗↓])$/);
  if (!match) return { texto: label };
  return { texto: label.slice(0, -2), flecha: match[1] as Flecha };
}

const sinTildes = (value: string) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/**
 * Parte una frase del copy por el fragmento sobre el que se pinta un enlace
 * («política de privacidad», «Escríbenos», el email...), sin reescribirla.
 * Ignora mayúsculas y tildes para encontrarlo y devuelve el texto original.
 * Si el fragmento no está, `enlace` llega vacío y la frase sale entera en
 * `antes`: `copy.test.ts` comprueba que cada fragmento sigue en su frase.
 */
export function partirEnlace(
  texto: string,
  fragmento: string,
): { antes: string; enlace: string; despues: string } {
  if (!fragmento) return { antes: texto, enlace: "", despues: "" };
  const normalizado = sinTildes(texto);
  const buscado = sinTildes(fragmento);
  const at = normalizado.indexOf(buscado);
  // La normalización NFD conserva la longitud de los caracteres base una vez
  // quitadas las marcas, así que las posiciones valen para el texto original
  // solo si este ya venía compuesto (NFC), como todo el copy.
  if (at === -1 || normalizado.length !== texto.length) {
    return { antes: texto, enlace: "", despues: "" };
  }
  return {
    antes: texto.slice(0, at),
    enlace: texto.slice(at, at + fragmento.length),
    despues: texto.slice(at + fragmento.length),
  };
}

/**
 * Rellena los huecos `{clave}` de una plantilla del copy, como el año del pie
 * (`{anio}`) o los minutos de espera del formulario (`{minutos}`).
 */
export function rellenar(plantilla: string, valores: Record<string, string | number>): string {
  return plantilla.replace(/\{(\w+)\}/g, (hueco, clave: string) =>
    Object.hasOwn(valores, clave) ? String(valores[clave]) : hueco,
  );
}
