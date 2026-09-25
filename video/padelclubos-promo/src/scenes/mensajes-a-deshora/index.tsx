import React from "react";
import {useScene} from "../../lib/scene";
import {Landscape} from "./Landscape";
import {Portrait} from "./Portrait";

/**
 * L01 / V01 · 23:47 — Mensajes a deshora.
 * 16:9: 2 compases (reloj gigante → chip, notificación, chat que se llena y
 * las dos burbujas que se convierten en módulos). 9:16: 1 compás de gancho.
 * Tiempos y sonidos en ./cues.ts.
 */
export const Scene: React.FC = () => {
  const {portrait} = useScene();
  return portrait ? <Portrait /> : <Landscape />;
};
