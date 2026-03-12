import { Card, CardHeader } from '@/components/ui';

type StepStatus = 'done' | 'active' | 'pending';

interface Step {
  label: string;
  status: StepStatus;
}

const steps: Step[] = [
  { label: 'Request', status: 'done' },
  { label: 'Approve', status: 'done' },
  { label: 'Assign', status: 'active' },
  { label: 'Configure', status: 'pending' },
  { label: 'Complete', status: 'pending' },
];

const completedCount = steps.filter((s) => s.status === 'done').length;
const percentage = Math.round((completedCount / steps.length) * 100);

const segmentColors: Record<StepStatus, string> = {
  done: 'bg-primary-400 dark:bg-primary-500',
  active: 'bg-secondary-800 dark:bg-primary-400',
  pending: 'bg-gray-200 dark:bg-secondary-700',
};

export function WorkflowCard() {
  return (
    <Card>
      <CardHeader
        title="Provisioning Status"
        action={
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {percentage}%
          </span>
        }
      />

      <div className="mb-3 flex gap-1.5">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`h-2.5 flex-1 rounded-full transition-colors duration-base ${segmentColors[step.status]}`}
          />
        ))}
      </div>

      <div className="flex gap-1.5">
        {steps.map((step) => (
          <span
            key={step.label}
            className={`
              flex-1 text-center text-[0.625rem] font-medium
              ${step.status === 'done'
                ? 'text-primary-700 dark:text-primary-400'
                : step.status === 'active'
                  ? 'text-secondary-900 dark:text-secondary-100'
                  : 'text-gray-400 dark:text-secondary-500'
              }
            `}
          >
            {step.label}
          </span>
        ))}
      </div>
    </Card>
  );
}
