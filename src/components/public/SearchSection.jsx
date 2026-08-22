/**
 * SearchSection — Academic Horizon design
 * Multi-field search with elevation-level-1, 56px input height
 */
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { forwardRef } from 'react';

const SearchSection = forwardRef(function SearchSection({ filters, onChange, onSearch, majors = [], years = [] }, ref) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section ref={ref} className="px-gutter-mobile md:px-gutter-desktop bg-surface -mt-8 relative z-10 py-12">
      <div className="max-w-4xl mx-auto bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-surface-border shadow-sm">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main search */}
            <div className="md:col-span-4">
              <label className="block text-label-sm font-label-sm text-text-secondary mb-2">
                ค้นหาหัวข้อ
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline pointer-events-none" />
                <input
                  type="text"
                  value={filters.q || ''}
                  onChange={(e) => updateFilter('q', e.target.value)}
                  placeholder="พิมพ์ชื่อเรื่อง หรือคำสำคัญ..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-border bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all h-[56px] text-body-md font-body-md text-text-primary placeholder:text-text-secondary"
                  aria-label="ค้นหาหัวข้อ"
                />
              </div>
            </div>

            {/* Student name */}
            <div className="md:col-span-1">
              <label className="block text-label-sm font-label-sm text-text-secondary mb-2">
                ชื่อนักศึกษา
              </label>
              <input
                type="text"
                value={filters.studentName || ''}
                onChange={(e) => updateFilter('studentName', e.target.value)}
                placeholder="ชื่อ-สกุล"
                className="w-full px-4 py-2 rounded-lg border border-surface-border bg-surface focus:ring-2 focus:ring-primary outline-none text-body-md font-body-md text-text-primary placeholder:text-text-secondary"
              />
            </div>

            {/* Major */}
            <div className="md:col-span-1">
              <label className="block text-label-sm font-label-sm text-text-secondary mb-2">
                สาขาวิชา
              </label>
              {majors.length > 0 ? (
                <select
                  value={filters.major || ''}
                  onChange={(e) => updateFilter('major', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-surface-border bg-surface focus:ring-2 focus:ring-primary outline-none text-body-md font-body-md text-text-primary"
                >
                  <option value="">ทั้งหมด</option>
                  {majors.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={filters.major || ''}
                  onChange={(e) => updateFilter('major', e.target.value)}
                  placeholder="ทั้งหมด"
                  className="w-full px-4 py-2 rounded-lg border border-surface-border bg-surface focus:ring-2 focus:ring-primary outline-none text-body-md font-body-md text-text-primary placeholder:text-text-secondary"
                />
              )}
            </div>

            {/* Academic year */}
            <div className="md:col-span-1">
              <label className="block text-label-sm font-label-sm text-text-secondary mb-2">
                ปีการศึกษา
              </label>
              {years.length > 0 ? (
                <select
                  value={filters.academicYear || ''}
                  onChange={(e) => updateFilter('academicYear', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-surface-border bg-surface focus:ring-2 focus:ring-primary outline-none text-body-md font-body-md text-text-primary"
                >
                  <option value="">ทั้งหมด</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={filters.academicYear || ''}
                  onChange={(e) => updateFilter('academicYear', e.target.value)}
                  placeholder="ทั้งหมด"
                  className="w-full px-4 py-2 rounded-lg border border-surface-border bg-surface focus:ring-2 focus:ring-primary outline-none text-body-md font-body-md text-text-primary placeholder:text-text-secondary"
                />
              )}
            </div>

            {/* Search button */}
            <div className="md:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full bg-primary text-on-primary rounded-lg py-2 h-[42px] font-label-sm text-label-sm hover:bg-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                ค้นหา
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
});

export default SearchSection;
