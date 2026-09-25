import React from "react";
import {useScene} from "../../lib/scene";
import {Landscape} from "./Landscape";
import {Portrait} from "./Portrait";

export {cues} from "./cues";

/**
 * 18:40 — Ligas en tiempo real. Se guarda el resultado Gómez / Ferrer 6-4 6-3
 * y la clasificación se reordena sola, en el panel y en el móvil del jugador.
 * 16:9: panel + tarjeta de resultado + portal. 9:16: tres filas y una sola
 * pareja con nombre.
 */
export const Scene: React.FC = () => {
  const {portrait} = useScene();
  return portrait ? <Portrait /> : <Landscape />;
};
