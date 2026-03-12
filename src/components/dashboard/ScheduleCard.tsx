import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

interface ScheduleEvent {
  day: number;
  label: string;
  variant: 'active' | 'dark' | 'neutral';
}

const events: ScheduleEvent[] = [
  { day: 1, label: 'Server Maintenance', variant: 'active' },
  { day: 3, label: 'Audit Check', variant: 'dark' },
  { day: 4, label: 'Device Return', variant: 'active' },
  { day: 6, label: 'Inventory Sync', variant: 'neutral' },
];

const pillColors: Record<ScheduleEvent['variant'], string> = {
  active: 'bg-primary-200 text-secondary-900 dark:bg-primary-400 dark:text-secondary-950',
  dark: 'bg-gray-100 text-secondary-900 dark:bg-secondary-600 dark:text-secondary-100',
  neutral: 'bg-gray-100 text-gray-700 dark:bg-secondary-700 dark:text-secondary-200',
};

function ChevronLeft() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ScheduleCard() {
  const [monthIndex, setMonthIndex] = useState(2);

  const prev = () => setMonthIndex((m) => (m === 0 ? 11 : m - 1));
  const next = () => setMonthIndex((m) => (m === 11 ? 0 : m + 1));

  return (
    <Card>
      <CardHeader
        title="Maintenance Schedule"
        action={
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prev}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:text-secondary-400 dark:hover:bg-secondary-700"
            >
              <ChevronLeft />
            </button>
            <span className="min-w-[5.5rem] text-center text-sm font-medium text-secondary-900 dark:text-secondary-100">
              {months[monthIndex]}
            </span>
            <button
              type="button"
              onClick={next}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:text-secondary-400 dark:hover:bg-secondary-700"
            >
              <ChevronRight />
            </button>
          </div>
        }
      />

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekdays.map((d) => (
          <span
            key={d}
            className="text-center text-[0.625rem] font-semibold uppercase tracking-wider text-gray-400 dark:text-secondary-500"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Event grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((_, i) => {
          const event = events.find((e) => e.day === i);
          return (
            <div key={i} className="flex min-h-[2.5rem] items-start justify-center pt-1">
              {event ? (
                <span
                  className={`w-full rounded-lg px-1 py-1 text-center text-[0.5625rem] font-medium leading-tight ${pillColors[event.variant]}`}
                  title={event.label}
                >
                  {event.label.split(' ')[0]}
                </span>
              ) : (
                <span className="text-xs text-gray-300 dark:text-secondary-600">—</span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
