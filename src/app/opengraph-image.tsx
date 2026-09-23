import { brandImage } from "@/lib/og";

export const alt = "BPM Tech. Software a medida para lo que hoy haces a mano.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return brandImage("Software a medida para lo que hoy haces a mano.", "Estudio de software · Valencia");
}
