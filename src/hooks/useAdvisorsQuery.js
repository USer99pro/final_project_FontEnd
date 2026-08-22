/**
 * Advisors Domain Hooks (JavaScript / JSX App)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { advisorsKeys, analyticsKeys } from '../lib/queryKeys';

// ==========================================
// Colocated Query Functions
// ==========================================

async function fetchAdvisors(params) {
  const { data } = await api.get('/api/advisors', { params: { limit: 1000, ...params } });
  return {
    advisors: data.advisors || data || [],
    total: data.total ?? data.advisors?.length ?? 0,
  };
}

async function fetchPublicAdvisors(params) {
  const { data } = await api.get('/api/public/advisors', { params: { limit: 1000, ...params } });
  return {
    advisors: data.advisors || data || [],
    total: data.total ?? data.advisors?.length ?? 0,
  };
}

async function fetchAdvisorById(id) {
  const { data } = await api.get(`/api/advisors/${id}`);
  return data.advisor || data;
}

// ==========================================
// Query Hooks
// ==========================================

export function useAdvisors(params) {
  return useQuery({
    queryKey: advisorsKeys.list(params),
    queryFn: () => fetchAdvisors(params),
    staleTime: 1000 * 60 * 3,
  });
}

export function usePublicAdvisors(params) {
  return useQuery({
    queryKey: advisorsKeys.publicList(params),
    queryFn: () => fetchPublicAdvisors(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdvisorDetail(id) {
  return useQuery({
    queryKey: advisorsKeys.detail(id || ''),
    queryFn: () => fetchAdvisorById(id),
    enabled: Boolean(id),
  });
}

// ==========================================
// Mutation Hooks
// ==========================================

export function useCreateAdvisor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const payload = {
        ...input,
        expertise: typeof input.expertise === 'string'
          ? input.expertise.split(',').map((s) => s.trim()).filter(Boolean)
          : input.expertise,
      };
      const { data } = await api.post('/api/advisors', payload);
      return data.advisor || data;
    },
    onSuccess: (newAdvisor) => {
      queryClient.invalidateQueries({ queryKey: advisorsKeys.all });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });

      if (newAdvisor?._id) {
        queryClient.setQueryData(advisorsKeys.detail(newAdvisor._id), newAdvisor);
      }
    },
  });
}

export function useUpdateAdvisor(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const payload = {
        ...input,
        expertise: typeof input.expertise === 'string'
          ? input.expertise.split(',').map((s) => s.trim()).filter(Boolean)
          : input.expertise,
      };
      const { data } = await api.patch(`/api/advisors/${id}`, payload);
      return data.advisor || data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(advisorsKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: advisorsKeys.lists() });
    },
  });
}

/**
 * Optimistic Toggle Active Status for Advisor
 */
export function useToggleAdvisorActive(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isActive) => {
      const { data } = await api.patch(`/api/advisors/${id}`, { isActive });
      return data.advisor || data;
    },
    onMutate: async (newIsActive) => {
      await queryClient.cancelQueries({ queryKey: advisorsKeys.lists() });
      const previousList = queryClient.getQueryData(advisorsKeys.list());

      if (previousList) {
        queryClient.setQueryData(advisorsKeys.list(), {
          ...previousList,
          advisors: previousList.advisors.map((adv) =>
            adv._id === id ? { ...adv, isActive: newIsActive } : adv
          ),
        });
      }

      return { previousList };
    },
    onError: (_err, _newIsActive, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(advisorsKeys.list(), context.previousList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: advisorsKeys.lists() });
    },
  });
}

/**
 * Optimistic Delete Advisor
 */
export function useDeleteAdvisor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/advisors/${id}`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: advisorsKeys.lists() });
      const previousList = queryClient.getQueryData(advisorsKeys.list());

      if (previousList) {
        queryClient.setQueryData(advisorsKeys.list(), {
          ...previousList,
          advisors: previousList.advisors.filter((adv) => adv._id !== deletedId),
          total: Math.max(0, (previousList.total ?? 1) - 1),
        });
      }

      return { previousList };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(advisorsKeys.list(), context.previousList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: advisorsKeys.all });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}
