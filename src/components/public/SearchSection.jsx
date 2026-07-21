/**
 * SearchSection Component
 * - Large search bar with rounded-xl and shadow-lg
 * - Supports searching by: research title, researcher, category, and keyword
 * - Blue search button
 */
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { forwardRef } from 'react';

const SearchSection = forwardRef(function SearchSection({ filters, onChange, onSearch }, ref) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleInputChange = (value) => {
    onChange({ ...filters, q: value });
  };

  return (
    <section ref={ref} className="py-12 md:py-16 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">
            ค้นหาผลงานวิจัย
          </h2>
          <p className="text-gray-500">
            ค้นหาได้ทั้งประเภท ชื่อผู้วิจัย ชื่องานวิจัย และคำสำคัญ (Keyword)
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="flex items-center bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden transition-shadow duration-300 focus-within:shadow-xl focus-within:border-blue-300">
            <div className="pl-5 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={filters.q || ''}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="ค้นหาประเภท ชื่อผู้วิจัย ชื่องานวิจัย หรือ keyword..."
              className="flex-1 px-4 py-4 md:py-5 text-base md:text-lg outline-none bg-transparent text-[#0F172A] placeholder:text-gray-400"
              aria-label="Search research projects"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 md:px-10 py-4 md:py-5 font-semibold text-base md:text-lg transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              ค้นหา
            </motion.button>
          </div>
        </motion.form>

      </div>
    </section>
  );
});

export default SearchSection;
