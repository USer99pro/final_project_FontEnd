/**
 * Reusable UI Components for TanStack Query Server States (JSX App)
 * - LoadingState
 * - ErrorState
 * - EmptyState
 * - BackgroundRefetchIndicator
 * - StaleDataBadge
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

// ==========================================
// 1. Loading State (Skeleton / Spinner)
// ==========================================

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
          <div key={idx} className="h-16 bg-slate-200/70 rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="h-4 bg-slate-100 rounded-md w-full" />
            <div className="h-4 bg-slate-100 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-inner">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">กำลังดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์</p>
    </div>
  );
}

// ==========================================
// 2. Error State (Error message + Retry)
// ==========================================

export function ErrorState({
  error,
  message,
  onRetry,
  className = '',
}) {
  const errorMessage =
    message ||
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'เกิดข้อผิดพลาดในการโหลดข้อมูลจากเซิร์ฟเวอร์';

  return (
    <div
      className={`rounded-2xl bg-red-50/80 border border-red-200 p-6 text-center space-y-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-base text-red-900">ไม่สามารถโหลดข้อมูลได้</h4>
        <p className="text-xs text-red-700 max-w-md mx-auto">{errorMessage}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>ลองใหม่อีกครั้ง (Retry)</span>
        </button>
      )}
    </div>
  );
}

// ==========================================
// 3. Empty State (No records found)
// ==========================================

export function EmptyState({
  title = 'ไม่พบข้อมูลในระบบ',
  description = 'ยังไม่มีข้อมูลที่จะแสดงผลในส่วนนี้ หรือไม่ตรงกับเงื่อนไขการค้นหา',
  actionText,
  onAction,
  className = '',
  icon: Icon = FolderOpen,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="font-bold text-base text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <CloudUpload className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}

// ==========================================
// 4. Background Refetching Indicator
// ==========================================

export function BackgroundRefetchIndicator({ isFetching, isLoading }) {
  if (!isFetching || isLoading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-slate-700 animate-fade-in">
      <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
      <span>กำลังอัปเดตข้อมูลล่าสุด...</span>
    </div>
  );
}

// ==========================================
// 5. Stale Data Badge
// ==========================================

export function StaleDataBadge({ isStale, isFetching }) {
  if (!isStale && !isFetching) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
        isFetching
          ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}
      title={isFetching ? 'กำลังอัปเดตข้อมูลจากเซิร์ฟเวอร์' : 'ข้อมูลอาจไม่อัปเดตล่าสุด'}
    >
      <Clock className="w-3 h-3" />
      <span>{isFetching ? 'Revalidating...' : 'Cache Stale'}</span>
    </span>
  );
}
