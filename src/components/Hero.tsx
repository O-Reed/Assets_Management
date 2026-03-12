interface HeroStats {
  total: number;
  assigned: number;
  inRepair: number;
  totalValue: number;
}

interface HeroProps {
  stats?: HeroStats;
  userName?: string;
}

export function Hero({ stats, userName }: HeroProps) {
  const kpiItems = [
    { value: stats ? stats.total.toLocaleString() : '—', label: 'Total Assets', icon: 'assets' },
    { value: stats ? stats.assigned.toLocaleString() : '—', label: 'Assigned', icon: 'assign' },
    { value: stats ? stats.inRepair.toLocaleString() : '—', label: 'Repairs', icon: 'repair' },
    { value: stats ? `$${stats.totalValue.toLocaleString()}` : '—', label: 'Total Value', icon: 'audit' },
  ];

  const utilization =
    stats && stats.total > 0 ? Math.round((stats.assigned / stats.total) * 100) : 0;
  const available = stats ? stats.total - stats.assigned - stats.inRepair : 0;

  const progressChips = [
    { label: 'Available', value: stats ? available : 0, fill: true },
    { label: 'Assigned', value: stats ? stats.assigned : 0, fill: true },
    { label: 'In service', value: stats ? stats.inRepair : 0, fill: false },
    { label: 'Utilization', value: stats ? utilization : 0, suffix: '%', fill: true },
  ];

  return (
    <section className="space-y-5">
      {/* Title row + KPIs */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {/* Hero title: 32px mobile → 40px desktop per Font_Design.md */}
          <h1 className="font-medium leading-tight text-secondary-900 dark:text-secondary-50"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)' }}>
            Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-1 text-body text-gray-600 dark:text-gray-400">
            Inventory dashboard · Asset operations overview
          </p>
        </div>

        {/* KPI metrics — 2-per-row on mobile, inline from sm */}
        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:gap-6 lg:gap-8">
          {kpiItems.map((kpi) => (
            <div key={kpi.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-secondary-700 dark:text-secondary-300">
                <KpiIcon name={kpi.icon} className="h-5 w-5" />
              </div>
              <div>
                {/* Metric medium: 24–28px per spec */}
                <p className="text-metric-md font-medium tabular-nums text-secondary-900 dark:text-secondary-50">
                  {kpi.value}
                </p>
                <p className="text-label text-gray-500 dark:text-gray-400">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress chips */}
      <div className="flex flex-wrap gap-2">
        {progressChips.map((chip) => (
          <span
            key={chip.label}
            className={`
              inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-label font-medium
              ${chip.fill
                ? 'bg-primary-400 text-secondary-900 dark:bg-primary-500 dark:text-secondary-950'
                : 'bg-gray-200 text-gray-700 dark:bg-secondary-700 dark:text-secondary-200'
              }
            `}
          >
            <span>{chip.label}</span>
            <span className="tabular-nums font-semibold">
              {chip.value}{chip.suffix ?? ''}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

function KpiIcon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, string> = {
    assets: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    assign: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    repair: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    audit: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name] ?? 'M4 6h16M4 12h16M4 18h16'} />
    </svg>
  );
}
