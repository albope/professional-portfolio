interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Kept for compatibility with sections; content is always visible. */
  delay?: number;
  y?: number;
}

/** Server-rendered content remains readable before hydration and without JavaScript. */
export function Reveal({ children, className }: RevealProps) {
  return <div className={className}>{children}</div>;
}
