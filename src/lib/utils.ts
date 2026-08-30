import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge necesita conocer los tamaños custom (text-display-*, text-lead)
// para no confundirlos con clases de color text-* y descartarlos al hacer merge.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-hero", "display-case", "display-sec", "lead"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
