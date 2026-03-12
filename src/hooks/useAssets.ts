import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import type { AssetValues } from '@/lib/schemas';

interface AssetFilters {
  search?: string;
  status?: string;
  ownershipType?: string;
  category?: string;
  ownerId?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export function useAssets(filters: AssetFilters = {}) {
  return useQuery({
    queryKey: ['assets', filters],
    placeholderData: (previousData) => previousData,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);
      if (filters.ownershipType) params.set('ownershipType', filters.ownershipType);
      if (filters.category) params.set('category', filters.category);
      if (filters.ownerId) params.set('ownerId', filters.ownerId);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      const res = await api.get(`/assets?${params}`);
      return res.data as { data: Record<string, unknown>[]; total: number; page: number; limit: number };
    },
  });
}

export function useAsset(id: number | undefined) {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: async () => {
      const res = await api.get(`/assets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useAssetStats() {
  return useQuery({
    queryKey: ['assetStats'],
    queryFn: async () => {
      const res = await api.get('/assets/stats');
      return res.data as {
        total: number;
        assigned: number;
        inRepair: number;
        totalValue: number;
        byStatus: { status: string; count: number }[];
        byCategory: { category: string; count: number }[];
      };
    },
  });
}

export function useCreateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: AssetValues) => {
      const res = await api.post('/assets', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assets'] });
      qc.invalidateQueries({ queryKey: ['assetStats'] });
    },
  });
}

export function useUpdateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AssetValues> }) => {
      const res = await api.patch(`/assets/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assets'] });
      qc.invalidateQueries({ queryKey: ['asset'] });
      qc.invalidateQueries({ queryKey: ['assetStats'] });
    },
  });
}

export function useDeleteAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/assets/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assets'] });
      qc.invalidateQueries({ queryKey: ['assetStats'] });
    },
  });
}
