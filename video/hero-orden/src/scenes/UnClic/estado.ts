import {ease, lerp, pressScale, tween} from "../../lib/anim"
import {APP_FIN_S3, type AppEstado, type FilaEstado} from "../../kit/estados"
import type {CursorProps} from "../../kit/Cursor"
import type {Punto} from "../../layout"
import {T} from "../../timeline"

const S = T.unClic

export interface PuntosS4 {inicioS4: Punto, clicS4: Punto, retiroS4: Punto}

/**
 * Fondo del botón «Confirmar»: hover blanco → cobalto-50 (0 → 1), clic
 * cobalto-50 → cobalto-100 (1 → 2) y suelta de vuelta a cobalto-50 (2 → 1).
 * El botón no se escala.
 */
const fondoBoton = (f: number) => {
  if (f <= S.press[0]) return tween(f, S.hover, [0, 1], ease.out)
  if (f <= S.suelta[0]) return tween(f, S.press, [1, 2], ease.out)
  return tween(f, S.suelta, [2, 1], ease.out)
}

/**
 * Estado de la aplicación y del cursor en el fotograma f (relativo a S4, 0 a 129).
 * f = 0 devuelve APP_FIN_S3 con el cursor en `inicioS4` (fuera del lienzo) y
 * f = 129 devuelve APP_FIN_S4 con el cursor a opacidad 0. La única acción humana
 * es el clic en «Confirmar». La señal, el ■ del aviso, «Enviado» y el aviso
 * llegan solos.
 */
export const estadoS4 = (f: number, p: PuntosS4): {app: AppEstado, cursor: CursorProps} => {
  // Los dos tintes vuelven a blanco a la vez.
  const vuelve = tween(f, S.tintesVuelven, [1, 0], ease.inOut)

  const reserva: FilaEstado = {
    ...APP_FIN_S3.filas.reserva,
    relleno: tween(f, S.marcaReserva, [0, 1], ease.out),
    final: {
      opacidad: tween(f, S.confirmadaEntra, [0, 1], ease.out),
      dx: tween(f, S.confirmadaEntra, [8, 0], ease.out),
    },
    boton: {opacidad: tween(f, S.botonSale, [1, 0], ease.inOut), fondo: fondoBoton(f)},
    tinte: tween(f, S.tinteReserva, [0, 1], ease.out) * vuelve,
  }

  const aviso: FilaEstado = {
    ...APP_FIN_S3.filas.aviso,
    relleno: tween(f, S.marcaAviso, [0, 1], ease.out),
    inicial: {opacidad: tween(f, S.pendienteSale, [1, 0], ease.inOut), dx: 0},
    final: {
      opacidad: tween(f, S.enviadoEntra, [0, 1], ease.out),
      dx: tween(f, S.enviadoEntra, [8, 0], ease.out),
    },
    tinte: tween(f, S.tinteAviso, [0, 1], ease.out) * vuelve,
  }

  const app: AppEstado = {
    ...APP_FIN_S3,
    filas: {...APP_FIN_S3.filas, reserva, aviso},
    senal: {
      cabeza: tween(f, S.senalTraza, [0, 1], ease.inOut),
      cola: tween(f, S.senalBorra, [0, 1], ease.inOut),
    },
    toast: {
      opacidad: tween(f, S.toastEntra, [0, 1], ease.out),
      dy: tween(f, S.toastEntra, [16, 0], ease.out),
    },
    // El kit pinta la onda en cobalto con opacidad 0,6·(1 − progreso). Con ease.out se apagaba en
    // 3 fotogramas (en f34, «onda a mitad» de §7.2, iba al 94 % y opacidad 0,06)
    // y no se leía a escala real. Con ease.inOut abraza el botón mientras se
    // pulsa y se expande al soltar. Terminada vuelve a 0, como en la salida.
    onda: f < S.onda[1] ? tween(f, S.onda, [0, 1], ease.inOut) : 0,
  }

  // Entra hasta el botón y, tras el clic, se retira en diagonal mientras se apaga.
  const {inicioS4: a, clicS4: b, retiroS4: c} = p
  const entra = tween(f, S.cursorEntra, [0, 1], ease.inOut)
  const sale = tween(f, S.cursorSale, [0, 1], ease.out)
  const cursor: CursorProps = f < S.cursorSale[0]
    ? {x: lerp(a.x, b.x, entra), y: lerp(a.y, b.y, entra), opacidad: 1, escala: pressScale(f, S.clic)}
    : {x: lerp(b.x, c.x, sale), y: lerp(b.y, c.y, sale), opacidad: 1 - sale, escala: 1}

  return {app, cursor}
}
