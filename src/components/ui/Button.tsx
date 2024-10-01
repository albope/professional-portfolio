// src/components/ui/Button.tsx

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost' | 'black';
  size?: 'icon';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant, size, className, ...props }) => {
  const baseStyles = 'rounded transition';

  let variantStyles = '';
  if (variant === 'outline') {
    variantStyles = 'border border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700';
  } else if (variant === 'black') {
    variantStyles = 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200';
  } else {
    variantStyles = 'text-white';
  }

  const sizeStyles = size === 'icon' ? 'w-10 h-10' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};