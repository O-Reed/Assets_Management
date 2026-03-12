interface Task {
  id: number;
  title: string;
  meta: string;
  done: boolean;
}

const tasks: Task[] = [
  { id: 1, title: 'Approve laptop request #1042', meta: 'Sarah · 2 h ago', done: true },
  { id: 2, title: 'Schedule monitor calibration', meta: 'IT Ops · Today', done: true },
  { id: 3, title: 'Return docking station', meta: 'David · Tomorrow', done: false },
  { id: 4, title: 'Renew software licence', meta: 'Finance · Mar 15', done: false },
  { id: 5, title: 'Audit server room badges', meta: 'Security · This week', done: false },
];

const pendingCount = tasks.filter((t) => !t.done).length;

function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  );
}

export function TaskPanel({ className = '' }: { className?: string }) {
  return (
    <div
      className={`surface-border card-motion animate-fade-up rounded-2xl bg-gray-25 p-5 shadow-card-soft dark:bg-secondary-800 dark:shadow-none md:p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-card-title font-medium text-secondary-900 dark:text-secondary-50">Pending Tasks</h3>
        <span className="inline-flex items-center rounded-pill bg-primary-400 px-2.5 py-0.5 text-xs font-bold text-secondary-900 dark:bg-primary-500 dark:text-secondary-950">
          {pendingCount}
        </span>
      </div>

      {/* Task list */}
      <ul className="flex flex-col gap-1">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-fast hover:bg-gray-50 dark:hover:bg-secondary-700"
          >
            {/* Status icon */}
            <span
              className={`
                mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                ${task.done
                  ? 'bg-primary-400 text-secondary-900 dark:bg-primary-500 dark:text-secondary-950'
                  : 'border border-gray-300 text-gray-500 dark:border-secondary-600 dark:text-secondary-300'
                }
              `}
            >
              {task.done ? <CheckIcon /> : <ClockIcon />}
            </span>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-medium leading-snug ${
                  task.done
                    ? 'text-gray-400 line-through dark:text-secondary-400'
                    : 'text-secondary-900 dark:text-secondary-100'
                }`}
              >
                {task.title}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-secondary-400">
                {task.meta}
              </p>
            </div>

            {/* Status dot */}
            {!task.done && (
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-warning dark:bg-warning" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
