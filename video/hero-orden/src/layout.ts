import {useScene} from "./lib/scene"

// Única fuente de verdad de la geometría. Coordenadas absolutas del lienzo
// salvo donde se dice «local» (relativas a la esquina superior izquierda de la
// caja de su pieza SIN girar). Cada pieza gira alrededor del centro de su caja.
export const LAYOUT = {
  escritorio: {
    W: 1280, H: 1080, filete: 2, respiracion: 3,
    sombra: {
      pieza: "0 8px 16px rgba(16,16,19,0.08)",
      piezaAlzada: "0 24px 36px rgba(16,16,19,0.10)",
      ventana: "0 24px 48px rgba(16,16,19,0.08)",
      cursor: "drop-shadow(0 2px 3px rgba(16,16,19,0.18))",
    },
    rotulo: {caja: {x: 88, y: 80, w: 250, h: 52}, padX: 26, size: 28},
    chat: {
      caja: {x: 88, y: 164, w: 540, h: 352}, giro: -2,
      radio: 28, radioCola: 6, padX: 28, size: 32, lineaH: 44,
      pregunta: {caja: {x: 0, y: 0, w: 420, h: 136}, lineasY: [18, 62], hora: {y: 68, h: 36, derecha: 24, size: 28}},
      respuesta: {caja: {x: 60, y: 156, w: 480, h: 84}, textoY: 20, checks: {x: 412, y: 30, w: 40, h: 24}},
      escribiendo: {caja: {x: 0, y: 268, w: 128, h: 84}, punto: 14, centrosX: [39, 64, 89], centroY: 42},
      nuevo: {caja: {x: 0, y: 268, w: 440, h: 84}, textoY: 20, hora: {y: 24, h: 36, derecha: 24, size: 28}},
      seleccion: {x0: 28, x1: 272.5, y: 64, h: 40, radio: 4},
    },
    hoja: {
      caja: {x: 676, y: 124, w: 560, h: 300}, giro: 3,
      banda: 40, numeros: 40, rejilla: 2,
      columnas: [{x: 40, w: 170}, {x: 210, w: 200}, {x: 410, w: 150}],
      filas: [{y: 40, h: 52}, {y: 92, h: 52}, {y: 144, h: 52}, {y: 196, h: 52}],
      padX: 16, size: 28, barras: [96, 80, 112], barraH: 12,
      seleccion: {trazo: 3, tirador: 10, inicio: {col: 2, fila: 2}, destino: {col: 1, fila: 3}},
      caret: {w: 3, h: 32},
      pestanas: {y: 248, h: 52, x0: 8, anchos: [128, 107, 130, 170], size: 28},
    },
    nota: {
      caja: {x: 110, y: 664, w: 380, h: 250}, giro: -5,
      diente: {w: 20, h: 10}, renglones: [84, 128, 172, 216], renglonX: [24, 356],
      lineas: [{x: 28, y: 36, h: 48}, {x: 28, y: 80, h: 48}], size: 34,
      garabatos: [{x: 28, y: 160, w: 200}, {x: 28, y: 204, w: 120}],
    },
    posit: {
      caja: {x: 880, y: 624, w: 300, h: 290}, giro: 5, banda: 40,
      lineas: [{x: 32, y: 64, h: 52}, {x: 32, y: 116, h: 52}, {x: 32, y: 176, h: 56}], size: 38,
      subrayado: {x0: 30, x1: 130, y: 230, trazo: 4},
      caida: {dy: -100, giro: 11},
    },
    cursor: {
      escala: 1,
      inicioS2: {x: 640, y: 1120},
      // clicS4 con la punta bajo la línea base de «Confirmar» (8 px más abajo que en el plan) para no tapar la palabra al pulsar.
      inicioS4: {x: 1250, y: 1120}, clicS4: {x: 1030, y: 406}, retiroS4: {x: 1070, y: 446},
    },
    ventana: {caja: {x: 88, y: 96, w: 1104, h: 888}, radio: 28, borde: 2, barraH: 80, entradaDy: 24},
    glifo: {x: 132, cy: 136, barra: {w: 22, h: 6}, lado: 22, trazo: 4, gap: 10},
    direccion: {x: 500, y: 118, w: 280, h: 36},
    lateral: {
      caja: {x: 88, y: 178, w: 260, h: 804}, filete: 2,
      activo: {caja: {x: 108, y: 200, w: 220, h: 60}, radio: 20, marca: {x: 132, lado: 18}, textoX: 166},
      itemsCentroY: [290, 350, 410, 470], textoX: 132, lineaH: 44, size: 30,
    },
    cabecera: {
      hoy: {x: 380, y: 204, h: 64, size: 60},
      sub: {x: 380, y: 272, h: 36, size: 28},
      // Alineado a la derecha con las filas (1160) y centrado con «Hoy» (y 236). padX 32 centra «■ Todo al día»
      // (■ 24 + 12 + texto ≈ 165) en el chip: el final queda equilibrado.
      chip: {caja: {x: 896, y: 208, w: 264, h: 56}, radio: 28, padX: 32, marca: 24, trazo: 3, gap: 12, size: 32, borde: 2},
    },
    filas: {
      x: 380, w: 780, h: 120, tops: [332, 468, 604, 740], radio: 20, borde: 2, guion: [10, 10],
      baldosa: {dx: 24, dy: 28, lado: 64},
      titulo: {dx: 112, dy: 18, h: 44, size: 34},
      origen: {dx: 112, dy: 66, h: 36, size: 28},
      estado: {x: 938, dy: 20, h: 40, marca: 22, trazo: 3, gap: 12, size: 30},
      boton: {x: 952, dy: 34, w: 184, h: 52, radio: 16, borde: 3, size: 28},
      onda: 14,
    },
    // Canal derecho: entre el final de las filas (1160) y el borde interior de la ventana (1190).
    senal: {x: 1176, trazo: 6},
    toast: {caja: {x: 560, y: 890, w: 420, h: 56}, radio: 28, borde: 2, padX: 24, marca: 20, gap: 12, size: 30},
  },
  movil: {
    W: 960, H: 900, filete: 2, respiracion: 4,
    sombra: {
      pieza: "0 8px 18px rgba(16,16,19,0.08)",
      piezaAlzada: "0 24px 40px rgba(16,16,19,0.10)",
      ventana: "0 4px 8px rgba(16,16,19,0.06)",
      cursor: "drop-shadow(0 3px 4px rgba(16,16,19,0.18))",
    },
    rotulo: {caja: {x: 32, y: 26, w: 314, h: 60}, padX: 30, size: 36},
    chat: {
      caja: {x: 32, y: 106, w: 680, h: 380}, giro: -2,
      radio: 32, radioCola: 8, padX: 32, size: 40, lineaH: 52,
      pregunta: {caja: {x: 0, y: 0, w: 400, h: 156}, lineasY: [24, 76], hora: null},
      respuesta: {caja: {x: 96, y: 176, w: 584, h: 92}, textoY: 20, checks: {x: 508, y: 33, w: 44, h: 26}},
      escribiendo: {caja: {x: 0, y: 288, w: 152, h: 92}, punto: 16, centrosX: [46, 76, 106], centroY: 46},
      nuevo: {caja: {x: 0, y: 288, w: 432, h: 92}, textoY: 20, hora: null},
      seleccion: {x0: 32, x1: 337.6, y: 80, h: 44, radio: 5},
    },
    hoja: {
      caja: {x: 384, y: 516, w: 544, h: 340}, giro: 3,
      banda: 44, numeros: 44, rejilla: 2,
      columnas: [{x: 44, w: 150}, {x: 194, w: 190}, {x: 384, w: 160}],
      filas: [{y: 44, h: 60}, {y: 104, h: 60}, {y: 164, h: 60}, {y: 224, h: 60}],
      padX: 16, size: 36, barras: [104, 88, 120], barraH: 14,
      seleccion: {trazo: 4, tirador: 12, inicio: {col: 2, fila: 2}, destino: {col: 1, fila: 3}},
      caret: {w: 4, h: 42},
      pestanas: {y: 284, h: 56, x0: 8, anchos: [158, 158, 210], size: 36},
    },
    nota: null,
    posit: {
      caja: {x: 34, y: 540, w: 318, h: 300}, giro: -4, banda: 44,
      lineas: [{x: 36, y: 70, h: 58}, {x: 36, y: 128, h: 58}, {x: 36, y: 194, h: 62}], size: 44,
      subrayado: {x0: 34, x1: 146, y: 256, trazo: 5},
      caida: {dy: -120, giro: -10},
    },
    cursor: {
      escala: 1.3,
      inicioS2: {x: 480, y: 960},
      // clicS4 12 px más abajo que en el plan: la punta queda bajo la línea base de «Confirmar».
      inicioS4: {x: 1000, y: 960}, clicS4: {x: 750, y: 362}, retiroS4: {x: 790, y: 402},
    },
    // entradaDy 8: con 16 px de margen, +24 bajaba el borde de la ventana hasta 899 y cortaba su sombra
    // contra el borde del lienzo (S3 22-30). Con 8 nunca baja de su posición de reposo.
    ventana: {caja: {x: 16, y: 16, w: 928, h: 868}, radio: 34, borde: 2, barraH: 88, entradaDy: 8},
    glifo: {x: 56, cy: 60, barra: {w: 28, h: 8}, lado: 28, trazo: 5, gap: 12},
    direccion: {x: 360, y: 40, w: 240, h: 40},
    lateral: null,
    cabecera: {
      hoy: {x: 56, y: 128, h: 72, size: 64},
      sub: {x: 56, y: 204, h: 44, size: 36},
      // Alineado a la derecha con las filas (904) y centrado con «Hoy» (y 164). padX 36 centra «■ Todo al día»
      // (■ 30 + 14 + texto ≈ 215) en el chip.
      chip: {caja: {x: 574, y: 128, w: 330, h: 72}, radio: 36, padX: 36, marca: 30, trazo: 4, gap: 14, size: 42, borde: 3},
    },
    filas: {
      x: 56, w: 848, h: 148, tops: [272, 436, 600], radio: 24, borde: 2, guion: [12, 12],
      baldosa: {dx: 24, dy: 34, lado: 80},
      titulo: {dx: 128, dy: 22, h: 52, size: 42},
      origen: {dx: 128, dy: 78, h: 48, size: 36},
      estado: {x: 643, dy: 26, h: 44, marca: 28, trazo: 4, gap: 12, size: 36},
      boton: {x: 648, dy: 42, w: 232, h: 64, radio: 20, borde: 4, size: 36},
      onda: 16,
    },
    // Canal derecho: entre el final de las filas (904) y el borde interior de la ventana (942).
    senal: {x: 924, trazo: 7},
    toast: {caja: {x: 224, y: 784, w: 512, h: 68}, radio: 34, borde: 2, padX: 28, marca: 26, gap: 14, size: 36},
  },
} as const

export type Corte = keyof typeof LAYOUT
/** Geometría de un corte. Unión de los dos: `nota`, `lateral` y las horas del chat son null en móvil. */
export type Layout = (typeof LAYOUT)[Corte]
export interface Caja {x: number, y: number, w: number, h: number}
export interface Punto {x: number, y: number}

/** LAYOUT del corte de la composición actual. */
export const useLayout = (): Layout => LAYOUT[useScene().corte]
