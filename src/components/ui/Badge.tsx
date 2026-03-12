import type { ReactNode } from 'react';

type BadgeVariant = 'accent' | 'dark' | 'outline' | 'soft' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: 'bg-primary-200 text-secondary-900 dark:bg-primary-400 dark:text-secondary-950',
  dark: 'bg-gray-100 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-50',
  outline: 'border border-gray-300 text-gray-700 dark:border-secondary-600 dark:text-secondary-300',
  soft: 'bg-gray-100 text-gray-700 dark:bg-secondary-700 dark:text-secondary-200',
  success: 'bg-success-light text-success-dark dark:bg-success-dark/20 dark:text-success',
  warning: 'bg-warning-light text-warning-dark dark:bg-warning-dark/20 dark:text-warning',
  danger: 'bg-danger-light text-danger-dark dark:bg-danger-dark/20 dark:text-danger',
  info: 'bg-info-light text-info-dark dark:bg-info-dark/20 dark:text-info',
};

export function Badge({ children, variant = 'soft', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium
        transition-[transform,background-color,color,border-color] duration-base motion-safe:hover:-translate-y-px
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
