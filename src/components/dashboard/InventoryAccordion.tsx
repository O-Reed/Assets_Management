import { Accordion, Badge, Card, CardHeader } from '@/components/ui';

interface InventoryItem {
  icon: string;
  name: string;
  count: number;
}

interface Category {
  label: string;
  count: number;
  items: InventoryItem[];
}

const categories: Category[] = [
  {
    label: 'Electronics',
    count: 8,
    items: [
      { icon: '💻', name: 'Laptops', count: 4 },
      { icon: '🖥️', name: 'Monitors', count: 2 },
      { icon: '📱', name: 'Tablets', count: 2 },
    ],
  },
  {
    label: 'Furniture',
    count: 4,
    items: [
      { icon: '🪑', name: 'Chairs', count: 2 },
      { icon: '🗄️', name: 'Desks', count: 2 },
    ],
  },
  {
    label: 'Network',
    count: 2,
    items: [
      { icon: '📡', name: 'Routers', count: 1 },
      { icon: '🔌', name: 'Switches', count: 1 },
    ],
  },
  {
    label: 'Peripherals',
    count: 2,
    items: [
      { icon: '⌨️', name: 'Keyboards', count: 1 },
      { icon: '🖱️', name: 'Mice', count: 1 },
    ],
  },
  {
    label: 'Office',
    count: 1,
    items: [{ icon: '🖨️', name: 'Printers', count: 1 }],
  },
  {
    label: 'Power',
    count: 1,
    items: [{ icon: '🔋', name: 'UPS Units', count: 1 }],
  },
  {
    label: 'Appliance',
    count: 1,
    items: [{ icon: '☕', name: 'Coffee Machines', count: 1 }],
  },
];

export function InventoryAccordion() {
  const totalAssets = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Inventory by Category"
        action={<Badge variant="soft">{totalAssets} assets</Badge>}
      />

      <div className="space-y-2">
        {categories.map((cat, i) => (
          <Accordion
            key={cat.label}
            title={cat.label}
            defaultOpen={i === 0}
            badge={<Badge variant="soft">{cat.count}</Badge>}
            className="rounded-2xl border border-gray-100 bg-gray-25 px-1 dark:border-secondary-700 dark:bg-secondary-800/70"
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-secondary-700 dark:text-primary-300">
                    <CategoryGlyph label={cat.label} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      {cat.label}
                    </p>
                    <p className="text-label text-gray-500 dark:text-secondary-400">
                      {cat.items.length} item types tracked
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{cat.count} assets</Badge>
                  <Badge variant="soft">{cat.items.length} types</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="surface-border card-motion animate-fade-up rounded-2xl bg-gray-50 p-4 dark:bg-secondary-700/60"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-base dark:bg-secondary-700"
                        role="img"
                        aria-label={item.name}
                      >
                        {item.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-label text-gray-500 dark:text-secondary-400">
                          Ready for assignment
                        </p>
                      </div>
                      <Badge variant="accent">{item.count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>
        ))}
      </div>
    </Card>
  );
}

function CategoryGlyph({ label }: { label: string }) {
  const path =
    {
      Electronics: 'M4 7.5h16v9H4z M9 18.5h6',
      Furniture: 'M6 7h12v6H6z M8 13v4 M16 13v4',
      Network: 'M6 18h12 M8 14h8 M12 6v8',
      Peripherals: 'M7 8h10v8H7z M10 18h4',
      Office: 'M7 5h8l2 2v12H7z M9 10h6 M9 14h6',
      Power: 'M13 3L6 14h5l-1 7 8-12h-5z',
      Appliance: 'M8 4h8v16H8z M10 8h4 M10 12h4',
    }[label] ?? 'M4 12h16';

  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}
