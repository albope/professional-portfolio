const durationMinutes = 30;
const calLink = "bpmtechstudio/30min";

/**
 * Evento público de Cal.com verificado con el dueño. Aquí solo vive el
 * destino: los rótulos («Reservar una llamada de 30 min», «o reserva una
 * llamada de 30 min»...) y los textos del diálogo están en `copy.json`. No
 * importa el copy para que el diálogo, que es cliente, no lo arrastre al JS
 * del navegador.
 */
export const booking = {
  calLink,
  url: `https://cal.com/${calLink}`,
  durationMinutes,
} as const;
