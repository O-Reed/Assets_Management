import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAssets, useDeleteAsset } from '@/hooks/useAssets';
import { useAuth } from '@/context/AuthContext';
import { STATUS_OPTIONS, OWNERSHIP_TYPES } from '@/lib/constants';
import { Card, Button, Input, Select, Badge, Modal, PaginationControls } from '@/components/ui';

interface Asset {
  id: number;
  item_name_snapshot: string;
  category: string;
  quantity: number;
  price: number;
  status: string;
  ownership_type: string;
  owner_user_id: number | null;
  owner_name: string | null;
  registration_date: string;
}

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'soft'> = {
  'In Use': 'success',
  Stored: 'info',
  'Under Repair': 'warning',
  Broken: 'danger',
  Lost: 'soft',
  Disposed: 'soft',
};

export default function AssetListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const deleteAsset = useDeleteAsset();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);

  const { data, isLoading } = useAssets({
    search: search || undefined,
    status: status || undefined,
    ownershipType: ownershipType || undefined,
    page,
    limit: pageSize,
  });

  const assets = (data?.data ?? []) as unknown as Asset[];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const canModify = (asset: Asset) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'asset_manager') return true;
    return asset.ownership_type === 'personal' && asset.owner_user_id === user.id;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteAsset.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatDate = (date: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-hero font-medium text-secondary-900 dark:text-secondary-50">
            Inventory
          </h1>
          <p className="mt-1 text-body text-gray-500 dark:text-gray-400">
            Manage and track all team assets
          </p>
        </div>
        <Link to="/assets/new">
          <Button>Add Asset</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              placeholder="Search assets…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex gap-3">
            <Select
              options={[
                { value: '', label: 'All Status' },
                ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
              ]}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            />
            <Select
              options={[
                { value: '', label: 'All Types' },
                ...OWNERSHIP_TYPES.map((t) => ({
                  value: t,
                  label: t === 'personal' ? 'Personal' : 'Team',
                })),
              ]}
              value={ownershipType}
              onChange={(e) => {
                setOwnershipType(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        {/* -mx compensates for the card padding so table bleeds edge-to-edge */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-150 dark:border-secondary-700">
                <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Item Name
                </th>
                <th className="hidden whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">
                  Category
                </th>
                <th className="hidden whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                  Qty
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="hidden whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">
                  Owner
                </th>
                <th className="hidden whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                  Date
                </th>
                <th className="w-px whitespace-nowrap px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-secondary-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-body text-gray-400 dark:text-secondary-500"
                  >
                    Loading assets…
                  </td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-body text-gray-400 dark:text-secondary-500"
                  >
                    No assets found
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => navigate(`/assets/${asset.id}`)}
                    className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-secondary-800/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-secondary-900 dark:text-secondary-50">
                      {asset.item_name_snapshot}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300 sm:table-cell">
                      {asset.category || '—'}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 tabular-nums text-gray-600 dark:text-gray-300 md:table-cell">
                      {asset.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600 dark:text-gray-300">
                      {formatCurrency(asset.price)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={STATUS_VARIANT[asset.status] ?? 'soft'}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300 sm:table-cell">
                      {asset.owner_name ?? 'Team'}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400 lg:table-cell">
                      {formatDate(asset.registration_date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {canModify(asset) && (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Link to={`/assets/${asset.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteTarget(asset)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <PaginationControls
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(1);
          }}
        />
      </Card>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Asset"
      >
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete{' '}
          <span className="font-medium text-secondary-900 dark:text-secondary-50">
            {deleteTarget?.item_name_snapshot}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteAsset.isPending}>
            {deleteAsset.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
