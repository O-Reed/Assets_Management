import { Card } from '@/components/ui';

const SIZE = 140;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PERCENTAGE = 84;
const DASH_OFFSET = CIRCUMFERENCE * (1 - PERCENTAGE / 100);

export function StatusRingCard() {
  return (
    <Card className="flex flex-col items-center text-center">
      <h3 className="mb-4 text-card-title font-medium text-secondary-900 dark:text-secondary-50">
        Asset Availability
      </h3>

      <div className="relative mb-4">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            className="stroke-gray-200 dark:stroke-secondary-700"
          />
          {/* Progress */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={DASH_OFFSET}
            className="stroke-primary-400 transition-[stroke-dashoffset] duration-slow dark:stroke-primary-500"
          />
        </svg>

        <span className="absolute inset-0 flex items-center justify-center text-metric-md font-medium text-secondary-900 dark:text-secondary-50">
          {PERCENTAGE}%
        </span>
      </div>

      <div className="flex w-full justify-center gap-6 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary-400 dark:bg-primary-500" />
          <span className="text-gray-600 dark:text-secondary-300">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gray-200 dark:bg-secondary-700" />
          <span className="text-gray-600 dark:text-secondary-300">In Use</span>
        </div>
      </div>
    </Card>
  );
}
