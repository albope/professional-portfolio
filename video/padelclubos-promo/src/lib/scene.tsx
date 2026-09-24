import React, {createContext, useContext} from "react";
import {useVideoConfig} from "remotion";

interface SceneInfo {
  /** Duración de ESTA escena en frames (no la del vídeo completo). */
  durationInFrames: number;
}

const Ctx = createContext<SceneInfo | null>(null);

export const SceneProvider: React.FC<{durationInFrames: number; children: React.ReactNode}> = ({durationInFrames, children}) => (
  <Ctx.Provider value={{durationInFrames}}>{children}</Ctx.Provider>
);

/**
 * Datos de la escena actual. Dentro del montaje completo,
 * useVideoConfig().durationInFrames es la duración del VÍDEO; usa siempre
 * useScene().durationInFrames para saber cuánto dura tu escena.
 */
export const useScene = () => {
  const info = useContext(Ctx);
  const {width, height, durationInFrames} = useVideoConfig();
  const portrait = height > width;
  return {
    durationInFrames: info?.durationInFrames ?? durationInFrames,
    width,
    height,
    portrait,
    format: portrait ? ("9x16" as const) : ("16x9" as const),
  };
};
