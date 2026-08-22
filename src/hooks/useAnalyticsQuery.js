/**
 * Analytics & Audit Domain Hooks (JavaScript / JSX App)
 */

import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { analyticsKeys, auditKeys } from '../lib/queryKeys';

// ==========================================
// Colocated Query Functions
// ==========================================

async function fetchDashboardStats() {
  const { data } = await api.get('/api/admin/dashboard').catch(() => ({ data: {} }));
  return data.stats || data;
}

async function fetchAuditLogs(params) {
  const { data } = await api.get('/api/admin/audit-logs', { params });
  return data.logs || [];
}

// ==========================================
// Query Hooks
// ==========================================

export function useDashboardStats() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useAuditLogs(params) {
  return useQuery({
    queryKey: auditKeys.logs(params),
    queryFn: () => fetchAuditLogs(params),
    staleTime: 1000 * 30,
  });
}
