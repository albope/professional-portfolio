import React from "react";
import {useScene} from "../../lib/scene";
import {Landscape} from "./Landscape";
import {Portrait} from "./Portrait";

export {cues} from "./cues";

/**
 * 11:20 — Detección de solapamientos.
 * 16:9: B choca contra la reserva de Javi, el aviso lo bloquea y el gerente
 * lo recoloca en la Pista 3 con el selector. 9:16: la reserva de Javi es una
 * silueta y B sube, choca y se asienta en su pista.
 */
export const Scene: React.FC = () => {
  const {portrait} = useScene();
  return portrait ? <Portrait /> : <Landscape />;
};
