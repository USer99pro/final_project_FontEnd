/**
 * Works Domain Hooks (JavaScript / JSX App)
 *
 * Implements colocated query functions, custom hooks,
 * optimistic mutations, and targeted cache invalidations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { worksKeys, analyticsKeys } from '../lib/queryKeys';

// ==========================================
// Colocated Query Functions
// ==========================================

async function fetchPublicWorks(params) {
  const { data } = await api.get('/api/public/projects', { params });
  return data;
}

async function fetchWorkById(id) {
  const { data } = await api.get(`/api/contents/${id}`);
  return data.work || data;
}

async function fetchMyWorks(params) {
  const { data } = await api.get('/api/me/works', { params });
  return {
    works: data.works || [],
    total: data.total ?? data.works?.length ?? 0,
  };
}

// ==========================================
// Custom Query Hooks
// ==========================================

export function usePublicWorks(params) {
  return useQuery({
    queryKey: worksKeys.list(params),
    queryFn: () => fetchPublicWorks(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useWorkDetail(id) {
  return useQuery({
    queryKey: worksKeys.detail(id || ''),
    queryFn: () => fetchWorkById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMyWorks(params) {
  return useQuery({
    queryKey: worksKeys.myWorks(params),
    queryFn: () => fetchMyWorks(params),
    staleTime: 1000 * 60 * 1,
  });
}

// ==========================================
// Mutation Hooks with Optimistic Updates
// ==========================================

export function useCreateWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const formData = new FormData();
      Object.entries(input).forEach(([key, val]) => {
        if (key === 'pdf' && val instanceof File) {
          formData.append('pdf', val);
        } else if (Array.isArray(val)) {
          val.forEach((item) => formData.append(key, item));
        } else if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });

      const { data } = await api.post('/api/contents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.work || data;
    },
    onSuccess: (newWork) => {
      // Targeted Invalidation
      queryClient.invalidateQueries({ queryKey: worksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: worksKeys.myWorks() });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });

      // Pre-seed detail cache
      if (newWork?._id) {
        queryClient.setQueryData(worksKeys.detail(newWork._id), newWork);
      }
    },
  });
}

export function useUpdateWork(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const formData = new FormData();
      Object.entries(input).forEach(([key, val]) => {
        if (key === 'pdf' && val instanceof File) {
          formData.append('pdf', val);
        } else if (Array.isArray(val)) {
          val.forEach((item) => formData.append(key, item));
        } else if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });

      const { data } = await api.patch(`/api/contents/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.work || data;
    },
    onSuccess: (updatedWork) => {
      queryClient.setQueryData(worksKeys.detail(id), updatedWork);
      queryClient.invalidateQueries({ queryKey: worksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: worksKeys.myWorks() });
    },
  });
}

/**
 * Optimistic Delete Work
 */
export function useDeleteWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/contents/${id}`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: worksKeys.myWorks() });
      const previousMyWorks = queryClient.getQueryData(worksKeys.myWorks());

      if (previousMyWorks) {
        queryClient.setQueryData(worksKeys.myWorks(), {
          ...previousMyWorks,
          works: previousMyWorks.works.filter((w) => w._id !== deletedId),
          total: Math.max(0, (previousMyWorks.total ?? 1) - 1),
        });
      }

      return { previousMyWorks };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousMyWorks) {
        queryClient.setQueryData(worksKeys.myWorks(), context.previousMyWorks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: worksKeys.myWorks() });
      queryClient.invalidateQueries({ queryKey: worksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}

/**
 * Optimistic Work Status Toggle (draft <-> published)
 */
export function useToggleWorkStatus(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStatus) => {
      const { data } = await api.patch(`/api/contents/${id}`, { status: newStatus });
      return data.work || data;
    },
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: worksKeys.detail(id) });
      const previousDetail = queryClient.getQueryData(worksKeys.detail(id));

      if (previousDetail) {
        queryClient.setQueryData(worksKeys.detail(id), {
          ...previousDetail,
          status: newStatus,
        });
      }

      return { previousDetail };
    },
    onError: (_err, _newStatus, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(worksKeys.detail(id), context.previousDetail);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: worksKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: worksKeys.myWorks() });
      queryClient.invalidateQueries({ queryKey: worksKeys.lists() });
    },
  });
}
