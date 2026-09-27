import React from "react"
import {AbsoluteFill, Series} from "remotion"
import {FontGate} from "./brand/fonts"
import {color} from "./brand/tokens"
import {SceneProvider} from "./lib/scene"
import {Escena as CopiarAMano} from "./scenes/CopiarAMano"
import {Escena as LunesNueve} from "./scenes/LunesNueve"
import {Escena as TodoAlDia} from "./scenes/TodoAlDia"
import {Escena as TodoEnUnaApp} from "./scenes/TodoEnUnaApp"
import {Escena as UnClic} from "./scenes/UnClic"
import {ESCENAS, type EscenaId} from "./timeline"

const COMPONENTES: Record<EscenaId, React.FC> = {
  "lunes-nueve": LunesNueve,
  "copiar-a-mano": CopiarAMano,
  "todo-en-una-app": TodoEnUnaApp,
  "un-clic": UnClic,
  "todo-al-dia": TodoAlDia,
}

// Un único plano continuo: las cinco escenas en serie sobre el papel.
// willChange + antialiased en la raíz: texto con suavizado en escala de grises.
export const Hero: React.FC = () => (
  <AbsoluteFill style={{background: color.bg, willChange: "transform", WebkitFontSmoothing: "antialiased"}}>
    <FontGate>
      <Series>
        {ESCENAS.map(({id, duracion}) => {
          const Componente = COMPONENTES[id]
          return (
            <Series.Sequence key={id} name={id} durationInFrames={duracion}>
              <SceneProvider durationInFrames={duracion}>
                <Componente />
              </SceneProvider>
            </Series.Sequence>
          )
        })}
      </Series>
    </FontGate>
  </AbsoluteFill>
)
