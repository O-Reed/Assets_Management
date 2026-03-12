export function FeaturedAssetCard() {
  return (
    <div
      className="
        surface-border card-motion animate-fade-up relative overflow-hidden rounded-2xl shadow-card-soft
        bg-gradient-to-br from-primary-100 to-primary-50
        dark:from-secondary-700 dark:to-secondary-800 dark:shadow-none
      "
    >
      <div className="relative z-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-8 md:p-8">
        {/* Illustration */}
        <div
          className="
            flex h-28 w-28 shrink-0 items-center justify-center self-center
            rounded-2xl bg-white/60 dark:bg-secondary-600/50
          "
        >
          <svg
            className="h-14 w-14 text-primary-600 dark:text-primary-400"
            fill="none"
            viewBox="0 0 48 48"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <rect x="6" y="12" width="36" height="24" rx="3" />
            <path d="M16 36h16" strokeLinecap="round" />
            <path d="M24 36v4" strokeLinecap="round" />
            <circle cx="24" cy="24" r="3" />
          </svg>
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-400">
            Featured Asset
          </span>
          <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-50 sm:text-2xl">
            MacBook Pro 16″ M3
          </h2>
          <p className="text-sm text-secondary-600 dark:text-secondary-300">
            Apple Silicon · 36 GB RAM · 1 TB SSD
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className="
                inline-flex items-center rounded-pill px-3 py-1 text-sm font-semibold
                bg-primary-400 text-secondary-900
                dark:bg-primary-500 dark:text-secondary-950
              "
            >
              $3,499
            </span>
            <span
              className="
                inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-medium
                bg-success-light text-success-dark
                dark:bg-success-dark/20 dark:text-success
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              In Use
            </span>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-200/40 dark:bg-primary-900/20" />
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary-300/30 dark:bg-primary-800/15" />
    </div>
  );
}
