import type React from "react";

/**
 * Registro de escenas: id del storyboard → componente. Cada escena lee su
 * formato con useFormat() y trabaja en frames relativos a su inicio.
 */
export const SCENES: Record<string, React.FC> = {};
