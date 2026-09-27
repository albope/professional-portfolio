export const TEXTOS = {
  rotulo: "Lunes, 9:00",
  chat: {
    pregunta: ["¿Tenéis hueco", "el jueves a las 19?"],
    respuesta: "Lo miramos y te decimos",
    nuevo: "¿Al final hay hueco?",
    horaPregunta: "9:02",
    horaNuevo: "9:41",
  },
  hoja: {
    cabeceras: ["Cliente", "Día", "Pagado"],
    dia: ["lunes", "martes"],
    pagado: ["sí", "¿?"],
    tecleo: "jueves 19",
    pestanas: {escritorio: ["Cobros", "Stock", "Stock 2", "Stock final"], movil: ["Cobros", "Stock 2", "Stock final"]},
  },
  nota: ["Pedido pendiente", "¿quién lo pidió?"],
  posit: ["Avisar al", "cliente", "¡hoy!"],
  app: {
    cabecera: "Hoy",
    subtitulo: "Lunes · Actualizado ahora",
    menu: ["Hoy", "Reservas", "Cobros", "Stock", "Pedidos"],
    chip: {pendiente: "Por revisar", hecho: "Todo al día"},
    boton: "Confirmar",
    toast: "Aviso enviado al cliente",
  },
  filas: {
    reserva: {icono: "chat", titulo: {escritorio: "Reserva, jueves 19:00", movil: "Reserva del jueves"}, origen: "Antes, en un mensaje", inicial: null, final: "Confirmada"},
    cobros: {icono: "hoja", titulo: "Cobros de la semana", origen: "Antes, en una hoja de cálculo", inicial: "Al día", final: null},
    pedido: {icono: "papel", titulo: "Pedido de material", origen: "Antes, en un papel", inicial: "Recibido", final: null},
    aviso: {icono: "posit", titulo: "Aviso al cliente", origen: "Antes, en un pósit", inicial: "Pendiente", final: "Enviado"},
  },
} as const

export type FilaId = "reserva" | "cobros" | "pedido" | "aviso"
// Orden de las filas en cada corte: el índice elige LAYOUT.filas.tops[i]
export const FILAS = {escritorio: ["reserva", "cobros", "pedido", "aviso"], movil: ["reserva", "cobros", "aviso"]} as const
// Pieza que vuela a cada fila
export const PIEZA_DE_FILA = {reserva: "chat", cobros: "hoja", pedido: "nota", aviso: "posit"} as const
