import React from "react"
import {color} from "../../brand/tokens"

export type TipoIcono = "chat" | "hoja" | "papel" | "posit"

// Baldosa de origen de una fila. `chat`, `hoja` y `papel` son los trazados de
// `IconoOrigen` de la ilustración SVG que sustituyó este vídeo
// (`git show 639331e:src/components/hero/HeroArt.tsx`). `posit` es nuevo.
export const IconoOrigen: React.FC<{tipo: TipoIcono, lado: number}> = ({tipo, lado}) => {
  const linea = {fill: "none", stroke: color.ink, strokeWidth: 1.5, strokeLinejoin: "round" as const}
  return (
    <svg width={lado} height={lado} viewBox="0 0 32 32" style={{display: "block"}}>
      <rect width="32" height="32" rx="8" fill={color.pastilla} />
      {tipo === "chat" ? (
        <path
          d="M8 10.5a3.5 3.5 0 0 1 3.5-3.5h9a3.5 3.5 0 0 1 3.5 3.5v5a3.5 3.5 0 0 1-3.5 3.5h-6l-4.5 3.5v-3.6a3.5 3.5 0 0 1-2-3.4z"
          {...linea}
        />
      ) : null}
      {tipo === "hoja" ? (
        <g fill="none" stroke={color.ink} strokeWidth={1.5}>
          <rect x="8" y="8" width="16" height="16" rx="1.5" />
          <path d="M8 13.5h16M8 18.5h16M14 8v16" />
        </g>
      ) : null}
      {tipo === "papel" ? <path d="M9 8h14v16h-14zM12 13h8M12 17h8M12 21h5" {...linea} /> : null}
      {tipo === "posit" ? <path d="M9 8h14v16H9zM9 12.5h14" {...linea} /> : null}
    </svg>
  )
}
