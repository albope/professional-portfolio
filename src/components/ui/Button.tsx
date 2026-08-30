import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline";
type Tone = "ink" | "paper";

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[2px] px-6 text-sm font-medium tracking-tight transition-colors duration-300 ease-editorial disabled:pointer-events-none disabled:opacity-60";

const styles: Record<Tone, Record<Variant, string>> = {
  ink: {
    solid: "bg-ink text-paper hover:bg-cobalt",
    outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.04]",
  },
  paper: {
    solid: "bg-paper text-ink hover:bg-cobalt hover:text-paper",
    outline: "border border-paper/30 text-paper hover:border-paper hover:bg-paper/10",
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
}: ButtonProps) {
  const classes = cn(base, styles[tone][variant], className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
