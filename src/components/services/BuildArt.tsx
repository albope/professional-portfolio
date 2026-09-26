import type { ReactNode } from "react";
import { color, orden } from "./palette";
import s from "./BuildArt.module.css";

/** Un bloque de la interfaz. `i` escalona su entrada: 70 ms por paso. */
function Bk({ i, children }: { i: number; children: ReactNode }) {
  return (
    <g className={s.bk} style={orden(i)}>
      {children}
    </g>
  );
}

/**
 * Marco que se dibuja: `pathLength="1"` hace que el trazo mida 1 y se anime
 * de 1 a 0. El relleno blanco está desde el principio: solo se dibuja el borde.
 */
function Marco({ d, stroke, fill = "none", strokeWidth }: { d: string; stroke: string; fill?: string; strokeWidth?: string }) {
  return <path className={s.frame} pathLength={1} d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
}

/** Mosaico de 3×3 de la web: casillas blancas, una macizo cobalto y una hueca (el glifo). */
const MOSAICO_X = [172, 194, 216] as const;
const MOSAICO_Y = [86, 108, 130] as const;
const MACIZA = { x: 194, y: 108 } as const;
const HUECA = { x: 216, y: 130 } as const;

/** Las tres tarjetas del pie de la web: x y ancho. */
const TARJETAS = [
  { x: 36.5, ancho: 62 },
  { x: 106.5, ancho: 62 },
  { x: 176.5, ancho: 64 },
] as const;

/**
 * Servicio de webs: una interfaz que se construye (especificación 4.6). Un
 * navegador y un móvil: los marcos se dibujan (1,1 s), los bloques crecen de
 * izquierda a derecha uno tras otro desde los 0,75 s y, a los 2,2 s, el botón
 * cobalto se pulsa. Se lee como esquema: barras en lugar de texto. Va dentro
 * de `ArtStage` en modo `once` (35 %). El marcado es la interfaz completa.
 */
export function BuildArt({ aria }: { aria: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 360 240" role="img" aria-label={aria}>
      {/* Navegador */}
      <Marco
        d="M34.5 26.5h208a12 12 0 0 1 12 12v162a12 12 0 0 1-12 12h-208a12 12 0 0 1-12-12v-162a12 12 0 0 1 12-12z"
        fill={color.surface}
        stroke={color.ink}
        strokeWidth="1.5"
      />
      <Marco d="M23 46.5h231" stroke={color.line2} />
      <Bk i={0}>
        <rect x="98" y="33" width="84" height="7" rx="3.5" fill={color.direccion} />
      </Bk>
      <Bk i={1}>
        <rect x="36" y="58" width="30" height="7" rx="2" fill={color.ink} />
      </Bk>
      <Bk i={2}>
        <g fill={color.ink4}>
          <rect x="178" y="59.5" width="14" height="4" rx="2" />
          <rect x="198" y="59.5" width="14" height="4" rx="2" />
          <rect x="218" y="59.5" width="20" height="4" rx="2" />
        </g>
      </Bk>
      <Bk i={3}>
        <rect x="36" y="80" width="112" height="11" rx="2" fill={color.ink} />
      </Bk>
      <Bk i={4}>
        <rect x="36" y="96" width="86" height="11" rx="2" fill={color.ink} />
      </Bk>
      <Bk i={5}>
        <g fill={color.trazo}>
          <rect x="36" y="116" width="104" height="4" rx="2" />
          <rect x="36" y="124" width="88" height="4" rx="2" />
        </g>
      </Bk>
      <Bk i={6}>
        <rect x="164" y="76" width="76" height="80" rx="6" fill={color.sand} />
        <g fill={color.surface}>
          {MOSAICO_Y.flatMap((y) =>
            MOSAICO_X.filter((x) => !(x === MACIZA.x && y === MACIZA.y) && !(x === HUECA.x && y === HUECA.y)).map(
              (x) => <rect key={`${x}-${y}`} x={x} y={y} width="16" height="16" rx="2" />,
            ),
          )}
        </g>
        <rect x={MACIZA.x} y={MACIZA.y} width="16" height="16" rx="2" fill={color.cobalt} />
        <rect
          x={HUECA.x + 0.75}
          y={HUECA.y + 0.75}
          width="14.5"
          height="14.5"
          rx="2"
          fill="none"
          stroke={color.ink}
          strokeWidth="1.5"
        />
      </Bk>
      <Bk i={8}>
        <g className={s.press}>
          <rect x="36" y="138" width="60" height="20" rx="5" fill={color.cobalt} />
          <rect x="46" y="146" width="40" height="4" rx="2" fill={color.surface} />
        </g>
      </Bk>
      {TARJETAS.map(({ x, ancho }, n) => (
        <Bk key={x} i={9 + n}>
          <rect x={x} y="172.5" width={ancho} height="28" rx="6" fill={color.bg} stroke={color.line} />
        </Bk>
      ))}

      {/* Móvil */}
      <Marco
        d="M284.5 52.5h44a14 14 0 0 1 14 14v132a14 14 0 0 1-14 14h-44a14 14 0 0 1-14-14v-132a14 14 0 0 1 14-14z"
        fill={color.surface}
        stroke={color.ink}
        strokeWidth="1.5"
      />
      <Bk i={4}>
        <rect x="296" y="60" width="20" height="4" rx="2" fill={color.line2} />
      </Bk>
      <Bk i={5}>
        <rect x="280" y="76" width="44" height="8" rx="2" fill={color.ink} />
      </Bk>
      <Bk i={6}>
        <rect x="280" y="88" width="32" height="8" rx="2" fill={color.ink} />
      </Bk>
      <Bk i={7}>
        <g fill={color.trazo}>
          <rect x="280" y="104" width="50" height="4" rx="2" />
          <rect x="280" y="112" width="40" height="4" rx="2" />
        </g>
      </Bk>
      <Bk i={9}>
        <rect x="280" y="126" width="52" height="18" rx="5" fill={color.cobalt} />
      </Bk>
      <Bk i={10}>
        <rect x="280.5" y="152.5" width="51" height="24" rx="5" fill={color.sand} />
      </Bk>
      <Bk i={11}>
        <path d="M271 190.5h71" stroke={color.line} />
        <rect x="284" y="197" width="7" height="7" fill={color.cobalt} />
        <g fill="none" stroke={color.ink4} strokeWidth="1.5">
          <rect x="298.75" y="197.75" width="5.5" height="5.5" />
          <rect x="311.75" y="197.75" width="5.5" height="5.5" />
          <rect x="324.75" y="197.75" width="5.5" height="5.5" />
        </g>
      </Bk>
    </svg>
  );
}
