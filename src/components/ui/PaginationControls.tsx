import { Button } from './Button';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function PaginationControls({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(safePage * pageSize, total);

  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (currentPage) =>
      currentPage === 1 ||
      currentPage === totalPages ||
      (currentPage >= safePage - 1 && currentPage <= safePage + 1),
  );

  return (
    <div className="flex flex-col gap-3 border-t border-gray-150 px-4 py-3 dark:border-secondary-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {start}-{end} of {total}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Rows per page</span>
          <div className="inline-flex rounded-pill border border-gray-150 bg-gray-50 p-1 dark:border-secondary-600 dark:bg-secondary-700">
            {PAGE_SIZE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onPageSizeChange(option)}
                className={`rounded-pill px-3 py-1.5 text-sm font-medium transition-colors ${
                  option === pageSize
                    ? 'bg-primary-300 text-secondary-900 dark:bg-primary-400 dark:text-secondary-950'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-secondary-300 dark:hover:bg-secondary-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 self-start sm:self-auto">
        <Button
          variant="ghost"
          size="sm"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          Previous
        </Button>
        {visiblePages.map((currentPage, index) => {
          const showEllipsis = index > 0 && currentPage - visiblePages[index - 1] > 1;
          return (
            <span key={currentPage} className="flex items-center">
              {showEllipsis && (
                <span className="px-1 text-gray-400 dark:text-secondary-500">…</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(currentPage)}
                className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === safePage
                    ? 'bg-secondary-800 text-secondary-50 dark:bg-secondary-200 dark:text-secondary-900'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-secondary-700'
                }`}
              >
                {currentPage}
              </button>
            </span>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
