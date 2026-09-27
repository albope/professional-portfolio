import type {FilaId} from "../textos"

// Contratos de traspaso entre escenas. Las escenas pasan valores YA suavizados
// (salvo `vuelo`, que es progreso lineal y el kit le aplica ease.inOut).
// `dx` y `dy` en px.

export interface CaosEstado {
  rotulo: {opacidad: number, dy: number}
  respira: {chat: number, hoja: number, nota: number, posit: number}   // dy en px, de respira()
  contenido: number                                                   // 1 textos visibles, 0 solo siluetas
  posit: {opacidad: number, caida: number}                            // caida 0 arriba, 1 posado
  seleccionChat: {progreso: number, opacidad: number}
  seleccionHoja: number                                               // 0 en «¿?», 1 en la celda destino
  tecleo: {caracteres: number, caret: number}                         // 0 a 9, caret 0 o 1
  escribiendo: {opacidad: number, entrada: number, fase: number}      // fase = frame relativo de S2
  nuevo: {opacidad: number, entrada: number}
  vuelo: {chat: number, hoja: number, nota: number, posit: number}    // progreso LINEAL 0 a 1
}

export const CAOS_POSTER: CaosEstado = {
  rotulo: {opacidad: 1, dy: 0}, respira: {chat: 0, hoja: 0, nota: 0, posit: 0}, contenido: 1,
  posit: {opacidad: 0, caida: 0}, seleccionChat: {progreso: 0, opacidad: 0}, seleccionHoja: 0,
  tecleo: {caracteres: 0, caret: 0}, escribiendo: {opacidad: 0, entrada: 0, fase: 0},
  nuevo: {opacidad: 0, entrada: 0}, vuelo: {chat: 0, hoja: 0, nota: 0, posit: 0},
}
export const CAOS_FIN_S1: CaosEstado = {...CAOS_POSTER, posit: {opacidad: 1, caida: 1}}
export const CAOS_FIN_S2: CaosEstado = {
  ...CAOS_FIN_S1,
  seleccionChat: {progreso: 1, opacidad: 0}, seleccionHoja: 1,
  tecleo: {caracteres: 9, caret: 0}, escribiendo: {opacidad: 0, entrada: 1, fase: 96},
  nuevo: {opacidad: 1, entrada: 1},
}

export interface FilaEstado {
  baldosa: number, superficie: number, texto: number
  dibujo: number                  // trazo del □ (0 a 1)
  relleno: number                 // ■ que crece desde el centro (0 a 1)
  inicial: {opacidad: number, dx: number}
  final: {opacidad: number, dx: number}
  boton: {opacidad: number, fondo: number}   // fondo 0 blanco, 1 cobalto-50, 2 cobalto-100
  tinte: number
}
export interface AppEstado {
  ventana: {opacidad: number, entrada: number, textos: number}   // textos: menú lateral, «Hoy», subtítulo y chip
  glifo: {barra: number, hueco: number, macizo: number}
  chip: {dibujo: number, relleno: number, fondo: number, pendiente: number, hecho: {opacidad: number, dx: number}}
  filas: Record<FilaId, FilaEstado>
  senal: {cabeza: number, cola: number}
  toast: {opacidad: number, dy: number}
  onda: number                    // 0 a 1, solo S4
}

export const FILA_OCULTA: FilaEstado = {
  baldosa: 0, superficie: 0, texto: 0, dibujo: 0, relleno: 0,
  inicial: {opacidad: 0, dx: 8}, final: {opacidad: 0, dx: 8}, boton: {opacidad: 0, fondo: 0}, tinte: 0,
}
export const FILA_REVELADA: FilaEstado = {...FILA_OCULTA, baldosa: 1, superficie: 1, texto: 1}

export const APP_OCULTA: AppEstado = {
  ventana: {opacidad: 0, entrada: 0, textos: 0}, glifo: {barra: 0, hueco: 0, macizo: 0},
  chip: {dibujo: 1, relleno: 0, fondo: 0, pendiente: 1, hecho: {opacidad: 0, dx: 8}},
  filas: {reserva: FILA_OCULTA, cobros: FILA_OCULTA, pedido: FILA_OCULTA, aviso: FILA_OCULTA},
  senal: {cabeza: 0, cola: 0}, toast: {opacidad: 0, dy: 16}, onda: 0,
}
export const APP_FIN_S3: AppEstado = {
  ...APP_OCULTA,
  ventana: {opacidad: 1, entrada: 1, textos: 1}, glifo: {barra: 1, hueco: 1, macizo: 1},
  filas: {
    reserva: {...FILA_REVELADA, boton: {opacidad: 1, fondo: 0}},
    cobros: {...FILA_REVELADA, relleno: 1, inicial: {opacidad: 1, dx: 0}},
    pedido: {...FILA_REVELADA, relleno: 1, inicial: {opacidad: 1, dx: 0}},
    aviso: {...FILA_REVELADA, dibujo: 1, inicial: {opacidad: 1, dx: 0}},
  },
}
export const APP_FIN_S4: AppEstado = {
  ...APP_FIN_S3,
  filas: {
    ...APP_FIN_S3.filas,
    reserva: {...FILA_REVELADA, relleno: 1, final: {opacidad: 1, dx: 0}, boton: {opacidad: 0, fondo: 1}},
    aviso: {...FILA_REVELADA, dibujo: 1, relleno: 1, inicial: {opacidad: 0, dx: 0}, final: {opacidad: 1, dx: 0}},
  },
  senal: {cabeza: 1, cola: 1}, toast: {opacidad: 1, dy: 0},
}
export const APP_FINAL: AppEstado = {
  ...APP_FIN_S4,
  toast: {opacidad: 0, dy: 12},
  chip: {dibujo: 1, relleno: 1, fondo: 1, pendiente: 0, hecho: {opacidad: 1, dx: 0}},
}
