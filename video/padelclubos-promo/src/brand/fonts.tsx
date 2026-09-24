import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/instrument-sans/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import React, {useEffect, useState} from "react";
import {continueRender, delayRender} from "remotion";

// Cada frame se pinta con las tipografías ya cargadas: sin esto, los primeros
// frames de cada worker podrían salir con la fuente de reserva.
const FACES = [
  "800 40px 'Archivo Variable'",
  "650 40px 'Archivo Variable'",
  "400 40px 'Instrument Sans Variable'",
  "600 40px 'Instrument Sans Variable'",
  "700 40px 'Instrument Sans Variable'",
  "500 40px 'JetBrains Mono Variable'",
];
const SAMPLE = "ÁÉÍÓÚÑáéíóúñ¿¡€0123456789 Padel Club OS";

export const FontGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = useState(() => delayRender("Cargando tipografías de la marca"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(FACES.map((f) => document.fonts.load(f, SAMPLE)))
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(err);
        continueRender(handle);
      });
  }, [handle]);
  return ready ? <>{children}</> : null;
};
