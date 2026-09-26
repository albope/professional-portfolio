import { color, orden } from "./palette";
import s from "./AgendaArt.module.css";

/** x de cada día (L a V) e y de cada franja de la rejilla de 5×4. */
const COLUMNAS = [46, 100, 154, 208, 262] as const;
const FRANJAS = [86, 116, 146, 176] as const;
const CELDA = { ancho: 50, alto: 26 } as const;

/**
 * Los tres tipos de reserva, con el vocabulario del glifo: cobalto macizo es
 * «confirmada», tinta con borde es «pendiente» y arena es «bloqueada».
 */
type Tipo = "confirmada" | "pendiente" | "bloqueada";

/**
 * Los diez bloques en el orden en que caen (`--i`). `alto` es 26 (una franja)
 * o 56 (dos) y `barra` el ancho de la línea de texto simulado. Coordenadas
 * del prototipo, sin tocar.
 */
const BLOQUES: ReadonlyArray<{ x: number; y: number; alto: number; tipo: Tipo; barra: number }> = [
  { x: 46, y: 86, alto: 26, tipo: "confirmada", barra: 26 },
  { x: 262, y: 86, alto: 56, tipo: "confirmada", barra: 30 },
  { x: 100, y: 116, alto: 56, tipo: "pendiente", barra: 24 },
  { x: 154, y: 86, alto: 26, tipo: "bloqueada", barra: 22 },
  { x: 208, y: 146, alto: 26, tipo: "confirmada", barra: 28 },
  { x: 46, y: 146, alto: 56, tipo: "bloqueada", barra: 24 },
  { x: 208, y: 86, alto: 26, tipo: "pendiente", barra: 20 },
  { x: 154, y: 176, alto: 26, tipo: "pendiente", barra: 26 },
  { x: 262, y: 176, alto: 26, tipo: "confirmada", barra: 22 },
  { x: 154, y: 116, alto: 26, tipo: "confirmada", barra: 30 },
];

function Bloque({ x, y, alto, tipo, barra }: (typeof BLOQUES)[number]) {
  if (tipo === "pendiente") {
    // El trazo de 1,5 va por dentro de la celda para que mida lo mismo que los macizos.
    return (
      <>
        <rect x={x + 0.75} y={y + 0.75} width={CELDA.ancho - 1.5} height={alto - 1.5} rx="5" fill={color.surface} stroke={color.ink} strokeWidth="1.5" />
        <rect x={x + 8} y={y + 10} width={barra} height="4" rx="2" fill={color.ink} />
      </>
    );
  }
  const confirmada = tipo === "confirmada";
  return (
    <>
      <rect x={x} y={y} width={CELDA.ancho} height={alto} rx="5" fill={confirmada ? color.cobalt : color.sand2} />
      <rect
        x={x + 7}
        y={y + 10}
        width={barra}
        height="4"
        rx="2"
        fill={confirmada ? color.surface : color.ink}
        opacity={confirmada ? 0.85 : 0.55}
      />
    </>
  );
}

interface AgendaArtProps {
  aria: string;
  /** «Reservas de la semana». */
  titulo: string;
  /** Iniciales de los días, de lunes a viernes. */
  dias: readonly string[];
}

/**
 * Servicio de gestión: una agenda que se llena (especificación 4.4). Tarjeta
 * con los cuadrados hueco y macizo del glifo, días L a V, rejilla punteada de
 * 5×4 y diez reservas que caen 22 px y encajan con un ligero rebote, una tras
 * otra (unos 1,7 s). Va dentro de `ArtStage` en modo `once`, que la dispara al
 * 35 % en pantalla. El marcado es la agenda llena: lo que ve quien no tiene JS
 * o pide menos movimiento.
 */
export function AgendaArt({ aria, titulo, dias }: AgendaArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 360 240" role="img" aria-label={aria}>
      <rect x="28.5" y="22.5" width="303" height="195" rx="12" fill={color.surface} stroke={color.line2} />
      <text className="fill-ink text-[12.5px] font-semibold" x="46" y="50">
        {titulo}
      </text>
      <rect x="284" y="40" width="9" height="9" fill="none" stroke={color.ink} strokeWidth="1.5" />
      <rect x="300" y="40" width="9" height="9" fill={color.cobalt} />

      {dias.map((dia, i) => (
        <text key={i} className="fill-ink-2 text-[11px]" x={COLUMNAS[i] + 25} y="77" textAnchor="middle">
          {dia}
        </text>
      ))}

      <g fill="none" stroke={color.line} strokeDasharray="3 3">
        {FRANJAS.flatMap((y) =>
          COLUMNAS.map((x) => <rect key={`${x}-${y}`} x={x + 0.5} y={y + 0.5} width="49" height="25" rx="5" />),
        )}
      </g>

      {BLOQUES.map((bloque, i) => (
        <g key={`${bloque.x}-${bloque.y}`} className={s.blk} style={orden(i)}>
          <Bloque {...bloque} />
        </g>
      ))}
    </svg>
  );
}
