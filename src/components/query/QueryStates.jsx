/**
 * Reusable UI Components for TanStack Query Server States
 */
import {
  Loader2,
  AlertCircle,
  RotateCw,
  FolderOpen,
  CloudUpload,
  RefreshCw,
  Clock,
} from 'lucide-react';

export function LoadingState({
  message = 'กำลังโหลดข้อมูล...',
  variant = 'spinner',
  count = 3,
  className = '',
}) {
  if (variant === 'skeleton') {
    return (
      <div className={`space-y-4 animate-pulse ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="h-16 bg-surface-container-high/70 rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="ds-panel p-6 space-y-4">
            <div className="h-5 bg-surface-container-high rounded-md w-3/4" />
            <div className="h-4 bg-surface-container-low rounded-md w-full" />
            <div className="h-4 bg-surface-container-low rounded-md w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-insight-tint text-primary-container flex items-center justify-center mb-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary-container" />
      </div>
      <p className="text-body-emphasized text-on-surface-variant">{message}</p>
      <p className="text-caption text-outline mt-1">กำลังดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์</p>
    </div>
  );
}

export function ErrorState({ error, message, onRetry, className = '' }) {
  const errorMessage =
    message ||
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'เกิดข้อผิดพลาดในการโหลดข้อมูลจากเซิร์ฟเวอร์';

  return (
    <div className={`rounded-2xl bg-error-container/80 border border-error/30 p-6 text-center space-y-4 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-error-container text-error flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="font-display text-headline-section text-on-error-container">ไม่สามารถโหลดข้อมูลได้</h4>
        <p className="text-caption text-error max-w-md mx-auto">{errorMessage}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="ds-btn-danger text-caption">
          <RotateCw className="w-3.5 h-3.5" />
          <span>ลองใหม่อีกครั้ง (Retry)</span>
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = 'ไม่พบข้อมูลในระบบ',
  description = 'ยังไม่มีข้อมูลที่จะแสดงผลในส่วนนี้ หรือไม่ตรงกับเงื่อนไขการค้นหา',
  actionText,
  onAction,
  className = '',
  icon: Icon = FolderOpen,
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-border-subtle bg-surface-muted/50 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-surface-accent text-outline flex items-center justify-center mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="font-display text-headline-section text-on-background">{title}</h4>
      <p className="text-caption text-text-secondary max-w-md mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <button type="button" onClick={onAction} className="ds-btn-primary">
          <CloudUpload className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}

export function BackgroundRefetchIndicator({ isFetching, isLoading }) {
  if (!isFetching || isLoading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-inverse-surface/90 text-on-primary text-caption font-semibold shadow-elevation-hover backdrop-blur-md border border-outline-variant">
      <RefreshCw className="w-3.5 h-3.5 text-inverse-primary animate-spin" />
      <span>กำลังอัปเดตข้อมูลล่าสุด...</span>
    </div>
  );
}

export function StaleDataBadge({ isStale, isFetching }) {
  if (!isStale && !isFetching) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-semibold transition-all ${
        isFetching
          ? 'bg-insight-tint text-primary border border-primary-fixed animate-pulse'
          : 'bg-tertiary-fixed/40 text-tertiary border border-tertiary-fixed-dim'
      }`}
      title={isFetching ? 'กำลังอัปเดตข้อมูลจากเซิร์ฟเวอร์' : 'ข้อมูลอาจไม่อัปเดตล่าสุด'}
    >
      <Clock className="w-3 h-3" />
      <span>{isFetching ? 'Revalidating...' : 'Cache Stale'}</span>
    </span>
  );
}
