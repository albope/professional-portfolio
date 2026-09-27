import "@fontsource-variable/schibsted-grotesk/wght.css";
import "@fontsource-variable/schibsted-grotesk/wght-italic.css";
import "@fontsource/fragment-mono/400.css";
import React, {useEffect, useState} from "react";
import {continueRender, delayRender} from "remotion";

// Cada fotograma se pinta con las tipografías ya cargadas: sin esto, los
// primeros fotogramas de cada worker podrían salir con la fuente de reserva.
const FACES = [
  "400 40px 'Schibsted Grotesk Variable'",
  "560 40px 'Schibsted Grotesk Variable'",
  "600 40px 'Schibsted Grotesk Variable'",
  "italic 450 40px 'Schibsted Grotesk Variable'",
  "400 40px 'Fragment Mono'",
];
const SAMPLE = "ÁÉÍÓÚÑáéíóúñ¿¡0123456789 Hoy Reservas";

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
