/**
 * ResearchTable — Academic Horizon design
 * Clean minimalist table with accent-soft row hover
 */
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 8;

export default function ResearchTable({ projects = [], loading = false, error = null, onRetry = null }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(projects.length / ITEMS_PER_PAGE));

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return projects.slice(start, start + ITEMS_PER_PAGE);
  }, [projects, currentPage]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section className="py-12 px-gutter-mobile md:px-gutter-desktop">
      <div className="max-w-container-max mx-auto">
        <motion.div
          className="flex justify-between items-end mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-headline-md text-headline-md text-text-primary">
            งานวิจัยล่าสุด
          </h2>
          <span className="text-primary font-label-sm text-label-sm">
            ทั้งหมด {projects.length} ผลงาน
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-surface-container-lowest rounded-xl border border-surface-border overflow-x-auto shadow-sm"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-3 text-text-secondary text-body-md">กำลังโหลดข้อมูล...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="text-text-primary font-medium text-body-lg">เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์</p>
              <p className="text-text-secondary text-body-md mt-1 mb-4 max-w-md mx-auto">
                {error || 'ไม่สามารถโหลดข้อมูลได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต หรือลองใหม่อีกครั้ง'}
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-medium text-body-md hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  ลองใหม่อีกครั้ง
                </button>
              )}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-outline-variant mx-auto mb-4" />
              <p className="text-text-secondary text-body-lg">ไม่พบผลงานวิจัย</p>
              <p className="text-text-secondary text-body-md mt-1">ลองค้นหาด้วยคำค้นอื่น</p>
            </div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-border">
                    <th className="py-3 px-6 font-label-sm text-label-sm text-text-secondary">ชื่อหัวข้อ</th>
                    <th className="py-3 px-6 font-label-sm text-label-sm text-text-secondary">นักศึกษา</th>
                    <th className="py-3 px-6 font-label-sm text-label-sm text-text-secondary">สาขาวิชา</th>
                    <th className="py-3 px-6 font-label-sm text-label-sm text-text-secondary text-right">ปีการศึกษา</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md">
                  {paginatedProjects.map((project) => (
                    <tr
                      key={project._id}
                      onClick={() => navigate(`/projects/${project._id}`)}
                      className="border-b border-surface-border hover:bg-accent-soft transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6 text-primary font-medium">
                        {project.title}
                      </td>
                      <td className="py-4 px-6 text-text-secondary">
                        {project.studentName || '-'}
                      </td>
                      <td className="py-4 px-6 text-text-secondary">
                        {project.major || '-'}
                      </td>
                      <td className="py-4 px-6 text-text-secondary text-right">
                        {project.academicYear || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border bg-surface-container-low">
                  <p className="font-label-sm text-label-sm text-text-secondary hidden sm:block">
                    แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, projects.length)} จาก {projects.length} รายการ
                  </p>

                  <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-9 h-9 rounded-lg text-text-primary bg-surface-container-lowest border border-surface-border hover:bg-accent-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`flex items-center justify-center w-9 h-9 rounded-lg font-label-sm text-label-sm font-medium transition-colors cursor-pointer ${
                          currentPage === page
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-lowest text-text-primary border border-surface-border hover:bg-accent-soft'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-9 h-9 rounded-lg text-text-primary bg-surface-container-lowest border border-surface-border hover:bg-accent-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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

