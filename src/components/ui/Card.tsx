import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5 md:p-6',
  lg: 'p-6 md:p-8',
};

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      className={`
        surface-border card-motion animate-fade-up rounded-2xl bg-gray-25 shadow-card-soft
        dark:bg-secondary-800 dark:shadow-none
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
