import {ease, lerp, pressScale, tween} from "../../lib/anim"
import type {CaosEstado} from "../../kit/estados"
import {aGlobal, respira} from "../../kit/geom"
import type {Layout, Punto} from "../../layout"
import {RESPIRA, T} from "../../timeline"

const S = T.copiarAMano
const R = RESPIRA.copiarAMano

export interface CursorS2 {x: number, y: number, opacidad: number, escala: number}

/**
 * Puntos del cursor (punta de la flecha) en el lienzo, siempre con aGlobal a
 * partir de LAYOUT. Chat y hoja no respiran en S2, así que no llevan dy.
 */
export const puntosCursor = (L: Layout) => {
  const C = L.chat
  const sel = C.seleccion
  const yl = C.pregunta.caja.y + sel.y + sel.h / 2
  const H = L.hoja
  const {col, fila} = H.seleccion.destino
  const celda = {x: H.columnas[col].x + H.columnas[col].w / 2, y: H.filas[fila].y + H.filas[fila].h / 2}
  return {
    inicio: L.cursor.inicioS2,
    selIni: aGlobal(C.caja, C.giro, C.pregunta.caja.x + sel.x0, yl),
    selFin: aGlobal(C.caja, C.giro, C.pregunta.caja.x + sel.x1, yl),
    celda: aGlobal(H.caja, H.giro, celda.x, celda.y),
  }
}

const tramo = (a: Punto, b: Punto, q: number): Punto => ({x: lerp(a.x, b.x, q), y: lerp(a.y, b.y, q)})

/** El caret está encendido en los tramos [a, b) de `caretEncendido`. */
const caretEncendido = (f: number) => (S.caretEncendido.some(([a, b]) => f >= a && f < b) ? 1 : 0)

/**
 * Estado del caos y del cursor en el fotograma f (relativo a S2, 0 a dur − 1).
 * f = 0 devuelve CAOS_FIN_S1 y f = dur − 1 devuelve CAOS_FIN_S2.
 */
export const estadoS2 = (f: number, dur: number, L: Layout): {caos: CaosEstado, cursor: CursorS2} => {
  // Arrastre: el cursor y el resalte comparten el mismo progreso.
  const arrastre = tween(f, S.seleccion, [0, 1], ease.inOut)

  const caos: CaosEstado = {
    rotulo: {opacidad: 1, dy: 0},
    respira: {
      chat: 0,
      hoja: 0,
      nota: respira(f, dur, R.nota.k, R.nota.signo, L.respiracion),
      posit: respira(f, dur, R.posit.k, R.posit.signo, L.respiracion),
    },
    contenido: 1,
    posit: {opacidad: 1, caida: 1},
    seleccionChat: {
      progreso: arrastre,
      opacidad: f < S.seleccion[0] ? 0 : tween(f, S.resalteSale, [1, 0], ease.inOut),
    },
    seleccionHoja: tween(f, S.seleccionHoja, [0, 1], ease.inOut),
    tecleo: {caracteres: S.tecleo.filter((t) => f >= t).length, caret: caretEncendido(f)},
    escribiendo: {
      opacidad: f < S.escribiendoSale[0]
        ? tween(f, S.escribiendoEntra, [0, 1], ease.out)
        : tween(f, S.escribiendoSale, [1, 0], ease.inOut),
      entrada: tween(f, S.escribiendoEntra, [0, 1], ease.out),
      // Solo cambia mientras hay puntos: 0 al entrar y 96 al salir, como los contratos.
      fase: Math.min(f, S.puntos[1]),
    },
    nuevo: {
      opacidad: tween(f, S.nuevoOpacidad, [0, 1], ease.out),
      entrada: tween(f, S.nuevoEntra, [0, 1], ease.out),
    },
    vuelo: {chat: 0, hoja: 0, nota: 0, posit: 0},
  }

  const P = puntosCursor(L)
  let punta: Punto
  if (f <= S.cursorEntra[1]) punta = tramo(P.inicio, P.selIni, tween(f, S.cursorEntra, [0, 1], ease.inOut))
  else if (f <= S.seleccion[1]) punta = tramo(P.selIni, P.selFin, arrastre)
  else punta = tramo(P.selFin, P.celda, tween(f, S.cursorACelda, [0, 1], ease.inOut))

  const cursor: CursorS2 = {
    ...punta,
    opacidad: tween(f, S.cursorSale, [1, 0], ease.inOut),
    escala: pressScale(f, S.clic),
  }

  return {caos, cursor}
}
