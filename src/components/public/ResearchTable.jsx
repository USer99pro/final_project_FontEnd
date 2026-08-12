/**
 * ResearchTable Component
 * - Card wrapping a table of latest research
 * - Blue header background
 * - Table with hover effect
 * - Pagination
 * - Eye icon for detail button
 */
import { motion } from 'framer-motion';
import { Eye, ChevronLeft, ChevronRight, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 8;

export default function ResearchTable({ projects = [], loading = false }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(projects.length / ITEMS_PER_PAGE));

  // Paginated data
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return projects.slice(start, start + ITEMS_PER_PAGE);
  }, [projects, currentPage]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">
            ผลงานวิจัยล่าสุด
          </h2>
          <p className="text-gray-500">รายการผลงานวิจัยที่เผยแพร่ล่าสุดในระบบ</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-gradient-to-r from-[#2563EB] to-blue-700 px-6 py-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-white/80" />
            <h3 className="text-white font-semibold text-lg">รายการผลงาน</h3>
            <span className="ml-auto text-blue-100 text-sm">
              ทั้งหมด {projects.length} ผลงาน
            </span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-gray-500 text-lg">กำลังโหลดข้อมูล...</span>
            </div>
          ) : projects.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">ไม่พบผลงานวิจัย</p>
              <p className="text-gray-400 text-sm mt-1">ลองค้นหาด้วยคำค้นอื่น</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                        ลำดับ
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ชื่อผลงาน
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        นักศึกษา
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        แผนกวิชา
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        ปีการศึกษา
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                        ดูเพิ่ม
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {paginatedProjects.map((project, index) => (
                      <motion.tr
                        key={project._id}
                        className="hover:bg-blue-50/50 transition-colors duration-150"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-[#0F172A] line-clamp-2">
                            {project.title}
                          </p>
                          {/* Mobile: show student name inline */}
                          <p className="text-xs text-gray-400 mt-1 md:hidden">
                            {project.studentName}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                          {project.studentName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                          {project.major || '-'}
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {project.academicYear || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            to={`/projects/${project._id}`}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            aria-label={`ดูรายละเอียด ${project.title}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-gray-50/50">
                  <p className="text-sm text-gray-500 hidden sm:block">
                    แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, projects.length)} จาก {projects.length} รายการ
                  </p>

                  <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                    {/* Previous */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-600'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
