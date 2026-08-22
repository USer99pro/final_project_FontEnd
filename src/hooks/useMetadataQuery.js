/**
 * Taxonomy & Metadata Domain Hooks (JavaScript / JSX App)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { metadataKeys, worksKeys } from '../lib/queryKeys';

// ==========================================
// Colocated Query Functions
// ==========================================

async function fetchCategories() {
  const { data } = await api
    .get('/api/public/categories')
    .catch(() => api.get('/api/categories'));
  return data.categories || data || [];
}

async function fetchTags() {
  const { data } = await api
    .get('/api/public/tags')
    .catch(() => api.get('/api/tags'));
  return data.tags || data || [];
}

async function fetchDepartments() {
  const { data } = await api
    .get('/api/departments')
    .catch(() => api.get('/api/public/departments'));
  return data.departments || data || [];
}

// ==========================================
// Query Hooks
// ==========================================

export function useCategories() {
  return useQuery({
    queryKey: metadataKeys.categories(),
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });
}

export function useTags() {
  return useQuery({
    queryKey: metadataKeys.tags(),
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 10,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: metadataKeys.departments(),
    queryFn: fetchDepartments,
    staleTime: 1000 * 60 * 15,
  });
}

// ==========================================
// Mutation Hooks
// ==========================================

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/api/categories', payload);
      return data.category || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metadataKeys.categories() });
      queryClient.invalidateQueries({ queryKey: worksKeys.lists() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/categories/${id}`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: metadataKeys.categories() });
      const prev = queryClient.getQueryData(metadataKeys.categories());
      if (prev) {
        queryClient.setQueryData(
          metadataKeys.categories(),
          prev.filter((c) => c._id !== deletedId)
        );
      }
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(metadataKeys.categories(), ctx.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: metadataKeys.categories() });
    },
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/api/departments', payload);
      return data.department || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metadataKeys.departments() });
    },
  });
}
