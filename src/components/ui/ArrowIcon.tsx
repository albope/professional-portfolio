import { cn } from "@/lib/utils";

export type ArrowDirection = "right" | "up-right" | "down";

const rotation: Record<ArrowDirection, string> = {
  right: "",
  "up-right": "-rotate-45",
  down: "rotate-90",
};

/**
 * Flecha de trazo de botones y enlaces (la del prototipo: 16 × 16, trazo 1,8
 * con puntas redondas). Siempre decorativa: el texto del enlace ya dice
 * adónde lleva. Para que avance al pasar el ratón, el enlace o botón lleva un
 * `group/<nombre>` y se pasa aquí la clase de hover correspondiente, como
 * hacen `Button` y `ArrowLink`.
 */
export function ArrowIcon({
  direction = "right",
  className,
}: {
  direction?: ArrowDirection;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("h-4 w-4 flex-none", rotation[direction], className)}
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
