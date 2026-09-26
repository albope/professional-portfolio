import type { CSSProperties, ReactNode } from "react";
import type { Copy } from "@/data/copy";
import { color, dibujo } from "@/lib/palette";
import styles from "./HeroIllustration.module.css";

type Ilustracion = Copy["hero"]["ilustracion"];
type DatosFila = Ilustracion["escritorio"]["filas"][number];

/*
 * Colores de la paleta (2.1) escritos en los atributos del SVG, como en el
 * prototipo: los atributos de presentación no leen variables CSS en todos
 * los navegadores. Los tokens salen de `@/lib/palette`. Los grises de papel
 * (celdas, barras, renglones) son solo de la ilustración.
 */
const TINTA = color.ink;
const TINTA_2 = color.ink2;
const COBALTO = color.cobalt;
const COBALTO_50 = color.cobalt50;
const COBALTO_100 = color.cobalt100;
const FONDO = color.bg;
const FILETE = color.line;
const FILETE_2 = color.line2;
const GRIS_ICONO = color.ink4;
const PASTILLA = dibujo.pastilla;
const CELDA = "#DAD5CA";
const BARRA = "#D9D5CB";
const PAPEL = "#FCFBF7";
const RENGLON = "#E6E1D6";
const POSIT = color.postit;
const POSIT_2 = color.postit2;

/** Custom properties por elemento (`--i`, `--dx`...) que leen las animaciones. */
function vars(values: Record<string, string | number>): CSSProperties {
  return values as CSSProperties;
}

/** Icono de origen de cada fila, en orden: WhatsApp, hoja, papel y pósit. */
type IconoFila = "chat" | "hoja" | "papel" | "sobre";
const ICONOS: readonly IconoFila[] = ["chat", "hoja", "papel", "sobre"];

/**
 * Icono de origen dibujado en una caja de 32 × 32 con su esquina en (0, 0).
 * Las dos composiciones lo colocan con un `transform`.
 */
function IconoOrigen({ icono, trazo }: { icono: IconoFila; trazo: number }) {
  const linea = { fill: "none", stroke: TINTA, strokeWidth: trazo, strokeLinejoin: "round" as const };
  return (
    <>
      <rect width="32" height="32" rx="8" fill={PASTILLA} />
      {icono === "chat" && (
        <path
          d="M8 10.5a3.5 3.5 0 0 1 3.5-3.5h9a3.5 3.5 0 0 1 3.5 3.5v5a3.5 3.5 0 0 1-3.5 3.5h-6l-4.5 3.5v-3.6a3.5 3.5 0 0 1-2-3.4z"
          {...linea}
        />
      )}
      {icono === "hoja" && (
        <g fill="none" stroke={TINTA} strokeWidth={trazo}>
          <rect x="8" y="8" width="16" height="16" rx="1.5" />
          <path d="M8 13.5h16M8 18.5h16M14 8v16" />
        </g>
      )}
      {icono === "papel" && <path d="M9 8h14v16h-14zM12 13h8M12 17h8M12 21h5" {...linea} />}
      {icono === "sobre" && <path d="M8 9h16v12h-16zM8 9.5l8 6 8-6" {...linea} />}
    </>
  );
}

/**
 * Los controles de la ventana son el glifo del logo: barra, cuadrado hueco
 * («pendiente») y cuadrado cobalto («hecho»). `x`, `y` es la esquina del
 * cuadrado macizo.
 */
function Glifo({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x - 32} y={y + 4} width="11" height="3" fill={TINTA} />
      <rect x={x - 15} y={y + 1} width="9" height="9" fill="none" stroke={TINTA} strokeWidth="2" />
      <rect x={x} y={y} width="11" height="11" fill={COBALTO} />
    </>
  );
}

/**
 * Cuadrado de estado: macizo cobalto si está hecho, hueco si está pendiente.
 * `x`, `y` y `lado` son los del cuadrado macizo; el hueco ocupa la misma
 * caja contando su trazo de 2.
 */
function MarcaEstado({ hecho, x, y, lado }: { hecho: boolean; x: number; y: number; lado: number }) {
  if (hecho) return <rect x={x} y={y} width={lado} height={lado} fill={COBALTO} />;
  return <rect x={x + 1} y={y + 1} width={lado - 2} height={lado - 2} fill="none" stroke={TINTA} strokeWidth="2" />;
}

interface GeometriaFila {
  /** Borde superior de la fila (con el medio píxel del trazo). */
  y: number;
  x: number;
  ancho: number;
  alto: number;
}

/** Hueco punteado de la fila y, encima, la fila con su resalte. */
function Fila({
  fila,
  indice,
  caja,
  icono,
  compacta,
}: {
  fila: DatosFila;
  indice: number;
  caja: GeometriaFila;
  icono: IconoFila;
  compacta: boolean;
}) {
  const { x, y, ancho, alto } = caja;
  // Posiciones del prototipo, relativas al borde superior de cada fila.
  const g = compacta
    ? { icono: [24, 12.5, 0.9375], texto: 64, titulo: 24.5, origen: 43.5, marca: [211, 15.5, 10], estado: [226, 24.5], trazo: 1.6 }
    : { icono: [226, 12.5, 1], texto: 272, titulo: 25.5, origen: 44.5, marca: [468, 17.5, 11], estado: [486, 27.5], trazo: 1.5 };
  const [ix, iy, escala] = g.icono;
  const [mx, my, lado] = g.marca;
  const [ex, ey] = g.estado;

  return (
    <g className={styles.row} data-i={indice} style={vars({ "--i": indice })}>
      <rect x={x} y={y} width={ancho} height={alto} rx="10" fill="#fff" stroke={FILETE} />
      <rect
        className={styles.hl}
        x={x}
        y={y}
        width={ancho}
        height={alto}
        rx="10"
        fill={COBALTO_50}
        stroke={COBALTO}
        strokeWidth="1.5"
      />
      <g transform={`translate(${ix} ${y + iy}) scale(${escala})`}>
        <IconoOrigen icono={icono} trazo={g.trazo} />
      </g>
      <text className={styles.tRow} x={g.texto} y={y + g.titulo}>
        {fila.titulo}
      </text>
      <text className={styles.tSrc} x={g.texto} y={y + g.origen}>
        {fila.origen}
      </text>
      <MarcaEstado hecho={fila.hecho} x={mx} y={y + my} lado={lado} />
      <text className={styles.tSt} x={ex} y={y + ey}>
        {fila.estado}
      </text>
    </g>
  );
}

/**
 * Una pieza suelta del caos. Tres capas: `piece` vuela a su fila (`--dx`,
 * `--dy`, `--rr`), `bob` flota y `pop` aparece. `data-piece` permite contar
 * las piezas de la composición visible y `data-i` elige su recordatorio.
 */
function Pieza({
  indice,
  vuelo,
  children,
}: {
  indice: number;
  vuelo: { dx: number; dy: number; rr: number };
  children: ReactNode;
}) {
  return (
    <g
      className={styles.piece}
      data-piece=""
      data-i={indice}
      style={vars({ "--i": indice, "--dx": `${vuelo.dx}px`, "--dy": `${vuelo.dy}px`, "--rr": `${vuelo.rr}deg` })}
    >
      <g className={styles.bob}>
        <g className={styles.pop}>{children}</g>
      </g>
    </g>
  );
}

/**
 * Composición de escritorio y tableta (4.1, desde 768 px): ventana con barra
 * lateral, cuatro filas y cuatro piezas. Ninguna pieza tapa el glifo de la
 * ventana ni el título «Hoy».
 */
function ArteEscritorio({ textos }: { textos: Ilustracion["escritorio"] }) {
  const { chat, hoja, nota, postit } = textos.piezas;
  const ultima = hoja.valores.length - 1;

  return (
    <svg
      data-hero-art=""
      className={`${styles.art} hidden 768:block`}
      viewBox="0 0 640 540"
      role="img"
      aria-labelledby="hero-arte-escritorio-titulo"
    >
      <title id="hero-arte-escritorio-titulo">{textos.titulo}</title>
      <defs>
        <filter id="hero-arte-escritorio-sombra" x="-12%" y="-10%" width="124%" height="132%">
          <feDropShadow dx="0" dy="20" stdDeviation="20" floodColor={TINTA} floodOpacity=".09" />
        </filter>
        <filter id="hero-arte-escritorio-sombra-pieza" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor={TINTA} floodOpacity=".10" />
        </filter>
        <clipPath id="hero-arte-escritorio-ventana">
          <rect x="44" y="76" width="552" height="416" rx="14" />
        </clipPath>
      </defs>

      <g>
        <rect x="44" y="76" width="552" height="416" rx="14" fill="#fff" filter="url(#hero-arte-escritorio-sombra)" />
        <g clipPath="url(#hero-arte-escritorio-ventana)">
          <rect x="44" y="118" width="140" height="374" fill={FONDO} />
          <line x1="184" y1="118" x2="184" y2="492" stroke={FILETE} />
          <line x1="44" y1="118.5" x2="596" y2="118.5" stroke={FILETE} />
        </g>
        <rect x="44.5" y="76.5" width="551" height="415" rx="13.5" fill="none" stroke={FILETE_2} />
        <Glifo x={94} y={92} />
        <rect x="250" y="88" width="140" height="18" rx="9" fill={PASTILLA} />

        {/* Barra lateral: «Hoy» activo y el resto con el cuadrado hueco. */}
        <rect x="56" y="132" width="116" height="30" rx="7" fill={COBALTO_50} />
        {textos.menu.map((entrada, i) =>
          i === 0 ? (
            <g key={entrada}>
              <rect x="68" y="142.5" width="9" height="9" fill={COBALTO} />
              <text className={`${styles.tSide} ${styles.tSideOn}`} x="86" y="152">
                {entrada}
              </text>
            </g>
          ) : (
            <g key={entrada}>
              <rect
                x="68.75"
                y={177.25 + (i - 1) * 34}
                width="7.5"
                height="7.5"
                fill="none"
                stroke={GRIS_ICONO}
                strokeWidth="1.5"
              />
              <text className={styles.tSide} x="86" y={186 + (i - 1) * 34}>
                {entrada}
              </text>
            </g>
          ),
        )}

        <text className={styles.tH} x="212" y="158">
          {textos.cabecera}
        </text>
        <text className={styles.tSub} x="212" y="179">
          {textos.actualizado}
        </text>
        <rect x="492" y="138" width="84" height="32" rx="8" fill={COBALTO} />
        <path d="M506 154h10M511 149v10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        <text className={styles.tBtn} x="522" y="158.5">
          {textos.boton}
        </text>

        <g className={styles.ph} fill="none" stroke={FILETE_2} strokeDasharray="4 5">
          {textos.filas.map((fila, i) => (
            <rect key={fila.titulo} x="212.5" y={196.5 + i * 70} width="363" height="57" rx="10" />
          ))}
        </g>

        {textos.filas.map((fila, i) => (
          <Fila
            key={fila.titulo}
            fila={fila}
            indice={i}
            caja={{ x: 212.5, y: 196.5 + i * 70, ancho: 363, alto: 57 }}
            icono={ICONOS[i]}
            compacta={false}
          />
        ))}
      </g>

      {/* WhatsApp va a media altura para no tapar nunca los controles ni «Hoy».
          El doble check va 6 unidades más a la derecha que en el prototipo para
          no pisar «Lo miro y te digo». */}
      <Pieza indice={0} vuelo={{ dx: 253, dy: -17, rr: 3 }}>
        <g transform="translate(0 172) rotate(-3 139 69)" filter="url(#hero-arte-escritorio-sombra-pieza)">
          <path
            d="M24 18H254a16 16 0 0 1 16 16v14a16 16 0 0 1-16 16H30l-18 9 4-13a16 16 0 0 1-8-14V34a16 16 0 0 1 16-16z"
            fill="#fff"
            stroke={FILETE_2}
          />
          <text className={styles.tChat} x="24" y="46">
            {chat.pregunta}
          </text>
          <rect x="96.5" y="80.5" width="172" height="38" rx="14" fill={COBALTO_50} stroke={COBALTO_100} />
          <path d="M260 112l14 10-3-15z" fill={COBALTO_50} />
          <text className={styles.tChat} x="112" y="104">
            {chat.respuesta}
          </text>
          <path
            d="M238 101l3 3 6-6M244 101l3 3 6-6"
            fill="none"
            stroke={COBALTO}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </Pieza>

      {/* Hoja de cálculo con la celda «¿?» seleccionada, arriba a la derecha. */}
      <Pieza indice={1} vuelo={{ dx: -113, dy: 230, rr: -4 }}>
        <g transform="translate(0 -8) rotate(4 507 73)" filter="url(#hero-arte-escritorio-sombra-pieza)">
          <rect x="394.5" y="10.5" width="225" height="125" fill="#fff" stroke={FILETE_2} />
          <rect x="395" y="11" width="224" height="21" fill={PASTILLA} />
          <rect x="395" y="32" width="21" height="103" fill={PASTILLA} />
          <path d="M416 11v124M508 11v124M568 11v124M395 32h224M395 58h224M395 84h224M395 110h224" stroke={CELDA} />
          {hoja.columnas.map((columna, i) => (
            <text key={columna} className={styles.tCol} x={[459, 535, 590][i]} y="25">
              {columna}
            </text>
          ))}
          {hoja.numeros.map((numero, i) => (
            <text key={numero} className={styles.tCol} x="403" y={49 + i * 26}>
              {numero}
            </text>
          ))}
          {hoja.cabeceras.map((cabecera, i) => (
            <text key={cabecera} className={`${styles.tCell} ${styles.tCellB}`} x={[424, 516, 576][i]} y="50">
              {cabecera}
            </text>
          ))}
          {hoja.valores.map((valor, i) => (
            <g key={valor}>
              <rect x="424" y={67 + i * 26} width={[60, 48, 66][i]} height="7" rx="3.5" fill={BARRA} />
              <text className={i === ultima ? `${styles.tCell} ${styles.tCellB}` : styles.tCell} x="516" y={76 + i * 26}>
                {valor}
              </text>
              <rect x="576" y={67 + i * 26} width={[26, 30, 22][i]} height="7" rx="3.5" fill={BARRA} />
            </g>
          ))}
          <rect x="509" y="111" width="58" height="23" fill="none" stroke={COBALTO} strokeWidth="2" />
          <rect x="564" y="131" width="6" height="6" fill={COBALTO} />
        </g>
      </Pieza>

      {/* Nota de papel dentada, abajo a la izquierda. */}
      <Pieza indice={2} vuelo={{ dx: 303, dy: -67, rr: 6 }}>
        <g transform="rotate(-6 91 437)" filter="url(#hero-arte-escritorio-sombra-pieza)">
          <path
            d="M10 372l9-6 9 6 9-6 9 6 9-6 9 6 9-6 9 6 9-6 9 6 9-6 9 6 9-6 9 6 9-6 9 6 9-6 1 1V508H10z"
            fill={PAPEL}
            stroke={FILETE_2}
            strokeLinejoin="round"
          />
          <path d="M22 404h140M22 428h140M22 452h140M22 476h140" stroke={RENGLON} />
          {nota.lineas.map((linea, i) => (
            <text key={linea} className={styles.tHand} x="24" y={398 + i * 24}>
              {linea}
            </text>
          ))}
          <path
            d="M24 446c6-5 11 4 17 0s11-5 17 0 11 4 17 0 11-5 17 0"
            fill="none"
            stroke={TINTA_2}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M24 470c6-5 11 4 17 0s11-5 17 0" fill="none" stroke={TINTA_2} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </Pieza>

      {/* Pósit, abajo a la derecha. La última línea va más marcada. */}
      <Pieza indice={3} vuelo={{ dx: -164, dy: -16, rr: -5 }}>
        <g transform="rotate(5 558 456)" filter="url(#hero-arte-escritorio-sombra-pieza)">
          <rect x="486" y="386" width="140" height="136" fill={POSIT} />
          <rect x="486" y="386" width="140" height="18" fill={POSIT_2} />
          {postit.lineas.map((linea, i) => (
            <text
              key={linea}
              className={i === postit.lineas.length - 1 ? `${styles.tHand} ${styles.tHandBold}` : styles.tHand}
              x="502"
              y={[436, 458, 488][i]}
            >
              {linea}
            </text>
          ))}
          <path d="M500 496c10-4 22-4 40-1" fill="none" stroke={TINTA} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </Pieza>
    </svg>
  );
}

/**
 * Composición móvil propia (4.2, hasta 767 px): ventana a todo el ancho, sin
 * barra lateral, tres filas y tres piezas por debajo de y = 90, para no tapar
 * el glifo, «Hoy» ni «Nuevo».
 */
function ArteMovil({ textos }: { textos: Ilustracion["movil"] }) {
  const { chat, hoja, nota } = textos.piezas;
  const ultima = hoja.valores.length - 1;

  return (
    <svg
      data-hero-art=""
      className={`${styles.art} ${styles.artMobile} mx-auto block max-w-[440px] 768:hidden`}
      viewBox="0 0 320 300"
      role="img"
      aria-labelledby="hero-arte-movil-titulo"
    >
      <title id="hero-arte-movil-titulo">{textos.titulo}</title>
      <defs>
        <filter id="hero-arte-movil-sombra" x="-12%" y="-10%" width="124%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor={TINTA} floodOpacity=".09" />
        </filter>
        <filter id="hero-arte-movil-sombra-pieza" x="-20%" y="-25%" width="140%" height="170%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor={TINTA} floodOpacity=".11" />
        </filter>
      </defs>

      <g>
        <rect x="4" y="4" width="312" height="292" rx="14" fill="#fff" filter="url(#hero-arte-movil-sombra)" />
        <rect x="4.5" y="4.5" width="311" height="291" rx="13.5" fill="none" stroke={FILETE_2} />
        <line x1="5" y1="42.5" x2="315" y2="42.5" stroke={FILETE} />
        <Glifo x={50} y={18} />
        <rect x="120" y="16" width="80" height="14" rx="7" fill={PASTILLA} />
        <text className={styles.tH} x="18" y="78">
          {textos.cabecera}
        </text>
        <rect x="236" y="56" width="68" height="28" rx="7" fill={COBALTO} />
        <path d="M246 70h9M250.5 65.5v9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        <text className={styles.tBtn} x="260" y="74.5">
          {textos.boton}
        </text>

        <g className={styles.ph} fill="none" stroke={FILETE_2} strokeDasharray="4 5">
          {textos.filas.map((fila, i) => (
            <rect key={fila.titulo} x="14.5" y={96.5 + i * 62} width="291" height="56" rx="10" />
          ))}
        </g>

        {textos.filas.map((fila, i) => (
          <Fila
            key={fila.titulo}
            fila={fila}
            indice={i}
            caja={{ x: 14.5, y: 96.5 + i * 62, ancho: 291, alto: 56 }}
            icono={ICONOS[i]}
            compacta
          />
        ))}
      </g>

      {/* WhatsApp abajo (solo la pregunta), vuela hacia arriba a la fila 1. */}
      <Pieza indice={0} vuelo={{ dx: 24, dy: -133, rr: 2 }}>
        <g transform="rotate(-2 136 257)" filter="url(#hero-arte-movil-sombra-pieza)">
          <path
            d="M26 234H246a16 16 0 0 1 16 16v14a16 16 0 0 1-16 16H32l-18 9 4-13a16 16 0 0 1-8-14V250a16 16 0 0 1 16-16z"
            fill="#fff"
            stroke={FILETE_2}
          />
          <text className={styles.tChat} x="25" y="262">
            {chat.pregunta}
          </text>
        </g>
      </Pieza>

      {/* Hoja de cálculo arriba a la izquierda. */}
      <Pieza indice={1} vuelo={{ dx: 81, dy: 43, rr: -3 }}>
        <g transform="rotate(-4 79 143)" filter="url(#hero-arte-movil-sombra-pieza)">
          <rect x="12.5" y="96.5" width="134" height="94" fill="#fff" stroke={FILETE_2} />
          <rect x="13" y="97" width="133" height="17" fill={PASTILLA} />
          <rect x="13" y="114" width="15" height="76" fill={PASTILLA} />
          <path d="M28 97v93M88 97v93M13 114h133M13 139h133M13 164h133" stroke={CELDA} />
          {hoja.columnas.map((columna, i) => (
            <text key={columna} className={styles.tCol} x={[55, 114][i]} y="109.5">
              {columna}
            </text>
          ))}
          {hoja.numeros.map((numero, i) => (
            <text key={numero} className={styles.tCol} x="18" y={[130, 155, 181][i]}>
              {numero}
            </text>
          ))}
          {hoja.cabeceras.map((cabecera, i) => (
            <text key={cabecera} className={`${styles.tCell} ${styles.tCellB}`} x={[34, 94][i]} y="131">
              {cabecera}
            </text>
          ))}
          {hoja.valores.map((valor, i) => (
            <g key={valor}>
              <rect x="34" y={148 + i * 25} width={[44, 36][i]} height="7" rx="3.5" fill={BARRA} />
              <text className={i === ultima ? `${styles.tCell} ${styles.tCellB}` : styles.tCell} x="94" y={156 + i * 26}>
                {valor}
              </text>
            </g>
          ))}
          <rect x="89" y="165" width="56" height="24" fill="none" stroke={COBALTO} strokeWidth="2" />
          <rect x="142" y="186" width="6" height="6" fill={COBALTO} />
        </g>
      </Pieza>

      {/* Nota de papel arriba a la derecha. Un diente más ancha que en el
          prototipo: con la Schibsted de next/font «Pedido pendiente» se salía
          del papel. */}
      <Pieza indice={2} vuelo={{ dx: -81, dy: 105, rr: 4 }}>
        <g transform="rotate(5 241 143)" filter="url(#hero-arte-movil-sombra-pieza)">
          <path
            d="M176 104l5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5V184H176z"
            fill={PAPEL}
            stroke={FILETE_2}
            strokeLinejoin="round"
          />
          <path d="M186 132h120M186 154h120M186 176h120" stroke={RENGLON} />
          {nota.lineas.map((linea, i) => (
            <text key={linea} className={styles.tHand} x="186" y={127 + i * 22}>
              {linea}
            </text>
          ))}
          <path
            d="M186 170c5-4 9 3 14 0s9-4 14 0 9 3 14 0 9-4 14 0"
            fill="none"
            stroke={TINTA_2}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </Pieza>
    </svg>
  );
}

/**
 * Las dos composiciones del hero. El servidor pinta las dos y la CSS muestra
 * una u otra (escritorio desde 768 px), así no hay salto al hidratar. La que
 * está oculta con `display: none` tampoco llega al árbol de accesibilidad:
 * cada visitante oye un solo `<title>`.
 *
 * Es un componente de servidor: el SVG no viaja en el JS del navegador. Lo
 * envuelve `HeroIllustration`, que solo escribe el estado en la figura.
 */
export function HeroArt({ ilustracion }: { ilustracion: Ilustracion }) {
  return (
    <>
      <ArteEscritorio textos={ilustracion.escritorio} />
      <ArteMovil textos={ilustracion.movil} />
    </>
  );
}
