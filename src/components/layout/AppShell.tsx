import type { ReactNode } from 'react';
import { TopNav } from '@/components/TopNav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-page dark:bg-secondary-900">
      <div className="mx-auto max-w-shell px-3 py-4 pb-8 sm:px-4 sm:pb-10 md:px-6 lg:px-8 xl:py-8">
        {/* relative so mobile nav dropdown can anchor to the nav bar */}
        <div className="surface-border relative rounded-3xl bg-gray-50 p-4 pb-6 shadow-shell dark:bg-secondary-800 dark:shadow-none md:p-5 md:pb-7 lg:p-6 lg:pb-8">
          <TopNav />
          <main className="mt-5 pb-4 lg:mt-6 lg:pb-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
