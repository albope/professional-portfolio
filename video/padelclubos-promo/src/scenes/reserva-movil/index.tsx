import React from "react";
import {useScene} from "../../lib/scene";
import {Landscape} from "./Landscape";
import {Portrait} from "./Portrait";

export {cues} from "./cues";

/**
 * 08:15 — Reservas 24/7: dos caras, mismos datos.
 * 16:9: panel del club + portal en el móvil; el módulo vuela del móvil al panel.
 * 9:16: solo la cara del jugador, a pantalla completa.
 */
export const Scene: React.FC = () => {
  const {portrait} = useScene();
  return portrait ? <Portrait /> : <Landscape />;
};
