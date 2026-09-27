import {ease, tween} from "../../lib/anim"
import {APP_FIN_S4, type AppEstado} from "../../kit/estados"
import {T} from "../../timeline"

const S = T.todoAlDia

/**
 * Estado de la aplicación en el fotograma f (relativo a S5, 0 a 89).
 * f = 0 devuelve APP_FIN_S4 (aviso en pantalla, chip «□ Por revisar») y de
 * f = 34 en adelante devuelve APP_FINAL: aviso fuera y chip «■ Todo al día»
 * sobre cobalto-50. «Por revisar» sale entero (16-22) antes de que entre
 * «Todo al día» (24-34). No hay cursor: acabó a opacidad 0 en S4.
 */
export const estadoS5 = (f: number): AppEstado => ({
  ...APP_FIN_S4,
  toast: {
    opacidad: tween(f, S.toastSale, [1, 0], ease.inOut),
    dy: tween(f, S.toastSale, [0, 12], ease.inOut),
  },
  chip: {
    dibujo: 1,
    relleno: tween(f, S.chipRelleno, [0, 1], ease.out),
    fondo: tween(f, S.chipFondo, [0, 1], ease.out),
    pendiente: tween(f, S.porRevisarSale, [1, 0], ease.inOut),
    hecho: {
      opacidad: tween(f, S.todoAlDiaEntra, [0, 1], ease.out),
      dx: tween(f, S.todoAlDiaEntra, [8, 0], ease.out),
    },
  },
})
