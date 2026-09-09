import { brandImage } from "@/lib/og";

export const alt = "BPM Tech. Software y webs que encajan en tu negocio.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return brandImage("Software y webs que encajan en tu negocio.", "Estudio de software · Valencia");
}
