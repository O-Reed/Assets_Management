import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '@/hooks/useItems';
import { itemMasterSchema, type ItemMasterValues } from '@/lib/schemas';
import { Badge, Card, CardHeader, Button, Input, Modal, PaginationControls } from '@/components/ui';

export default function ItemMasterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: items, isLoading } = useItems();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'asset_manager') navigate('/');
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemMasterValues>({
    resolver: zodResolver(itemMasterSchema),
  });

  const onAdd = async (data: ItemMasterValues) => {
    await createItem.mutateAsync(data.name);
    reset();
    setShowAdd(false);
  };

  const startEdit = (item: { id: number; name: string }) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const saveEdit = async (id: number) => {
    if (!editName.trim()) return;
    await updateItem.mutateAsync({ id, data: { name: editName.trim() } });
    setEditingId(null);
  };

  const toggleActive = (id: number, currentActive: number) => {
    updateItem.mutate({ id, data: { is_active: !currentActive } });
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    await deleteItem.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const totalItems = items?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagedItems = useMemo(() => {
    if (!items) return [];
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  if (!user || (user.role !== 'admin' && user.role !== 'asset_manager')) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-hero font-medium text-secondary-900 dark:text-secondary-50">
            Item Master
          </h1>
          <p className="mt-1 text-body text-gray-500 dark:text-gray-400">
            Manage predefined item names for asset registration
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>Add Item</Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="border-b border-gray-150 p-5 dark:border-secondary-700 md:p-6">
          <CardHeader
            title="Items"
            action={
              <Badge variant="soft">
                {totalItems} registered
              </Badge>
            }
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-150 bg-gray-50/50 dark:border-secondary-700 dark:bg-secondary-700/20">
                {['Item Name', 'Availability', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-secondary-400 md:px-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-secondary-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-sm text-gray-400 dark:text-secondary-500 md:px-6"
                  >
                    Loading items…
                  </td>
                </tr>
              ) : !pagedItems.length ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-sm text-gray-400 dark:text-secondary-500 md:px-6"
                  >
                    No items found
                  </td>
                </tr>
              ) : (
                pagedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="animate-reveal-soft align-middle transition-colors hover:bg-gray-50/80 dark:hover:bg-secondary-800/40"
                  >
                    <td className="px-4 py-4 md:px-6">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(item.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="max-w-xs"
                          />
                          <Button size="sm" onClick={() => saveEdit(item.id)}>
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="min-w-0">
                          <p
                            className={`truncate font-medium ${
                              item.is_active
                                ? 'text-secondary-900 dark:text-secondary-50'
                                : 'text-gray-400 line-through dark:text-secondary-500'
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="mt-1 text-label text-gray-500 dark:text-secondary-400">
                            Item master entry
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={!!item.is_active}
                          onClick={() => toggleActive(item.id, item.is_active)}
                          className={`
                            relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-pill
                            transition-all duration-base hover:scale-[1.03]
                            ${item.is_active ? 'bg-primary-300 dark:bg-primary-400' : 'bg-gray-300 dark:bg-secondary-600'}
                          `}
                        >
                          <span
                            className={`
                              pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-base
                              ${item.is_active ? 'translate-x-6' : 'translate-x-1'}
                            `}
                          />
                        </button>
                        <Badge variant={item.is_active ? 'accent' : 'outline'}>
                          {item.is_active ? 'Active' : 'Archived'}
                        </Badge>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 md:px-6">
                      {editingId !== item.id && (
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" size="sm" onClick={() => startEdit(item)}>
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
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
        <PaginationControls
          page={page}
          pageSize={pageSize}
          total={totalItems}
          onPageChange={setPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(1);
          }}
        />
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Item">
        <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
          <Input
            label="Item Name"
            placeholder="e.g. Camera, Monitor, Router"
            {...register('name')}
            error={errors.name?.message}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding…' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Item"
      >
        <div className="space-y-4">
          <p className="text-body text-gray-600 dark:text-secondary-300">
            Remove <span className="font-medium text-secondary-900 dark:text-secondary-50">{deleteTarget?.name}</span> from the active item list?
            This keeps the record but archives it for future use.
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={deleteItem.isPending}
              onClick={onDelete}
            >
              {deleteItem.isPending ? 'Deleting...' : 'Delete Item'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
