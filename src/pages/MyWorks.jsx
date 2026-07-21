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
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] leading-tight">
            ผลงานวิจัยของฉัน
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            จัดการและติดตามสถานะของผลงานวิจัยทั้งหมดที่คุณนำเสนอในระบบ
          </p>
        </div>
        <Link
          to="/graduate/works/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          เพิ่มผลงานใหม่
        </Link>
      </div>

      {/* ── TABLE CARD WRAPPER ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        
        {/* Table Header Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <FileText className="w-5 h-5 text-white/80" />
            <h3 className="font-semibold text-lg">รายการผลงานทั้งหมด</h3>
          </div>
          <span className="text-blue-100 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
            ทั้งหมด {works.length} รายการ
          </span>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-gray-500 text-lg">กำลังโหลดข้อมูล...</span>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
            <BookOpen className="w-16 h-16 text-gray-300" />
            <div>
              <p className="text-gray-500 text-lg font-medium">ไม่พบผลงานวิจัยของคุณในระบบ</p>
              <p className="text-gray-400 text-sm mt-1">เริ่มต้นโดยการคลิกปุ่ม "เพิ่มผลงานใหม่" ด้านบน</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/75 border-b border-[#E2E8F0]">
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 text-center">ลำดับ</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ชื่อผลงานวิจัย</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-32">ปีการศึกษา</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-32">สถานะ</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-32">เครื่องมือ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {paginatedWorks.map((w, index) => {
                    const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    return (
                      <tr key={w._id} className="hover:bg-blue-50/30 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-400 text-center font-medium">{rowNumber}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-800 line-clamp-2 leading-relaxed">
                            {w.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600">
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
                              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
                              title="แก้ไขผลงาน"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(w._id)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
                              title="ลบผลงาน"
                            >
                              <Trash2 className="w-4 h-4" />
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
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-gray-50/50">
                <p className="text-sm text-gray-500 hidden sm:block">
                  แสดง {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, works.length)} จาก {works.length} รายการ
                </p>

                <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#E2E8F0] bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                          : 'border border-[#E2E8F0] bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#E2E8F0] bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
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

