import { Card, CardHeader } from '@/components/ui';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

// Percentages 0–100; map to Tailwind height classes via a lookup
const values = [60, 45, 80, 55, 90, 30, 40];
const accentIndex = 4; // Friday is the accent bar

const heightClass = (v: number): string => {
  if (v >= 90) return 'h-[90%]';
  if (v >= 80) return 'h-[80%]';
  if (v >= 70) return 'h-[70%]';
  if (v >= 60) return 'h-[60%]';
  if (v >= 50) return 'h-[50%]';
  if (v >= 45) return 'h-[45%]';
  if (v >= 40) return 'h-[40%]';
  if (v >= 30) return 'h-[30%]';
  return 'h-[20%]';
};

export function UtilizationCard() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Utilization Trend" />

      <div className="mb-1 flex items-end gap-1">
        <span className="text-metric-md font-medium tabular-nums text-secondary-900 dark:text-secondary-50">
          72%
        </span>
        <span className="mb-0.5 ml-1 text-label text-gray-500 dark:text-secondary-400">
          weekly avg
        </span>
      </div>

      <p className="mb-4 text-label text-gray-500 dark:text-secondary-400">
        Weekly Activity
      </p>

      {/* Bar chart container — fixed height so bars are proportional */}
      <div className="mt-auto flex h-24 items-end justify-between gap-1.5">
        {days.map((day, i) => (
          <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`
                w-full rounded-md transition-colors duration-base
                ${i === accentIndex
                  ? 'bg-primary-400 dark:bg-primary-500'
                  : 'bg-gray-200 dark:bg-secondary-700'
                }
                ${heightClass(values[i])}
              `}
            />
            <span className="text-[0.625rem] font-medium text-gray-500 dark:text-secondary-400">
              {day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
