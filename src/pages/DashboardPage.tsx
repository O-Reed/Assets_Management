import { Hero } from '@/components/Hero';
import { FeaturedAssetCard } from '@/components/dashboard/FeaturedAssetCard';
import { UtilizationCard } from '@/components/dashboard/UtilizationCard';
import { StatusRingCard } from '@/components/dashboard/StatusRingCard';
import { WorkflowCard } from '@/components/dashboard/WorkflowCard';
import { TaskPanel } from '@/components/dashboard/TaskPanel';
import { InventoryAccordion } from '@/components/dashboard/InventoryAccordion';
import { ScheduleCard } from '@/components/dashboard/ScheduleCard';
import { useAssetStats } from '@/hooks/useAssets';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { data: stats } = useAssetStats();
  const { user } = useAuth();

  return (
    /**
     * Layout (CSS grid):
     *
     * Mobile  (1 col): linear stack – hero, featured, util, ring, workflow, schedule, tasks, inventory
     * Tablet  (2 col): hero(2) | featured+util | ring+tasks | workflow(2) | schedule | inventory(2)
     * Desktop (4 col): hero(4) | featured util ring tasks(row2) | workflow(2) schedule tasks(row2) | inventory(4)
     */
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">

      {/* Hero – full width at every breakpoint */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <Hero stats={stats} userName={user?.name} />
      </div>

      {/* ── Row 2 (lg) ─────────────────────────────────────────────── */}

      {/* Featured asset: col 1 */}
      <div className="col-span-1">
        <FeaturedAssetCard />
      </div>

      {/* Utilization: col 2 */}
      <div className="col-span-1">
        <UtilizationCard />
      </div>

      {/* Status ring: col 3 */}
      <div className="col-span-1">
        <StatusRingCard />
      </div>

      {/*
        TaskPanel: col 4 on lg, row-spans rows 2+3.
        On md it spans 2 cols and sits below the ring card.
        On mobile it shows last (after schedule).
        Uses order utilities to control mobile stacking.
      */}
      <div className="order-last col-span-1 md:order-none md:col-span-2 lg:col-span-1 lg:row-span-2">
        <TaskPanel className="h-full" />
      </div>

      {/* ── Row 3 (lg) ─────────────────────────────────────────────── */}

      {/* Workflow: 2 cols on md+, full width on mobile */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <WorkflowCard />
      </div>

      {/* Schedule: 1 col */}
      <div className="col-span-1">
        <ScheduleCard />
      </div>

      {/* ── Row 4 (lg) ─────────────────────────────────────────────── */}

      {/* Inventory accordion – full width */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <InventoryAccordion />
      </div>
    </div>
  );
}
