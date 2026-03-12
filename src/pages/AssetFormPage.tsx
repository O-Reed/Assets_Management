import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAsset, useCreateAsset, useUpdateAsset } from '@/hooks/useAssets';
import { useItems } from '@/hooks/useItems';
import { useUsers } from '@/hooks/useUsers';
import { assetSchema, type AssetValues } from '@/lib/schemas';
import { STATUS_OPTIONS, OWNERSHIP_TYPES } from '@/lib/constants';
import { Card, Button, Input, Select, Textarea, DatePicker } from '@/components/ui';

export default function AssetFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: asset, isLoading: assetLoading } = useAsset(isEdit ? Number(id) : undefined);
  const { data: items } = useItems();
  const { data: users } = useUsers();
  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AssetValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      item_master_id: 0,
      category: '',
      specification: '',
      quantity: 1,
      price: 0,
      status: 'In Use',
      ownership_type: 'team',
      owner_user_id: null,
      receiver_user_name: '',
      registration_date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  useEffect(() => {
    if (asset && isEdit) {
      reset({
        item_master_id: asset.item_master_id,
        category: asset.category ?? '',
        specification: asset.specification ?? '',
        quantity: asset.quantity,
        price: asset.price,
        status: asset.status,
        ownership_type: asset.ownership_type,
        owner_user_id: asset.owner_user_id,
        receiver_user_name: asset.receiver_user_name ?? '',
        registration_date: asset.registration_date ?? '',
        notes: asset.notes ?? '',
      });
    }
  }, [asset, isEdit, reset]);

  const ownershipType = watch('ownership_type');

  useEffect(() => {
    if (ownershipType === 'team') {
      setValue('owner_user_id', null);
    }
  }, [ownershipType, setValue]);

  const onSubmit = async (data: AssetValues) => {
    if (isEdit) {
      await updateAsset.mutateAsync({ id: Number(id), data });
    } else {
      await createAsset.mutateAsync(data);
    }
    navigate('/assets');
  };

  const activeItems = items?.filter((item) => item.is_active) ?? [];
  const itemOptions = activeItems.map((item) => ({ value: item.id, label: item.name }));

  const activeUsers = users?.filter((u) => u.is_active) ?? [];
  const userOptions = activeUsers.map((u) => ({ value: u.id, label: u.name }));

  const statusOptions = STATUS_OPTIONS.map((s) => ({ value: s, label: s }));
  const ownershipOptions = OWNERSHIP_TYPES.map((t) => ({
    value: t,
    label: t === 'personal' ? 'Personal' : 'Team',
  }));

  if (isEdit && assetLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400 dark:text-secondary-500">Loading asset…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-hero font-medium text-secondary-900 dark:text-secondary-50">
            {isEdit ? 'Edit Asset' : 'Add Asset'}
          </h1>
          <p className="mt-1 text-body text-gray-500 dark:text-gray-400">
            {isEdit ? 'Update the asset details below' : 'Fill in the details to register a new asset'}
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={() => navigate('/assets')}>
          Close
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <Controller
              name="item_master_id"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Select
                  {...field}
                  label="Item Name"
                  options={itemOptions}
                  placeholder="Select an item"
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={errors.item_master_id?.message}
                />
              )}
            />

            <Input
              label="Category"
              placeholder="e.g. Electronics, Furniture"
              {...register('category')}
              error={errors.category?.message}
            />

            <div className="md:col-span-2">
              <Input
                label="Specification"
                placeholder="Model, brand, size, or technical details"
                {...register('specification')}
                error={errors.specification?.message}
              />
            </div>

            <Input
              label="Quantity"
              type="number"
              min={1}
              {...register('quantity', { valueAsNumber: true })}
              error={errors.quantity?.message}
            />

            <Input
              label="Price"
              type="number"
              min={0}
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
            />

            <Select
              label="Status"
              options={statusOptions}
              {...register('status')}
              error={errors.status?.message}
            />

            <Select
              label="Ownership Type"
              options={ownershipOptions}
              {...register('ownership_type')}
              error={errors.ownership_type?.message}
            />

            {ownershipType === 'personal' && (
              <Controller
                name="owner_user_id"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    label="Owner"
                    options={userOptions}
                    placeholder="Select owner"
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                    error={errors.owner_user_id?.message}
                  />
                )}
              />
            )}

            <Input
              label="Receiver"
              placeholder="Person who received the asset"
              {...register('receiver_user_name')}
              error={errors.receiver_user_name?.message}
            />

            <Controller
              name="registration_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Registration Date"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.registration_date?.message}
                />
              )}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Notes"
                placeholder="Additional information…"
                rows={3}
                {...register('notes')}
                error={errors.notes?.message}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-150 pt-5 dark:border-secondary-700">
            <Button type="button" variant="ghost" onClick={() => navigate('/assets')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? 'Saving…'
                  : 'Creating…'
                : isEdit
                  ? 'Save Changes'
                  : 'Create Asset'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
