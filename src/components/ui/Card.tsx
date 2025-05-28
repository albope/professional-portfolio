// src/components/ui/Card.tsx

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// MEJORA: Añadidas clases para modo oscuro y una transición suave
export const Card = ({ children, className }: CardProps) => (
  <div className={`bg-white text-slate-900 shadow-md rounded-lg overflow-hidden transition-colors duration-300 dark:bg-slate-800/50 dark:text-slate-200 ${className}`}>
    {children}
  </div>
);

// MEJORA: Borde adaptado para modo oscuro
export const CardHeader = ({ children }: CardProps) => (
  <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">{children}</div>
);

export const CardContent = ({ children }: CardProps) => (
  <div className="p-4 sm:p-6">{children}</div>
);

// MEJORA: Borde adaptado para modo oscuro
export const CardFooter = ({ children }: CardProps) => (
  <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700">{children}</div>
);

export const CardTitle = ({ children }: CardProps) => (
  <h3 className="text-xl font-bold">{children}</h3>
);

// MEJORA: Colores de texto con mejor contraste
export const CardDescription = ({ children }: CardProps) => (
  <p className="text-slate-500 dark:text-slate-400">{children}</p>
);