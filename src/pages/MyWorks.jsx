import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Edit, Trash2, Plus, FileText, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function MyWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const load = () => {
    setLoading(true);
    api.get('/api/me/works')
      .then((res) => setWorks(res.data.works || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันที่จะลบผลงานวิจัยนี้ใช่หรือไม่? การลบไม่สามารถกู้คืนได้')) return;
    try {
      await api.delete(`/api/contents/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลบผลงาน');
    }
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(works.length / ITEMS_PER_PAGE));
  const paginatedWorks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return works.slice(start, start + ITEMS_PER_PAGE);
  }, [works, currentPage]);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            เผยแพร่แล้ว
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
            แบบร่าง
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pt-16">
      
      {/* ── HEADER SECTION ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-background leading-tight">
            ผลงานวิจัยของฉัน
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            จัดการและติดตามสถานะของผลงานวิจัยทั้งหมดที่คุณนำเสนอในระบบ
          </p>
        </div>
        <Link
          to="/graduate/works/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container hover:opacity-90 active:opacity-80 !text-white font-black text-sm rounded-xl border-2 border-primary-fixed shadow-[0_4px_14px_rgba(30,64,175,0.45)] focus:outline-none focus:ring-4 focus:ring-primary-fixed/40 transition-all duration-200 cursor-pointer opacity-100"
        >
          <Plus className="w-4.5 h-4.5 text-white shrink-0" />
          <span>เพิ่มผลงาน/โครงการใหม่</span>
        </Link>
      </div>

      {/* ── TABLE CARD WRAPPER ────────────────────────────────────── */}
      <div className="bg-surface-main rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
        
        {/* Table Header Bar */}
        <div className="bg-gradient-to-r from-primary-container to-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <FileText className="w-5 h-5 text-white/80" />
            <h3 className="font-bold text-lg">รายการผลงานทั้งหมด</h3>
          </div>
          <span className="text-inverse-primary text-sm font-semibold bg-surface-main/10 px-3 py-1 rounded-full border border-white/10">
            ทั้งหมด {works.length} รายการ
          </span>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-text-secondary text-lg">กำลังโหลดข้อมูล...</span>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
            <BookOpen className="w-16 h-16 text-outline-variant" />
            <div>
              <p className="text-text-secondary text-lg font-medium">ไม่พบผลงานวิจัยของคุณในระบบ</p>
              <p className="text-outline text-sm mt-1">เริ่มต้นโดยการคลิกปุ่ม "เพิ่มผลงานใหม่" ด้านบน</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-muted border-b border-border-subtle">
                    <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider w-16 text-center">ลำดับ</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider">ชื่อผลงานวิจัย</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider text-center w-32">ปีการศึกษา</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider text-center w-32">สถานะ</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider text-center w-32">เครื่องมือ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {paginatedWorks.map((w, index) => {
                    const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    return (
                      <tr key={w._id} className="hover:bg-insight-tint/30 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-outline text-center font-semibold">{rowNumber}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-on-background line-clamp-2 leading-relaxed">
                            {w.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 bg-surface-muted border border-border-subtle rounded-lg text-xs font-semibold text-on-surface-variant">
                            {w.academicYear || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {renderStatusBadge(w.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/graduate/works/${w._id}/edit`}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-insight-tint text-primary-container hover:bg-primary-container hover:text-white border border-primary-fixed/80 focus:outline-none focus:ring-2 focus:ring-primary-fixed transition-all duration-200 shadow-xs text-xs font-bold"
                              title="แก้ไขผลงาน"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>แก้ไข</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(w._id)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-error-container text-error hover:bg-error hover:text-white border border-error/30 focus:outline-none focus:ring-2 focus:ring-error/40 transition-all duration-200 shadow-xs text-xs font-bold cursor-pointer"
                              title="ลบผลงาน"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>ลบ</span>
                            </button>
                          </div>
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
                  แสดง {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, works.length)} จาก {works.length} รายการ
                </p>

                <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-border-subtle bg-surface-main text-on-surface-variant hover:bg-surface-accent disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-fixed/40 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-fixed/50 transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-primary-container text-on-primary shadow-md shadow-primary-container/25 border border-primary-container'
                          : 'border border-border-subtle bg-surface-main text-on-surface-variant hover:bg-surface-accent'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-border-subtle bg-surface-main text-on-surface-variant hover:bg-surface-accent disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-fixed/40 transition-all cursor-pointer"
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

