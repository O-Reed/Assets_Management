import type { ReactNode } from 'react';

type CardHeaderProps = {
  title: string;
  action?: ReactNode;
  className?: string;
};

export function CardHeader({ title, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 flex items-center justify-between gap-4 ${className}`}>
      {/* card-title: 18–20px per Font_Design.md */}
      <h3 className="text-card-title font-medium leading-tight text-secondary-900 dark:text-secondary-50">
        {title}
      </h3>
      {action}
    </div>
  );
}
