import type { ProjectVisualVariant } from "@/data/projects";

const LINE = "rgba(247,246,242,0.22)";
const LINE_SOFT = "rgba(247,246,242,0.10)";
const FILL_SOFT = "rgba(247,246,242,0.14)";
const COBALT = "#3D5BFF";

/**
 * Ilustraciones abstractas de línea fina para los proyectos.
 * Composiciones propias (sin capturas falsas) sobre fondo tinta.
 */
export function ProjectVisual({ variant }: { variant: ProjectVisualVariant }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className="h-full w-full"
      aria-hidden="true"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      {variant === "grid" && <GridVisual />}
      {variant === "documents" && <DocumentsVisual />}
      {variant === "assistant" && <AssistantVisual />}
      {variant === "booking" && <BookingVisual />}
      {variant === "editorial" && <EditorialVisual />}
      {variant === "radio" && <RadioVisual />}
    </svg>
  );
}

/* Web a medida (evento personal): wireframe editorial con RSVP y galería */
function EditorialVisual() {
  return (
    <g>
      {/* marco de navegador */}
      <rect x="96" y="76" width="448" height="330" stroke={LINE} />
      <line x1="96" y1="108" x2="544" y2="108" stroke={LINE} />
      <circle cx="114" cy="92" r="3" stroke={LINE} />
      <circle cx="128" cy="92" r="3" stroke={LINE} />
      <circle cx="142" cy="92" r="3" stroke={LINE} />
      <rect x="240" y="86" width="160" height="12" stroke={LINE_SOFT} />
      {/* hero centrado: anillos + titular */}
      <circle cx="310" cy="150" r="12" stroke={COBALT} strokeWidth="1.5" />
      <circle cx="330" cy="150" r="12" stroke={LINE} />
      <line x1="250" y1="186" x2="390" y2="186" stroke={LINE} />
      <line x1="274" y1="202" x2="366" y2="202" stroke={LINE_SOFT} />
      {/* separador */}
      <line x1="96" y1="228" x2="544" y2="228" stroke={LINE_SOFT} />
      {/* columna izquierda: formulario RSVP */}
      <line x1="128" y1="262" x2="288" y2="262" stroke={LINE_SOFT} />
      <line x1="128" y1="292" x2="288" y2="292" stroke={LINE_SOFT} />
      <line x1="128" y1="322" x2="288" y2="322" stroke={LINE_SOFT} />
      <rect x="128" y="346" width="88" height="26" fill={COBALT} opacity="0.85" />
      {/* columna derecha: galería colaborativa */}
      {[0, 1, 2].map((col) => (
        <g key={col}>
          <rect x={336 + col * 62} y="252" width="50" height="50" stroke={LINE} />
          <rect x={336 + col * 62} y="316" width="50" height="50" stroke={LINE} />
        </g>
      ))}
      <rect x="398" y="252" width="50" height="50" fill={FILL_SOFT} />
      <rect x="336" y="316" width="50" height="50" fill={FILL_SOFT} />
      {/* marca de subida */}
      <path d="M478 336 v-14 m-6 6 l6 -6 l6 6" stroke={COBALT} strokeWidth="1.5" />
    </g>
  );
}

/* Web de programa de radio: directo, onda y archivo */
function RadioVisual() {
  const bars = [14, 30, 22, 44, 60, 36, 52, 74, 40, 58, 30, 46, 66, 34, 24, 40, 18, 28];
  return (
    <g>
      {/* indicador de directo */}
      <circle cx="110" cy="106" r="5" fill={COBALT} />
      <line x1="128" y1="106" x2="176" y2="106" stroke={LINE} />
      {/* reproductor: play */}
      <circle cx="150" cy="228" r="42" stroke={LINE} />
      <circle cx="150" cy="228" r="41" stroke={LINE_SOFT} />
      <path d="M138 206 L174 228 L138 250 Z" stroke={COBALT} strokeWidth="1.5" fill="none" />
      {/* forma de onda */}
      {bars.map((h, i) => (
        <line
          key={i}
          x1={228 + i * 18}
          y1={228 - h / 2}
          x2={228 + i * 18}
          y2={228 + h / 2}
          stroke={i === 7 ? COBALT : LINE}
          strokeWidth={i === 7 ? 2 : 1}
        />
      ))}
      {/* línea de progreso */}
      <line x1="228" y1="292" x2="534" y2="292" stroke={LINE_SOFT} />
      <line x1="228" y1="292" x2="360" y2="292" stroke={LINE} />
      <circle cx="360" cy="292" r="4" fill={COBALT} />
      {/* archivo histórico */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={110 + i * 70} y="344" width="56" height="42" stroke={LINE} />
      ))}
      <rect x={250} y="344" width="56" height="42" fill={FILL_SOFT} />
    </g>
  );
}

/* Plataforma de operaciones: tablero semanal de planificación */
function GridVisual() {
  const cols = [120, 200, 280, 360, 440, 520];
  const rows = [140, 200, 260, 320, 380];
  return (
    <g>
      {/* marco */}
      <rect x="80" y="90" width="480" height="330" stroke={LINE} />
      {/* cabecera */}
      <line x1="80" y1="140" x2="560" y2="140" stroke={LINE} />
      {cols.map((x) => (
        <line key={x} x1={x} y1="90" x2={x} y2="420" stroke={LINE_SOFT} />
      ))}
      {rows.slice(1).map((y) => (
        <line key={y} x1="80" y1={y} x2="560" y2={y} stroke={LINE_SOFT} />
      ))}
      {/* ticks de cabecera */}
      {cols.map((x) => (
        <line key={`t${x}`} x1={x + 24} y1="112" x2={x + 56} y2="112" stroke={LINE} />
      ))}
      {/* bloques planificados */}
      <rect x="128" y="152" width="104" height="36" fill={FILL_SOFT} />
      <rect x="288" y="152" width="64" height="36" fill={FILL_SOFT} />
      <rect x="208" y="212" width="144" height="36" fill={COBALT} opacity="0.9" />
      <rect x="448" y="212" width="88" height="36" fill={FILL_SOFT} />
      <rect x="128" y="272" width="64" height="36" fill={FILL_SOFT} />
      <rect x="368" y="272" width="120" height="36" fill={FILL_SOFT} />
      <rect x="288" y="332" width="88" height="36" fill={FILL_SOFT} />
      <rect x="448" y="332" width="64" height="36" fill={COBALT} opacity="0.55" />
      {/* eje izquierdo */}
      {rows.map((y) => (
        <line key={`l${y}`} x1="64" y1={y + 30} x2="72" y2={y + 30} stroke={LINE} />
      ))}
      {/* marca de estado */}
      <circle cx="536" cy="115" r="4" fill={COBALT} />
    </g>
  );
}

/* Automatización documental: documentos → extracción → datos estructurados */
function DocumentsVisual() {
  return (
    <g>
      {/* pila de documentos */}
      <rect x="96" y="132" width="150" height="200" stroke={LINE_SOFT} />
      <rect x="110" y="118" width="150" height="200" stroke={LINE} />
      <path d="M110 118 h110 l40 40 v160 h-150 z" stroke={LINE} />
      <path d="M220 118 v40 h40" stroke={LINE} />
      {[176, 200, 224, 248, 272].map((y) => (
        <line key={y} x1="132" y1={y} x2={y % 48 === 0 ? 216 : 238} y2={y} stroke={LINE_SOFT} />
      ))}
      <rect x="132" y="290" width="52" height="10" fill={COBALT} opacity="0.85" />
      {/* flujo */}
      <path d="M260 218 H 348" stroke={LINE} strokeDasharray="3 6" />
      <circle cx="304" cy="218" r="12" stroke={LINE} />
      <circle cx="304" cy="218" r="3" fill={COBALT} />
      <path d="M340 212 l10 6 l-10 6" stroke={LINE} />
      {/* tabla estructurada */}
      <rect x="356" y="128" width="196" height="196" stroke={LINE} />
      <line x1="356" y1="160" x2="552" y2="160" stroke={LINE} />
      {[192, 224, 256, 288].map((y) => (
        <line key={y} x1="356" y1={y} x2="552" y2={y} stroke={LINE_SOFT} />
      ))}
      <line x1="430" y1="128" x2="430" y2="324" stroke={LINE_SOFT} />
      <rect x="366" y="170" width="44" height="10" fill={FILL_SOFT} />
      <rect x="440" y="170" width="80" height="10" fill={FILL_SOFT} />
      <rect x="366" y="202" width="44" height="10" fill={FILL_SOFT} />
      <rect x="440" y="202" width="60" height="10" fill={COBALT} opacity="0.85" />
      <rect x="366" y="234" width="44" height="10" fill={FILL_SOFT} />
      <rect x="440" y="234" width="72" height="10" fill={FILL_SOFT} />
      <rect x="366" y="266" width="44" height="10" fill={FILL_SOFT} />
      <rect x="440" y="266" width="48" height="10" fill={FILL_SOFT} />
      {/* validación */}
      <path d="M506 344 l8 8 l14 -16" stroke={COBALT} strokeWidth="1.5" />
      <circle cx="514" cy="342" r="18" stroke={LINE} />
    </g>
  );
}

/* Asistente interno: fuentes → núcleo → respuesta citada */
function AssistantVisual() {
  const sources: Array<[number, number]> = [
    [140, 120],
    [110, 240],
    [160, 350],
    [500, 120],
    [530, 240],
    [480, 350],
  ];
  return (
    <g>
      {/* halos */}
      <circle cx="320" cy="230" r="120" stroke={LINE_SOFT} />
      <circle cx="320" cy="230" r="72" stroke={LINE_SOFT} />
      {/* fuentes conectadas */}
      {sources.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <line x1={x} y1={y} x2="320" y2="230" stroke={LINE_SOFT} />
          <rect x={x - 14} y={y - 18} width="28" height="36" stroke={LINE} fill="#101013" />
          <line x1={x - 6} y1={y - 8} x2={x + 6} y2={y - 8} stroke={LINE_SOFT} />
          <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={LINE_SOFT} />
        </g>
      ))}
      {/* núcleo */}
      <rect x="296" y="206" width="48" height="48" stroke={COBALT} strokeWidth="1.5" fill="#101013" />
      <circle cx="320" cy="230" r="5" fill={COBALT} />
      {/* respuesta con cita */}
      <rect x="228" y="380" width="184" height="52" stroke={LINE} />
      <line x1="320" y1="278" x2="320" y2="380" stroke={LINE} strokeDasharray="3 6" />
      <line x1="244" y1="398" x2="352" y2="398" stroke={LINE_SOFT} />
      <line x1="244" y1="414" x2="326" y2="414" stroke={LINE_SOFT} />
      <rect x="370" y="408" width="28" height="10" fill={COBALT} opacity="0.85" />
    </g>
  );
}

/* Sistema de reservas: parrilla horaria con ocupación */
function BookingVisual() {
  const rows = [170, 230, 290, 350];
  return (
    <g>
      {/* regla horaria */}
      <line x1="90" y1="120" x2="560" y2="120" stroke={LINE} />
      {Array.from({ length: 13 }).map((_, i) => (
        <line
          key={i}
          x1={110 + i * 36}
          y1="120"
          x2={110 + i * 36}
          y2={i % 3 === 0 ? 106 : 112}
          stroke={LINE}
        />
      ))}
      {/* pistas */}
      {rows.map((y) => (
        <g key={y}>
          <line x1="90" y1={y + 44} x2="560" y2={y + 44} stroke={LINE_SOFT} />
          <line x1="64" y1={y + 22} x2="78" y2={y + 22} stroke={LINE} />
        </g>
      ))}
      {/* reservas */}
      <rect x="110" y="152" width="108" height="36" fill={FILL_SOFT} />
      <rect x="254" y="152" width="72" height="36" fill={FILL_SOFT} />
      <rect x="398" y="152" width="108" height="36" fill={COBALT} opacity="0.85" />
      <rect x="146" y="212" width="72" height="36" fill={FILL_SOFT} />
      <rect x="290" y="212" width="108" height="36" fill={FILL_SOFT} />
      <rect x="110" y="272" width="72" height="36" fill={COBALT} opacity="0.55" />
      <rect x="326" y="272" width="72" height="36" fill={FILL_SOFT} />
      <rect x="470" y="272" width="72" height="36" fill={FILL_SOFT} />
      <rect x="218" y="332" width="108" height="36" fill={FILL_SOFT} />
      <rect x="434" y="332" width="72" height="36" fill={FILL_SOFT} />
      {/* indicador de disponibilidad */}
      <rect x="470" y="212" width="72" height="36" stroke={COBALT} strokeDasharray="4 4" />
    </g>
  );
}
