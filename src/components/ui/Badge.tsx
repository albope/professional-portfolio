// src/components/ui/Badge.tsx

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

// MEJORA: Estilos más suaves y modernos
export const Badge = ({ children, className }: BadgeProps) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 ${className} dark:bg-sky-900/50 dark:text-sky-300`}>
    {children}
  </span>
);