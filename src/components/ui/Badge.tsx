// src/components/ui/Badge.tsx

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ children, className }: BadgeProps) => (
  <span className={`bg-black text-white px-2 py-1 rounded text-sm ${className} dark:bg-white dark:text-black`}>
    {children}
  </span>
);