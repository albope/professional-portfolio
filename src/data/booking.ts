const durationMinutes = 30;
const calLink = "bpmtechstudio/30min";

/** Public Cal.com event verified with the owner; keep copy and destination together. */
export const booking = {
  calLink,
  url: `https://cal.com/${calLink}`,
  durationMinutes,
  title: "Primera conversación · BPM Tech",
  ctaLabel: `Reservar una llamada de ${durationMinutes} min`,
} as const;
