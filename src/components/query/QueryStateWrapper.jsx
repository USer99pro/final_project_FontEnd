/**
 * Compound Query State Wrapper (JSX App)
 *
 * Automatically handles:
 * 1. Initial Loading (Skeleton/Spinner)
 * 2. Query Errors (Error box + Retry button)
 * 3. Empty Results (Empty state UI)
 * 4. Background Revalidation (Subtle indicator)
 * 5. Success render with data
 */

import {
  LoadingState,
  ErrorState,
  EmptyState,
  BackgroundRefetchIndicator,
} from './QueryStates';

export function QueryStateWrapper({
  query,
  children,
  isEmpty = (data) => Array.isArray(data) && data.length === 0,
  emptyTitle,
  emptyDescription,
  emptyActionText,
  onEmptyAction,
  loadingVariant = 'spinner',
  loadingMessage,
  loadingCount,
  showBackgroundIndicator = true,
}) {
  const { data, isLoading, isError, error, refetch, isFetching } = query;

  // 1. Initial Loading State
  if (isLoading) {
    return (
      <LoadingState
        variant={loadingVariant}
        message={loadingMessage}
        count={loadingCount}
      />
    );
  }

  // 2. Error State
  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  // 3. Empty State
  if (data !== undefined && isEmpty(data)) {
    return (
      <>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionText={emptyActionText}
          onAction={onEmptyAction}
        />
        {showBackgroundIndicator && (
          <BackgroundRefetchIndicator isFetching={isFetching} isLoading={isLoading} />
        )}
      </>
    );
  }

  // 4. Success State
  if (data !== undefined) {
    return (
      <>
        {typeof children === 'function' ? children(data) : children}
        {showBackgroundIndicator && (
          <BackgroundRefetchIndicator isFetching={isFetching} isLoading={isLoading} />
        )}
      </>
    );
  }

  return null;
}
