// src/components/ui/Card.tsx

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={`bg-white text-gray-900 shadow-md rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }: CardProps) => (
  <div className="p-4 border-b border-gray-200">{children}</div>
);

export const CardContent = ({ children }: CardProps) => (
  <div className="p-4">{children}</div>
);

export const CardFooter = ({ children }: CardProps) => (
  <div className="p-4 border-t border-gray-200">{children}</div>
);

export const CardTitle = ({ children }: CardProps) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

export const CardDescription = ({ children }: CardProps) => (
  <p className="text-gray-500">{children}</p>
);