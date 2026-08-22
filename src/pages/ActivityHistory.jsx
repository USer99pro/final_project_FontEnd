import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { ArrowLeft, ArrowRight, History as HistoryIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ActivityHistory() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get('/api/me/activity')
      .then((res) => setActivity(res.data.activity || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(activity.length / ITEMS_PER_PAGE));
  const paginatedActivity = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return activity.slice(start, start + ITEMS_PER_PAGE);
  }, [activity, currentPage]);

  const renderStatus = (status) => {
    if (!status) return <span className="text-outline">—</span>;
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
            เผยแพร่แล้ว
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
            แบบร่าง
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pt-16">
      
      {/* ── HEADER SECTION WITH BACK ACTION ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/graduate"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-main text-on-surface-variant hover:bg-surface-accent hover:text-primary-container border border-border-subtle rounded-xl text-sm font-bold shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-fixed/40 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> กลับสู่แดชบอร์ด
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-on-background leading-tight">
            ประวัติการดำเนินงาน
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            ดูบันทึกและประวัติการเปลี่ยนแปลงทั้งหมดของผลงานวิจัยของคุณ
          </p>
        </div>
      </div>

      {/* ── TABLE CARD WRAPPER ────────────────────────────────────── */}
      <div className="bg-surface-main rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
        
        {/* Table Header Bar */}
        <div className="bg-gradient-to-r from-header-gradient-start to-header-gradient-end px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <HistoryIcon className="w-5 h-5 text-white/80" />
            <h3 className="font-semibold text-lg">ประวัติกิจกรรมการส่งผลงาน</h3>
          </div>
          <span className="text-inverse-primary text-sm font-medium bg-surface-main/10 px-3 py-1 rounded-full">
            ทั้งหมด {activity.length} รายการ
          </span>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-text-secondary text-lg">กำลังโหลดข้อมูล...</span>
          </div>
        ) : activity.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
            <Clock className="w-16 h-16 text-outline-variant" />
            <div>
              <p className="text-text-secondary text-lg font-medium">ไม่พบประวัติการดำเนินงานใดๆ</p>
              <p className="text-outline text-sm mt-1">ประวัติจะถูกสร้างโดยอัตโนมัติเมื่อมีการบันทึกหรือเปลี่ยนสถานะผลงาน</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-muted/75 border-b border-border-subtle">
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider w-16 text-center">ลำดับ</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">หัวข้อผลงานวิจัย</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center w-60">การดำเนินการ</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">หมายเหตุ</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center w-48">วัน-เวลาที่บันทึก</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {paginatedActivity.map((a, index) => {
                    const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    return (
                      <tr key={a._id} className="hover:bg-surface-muted/50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-outline text-center font-medium">{rowNumber}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-on-background line-clamp-2 leading-relaxed">
                            {a.contentId?.title || 'ผลงานวิจัย'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {renderStatus(a.fromStatus)}
                            <ArrowRight className="w-3.5 h-3.5 text-outline" />
                            {renderStatus(a.toStatus)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-text-secondary font-medium">
                            {a.note || <span className="text-outline">—</span>}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-text-secondary">
                          {new Date(a.createdAt).toLocaleString('th-TH', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle bg-surface-muted/50">
                <p className="text-sm text-text-secondary hidden sm:block">
                  แสดง {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, activity.length)} จาก {activity.length} รายการ
                </p>

                <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-border-subtle bg-surface-main text-on-surface-variant hover:bg-surface-accent disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-outline transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-outline/40 transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-inverse-surface text-on-primary shadow-md shadow-outline-variant'
                          : 'border border-border-subtle bg-surface-main text-on-surface-variant hover:bg-surface-accent'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-border-subtle bg-surface-main text-on-surface-variant hover:bg-surface-accent disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-outline transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}

