/**
 * TanStack Query Client Configuration (JavaScript / JSX App)
 *
 * Configures global caching behavior, retry policies, and ensures
 * strict boundary between Server State (in React Query cache) and Global Client State.
 */

import { QueryClient } from '@tanstack/react-query';

function shouldRetry(failureCount, error) {
  if (failureCount >= 2) return false;

  const status = error?.response?.status;
  // Do not retry 4xx client errors (400, 401, 403, 404, 422)
  if (status && [400, 401, 403, 404, 422].includes(status)) {
    return false;
  }

  return true;
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 2 minutes by default
        staleTime: 1000 * 60 * 2,

        // Inactive cache is garbage collected after 15 minutes
        gcTime: 1000 * 60 * 15,

        // Retry failed queries with smart 4xx filtering
        retry: shouldRetry,

        // Automatically revalidate when window regains focus
        refetchOnWindowFocus: true,

        // Revalidate on component mount if data is stale
        refetchOnMount: true,

        // Auto refetch on internet reconnection
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
        onError: (error) => {
          console.error('[Mutation Error]:', error);
        },
      },
    },
  });
}

// Global Singleton QueryClient instance
export const queryClient = createQueryClient();
