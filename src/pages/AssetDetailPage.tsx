import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAsset, useDeleteAsset } from '@/hooks/useAssets';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, Button, Modal } from '@/components/ui';
import { useState } from 'react';

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'soft'> = {
  'In Use': 'success',
  Stored: 'info',
  'Under Repair': 'warning',
  Broken: 'danger',
  Lost: 'soft',
  Disposed: 'soft',
};

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: asset, isLoading, isError } = useAsset(id ? Number(id) : undefined);
  const deleteAsset = useDeleteAsset();
  const [showDelete, setShowDelete] = useState(false);

  const canModify =
    user &&
    (user.role === 'admin' ||
      user.role === 'asset_manager' ||
      (asset?.ownership_type === 'personal' && asset?.owner_user_id === user.id));

  const handleDelete = async () => {
    await deleteAsset.mutateAsync(Number(id));
    navigate('/assets');
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatDate = (date: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400 dark:text-secondary-500">Loading asset…</p>
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-gray-500 dark:text-gray-400">Asset not found</p>
        <Link to="/assets">
          <Button variant="ghost">Back to Inventory</Button>
        </Link>
      </div>
    );
  }

  const fields: { label: string; value: React.ReactNode }[] = [
    { label: 'Item Name', value: asset.item_name_snapshot },
    { label: 'Category', value: asset.category || '—' },
    { label: 'Specification', value: asset.specification || '—' },
    {
      label: 'Quantity',
      value: <span className="tabular-nums">{asset.quantity}</span>,
    },
    {
      label: 'Price',
      value: <span className="tabular-nums">{formatCurrency(asset.price)}</span>,
    },
    {
      label: 'Status',
      value: (
        <Badge variant={STATUS_VARIANT[asset.status] ?? 'soft'}>{asset.status}</Badge>
      ),
    },
    {
      label: 'Ownership',
      value: asset.ownership_type === 'personal' ? 'Personal' : 'Team',
    },
    { label: 'Owner', value: asset.owner_name ?? 'Team' },
    { label: 'Receiver', value: asset.receiver_user_name || '—' },
    { label: 'Registration Date', value: formatDate(asset.registration_date) },
    { label: 'Notes', value: asset.notes || '—' },
    { label: 'Created', value: formatDate(asset.created_at) },
    { label: 'Last Updated', value: formatDate(asset.updated_at) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/assets"
          className="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-secondary-900 dark:text-gray-400 dark:hover:text-secondary-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Inventory
        </Link>
      </div>

      <Card>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-card-title font-medium text-secondary-900 dark:text-secondary-50 sm:text-hero">
              {asset.item_name_snapshot as string}
            </h1>
            <p className="mt-0.5 text-body text-gray-500 dark:text-gray-400">
              Asset #{asset.id as number}
            </p>
          </div>
          {canModify && (
            <div className="flex items-center gap-2">
              <Link to={`/assets/${asset.id}/edit`}>
                <Button size="sm">Edit</Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {field.label}
              </dt>
              <dd className="mt-1 text-sm text-secondary-900 dark:text-secondary-100">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Asset">
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete{' '}
          <span className="font-medium text-secondary-900 dark:text-secondary-50">
            {asset.item_name_snapshot}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDelete(false)}>
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
