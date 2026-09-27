export const ESCENAS = [
  {id: "lunes-nueve", inicio: 0, duracion: 60},
  {id: "copiar-a-mano", inicio: 60, duracion: 130},
  {id: "todo-en-una-app", inicio: 190, duracion: 130},
  {id: "un-clic", inicio: 320, duracion: 130},
  {id: "todo-al-dia", inicio: 450, duracion: 90},
] as const
export const TOTAL = 540

export type EscenaId = (typeof ESCENAS)[number]["id"]

// Fotogramas RELATIVOS a cada escena. [a, b] = tween(frame, [a, b], ...)
export const T = {
  lunesNueve: {positOpacidad: [10, 16], positCaida: [10, 30]},
  copiarAMano: {
    cursorEntra: [0, 16], seleccion: [18, 30], cursorACelda: [32, 46], clic: 46,
    seleccionHoja: [46, 52], cursorSale: [48, 54],
    caretEncendido: [[50, 84], [99, 114]],
    tecleo: [52, 55, 57, 61, 63, 66, 69, 72, 75],
    resalteSale: [76, 84], escribiendoEntra: [80, 92], escribiendoSale: [92, 96], puntos: [80, 96],
    nuevoOpacidad: [94, 100], nuevoEntra: [94, 104],
  },
  todoEnUnaApp: {
    rotuloSale: [0, 10], contenidoSale: [12, 24],
    ventanaOpacidad: [22, 32], ventanaEntrada: [22, 46],
    // Los textos de la ventana esperan a que las siluetas dejen libres la cabecera y el lateral.
    ventanaTextos: [60, 72],
    glifoBarra: [32, 40], glifoHueco: [36, 46], glifoMacizo: [42, 52],
    vuelos: {chat: [36, 66], hoja: [46, 76], nota: [56, 86], posit: [66, 96]},
    // Revelado de la fila, relativo a L = fin del vuelo de su pieza
    fila: {baldosa: [-6, 0], superficie: [0, 8], texto: [2, 14], marca: [6, 14], estado: [8, 16]},
  },
  unClic: {
    cursorEntra: [0, 22], hover: [22, 28], clic: 28, press: [28, 32], suelta: [32, 36], onda: [28, 40],
    botonSale: [36, 42], tinteReserva: [36, 44], marcaReserva: [42, 52], confirmadaEntra: [46, 54],
    cursorSale: [40, 60], senalTraza: [50, 70], senalBorra: [70, 82],
    tinteAviso: [70, 78], marcaAviso: [70, 80], pendienteSale: [70, 75], enviadoEntra: [75, 84],
    toastEntra: [84, 96], tintesVuelven: [98, 118],
  },
  todoAlDia: {
    toastSale: [4, 14], porRevisarSale: [16, 22], chipFondo: [16, 28], chipRelleno: [20, 30], todoAlDiaEntra: [24, 34],
  },
} as const

// Respiración del caos: null = quieta
export const RESPIRA = {
  lunesNueve: {chat: {k: 1, signo: -1}, hoja: {k: 2, signo: 1}, nota: {k: 1, signo: 1}, posit: null},
  copiarAMano: {chat: null, hoja: null, nota: {k: 2, signo: 1}, posit: {k: 2, signo: -1}},
} as const
