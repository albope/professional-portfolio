import { copyEs } from "@/data/copy";
import { homeImage } from "@/lib/og";

export const alt = copyEs.meta.og_alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return homeImage();
}
