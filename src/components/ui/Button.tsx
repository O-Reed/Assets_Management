import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-300 text-secondary-900 hover:bg-primary-400 focus:ring-primary-200 dark:bg-primary-400 dark:text-secondary-950 dark:hover:bg-primary-300 dark:focus:ring-primary-300',
  secondary:
    'border border-gray-150 bg-gray-100 text-secondary-900 hover:bg-gray-150 focus:ring-gray-200 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-50 dark:hover:bg-secondary-600 dark:focus:ring-secondary-500',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 dark:text-gray-300 dark:hover:bg-secondary-700 dark:focus:ring-secondary-600',
  danger:
    'border border-danger/20 bg-danger-light text-danger-dark hover:bg-danger-light/80 focus:ring-danger/30 dark:border-danger-dark/30 dark:bg-danger-dark/20 dark:text-danger dark:hover:bg-danger-dark/30',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-pill font-medium
        transition-[transform,background-color,color,border-color,box-shadow] duration-base
        motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-25 dark:focus:ring-offset-secondary-900
        disabled:pointer-events-none disabled:opacity-50
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
