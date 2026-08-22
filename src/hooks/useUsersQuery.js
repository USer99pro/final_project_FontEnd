/**
 * Users Domain Hooks (JavaScript / JSX App)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { usersKeys, authKeys, analyticsKeys } from '../lib/queryKeys';

// ==========================================
// Colocated Query Functions
// ==========================================

async function fetchCurrentUser() {
  const { data } = await api.get('/api/auth/me');
  return data.user || data;
}

async function fetchUsers(params) {
  const { data } = await api.get('/api/admin/users', { params }).catch(() =>
    api.get('/api/users', { params })
  );
  return {
    users: data.users || data || [],
    total: data.total ?? data.users?.length ?? 0,
    page: data.page,
    totalPages: data.totalPages,
  };
}

async function fetchUserById(id) {
  const { data } = await api.get(`/api/users/${id}`);
  return data.user || data;
}

// ==========================================
// Query Hooks
// ==========================================

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}

export function useUsersList(params) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => fetchUsers(params),
    placeholderData: (prev) => prev,
  });
}

export function useUserDetail(id) {
  return useQuery({
    queryKey: usersKeys.detail(id || ''),
    queryFn: () => fetchUserById(id),
    enabled: Boolean(id),
  });
}

// ==========================================
// Mutation Hooks
// ==========================================

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch('/api/me/profile', payload).catch(() =>
        api.patch(`/api/users/${payload._id}`, payload)
      );
      return data.user || data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.currentUser(), updatedUser);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
}

export function useToggleUserActive(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isActive) => {
      const endpoint = isActive ? `/api/admin/users/${id}/activate` : `/api/admin/users/${id}/suspend`;
      const { data } = await api.patch(endpoint);
      return data.user || data;
    },
    onMutate: async (newIsActive) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });
      const previousList = queryClient.getQueryData(usersKeys.list());

      if (previousList) {
        queryClient.setQueryData(usersKeys.list(), {
          ...previousList,
          users: previousList.users.map((u) =>
            u._id === id ? { ...u, isActive: newIsActive } : u
          ),
        });
      }

      return { previousList };
    },
    onError: (_err, _newIsActive, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(usersKeys.list(), context.previousList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/users/${id}`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });
      const previousList = queryClient.getQueryData(usersKeys.list());

      if (previousList) {
        queryClient.setQueryData(usersKeys.list(), {
          ...previousList,
          users: previousList.users.filter((u) => u._id !== deletedId),
          total: Math.max(0, (previousList.total ?? 1) - 1),
        });
      }

      return { previousList };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(usersKeys.list(), context.previousList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}
