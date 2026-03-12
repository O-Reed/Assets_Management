import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...rest }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            h-10 w-full rounded-lg border border-gray-200 bg-gray-25 px-3 text-sm text-secondary-900
            placeholder:text-gray-400
            transition-colors duration-base
            focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30
            dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50
            dark:placeholder:text-secondary-500
            dark:focus:border-primary-400 dark:focus:ring-primary-500/20
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-danger focus:border-danger focus:ring-danger/30 dark:border-danger' : ''}
            ${className}
          `}
          {...rest}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
