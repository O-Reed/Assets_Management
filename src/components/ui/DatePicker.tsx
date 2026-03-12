import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

type DatePickerProps = {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
};

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_LABELS = Array.from({ length: 12 }, (_, index) =>
  new Date(2026, index, 1).toLocaleDateString('en-US', { month: 'long' }),
);

function parseDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string): string {
  const parsed = parseDate(value);
  if (!parsed) return '';
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function isSameDay(left: Date | null, right: Date | null): boolean {
  if (!left || !right) return false;
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addYears(date: Date, amount: number): Date {
  return new Date(date.getFullYear() + amount, date.getMonth(), 1);
}

function buildCalendarDays(viewMonth: Date): Date[] {
  const firstDay = startOfMonth(viewMonth);
  const firstWeekday = firstDay.getDay();
  const calendarStart = new Date(firstDay);
  calendarStart.setDate(firstDay.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const nextDate = new Date(calendarStart);
    nextDate.setDate(calendarStart.getDate() + index);
    return nextDate;
  });
}

export function DatePicker({
  label,
  error,
  value,
  onChange,
  id,
  placeholder = 'Select date',
}: DatePickerProps) {
  const dateId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseDate(value), [value]);
  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState<Date>(selectedDate ?? today);

  useEffect(() => {
    if (selectedDate) setViewMonth(selectedDate);
  }, [value, selectedDate]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !wrapperRef.current?.contains(target) &&
        !dialogRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
    };
  }, [open]);

  const days = useMemo(() => buildCalendarDays(viewMonth), [viewMonth]);
  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-1.5">
      {label && (
        <label htmlFor={dateId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          {label}
        </label>
      )}

      <button
        id={dateId}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`
          flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-25 px-3 text-left text-sm text-secondary-900
          transition-[border-color,background-color,box-shadow] duration-base
          hover:border-gray-300 hover:bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-primary-300/40
          dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-50 dark:hover:border-secondary-600 dark:hover:bg-secondary-700
          ${open ? 'border-primary-300 ring-2 ring-primary-300/20 dark:border-primary-400 dark:ring-primary-400/20' : ''}
          ${error ? 'border-danger dark:border-danger' : ''}
        `}
      >
        <span className={value ? '' : 'text-gray-400 dark:text-secondary-400'}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-base dark:text-secondary-400 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
          <div className="animate-fade-in fixed inset-0 bg-secondary-950/20 backdrop-blur-sm dark:bg-black/30" />
          <div
            ref={dialogRef}
            className="animate-scale-in app-scrollbar relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-gray-150 bg-gray-25 p-4 shadow-shell dark:border-secondary-600 dark:bg-secondary-800"
          >
            <div className="mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-150 bg-gray-50/80 p-2 dark:border-secondary-600 dark:bg-secondary-700/70">
                  <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-secondary-500">
                    Month
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMonth((current) => addMonths(current, -1))}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-600 dark:hover:text-secondary-50"
                      aria-label="Previous month"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="min-w-0 flex-1 text-center text-sm font-semibold text-secondary-900 dark:text-secondary-50">
                      {MONTH_LABELS[viewMonth.getMonth()]}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewMonth((current) => addMonths(current, 1))}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-600 dark:hover:text-secondary-50"
                      aria-label="Next month"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-150 bg-gray-50/80 p-2 dark:border-secondary-600 dark:bg-secondary-700/70">
                  <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-secondary-500">
                    Year
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMonth((current) => addYears(current, -1))}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-600 dark:hover:text-secondary-50"
                      aria-label="Previous year"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="min-w-0 flex-1 text-center text-sm font-semibold text-secondary-900 dark:text-secondary-50">
                      {viewMonth.getFullYear()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewMonth((current) => addYears(current, 1))}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-600 dark:hover:text-secondary-50"
                      aria-label="Next year"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 dark:text-secondary-400">
                Select registration date
              </p>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEKDAY_LABELS.map((weekday) => (
                <div
                  key={weekday}
                  className="flex h-9 items-center justify-center text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-secondary-500"
                >
                  {weekday}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const isCurrentMonth = day.getMonth() === viewMonth.getMonth();
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => {
                      onChange(formatDateValue(day));
                      setOpen(false);
                    }}
                    className={`
                      flex h-10 items-center justify-center rounded-2xl text-sm font-medium transition-colors
                      ${isSelected
                        ? 'bg-primary-400 text-secondary-950 shadow-sm'
                        : isToday
                          ? 'border border-primary-300 text-secondary-900 dark:border-primary-400 dark:text-secondary-50'
                          : isCurrentMonth
                            ? 'text-secondary-800 hover:bg-gray-50 dark:text-secondary-100 dark:hover:bg-secondary-700'
                            : 'text-gray-300 hover:bg-gray-50 dark:text-secondary-600 dark:hover:bg-secondary-700'
                      }
                    `}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-secondary-700">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
                className="text-sm font-medium text-gray-500 transition-colors hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(formatDateValue(today));
                  setViewMonth(today);
                  setOpen(false);
                }}
                className="rounded-xl bg-primary-100 px-3 py-2 text-sm font-medium text-secondary-900 transition-colors hover:bg-primary-200 dark:bg-secondary-700 dark:text-secondary-50 dark:hover:bg-secondary-600"
              >
                Today
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
