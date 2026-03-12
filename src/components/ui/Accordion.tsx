import { useState, type ReactNode } from 'react';

interface AccordionProps {
  title: string;
  badge?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function Accordion({ title, badge, defaultOpen = false, children, className = '' }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-gray-150 last:border-b-0 dark:border-secondary-700 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left
          transition-all duration-base hover:bg-gray-50 dark:hover:bg-secondary-700/50
          ${open ? 'bg-gray-50 dark:bg-secondary-700/40' : ''}
        `}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-secondary-900 dark:text-secondary-100">{title}</span>
          {badge}
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-base dark:text-secondary-500 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-base ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="animate-reveal-soft px-4 pb-4 pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
