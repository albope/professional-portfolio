import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnalyticsProperties } from "@/lib/analytics";

type Variant = "solid" | "outline";
type Tone = "ink" | "paper";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 px-6 text-center text-[15px] font-semibold leading-snug transition-colors duration-300 ease-editorial active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-60";

/** 48 px sobre papel · 52 px sobre tinta y a todo el ancho en móvil. */
const sizes: Record<Size, string> = {
  md: "min-h-12",
  lg: "min-h-[52px]",
};

const styles: Record<Tone, Record<Variant, string>> = {
  ink: {
    solid: "bg-ink text-paper hover:bg-cobalt",
    outline: "border border-ink px-[22px] text-ink hover:bg-paper-2",
  },
  paper: {
    solid: "bg-paper text-ink hover:bg-cobalt-bright",
    outline:
      "border border-paper/45 px-5 text-paper hover:border-cobalt-bright hover:text-cobalt-bright",
  },
};

interface ButtonProps {
  href?: string;
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  trackLocation?: string;
  trackNeed?: string;
  trackProject?: string;
  trackDestination?: AnalyticsProperties["destination"];
}

export function Button({
  href,
  variant = "solid",
  tone = "ink",
  size = "md",
  external,
  className,
  children,
  type = "button",
  onClick,
  disabled,
  trackLocation,
  trackNeed,
  trackProject,
  trackDestination = "contact",
}: ButtonProps) {
  const classes = cn(base, sizes[size], styles[tone][variant], className);
  const tracking = {
    "data-track": trackLocation ? "cta_click" : undefined,
    "data-track-location": trackLocation,
    "data-track-destination": trackLocation ? trackDestination : undefined,
    "data-track-need": trackNeed,
    "data-track-project": trackProject,
  };

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...tracking}>
        {children}
        <span className="sr-only"> (se abre en otra pestaña)</span>
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} {...tracking}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} {...tracking}>
      {children}
    </button>
  );
}
