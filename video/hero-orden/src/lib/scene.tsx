import React, {createContext, useContext} from "react";
import {useVideoConfig} from "remotion";

interface SceneInfo {
  /** Duración de ESTA escena en fotogramas (no la del vídeo completo). */
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
 *
 * Dos cortes: escritorio 1280×1080 y móvil 960×900.
 */
export const useScene = () => {
  const info = useContext(Ctx);
  const {width, height, durationInFrames} = useVideoConfig();
  const movil = width < 1100;
  return {
    durationInFrames: info?.durationInFrames ?? durationInFrames,
    width,
    height,
    movil,
    corte: movil ? ("movil" as const) : ("escritorio" as const),
  };
};

/** Elige el valor del corte actual. */
export const useCorte = () => {
  const {movil} = useScene();
  return <T,>(escritorio: T, enMovil: T): T => (movil ? enMovil : escritorio);
};
