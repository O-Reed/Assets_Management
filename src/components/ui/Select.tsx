import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
  type SelectHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  menuPlacement?: 'auto' | 'top' | 'bottom';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, onChange, onBlur, value, defaultValue, disabled, name, menuPlacement = 'auto', ...rest }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLSelectElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(String(value ?? defaultValue ?? ''));
    const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
    const isControlled = value !== undefined;

    const currentValue = isControlled ? String(value ?? '') : internalValue;
    const selectedOption = useMemo(
      () => options.find((opt) => String(opt.value) === currentValue),
      [currentValue, options],
    );

    useEffect(() => {
      if (isControlled) setInternalValue(String(value ?? ''));
    }, [isControlled, value]);

    useEffect(() => {
      if (!open) return;
      const handleClick = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          !wrapperRef.current?.contains(target) &&
          !menuRef.current?.contains(target)
        ) {
          setOpen(false);
        }
      };
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClick);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [open]);

    useLayoutEffect(() => {
      if (!open) return;

      const updateMenuPosition = () => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) return;

        const gap = 8;
        const viewportPadding = 12;
        const availableBelow = window.innerHeight - rect.bottom - viewportPadding;
        const availableAbove = rect.top - viewportPadding;
        const contentHeight = Math.min(menuRef.current?.scrollHeight ?? 0, 320);
        const estimatedHeight = Math.max(120, contentHeight + 12);
        const openUpward =
          menuPlacement === 'top'
            ? true
            : menuPlacement === 'bottom'
              ? false
              : availableBelow < estimatedHeight && availableAbove > availableBelow;
        const maxHeight = Math.max(120, openUpward ? availableAbove - gap : availableBelow - gap);
        const width = Math.min(
          Math.max(rect.width, 220),
          window.innerWidth - viewportPadding * 2,
        );
        const left = Math.max(
          viewportPadding,
          Math.min(rect.left, window.innerWidth - width - viewportPadding),
        );

        setMenuStyle({
          position: 'fixed',
          left,
          width,
          maxHeight,
          zIndex: 160,
          ...(openUpward
            ? { top: Math.max(viewportPadding, rect.top - gap), transform: 'translateY(-100%)' }
            : { top: rect.bottom + gap }),
        });
      };

      updateMenuPosition();

      window.addEventListener('resize', updateMenuPosition);
      window.addEventListener('scroll', updateMenuPosition, true);

      return () => {
        window.removeEventListener('resize', updateMenuPosition);
        window.removeEventListener('scroll', updateMenuPosition, true);
      };
    }, [open, menuPlacement]);

    const assignRef = (node: HTMLSelectElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const emitBlur = () => {
      onBlur?.({
        target: innerRef.current as EventTarget & HTMLSelectElement,
      } as FocusEvent<HTMLSelectElement>);
    };

    const handleSelect = (nextValue: string) => {
      if (!isControlled) setInternalValue(nextValue);
      setOpen(false);
      onChange?.({
        target: { value: nextValue, name } as EventTarget & HTMLSelectElement,
        currentTarget: { value: nextValue, name } as EventTarget & HTMLSelectElement,
      } as React.ChangeEvent<HTMLSelectElement>);
      emitBlur();
    };

    return (
      <div ref={wrapperRef} className="relative flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {label}
          </label>
        )}
        <select
          ref={assignRef}
          id={selectId}
          value={currentValue}
          name={name}
          onChange={() => undefined}
          onBlur={onBlur}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
          className={`
            pointer-events-none absolute inset-0 h-0 w-0 opacity-0
          `}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          id={selectId}
          ref={buttonRef}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={`
            flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-25 px-3 text-left text-sm text-secondary-900
            transition-[border-color,background-color,box-shadow,transform] duration-base
            hover:border-gray-300 hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-primary-300/40
            dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50 dark:hover:border-secondary-600 dark:hover:bg-secondary-700
            disabled:cursor-not-allowed disabled:opacity-50
            ${open ? 'border-primary-300 ring-2 ring-primary-300/20 dark:border-primary-400 dark:ring-primary-400/20' : ''}
            ${error ? 'border-danger dark:border-danger' : ''}
            ${className}
          `}
        >
          <span className={`truncate whitespace-nowrap ${selectedOption ? '' : 'text-gray-400 dark:text-secondary-400'}`}>
            {selectedOption?.label ?? placeholder ?? 'Select'}
          </span>
          <svg
            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-base dark:text-secondary-400 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && !disabled && createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="animate-scale-in overflow-hidden rounded-2xl border border-gray-150 bg-gray-25 p-1.5 shadow-shell dark:border-secondary-600 dark:bg-secondary-800"
          >
            <div className="app-scrollbar max-h-80 overflow-y-auto pr-1">
              {options.map((opt) => {
                const isSelected = String(opt.value) === currentValue;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
                      event.preventDefault();
                      handleSelect(String(opt.value));
                    }}
                    className={`
                      flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-base
                      ${isSelected
                        ? 'bg-primary-100 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-50'
                        : 'text-secondary-700 hover:bg-gray-50 dark:text-secondary-200 dark:hover:bg-secondary-700/70'
                      }
                    `}
                  >
                    <span className="truncate whitespace-nowrap">{opt.label}</span>
                    {isSelected && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary-400 dark:bg-primary-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}

        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
