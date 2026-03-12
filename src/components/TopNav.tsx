import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Inventory', to: '/assets' },
  { label: 'Items', to: '/items' },
  { label: 'Users', to: '/users', managerOnly: true },
];

export function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.managerOnly || user?.role === 'admin' || user?.role === 'asset_manager',
  );

  return (
    /* relative so the mobile dropdown positions against the nav bar */
    <header className="relative flex h-12 shrink-0 items-center justify-between gap-4 md:h-14">
      <div className="flex min-w-0 items-center gap-2">
        <NavLink
          to="/"
          className="group flex min-w-0 shrink-0 items-center gap-2 rounded-pill px-1 py-1"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-200 text-secondary-900 transition-colors duration-base group-hover:bg-primary-300 dark:bg-primary-400 dark:text-secondary-950 dark:group-hover:bg-primary-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5l8-4 8 4m-16 0l8 4m-8-4v9l8 4m0-9l8-4m-8 4v9" />
            </svg>
          </span>
          <div className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-semibold tracking-tight text-secondary-900 dark:text-secondary-50">
              Assets
            </span>
            <span className="block truncate text-[0.6875rem] text-gray-500 dark:text-secondary-300">
              Management
            </span>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden gap-1 md:flex" aria-label="Main navigation">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `shrink-0 rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-base ${
                  isActive
                    ? 'border border-gray-150 bg-gray-100 text-secondary-900 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-50'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-secondary-900 dark:text-gray-300 dark:hover:bg-secondary-700 dark:hover:text-secondary-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-secondary-700 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <ThemeSwitch />
        {user && (
          <>
            <span className="hidden text-sm text-gray-600 dark:text-gray-400 lg:inline">
              {user.name}
            </span>
            <button
              type="button"
              onClick={() => { logout(); navigate('/login'); }}
              className="flex h-9 items-center rounded-pill px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-secondary-900 dark:text-gray-300 dark:hover:bg-secondary-700 dark:hover:text-secondary-50"
            >
              Sign out
            </button>
          </>
        )}
      </div>

      {/* Mobile dropdown — positioned relative to the header */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 md:hidden">
          <nav
            className="rounded-2xl border border-gray-150 bg-gray-25 p-2 shadow-shell dark:border-secondary-600 dark:bg-secondary-700"
            aria-label="Mobile navigation"
          >
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-secondary-900 dark:bg-secondary-600 dark:text-secondary-50'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-secondary-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
