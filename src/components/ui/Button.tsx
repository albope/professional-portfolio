import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnalyticsProperties } from "@/lib/analytics";

type Variant = "solid" | "outline";
type Tone = "ink" | "paper";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 px-6 py-4 text-center text-[15px] font-semibold leading-snug tracking-tight transition-colors duration-300 ease-editorial active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-60";

const styles: Record<Tone, Record<Variant, string>> = {
  ink: {
    solid: "bg-ink text-paper hover:bg-cobalt",
    outline: "border border-ink text-ink hover:bg-paper-2",
  },
  paper: {
    solid: "bg-paper text-ink hover:bg-cobalt-bright",
    outline: "border border-paper/35 text-paper hover:border-cobalt-bright",
  },
};

interface ButtonProps {
  href?: string;
  variant?: Variant;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  trackLocation?: string;
  trackNeed?: string;
  trackDestination?: AnalyticsProperties["destination"];
}

export function Button({
  href,
  variant = "solid",
  tone = "ink",
  className,
  children,
  type = "button",
  onClick,
  disabled,
  trackLocation,
  trackNeed,
  trackDestination = "contact",
}: ButtonProps) {
  const classes = cn(base, styles[tone][variant], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick}
        data-track={trackLocation ? "cta_click" : undefined}
        data-track-location={trackLocation}
        data-track-destination={trackLocation ? trackDestination : undefined}
        data-track-need={trackNeed}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      data-track={trackLocation ? "cta_click" : undefined}
      data-track-location={trackLocation}
      data-track-destination={trackLocation ? trackDestination : undefined}
      data-track-need={trackNeed}
    >
      {children}
    </button>
  );
}
