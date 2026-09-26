import { color, orden } from "./palette";
import s from "./ConnectArt.module.css";

/** y de las tres filas, iguales a los dos lados de la conexión. */
const FILAS = [98, 124, 150] as const;

/** Ancho de las barras de texto simulado: dos columnas en la hoja, una en la aplicación. */
const HOJA = [
  [38, 26],
  [30, 32],
  [42, 22],
] as const;
const APLICACION = [52, 40, 58] as const;

/**
 * Tres paquetes, uno por fila. En el estado estático (sin JS o con menos
 * movimiento) los dos primeros se quedan a mitad de camino, en 12 y 31, para
 * que se lea que algo pasa de una herramienta a otra, y el tercero no se ve.
 */
const PAQUETES = [s.pk1, s.pk2, s.pk3] as const;

interface ConnectArtProps {
  aria: string;
  /** «Hoja de cálculo». */
  origen: string;
  /** «Tu aplicación». */
  destino: string;
  /** «Lo que ya usas». */
  pie_origen: string;
  /** «Se actualiza solo». */
  pie_destino: string;
}

/**
 * Servicio de automatización: datos que pasan solos (especificación 4.5).
 * Una hoja de cálculo a la izquierda, tu aplicación a la derecha y una
 * conexión punteada entre las dos. En cada pasada salen tres paquetes
 * cuadrados cobalto (eco del glifo), uno cada 1,3 s: su fila de origen se
 * ilumina, el paquete cruza y la fila de destino queda marcada. Dura 4,5 s,
 * por debajo del límite de 5 s sin control de pausa, y al terminar se queda
 * con las tres filas marcadas.
 *
 * Va dentro de `ArtStage` en modo `each`: una pasada cada vez que entra al
 * 50 % en pantalla, congelada si sale a mitad.
 */
export function ConnectArt({ aria, origen, destino, pie_origen, pie_destino }: ConnectArtProps) {
  return (
    <svg className="h-full w-full" viewBox="0 0 360 240" role="img" aria-label={aria}>
      {/* Hoja de cálculo */}
      <rect x="24.5" y="50.5" width="129" height="139" rx="12" fill={color.surface} stroke={color.line2} />
      <text className="fill-ink text-[14px] font-semibold" x="40" y="76">
        {origen}
      </text>
      <line x1="25" y1="88.5" x2="153" y2="88.5" stroke={color.line} />
      {FILAS.map((y, i) => (
        <rect key={y} className={s.src} style={orden(i)} x="34" y={y} width="110" height="20" rx="4" fill={color.cobalt50} />
      ))}
      <path d="M40 121.5h98M40 147.5h98M92 100v68" fill="none" stroke={color.line} />
      {FILAS.map((y, i) => (
        <g key={y} fill={color.line2}>
          <rect x="42" y={y + 7} width={HOJA[i][0]} height="6" rx="3" />
          <rect x="100" y={y + 7} width={HOJA[i][1]} height="6" rx="3" />
        </g>
      ))}

      {/* Conexión */}
      <path d="M154 120H206" stroke={color.trazo} strokeWidth="1.5" strokeDasharray="3 4" />
      <path
        d="M201 115.5l5 4.5-5 4.5"
        fill="none"
        stroke={color.trazo}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {PAQUETES.map((paquete, i) => (
        <rect
          key={paquete}
          className={`${s.pk} ${paquete}`}
          style={orden(i)}
          x="154"
          y="115.5"
          width="9"
          height="9"
          fill={color.cobalt}
        />
      ))}

      {/* Tu aplicación */}
      <rect x="206.5" y="50.5" width="129" height="139" rx="12" fill={color.surface} stroke={color.line2} />
      <text className="fill-ink text-[14px] font-semibold" x="222" y="76">
        {destino}
      </text>
      <line x1="207" y1="88.5" x2="335" y2="88.5" stroke={color.line} />
      {FILAS.map((y, i) => (
        <g key={y}>
          <rect x="216.5" y={y + 0.5} width="109" height="21" rx="6" fill={color.bg} stroke={color.line} />
          <rect x="225" y={y + 7} width="8" height="8" fill={color.cobalt} />
          <rect x="241" y={y + 8} width={APLICACION[i]} height="6" rx="3" fill={color.line2} />
        </g>
      ))}
      {FILAS.map((y, i) => (
        <rect
          key={y}
          className={s.dst}
          style={orden(i)}
          x="216.5"
          y={y + 0.5}
          width="109"
          height="21"
          rx="6"
          fill="none"
          stroke={color.cobalt}
          strokeWidth="1.5"
        />
      ))}

      <text className="fill-ink-2 text-[13.5px]" x="89" y="212" textAnchor="middle">
        {pie_origen}
      </text>
      <text className="fill-ink-2 text-[13.5px]" x="271" y="212" textAnchor="middle">
        {pie_destino}
      </text>
    </svg>
  );
}
