/**
 * CategoryGrid Component
 * - Grid layout: 6 cols desktop, 3 cols tablet, 2 cols mobile
 * - Each card has: icon, category name, project count
 * - Hover scale + shadow animation
 * - Uses Lucide React Icons
 */
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Database,
  Cloud,
  Cpu,
  Globe,
  Briefcase,
  Palette,
  ShieldCheck,
  Wrench,
  BarChart3,
  BookOpen,
} from 'lucide-react';

// Icon map for categories - fallback to BookOpen
const ICON_MAP = {
  'เทคโนโลยีสารสนเทศ': Monitor,
  'คอมพิวเตอร์ธุรกิจ': Briefcase,
  'มัลติมีเดีย': Palette,
  'เครือข่าย': Globe,
  'โมบาย': Smartphone,
  'ฐานข้อมูล': Database,
  'คลาวด์': Cloud,
  'AI': Cpu,
  'ความปลอดภัย': ShieldCheck,
  'ซ่อมบำรุง': Wrench,
  'วิเคราะห์ข้อมูล': BarChart3,
  'default': BookOpen,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Color palette for category cards
const CARD_COLORS = [
  { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
  { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100' },
  { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
  { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },
  { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100' },
  { bg: 'bg-lime-50', text: 'text-lime-600', border: 'border-lime-100' },
  { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100' },
];

export default function CategoryGrid({ categories = [] }) {
  // Use default categories if none provided
  const displayCategories = categories.length > 0
    ? categories
    : [
        { _id: '1', name: 'เทคโนโลยีสารสนเทศ', count: 0 },
        { _id: '2', name: 'คอมพิวเตอร์ธุรกิจ', count: 0 },
        { _id: '3', name: 'มัลติมีเดีย', count: 0 },
        { _id: '4', name: 'เครือข่าย', count: 0 },
        { _id: '5', name: 'AI', count: 0 },
        { _id: '6', name: 'ฐานข้อมูล', count: 0 },
      ];

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">
            หมวดหมู่ผลงาน
          </h2>
          <p className="text-gray-500">เลือกดูผลงานวิจัยตามหมวดหมู่ที่สนใจ</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {displayCategories.map((cat, index) => {
            const Icon = ICON_MAP[cat.name] || ICON_MAP['default'];
            const color = CARD_COLORS[index % CARD_COLORS.length];

            return (
              <motion.div
                key={cat._id}
                variants={cardVariants}
                whileHover={{ scale: 1.06, boxShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.12)' }}
                className={`bg-white rounded-2xl border ${color.border} p-5 md:p-6 text-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${color.bg} mb-3`}>
                  <Icon className={`w-7 h-7 ${color.text}`} />
                </div>
                <h3 className="font-semibold text-[#0F172A] text-sm md:text-base mb-1 leading-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {(cat.count || 0).toLocaleString()} ผลงาน
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
