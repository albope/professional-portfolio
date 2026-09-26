import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge tiene que conocer los tokens propios de `tailwind.config.ts`.
 * Si no, `text-small` no se reconoce como tamaño, se toma por un color y
 * `cn("text-small", "text-ink-2")` descarta el tamaño en silencio. Lo mismo
 * con los radios, sombras, espaciados y curvas con nombre propio.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "h1", "h2", "h3", "feature-name", "lead", "body", "small", "caption", "micro",
        "button", "button-sm", "button-lg",
      ],
      radius: ["control", "shot", "portrait", "card", "feature", "form", "pill"],
      shadow: ["capture", "phone", "phone-lg", "form", "menu"],
      spacing: ["gutter", "header", "section", "section-tight", "sec-head"],
      "font-weight": ["title"],
      ease: ["soft", "io", "snap"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
