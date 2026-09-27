import {ease, tween} from "../../lib/anim"
import {APP_OCULTA, CAOS_FIN_S2, FILA_OCULTA, type AppEstado, type CaosEstado, type FilaEstado} from "../../kit/estados"
import {PIEZA_DE_FILA, type FilaId} from "../../textos"
import {T} from "../../timeline"

const S = T.todoEnUnaApp

type Tramo = readonly [number, number]

/** Tramo de revelado de una fila, desplazado a L (fin del vuelo de su pieza). */
const desde = (L: number, [a, b]: Tramo): Tramo => [L + a, L + b]

/** Progreso LINEAL del vuelo de cada pieza: el kit le aplica ease.inOut. */
const vuelo = (f: number, tramo: Tramo) => tween(f, tramo, [0, 1], ease.linear)

/**
 * Revelado de la fila `id` relativo a L = fin del vuelo de su pieza: baldosa
 * (lineal), superficie, título y origen, marca y texto de estado. La marca de
 * «reserva» es el botón «Confirmar», la de «aviso» el □ que se traza y la de
 * «cobros» y «pedido» el ■ que crece desde el centro.
 */
const fila = (f: number, id: FilaId): FilaEstado => {
  const L = S.vuelos[PIEZA_DE_FILA[id]][1]
  const R = S.fila
  const marca = desde(L, R.marca)
  const estado = desde(L, R.estado)
  const base: FilaEstado = {
    ...FILA_OCULTA,
    baldosa: tween(f, desde(L, R.baldosa), [0, 1], ease.linear),
    superficie: tween(f, desde(L, R.superficie), [0, 1], ease.out),
    texto: tween(f, desde(L, R.texto), [0, 1], ease.out),
  }
  const inicial = {
    opacidad: tween(f, estado, [0, 1], ease.out),
    dx: tween(f, estado, [8, 0], ease.out),
  }
  switch (id) {
    case "reserva":
      return {...base, boton: {opacidad: tween(f, marca, [0, 1], ease.out), fondo: 0}}
    case "cobros":
    case "pedido":
      return {...base, relleno: tween(f, marca, [0, 1], ease.out), inicial}
    case "aviso":
      return {...base, dibujo: tween(f, marca, [0, 1], ease.inOut), inicial}
  }
}

/**
 * Estado del caos y de la aplicación en el fotograma f (relativo a S3, 0 a 129).
 * f = 0 devuelve CAOS_FIN_S2 + APP_OCULTA y f = 129 devuelve APP_FIN_S3 con el
 * caos entero en vuelo 1 (no se pinta nada de él). En móvil la fila «pedido» y
 * el vuelo de la nota se calculan igual aunque no se pinten, así el estado de
 * salida es el mismo objeto en los dos cortes.
 */
export const estadoS3 = (f: number): {caos: CaosEstado, app: AppEstado} => {
  const caos: CaosEstado = {
    ...CAOS_FIN_S2,
    rotulo: {
      opacidad: tween(f, S.rotuloSale, [1, 0], ease.inOut),
      dy: tween(f, S.rotuloSale, [0, -10], ease.inOut),
    },
    contenido: tween(f, S.contenidoSale, [1, 0], ease.inOut),
    vuelo: {
      chat: vuelo(f, S.vuelos.chat),
      hoja: vuelo(f, S.vuelos.hoja),
      nota: vuelo(f, S.vuelos.nota),
      posit: vuelo(f, S.vuelos.posit),
    },
  }

  const app: AppEstado = {
    ...APP_OCULTA,
    ventana: {
      opacidad: tween(f, S.ventanaOpacidad, [0, 1], ease.out),
      entrada: tween(f, S.ventanaEntrada, [0, 1], ease.out),
      textos: tween(f, S.ventanaTextos, [0, 1], ease.out),
    },
    glifo: {
      barra: tween(f, S.glifoBarra, [0, 1], ease.out),
      hueco: tween(f, S.glifoHueco, [0, 1], ease.inOut),
      macizo: tween(f, S.glifoMacizo, [0, 1], ease.out),
    },
    filas: {
      reserva: fila(f, "reserva"),
      cobros: fila(f, "cobros"),
      pedido: fila(f, "pedido"),
      aviso: fila(f, "aviso"),
    },
  }

  return {caos, app}
}
